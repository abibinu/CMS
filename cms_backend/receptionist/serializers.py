from rest_framework import serializers
from .models import TblMembership, TblPatient, TblAppointment

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

class AppointmentSerializer(serializers.ModelSerializer):
    # Make GET requests readable by pulling names through the foreign keys
    PatientName = serializers.CharField(source='PatientId.PatientName', read_only=True)
    DoctorName = serializers.CharField(source='DoctorId.StaffId.FullName', read_only=True)

    class Meta:
        model = TblAppointment
        fields = '__all__'

# receptionist/serializers.py (Add this)

from .models import TblBilling

class BillingSerializer(serializers.ModelSerializer):
    PatientName = serializers.CharField(source='AppointmentId.PatientId.PatientName', read_only=True)
    DoctorName = serializers.CharField(source='AppointmentId.DoctorId.StaffId.FullName', read_only=True)

    class Meta:
        model = TblBilling
        fields = '__all__'
        # Add this line to prevent the "required field" error in Postman
        read_only_fields = ['TotalAmount', 'BillDate']

    def create(self, validated_data):
        # The logic remains the same; it will now execute successfully
        fee = validated_data.get('ConsultationFee', 0)
        reg = validated_data.get('RegistrationCharge', 0)
        extra = validated_data.get('AdditionalCharges', 0)
        
        validated_data['TotalAmount'] = fee + reg + extra
        return super().create(validated_data)