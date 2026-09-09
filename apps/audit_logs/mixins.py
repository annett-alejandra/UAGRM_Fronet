import uuid
from django.db import models
from django.forms.models import model_to_dict
from .models import AuditLog
from .middleware import get_current_audit_context

class AuditableModelMixin(models.Model):
    class Meta:
        abstract = True

    def __init__(self, *args, **kwargs):
        super().__init__(*args, **kwargs)
        self._initial_state = self._get_auditable_state()

    def _get_auditable_state(self):
        if not self.pk:
            return {}
        # Simple extraction, handles simple fields. For relations, it returns ids.
        return model_to_dict(self)

    def save(self, *args, **kwargs):
        is_new = self.pk is None
        super().save(*args, **kwargs)
        
        current_state = self._get_auditable_state()
        
        if is_new:
            action = 'CREATE'
            old_values = None
            new_values = current_state
        else:
            action = 'UPDATE'
            old_values = self._initial_state
            new_values = current_state
            
            # Remove unchanged fields
            changed = False
            for key in list(current_state.keys()):
                if old_values.get(key) == current_state[key]:
                    old_values.pop(key, None)
                    new_values.pop(key, None)
                else:
                    changed = True
            
            if not changed:
                return # No actual changes
                
        self._log_audit(action, old_values, new_values)
        self._initial_state = self._get_auditable_state()

    def delete(self, *args, **kwargs):
        old_values = self._get_auditable_state()
        super().delete(*args, **kwargs)
        self._log_audit('DELETE', old_values, None)

    def _log_audit(self, action, old_values, new_values):
        ctx = get_current_audit_context()
        module_name = self._meta.app_label
        
        # Convert UUIDs to strings in dicts so JSONField doesn't crash
        def sanitize_dict(d):
            if not d: return d
            res = {}
            for k, v in d.items():
                if isinstance(v, uuid.UUID):
                    res[k] = str(v)
                else:
                    res[k] = v
            return res

        AuditLog.objects.create(
            actor_id=ctx.get('actor_id'),
            ip_address=ctx.get('ip_address'),
            user_agent=ctx.get('user_agent'),
            module_name=module_name,
            action=action,
            target_object_id=str(self.pk),
            old_values=sanitize_dict(old_values),
            new_values=sanitize_dict(new_values)
        )
