from rest_framework import serializers
from .models import TblStaff, TblRole

class StaffSerializer(serializers.ModelSerializer):
    class Meta:
        model = TblStaff
        fields = '__all__'
        extra_kwargs = {'Password': {'write_only': True}} # Security: don't return passwords in GET requests