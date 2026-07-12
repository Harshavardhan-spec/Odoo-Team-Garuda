"""
FuelLog Validation Schemas

TODO:
- Define fields for creating, updating, and returning fuel log records
"""

from pydantic import BaseModel

class FuelLogBase(BaseModel):
    pass

class FuelLogCreate(FuelLogBase):
    pass

class FuelLogUpdate(FuelLogBase):
    pass

class FuelLogResponse(FuelLogBase):
    pass
