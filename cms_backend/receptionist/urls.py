from django.urls import path, include
from rest_framework.routers import DefaultRouter
from .views import AppointmentViewSet, BillingViewSet, MembershipViewSet, PatientViewSet

router = DefaultRouter()
router.register(r'memberships', MembershipViewSet)
router.register(r'patients', PatientViewSet)
router.register(r'appointments', AppointmentViewSet) 
router.register(r'billing', BillingViewSet)

urlpatterns = [
    path('', include(router.urls)),
]