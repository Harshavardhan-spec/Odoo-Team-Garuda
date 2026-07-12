"""
MaintenanceLog Database Repository

TODO:
- Define maintenance-specific queries
"""

from app.crud.base import CRUDBase
from app.models.maintenance import MaintenanceLog
from app.schemas.maintenance import MaintenanceLogCreate, MaintenanceLogUpdate

class CRUDMaintenanceLog(CRUDBase[MaintenanceLog, MaintenanceLogCreate, MaintenanceLogUpdate]):
    pass

maintenance_log = CRUDMaintenanceLog(MaintenanceLog)
