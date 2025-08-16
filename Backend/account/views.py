from rest_framework.views import APIView
from rest_framework.response import Response
from rest_framework import status
from django.contrib.auth import authenticate
from account.models import User
from django.contrib.auth.hashers import make_password
from .models import PasswordReset
from django.core.mail import send_mail
from django.utils.crypto import get_random_string
from django.conf import settings
from .tokens import custom_token_generator
from datetime import datetime, timedelta
from django.utils import timezone
from rest_framework_simplejwt.tokens import RefreshToken
from rest_framework_simplejwt.views import TokenRefreshView
from rest_framework.permissions import IsAuthenticated
from .serializers import (SignupSerializer, LoginSerializer, ForgotPasswordSerializer, ResetPasswordSerializer, UpdateUserSerializer)


# Sign up API
class SignupAPIView(APIView):
    def post(self, request):
        serializer = SignupSerializer(data=request.data)
        if serializer.is_valid():
            serializer.save()
            return Response({"detail": "Signup successful!"}, status=status.HTTP_201_CREATED)
        return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)

# Login API
class LoginAPIView(APIView):
    def post(self, request):
        serializer = LoginSerializer(data=request.data)

        if serializer.is_valid():
            username = serializer.validated_data['username']
            password = serializer.validated_data['password']
            user = authenticate(username=username, password=password)

            if user is None:
                return Response({"detail": "Invalid credentials."}, status=status.HTTP_401_UNAUTHORIZED)

            if not user.is_active:
                return Response({"detail": "User account is inactive."}, status=status.HTTP_401_UNAUTHORIZED)

            refresh = RefreshToken.for_user(user)
            return Response({
                "access": str(refresh.access_token),
                "refresh": str(refresh),
                "detail": "Login successful!"
            }, status=status.HTTP_200_OK)

        return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)

# Refresh Token (JWTs)
class RefreshTokenAPIView(TokenRefreshView):
    def post(self, request):
        refresh_token = request.data.get("refresh")

        try:
            refresh = RefreshToken(refresh_token)
            return Response({"access": str(refresh.access_token)}, status=status.HTTP_200_OK)
        except Exception:
            return Response({"detail": "Invalid refresh token."}, status=status.HTTP_401_UNAUTHORIZED)

# Open Profile of current User
class UserProfileAPIView(APIView):
    permission_classes = [IsAuthenticated]

    def get(self, request):
        user = request.user
        return Response({
            "username": user.username,
            "email": user.email,
            "first_name": user.first_name,
            "last_name": user.last_name,
            "date_joined": user.date_joined.strftime("%Y-%m-%d"),
        })

# Update Profile of current User
class UpdateUserProfileAPIView(APIView):
    permission_classes = [IsAuthenticated]

    def put(self, request):
        serializer = UpdateUserSerializer(data=request.data, context={"request": request})

        if serializer.is_valid():
            user = request.user
            serializer.update(user, serializer.validated_data)
            return Response({"username": user.username, "email": user.email}, status=status.HTTP_200_OK)

        return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)
    
# Reset Password API (Change Password)
class ResetPasswordAPIView(APIView):
    def post(self, request):
        serializer = ResetPasswordSerializer(data=request.data)

        if serializer.is_valid():
            token = serializer.validated_data['token']
            new_password = serializer.validated_data['new_password']

            try:
                password_reset_entry = PasswordReset.objects.get(token=token)
                user = password_reset_entry.user
                user.password = make_password(new_password)
                user.save()
                password_reset_entry.delete()

                return Response({"detail": "Password has been reset successfully."}, status=status.HTTP_200_OK)

            except PasswordReset.DoesNotExist:
                return Response({"detail": "Invalid token."}, status=status.HTTP_400_BAD_REQUEST)

        return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)
    
# Forget Password API  (Send Email)
class ForgotPasswordAPIView(APIView):
    def post(self, request):
        serializer = ForgotPasswordSerializer(data=request.data)

        if serializer.is_valid():
            email = serializer.validated_data['email']
            user = User.objects.get(email=email)
            token = custom_token_generator.make_token(user)
            reset_link = f"{settings.FRONTEND_URL}/reset-password/{token}"

            PasswordReset.objects.create(
                user=user,
                token=token,
                expiration_time=timezone.now() + timedelta(hours=1)
            )

            email_body = password_reset_email_format(reset_link)

            send_mail(
                'Password Reset Request',
                email_body,
                settings.DEFAULT_FROM_EMAIL,
                [email],
                fail_silently=False,
            )

            return Response({"detail": "Password reset instructions sent to your email."}, status=status.HTTP_200_OK)

        return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)

# Email format for Reset Password API
def password_reset_email_format(reset_link):
    current_time = datetime.now().strftime("%Y-%m-%d %H:%M:%S")
    return f"""
    Hello,

    We received a request to reset your password on {current_time}.

    To reset your password, please click the link below:
    {reset_link}

    If you did not request this, you can safely ignore this email.

    Best regards,  
    HDB Resale Support Team
    """