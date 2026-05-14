import os
import django

os.environ.setdefault('DJANGO_SETTINGS_MODULE', 'cms_backend.settings')
django.setup()

from administrator.models import TblRole

def seed_roles():
    roles = ['Administrator', 'Receptionist', 'Doctor', 'Pharmacist', 'Lab Technician']
    for name in roles:
        role, created = TblRole.objects.get_or_create(RoleName=name)
        if created:
            print(f"Successfully seeded role: {name}")
        else:
            print(f"Role already exists: {name}")

if __name__ == "__main__":
    seed_roles()