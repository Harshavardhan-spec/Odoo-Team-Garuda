"""
Trip Validation Schemas

TODO:
- Define fields for creating, updating, and returning trip objects
"""

from pydantic import BaseModel

class TripBase(BaseModel):
    pass

class TripCreate(TripBase):
    pass

class TripUpdate(TripBase):
    pass

class TripResponse(TripBase):
    pass
