from django.urls import path
from .views import (
    VehicleListView,
    VehicleCreateView,
    VehicleDetailView,
    VehicleUpdateView,
    VehicleDeleteView,
)

urlpatterns = [
    # GET - List all vehicles
    path(
        "",
        VehicleListView.as_view(),
        name="vehicle-list",
    ),

    # POST - Create vehicle
    path(
        "create/",
        VehicleCreateView.as_view(),
        name="vehicle-create",
    ),

    # GET - Vehicle Details
    path(
        "<int:pk>/",
        VehicleDetailView.as_view(),
        name="vehicle-detail",
    ),

    # PUT - Update Vehicle
    path(
        "update/<int:pk>/",
        VehicleUpdateView.as_view(),
        name="vehicle-update",
    ),

    # DELETE - Delete Vehicle
    path(
        "delete/<int:pk>/",
        VehicleDeleteView.as_view(),
        name="vehicle-delete",
    ),
]