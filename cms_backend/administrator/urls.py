from django.urls import path, include
from rest_framework.routers import DefaultRouter
from .views import StaffViewSet

router = DefaultRouter()
router.register(r'staff', StaffViewSet) # This creates /api/staff/ automatically

urlpatterns = [
    path('', include(router.urls)),
]