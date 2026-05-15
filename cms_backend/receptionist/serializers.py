from rest_framework import serializers
from .models import TblMembership, TblPatient, TblAppointment, TblBilling

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

class BillingSerializer(serializers.ModelSerializer):
    PatientName = serializers.CharField(source='AppointmentId.PatientId.PatientName', read_only=True)
    DoctorName = serializers.CharField(source='AppointmentId.DoctorId.StaffId.FullName', read_only=True)

    class Meta:
        model = TblBilling
        fields = '__all__'
        read_only_fields = ['TotalAmount', 'BillDate', 'ConsultationFee']

    def validate(self, data):
        """Validate that appointment exists and is completed (only on create)"""
        # Only validate AppointmentId and its status during creation
        # During updates, we only care about charges
        if not self.instance:  # This is a CREATE operation
            appointment = data.get('AppointmentId')
            if not appointment:
                raise serializers.ValidationError(
                    {"AppointmentId": "Appointment is required."}
                )
            if appointment.ConsultationStatus != 'Completed':
                raise serializers.ValidationError(
                    {"AppointmentId": "Only completed appointments can be billed."}
                )
            if not appointment.DoctorId:
                raise serializers.ValidationError(
                    {"AppointmentId": "Appointment must have a doctor assigned."}
                )
            if not appointment.DoctorId.ConsultationFee:
                raise serializers.ValidationError(
                    {"AppointmentId": "Doctor does not have a consultation fee set."}
                )
        # For UPDATE operations, just validate charges
        return data

    def create(self, validated_data):
        """Create billing record with auto-calculated consultation fee and total"""
        from decimal import Decimal
        
        appointment = validated_data.get('AppointmentId')
        if not appointment or not appointment.DoctorId:
            raise serializers.ValidationError(
                {"AppointmentId": "Invalid appointment or doctor not assigned."}
            )
        
        # Auto-retrieve consultation fee from doctor
        consultation_fee = Decimal(str(appointment.DoctorId.ConsultationFee))
        reg_charge = Decimal(str(validated_data.get('RegistrationCharge') or 0))
        additional_charges = Decimal(str(validated_data.get('AdditionalCharges') or 0))
        
        # Calculate total
        total_amount = consultation_fee + reg_charge + additional_charges
        
        # Set calculated values
        validated_data['ConsultationFee'] = consultation_fee
        validated_data['TotalAmount'] = total_amount
        
        return super().create(validated_data)

    def update(self, instance, validated_data):
        """Update billing with recalculated total"""
        from decimal import Decimal
        
        # Update only these fields
        instance.RegistrationCharge = Decimal(str(validated_data.get('RegistrationCharge', instance.RegistrationCharge)))
        instance.AdditionalCharges = Decimal(str(validated_data.get('AdditionalCharges', instance.AdditionalCharges)))
        
        # Recalculate total (consultation fee stays the same)
        total_amount = (
            Decimal(str(instance.ConsultationFee)) + 
            instance.RegistrationCharge + 
            instance.AdditionalCharges
        )
        instance.TotalAmount = total_amount
        
        instance.save()
        return instance