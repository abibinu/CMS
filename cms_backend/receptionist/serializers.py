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
        read_only_fields = ['TokenNumber']

    def validate(self, data):
        doctor = data.get('DoctorId')
        if doctor and not doctor.IsActive:
            raise serializers.ValidationError({"DoctorId": "The selected doctor is currently not available."})
        return data

    def create(self, validated_data):
        doctor = validated_data.get('DoctorId')
        date = validated_data.get('AppointmentDate')
        
        # Calculate TokenNumber
        existing_appointments = TblAppointment.objects.filter(DoctorId=doctor, AppointmentDate=date).count()
        validated_data['TokenNumber'] = existing_appointments + 1
        
        return super().create(validated_data)

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
        appointment = validated_data.get('AppointmentId')
        if appointment and appointment.DoctorId:
            fee = appointment.DoctorId.ConsultationFee
            validated_data['ConsultationFee'] = fee
        else:
            fee = validated_data.get('ConsultationFee', 0)

        reg = validated_data.get('RegistrationCharge', 0)
        extra = validated_data.get('AdditionalCharges', 0)
        
        validated_data['TotalAmount'] = fee + reg + extra
        return super().create(validated_data)