from rest_framework import viewsets, status
from rest_framework.decorators import action
from rest_framework.response import Response
from rest_framework.permissions import IsAuthenticated
from .models import Pharmacist
from .serializers import PharmacistSerializer, PharmacistListSerializer


class PharmacistViewSet(viewsets.ModelViewSet):
    """ViewSet for Pharmacist model
    
    Provides list, create, retrieve, update, and destroy actions.
    """
    queryset = Pharmacist.objects.all()
    serializer_class = PharmacistSerializer
    permission_classes = [IsAuthenticated]
    
    def get_serializer_class(self):
        """Use different serializers for different actions"""
        if self.action == 'list':
            return PharmacistListSerializer
        return PharmacistSerializer
    
    @action(detail=False, methods=['get'])
    def by_pharmacy(self, request):
        """Get pharmacists by pharmacy"""
        pharmacy_id = request.query_params.get('pharmacy_id')
        if pharmacy_id:
            pharmacists = self.get_queryset().filter(pharmacy_id=pharmacy_id)
            serializer = self.get_serializer(pharmacists, many=True)
            return Response(serializer.data)
        return Response({'error': 'pharmacy_id parameter required'}, status=status.HTTP_400_BAD_REQUEST)
    
    @action(detail=True, methods=['post'])
    def process_prescription(self, request, pk=None):
        """Process a prescription"""
        pharmacist = self.get_object()
        # Implement your prescription processing logic here
        return Response({'status': 'prescription processed'})
