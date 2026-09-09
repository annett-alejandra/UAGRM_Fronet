"""
urls.py – Enrutamiento del motor de búsqueda.
"""
from django.urls import path

from . import views

app_name = "search_engine"

urlpatterns = [
    path("", views.FullTextSearchView.as_view(), name="full-text-search"),
]
