from rest_framework import viewsets, status
from rest_framework.decorators import action
from rest_framework.response import Response
from rest_framework.permissions import IsAuthenticated
from .models import LabTechnician
from .serializers import LabTechnicianSerializer, LabTechnicianListSerializer


class LabTechnicianViewSet(viewsets.ModelViewSet):
    """ViewSet for LabTechnician model
    
    Provides list, create, retrieve, update, and destroy actions.
    """
    queryset = LabTechnician.objects.all()
    serializer_class = LabTechnicianSerializer
    permission_classes = [IsAuthenticated]
    
    def get_serializer_class(self):
        """Use different serializers for different actions"""
        if self.action == 'list':
            return LabTechnicianListSerializer
        return LabTechnicianSerializer
    
    @action(detail=False, methods=['get'])
    def by_lab(self, request):
        """Get lab technicians by lab"""
        lab_id = request.query_params.get('lab_id')
        if lab_id:
            technicians = self.get_queryset().filter(lab_id=lab_id)
            serializer = self.get_serializer(technicians, many=True)
            return Response(serializer.data)
        return Response({'error': 'lab_id parameter required'}, status=status.HTTP_400_BAD_REQUEST)
    
    @action(detail=True, methods=['post'])
    def assign_test(self, request, pk=None):
        """Assign a test to lab technician"""
        technician = self.get_object()
        # Implement your test assignment logic here
        return Response({'status': 'test assigned to technician'})
