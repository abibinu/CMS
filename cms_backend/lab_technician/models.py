from django.db import models

class TblLabTestCategory(models.Model):
    LabTestCategoryId = models.AutoField(primary_key=True) 
    LabTestCategoryName = models.CharField(max_length=100) 

class TblLabTest(models.Model):
    LabTestId = models.AutoField(primary_key=True) 
    TestName = models.CharField(max_length=100) 
    Amount = models.DecimalField(max_digits=10, decimal_places=2) 
    ReferenceMinRange = models.CharField(max_length=50) 
    ReferenceMaxRange = models.CharField(max_length=50) 
    SampleRequired = models.CharField(max_length=100) 
    LabTestCategoryId = models.ForeignKey(TblLabTestCategory, on_delete=models.CASCADE) 
    IsActive = models.BooleanField(default=True) 