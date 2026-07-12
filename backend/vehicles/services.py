from django.db import transaction
from django.core.exceptions import ValidationError

from .models import Vehicle
from trips.models import Trip
from maintenance.models import Maintenance


VALID_FUEL_TYPES = ["PETROL", "DIESEL", "CNG", "EV"]


@transaction.atomic
def create_vehicle(data):
    """
    Business Logic:
    1. Registration number must be unique.
    2. Registration number stored in uppercase.
    3. Capacity > 0.
    4. Acquisition cost > 0.
    5. Odometer >= 0.
    6. Fuel type must be valid.
    """

    registration_number = (
        data.get("registration_number", "")
        .strip()
        .upper()
    )

    data["registration_number"] = registration_number

    if not registration_number:
        raise ValidationError("Registration number is required.")

    if Vehicle.objects.filter(
        registration_number=registration_number
    ).exists():
        raise ValidationError("Vehicle with this registration number already exists.")

    capacity = data.get("max_load_capacity")

    if capacity is None or float(capacity) <= 0:
        raise ValidationError("Maximum load capacity must be greater than 0.")

    cost = data.get("acquisition_cost")

    if cost is None or float(cost) <= 0:
        raise ValidationError("Acquisition cost must be greater than 0.")

    odometer = data.get("odometer", 0)

    if float(odometer) < 0:
        raise ValidationError("Odometer cannot be negative.")

    fuel_type = data.get("fuel_type")

    if fuel_type not in VALID_FUEL_TYPES:
        raise ValidationError("Invalid fuel type.")

    vehicle = Vehicle.objects.create(**data)

    return vehicle


@transaction.atomic
def update_vehicle(vehicle_id, data):
    """
    Business Logic:
    1. Vehicle must exist.
    2. Registration number cannot change while ON_TRIP.
    3. Odometer cannot decrease.
    4. Capacity > 0.
    5. Acquisition cost > 0.
    6. Fuel type must be valid.
    """

    try:
        vehicle = Vehicle.objects.get(id=vehicle_id)
    except Vehicle.DoesNotExist:
        raise ValidationError("Vehicle not found.")

    if (
        "registration_number" in data
        and vehicle.status == "ON_TRIP"
        and data["registration_number"].upper() != vehicle.registration_number
    ):
        raise ValidationError(
            "Cannot change registration number while vehicle is on a trip."
        )

    if "registration_number" in data:
        data["registration_number"] = (
            data["registration_number"]
            .strip()
            .upper()
        )

    if "odometer" in data:

        if float(data["odometer"]) < float(vehicle.odometer):
            raise ValidationError(
                "Odometer cannot decrease."
            )

    if "max_load_capacity" in data:

        if float(data["max_load_capacity"]) <= 0:
            raise ValidationError(
                "Maximum load capacity must be greater than 0."
            )

    if "acquisition_cost" in data:

        if float(data["acquisition_cost"]) <= 0:
            raise ValidationError(
                "Acquisition cost must be greater than 0."
            )

    if "fuel_type" in data:

        if data["fuel_type"] not in VALID_FUEL_TYPES:
            raise ValidationError(
                "Invalid fuel type."
            )

    for key, value in data.items():
        setattr(vehicle, key, value)

    vehicle.save()

    return vehicle


@transaction.atomic
def delete_vehicle(vehicle_id):
    """
    Business Logic:
    1. Vehicle must exist.
    2. Vehicle cannot be deleted if it has an active trip.
    3. Vehicle cannot be deleted if under maintenance.
    """

    try:
        vehicle = Vehicle.objects.get(id=vehicle_id)
    except Vehicle.DoesNotExist:
        raise ValidationError("Vehicle not found.")

    active_trip = Trip.objects.filter(
        vehicle=vehicle,
        status="DISPATCHED"
    ).exists()

    if active_trip:
        raise ValidationError(
            "Cannot delete vehicle because it has an active trip."
        )

    active_maintenance = Maintenance.objects.filter(
        vehicle=vehicle,
        status="ACTIVE"
    ).exists()

    if active_maintenance:
        raise ValidationError(
            "Cannot delete vehicle because it is under maintenance."
        )

    vehicle.delete()

    return True


def get_all_vehicles():
    """
    Returns all vehicles.
    """
    return Vehicle.objects.all().order_by("registration_number")


def get_available_vehicles():
    """
    Returns only available vehicles.
    """
    return Vehicle.objects.filter(
        status="AVAILABLE"
    ).order_by("registration_number")


def get_vehicle_by_id(vehicle_id):
    """
    Returns vehicle details.
    """

    try:
        return Vehicle.objects.get(id=vehicle_id)
    except Vehicle.DoesNotExist:
        raise ValidationError("Vehicle not found.")