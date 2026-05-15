# Administrator Module API Views
# Handles CRUD operations and custom actions for staff, roles, doctors, and specializations

from rest_framework import viewsets, status
from rest_framework.decorators import action
from rest_framework.response import Response
from .models import TblStaff, TblRole, TblSpecialization, TblDoctor
from .serializers import StaffSerializer, RoleSerializer, SpecializationSerializer, DoctorSerializer

# Role management - List all clinic roles
class RoleViewSet(viewsets.ModelViewSet):
    """API for managing clinic staff roles (Admin, Doctor, etc.)"""
    queryset = TblRole.objects.all()
    serializer_class = RoleSerializer

# Staff management - CRUD staff members with filtering
class StaffViewSet(viewsets.ModelViewSet):
    """API for staff management with search by name or role"""
    queryset = TblStaff.objects.all()
    serializer_class = StaffSerializer

    def get_queryset(self):
        # Filter by name or role if query parameters provided
        queryset = TblStaff.objects.all()
        name = self.request.query_params.get('name')
        role = self.request.query_params.get('role')
        if name:
            queryset = queryset.filter(FullName__icontains=name)
        if role:
            queryset = queryset.filter(RoleId__RoleName__icontains=role)
        return queryset

    # Custom action: PATCH /api/staff/{id}/deactivate/ - Soft delete staff
    @action(detail=True, methods=['patch'])
    def deactivate(self, request, pk=None):
        """Deactivate a staff member (soft delete)"""
        staff = self.get_object()
        staff.IsActive = False
        staff.save()
        return Response(
            {"message": "Staff deactivated successfully"}, 
            status=status.HTTP_200_OK
        )

# Specialization management - List medical specializations
class SpecializationViewSet(viewsets.ModelViewSet):
    """API for managing medical specializations (Cardiology, etc.)"""
    queryset = TblSpecialization.objects.all()
    serializer_class = SpecializationSerializer

# Doctor management - CRUD doctor profiles
class DoctorViewSet(viewsets.ModelViewSet):
    """API for doctor profiles, consultation fees, and specializations"""
    queryset = TblDoctor.objects.all()
    serializer_class = DoctorSerializer

    # Custom action: PATCH /api/doctors/{id}/deactivate/ - Soft delete doctor
    @action(detail=True, methods=['patch'])
    def deactivate(self, request, pk=None):
        """Deactivate a doctor (soft delete)"""
        doctor = self.get_object()
        doctor.IsActive = False
        doctor.save()
        return Response(
            {"message": "Doctor deactivated successfully"}, 
            status=status.HTTP_200_OK
        )