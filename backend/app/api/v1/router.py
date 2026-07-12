from fastapi import APIRouter
from app.api.v1.endpoints import (
    auth,
    users,
    vehicles,
    drivers,
    trips,
    maintenance,
    fuel,
    expenses,
)

api_router = APIRouter()

# Grouping routes by category for clean Swagger UI presentation
api_router.include_router(auth.router, prefix="/auth", tags=["authentication"])
api_router.include_router(users.router, prefix="/users", tags=["users"])
api_router.include_router(vehicles.router, prefix="/vehicles", tags=["vehicles"])
api_router.include_router(drivers.router, prefix="/drivers", tags=["drivers"])
api_router.include_router(trips.router, prefix="/trips", tags=["trips"])
api_router.include_router(maintenance.router, prefix="/maintenance", tags=["maintenance"])
api_router.include_router(fuel.router, prefix="/fuel", tags=["fuel"])
api_router.include_router(expenses.router, prefix="/expenses", tags=["expenses"])
