from rest_framework import serializers
from .models import (
    TblLabTestCategory,
    TblLabTest
)

from doctor.models import TblLabTestPrescription

class LabTestCategorySerializer(serializers.ModelSerializer):

    class Meta:
        model = TblLabTestCategory
        fields = "__all__"


class LabTestSerializer(serializers.ModelSerializer):

    category_name = serializers.CharField(
        source='LabTestCategoryId.LabTestCategoryName',
        read_only=True
    )

    class Meta:
        model = TblLabTest
        fields = "__all__"


class LabTestPrescriptionSerializer(serializers.ModelSerializer):

    test_name = serializers.CharField(
        source='LabTestId.TestName',
        read_only=True
    )

    class Meta:
        model = TblLabTestPrescription
        fields = "__all__"