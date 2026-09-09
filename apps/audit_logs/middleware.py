import threading
from django.utils.deprecation import MiddlewareMixin

_audit_local = threading.local()

def get_current_audit_context():
    return getattr(_audit_local, 'audit_context', {})

class AuditMiddleware(MiddlewareMixin):
    def process_request(self, request):
        ip = request.META.get('HTTP_X_FORWARDED_FOR')
        if ip:
            ip = ip.split(',')[0]
        else:
            ip = request.META.get('REMOTE_ADDR')
            
        user_agent = request.META.get('HTTP_USER_AGENT', '')
        user_id = str(request.user.id) if request.user.is_authenticated else None

        _audit_local.audit_context = {
            'ip_address': ip,
            'user_agent': user_agent,
            'actor_id': user_id,
        }

    def process_response(self, request, response):
        if hasattr(_audit_local, 'audit_context'):
            del _audit_local.audit_context
        return response
