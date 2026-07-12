"""
MaintenanceLog Validation Schemas

TODO:
- Define fields for creating, updating, and returning maintenance log records
"""

from pydantic import BaseModel

class MaintenanceLogBase(BaseModel):
    pass

class MaintenanceLogCreate(MaintenanceLogBase):
    pass

class MaintenanceLogUpdate(MaintenanceLogBase):
    pass

class MaintenanceLogResponse(MaintenanceLogBase):
    pass
