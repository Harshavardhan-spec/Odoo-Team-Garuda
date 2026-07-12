from django.urls import reverse
from rest_framework import status
from rest_framework.test import APITestCase
from django.contrib.auth import get_user_model
from vehicles.models import Vehicle
from trips.models import Trip
from fuel.models import FuelLog
from drivers.models import Driver

User = get_user_model()

class FuelLogTestCase(APITestCase):
    def setUp(self):
        # Create user & auth
        self.user = User.objects.create_user(
            username="testuser",
            password="SecurePassword123",
            role="dispatcher"
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

        # Create retired vehicle
        self.retired_vehicle = Vehicle.objects.create(
            registration_number="REG-RETIRED",
            vehicle_name="Retired Truck",
            vehicle_type="TRUCK",
            max_load_capacity=8000.0,
            odometer=1000.0,
            acquisition_cost=40000.0,
            fuel_type="DIESEL",
            status="RETIRED"
        )

        self.list_url = reverse("fuel-list")

    def test_create_valid_fuel_log(self):
        data = {
            "vehicle": self.vehicle.id,
            "liters": 50.0,
            "cost": 100.0,
            "odometer": 600.0,
            "fuel_date": "2026-07-12"
        }
        response = self.client.post(self.list_url, data)
        self.assertEqual(response.status_code, status.HTTP_201_CREATED)
        self.assertEqual(FuelLog.objects.count(), 1)
        
        # Verify vehicle odometer updated
        self.vehicle.refresh_from_db()
        self.assertEqual(float(self.vehicle.odometer), 600.0)

    def test_create_fuel_log_invalid_liters_or_cost(self):
        data = {
            "vehicle": self.vehicle.id,
            "liters": 0.0,  # Invalid
            "cost": 100.0,
            "odometer": 600.0,
            "fuel_date": "2026-07-12"
        }
        response = self.client.post(self.list_url, data)
        self.assertEqual(response.status_code, status.HTTP_400_BAD_REQUEST)

        data["liters"] = 50.0
        data["cost"] = -10.0  # Invalid
        response = self.client.post(self.list_url, data)
        self.assertEqual(response.status_code, status.HTTP_400_BAD_REQUEST)

    def test_create_fuel_log_retired_vehicle(self):
        data = {
            "vehicle": self.retired_vehicle.id,
            "liters": 50.0,
            "cost": 100.0,
            "odometer": 1100.0,
            "fuel_date": "2026-07-12"
        }
        response = self.client.post(self.list_url, data)
        self.assertEqual(response.status_code, status.HTTP_400_BAD_REQUEST)

    def test_create_fuel_log_calculates_efficiency(self):
        data = {
            "vehicle": self.vehicle.id,
            "trip": self.trip.id,
            "liters": 50.0,
            "cost": 100.0,
            "odometer": 700.0,
            "fuel_date": "2026-07-12"
        }
        response = self.client.post(self.list_url, data)
        self.assertEqual(response.status_code, status.HTTP_201_CREATED)
        
        # 200 km / 50 liters = 4.0
        self.assertEqual(float(response.data["fuel_efficiency"]), 4.0)

        # Verify trip fuel_consumed is updated
        self.trip.refresh_from_db()
        self.assertEqual(float(self.trip.fuel_consumed), 50.0)
