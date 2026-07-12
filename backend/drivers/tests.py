from django.urls import reverse
from rest_framework import status
from rest_framework.test import APITestCase
from django.contrib.auth import get_user_model
from drivers.models import Driver

User = get_user_model()

class DriverTestCase(APITestCase):
    def setUp(self):
        # Create user & auth
        self.user = User.objects.create_user(
            username="testuser",
            password="SecurePassword123",
            role="dispatcher"
        )
        self.client.force_authenticate(user=self.user)
        self.list_url = reverse("driver-list")

    def test_create_valid_driver_string_date(self):
        data = {
            "name": "Driver Jane",
            "license_number": "DL998877",
            "phone_number": "9876543210",
            "license_expiry": "2030-05-15",
            "safety_score": 95.0
        }
        response = self.client.post(self.list_url, data)
        self.assertEqual(response.status_code, status.HTTP_201_CREATED)
        self.assertEqual(Driver.objects.count(), 1)
        driver = Driver.objects.first()
        self.assertEqual(driver.name, "Driver Jane")
        self.assertEqual(driver.license_number, "DL998877")

    def test_create_driver_expired_license(self):
        data = {
            "name": "Driver Jane",
            "license_number": "DL998877",
            "phone_number": "9876543210",
            "license_expiry": "2020-05-15",  # Expired
            "safety_score": 95.0
        }
        response = self.client.post(self.list_url, data)
        self.assertEqual(response.status_code, status.HTTP_400_BAD_REQUEST)

    def test_create_driver_missing_license_expiry(self):
        data = {
            "name": "Driver Jane",
            "license_number": "DL998877",
            "phone_number": "9876543210"
        }
        response = self.client.post(self.list_url, data)
        self.assertEqual(response.status_code, status.HTTP_400_BAD_REQUEST)
