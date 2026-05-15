from django.urls import path, include
from rest_framework.routers import DefaultRouter
from administrator.auth_views import StaffLoginView, LogoutView
from .views import DoctorViewSet, SpecializationViewSet, StaffViewSet, RoleViewSet

router = DefaultRouter()
router.register(r'staff', StaffViewSet)
router.register(r'roles', RoleViewSet)
router.register(r'specializations', SpecializationViewSet)
router.register(r'doctors', DoctorViewSet)

urlpatterns = [
    path('auth/login/', StaffLoginView.as_view(), name='staff-login'),
    path('auth/logout/', LogoutView.as_view(), name='staff-logout'),
    path('', include(router.urls)),
]