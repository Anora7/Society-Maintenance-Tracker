from django.db import transaction
from django.db.models import Count
from django.utils import timezone
from rest_framework import generics, permissions, status
from rest_framework.response import Response
from rest_framework.views import APIView
from notifications.email import send_status_change_email
from django_filters.rest_framework import DjangoFilterBackend

from accounts.permissions import IsAdmin

from .filters import ComplaintFilter
from .models import Complaint, ComplaintStatusHistory
from .querysets import with_overdue
from .serializers import ComplaintSerializer, ComplaintStatusUpdateSerializer


class ComplaintListCreateView(generics.ListCreateAPIView):
    permission_classes = (permissions.IsAuthenticated,)
    serializer_class = ComplaintSerializer
    filter_backends = (DjangoFilterBackend,)
    filterset_class = ComplaintFilter

    def get_queryset(self):
        queryset = with_overdue(Complaint.objects.select_related('resident').prefetch_related('history'))
        if self.request.user.role != 'admin':
            return queryset.filter(resident=self.request.user).order_by('-created_at')
        return queryset.order_by('-overdue', '-created_at')


class ComplaintDetailView(generics.RetrieveAPIView):
    permission_classes = (permissions.IsAuthenticated,)
    serializer_class = ComplaintSerializer

    def get_queryset(self):
        queryset = with_overdue(Complaint.objects.select_related('resident').prefetch_related('history'))
        if self.request.user.role != 'admin':
            queryset = queryset.filter(resident=self.request.user)
        return queryset


class ComplaintStatusUpdateView(APIView):
    permission_classes = (IsAdmin,)

    def patch(self, request, pk):
        serializer = ComplaintStatusUpdateSerializer(data=request.data)
        serializer.is_valid(raise_exception=True)
        try:
            complaint = Complaint.objects.get(pk=pk)
        except Complaint.DoesNotExist:
            return Response({'detail': 'Complaint not found.'}, status=status.HTTP_404_NOT_FOUND)

        validated_data = serializer.validated_data
        old_status = complaint.status
        with transaction.atomic():
            complaint.status = validated_data['status']
            if 'priority' in validated_data:
                complaint.priority = validated_data['priority']
            complaint.resolved_at = timezone.now() if complaint.status == 'Resolved' else None
            complaint.save(update_fields=('status', 'priority', 'resolved_at'))
            ComplaintStatusHistory.objects.create(
                complaint=complaint,
                status=complaint.status,
                note=validated_data.get('note', ''),
                changed_by=request.user,
            )

        if old_status != complaint.status:
            send_status_change_email(complaint, old_status, complaint.status)

        response_serializer = ComplaintSerializer(
            complaint,
            context={'request': request},
        )
        return Response(response_serializer.data)


class DashboardView(APIView):
    permission_classes = (IsAdmin,)

    def get(self, request):
        complaints = with_overdue(Complaint.objects.all())
        return Response({
            'by_status': list(complaints.values('status').annotate(count=Count('id')).order_by('status')),
            'by_category': list(complaints.values('category').annotate(count=Count('id')).order_by('category')),
            'overdue_count': complaints.filter(overdue=True).count(),
        })