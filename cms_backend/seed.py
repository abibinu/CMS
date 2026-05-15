import os
import django

os.environ.setdefault('DJANGO_SETTINGS_MODULE', 'cms_backend.settings')
django.setup()

from administrator.models import TblRole, TblStaff
from django.contrib.auth.hashers import make_password

# Create Roles
roles = ['Administrator', 'Receptionist', 'Doctor', 'Pharmacist', 'Lab Technician']
for r in roles:
    TblRole.objects.get_or_create(RoleName=r)

admin_role = TblRole.objects.get(RoleName='Administrator')

# Create Admin User
staff, created = TblStaff.objects.get_or_create(
    UserName='admin',
    defaults={
        'FullName': 'Super Admin',
        'Gender': 'Other',
        'MobileNumber': '0000000000',
        'Password': make_password('admin'),
        'RoleId': admin_role,
        'IsActive': True
    }
)

if not created:
    staff.Password = make_password('admin')
    staff.IsActive = True
    staff.RoleId = admin_role
    staff.save()

print("Database seeded! Username: admin | Password: admin")
