from django.contrib import admin
from django.urls import path, include

urlpatterns = [
    path('admin/', admin.site.urls),
    path('api/', include('administrator.urls')),
    path('api/', include('receptionist.urls')),
    path('api/', include('lab_technician.urls')), 
]