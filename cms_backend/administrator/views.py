from rest_framework import viewsets, status
from rest_framework.decorators import action
from rest_framework.response import Response
from .models import TblStaff, TblRole, TblSpecialization, TblDoctor
from .serializers import StaffSerializer, RoleSerializer, SpecializationSerializer, DoctorSerializer

class RoleViewSet(viewsets.ModelViewSet):
    queryset = TblRole.objects.all()
    serializer_class = RoleSerializer

class StaffViewSet(viewsets.ModelViewSet):
    queryset = TblStaff.objects.all()
    serializer_class = StaffSerializer

    def get_queryset(self):
        queryset = TblStaff.objects.all()
        name = self.request.query_params.get('name')
        role = self.request.query_params.get('role')
        if name:
            queryset = queryset.filter(FullName__icontains=name)
        if role:
            queryset = queryset.filter(RoleId__RoleName__icontains=role)
        return queryset

    @action(detail=True, methods=['patch'])
    def deactivate(self, request, pk=None):
        staff = self.get_object()
        staff.IsActive = False
        staff.save()
        return Response(
            {"message": "Staff deactivated successfully"}, 
            status=status.HTTP_200_OK
        )

class SpecializationViewSet(viewsets.ModelViewSet):
    queryset = TblSpecialization.objects.all()
    serializer_class = SpecializationSerializer

class DoctorViewSet(viewsets.ModelViewSet):
    queryset = TblDoctor.objects.all()
    serializer_class = DoctorSerializer

    # Custom endpoint: PATCH /api/doctors/{id}/deactivate/
    @action(detail=True, methods=['patch'])
    def deactivate(self, request, pk=None):
        doctor = self.get_object()
        doctor.IsActive = False
        doctor.save()
        return Response(
            {"message": "Doctor deactivated successfully"}, 
            status=status.HTTP_200_OK
        )