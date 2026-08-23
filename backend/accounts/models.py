from django.contrib.auth.models import AbstractUser
from django.db import models


class User(AbstractUser):
	ROLE_CHOICES = [
		('resident', 'Resident'),
		('admin', 'Admin'),
	]

	role = models.CharField(max_length=10, choices=ROLE_CHOICES, default='resident')
	flat_number = models.CharField(max_length=20, blank=True)
