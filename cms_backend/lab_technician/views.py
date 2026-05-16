# Lab Technician Module API Views
# Manages laboratory tests catalog and test result recording

# pyrefly: ignore [missing-import]
from rest_framework import status
# pyrefly: ignore [missing-import]
from rest_framework.decorators import api_view
# pyrefly: ignore [missing-import]
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

# API View to handle the creation of a new lab test
@api_view(['POST'])
def add_lab_test(request):
    """Create a new lab test in the catalog"""
    # Initialize the serializer with the data provided in the request
    serializer = LabTestSerializer(data=request.data)

    # Check if the provided data is valid according to the serializer's rules
    if serializer.is_valid():
        # Save the new lab test to the database
        serializer.save()

        # Return a success response with the created data and HTTP 201 Created status
        return Response(
            {
                "message": "Lab test added successfully",
                "data": serializer.data
            },
            status=status.HTTP_201_CREATED
        )

    # If the data is invalid, return the validation errors and HTTP 400 Bad Request status
    return Response(
        serializer.errors,
        status=status.HTTP_400_BAD_REQUEST
    )


# API View to handle updating an existing lab test
@api_view(['PUT'])
def update_lab_test(request, labTestId):
    """Update an existing lab test details"""
    try:
        # Attempt to retrieve the lab test from the database using the provided ID
        lab_test = TblLabTest.objects.get(
            LabTestId=labTestId
        )
    except TblLabTest.DoesNotExist:
        # If the lab test does not exist, return an error with HTTP 404 Not Found status
        return Response(
            {"error": "Lab test not found"},
            status=status.HTTP_404_NOT_FOUND
        )

    # Initialize the serializer with the existing lab test instance and the new data
    # partial=True allows partial updates (only fields provided in the request are updated)
    serializer = LabTestSerializer(
        lab_test,
        data=request.data,
        partial=True
    )

    # Check if the new data is valid
    if serializer.is_valid():
        # Save the updated lab test to the database
        serializer.save()

        # Return a success response with the updated data
        return Response(
            {
                "message": "Lab test updated successfully",
                "data": serializer.data
            }
        )

    # If the data is invalid, return the validation errors and HTTP 400 Bad Request status
    return Response(
        serializer.errors,
        status=status.HTTP_400_BAD_REQUEST
    )


# API View to retrieve details of a specific lab test
@api_view(['GET'])
def get_lab_test(request, labTestId):
    """Retrieve details of a specific lab test"""
    try:
        # Attempt to retrieve the lab test from the database using the provided ID
        lab_test = TblLabTest.objects.get(
            LabTestId=labTestId
        )
    except TblLabTest.DoesNotExist:
        # If the lab test does not exist, return an error with HTTP 404 Not Found status
        return Response(
            {"error": "Lab test not found"},
            status=status.HTTP_404_NOT_FOUND
        )

    # Serialize the lab test data
    serializer = LabTestSerializer(lab_test)

    # Return the serialized data
    return Response(serializer.data)


# API View to list all active lab tests
@api_view(['GET'])
def list_lab_tests(request):
    """List all available laboratory tests"""
    # Retrieve all lab tests from the database that are currently active
    tests = TblLabTest.objects.filter(IsActive=True)

    # Serialize the queryset of lab tests
    # many=True indicates that multiple objects are being serialized
    serializer = LabTestSerializer(
        tests,
        many=True
    )

    # Return the serialized list of lab tests
    return Response(serializer.data)


# API View to deactivate a lab test instead of deleting it (soft delete)
@api_view(['PATCH'])
def deactivate_lab_test(request, labTestId):
    """Deactivate a lab test (soft delete)"""
    try:
        # Attempt to retrieve the lab test from the database using the provided ID
        lab_test = TblLabTest.objects.get(
            LabTestId=labTestId
        )
    except TblLabTest.DoesNotExist:
        # If the lab test does not exist, return an error with HTTP 404 Not Found status
        return Response(
            {"error": "Lab test not found"},
            status=status.HTTP_404_NOT_FOUND
        )

    # Set the IsActive flag to False to signify deactivation
    lab_test.IsActive = False
    # Save the change to the database
    lab_test.save()

    # Return a success message
    return Response(
        {"message": "Lab test deactivated successfully"}
    )


# =========================================
# LAB TEST RESULT MANAGEMENT
# =========================================

# API View to record or update the result of a specific lab test prescription
@api_view(['PUT'])
def record_lab_test_result(request, labTestPrescriptionId):
    """Record and update lab test results for a patient prescription"""
    try:
        # Retrieve the specific lab test prescription from the database
        prescription = TblLabTestPrescription.objects.get(
            LabTestPrescriptionId=labTestPrescriptionId
        )

    except TblLabTestPrescription.DoesNotExist:
        # If the prescription does not exist, return an error with HTTP 404 Not Found status
        return Response(
            {"error": "Prescription not found"},
            status=status.HTTP_404_NOT_FOUND
        )

    # Initialize the serializer with the prescription instance and the incoming data
    # partial=True allows partial updates (e.g., only updating the result value and remarks)
    serializer = LabTestPrescriptionSerializer(
        prescription,
        data=request.data,
        partial=True
    )

    # Check if the incoming data is valid
    if serializer.is_valid():
        # Save the updated result to the database
        serializer.save()

        # Return a success response with the updated data
        return Response(
            {
                "message": "Lab test result recorded successfully",
                "data": serializer.data
            }
        )

    # If the data is invalid, return the validation errors and HTTP 400 Bad Request status
    return Response(
        serializer.errors,
        status=status.HTTP_400_BAD_REQUEST
    )


# API View to get all active lab test results for a specific appointment
@api_view(['GET'])
def get_lab_test_result_by_appointment(request, appointmentId):
    # Filter the database for active lab test prescriptions associated with the given appointment ID
    results = TblLabTestPrescription.objects.filter(
        AppointmentId=appointmentId,
        IsActive=True
    )

    # Serialize the queryset of results
    serializer = LabTestPrescriptionSerializer(
        results,
        many=True
    )

    # Return the serialized data
    return Response(serializer.data)


# API View to list all active lab test prescriptions (can be used for pending tests queue)
@api_view(['GET'])
def list_lab_test_results(request):
    # Retrieve optional start and end date parameters from the query string
    start_date = request.GET.get('startDate')
    end_date = request.GET.get('endDate')

    # Filter the database for all active lab test prescriptions
    queryset = TblLabTestPrescription.objects.filter(
        IsActive=True
    )

    # If start and end dates are provided, filter the results within that date range
    if start_date and end_date:
        queryset = queryset.filter(
            CreatedDate__date__range=[start_date, end_date]
        )

    # Serialize the filtered queryset
    serializer = LabTestPrescriptionSerializer(
        queryset,
        many=True
    )

    # Return the serialized data
    return Response(serializer.data)

# API View to list completed lab test results (History functionality)
@api_view(['GET'])
def list_completed_lab_test_results(request):
    """Retrieve historical/completed lab test results"""
    # Fetch inactive (completed) prescriptions
    queryset = TblLabTestPrescription.objects.filter(
        IsActive=False,
        LabTestValue__isnull=False # Ensure it actually has a result
    )
    
    serializer = LabTestPrescriptionSerializer(
        queryset,
        many=True
    )
    
    return Response(serializer.data)


# API View to deactivate a lab test prescription (usually signifies completion)
@api_view(['PATCH'])
def deactivate_lab_test_prescription(
        request,
        labTestPrescriptionId
):
    try:
        # Retrieve the specific lab test prescription from the database
        prescription = TblLabTestPrescription.objects.get(
            LabTestPrescriptionId=labTestPrescriptionId
        )

    except TblLabTestPrescription.DoesNotExist:
        # If the prescription does not exist, return an error with HTTP 404 Not Found status
        return Response(
            {"error": "Prescription not found"},
            status=status.HTTP_404_NOT_FOUND
        )

    # Set the IsActive flag to False
    # In this system, this is used to mark a prescription as processed/completed and remove it from the pending queue
    prescription.IsActive = False
    # Save the change to the database
    prescription.save()

    # Return a success message
    return Response(
        {
            "message":
            "Lab test prescription deactivated successfully"
        }
    )
