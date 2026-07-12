from django.db import models


class Vehicle(models.Model):

    STATUS_CHOICES = [
        ("AVAILABLE", "Available"),
        ("ON_TRIP", "On Trip"),
        ("IN_SHOP", "In Shop"),
        ("RETIRED", "Retired"),
    ]

    VEHICLE_TYPES = [
        ("TRUCK", "Truck"),
        ("VAN", "Van"),
        ("BUS", "Bus"),
        ("CAR", "Car"),
    ]

    FUEL_TYPES = [
        ("PETROL", "Petrol"),
        ("DIESEL", "Diesel"),
        ("CNG", "CNG"),
        ("EV", "Electric"),
    ]

    registration_number = models.CharField(
        max_length=20,
        unique=True
    )

    vehicle_name = models.CharField(max_length=100)

    vehicle_type = models.CharField(
        max_length=20,
        choices=VEHICLE_TYPES
    )

    max_load_capacity = models.DecimalField(
        max_digits=10,
        decimal_places=2
    )

    odometer = models.DecimalField(
        max_digits=10,
        decimal_places=2,
        default=0
    )

    acquisition_cost = models.DecimalField(
        max_digits=12,
        decimal_places=2
    )

    fuel_type = models.CharField(
        max_length=20,
        choices=FUEL_TYPES
    )

    current_location = models.CharField(
        max_length=100,
        blank=True
    )

    last_service_date = models.DateField(
        null=True,
        blank=True
    )

    status = models.CharField(
        max_length=20,
        choices=STATUS_CHOICES,
        default="AVAILABLE"
    )

    created_at = models.DateTimeField(auto_now_add=True)

    updated_at = models.DateTimeField(auto_now=True)

    def __str__(self):
        return f"{self.registration_number} - {self.vehicle_name}"