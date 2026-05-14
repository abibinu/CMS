from rest_framework import viewsets, status
from rest_framework.decorators import action
from rest_framework.response import Response
from rest_framework.permissions import IsAuthenticated
from .models import Receptionist
from .serializers import ReceptionistSerializer, ReceptionistListSerializer


class ReceptionistViewSet(viewsets.ModelViewSet):
    """ViewSet for Receptionist model
    
    Provides list, create, retrieve, update, and destroy actions.
    """
    queryset = Receptionist.objects.all()
    serializer_class = ReceptionistSerializer
    permission_classes = [IsAuthenticated]
    
    def get_serializer_class(self):
        """Use different serializers for different actions"""
        if self.action == 'list':
            return ReceptionistListSerializer
        return ReceptionistSerializer
    
    @action(detail=False, methods=['get'])
    def by_department(self, request):
        """Get receptionists by department"""
        department = request.query_params.get('department')
        if department:
            receptionists = self.get_queryset().filter(department=department)
            serializer = self.get_serializer(receptionists, many=True)
            return Response(serializer.data)
        return Response({'error': 'department parameter required'}, status=status.HTTP_400_BAD_REQUEST)
    
    @action(detail=True, methods=['post'])
    def schedule_appointment(self, request, pk=None):
        """Schedule an appointment"""
        receptionist = self.get_object()
        # Implement your appointment scheduling logic here
        return Response({'status': 'appointment scheduled'})
