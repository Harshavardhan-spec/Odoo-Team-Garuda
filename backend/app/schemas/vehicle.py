"""
Vehicle Validation Schemas

TODO:
- Define fields for creating, updating, and returning vehicle objects
"""

from pydantic import BaseModel

class VehicleBase(BaseModel):
    pass

class VehicleCreate(VehicleBase):
    pass

class VehicleUpdate(VehicleBase):
    pass

class VehicleResponse(VehicleBase):
    pass
