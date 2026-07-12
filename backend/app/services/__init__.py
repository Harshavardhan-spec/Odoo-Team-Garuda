from app.services.user import user_service
from app.services.vehicle import vehicle_service
from app.services.driver import driver_service
from app.services.trip import trip_service
from app.services.maintenance import maintenance_service
from app.services.fuel import fuel_service
from app.services.expense import expense_service

__all__ = [
    "user_service",
    "vehicle_service",
    "driver_service",
    "trip_service",
    "maintenance_service",
    "fuel_service",
    "expense_service",
]
