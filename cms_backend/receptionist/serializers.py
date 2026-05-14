from rest_framework import serializers
from .models import *


class ReceptionistSerializer(serializers.ModelSerializer):
    """Serializer for Receptionist model"""
    
    class Meta:
        model = Receptionist
        fields = '__all__'
        read_only_fields = ['id', 'created_at', 'updated_at']


class ReceptionistListSerializer(serializers.ModelSerializer):
    """Lightweight serializer for list view"""
    
    class Meta:
        model = Receptionist
        fields = ['id', 'name', 'email', 'department']  # Customize as needed
