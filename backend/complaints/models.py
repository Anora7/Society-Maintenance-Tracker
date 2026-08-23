from django.conf import settings
from django.db import models


class Complaint(models.Model):
	CATEGORY_CHOICES = [
		('Plumbing', 'Plumbing'),
		('Electrical', 'Electrical'),
		('Cleanliness', 'Cleanliness'),
		('Security', 'Security'),
		('Other', 'Other'),
	]
	PRIORITY_CHOICES = [
		('Low', 'Low'),
		('Medium', 'Medium'),
		('High', 'High'),
	]
	STATUS_CHOICES = [
		('Open', 'Open'),
		('In Progress', 'In Progress'),
		('Resolved', 'Resolved'),
	]

	resident = models.ForeignKey(
		settings.AUTH_USER_MODEL,
		on_delete=models.CASCADE,
		related_name='complaints',
	)
	category = models.CharField(max_length=50, choices=CATEGORY_CHOICES)
	description = models.TextField()
	photo = models.ImageField(upload_to='complaint_photos/', blank=True, null=True)
	priority = models.CharField(max_length=10, choices=PRIORITY_CHOICES, default='Medium')
	status = models.CharField(max_length=20, choices=STATUS_CHOICES, default='Open')
	created_at = models.DateTimeField(auto_now_add=True)
	resolved_at = models.DateTimeField(null=True, blank=True)


class ComplaintStatusHistory(models.Model):
	complaint = models.ForeignKey(Complaint, on_delete=models.CASCADE, related_name='history')
	status = models.CharField(max_length=20)
	note = models.TextField(blank=True)
	changed_by = models.ForeignKey(settings.AUTH_USER_MODEL, on_delete=models.SET_NULL, null=True)
	changed_at = models.DateTimeField(auto_now_add=True)
