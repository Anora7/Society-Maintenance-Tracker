from rest_framework import generics

from accounts.permissions import IsAdminOrReadOnly
from django.contrib.auth import get_user_model
from notifications.email import send_important_notice_email

from .models import Notice
from .serializers import NoticeSerializer


class NoticeListCreateView(generics.ListCreateAPIView):
    permission_classes = (IsAdminOrReadOnly,)
    serializer_class = NoticeSerializer

    def get_queryset(self):
        return Notice.objects.select_related('posted_by').order_by('-is_important', '-created_at')

    def perform_create(self, serializer):
        notice = serializer.save()
        if notice.is_important:
            User = get_user_model()
            send_important_notice_email(notice, User.objects.filter(role='resident'))