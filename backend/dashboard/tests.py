from django.urls import reverse
from rest_framework import status
from rest_framework.test import APITestCase
from django.contrib.auth import get_user_model
from vehicles.models import Vehicle
from drivers.models import Driver
from trips.models import Trip

User = get_user_model()

class DashboardTestCase(APITestCase):
    def setUp(self):
        # Create user & auth
        self.user = User.objects.create_user(
            username="testuser",
            password="SecurePassword123",
            role="fleet_manager"
        )
        self.client.force_authenticate(user=self.user)

        # Create driver
        self.driver = Driver.objects.create(
            name="Driver Bob",
            license_number="DL12345",
            phone_number="123456789",
            license_expiry="2030-12-31"
        )

        # Create vehicle
        self.vehicle = Vehicle.objects.create(
            registration_number="REG-101",
            vehicle_name="Heavy Truck",
            vehicle_type="TRUCK",
            max_load_capacity=10000.0,
            odometer=500.0,
            acquisition_cost=50000.0,
            fuel_type="DIESEL"
        )

        # Create trip
        self.trip = Trip.objects.create(
            source="A",
            destination="B",
            vehicle=self.vehicle,
            driver=self.driver,
            cargo_weight=5000,
            planned_distance=200,
            status="DISPATCHED"
        )

        self.dashboard_url = reverse("dashboard")
        self.report_fleet_url = reverse("report-fleet")
        self.report_expenses_url = reverse("report-expenses")
        self.report_fuel_url = reverse("report-fuel")

    def test_dashboard_api(self):
        response = self.client.get(self.dashboard_url)
        self.assertEqual(response.status_code, status.HTTP_200_OK)
        self.assertEqual(response.data["success"], True)
        self.assertIn("available_vehicles", response.data["data"])
        self.assertIn("vehicles_on_trip", response.data["data"])
        self.assertIn("recent_trips", response.data["data"])

    def test_reports_fleet_api(self):
        response = self.client.get(self.report_fleet_url)
        self.assertEqual(response.status_code, status.HTTP_200_OK)
        self.assertEqual(response.data["success"], True)
        self.assertIn("total_miles_driven", response.data["data"])

    def test_reports_expenses_api(self):
        response = self.client.get(self.report_expenses_url)
        self.assertEqual(response.status_code, status.HTTP_200_OK)
        self.assertEqual(response.data["success"], True)
        self.assertIn("total_sum", response.data["data"])

    def test_reports_fuel_api(self):
        response = self.client.get(self.report_fuel_url)
        self.assertEqual(response.status_code, status.HTTP_200_OK)
        self.assertEqual(response.data["success"], True)
        self.assertIn("total_liters", response.data["data"])
