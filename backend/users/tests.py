from django.test import TestCase
from rest_framework.test import APITestCase
from django.contrib.auth.models import User
from django.core.exceptions import ValidationError
from .serializers import UserSerializer
from rest_framework import status
from rest_framework.test import APIClient
from unittest import skip
from unittest.mock import patch, MagicMock
from .authenticate import JWTAuthenticationFromCookie


class UserModelTest(TestCase):
    def setUp(self):
        self.user = User.objects.create(
            username="testuser",
            email="testuser@example.com",
            password="password123"
        )

    def test_model_can_create_user(self):
        """Test the user model can create a new user."""
        self.assertEqual(self.user.username, "testuser")
        self.assertEqual(self.user.email, "testuser@example.com")

    def test_email_field_validation(self):
        """Test the email field for valid data."""
        self.user.email = "invalid-email"
        with self.assertRaises(ValidationError):
            self.user.full_clean()

    def test_str_method(self):
        """Test the __str__ method returns the username."""
        self.assertEqual(str(self.user), "testuser")

    # def test_created_at_is_assigned_on_creation(self):
    #     """Test the created_at field is automatically set on creation."""
    #     self.assertIsNotNone(self.user.created_at)

    # def test_updated_at_is_assigned(self):
    #     """Test the updated_at field is automatically set on creation and updated on save."""
    #     original_updated_at = self.user.updated_at
    #     self.user.save()
    #     self.assertNotEqual(self.user.updated_at, original_updated_at)


class UserSerializerTest(TestCase):

    def setUp(self):
        self.user_data = {
            'username': 'testuser',
            'email': 'test@example.com',
            'password': 'safe_password123'
        }
        self.serializer = UserSerializer(data=self.user_data)

    def test_contains_expected_fields(self):
        """Test that the serializer contains the expected fields."""
        self.serializer.is_valid()
        data = self.serializer.data
        self.assertEqual(set(data.keys()), set(['username', 'email']))

    def test_field_content(self):
        """Test the content of each field."""
        self.assertTrue(self.serializer.is_valid(
        ))  # first make sure the serializer is instantiated with valid data
        user = self.serializer.save()
        # check_password method is available in the returned user instance by serializer.save()
        self.assertTrue(user.check_password(self.user_data['password']))

        for field in self.user_data:
            if field != 'password':  # compare the other fields because password is set as write-only and won't be visible
                self.assertEqual(
                    self.serializer.data[field], self.user_data[field])

    def test_field_validation(self):
        """Test validation for each field."""
        invalid_data = self.user_data.copy()
        invalid_data['email'] = 'invalid_email'
        serializer = UserSerializer(data=invalid_data)
        self.assertFalse(serializer.is_valid())
        self.assertTrue('email' in serializer.errors)

    def test_create_method(self):
        """Test the create method of the serializer."""
        self.serializer.is_valid()
        self.serializer.save()
        self.assertEqual(User.objects.count(), 1)
        self.assertEqual(User.objects.get().username,
                         self.user_data['username'])
        self.assertEqual(User.objects.get().email, self.user_data['email'])

    def test_password_length_validation(self):
        """Test that the password length validation works correctly."""
        short_password_data = {
            'username': 'testuser',
            'email': 'test@example.com',
            'password': 'short'  # Password shorter than 8 characters
        }

        serializer = UserSerializer(data=short_password_data)
        self.assertFalse(serializer.is_valid())

        # Check if there's an error for the password field
        self.assertIn('password', serializer.errors)
        # Or whatever your error message is
        expected_error_msg = "Password must be at least 8 characters long."
        self.assertIn(expected_error_msg, serializer.errors['password'])

    def test_valid_data(self):
        """Test serializer with valid data."""
        serializer = UserSerializer(data=self.user_data)
        self.assertTrue(serializer.is_valid())

    skip('skip for now')

    def test_update_data(self):
        pass


class UserTests(APITestCase):
    def setUp(self):
        self.client = APIClient()
        self.user = User.objects.create_user(
            username='testuser', password='testpassword123')

    def test_user_list(self):
        self.client.force_authenticate(user=self.user)
        url = "http://localhost:8000/api/users/"
        response = self.client.get(url)
        self.assertEqual(response.status_code, status.HTTP_200_OK)
        self.assertIn('Hi, you are logged in', response.content.decode())

    def test_user_list_unauth(self):

        url = "http://localhost:8000/api/users/"
        response = self.client.get(url)
        self.assertEqual(response.status_code, status.HTTP_401_UNAUTHORIZED)

    def test_user_register(self):
        data = {'username': 'newuser', 'password': 'newpassword123',
                'email': 'newuser@example.com'}
        url = "http://localhost:8000/api/register/"
        response = self.client.post(url, data)
        self.assertEqual(response.status_code, status.HTTP_201_CREATED)
        self.assertEqual(User.objects.count(), 2)
        self.assertEqual(User.objects.get(
            username='newuser').username, 'newuser')

    def test_login_view(self):
        # Successful login
        url = "http://localhost:8000/api/auth/"
        response = self.client.post(
            url, {'username': 'testuser', 'password': 'testpassword123'})
        self.assertEqual(response.status_code, status.HTTP_200_OK)
        self.assertIn('Login successfully', response.content.decode())

        # Unsuccessful login
        response = self.client.post(
            url, {'username': 'testuser', 'password': 'wrongpassword'})
        self.assertEqual(response.status_code, status.HTTP_401_UNAUTHORIZED)
        self.assertIn('Invalid Credentials', response.content.decode())


class JWTAuthenticationFromCookieTests(TestCase):
    def setUp(self):
        self.authentication = JWTAuthenticationFromCookie()
        self.request = MagicMock()
        self.request.COOKIES = {}

    def test_no_token(self):
        """Test the authenticate method returns None when no token is provided."""
        result = self.authentication.authenticate(self.request)
        self.assertIsNone(result)
