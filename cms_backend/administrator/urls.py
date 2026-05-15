# Administrator Module API Routes
# Provides endpoints for authentication, staff management, roles, specializations, and doctors

from django.urls import path, include
from rest_framework.routers import DefaultRouter
from administrator.auth_views import StaffLoginView, LogoutView
from .views import DoctorViewSet, SpecializationViewSet, StaffViewSet, RoleViewSet

# REST API router for standard CRUD operations
router = DefaultRouter()
router.register(r'staff', StaffViewSet)  # /api/staff/ - CRUD staff members
router.register(r'roles', RoleViewSet)  # /api/roles/ - List available roles
router.register(r'specializations', SpecializationViewSet)  # /api/specializations/ - Medical fields
router.register(r'doctors', DoctorViewSet)  # /api/doctors/ - Doctor profiles and fees

urlpatterns = [
    # Authentication endpoints
    path('auth/login/', StaffLoginView.as_view(), name='staff-login'),  # JWT login
    path('auth/logout/', LogoutView.as_view(), name='staff-logout'),  # Logout
    path('', include(router.urls)),
]