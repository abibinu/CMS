from django.urls import path, include
from rest_framework.routers import DefaultRouter
from .views import MedicineCategoryViewSet, MedicineViewSet, MedicineStockViewSet

router = DefaultRouter()
router.register(r'categories', MedicineCategoryViewSet)
router.register(r'medicines', MedicineViewSet)
router.register(r'inventory', MedicineStockViewSet)

urlpatterns = [
    path('', include(router.urls)),
]