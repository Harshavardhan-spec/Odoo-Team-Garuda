from django.db import transaction
from django.core.exceptions import ValidationError
from django.utils import timezone
from datetime import date

from .models import FuelLog
from vehicles.models import Vehicle
from trips.models import Trip


# ==========================================
# CREATE FUEL LOG
# ==========================================

@transaction.atomic
def create_fuel_log(data):
    if hasattr(data, "dict"):
        data = data.dict()
    elif hasattr(data, "copy"):
        data = data.copy()
    else:
        data = dict(data)
    """
    Business Rules:
    1. Vehicle must exist.
    2. Vehicle cannot be retired.
    3. Fuel quantity (liters) must be greater than zero.
    4. Cost must be greater than zero.
    5. Date cannot be in the future.
    6. Odometer reading must be greater than or equal to current vehicle odometer.
    7. If trip details exist, validate and calculate fuel efficiency.
    """

    vehicle_id = data.get("vehicle")

    try:
        vehicle = Vehicle.objects.get(id=vehicle_id)

    except Vehicle.DoesNotExist:
        raise ValidationError("Vehicle not found.")

    if vehicle.status == "RETIRED":
        raise ValidationError("Vehicle is retired.")

    liters = data.get("liters")

    if liters is None:
        raise ValidationError("Fuel quantity (liters) is required.")

    try:
        liters = float(liters)

    except (ValueError, TypeError):
        raise ValidationError("Liters must be a valid number.")

    if liters <= 0:
        raise ValidationError("Fuel quantity must be greater than zero.")

    cost = data.get("cost")

    if cost is None:
        raise ValidationError("Cost is required.")

    try:
        cost = float(cost)

    except (ValueError, TypeError):
        raise ValidationError("Cost must be a valid number.")

    if cost <= 0:
        raise ValidationError("Cost must be greater than zero.")

    odometer = data.get("odometer")

    if odometer is None:
        raise ValidationError("Odometer reading is required.")

    try:
        odometer = float(odometer)

    except (ValueError, TypeError):
        raise ValidationError("Odometer must be a valid number.")

    if odometer < float(vehicle.odometer):
        raise ValidationError(
            "Odometer reading cannot be less than the vehicle's current odometer."
        )

    fuel_date_val = data.get("fuel_date")

    if not fuel_date_val:
        raise ValidationError("Fuel date is required.")

    if isinstance(fuel_date_val, str):

        try:
            fuel_date = date.fromisoformat(fuel_date_val)

        except ValueError:
            raise ValidationError("Invalid date format.")

    else:
        fuel_date = fuel_date_val

    if fuel_date > timezone.now().date():
        raise ValidationError("Fuel date cannot be in the future.")

    trip_id = data.get("trip")
    trip = None
    efficiency = None

    if trip_id:

        try:
            trip = Trip.objects.get(id=trip_id)

        except Trip.DoesNotExist:
            raise ValidationError("Trip not found.")

        if trip.vehicle != vehicle:
            raise ValidationError(
                "Trip is not associated with this vehicle."
            )

        # Calculate fuel efficiency if trip exists
        distance = (
            trip.actual_distance
            if trip.actual_distance
            else trip.planned_distance
        )

        if distance and liters > 0:
            efficiency = float(distance) / liters
            trip.fuel_consumed = liters
            trip.save()

    fuel_log = FuelLog.objects.create(
        vehicle=vehicle,
        trip=trip,
        liters=liters,
        cost=cost,
        odometer=odometer,
        fuel_date=fuel_date
    )

    if odometer > float(vehicle.odometer):
        vehicle.odometer = odometer
        vehicle.save()

    fuel_log.fuel_efficiency = efficiency

    return fuel_log


# ==========================================
# UPDATE FUEL LOG
# ==========================================

@transaction.atomic
def update_fuel_log(fuel_log_id, data):
    if hasattr(data, "dict"):
        data = data.dict()
    elif hasattr(data, "copy"):
        data = data.copy()
    else:
        data = dict(data)

    try:
        fuel_log = FuelLog.objects.get(id=fuel_log_id)

    except FuelLog.DoesNotExist:
        raise ValidationError("Fuel log not found.")

    if "vehicle" in data:

        try:
            vehicle = Vehicle.objects.get(id=data["vehicle"])

        except Vehicle.DoesNotExist:
            raise ValidationError("Vehicle not found.")

        if vehicle.status == "RETIRED":
            raise ValidationError("Vehicle is retired.")

        fuel_log.vehicle = vehicle

    if "liters" in data:

        try:
            liters = float(data["liters"])

        except (ValueError, TypeError):
            raise ValidationError("Liters must be a valid number.")

        if liters <= 0:
            raise ValidationError("Fuel quantity must be greater than zero.")

        fuel_log.liters = liters

    if "cost" in data:

        try:
            cost = float(data["cost"])

        except (ValueError, TypeError):
            raise ValidationError("Cost must be a valid number.")

        if cost <= 0:
            raise ValidationError("Cost must be greater than zero.")

        fuel_log.cost = cost

    if "odometer" in data:

        try:
            odometer = float(data["odometer"])

        except (ValueError, TypeError):
            raise ValidationError("Odometer must be a valid number.")

        if odometer < float(fuel_log.vehicle.odometer):
            raise ValidationError(
                "Odometer reading cannot be less than the vehicle's current odometer."
            )

        fuel_log.odometer = odometer

        if odometer > float(fuel_log.vehicle.odometer):
            fuel_log.vehicle.odometer = odometer
            fuel_log.vehicle.save()

    if "fuel_date" in data:
        fuel_date_val = data["fuel_date"]

        if isinstance(fuel_date_val, str):

            try:
                fuel_date = date.fromisoformat(fuel_date_val)

            except ValueError:
                raise ValidationError("Invalid date format.")

        else:
            fuel_date = fuel_date_val

        if fuel_date > timezone.now().date():
            raise ValidationError("Fuel date cannot be in the future.")

        fuel_log.fuel_date = fuel_date

    if "trip" in data:
        trip_id = data["trip"]

        if trip_id:

            try:
                trip = Trip.objects.get(id=trip_id)

            except Trip.DoesNotExist:
                raise ValidationError("Trip not found.")

            if trip.vehicle != fuel_log.vehicle:
                raise ValidationError(
                    "Trip is not associated with this vehicle."
                )

            fuel_log.trip = trip

            distance = (
                trip.actual_distance
                if trip.actual_distance
                else trip.planned_distance
            )

            if distance and fuel_log.liters > 0:
                fuel_log.fuel_efficiency = (
                    float(distance) / float(fuel_log.liters)
                )

                trip.fuel_consumed = fuel_log.liters
                trip.save()

        else:
            fuel_log.trip = None

    fuel_log.save()

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
# DETAILS / READ
# ==========================================

def get_fuel_log_by_id(fuel_log_id):

    try:
        return FuelLog.objects.get(id=fuel_log_id)

    except FuelLog.DoesNotExist:
        raise ValidationError("Fuel log not found.")


def get_all_fuel_logs():

    return FuelLog.objects.all().order_by("-fuel_date")
