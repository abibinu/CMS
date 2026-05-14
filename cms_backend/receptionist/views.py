from rest_framework import viewsets, status
from rest_framework.decorators import action
from rest_framework.response import Response
from django.db import models
from .models import TblMembership, TblPatient
from .serializers import MembershipSerializer, PatientSerializer

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