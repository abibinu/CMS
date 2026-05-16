# Receptionist Module API Views
# Handles patient registration, appointment scheduling, and billing operations

from rest_framework import viewsets, status
from rest_framework.decorators import action
from rest_framework.response import Response
from django.db import models
from .models import TblMembership, TblPatient, TblAppointment, TblBilling
from .serializers import MembershipSerializer, PatientSerializer, AppointmentSerializer, BillingSerializer

# Membership plans - List membership types
class MembershipViewSet(viewsets.ModelViewSet):
    """API for membership types and patient plans"""
    queryset = TblMembership.objects.all()
    serializer_class = MembershipSerializer

# Patient management - CRUD patient records with search
class PatientViewSet(viewsets.ModelViewSet):
    """API for patient registration and management with search by name, ID, or mobile"""
    queryset = TblPatient.objects.all()
    serializer_class = PatientSerializer

    # Search patients by name, ID, or mobile number
    def get_queryset(self):
        queryset = TblPatient.objects.all()
        search_query = self.request.query_params.get('search')
        
        if search_query:
            queryset = queryset.filter(
                models.Q(PatientName__icontains=search_query) |
                models.Q(MobileNumber__icontains=search_query) |
                models.Q(PatientId__icontains=search_query)
            )
        return queryset

    # Custom action: PATCH /api/patients/{id}/deactivate/
    @action(detail=True, methods=['patch'])
    def deactivate(self, request, pk=None):
        """Deactivate a patient record (soft delete)"""
        patient = self.get_object()
        patient.IsActive = False
        patient.save()
        return Response(
            {"message": "Patient deactivated successfully"}, 
            status=status.HTTP_200_OK
        )

# Appointment management - Schedule and track doctor appointments
class AppointmentViewSet(viewsets.ModelViewSet):
    """API for appointment scheduling, cancellation, and filtering"""
    queryset = TblAppointment.objects.all()
    serializer_class = AppointmentSerializer

    # Filter appointments by date or consultation status
    def get_queryset(self):
        queryset = TblAppointment.objects.all()
        date = self.request.query_params.get('date')
        status_param = self.request.query_params.get('status')
        
        if date:
            queryset = queryset.filter(AppointmentDate=date)
        if status_param:
            queryset = queryset.filter(ConsultationStatus__iexact=status_param)
            
        return queryset

    # Custom action: PATCH /api/appointments/{id}/cancel/
    @action(detail=True, methods=['patch'])
    def cancel(self, request, pk=None):
        """Cancel an appointment"""
        appointment = self.get_object()
        appointment.ConsultationStatus = 'Cancelled'
        appointment.save()
        return Response(
            {"message": "Appointment cancelled successfully"}, 
            status=status.HTTP_200_OK
        )

    # Custom path: GET /api/appointments/patient/{patientId}/
    @action(detail=False, methods=['get'], url_path=r'patient/(?P<patient_id>\d+)')
    def by_patient(self, request, patient_id=None):
        """Get all appointments for a specific patient"""
        appointments = self.get_queryset().filter(PatientId=patient_id)
        serializer = self.get_serializer(appointments, many=True)
        return Response(serializer.data)

    # Custom path: GET /api/appointments/doctor/{doctorId}/
    @action(detail=False, methods=['get'], url_path=r'doctor/(?P<doctor_id>\d+)')
    def by_doctor(self, request, doctor_id=None):
        """Get all appointments for a specific doctor"""
        appointments = self.get_queryset().filter(DoctorId=doctor_id)
        serializer = self.get_serializer(appointments, many=True)
        return Response(serializer.data)

# Billing management - Invoice generation and tracking
class BillingViewSet(viewsets.ModelViewSet):
    """API for billing, invoice generation, and financial reports"""
    queryset = TblBilling.objects.all()
    serializer_class = BillingSerializer

    # Filter bills by date range or appointment
    def get_queryset(self):
        queryset = TblBilling.objects.all()
        start_date = self.request.query_params.get('startDate')
        end_date = self.request.query_params.get('endDate')
        appointment_id = self.request.query_params.get('appointmentId')

        if start_date and end_date:
            queryset = queryset.filter(BillDate__date__range=[start_date, end_date])
        if appointment_id:
            queryset = queryset.filter(AppointmentId=appointment_id)
            
        return queryset