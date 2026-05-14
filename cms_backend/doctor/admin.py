from django.contrib import admin
from .models import TblConsultation, TblMedicinePrescription, TblLabTestPrescription

admin.site.register(TblConsultation)
admin.site.register(TblMedicinePrescription)
admin.site.register(TblLabTestPrescription)