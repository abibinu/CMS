from rest_framework import serializers
from .models import *


class LabTechnicianSerializer(serializers.ModelSerializer):
    """Serializer for LabTechnician model"""
    
    class Meta:
        model = LabTechnician
        fields = '__all__'
        read_only_fields = ['id', 'created_at', 'updated_at']


class LabTechnicianListSerializer(serializers.ModelSerializer):
    """Lightweight serializer for list view"""
    
    class Meta:
        model = LabTechnician
        fields = ['id', 'name', 'email', 'lab_id']  # Customize as needed
