from django.db import transaction
from django.core.exceptions import ValidationError
from django.utils import timezone

from .models import Trip
from vehicles.models import Vehicle
from drivers.models import Driver
from maintenance.models import Maintenance


# ==========================
# CREATE TRIP
# ==========================

@transaction.atomic
def create_trip(data):

    vehicle_id = data.get("vehicle")
    driver_id = data.get("driver")

    try:
        vehicle = Vehicle.objects.get(id=vehicle_id)
    except Vehicle.DoesNotExist:
        raise ValidationError("Vehicle not found.")

    try:
        driver = Driver.objects.get(id=driver_id)
    except Driver.DoesNotExist:
        raise ValidationError("Driver not found.")

    if vehicle.status != "AVAILABLE":
        raise ValidationError("Vehicle is not available.")

    if driver.status != "AVAILABLE":
        raise ValidationError("Driver is not available.")

    if driver.license_expiry < timezone.now().date():
        raise ValidationError("Driver's license has expired.")

    if Maintenance.objects.filter(
        vehicle=vehicle,
        status="ACTIVE"
    ).exists():
        raise ValidationError("Vehicle is under maintenance.")

    cargo = float(data.get("cargo_weight", 0))

    if cargo <= 0:
        raise ValidationError("Cargo weight must be greater than zero.")

    if cargo > float(vehicle.max_load_capacity):
        raise ValidationError(
            "Cargo exceeds vehicle load capacity."
        )

    distance = float(data.get("planned_distance", 0))

    if distance <= 0:
        raise ValidationError(
            "Planned distance must be greater than zero."
        )

    revenue = float(data.get("revenue", 0))

    if revenue < 0:
        raise ValidationError(
            "Revenue cannot be negative."
        )

    trip = Trip.objects.create(
        source=data["source"],
        destination=data["destination"],
        vehicle=vehicle,
        driver=driver,
        cargo_weight=data["cargo_weight"],
        planned_distance=data["planned_distance"],
        revenue=data.get("revenue", 0),
        status="DISPATCHED"
    )

    vehicle.status = "ON_TRIP"
    vehicle.save()

    driver.status = "ON_TRIP"
    driver.assigned_vehicle = vehicle
    driver.save()

    return trip


# ==========================
# COMPLETE TRIP
# ==========================

@transaction.atomic
def complete_trip(
    trip_id,
    actual_distance,
    fuel_consumed
):

    try:
        trip = Trip.objects.get(id=trip_id)

    except Trip.DoesNotExist:
        raise ValidationError("Trip not found.")

    if trip.status == "COMPLETED":
        raise ValidationError(
            "Trip already completed."
        )

    if trip.status == "CANCELLED":
        raise ValidationError(
            "Cancelled trip cannot be completed."
        )

    if float(actual_distance) <= 0:
        raise ValidationError(
            "Actual distance must be greater than zero."
        )

    if float(fuel_consumed) < 0:
        raise ValidationError(
            "Fuel consumed cannot be negative."
        )

    trip.actual_distance = actual_distance
    trip.fuel_consumed = fuel_consumed
    trip.status = "COMPLETED"
    trip.save()

    vehicle = trip.vehicle
    vehicle.status = "AVAILABLE"
    vehicle.odometer += actual_distance
    vehicle.save()

    driver = trip.driver
    driver.status = "AVAILABLE"
    driver.assigned_vehicle = None
    driver.save()

    return trip


# ==========================
# CANCEL TRIP
# ==========================

@transaction.atomic
def cancel_trip(trip_id):

    try:
        trip = Trip.objects.get(id=trip_id)

    except Trip.DoesNotExist:
        raise ValidationError("Trip not found.")

    if trip.status == "COMPLETED":
        raise ValidationError(
            "Completed trip cannot be cancelled."
        )

    trip.status = "CANCELLED"
    trip.save()

    vehicle = trip.vehicle
    vehicle.status = "AVAILABLE"
    vehicle.save()

    driver = trip.driver
    driver.status = "AVAILABLE"
    driver.assigned_vehicle = None
    driver.save()

    return trip


# ==========================
# UPDATE TRIP
# ==========================

@transaction.atomic
def update_trip(trip_id, data):

    try:
        trip = Trip.objects.get(id=trip_id)

    except Trip.DoesNotExist:
        raise ValidationError("Trip not found.")

    if trip.status == "COMPLETED":
        raise ValidationError(
            "Completed trip cannot be updated."
        )

    if "vehicle" in data:
        raise ValidationError(
            "Vehicle cannot be changed."
        )

    if "driver" in data:
        raise ValidationError(
            "Driver cannot be changed."
        )

    if (
        "planned_distance" in data
        and float(data["planned_distance"]) <= 0
    ):
        raise ValidationError(
            "Distance must be greater than zero."
        )

    if (
        "cargo_weight" in data
        and float(data["cargo_weight"])
        > float(trip.vehicle.max_load_capacity)
    ):
        raise ValidationError(
            "Cargo exceeds vehicle capacity."
        )

    if (
        "revenue" in data
        and float(data["revenue"]) < 0
    ):
        raise ValidationError(
            "Revenue cannot be negative."
        )

    for key, value in data.items():
        setattr(trip, key, value)

    trip.save()

    return trip


# ==========================
# DELETE TRIP
# ==========================

@transaction.atomic
def delete_trip(trip_id):

    try:
        trip = Trip.objects.get(id=trip_id)

    except Trip.DoesNotExist:
        raise ValidationError("Trip not found.")

    if trip.status == "COMPLETED":
        raise ValidationError(
            "Completed trip cannot be deleted."
        )

    trip.delete()

    return True


# ==========================
# GET SINGLE TRIP
# ==========================

def get_trip_by_id(trip_id):

    try:
        return Trip.objects.get(id=trip_id)

    except Trip.DoesNotExist:
        raise ValidationError("Trip not found.")


# ==========================
# GET ALL TRIPS
# ==========================

def get_all_trips():

    return Trip.objects.all().order_by("-created_at")


# ==========================
# ACTIVE TRIPS
# ==========================

def get_active_trips():

    return Trip.objects.filter(
        status="DISPATCHED"
    )


# ==========================
# COMPLETED TRIPS
# ==========================

def get_completed_trips():

    return Trip.objects.filter(
        status="COMPLETED"
    )


# ==========================
# CANCELLED TRIPS
# ==========================

def get_cancelled_trips():

    return Trip.objects.filter(
        status="CANCELLED"
    )