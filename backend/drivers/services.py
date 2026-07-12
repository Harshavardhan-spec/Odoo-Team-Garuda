from django.db import transaction
from django.core.exceptions import ValidationError
from django.utils import timezone
from datetime import date

from .models import Driver
from vehicles.models import Vehicle
from trips.models import Trip


# ==========================
# CREATE DRIVER
# ==========================

@transaction.atomic
def create_driver(data):
    if hasattr(data, "dict"):
        data = data.dict()
    elif hasattr(data, "copy"):
        data = data.copy()
    else:
        data = dict(data)

    license_number = (
        data.get("license_number", "")
        .strip()
        .upper()
    )

    data["license_number"] = license_number

    if not license_number:
        raise ValidationError("License number is required.")

    if Driver.objects.filter(
        license_number=license_number
    ).exists():
        raise ValidationError(
            "Driver with this license already exists."
        )

    license_expiry_val = data.get("license_expiry")
    if not license_expiry_val:
        raise ValidationError("License expiry date is required.")

    if isinstance(license_expiry_val, str):
        try:
            license_expiry = date.fromisoformat(license_expiry_val)
        except ValueError:
            raise ValidationError("Invalid license expiry date format. Must be YYYY-MM-DD.")
    else:
        license_expiry = license_expiry_val

    if license_expiry <= timezone.now().date():
        raise ValidationError(
            "Driver license has expired."
        )
    data["license_expiry"] = license_expiry

    if not data.get("phone_number"):
        raise ValidationError(
            "Phone number is required."
        )

    safety_score = data.get("safety_score", 100)

    if float(safety_score) < 0 or float(safety_score) > 100:
        raise ValidationError(
            "Safety score must be between 0 and 100."
        )

    driver = Driver.objects.create(**data)

    return driver


# ==========================
# UPDATE DRIVER
# ==========================

@transaction.atomic
def update_driver(driver_id, data):
    if hasattr(data, "dict"):
        data = data.dict()
    elif hasattr(data, "copy"):
        data = data.copy()
    else:
        data = dict(data)

    try:
        driver = Driver.objects.get(id=driver_id)

    except Driver.DoesNotExist:
        raise ValidationError("Driver not found.")

    if (
        "license_number" in data
        and driver.status == "ON_TRIP"
    ):
        raise ValidationError(
            "Cannot change license number while driver is on a trip."
        )

    if "license_expiry" in data:
        expiry_val = data["license_expiry"]
        if isinstance(expiry_val, str):
            try:
                expiry_date = date.fromisoformat(expiry_val)
            except ValueError:
                raise ValidationError("Invalid license expiry date format. Must be YYYY-MM-DD.")
        else:
            expiry_date = expiry_val

        if expiry_date <= timezone.now().date():
            raise ValidationError(
                "License expiry must be in the future."
            )
        data["license_expiry"] = expiry_date

    if "safety_score" in data:

        score = float(data["safety_score"])

        if score < 0 or score > 100:
            raise ValidationError(
                "Safety score must be between 0 and 100."
            )

    for key, value in data.items():
        setattr(driver, key, value)

    driver.save()

    return driver


# ==========================
# ASSIGN VEHICLE
# ==========================

@transaction.atomic
def assign_vehicle(driver_id, vehicle_id):

    try:
        driver = Driver.objects.get(id=driver_id)

    except Driver.DoesNotExist:
        raise ValidationError("Driver not found.")

    try:
        vehicle = Vehicle.objects.get(id=vehicle_id)

    except Vehicle.DoesNotExist:
        raise ValidationError("Vehicle not found.")

    if driver.status != "AVAILABLE":
        raise ValidationError(
            "Driver is not available."
        )

    if vehicle.status != "AVAILABLE":
        raise ValidationError(
            "Vehicle is not available."
        )

    driver.assigned_vehicle = vehicle
    driver.save()

    return driver


# ==========================
# UNASSIGN VEHICLE
# ==========================

@transaction.atomic
def unassign_vehicle(driver_id):

    try:
        driver = Driver.objects.get(id=driver_id)

    except Driver.DoesNotExist:
        raise ValidationError("Driver not found.")

    driver.assigned_vehicle = None
    driver.save()

    return driver


# ==========================
# DELETE DRIVER
# ==========================

@transaction.atomic
def delete_driver(driver_id):

    try:
        driver = Driver.objects.get(id=driver_id)

    except Driver.DoesNotExist:
        raise ValidationError("Driver not found.")

    active_trip = Trip.objects.filter(
        driver=driver,
        status="DISPATCHED"
    ).exists()

    if active_trip:
        raise ValidationError(
            "Driver has an active trip."
        )

    driver.delete()

    return True


# ==========================
# DRIVER DETAILS
# ==========================

def get_driver_by_id(driver_id):

    try:
        return Driver.objects.get(id=driver_id)

    except Driver.DoesNotExist:
        raise ValidationError("Driver not found.")


# ==========================
# GET ALL DRIVERS
# ==========================

def get_all_drivers():

    return Driver.objects.all().order_by("name")


# ==========================
# AVAILABLE DRIVERS
# ==========================

def get_available_drivers():

    return Driver.objects.filter(
        status="AVAILABLE"
    ).order_by("name")


# ==========================
# DRIVERS ON TRIP
# ==========================

def get_drivers_on_trip():

    return Driver.objects.filter(
        status="ON_TRIP"
    ).order_by("name")


# ==========================
# OFF DUTY DRIVERS
# ==========================

def get_off_duty_drivers():

    return Driver.objects.filter(
        status="OFF_DUTY"
    ).order_by("name")