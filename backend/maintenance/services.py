from django.db import transaction
from django.core.exceptions import ValidationError
from django.utils import timezone

from .models import Maintenance
from vehicles.models import Vehicle
from trips.models import Trip


# ==========================================
# CREATE MAINTENANCE
# ==========================================

@transaction.atomic
def create_maintenance(data):

    vehicle_id = data.get("vehicle")

    try:
        vehicle = Vehicle.objects.get(id=vehicle_id)

    except Vehicle.DoesNotExist:
        raise ValidationError("Vehicle not found.")

    if vehicle.status == "ON_TRIP":
        raise ValidationError(
            "Vehicle is currently on a trip."
        )

    active = Maintenance.objects.filter(
        vehicle=vehicle,
        status="ACTIVE"
    ).exists()

    if active:
        raise ValidationError(
            "Vehicle already has an active maintenance."
        )

    cost = float(data.get("cost", 0))

    if cost < 0:
        raise ValidationError(
            "Maintenance cost cannot be negative."
        )

    maintenance = Maintenance.objects.create(
        vehicle=vehicle,
        maintenance_type=data["maintenance_type"],
        description=data.get("description", ""),
        cost=cost,
        start_date=data["start_date"],
        end_date=data.get("end_date"),
        status="ACTIVE"
    )

    vehicle.status = "IN_SHOP"
    vehicle.save()

    return maintenance


# ==========================================
# COMPLETE MAINTENANCE
# ==========================================

@transaction.atomic
def complete_maintenance(maintenance_id):

    try:
        maintenance = Maintenance.objects.get(id=maintenance_id)

    except Maintenance.DoesNotExist:
        raise ValidationError("Maintenance record not found.")

    if maintenance.status == "COMPLETED":
        raise ValidationError(
            "Maintenance already completed."
        )

    maintenance.status = "COMPLETED"

    if not maintenance.end_date:
        maintenance.end_date = timezone.now().date()

    maintenance.save()

    vehicle = maintenance.vehicle

    vehicle.status = "AVAILABLE"
    vehicle.last_service_date = maintenance.end_date
    vehicle.save()

    return maintenance


# ==========================================
# UPDATE MAINTENANCE
# ==========================================

@transaction.atomic
def update_maintenance(maintenance_id, data):

    try:
        maintenance = Maintenance.objects.get(id=maintenance_id)

    except Maintenance.DoesNotExist:
        raise ValidationError("Maintenance record not found.")

    if maintenance.status == "COMPLETED":
        raise ValidationError(
            "Completed maintenance cannot be updated."
        )

    if "cost" in data:

        if float(data["cost"]) < 0:
            raise ValidationError(
                "Maintenance cost cannot be negative."
            )

    for key, value in data.items():
        setattr(maintenance, key, value)

    maintenance.save()

    return maintenance


# ==========================================
# DELETE MAINTENANCE
# ==========================================

@transaction.atomic
def delete_maintenance(maintenance_id):

    try:
        maintenance = Maintenance.objects.get(id=maintenance_id)

    except Maintenance.DoesNotExist:
        raise ValidationError("Maintenance record not found.")

    if maintenance.status == "ACTIVE":
        raise ValidationError(
            "Cannot delete active maintenance."
        )

    maintenance.delete()

    return True


# ==========================================
# GET SINGLE MAINTENANCE
# ==========================================

def get_maintenance_by_id(maintenance_id):

    try:
        return Maintenance.objects.get(id=maintenance_id)

    except Maintenance.DoesNotExist:
        raise ValidationError(
            "Maintenance record not found."
        )


# ==========================================
# GET ALL MAINTENANCE
# ==========================================

def get_all_maintenances():

    return Maintenance.objects.all().order_by("-start_date")


# ==========================================
# ACTIVE MAINTENANCE
# ==========================================

def get_active_maintenances():

    return Maintenance.objects.filter(
        status="ACTIVE"
    )


# ==========================================
# COMPLETED MAINTENANCE
# ==========================================

def get_completed_maintenances():

    return Maintenance.objects.filter(
        status="COMPLETED"
    )


# ==========================================
# VEHICLE MAINTENANCE HISTORY
# ==========================================

def get_vehicle_maintenance(vehicle_id):

    try:
        Vehicle.objects.get(id=vehicle_id)

    except Vehicle.DoesNotExist:
        raise ValidationError("Vehicle not found.")

    return Maintenance.objects.filter(
        vehicle_id=vehicle_id
    ).order_by("-start_date")