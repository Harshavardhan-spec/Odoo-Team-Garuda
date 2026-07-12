from django.db.models import Sum
from rest_framework.views import APIView
from common.responses import success_response

from vehicles.models import Vehicle
from drivers.models import Driver
from trips.models import Trip
from maintenance.models import Maintenance
from fuel.models import FuelLog
from expenses.models import Expense


class DashboardView(APIView):
    def get(self, request):
        available_vehicles = Vehicle.objects.filter(status="AVAILABLE").count()
        vehicles_on_trip = Vehicle.objects.filter(status="ON_TRIP").count()
        drivers_available = Driver.objects.filter(status="AVAILABLE").count()
        drivers_on_trip = Driver.objects.filter(status="ON_TRIP").count()

        maintenance_count = Maintenance.objects.filter(status="ACTIVE").count()

        total_fuel_cost = (
            FuelLog.objects.aggregate(total=Sum("cost"))["total"] or 0.00
        )

        total_maintenance_cost = (
            Maintenance.objects.aggregate(total=Sum("cost"))["total"] or 0.00
        )

        total_expenses = (
            Expense.objects.aggregate(total=Sum("amount"))["total"] or 0.00
        )

        total_fuel_cost = float(total_fuel_cost)
        total_maintenance_cost = float(total_maintenance_cost)
        total_expenses = float(total_expenses)

        total_vehicles = Vehicle.objects.exclude(status="RETIRED").count()
        fleet_utilization = (
            round((vehicles_on_trip / total_vehicles) * 100.0, 1)
            if total_vehicles > 0
            else 0.0
        )

        recent = Trip.objects.select_related("vehicle", "driver").order_by(
            "-created_at"
        )[:5]

        recent_trips_data = [
            {
                "id": t.id,
                "origin": t.source,
                "destination": t.destination,
                "vehicle_reg": t.vehicle.registration_number,
                "driver_name": t.driver.name,
                "status": t.get_status_display()
            }
            for t in recent
        ]

        data = {
            "available_vehicles": available_vehicles,
            "vehicles_on_trip": vehicles_on_trip,
            "drivers_available": drivers_available,
            "drivers_on_trip": drivers_on_trip,
            "maintenance_count": maintenance_count,
            "total_fuel_cost": total_fuel_cost,
            "total_maintenance_cost": total_maintenance_cost,
            "total_expenses": total_expenses,
            "fleet_utilization": fleet_utilization,
            "recent_trips": recent_trips_data
        }

        return success_response(
            message="Dashboard statistics retrieved.",
            data=data
        )
