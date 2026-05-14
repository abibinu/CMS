from rest_framework import viewsets
from .models import TblStaff
from .serializers import StaffSerializer

class StaffViewSet(viewsets.ModelViewSet):
    queryset = TblStaff.objects.all()
    serializer_class = StaffSerializer
    # Permission classes are commented out for easy testing
    # permission_classes = [IsAuthenticated]