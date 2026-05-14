from rest_framework import serializers
from .models import *


class DoctorSerializer(serializers.ModelSerializer):
    """Serializer for Doctor model"""
    
    class Meta:
        model = Doctor
        fields = '__all__'
        read_only_fields = ['id', 'created_at', 'updated_at']


class DoctorListSerializer(serializers.ModelSerializer):
    """Lightweight serializer for list view"""
    
    class Meta:
        model = Doctor
        fields = ['id', 'name', 'email', 'specialization']  # Customize as needed
