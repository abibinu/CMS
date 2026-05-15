# Lab Technician Module Models
# Manages laboratory test catalogs and test result tracking

from django.db import models

# Lab test categories
class TblLabTestCategory(models.Model):
    """Categories for lab tests (Blood Work, Imaging, Pathology, etc.)"""
    LabTestCategoryId = models.AutoField(primary_key=True)
    LabTestCategoryName = models.CharField(max_length=100)

    def __str__(self):
        return self.LabTestCategoryName

# Lab tests
class TblLabTest(models.Model):
    """Laboratory tests available at the clinic with reference ranges"""
    LabTestId = models.AutoField(primary_key=True)
    TestName = models.CharField(max_length=100)  # e.g., 'Blood Sugar', 'Complete Blood Count'
    Amount = models.DecimalField(max_digits=10, decimal_places=2)  # Cost of test
    ReferenceMinRange = models.CharField(max_length=50)  # Normal minimum value
    ReferenceMaxRange = models.CharField(max_length=50)  # Normal maximum value
    SampleRequired = models.CharField(max_length=100)  # e.g., 'Blood', 'Urine', 'Stool'
    LabTestCategoryId = models.ForeignKey(
        TblLabTestCategory,
        on_delete=models.CASCADE  # Category reference
    )
    IsActive = models.BooleanField(default=True)

    def __str__(self):
        return self.TestName