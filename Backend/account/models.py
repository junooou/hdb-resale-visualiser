from django.db import models
from django.contrib.auth.models import User
from django.utils import timezone
from datetime import timedelta
from django.contrib.auth.models import AbstractUser


# Model for User class
class User(AbstractUser):
    REQUIRED_FIELDS = ['email']

    def __str__(self):
        return self.username


# Model for PasswordResetToken
class PasswordReset(models.Model):
    user = models.ForeignKey(User, on_delete=models.CASCADE)
    token = models.CharField(max_length=32, unique=True)
    created_at = models.DateTimeField(auto_now_add=True)
    expiration_time = models.DateTimeField(default=lambda: timezone.now() + timedelta(hours=1))
    is_used = models.BooleanField(default=False)

    def is_expired(self):
        return timezone.now() > self.expiration_time

    def __str__(self):
        return f"Password reset for {self.user.username} ({self.token})"