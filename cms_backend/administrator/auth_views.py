from rest_framework.views import APIView
from rest_framework.response import Response
from rest_framework import status
from rest_framework.permissions import AllowAny, IsAuthenticated
from django.contrib.auth.hashers import check_password
from rest_framework_simplejwt.tokens import RefreshToken
from .models import TblStaff

class StaffLoginView(APIView):
    permission_classes = [AllowAny]

    def post(self, request):
        username = request.data.get('username')
        password = request.data.get('password')

        if not username or not password:
            return Response({"error": "Username and password are required"}, status=status.HTTP_400_BAD_REQUEST)

        try:
            # 1. Find the user
            staff = TblStaff.objects.get(UserName=username, IsActive=True)
            
            # 2. Verify the hashed password
            if check_password(password, staff.Password):
                
                # 3. Mint the JWT Token with custom claims
                refresh = RefreshToken()
                refresh['staff_id'] = staff.StaffId
                refresh['role'] = staff.RoleId.RoleName
                refresh['name'] = staff.FullName

                return Response({
                    "message": "Login successful",
                    "access_token": str(refresh.access_token),
                    "role": staff.RoleId.RoleName,
                    "staff_id": staff.StaffId
                }, status=status.HTTP_200_OK)
            else:
                return Response({"error": "Invalid password"}, status=status.HTTP_401_UNAUTHORIZED)
                
        except TblStaff.DoesNotExist:
            return Response({"error": "Invalid username or account is inactive"}, status=status.HTTP_401_UNAUTHORIZED)

class LogoutView(APIView):
    permission_classes = [IsAuthenticated]

    def post(self, request):
        try:
            refresh_token = request.data["refresh"]
            token = RefreshToken(refresh_token)
            token.blacklist()
            return Response({"message": "Logout successful"}, status=status.HTTP_205_RESET_CONTENT)
        except Exception as e:
            return Response({"error": "Invalid or missing refresh token"}, status=status.HTTP_400_BAD_REQUEST)