from django.db import models  
from rest_framework import viewsets, status
from rest_framework.decorators import action
from rest_framework.response import Response
from .models import TblMedicineCategory, TblMedicine, TblMedicineStock
from .serializers import MedicineCategorySerializer, MedicineSerializer, MedicineStockSerializer

class MedicineCategoryViewSet(viewsets.ModelViewSet):
    queryset = TblMedicineCategory.objects.all()
    serializer_class = MedicineCategorySerializer

class MedicineViewSet(viewsets.ModelViewSet):
    queryset = TblMedicine.objects.all()
    serializer_class = MedicineSerializer

    @action(detail=True, methods=['patch'])
    def deactivate(self, request, pk=None):
        medicine = self.get_object()
        medicine.IsActive = False
        medicine.save()
        return Response({"message": "Medicine deactivated successfully"})

class MedicineStockViewSet(viewsets.ModelViewSet):
    queryset = TblMedicineStock.objects.all()
    serializer_class = MedicineStockSerializer

    # Custom action to flag low stock items [cite: 208]
    @action(detail=False, methods=['get'])
    def low_stock(self, request):
        # Items where StockInHand is less than or equal to ReOrderLevel
        low_stock_items = TblMedicineStock.objects.filter(
            StockInHand__lte=models.F('ReOrderLevel'),
            IsActive=True
        )
        serializer = self.get_serializer(low_stock_items, many=True)
        return Response(serializer.data)