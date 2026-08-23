from rest_framework import serializers

from .models import Complaint, ComplaintStatusHistory


class ComplaintStatusHistorySerializer(serializers.ModelSerializer):
    changed_by = serializers.StringRelatedField()

    class Meta:
        model = ComplaintStatusHistory
        fields = ('id', 'status', 'note', 'changed_by', 'changed_at')


class ComplaintSerializer(serializers.ModelSerializer):
    resident = serializers.StringRelatedField(read_only=True)
    overdue = serializers.BooleanField(read_only=True)
    history = ComplaintStatusHistorySerializer(many=True, read_only=True)

    class Meta:
        model = Complaint
        fields = (
            'id', 'resident', 'category', 'description', 'photo', 'priority',
            'status', 'created_at', 'resolved_at', 'overdue', 'history',
        )
        read_only_fields = ('resident', 'status', 'created_at', 'resolved_at', 'overdue', 'history')

    def create(self, validated_data):
        complaint = Complaint.objects.create(
            resident=self.context['request'].user,
            **validated_data,
        )
        ComplaintStatusHistory.objects.create(
            complaint=complaint,
            status='Open',
            changed_by=self.context['request'].user,
        )
        return complaint


class ComplaintStatusUpdateSerializer(serializers.Serializer):
    status = serializers.ChoiceField(choices=Complaint.STATUS_CHOICES)
    priority = serializers.ChoiceField(choices=Complaint.PRIORITY_CHOICES, required=False)
    note = serializers.CharField(required=False, allow_blank=True)