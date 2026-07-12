from django.db import models
from vehicles.models import Vehicle


class Driver(models.Model):

    STATUS_CHOICES = [
        ("AVAILABLE", "Available"),
        ("ON_TRIP", "On Trip"),
        ("OFF_DUTY", "Off Duty"),
        ("SUSPENDED", "Suspended"),
    ]

    name = models.CharField(max_length=100)

    license_number = models.CharField(
        max_length=30,
        unique=True
    )

    phone_number = models.CharField(max_length=15)

    emergency_contact = models.CharField(
        max_length=15,
        blank=True
    )

    assigned_vehicle = models.ForeignKey(
        Vehicle,
        on_delete=models.SET_NULL,
        null=True,
        blank=True,
        related_name="assigned_drivers"
    )

    license_category = models.CharField(max_length=20)

    license_expiry = models.DateField()

    safety_score = models.DecimalField(
        max_digits=5,
        decimal_places=2,
        default=100
    )

    status = models.CharField(
        max_length=20,
        choices=STATUS_CHOICES,
        default="AVAILABLE"
    )

    def __str__(self):
        return self.name