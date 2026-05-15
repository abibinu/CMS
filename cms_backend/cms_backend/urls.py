# Main URL router for the Clinic Management System backend
# Routes API requests to role-specific modules based on endpoint
from django.contrib import admin
from django.urls import path, include

urlpatterns = [
    # Django admin interface
    path('admin/', admin.site.urls),
    
    # API endpoints for each clinic module
    path('api/', include('administrator.urls')),      # Staff, roles, doctors, auth
    path('api/', include('receptionist.urls')),       # Patients, appointments, billing
    path('api/', include('doctor.urls')),             # Consultations, prescriptions
    path('api/', include('lab_technician.urls')),     # Lab tests and categories
    path('api/pharmacist/', include('pharmacist.urls')) # Medicine inventory and dispensing
]