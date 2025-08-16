from rest_framework import serializers
from .models import User, PasswordReset
from django.contrib.auth.hashers import make_password
from .validators import validate_password

# Serializer for user registration
class SignupSerializer(serializers.ModelSerializer):
    confirm_password = serializers.CharField(write_only=True)

    class Meta:
        model = User
        fields = ['username', 'email', 'password', 'confirm_password']

    def validate(self, data):
        if data['password'] != data['confirm_password']:
            raise serializers.ValidationError({"password": "Passwords do not match."})
        validate_password(data['password'], data['email'], data['username'])
        if User.objects.filter(username=data['username']).exists():
            raise serializers.ValidationError({"username": "Username already exists."})
        if User.objects.filter(email=data['email']).exists():
            raise serializers.ValidationError({"email": "Email already exists."})
        return data

    def create(self, validated_data):
        validated_data.pop('confirm_password')
        validated_data['password'] = make_password(validated_data['password'])
        return User.objects.create(**validated_data)

# Serializer for user login
class LoginSerializer(serializers.Serializer):
    username = serializers.CharField()
    password = serializers.CharField()

# Serializer for updating user profile with password verification
class UpdateUserSerializer(serializers.Serializer):
    username = serializers.CharField(required=False)
    email = serializers.EmailField(required=False)
    password = serializers.CharField(write_only=True)

    def validate(self, data):
        user = self.context["request"].user
        if not user.check_password(data["password"]):
            raise serializers.ValidationError({"password": "Incorrect password."})
        if "email" in data and User.objects.filter(email=data["email"]).exclude(id=user.id).exists():
            raise serializers.ValidationError({"email": "This email is already in use."})
        if "username" in data and User.objects.filter(username=data["username"]).exclude(id=user.id).exists():
            raise serializers.ValidationError({"username": "This username is already taken."})
        return data

    def update(self, instance, validated_data):
        instance.username = validated_data.get("username", instance.username)
        instance.email = validated_data.get("email", instance.email)
        instance.save()
        return instance

# Serializer for password reset request (forgot password)
class ForgotPasswordSerializer(serializers.Serializer):
    email = serializers.EmailField()

    def validate_email(self, value):
        if not User.objects.filter(email=value).exists():
            raise serializers.ValidationError("Email not found.")
        return value

# Serializer for resetting the password using a token
class ResetPasswordSerializer(serializers.Serializer):
    token = serializers.CharField()
    new_password = serializers.CharField(min_length=8)
    confirm_new_password = serializers.CharField(min_length=8)

    def validate_token(self, value):
        try:
            reset_entry = PasswordReset.objects.get(token=value)
            if reset_entry.is_expired():
                raise serializers.ValidationError("Token has expired.")
            if reset_entry.is_used:
                raise serializers.ValidationError("Token has already been used.")
        except PasswordReset.DoesNotExist:
            raise serializers.ValidationError("Invalid token.")
        return value

    def validate(self, data):
        if data['new_password'] != data['confirm_new_password']:
            raise serializers.ValidationError({"new_password": "Passwords do not match."})
        validate_password(data['new_password'], None, None)
        return data

    def validate_new_password(self, value):
        validate_password(value, None, None)
        return value