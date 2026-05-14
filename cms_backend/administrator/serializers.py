from rest_framework import serializers
from .models import *


class AdministratorSerializer(serializers.ModelSerializer):
    """Serializer for Administrator model"""
    
    class Meta:
        model = Administrator
        fields = '__all__'
        read_only_fields = ['id', 'created_at', 'updated_at']


class AdministratorListSerializer(serializers.ModelSerializer):
    """Lightweight serializer for list view"""
    
    class Meta:
        model = Administrator
        fields = ['id', 'name', 'email']  # Customize as needed
