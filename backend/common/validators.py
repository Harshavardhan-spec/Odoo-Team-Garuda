from django.core.exceptions import ValidationError
from datetime import date
from .constants import VehicleStatus, DriverStatus

def validate_vehicle_available(vehicle):
    """
    Checks if a vehicle is currently AVAILABLE.
    Raises ValidationError if not.
    """
    if vehicle.status != VehicleStatus.AVAILABLE:
        raise ValidationError(
            f"Vehicle '{vehicle.registration_number}' is not available (status: {vehicle.get_status_display()})."
        )
    return True

def validate_driver_available(driver):
    """
    Checks if a driver is currently AVAILABLE.
    Raises ValidationError if not.
    """
    if driver.status != DriverStatus.AVAILABLE:
        raise ValidationError(
            f"Driver '{driver.name}' is not available (status: {driver.get_status_display()})."
        )
    return True

def validate_license_valid(driver):
    """
    Checks if a driver's license is active (non-expired).
    Raises ValidationError if expired.
    """
    if driver.license_expiry < date.today():
        raise ValidationError(
            f"Driver '{driver.name}' has an expired license (expired: {driver.license_expiry})."
        )
    return True

def validate_cargo_capacity(cargo_weight, vehicle):
    """
    Checks if the cargo weight exceeds the vehicle load capacity.
    Raises ValidationError if capacity is exceeded.
    """
    if cargo_weight > vehicle.max_load_capacity:
        raise ValidationError(
            f"Cargo weight ({cargo_weight} kg) exceeds vehicle '{vehicle.registration_number}' capacity ({vehicle.max_load_capacity} kg)."
        )
    return True
