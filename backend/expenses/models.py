from django.db import models
from vehicles.models import Vehicle
from trips.models import Trip


class Expense(models.Model):

    EXPENSE_TYPES = [
        ("FUEL", "Fuel"),
        ("MAINTENANCE", "Maintenance"),
        ("TOLL", "Toll"),
        ("INSURANCE", "Insurance"),
        ("OTHER", "Other"),
    ]

    vehicle = models.ForeignKey(
        Vehicle,
        on_delete=models.CASCADE,
        related_name="expenses"
    )

    trip = models.ForeignKey(
        Trip,
        on_delete=models.SET_NULL,
        null=True,
        blank=True,
        related_name="expenses"
    )

    expense_type = models.CharField(
        max_length=30,
        choices=EXPENSE_TYPES
    )

    amount = models.DecimalField(
        max_digits=10,
        decimal_places=2
    )

    description = models.TextField(
        blank=True
    )

    expense_date = models.DateField()

    remarks = models.TextField(
        blank=True
    )

    def __str__(self):
        return f"{self.expense_type} - {self.vehicle.registration_number}"