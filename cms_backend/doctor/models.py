# Doctor Module Models
# Handles consultation records, medicine prescriptions, and lab test orders

from django.db import models
from receptionist.models import TblAppointment
from pharmacist.models import TblMedicine
from lab_technician.models import TblLabTest

# Consultation records
class TblConsultation(models.Model):
    """Doctor consultation records with symptoms, diagnosis, and clinical notes"""
    ConsultationId = models.AutoField(primary_key=True) 
    Symptoms = models.TextField()  # Patient symptoms reported
    Diagnosis = models.TextField()  # Doctor's diagnosis
    Notes = models.TextField()  # Additional clinical notes
    CreatedDate = models.DateTimeField(auto_now_add=True)  # Consultation timestamp
    AppointmentId = models.ForeignKey(TblAppointment, on_delete=models.CASCADE)  # Associated appointment
    IsActive = models.BooleanField(default=True)

# Medicine prescriptions
class TblMedicinePrescription(models.Model):
    """Medicines prescribed to patients with dosage and frequency"""
    MedicinePrescriptionId = models.AutoField(primary_key=True) 
    MedicineId = models.ForeignKey(TblMedicine, on_delete=models.CASCADE)  # Medicine ordered
    Dosage = models.CharField(max_length=100)  # e.g., '500mg'
    Frequency = models.CharField(max_length=100)  # e.g., 'Twice daily'
    Duration = models.CharField(max_length=50)  # e.g., '7 days'
    AppointmentId = models.ForeignKey(TblAppointment, on_delete=models.CASCADE)  # Associated appointment
    IsActive = models.BooleanField(default=True)

# Lab test prescriptions
class TblLabTestPrescription(models.Model):
    """Lab tests prescribed for patients with reference values and results"""
    LabTestPrescriptionId = models.AutoField(primary_key=True) 
    LabTestId = models.ForeignKey(TblLabTest, on_delete=models.CASCADE)  # Lab test type
    LabTestValue = models.CharField(max_length=100, null=True, blank=True)  # Test result value
    Remarks = models.TextField(null=True, blank=True)  # Clinical remarks on test results
    CreatedDate = models.DateTimeField(auto_now_add=True)  # Test order timestamp
    AppointmentId = models.ForeignKey(TblAppointment, on_delete=models.CASCADE)  # Associated appointment
    IsActive = models.BooleanField(default=True) 