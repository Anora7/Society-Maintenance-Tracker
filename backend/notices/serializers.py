from rest_framework import serializers

from .models import Notice


class NoticeSerializer(serializers.ModelSerializer):
    posted_by = serializers.StringRelatedField(read_only=True)

    class Meta:
        model = Notice
        fields = ('id', 'title', 'body', 'is_important', 'posted_by', 'created_at')
        read_only_fields = ('id', 'posted_by', 'created_at')

    def create(self, validated_data):
        return Notice.objects.create(posted_by=self.context['request'].user, **validated_data)