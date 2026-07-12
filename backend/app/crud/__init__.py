from app.crud.user import user, role
from app.crud.vehicle import vehicle
from app.crud.driver import driver
from app.crud.trip import trip
from app.crud.maintenance import maintenance_log
from app.crud.fuel import fuel_log
from app.crud.expense import expense

__all__ = [
    "user",
    "role",
    "vehicle",
    "driver",
    "trip",
    "maintenance_log",
    "fuel_log",
    "expense",
]
