from django.db import models

class TblMedicineCategory(models.Model):
    MedicineCategoryId = models.AutoField(primary_key=True) 
    MedicineCategoryName = models.CharField(max_length=100) 
    IsActive = models.BooleanField(default=True) 

class TblMedicine(models.Model):
    MedicineId = models.AutoField(primary_key=True) 
    MedicineName = models.CharField(max_length=100) 
    ManufacturingDate = models.DateField() 
    ExpiryDate = models.DateField() 
    Unit = models.CharField(max_length=50) 
    MedicineCategoryId = models.ForeignKey(TblMedicineCategory, on_delete=models.CASCADE) 
    IsActive = models.BooleanField(default=True) 

class TblMedicineStock(models.Model):
    MedicineStockId = models.AutoField(primary_key=True) 
    StockInHand = models.IntegerField() 
    ReOrderLevel = models.IntegerField() 
    Purchase = models.IntegerField() 
    Issuance = models.IntegerField() 
    MedicineId = models.ForeignKey(TblMedicine, on_delete=models.CASCADE) 
    CreatedDate = models.DateTimeField(auto_now_add=True) 
    IsActive = models.BooleanField(default=True) 