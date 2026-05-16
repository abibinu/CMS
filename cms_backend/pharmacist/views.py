# Pharmacist Module API Views
# Manages medicine catalog, inventory tracking, stock alerts, and prescription dispensing

from django.db import models  
from rest_framework import viewsets, status
from rest_framework.decorators import action
from rest_framework.response import Response
from .models import TblMedicineCategory, TblMedicine, TblMedicineStock
from .serializers import MedicineCategorySerializer, MedicineSerializer, MedicineStockSerializer

# Medicine category management
class MedicineCategoryViewSet(viewsets.ModelViewSet):
    """API for medicine categories (Antibiotics, Painkillers, etc.)"""
    queryset = TblMedicineCategory.objects.all()
    serializer_class = MedicineCategorySerializer

    # Custom action: PATCH /api/pharmacist/categories/{id}/deactivate/
    @action(detail=True, methods=['patch'])
    def deactivate(self, request, pk=None):
        """Deactivate a medicine category (soft delete)"""
        category = self.get_object()
        category.IsActive = False
        category.save()
        return Response({"message": "Medicine category deactivated successfully"})

# Medicine catalog management
class MedicineViewSet(viewsets.ModelViewSet):
    """API for medicine information including manufacturing and expiry dates"""
    queryset = TblMedicine.objects.all()
    serializer_class = MedicineSerializer

    # Custom action: PATCH /api/pharmacist/medicines/{id}/deactivate/
    @action(detail=True, methods=['patch'])
    def deactivate(self, request, pk=None):
        """Deactivate a medicine from inventory (soft delete)"""
        medicine = self.get_object()
        medicine.IsActive = False
        medicine.save()
        return Response({"message": "Medicine deactivated successfully"})

# Stock management and dispensing
class MedicineStockViewSet(viewsets.ModelViewSet):
    """API for inventory tracking, low stock alerts, and medicine dispensing"""
    queryset = TblMedicineStock.objects.all()
    serializer_class = MedicineStockSerializer

    # Custom action: GET /api/pharmacist/medicine-stock/low_stock/
    @action(detail=False, methods=['get'])
    def low_stock(self, request):
        """Get medicines below reorder level - alerts for stock replenishment"""
        # Items where StockInHand is less than or equal to ReOrderLevel
        low_stock_items = TblMedicineStock.objects.filter(
            StockInHand__lte=models.F('ReOrderLevel'),
            IsActive=True
        )
        serializer = self.get_serializer(low_stock_items, many=True)
        return Response(serializer.data)

    # Custom action: POST /api/pharmacist/medicine-stock/{id}/dispense/
    @action(detail=True, methods=['post'])
    def dispense(self, request, pk=None):
        """Dispense medicine from stock for a prescription - updates inventory"""
        stock_item = self.get_object()
        quantity = int(request.data.get('quantity', 0))
        prescription_id = request.data.get('prescriptionId')

        # Validate quantity input
        if quantity <= 0:
            return Response({"error": "Quantity must be greater than zero."}, status=status.HTTP_400_BAD_REQUEST)
        
        # Check stock availability
        if stock_item.StockInHand < quantity:
            return Response({"error": "Insufficient stock."}, status=status.HTTP_400_BAD_REQUEST)

        # Validate prescription exists
        if prescription_id:
            from doctor.models import TblMedicinePrescription
            try:
                prescription = TblMedicinePrescription.objects.get(MedicinePrescriptionId=prescription_id, IsActive=True)
            except TblMedicinePrescription.DoesNotExist:
                return Response({"error": "Active prescription not found."}, status=status.HTTP_404_NOT_FOUND)
        
        # Update stock and issue quantity
        stock_item.StockInHand -= quantity
        stock_item.save()
        return Response({"message": "Medicine dispensed successfully", "remaining_stock": stock_item.StockInHand}, status=status.HTTP_200_OK)