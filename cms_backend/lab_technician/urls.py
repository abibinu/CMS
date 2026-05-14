from django.urls import path
from . import views

urlpatterns = [
    # =====================================
    # LAB TEST MANAGEMENT
    # =====================================
    path('labtests/', views.add_lab_test),
    path('labtests/<int:labTestId>/', views.update_lab_test),
    path('labtests/<int:labTestId>/details/', views.get_lab_test),
    path('labtests/list/', views.list_lab_tests),
    path('labtests/<int:labTestId>/deactivate/', views.deactivate_lab_test),

    # =====================================
    # LAB TEST RESULT MANAGEMENT
    # =====================================
    path('labtests/results/<int:labTestPrescriptionId>/', views.record_lab_test_result),
    path('labtests/results/appointment/<int:appointmentId>/', views.get_lab_test_result_by_appointment),
    path('labtests/results/', views.list_lab_test_results),
    path('labtests/<int:labTestPrescriptionId>/deactivate/', views.deactivate_lab_test_prescription),
]