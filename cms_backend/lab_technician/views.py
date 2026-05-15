# Lab Technician Module API Views
# Manages laboratory tests catalog and test result recording

from rest_framework import status
from rest_framework.decorators import api_view
from rest_framework.response import Response

from .models import TblLabTest
from doctor.models import TblLabTestPrescription

from .serializers import (
    LabTestSerializer,
    LabTestPrescriptionSerializer
)


# =========================================
# LAB TEST CATALOG MANAGEMENT
# =========================================

@api_view(['POST'])
def add_lab_test(request):
    """Create a new lab test in the catalog"""
    serializer = LabTestSerializer(data=request.data)

    if serializer.is_valid():
        serializer.save()

        return Response(
            {
                "message": "Lab test added successfully",
                "data": serializer.data
            },
            status=status.HTTP_201_CREATED
        )

    return Response(
        serializer.errors,
        status=status.HTTP_400_BAD_REQUEST
    )


@api_view(['PUT'])
def update_lab_test(request, labTestId):
    """Update an existing lab test details"""
    try:
        lab_test = TblLabTest.objects.get(
            LabTestId=labTestId
        )
    except TblLabTest.DoesNotExist:
        return Response(
            {"error": "Lab test not found"},
            status=status.HTTP_404_NOT_FOUND
        )

    serializer = LabTestSerializer(
        lab_test,
        data=request.data,
        partial=True
    )

    if serializer.is_valid():
        serializer.save()

        return Response(
            {
                "message": "Lab test updated successfully",
                "data": serializer.data
            }
        )

    return Response(
        serializer.errors,
        status=status.HTTP_400_BAD_REQUEST
    )


@api_view(['GET'])
def get_lab_test(request, labTestId):
    """Retrieve details of a specific lab test"""
    try:
        lab_test = TblLabTest.objects.get(
            LabTestId=labTestId
        )
    except TblLabTest.DoesNotExist:
        return Response(
            {"error": "Lab test not found"},
            status=status.HTTP_404_NOT_FOUND
        )

    serializer = LabTestSerializer(lab_test)

    return Response(serializer.data)


@api_view(['GET'])
def list_lab_tests(request):
    """List all available laboratory tests"""
    tests = TblLabTest.objects.filter(IsActive=True)

    serializer = LabTestSerializer(
        tests,
        many=True
    )

    return Response(serializer.data)


@api_view(['PATCH'])
def deactivate_lab_test(request, labTestId):
    """Deactivate a lab test (soft delete)"""
    try:
        lab_test = TblLabTest.objects.get(
            LabTestId=labTestId
        )
    except TblLabTest.DoesNotExist:
        return Response(
            {"error": "Lab test not found"},
            status=status.HTTP_404_NOT_FOUND
        )

    lab_test.IsActive = False
    lab_test.save()

    return Response(
        {"message": "Lab test deactivated successfully"}
    )


# =========================================
# LAB TEST RESULT MANAGEMENT
# =========================================

@api_view(['PUT'])
def record_lab_test_result(request, labTestPrescriptionId):
    """Record and update lab test results for a patient prescription"""
    try:
        prescription = TblLabTestPrescription.objects.get(
            LabTestPrescriptionId=labTestPrescriptionId
        )

    except TblLabTestPrescription.DoesNotExist:
        return Response(
            {"error": "Prescription not found"},
            status=status.HTTP_404_NOT_FOUND
        )

    serializer = LabTestPrescriptionSerializer(
        prescription,
        data=request.data,
        partial=True
    )

    if serializer.is_valid():
        serializer.save()

        return Response(
            {
                "message": "Lab test result recorded successfully",
                "data": serializer.data
            }
        )

    return Response(
        serializer.errors,
        status=status.HTTP_400_BAD_REQUEST
    )


@api_view(['GET'])
def get_lab_test_result_by_appointment(request, appointmentId):

    results = TblLabTestPrescription.objects.filter(
        AppointmentId=appointmentId,
        IsActive=True
    )

    serializer = LabTestPrescriptionSerializer(
        results,
        many=True
    )

    return Response(serializer.data)


@api_view(['GET'])
def list_lab_test_results(request):

    start_date = request.GET.get('startDate')
    end_date = request.GET.get('endDate')

    queryset = TblLabTestPrescription.objects.filter(
        IsActive=True
    )

    if start_date and end_date:
        queryset = queryset.filter(
            CreatedDate__date__range=[start_date, end_date]
        )

    serializer = LabTestPrescriptionSerializer(
        queryset,
        many=True
    )

    return Response(serializer.data)


@api_view(['PATCH'])
def deactivate_lab_test_prescription(
        request,
        labTestPrescriptionId
):

    try:
        prescription = TblLabTestPrescription.objects.get(
            LabTestPrescriptionId=labTestPrescriptionId
        )

    except TblLabTestPrescription.DoesNotExist:
        return Response(
            {"error": "Prescription not found"},
            status=status.HTTP_404_NOT_FOUND
        )

    prescription.IsActive = False
    prescription.save()

    return Response(
        {
            "message":
            "Lab test prescription deactivated successfully"
        }
    )