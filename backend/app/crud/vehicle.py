"""
Vehicle Database Repository

TODO:
- Define vehicle-specific queries
"""

from app.crud.base import CRUDBase
from app.models.vehicle import Vehicle
from app.schemas.vehicle import VehicleCreate, VehicleUpdate

class CRUDVehicle(CRUDBase[Vehicle, VehicleCreate, VehicleUpdate]):
    pass

vehicle = CRUDVehicle(Vehicle)
