"""
serializers.py – Serializadores de las unidades organizacionales.
"""
from rest_framework import serializers

from .models import Department, Institution, LogicalRepository, StorageQuota


class InstitutionSerializer(serializers.ModelSerializer):
    class Meta:
        model = Institution
        fields = ["id", "name", "code", "created_at"]
        read_only_fields = ["id", "created_at"]


class DepartmentSerializer(serializers.ModelSerializer):
    institution_name = serializers.CharField(source="institution.name", read_only=True)

    class Meta:
        model = Department
        fields = ["id", "institution", "institution_name", "parent", "name", "code", "created_at"]
        read_only_fields = ["id", "created_at"]


class LogicalRepositorySerializer(serializers.ModelSerializer):
    class Meta:
        model = LogicalRepository
        fields = ["id", "department", "bucket_name", "prefix", "created_at"]
        read_only_fields = ["id", "created_at"]


class StorageQuotaSerializer(serializers.ModelSerializer):
    remaining_gb = serializers.DecimalField(max_digits=10, decimal_places=2, read_only=True)
    is_exceeded = serializers.BooleanField(read_only=True)

    class Meta:
        model = StorageQuota
        fields = ["id", "department", "max_size_gb", "used_size_gb", "remaining_gb", "is_exceeded", "updated_at"]
        read_only_fields = ["id", "used_size_gb", "updated_at"]
