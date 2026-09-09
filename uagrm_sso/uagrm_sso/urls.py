from django.urls import path

from .views import SSOCallbackView, SSOEventsView, SSOLogoutView, SSORefreshView

urlpatterns = [
    path("api/sso/callback",        SSOCallbackView.as_view(), name="sso-callback"),
    path("api/sso/refresh-session", SSORefreshView.as_view(),  name="sso-refresh-session"),
    path("api/sso/logout",          SSOLogoutView.as_view(),   name="sso-logout"),
    path("api/sso/events",          SSOEventsView.as_view(),   name="sso-events"),
]
