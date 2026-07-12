from django.db.models import Sum, Count
from rest_framework.views import APIView
from rest_framework.exceptions import ValidationError
from datetime import datetime

from common.responses import success_response
from vehicles.models import Vehicle
from trips.models import Trip
from expenses.models import Expense
from fuel.models import FuelLog


def parse_date_param(param_name, param_value):
    """
    Validates date string format. Raises ValidationError if invalid.
    """
    if not param_value:
        return None
    try:
        return datetime.strptime(param_value, "%Y-%m-%d").date()
    except ValueError:
        raise ValidationError(
            {param_name: "Invalid date format. Must be YYYY-MM-DD."}
        )


class FleetReportView(APIView):
    def get(self, request):
        start_date = parse_date_param("start_date", request.query_params.get("start_date"))
        end_date = parse_date_param("end_date", request.query_params.get("end_date"))

        # Base active trips (completed)
        trips_qs = Trip.objects.filter(status="COMPLETED")
        if start_date:
            trips_qs = trips_qs.filter(created_at__date__gte=start_date)
        if end_date:
            trips_qs = trips_qs.filter(created_at__date__lte=end_date)

        # Calculate metrics
        total_miles = trips_qs.aggregate(total=Sum("actual_distance"))["total"] or 0.0
        total_miles_driven = float(total_miles)

        total_vehicles = Vehicle.objects.exclude(status="RETIRED").count()
        active_vehicles = trips_qs.values("vehicle").distinct().count()
        active_vehicles_ratio = (
            round(active_vehicles / total_vehicles, 2)
            if total_vehicles > 0
            else 0.0
        )

        utilization = (
            trips_qs.values("vehicle_id")
            .annotate(trips_count=Count("id"), distance_km=Sum("actual_distance"))
            .order_by("-trips_count")
        )

        utilization_by_vehicle = [
            {
                "vehicle_id": item["vehicle_id"],
                "trips_count": item["trips_count"],
                "distance_km": float(item["distance_km"] or 0.0)
            }
            for item in utilization
        ]

        data = {
            "total_miles_driven": total_miles_driven,
            "active_vehicles_ratio": active_vehicles_ratio,
            "utilization_by_vehicle": utilization_by_vehicle
        }

        return success_response(
            message="Fleet utilization report generated.",
            data=data
        )


class ExpenseReportView(APIView):
    def get(self, request):
        start_date = parse_date_param("start_date", request.query_params.get("start_date"))
        end_date = parse_date_param("end_date", request.query_params.get("end_date"))

        expense_qs = Expense.objects.all()
        if start_date:
            expense_qs = expense_qs.filter(expense_date__gte=start_date)
        if end_date:
            expense_qs = expense_qs.filter(expense_date__lte=end_date)

        total_sum = expense_qs.aggregate(total=Sum("amount"))["total"] or 0.0
        total_sum = float(total_sum)

        breakdown = {
            "Fuel": 0.0,
            "Maintenance": 0.0,
            "Toll": 0.0,
            "Insurance": 0.0,
            "Other": 0.0
        }

        for category in breakdown.keys():
            choice_val = category.upper()
            amount = (
                expense_qs.filter(expense_type=choice_val)
                .aggregate(total=Sum("amount"))["total"]
                or 0.0
            )
            breakdown[category] = float(amount)

        data = {
            "total_sum": total_sum,
            "breakdown": breakdown
        }

        return success_response(
            message="Expense report generated.",
            data=data
        )


class FuelReportView(APIView):
    def get(self, request):
        start_date = parse_date_param("start_date", request.query_params.get("start_date"))
        end_date = parse_date_param("end_date", request.query_params.get("end_date"))

        fuel_qs = FuelLog.objects.all()
        if start_date:
            fuel_qs = fuel_qs.filter(fuel_date__gte=start_date)
        if end_date:
            fuel_qs = fuel_qs.filter(fuel_date__lte=end_date)

        total_liters = fuel_qs.aggregate(total=Sum("liters"))["total"] or 0.0
        total_liters = float(total_liters)

        total_cost = fuel_qs.aggregate(total=Sum("cost"))["total"] or 0.0
        total_cost = float(total_cost)

        # Average consumption per 100km
        trip_ids = fuel_qs.filter(trip__isnull=False).values_list("trip_id", flat=True)
        total_distance = (
            Trip.objects.filter(id__in=trip_ids)
            .aggregate(total=Sum("actual_distance"))["total"]
        )

        if not total_distance:
            total_distance = (
                Trip.objects.filter(id__in=trip_ids)
                .aggregate(total=Sum("planned_distance"))["total"]
            )

        if total_distance and total_distance > 0 and total_liters > 0:
            avg_liters_per_100km = round(
                (total_liters / float(total_distance)) * 100.0,
                1
            )
        else:
            avg_liters_per_100km = 0.0

        data = {
            "total_liters": total_liters,
            "total_cost": total_cost,
            "avg_liters_per_100km": avg_liters_per_100km
        }

        return success_response(
            message="Fuel consumption report generated.",
            data=data
        )
