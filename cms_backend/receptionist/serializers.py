from rest_framework import serializers
from .models import TblMembership, TblPatient

class MembershipSerializer(serializers.ModelSerializer):
    class Meta:
        model = TblMembership
        fields = '__all__'

class PatientSerializer(serializers.ModelSerializer):
    # Read-only field to show the actual membership name instead of just the ID in GET requests
    MembershipType = serializers.CharField(source='MembershipId.MembershipType', read_only=True)

    class Meta:
        model = TblPatient
        fields = '__all__'