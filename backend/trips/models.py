from django.db import models
from vehicles.models import Vehicle
from drivers.models import Driver


class Trip(models.Model):

    STATUS_CHOICES = [
        ("DRAFT", "Draft"),
        ("DISPATCHED", "Dispatched"),
        ("COMPLETED", "Completed"),
        ("CANCELLED", "Cancelled"),
    ]

    source = models.CharField(max_length=100)

    destination = models.CharField(max_length=100)

    vehicle = models.ForeignKey(
        Vehicle,
        on_delete=models.PROTECT,
        related_name="trips"
    )

    driver = models.ForeignKey(
        Driver,
        on_delete=models.PROTECT,
        related_name="trips"
    )

    cargo_weight = models.DecimalField(
        max_digits=10,
        decimal_places=2
    )

    planned_distance = models.DecimalField(
        max_digits=10,
        decimal_places=2
    )

    actual_distance = models.DecimalField(
        max_digits=10,
        decimal_places=2,
        null=True,
        blank=True
    )

    fuel_consumed = models.DecimalField(
        max_digits=10,
        decimal_places=2,
        null=True,
        blank=True
    )

    revenue = models.DecimalField(
        max_digits=12,
        decimal_places=2,
        default=0
    )

    status = models.CharField(
        max_length=20,
        choices=STATUS_CHOICES,
        default="DRAFT"
    )

    created_at = models.DateTimeField(auto_now_add=True)

    updated_at = models.DateTimeField(auto_now=True)

    def __str__(self):
        return f"{self.source} → {self.destination}"