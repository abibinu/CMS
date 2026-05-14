from rest_framework import serializers
from .models import TblMedicineCategory, TblMedicine, TblMedicineStock

class MedicineCategorySerializer(serializers.ModelSerializer):
    class Meta:
        model = TblMedicineCategory
        fields = '__all__'

class MedicineSerializer(serializers.ModelSerializer):
    CategoryName = serializers.CharField(source='MedicineCategoryId.MedicineCategoryName', read_only=True)

    class Meta:
        model = TblMedicine
        fields = '__all__'

class MedicineStockSerializer(serializers.ModelSerializer):
    MedicineName = serializers.CharField(source='MedicineId.MedicineName', read_only=True)

    class Meta:
        model = TblMedicineStock
        fields = '__all__'
        read_only_fields = ['CreatedDate']