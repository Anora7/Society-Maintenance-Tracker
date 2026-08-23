from django.contrib import admin
from django.contrib.auth.admin import UserAdmin as BaseUserAdmin

from .models import User


class UserAdmin(BaseUserAdmin):
    list_display = ("username", "email", "role", "flat_number", "is_staff")
    list_filter = ("role", "is_staff", "is_superuser")
    fieldsets = BaseUserAdmin.fieldsets + (
        ("Society Info", {"fields": ("role", "flat_number")}),
    )


admin.site.register(User, UserAdmin)