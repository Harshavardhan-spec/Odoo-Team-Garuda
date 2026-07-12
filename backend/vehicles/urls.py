from django.urls import path

from .views import (
    VehicleCreateView,
    VehicleDeleteView,
    VehicleDetailView,
    VehicleListView,
    VehicleUpdateView,
)

urlpatterns = [
    path("", VehicleListView.as_view(), name="vehicle-list"),
    path("create/", VehicleCreateView.as_view(), name="vehicle-create"),
    path("<int:pk>/", VehicleDetailView.as_view(), name="vehicle-detail"),
    path("update/<int:pk>/", VehicleUpdateView.as_view(), name="vehicle-update"),
    path("delete/<int:pk>/", VehicleDeleteView.as_view(), name="vehicle-delete"),
]
