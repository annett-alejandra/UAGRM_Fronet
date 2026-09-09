from django.contrib import admin
from .models import AuditLog

@admin.register(AuditLog)
class AuditLogAdmin(admin.ModelAdmin):
    list_display = ('action', 'module_name', 'actor_id', 'ip_address', 'timestamp')
    list_filter = ('action', 'module_name', 'timestamp')
    search_fields = ('actor_id', 'target_object_id', 'ip_address')
    readonly_fields = ('actor_id', 'ip_address', 'user_agent', 'module_name', 'action', 'target_object_id', 'old_values', 'new_values', 'timestamp')

    def has_add_permission(self, request):
        return False
        
    def has_change_permission(self, request, obj=None):
        return False
        
    def has_delete_permission(self, request, obj=None):
        return False
