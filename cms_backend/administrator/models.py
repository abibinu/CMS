# Administrator Module Models
# Handles system-wide staff, roles, specializations, and doctor profiles

from django.db import models
from django.contrib.auth.hashers import make_password

# Role-based access control model
class TblRole(models.Model):
    """Defines clinic staff roles (Admin, Receptionist, Doctor, Pharmacist, Lab Technician)"""
    RoleId = models.AutoField(primary_key=True) 
    RoleName = models.CharField(max_length=50)  # e.g., 'Administrator', 'Doctor'
    IsActive = models.BooleanField(default=True)

    def __str__(self):
        return self.RoleName

# Staff member profile
class TblStaff(models.Model):
    """Manages all clinic staff members with authentication credentials"""
    StaffId = models.AutoField(primary_key=True)
    FullName = models.CharField(max_length=100)  # Staff member's full name
    Gender = models.CharField(max_length=10)  # Male/Female
    JoiningDate = models.DateField(auto_now_add=True)  # Auto-set to current date
    MobileNumber = models.CharField(max_length=15)  # Contact number
    UserName = models.CharField(max_length=50, unique=True)  # Login credential
    Password = models.CharField(max_length=255)  # Hashed password
    RoleId = models.ForeignKey(TblRole, on_delete=models.CASCADE)  # Links to staff role
    IsActive = models.BooleanField(default=True)  # Soft delete flag

    def save(self, *args, **kwargs):
        # Hash password on first save
        if not self.pk:
            self.Password = make_password(self.Password) 
        super().save(*args, **kwargs)

    def __str__(self):
        return f"{self.FullName} ({self.UserName})"

# Medical specialization
class TblSpecialization(models.Model):
    """Medical specializations available at the clinic"""
    SpecializationId = models.AutoField(primary_key=True) 
    SpecializationName = models.CharField(max_length=100)  # e.g., 'Cardiology', 'Dermatology'

    def __str__(self):
        return self.SpecializationName

# Doctor profile
class TblDoctor(models.Model):
    """Doctor profiles with consultation fees and specializations"""
    DoctorId = models.AutoField(primary_key=True) 
    ConsultationFee = models.DecimalField(max_digits=10, decimal_places=2)  # Charge per consultation
    SpecializationId = models.ForeignKey(TblSpecialization, on_delete=models.CASCADE)  # Medical field
    StaffId = models.ForeignKey(TblStaff, on_delete=models.CASCADE)  # Links to staff record
    IsActive = models.BooleanField(default=True)  # Soft delete flag

    def __str__(self):
        return f"Dr. {self.StaffId.FullName}"