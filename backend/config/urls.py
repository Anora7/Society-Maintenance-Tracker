from django.contrib import admin
from django.urls import include, path

from complaints.views import DashboardView

urlpatterns = [
    path('admin/', admin.site.urls),
    path('api/auth/', include('accounts.urls')),
    path('api/complaints/', include('complaints.urls')),
    path('api/notices/', include('notices.urls')),
    path('api/dashboard/', DashboardView.as_view(), name='dashboard'),
]