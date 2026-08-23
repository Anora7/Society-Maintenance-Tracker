from django_filters import rest_framework as filters

from .models import Complaint


class ComplaintFilter(filters.FilterSet):
    date_from = filters.DateFilter(field_name='created_at', lookup_expr='date__gte')
    date_to = filters.DateFilter(field_name='created_at', lookup_expr='date__lte')

    class Meta:
        model = Complaint
        fields = ('category', 'status', 'date_from', 'date_to')