from rest_framework import viewsets, status
from rest_framework.decorators import action
from rest_framework.response import Response
from rest_framework.permissions import IsAuthenticated
from .models import Doctor
from .serializers import DoctorSerializer, DoctorListSerializer


class DoctorViewSet(viewsets.ModelViewSet):
    """ViewSet for Doctor model
    
    Provides list, create, retrieve, update, and destroy actions.
    """
    queryset = Doctor.objects.all()
    serializer_class = DoctorSerializer
    permission_classes = [IsAuthenticated]
    
    def get_serializer_class(self):
        """Use different serializers for different actions"""
        if self.action == 'list':
            return DoctorListSerializer
        return DoctorSerializer
    
    @action(detail=False, methods=['get'])
    def by_specialization(self, request):
        """Get doctors by specialization"""
        specialization = request.query_params.get('specialization')
        if specialization:
            doctors = self.get_queryset().filter(specialization=specialization)
            serializer = self.get_serializer(doctors, many=True)
            return Response(serializer.data)
        return Response({'error': 'specialization parameter required'}, status=status.HTTP_400_BAD_REQUEST)
    
    @action(detail=True, methods=['post'])
    def set_available(self, request, pk=None):
        """Mark doctor as available"""
        doctor = self.get_object()
        doctor.is_available = True
        doctor.save()
        return Response({'status': 'doctor marked as available'})
