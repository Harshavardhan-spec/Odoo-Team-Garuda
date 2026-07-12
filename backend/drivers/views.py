from django.db import transaction
from django.core.exceptions import ValidationError

from .models import FuelLog
from vehicles.models import Vehicle
from trips.models import Trip


# ==========================================
# CREATE FUEL LOG
# ==========================================

@transaction.atomic
def create_fuel_log(data):

    vehicle_id = data.get("vehicle")
    trip_id = data.get("trip")

    try:
        vehicle = Vehicle.objects.get(id=vehicle_id)

    except Vehicle.DoesNotExist:
        raise ValidationError("Vehicle not found.")

    trip = None

    if trip_id:

        try:
            trip = Trip.objects.get(id=trip_id)

        except Trip.DoesNotExist:
            raise ValidationError("Trip not found.")

    liters = float(data.get("liters", 0))

    if liters <= 0:
        raise ValidationError(
            "Fuel quantity must be greater than zero."
        )

    cost = float(data.get("cost", 0))

    if cost <= 0:
        raise ValidationError(
            "Fuel cost must be greater than zero."
        )

    odometer = float(data.get("odometer", 0))

    if odometer < float(vehicle.odometer):
        raise ValidationError(
            "Odometer cannot be less than current vehicle odometer."
        )

    fuel_log = FuelLog.objects.create(
        vehicle=vehicle,
        trip=trip,
        liters=liters,
        cost=cost,
        odometer=odometer,
        fuel_date=data["fuel_date"]
    )

    vehicle.odometer = odometer
    vehicle.save()

    return fuel_log


# ==========================================
# UPDATE FUEL LOG
# ==========================================

@transaction.atomic
def update_fuel_log(fuel_log_id, data):

    try:
        fuel_log = FuelLog.objects.get(id=fuel_log_id)

    except FuelLog.DoesNotExist:
        raise ValidationError("Fuel log not found.")

    if "liters" in data:

        if float(data["liters"]) <= 0:
            raise ValidationError(
                "Fuel quantity must be greater than zero."
            )

    if "cost" in data:

        if float(data["cost"]) <= 0:
            raise ValidationError(
                "Fuel cost must be greater than zero."
            )

    if "odometer" in data:

        if float(data["odometer"]) < float(fuel_log.vehicle.odometer):
            raise ValidationError(
                "Odometer cannot decrease."
            )

    for key, value in data.items():
        setattr(fuel_log, key, value)

    fuel_log.save()

    if "odometer" in data:
        fuel_log.vehicle.odometer = data["odometer"]
        fuel_log.vehicle.save()

    return fuel_log


# ==========================================
# DELETE FUEL LOG
# ==========================================

@transaction.atomic
def delete_fuel_log(fuel_log_id):

    try:
        fuel_log = FuelLog.objects.get(id=fuel_log_id)

    except FuelLog.DoesNotExist:
        raise ValidationError("Fuel log not found.")

    fuel_log.delete()

    return True


# ==========================================
# GET FUEL LOG
# ==========================================

def get_fuel_log_by_id(fuel_log_id):

    try:
        return FuelLog.objects.get(id=fuel_log_id)

    except FuelLog.DoesNotExist:
        raise ValidationError("Fuel log not found.")


# ==========================================
# GET ALL FUEL LOGS
# ==========================================

def get_all_fuel_logs():

    return FuelLog.objects.all().order_by("-fuel_date")


# ==========================================
# GET VEHICLE FUEL LOGS
# ==========================================

def get_vehicle_fuel_logs(vehicle_id):

    try:
        Vehicle.objects.get(id=vehicle_id)

    except Vehicle.DoesNotExist:
        raise ValidationError("Vehicle not found.")

    return FuelLog.objects.filter(
        vehicle_id=vehicle_id
    ).order_by("-fuel_date")


# ==========================================
# GET TRIP FUEL LOGS
# ==========================================

def get_trip_fuel_logs(trip_id):

    try:
        Trip.objects.get(id=trip_id)

    except Trip.DoesNotExist:
        raise ValidationError("Trip not found.")

    return FuelLog.objects.filter(
        trip_id=trip_id
    ).order_by("-fuel_date")


# ==========================================
# TOTAL FUEL COST FOR VEHICLE
# ==========================================

def total_vehicle_fuel_cost(vehicle_id):

    try:
        Vehicle.objects.get(id=vehicle_id)

    except Vehicle.DoesNotExist:
        raise ValidationError("Vehicle not found.")

    total = 0

    logs = FuelLog.objects.filter(vehicle_id=vehicle_id)

    for log in logs:
        total += log.cost

    return total


# ==========================================
# TOTAL FUEL CONSUMED FOR VEHICLE
# ==========================================

def total_vehicle_fuel(vehicle_id):

    try:
        Vehicle.objects.get(id=vehicle_id)

    except Vehicle.DoesNotExist:
        raise ValidationError("Vehicle not found.")

    total = 0

    logs = FuelLog.objects.filter(vehicle_id=vehicle_id)

    for log in logs:
        total += log.liters

    return total