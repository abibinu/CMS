from django.urls import path, include
from rest_framework.routers import DefaultRouter
from .views import ConsultationViewSet, MedicinePrescriptionViewSet, LabTestPrescriptionViewSet

router = DefaultRouter()
router.register(r'consultations', ConsultationViewSet)
router.register(r'prescriptions/medicine', MedicinePrescriptionViewSet)
router.register(r'prescriptions/labtest', LabTestPrescriptionViewSet)

urlpatterns = [
    path('', include(router.urls)),
]