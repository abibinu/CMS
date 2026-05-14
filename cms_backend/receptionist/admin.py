from django.contrib import admin
from .models import TblMembership, TblPatient, TblAppointment

admin.site.register(TblMembership)
admin.site.register(TblPatient)
admin.site.register(TblAppointment)