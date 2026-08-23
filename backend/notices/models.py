from django.conf import settings
from django.db import models


class Notice(models.Model):
	title = models.CharField(max_length=200)
	body = models.TextField()
	is_important = models.BooleanField(default=False)
	posted_by = models.ForeignKey(settings.AUTH_USER_MODEL, on_delete=models.SET_NULL, null=True)
	created_at = models.DateTimeField(auto_now_add=True)
