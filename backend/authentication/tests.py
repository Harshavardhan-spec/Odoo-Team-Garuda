from django.urls import reverse
from rest_framework import status
from rest_framework.test import APITestCase
from django.contrib.auth import get_user_model

User = get_user_model()

class AuthTestCase(APITestCase):
    def setUp(self):
        self.register_url = reverse('register')
        self.login_url = reverse('token_obtain_pair')
        self.me_url = reverse('me')
        self.logout_url = reverse('logout')
        self.change_password_url = reverse('change-password')

        self.user_data = {
            "username": "testuser",
            "email": "test@transitops.com",
            "first_name": "Test",
            "last_name": "User",
            "password": "SecurePassword123",
            "role": "dispatcher"
        }

    def test_register_unauthenticated(self):
        # AllowAny permission test
        response = self.client.post(self.register_url, self.user_data)
        self.assertEqual(response.status_code, status.HTTP_201_CREATED)
        self.assertEqual(User.objects.count(), 1)
        self.assertEqual(User.objects.get().username, "testuser")

    def test_register_unique_validation(self):
        # Validate that duplicates are rejected
        self.client.post(self.register_url, self.user_data)
        response = self.client.post(self.register_url, self.user_data)
        self.assertEqual(response.status_code, status.HTTP_400_BAD_REQUEST)

    def test_login_generates_jwt(self):
        # Register user
        self.client.post(self.register_url, self.user_data)
        # Login
        login_data = {
            "username": "testuser",
            "password": "SecurePassword123"
        }
        response = self.client.post(self.login_url, login_data)
        self.assertEqual(response.status_code, status.HTTP_200_OK)
        self.assertIn("access", response.data)
        self.assertIn("refresh", response.data)
        self.assertIn("user", response.data)

    def test_api_auth_me(self):
        # Register & Login
        self.client.post(self.register_url, self.user_data)
        login_data = {
            "username": "testuser",
            "password": "SecurePassword123"
        }
        login_response = self.client.post(self.login_url, login_data)
        access_token = login_response.data["access"]

        # Request me page without header (should fail)
        response = self.client.get(self.me_url)
        self.assertEqual(response.status_code, status.HTTP_401_UNAUTHORIZED)

        # Request me page with authorization header (should succeed)
        self.client.credentials(HTTP_AUTHORIZATION=f'Bearer {access_token}')
        response = self.client.get(self.me_url)
        self.assertEqual(response.status_code, status.HTTP_200_OK)
        self.assertEqual(response.data["username"], "testuser")

    def test_change_password_requires_auth(self):
        # Try changing password without credentials (should fail)
        response = self.client.post(self.change_password_url, {
            "old_password": "SecurePassword123",
            "new_password": "NewSecurePassword123"
        })
        self.assertEqual(response.status_code, status.HTTP_401_UNAUTHORIZED)
