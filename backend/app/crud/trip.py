"""
Trip Database Repository

TODO:
- Define trip-specific queries
"""

from app.crud.base import CRUDBase
from app.models.trip import Trip
from app.schemas.trip import TripCreate, TripUpdate

class CRUDTrip(CRUDBase[Trip, TripCreate, TripUpdate]):
    pass

trip = CRUDTrip(Trip)
