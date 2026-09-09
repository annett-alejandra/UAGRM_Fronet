import uuid
from django.db import models
from django.conf import settings
from django.utils import timezone


class AuditLog(models.Model):
    ACTION_CHOICES = (
        ('CREATE', 'Create'),
        ('UPDATE', 'Update'),
        ('DELETE', 'Delete'),
        ('LOGIN', 'Login'),
        ('VIEW', 'View'),
        ('OTHER', 'Other'),
    )

    id = models.UUIDField(primary_key=True, default=uuid.uuid4, editable=False)
    actor_id = models.UUIDField(null=True, blank=True, help_text="User ID performing the action")
    ip_address = models.GenericIPAddressField(null=True, blank=True)
    user_agent = models.CharField(max_length=512, null=True, blank=True)
    
    module_name = models.CharField(max_length=100, db_index=True)
    action = models.CharField(max_length=20, choices=ACTION_CHOICES)
    target_object_id = models.CharField(max_length=255, null=True, blank=True)
    
    old_values = models.JSONField(null=True, blank=True)
    new_values = models.JSONField(null=True, blank=True)
    
    timestamp = models.DateTimeField(default=timezone.now, db_index=True)

    class Meta:
        app_label = 'audit_logs'
        ordering = ['-timestamp']
        db_table = 'audit_logs'

    def __str__(self):
        return f"{self.action} on {self.module_name} at {self.timestamp}"
