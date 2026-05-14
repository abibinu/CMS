from django.db import models
from administrator.models import TblDoctor

class TblMembership(models.Model):
    MembershipId = models.AutoField(primary_key=True)
    MembershipType = models.CharField(max_length=50) 
    IsActive = models.BooleanField(default=True) 

    def __str__(self):
        return self.MembershipType

class TblPatient(models.Model):
    PatientId = models.AutoField(primary_key=True) 
    PatientName = models.CharField(max_length=100) 
    DateOfBirth = models.DateField() 
    Gender = models.CharField(max_length=10) 
    MobileNumber = models.CharField(max_length=15) 
    Address = models.TextField() 
    MembershipId = models.ForeignKey(TblMembership, on_delete=models.SET_NULL, null=True) 
    IsActive = models.BooleanField(default=True) 

    def __str__(self):
        return self.PatientName

class TblAppointment(models.Model):
    AppointmentId = models.AutoField(primary_key=True) 
    AppointmentDate = models.DateField() 
    TokenNumber = models.IntegerField() 
    ConsultationStatus = models.CharField(max_length=20, default='Scheduled') 
    PatientId = models.ForeignKey(TblPatient, on_delete=models.CASCADE) 
    DoctorId = models.ForeignKey(TblDoctor, on_delete=models.CASCADE) 
    IsActive = models.BooleanField(default=True)

    def __str__(self):
        return f"Appointment {self.AppointmentId} - {self.PatientId.PatientName}"

class TblBilling(models.Model):
    BillId = models.AutoField(primary_key=True)
    AppointmentId = models.ForeignKey(TblAppointment, on_delete=models.CASCADE)
    ConsultationFee = models.DecimalField(max_digits=10, decimal_places=2)
    RegistrationCharge = models.DecimalField(max_digits=10, decimal_places=2, default=0.00)
    AdditionalCharges = models.DecimalField(max_digits=10, decimal_places=2, default=0.00)
    TotalAmount = models.DecimalField(max_digits=10, decimal_places=2)
    BillDate = models.DateTimeField(auto_now_add=True)
    IsActive = models.BooleanField(default=True)

    def __str__(self):
        return f"Bill {self.BillId} - {self.AppointmentId.PatientId.PatientName}"