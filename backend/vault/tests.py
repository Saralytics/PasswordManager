from django.urls import reverse
from rest_framework import status
from rest_framework.test import APITestCase
from django.contrib.auth.models import User
from .models import StoredPassword  # Update this import path based on your project structure

class StoredPasswordTests(APITestCase):
    def setUp(self):
        # Create a user for authentication
        self.user = User.objects.create_user(username='testuser', password='testpassword123')
        
        # URL for create_stored_password view
        self.create_url = 'https://27c7-217-164-202-47.ngrok-free.app/vault/passwords/'  # Update with your actual URL name
    
    def test_create_stored_password(self):
        # Ensure the client is authenticated
        self.client.force_authenticate(user=self.user)

        # Data to be sent in request
        data = {
            'website': 'https://example.com',
            'username': 'exampleuser',
            'password': 'examplepassword',
            
        }

        # Send POST request
        response = self.client.post(self.create_url, data, format='json')

        # Check that the response status code is 201 (created)
        self.assertEqual(response.status_code, status.HTTP_201_CREATED)

        # Check that a StoredPassword instance is created
        self.assertEqual(StoredPassword.objects.count(), 1)
        self.assertEqual(StoredPassword.objects.get().user, self.user)
        self.assertEqual(StoredPassword.objects.get().website, data['website'])
        self.assertEqual(StoredPassword.objects.get().password, data['password'])
        
        
