import logging
from django.conf import settings

logger = logging.getLogger(__name__)

class AuditoriaNetworkMiddleware:
    def __init__(self, get_response):
        self.get_response = get_response

    def __call__(self, request):
        ip_address = request.META.get('HTTP_X_FORWARDED_FOR')
        if ip_address:
            ip_address = ip_address.split(',')[0].strip()
        else:
            ip_address = request.META.get('REMOTE_ADDR')

        mac_address = request.META.get('HTTP_X_MAC_ADDRESS')
        
        if settings.DEBUG:
            if not ip_address or ip_address == '127.0.0.1':
                ip_address = '127.0.0.1'
            if not mac_address:
                mac_address = 'LOCAL-DEV-MAC'
        
        request.audit_ip = ip_address
        request.audit_mac = mac_address

        response = self.get_response(request)
        return response
