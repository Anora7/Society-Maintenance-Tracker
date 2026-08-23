from django.urls import path

from .views import NoticeListCreateView


urlpatterns = [
    path('', NoticeListCreateView.as_view(), name='notice-list-create'),
]