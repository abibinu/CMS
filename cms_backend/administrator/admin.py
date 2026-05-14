from django.contrib import admin
from .models import TblRole, TblStaff, TblSpecialization, TblDoctor

admin.site.register(TblRole)
admin.site.register(TblStaff)
admin.site.register(TblSpecialization)
admin.site.register(TblDoctor)