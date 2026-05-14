import os
import django

os.environ.setdefault('DJANGO_SETTINGS_MODULE', 'cms_backend.settings')
django.setup()

from administrator.models import TblRole

def seed_roles():
    roles = ['Administrator', 'Receptionist', 'Doctor', 'Pharmacist', 'Lab Technician']
    for role_name in roles:
        role, created = TblRole.objects.get_or_create(RoleName=role_name)
        if created:
            print(f"Created role: {role_name}")
        else:
            print(f"Role already exists: {role_name}")

if __name__ == "__main__":
    seed_roles()