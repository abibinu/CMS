from django.urls import path, include
from rest_framework.routers import DefaultRouter
from .views import DoctorViewSet, SpecializationViewSet, StaffViewSet, RoleViewSet

router = DefaultRouter()
router.register(r'staff', StaffViewSet)
router.register(r'roles', RoleViewSet)
router.register(r'specializations', SpecializationViewSet)
router.register(r'doctors', DoctorViewSet)

urlpatterns = [
    path('', include(router.urls)),
]