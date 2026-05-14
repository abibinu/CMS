from rest_framework import serializers
from .models import *


class PharmacistSerializer(serializers.ModelSerializer):
    """Serializer for Pharmacist model"""
    
    class Meta:
        model = Pharmacist
        fields = '__all__'
        read_only_fields = ['id', 'created_at', 'updated_at']


class PharmacistListSerializer(serializers.ModelSerializer):
    """Lightweight serializer for list view"""
    
    class Meta:
        model = Pharmacist
        fields = ['id', 'name', 'email', 'pharmacy_id']  # Customize as needed
