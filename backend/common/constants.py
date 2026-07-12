class VehicleStatus:
    AVAILABLE = "AVAILABLE"
    ON_TRIP = "ON_TRIP"
    IN_SHOP = "IN_SHOP"
    RETIRED = "RETIRED"

    CHOICES = [
        (AVAILABLE, "Available"),
        (ON_TRIP, "On Trip"),
        (IN_SHOP, "In Shop"),
        (RETIRED, "Retired"),
    ]

class DriverStatus:
    AVAILABLE = "AVAILABLE"
    ON_TRIP = "ON_TRIP"
    OFF_DUTY = "OFF_DUTY"
    SUSPENDED = "SUSPENDED"

    CHOICES = [
        (AVAILABLE, "Available"),
        (ON_TRIP, "On Trip"),
        (OFF_DUTY, "Off Duty"),
        (SUSPENDED, "Suspended"),
    ]

class TripStatus:
    DRAFT = "DRAFT"
    DISPATCHED = "DISPATCHED"
    COMPLETED = "COMPLETED"
    CANCELLED = "CANCELLED"

    CHOICES = [
        (DRAFT, "Draft"),
        (DISPATCHED, "Dispatched"),
        (COMPLETED, "Completed"),
        (CANCELLED, "Cancelled"),
    ]

class MaintenanceStatus:
    ACTIVE = "ACTIVE"
    COMPLETED = "COMPLETED"

    CHOICES = [
        (ACTIVE, "Active"),
        (COMPLETED, "Completed"),
    ]

class ExpenseType:
    FUEL = "FUEL"
    MAINTENANCE = "MAINTENANCE"
    TOLL = "TOLL"
    INSURANCE = "INSURANCE"
    OTHER = "OTHER"

    CHOICES = [
        (FUEL, "Fuel"),
        (MAINTENANCE, "Maintenance"),
        (TOLL, "Toll"),
        (INSURANCE, "Insurance"),
        (OTHER, "Other"),
    ]
