from django.urls import path
from rest_framework_simplejwt.views import TokenRefreshView

from .views import (
    RegisterView,
    LoginView,
    MeView,
    LogoutView,
    ChangePasswordView,
    FleetManagerOnlyView,
)

urlpatterns = [
    # Register
    path("register/", RegisterView.as_view(), name="register"),

    # Login
    path("login/", LoginView.as_view(), name="token_obtain_pair"),

    # Refresh Token
    path("token/refresh/", TokenRefreshView.as_view(), name="token_refresh"),

    # Current User
    path("me/", MeView.as_view(), name="me"),

    # Logout
    path("logout/", LogoutView.as_view(), name="logout"),

    # Change Password
    path(
        "change-password/",
        ChangePasswordView.as_view(),
        name="change-password",
    ),

    # RBAC Test
    path(
        "fleet-manager/",
        FleetManagerOnlyView.as_view(),
        name="fleet-manager",
    ),
]