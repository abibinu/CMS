# Doctor Module API Views
# Handles consultation records, medicine prescriptions, and lab test orders

from rest_framework import viewsets
from rest_framework.decorators import action
from rest_framework.response import Response
from .models import TblConsultation, TblMedicinePrescription, TblLabTestPrescription
from .serializers import ConsultationSerializer, MedicinePrescriptionSerializer, LabTestPrescriptionSerializer

# Consultation management - CRUD consultation records
class ConsultationViewSet(viewsets.ModelViewSet):
    """API for consultation records with patient history and diagnostic information"""
    queryset = TblConsultation.objects.all()
    serializer_class = ConsultationSerializer

    # Filter consultations by patient, doctor, or appointment
    def get_queryset(self):
        queryset = TblConsultation.objects.all()
        patient_id = self.request.query_params.get('patientId')
        doctor_id = self.request.query_params.get('doctorId')
        appointment_id = self.request.query_params.get('appointmentId')

        if patient_id:
            queryset = queryset.filter(AppointmentId__PatientId=patient_id)
        if doctor_id:
            queryset = queryset.filter(AppointmentId__DoctorId=doctor_id)
        if appointment_id:
            queryset = queryset.filter(AppointmentId=appointment_id)
        return queryset

# Medicine prescriptions - Manage medicine orders
class MedicinePrescriptionViewSet(viewsets.ModelViewSet):
    """API for prescribing medicines with dosage, frequency, and duration"""
    queryset = TblMedicinePrescription.objects.all()
    serializer_class = MedicinePrescriptionSerializer

    def get_serializer(self, *args, **kwargs):
        # Allow bulk prescription creation with list data
        if "data" in kwargs:
            data = kwargs["data"]
            if isinstance(data, list):
                kwargs["many"] = True
        return super().get_serializer(*args, **kwargs)

    # Filter prescriptions by appointment or patient
    def get_queryset(self):
        queryset = TblMedicinePrescription.objects.all()
        appointment_id = self.request.query_params.get('appointmentId')
        patient_id = self.request.query_params.get('patientId')

        if appointment_id:
            queryset = queryset.filter(AppointmentId=appointment_id)
        if patient_id:
            queryset = queryset.filter(AppointmentId__PatientId=patient_id)
        return queryset

# Lab test prescriptions - Manage lab test orders
class LabTestPrescriptionViewSet(viewsets.ModelViewSet):
    """API for ordering lab tests with results tracking and clinical remarks"""
    queryset = TblLabTestPrescription.objects.all()
    serializer_class = LabTestPrescriptionSerializer

    def get_serializer(self, *args, **kwargs):
        if "data" in kwargs:
            data = kwargs["data"]
            if isinstance(data, list):
                kwargs["many"] = True
        return super().get_serializer(*args, **kwargs)

    def get_queryset(self):
        queryset = TblLabTestPrescription.objects.all()
        appointment_id = self.request.query_params.get('appointmentId')
        patient_id = self.request.query_params.get('patientId')
        
        if appointment_id:
            queryset = queryset.filter(AppointmentId=appointment_id)
        if patient_id:
            queryset = queryset.filter(AppointmentId__PatientId=patient_id)
            
        return queryset