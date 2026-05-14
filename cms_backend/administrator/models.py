from django.db import models
from django.contrib.auth.hashers import make_password

class TblRole(models.Model):
    # Defining roles like Admin, Receptionist, Doctor, etc. 
    RoleName = models.CharField(max_length=50, unique=True)

    def __str__(self):
        return self.RoleName

class TblStaff(models.Model):
    # Core staff profile fields [cite: 21]
    EmpID = models.CharField(max_length=20, unique=True)
    Name = models.CharField(max_length=100)
    Email = models.EmailField(unique=True)
    Password = models.CharField(max_length=255)
    Contact = models.CharField(max_length=15)
    Gender = models.CharField(max_length=10)
    Address = models.TextField()
    Salary = models.DecimalField(max_digits=10, decimal_places=2)
    
    # Linking staff to a specific role [cite: 25]
    Role = models.ForeignKey(TblRole, on_delete=models.CASCADE)
    
    # Soft delete status [cite: 39]
    IsActive = models.BooleanField(default=True)
    CreatedAt = models.DateTimeField(auto_now_add=True)

    def save(self, *args, **kwargs):
        # Hash the password before saving to the database [cite: 24]
        if not self.id or 'password' in self.get_dirty_fields():
            self.Password = make_password(self.Password)
        super(TblStaff, self).save(*args, **kwargs)

    def __str__(self):
        return f"{self.Name} ({self.EmpID})"