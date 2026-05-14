from rest_framework import viewsets, status
from rest_framework.decorators import action
from rest_framework.response import Response
from django.db import models
from .models import TblMembership, TblPatient, TblAppointment, TblBilling
from .serializers import MembershipSerializer, PatientSerializer, AppointmentSerializer, BillingSerializer

class MembershipViewSet(viewsets.ModelViewSet):
    queryset = TblMembership.objects.all()
    serializer_class = MembershipSerializer

class PatientViewSet(viewsets.ModelViewSet):
    queryset = TblPatient.objects.all()
    serializer_class = PatientSerializer

    # Implementing the search functionality (Name, ID, Mobile)
    def get_queryset(self):
        queryset = TblPatient.objects.all()
        search_query = self.request.query_params.get('search')
        
        if search_query:
            queryset = queryset.filter(
                models.Q(PatientName__icontains=search_query) |
                models.Q(MobileNumber__icontains=search_query) |
                models.Q(PatientId__icontains=search_query) # Safe since PatientId is AutoField
            )
        return queryset

    # Custom endpoint: PATCH /api/patients/{id}/deactivate/
    @action(detail=True, methods=['patch'])
    def deactivate(self, request, pk=None):
        patient = self.get_object()
        patient.IsActive = False
        patient.save()
        return Response(
            {"message": "Patient deactivated successfully"}, 
            status=status.HTTP_200_OK
        )

class AppointmentViewSet(viewsets.ModelViewSet):
    queryset = TblAppointment.objects.all()
    serializer_class = AppointmentSerializer

    # 1. Handle query parameter filtering: ?date=YYYY-MM-DD and ?status=Scheduled
    def get_queryset(self):
        queryset = TblAppointment.objects.all()
        date = self.request.query_params.get('date')
        status_param = self.request.query_params.get('status')
        
        if date:
            queryset = queryset.filter(AppointmentDate=date)
        if status_param:
            queryset = queryset.filter(ConsultationStatus__iexact=status_param)
            
        return queryset

    # 2. Custom endpoint: PATCH /api/appointments/{id}/cancel
    @action(detail=True, methods=['patch'])
    def cancel(self, request, pk=None):
        appointment = self.get_object()
        appointment.ConsultationStatus = 'Cancelled'
        appointment.save()
        return Response(
            {"message": "Appointment cancelled successfully"}, 
            status=status.HTTP_200_OK
        )

    # 3. Custom path: GET /api/appointments/patient/{patientId}
    @action(detail=False, methods=['get'], url_path='patient/(?P<patient_id>\d+)')
    def by_patient(self, request, patient_id=None):
        appointments = self.get_queryset().filter(PatientId=patient_id)
        serializer = self.get_serializer(appointments, many=True)
        return Response(serializer.data)

    # 4. Custom path: GET /api/appointments/doctor/{doctorId}
    @action(detail=False, methods=['get'], url_path='doctor/(?P<doctor_id>\d+)')
    def by_doctor(self, request, doctor_id=None):
        appointments = self.get_queryset().filter(DoctorId=doctor_id)
        serializer = self.get_serializer(appointments, many=True)
        return Response(serializer.data)

class BillingViewSet(viewsets.ModelViewSet):
    queryset = TblBilling.objects.all()
    serializer_class = BillingSerializer

    # Logic for Date Range Filtering: GET /api/billing?startDate=YYYY-MM-DD&endDate=YYYY-MM-DD 
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