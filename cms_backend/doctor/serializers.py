from rest_framework import serializers
from .models import TblConsultation, TblMedicinePrescription, TblLabTestPrescription

class ConsultationSerializer(serializers.ModelSerializer):
    class Meta:
        model = TblConsultation
        fields = '__all__'

class MedicinePrescriptionSerializer(serializers.ModelSerializer):
    MedicineName = serializers.CharField(source='MedicineId.MedicineName', read_only=True)

    class Meta:
        model = TblMedicinePrescription
        fields = '__all__'

class LabTestPrescriptionSerializer(serializers.ModelSerializer):
    TestName = serializers.CharField(source='LabTestId.TestName', read_only=True)

    class Meta:
        model = TblLabTestPrescription
        fields = '__all__'