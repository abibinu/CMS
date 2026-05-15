# Receptionist Module Models
# Manages patient registration, appointment scheduling, and billing operations

from django.db import models
from administrator.models import TblDoctor

# Membership plans for patients
class TblMembership(models.Model):
    """Membership types available for patient registration"""
    MembershipId = models.AutoField(primary_key=True)
    MembershipType = models.CharField(max_length=50)  # e.g., 'Silver', 'Gold', 'Platinum'
    IsActive = models.BooleanField(default=True)

    def __str__(self):
        return self.MembershipType

# Patient profiles
class TblPatient(models.Model):
    """Patient information registered at the clinic"""
    PatientId = models.AutoField(primary_key=True) 
    PatientName = models.CharField(max_length=100)  # Full name of patient
    DateOfBirth = models.DateField()  # Birth date for age calculation
    Gender = models.CharField(max_length=10)  # Male/Female
    MobileNumber = models.CharField(max_length=15)  # Contact for appointments
    Address = models.TextField()  # Residential address
    MembershipId = models.ForeignKey(TblMembership, on_delete=models.SET_NULL, null=True)  # Membership plan
    IsActive = models.BooleanField(default=True)  # Soft delete flag

    def __str__(self):
        return self.PatientName

# Appointment scheduling
class TblAppointment(models.Model):
    """Doctor appointment bookings for patients"""
    AppointmentId = models.AutoField(primary_key=True) 
    AppointmentDate = models.DateField()  # Date of appointment
    TokenNumber = models.IntegerField()  # Queue token for consultation
    ConsultationStatus = models.CharField(max_length=20, default='Scheduled')  # Status tracking
    PatientId = models.ForeignKey(TblPatient, on_delete=models.CASCADE)  # Patient booking appointment
    DoctorId = models.ForeignKey(TblDoctor, on_delete=models.CASCADE)  # Assigned doctor
    IsActive = models.BooleanField(default=True)

    def __str__(self):
        return f"Appointment {self.AppointmentId} - {self.PatientId.PatientName}"

# Billing for consultations
class TblBilling(models.Model):
    """Invoice generation for clinic services"""
    BillId = models.AutoField(primary_key=True)
    AppointmentId = models.ForeignKey(TblAppointment, on_delete=models.CASCADE)  # Links to appointment
    ConsultationFee = models.DecimalField(max_digits=10, decimal_places=2)  # Doctor's consultation charge
    RegistrationCharge = models.DecimalField(max_digits=10, decimal_places=2, default=0.00)  # Registration fee
    AdditionalCharges = models.DecimalField(max_digits=10, decimal_places=2, default=0.00)  # Extra charges
    TotalAmount = models.DecimalField(max_digits=10, decimal_places=2)  # Total bill amount
    BillDate = models.DateTimeField(auto_now_add=True)  # Invoice date/time
    IsActive = models.BooleanField(default=True)

    def __str__(self):
        return f"Bill {self.BillId} - {self.AppointmentId.PatientId.PatientName}"