from app.core.database import Base
from app.models.base import IDMixin, TimestampMixin
from app.models.user import User, Role
from app.models.vehicle import Vehicle
from app.models.driver import Driver
from app.models.trip import Trip
from app.models.maintenance import MaintenanceLog
from app.models.fuel import FuelLog
from app.models.expense import Expense

# This ensures metadata has all models imported when alembic/env.py imports app.models
__all__ = [
    "Base",
    "IDMixin",
    "TimestampMixin",
    "User",
    "Role",
    "Vehicle",
    "Driver",
    "Trip",
    "MaintenanceLog",
    "FuelLog",
    "Expense",
]
