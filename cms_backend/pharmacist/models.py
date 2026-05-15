# Pharmacist Module Models
# Manages medicine inventory, stock levels, and dispensing operations

from django.db import models

# Medicine categories
class TblMedicineCategory(models.Model):
    """Medicine categories for inventory organization"""
    MedicineCategoryId = models.AutoField(primary_key=True) 
    MedicineCategoryName = models.CharField(max_length=100)  # e.g., 'Antibiotics', 'Painkillers'
    IsActive = models.BooleanField(default=True)

# Medicine information
class TblMedicine(models.Model):
    """Medicine details with manufacturing and expiry dates"""
    MedicineId = models.AutoField(primary_key=True) 
    MedicineName = models.CharField(max_length=100)  # Generic/trade name
    ManufacturingDate = models.DateField()  # Date produced
    ExpiryDate = models.DateField()  # Expiration date
    Unit = models.CharField(max_length=50)  # Unit of measurement (tablets, ml, etc.)
    MedicineCategoryId = models.ForeignKey(TblMedicineCategory, on_delete=models.CASCADE)  # Category classification
    IsActive = models.BooleanField(default=True)

# Stock management
class TblMedicineStock(models.Model):
    """Inventory tracking for medicines with reorder levels"""
    MedicineStockId = models.AutoField(primary_key=True) 
    StockInHand = models.IntegerField()  # Current quantity available
    ReOrderLevel = models.IntegerField()  # Minimum threshold for reordering
    Purchase = models.IntegerField()  # Total purchased quantity
    Issuance = models.IntegerField()  # Total issued/dispensed quantity
    MedicineId = models.ForeignKey(TblMedicine, on_delete=models.CASCADE)  # Medicine reference
    CreatedDate = models.DateTimeField(auto_now_add=True)  # Record creation date
    IsActive = models.BooleanField(default=True) 