from rest_framework import viewsets, status
from rest_framework.decorators import action
from rest_framework.response import Response
from rest_framework.permissions import IsAuthenticated
from .models import Administrator
from .serializers import AdministratorSerializer, AdministratorListSerializer


class AdministratorViewSet(viewsets.ModelViewSet):
    """ViewSet for Administrator model
    
    Provides list, create, retrieve, update, and destroy actions.
    """
    queryset = Administrator.objects.all()
    serializer_class = AdministratorSerializer
    permission_classes = [IsAuthenticated]
    
    def get_serializer_class(self):
        """Use different serializers for different actions"""
        if self.action == 'list':
            return AdministratorListSerializer
        return AdministratorSerializer
    
    @action(detail=False, methods=['get'])
    def active(self, request):
        """Get list of active administrators"""
        active_admins = self.get_queryset().filter(is_active=True)
        serializer = self.get_serializer(active_admins, many=True)
        return Response(serializer.data)
    
    @action(detail=True, methods=['post'])
    def set_inactive(self, request, pk=None):
        """Deactivate an administrator"""
        admin = self.get_object()
        admin.is_active = False
        admin.save()
        return Response({'status': 'administrator deactivated'})
