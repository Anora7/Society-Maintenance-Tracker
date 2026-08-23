from django.urls import path

from .views import (
    ComplaintDetailView,
    ComplaintListCreateView,
    ComplaintStatusUpdateView,
    DashboardView,
)


urlpatterns = [
    path('', ComplaintListCreateView.as_view(), name='complaint-list-create'),
    path('<int:pk>/', ComplaintDetailView.as_view(), name='complaint-detail'),
    path('<int:pk>/status/', ComplaintStatusUpdateView.as_view(), name='complaint-status-update'),
    path('dashboard/', DashboardView.as_view(), name='dashboard'),
]