from django.db import models
from receptionist.models import TblAppointment
from pharmacist.models import TblMedicine
from lab_technician.models import TblLabTest

class TblConsultation(models.Model):
    ConsultationId = models.AutoField(primary_key=True) 
    Symptoms = models.TextField() 
    Diagnosis = models.TextField() 
    Notes = models.TextField() 
    CreatedDate = models.DateTimeField(auto_now_add=True) 
    AppointmentId = models.ForeignKey(TblAppointment, on_delete=models.CASCADE) 
    IsActive = models.BooleanField(default=True) 

class TblMedicinePrescription(models.Model):
    MedicinePrescriptionId = models.AutoField(primary_key=True) 
    MedicineId = models.ForeignKey(TblMedicine, on_delete=models.CASCADE) 
    Dosage = models.CharField(max_length=100) 
    Frequency = models.CharField(max_length=100) 
    Duration = models.CharField(max_length=50) 
    AppointmentId = models.ForeignKey(TblAppointment, on_delete=models.CASCADE) 
    IsActive = models.BooleanField(default=True) 

class TblLabTestPrescription(models.Model):
    LabTestPrescriptionId = models.AutoField(primary_key=True) 
    LabTestId = models.ForeignKey(TblLabTest, on_delete=models.CASCADE) 
    LabTestValue = models.CharField(max_length=100, null=True, blank=True) 
    Remarks = models.TextField(null=True, blank=True) 
    CreatedDate = models.DateTimeField(auto_now_add=True) 
    AppointmentId = models.ForeignKey(TblAppointment, on_delete=models.CASCADE) 
    IsActive = models.BooleanField(default=True) 