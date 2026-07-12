"""
Driver Validation Schemas

TODO:
- Define fields for creating, updating, and returning driver objects
"""

from pydantic import BaseModel

class DriverBase(BaseModel):
    pass

class DriverCreate(DriverBase):
    pass

class DriverUpdate(DriverBase):
    pass

class DriverResponse(DriverBase):
    pass
