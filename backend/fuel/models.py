from django.db import models
from vehicles.models import Vehicle
from trips.models import Trip


class FuelLog(models.Model):

    vehicle = models.ForeignKey(
        Vehicle,
        on_delete=models.CASCADE,
        related_name="fuel_logs"
    )

    trip = models.ForeignKey(
        Trip,
        on_delete=models.SET_NULL,
        null=True,
        blank=True,
        related_name="fuel_logs"
    )

    liters = models.DecimalField(
        max_digits=8,
        decimal_places=2
    )

    cost = models.DecimalField(
        max_digits=10,
        decimal_places=2
    )

    odometer = models.DecimalField(
        max_digits=10,
        decimal_places=2
    )

    fuel_date = models.DateField()

    def __str__(self):
        return f"{self.vehicle.registration_number} - {self.fuel_date}"