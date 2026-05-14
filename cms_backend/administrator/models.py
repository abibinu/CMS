from django.db import models
from django.contrib.auth.hashers import make_password

class TblRole(models.Model):
    RoleId = models.AutoField(primary_key=True) 
    RoleName = models.CharField(max_length=50) 
    IsActive = models.BooleanField(default=True) 

    def __str__(self):
        return self.RoleName

class TblStaff(models.Model):
    StaffId = models.AutoField(primary_key=True) 
    FullName = models.CharField(max_length=100) 
    Gender = models.CharField(max_length=10) 
    JoiningDate = models.DateField(auto_now_add=True) 
    MobileNumber = models.CharField(max_length=15) 
    UserName = models.CharField(max_length=50, unique=True) 
    Password = models.CharField(max_length=255) 
    RoleId = models.ForeignKey(TblRole, on_delete=models.CASCADE) 
    IsActive = models.BooleanField(default=True) 

    def save(self, *args, **kwargs):
        if not self.pk or self.Password:
            self.Password = make_password(self.Password)
        super(TblStaff, self).save(*args, **kwargs)

    def __str__(self):
        return self.FullName

class TblSpecialization(models.Model):
    SpecializationId = models.AutoField(primary_key=True) 
    SpecializationName = models.CharField(max_length=100) 

    def __str__(self):
        return self.SpecializationName

class TblDoctor(models.Model):
    DoctorId = models.AutoField(primary_key=True) 
    ConsultationFee = models.DecimalField(max_digits=10, decimal_places=2) 
    SpecializationId = models.ForeignKey(TblSpecialization, on_delete=models.CASCADE) 
    StaffId = models.ForeignKey(TblStaff, on_delete=models.CASCADE) 
    IsActive = models.BooleanField(default=True) 

    def __str__(self):
        return f"Dr. {self.StaffId.FullName}"