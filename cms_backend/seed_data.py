import os
import django
import sys

# Setup Django environment
sys.path.append(os.path.dirname(os.path.abspath(__file__)))
os.environ.setdefault('DJANGO_SETTINGS_MODULE', 'cms_backend.settings')
django.setup()

from administrator.models import TblRole, TblSpecialization
from lab_technician.models import TblLabTestCategory, TblLabTest
from pharmacist.models import TblMedicineCategory, TblMedicine

def seed_database():
    print("Starting database seeding...")

    # 1. Seed Roles
    roles = ['Administrator', 'Receptionist', 'Doctor', 'Pharmacist', 'Lab Technician']
    print("\n--- Seeding Roles ---")
    for role_name in roles:
        role, created = TblRole.objects.get_or_create(RoleName=role_name)
        if created:
            print(f"Created role: {role_name}")
        else:
            print(f"Role already exists: {role_name}")

    # 2. Seed Specializations
    specializations = ['General Physician', 'Cardiologist', 'Dermatologist', 'Pediatrician', 'Orthopedic']
    print("\n--- Seeding Specializations ---")
    for spec_name in specializations:
        spec, created = TblSpecialization.objects.get_or_create(SpecializationName=spec_name)
        if created:
            print(f"Created specialization: {spec_name}")
        else:
            print(f"Specialization already exists: {spec_name}")

    # 3. Seed Medicine Categories
    med_categories = ['Antibiotics', 'Painkillers', 'Syrups', 'Injections', 'Vitamins & Supplements']
    print("\n--- Seeding Medicine Categories ---")
    for cat_name in med_categories:
        cat, created = TblMedicineCategory.objects.get_or_create(MedicineCategoryName=cat_name)
        if created:
            print(f"Created medicine category: {cat_name}")
        else:
            print(f"Medicine category already exists: {cat_name}")

    # 4. Seed Lab Test Categories
    lab_categories = ['Blood Work', 'Pathology', 'Imaging', 'Urine Analysis', 'Microbiology']
    print("\n--- Seeding Lab Test Categories ---")
    for cat_name in lab_categories:
        cat, created = TblLabTestCategory.objects.get_or_create(LabTestCategoryName=cat_name)
        if created:
            print(f"Created lab test category: {cat_name}")
        else:
            print(f"Lab test category already exists: {cat_name}")

    # 5. Seed some basic Lab Tests (Optional but helpful for Dashboard visualization)
    print("\n--- Seeding Basic Lab Tests ---")
    blood_work_cat = TblLabTestCategory.objects.filter(LabTestCategoryName='Blood Work').first()
    if blood_work_cat:
        lab_tests = [
            {
                'TestName': 'Complete Blood Count (CBC)',
                'Amount': 350.00,
                'ReferenceMinRange': '4.5',
                'ReferenceMaxRange': '11.0',
                'SampleRequired': 'Blood'
            },
            {
                'TestName': 'Fasting Blood Sugar (FBS)',
                'Amount': 150.00,
                'ReferenceMinRange': '70',
                'ReferenceMaxRange': '100',
                'SampleRequired': 'Blood (Fasting)'
            }
        ]
        
        for test_data in lab_tests:
            test, created = TblLabTest.objects.get_or_create(
                TestName=test_data['TestName'],
                defaults={
                    'Amount': test_data['Amount'],
                    'ReferenceMinRange': test_data['ReferenceMinRange'],
                    'ReferenceMaxRange': test_data['ReferenceMaxRange'],
                    'SampleRequired': test_data['SampleRequired'],
                    'LabTestCategoryId': blood_work_cat
                }
            )
            if created:
                print(f"Created basic lab test: {test_data['TestName']}")
            else:
                print(f"Lab test already exists: {test_data['TestName']}")

    print("\nSeeding completed successfully!")

if __name__ == '__main__':
    try:
        seed_database()
    except Exception as e:
        print(f"An error occurred during seeding: {str(e)}")
