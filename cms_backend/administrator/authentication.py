from rest_framework_simplejwt.authentication import JWTAuthentication
from rest_framework_simplejwt.exceptions import InvalidToken, AuthenticationFailed
from administrator.models import TblStaff

class CustomJWTAuthentication(JWTAuthentication):
    def get_user(self, validated_token):
        try:
            staff_id = validated_token.get('staff_id')
            if not staff_id:
                raise InvalidToken('Token contained no recognizable staff identification')
            
            user = TblStaff.objects.get(StaffId=staff_id)
            
            if not user.IsActive:
                raise AuthenticationFailed('User account is disabled', code='user_inactive')
            
            # DRF needs the user object to have an 'is_authenticated' attribute
            user.is_authenticated = True 
            return user
            
        except TblStaff.DoesNotExist:
            raise AuthenticationFailed('User not found', code='user_not_found')
