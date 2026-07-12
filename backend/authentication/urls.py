from django.urls import path

from rest_framework_simplejwt.views import (
    TokenObtainPairView,
    TokenRefreshView,
)

from .views import (
    RegisterView,
    MeView,
    LogoutView,
    LoginView,
    MeView,
    ChangePasswordView,
    FleetManagerOnlyView,
)

urlpatterns = [
    path("register/", RegisterView.as_view(), name="register"),

    path("login/", LoginView.as_view(), name="login"),

    path("refresh/", TokenRefreshView.as_view(), name="refresh"),

    path("me/", MeView.as_view(), name="me"),

    path("logout/", LogoutView.as_view(), name="logout"),
    path("change-password/",ChangePasswordView.as_view(),name="change-password"),
    path("fleet-manager/",FleetManagerOnlyView.as_view(),name="fleet-manager"),
]