from django.urls import reverse
from rest_framework import status
from rest_framework.test import APITestCase
from django.contrib.auth import get_user_model
from vehicles.models import Vehicle
from expenses.models import Expense

User = get_user_model()

class ExpenseTestCase(APITestCase):
    def setUp(self):
        # Create user & auth
        self.user = User.objects.create_user(
            username="testuser",
            password="SecurePassword123",
            role="dispatcher"
        )
        self.client.force_authenticate(user=self.user)

        self.vehicle = Vehicle.objects.create(
            registration_number="REG-EXP",
            vehicle_name="Expense Van",
            vehicle_type="VAN",
            max_load_capacity=2000.0,
            odometer=100.0,
            acquisition_cost=25000.0,
            fuel_type="PETROL"
        )

        self.list_url = reverse("expense-list")

    def test_create_valid_expense(self):
        data = {
            "vehicle": self.vehicle.id,
            "expense_type": "TOLL",
            "amount": 25.50,
            "expense_date": "2026-07-12",
            "description": "Bridge crossing toll fee"
        }
        response = self.client.post(self.list_url, data)
        self.assertEqual(response.status_code, status.HTTP_201_CREATED)
        self.assertEqual(Expense.objects.count(), 1)
        expense = Expense.objects.first()
        self.assertEqual(expense.expense_type, "TOLL")
        self.assertEqual(float(expense.amount), 25.50)

    def test_create_expense_missing_date(self):
        data = {
            "vehicle": self.vehicle.id,
            "expense_type": "TOLL",
            "amount": 25.50,
            "description": "Bridge crossing toll fee"
        }
        response = self.client.post(self.list_url, data)
        # Should return HTTP 400 Bad Request, not HTTP 500
        self.assertEqual(response.status_code, status.HTTP_400_BAD_REQUEST)
        self.assertIn("Expense date is required.", str(response.data))

    def test_create_expense_negative_amount(self):
        data = {
            "vehicle": self.vehicle.id,
            "expense_type": "TOLL",
            "amount": -5.00,
            "expense_date": "2026-07-12"
        }
        response = self.client.post(self.list_url, data)
        self.assertEqual(response.status_code, status.HTTP_400_BAD_REQUEST)
