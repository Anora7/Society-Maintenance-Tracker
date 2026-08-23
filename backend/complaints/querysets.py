from datetime import timedelta

from django.conf import settings
from django.db.models import BooleanField, Case, Q, Value, When
from django.utils import timezone


def with_overdue(queryset):
    cutoff = timezone.now() - timedelta(days=settings.OVERDUE_THRESHOLD_DAYS)
    return queryset.annotate(
        overdue=Case(
            When(~Q(status='Resolved'), created_at__lt=cutoff, then=Value(True)),
            default=Value(False),
            output_field=BooleanField(),
        )
    )