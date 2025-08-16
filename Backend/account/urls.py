from django.urls import path
from .views import SignupAPIView, LoginAPIView, ForgotPasswordAPIView, ResetPasswordAPIView,RefreshTokenAPIView, UpdateUserProfileAPIView,UserProfileAPIView

urlpatterns = [
    path('signup/', SignupAPIView.as_view(), name='user-signup'),
    path('login/', LoginAPIView.as_view(), name='login'),
    path('forgot-password/', ForgotPasswordAPIView.as_view(), name='forgot-password'),
    path('reset-password/', ResetPasswordAPIView.as_view(), name='reset-password'),
    path('refresh/', RefreshTokenAPIView.as_view(), name='token_refresh'),
    path("user-profile/", UserProfileAPIView.as_view(), name="user-profile"),
    path("update-profile/", UpdateUserProfileAPIView.as_view(), name="update-profile"),
]
