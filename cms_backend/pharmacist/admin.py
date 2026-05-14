from django.contrib import admin
from .models import TblMedicineCategory, TblMedicine, TblMedicineStock

admin.site.register(TblMedicineCategory)
admin.site.register(TblMedicine)
admin.site.register(TblMedicineStock)