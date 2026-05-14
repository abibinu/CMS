from rest_framework import serializers
from .models import TblStaff, TblRole, TblSpecialization, TblDoctor

class RoleSerializer(serializers.ModelSerializer):
    class Meta:
        model = TblRole
        fields = '__all__'

class StaffSerializer(serializers.ModelSerializer):
    # This allows us to see the role name in GET requests but use the ID for POST/PUT
    RoleName = serializers.CharField(source='RoleId.RoleName', read_only=True)

    class Meta:
        model = TblStaff
        fields = '__all__'
        extra_kwargs = {
            'Password': {'write_only': True} 
        }

class SpecializationSerializer(serializers.ModelSerializer):
    class Meta:
        model = TblSpecialization
        fields = '__all__'

class DoctorSerializer(serializers.ModelSerializer):
    DoctorName = serializers.CharField(source='StaffId.FullName', read_only=True)
    SpecializationName = serializers.CharField(source='SpecializationId.SpecializationName', read_only=True)

    class Meta:
        model = TblDoctor
        fields = '__all__'

    def validate(self, data):
        staff = data.get('StaffId')
        # Check if the linked staff member's role is exactly 'Doctor'
        if staff.RoleId.RoleName != 'Doctor':
            raise serializers.ValidationError(
                {"StaffId": f"The selected staff member ({staff.FullName}) is not assigned the 'Doctor' role."}
            )
        return data