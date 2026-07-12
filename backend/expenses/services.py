from django.db import transaction
from django.core.exceptions import ValidationError
from datetime import date

from .models import Expense
from vehicles.models import Vehicle
from trips.models import Trip


# ==========================================
# CREATE EXPENSE
# ==========================================

@transaction.atomic
def create_expense(data):
    if hasattr(data, "dict"):
        data = data.dict()
    elif hasattr(data, "copy"):
        data = data.copy()
    else:
        data = dict(data)

    vehicle_id = data.get("vehicle")
    trip_id = data.get("trip")

    try:
        vehicle = Vehicle.objects.get(id=vehicle_id)

    except Vehicle.DoesNotExist:
        raise ValidationError("Vehicle not found.")

    trip = None

    if trip_id:

        try:
            trip = Trip.objects.get(id=trip_id)

        except Trip.DoesNotExist:
            raise ValidationError("Trip not found.")

    amount = float(data.get("amount", 0))

    if amount <= 0:
        raise ValidationError(
            "Expense amount must be greater than zero."
        )

    expense_type = data.get("expense_type")
    if not expense_type:
        raise ValidationError("Expense type is required.")

    expense_date_val = data.get("expense_date")
    if not expense_date_val:
        raise ValidationError("Expense date is required.")

    if isinstance(expense_date_val, str):
        try:
            expense_date = date.fromisoformat(expense_date_val)
        except ValueError:
            raise ValidationError("Invalid expense date format. Must be YYYY-MM-DD.")
    else:
        expense_date = expense_date_val

    expense = Expense.objects.create(
        vehicle=vehicle,
        trip=trip,
        expense_type=expense_type,
        amount=amount,
        description=data.get("description", ""),
        expense_date=expense_date,
        remarks=data.get("remarks", "")
    )

    return expense


# ==========================================
# UPDATE EXPENSE
# ==========================================

@transaction.atomic
def update_expense(expense_id, data):
    if hasattr(data, "dict"):
        data = data.dict()
    elif hasattr(data, "copy"):
        data = data.copy()
    else:
        data = dict(data)

    try:
        expense = Expense.objects.get(id=expense_id)

    except Expense.DoesNotExist:
        raise ValidationError("Expense not found.")

    if "amount" in data:

        if float(data["amount"]) <= 0:
            raise ValidationError(
                "Expense amount must be greater than zero."
            )

    if "expense_date" in data:
        expense_date_val = data["expense_date"]
        if isinstance(expense_date_val, str):
            try:
                expense_date = date.fromisoformat(expense_date_val)
            except ValueError:
                raise ValidationError("Invalid expense date format. Must be YYYY-MM-DD.")
        else:
            expense_date = expense_date_val
        data["expense_date"] = expense_date

    for key, value in data.items():
        setattr(expense, key, value)

    expense.save()

    return expense


# ==========================================
# DELETE EXPENSE
# ==========================================

@transaction.atomic
def delete_expense(expense_id):

    try:
        expense = Expense.objects.get(id=expense_id)

    except Expense.DoesNotExist:
        raise ValidationError("Expense not found.")

    expense.delete()

    return True


# ==========================================
# GET EXPENSE
# ==========================================

def get_expense_by_id(expense_id):

    try:
        return Expense.objects.get(id=expense_id)

    except Expense.DoesNotExist:
        raise ValidationError("Expense not found.")


# ==========================================
# GET ALL EXPENSES
# ==========================================

def get_all_expenses():

    return Expense.objects.all().order_by("-expense_date")


# ==========================================
# GET VEHICLE EXPENSES
# ==========================================

def get_vehicle_expenses(vehicle_id):

    try:
        Vehicle.objects.get(id=vehicle_id)

    except Vehicle.DoesNotExist:
        raise ValidationError("Vehicle not found.")

    return Expense.objects.filter(
        vehicle_id=vehicle_id
    ).order_by("-expense_date")


# ==========================================
# GET TRIP EXPENSES
# ==========================================

def get_trip_expenses(trip_id):

    try:
        Trip.objects.get(id=trip_id)

    except Trip.DoesNotExist:
        raise ValidationError("Trip not found.")

    return Expense.objects.filter(
        trip_id=trip_id
    ).order_by("-expense_date")


# ==========================================
# GET EXPENSES BY TYPE
# ==========================================

def get_expenses_by_type(expense_type):

    return Expense.objects.filter(
        expense_type=expense_type
    ).order_by("-expense_date")


# ==========================================
# TOTAL VEHICLE EXPENSE
# ==========================================

def total_vehicle_expense(vehicle_id):

    try:
        Vehicle.objects.get(id=vehicle_id)

    except Vehicle.DoesNotExist:
        raise ValidationError("Vehicle not found.")

    expenses = Expense.objects.filter(vehicle_id=vehicle_id)

    total = 0

    for expense in expenses:
        total += expense.amount

    return total


# ==========================================
# TOTAL TRIP EXPENSE
# ==========================================

def total_trip_expense(trip_id):

    try:
        Trip.objects.get(id=trip_id)

    except Trip.DoesNotExist:
        raise ValidationError("Trip not found.")

    expenses = Expense.objects.filter(trip_id=trip_id)

    total = 0

    for expense in expenses:
        total += expense.amount

    return total