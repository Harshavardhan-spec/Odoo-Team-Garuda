from django.contrib import admin
from django.urls import path, include

urlpatterns = [
    # Admin
    path("admin/", admin.site.urls),

    # Authentication
    path("api/auth/", include("authentication.urls")),

    # Project Apps
    path("api/vehicles/", include("vehicles.urls")),
    path("api/drivers/", include("drivers.urls")),
    path("api/trips/", include("trips.urls")),
    path("api/maintenance/", include("maintenance.urls")),
    path("api/fuel/", include("fuel.urls")),
    path("api/expenses/", include("expenses.urls")),
    path("api/dashboard/", include("dashboard.urls")),
    path("api/reports/", include("reports.urls")),
]
