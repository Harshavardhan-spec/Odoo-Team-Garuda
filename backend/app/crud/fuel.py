"""
FuelLog Database Repository

TODO:
- Define fuel-specific queries
"""

from app.crud.base import CRUDBase
from app.models.fuel import FuelLog
from app.schemas.fuel import FuelLogCreate, FuelLogUpdate

class CRUDFuelLog(CRUDBase[FuelLog, FuelLogCreate, FuelLogUpdate]):
    pass

fuel_log = CRUDFuelLog(FuelLog)
