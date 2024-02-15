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
        

class PasswordRetrievalTests(APITestCase):
    def setUp(self):
        # Create a test user
        self.user = User.objects.create_user(username='testuser', password='testpassword')
        # Create a StoredPassword instance for the test user
        self.test_website = 'https://example.com'
        self.test_password = 'password123'
        StoredPassword.objects.create(user=self.user, website=self.test_website, username='exampleuser', password=self.test_password)
        # URL for the retrieve_password view
        self.retrieve_url = 'https://27c7-217-164-202-47.ngrok-free.app/vault/search/'

    def test_retrieve_password_success(self):
        # Authenticate the test client
        self.client.force_authenticate(user=self.user)

        # Make a POST request to the view with the website data
        response = self.client.post(self.retrieve_url, {'website': self.test_website}, format='json')
        
        # Check that the response is successful and the password is returned
        self.assertEqual(response.status_code, status.HTTP_200_OK)
        self.assertEqual(response.data, {"Password is": self.test_password})  

    def test_retrieve_password_no_website(self):
        # Authenticate the test client
        self.client.force_authenticate(user=self.user)

        # Make a POST request to the view without the website data
        response = self.client.post(self.retrieve_url, {}, format='json')
        
        # Check that the response indicates a website is required
        self.assertEqual(response.status_code, status.HTTP_400_BAD_REQUEST)
        self.assertEqual(response.data, {"error": "Website is required"})

    def test_retrieve_password_not_found(self):
        # Authenticate the test client
        self.client.force_authenticate(user=self.user)

        # Make a POST request to the view with a website that doesn't match any stored passwords
        response = self.client.post(self.retrieve_url, {'website': 'https://nonexistent.com'}, format='json')
        
        # Check that the response indicates the password is not found
        self.assertEqual(response.status_code, status.HTTP_404_NOT_FOUND)
        self.assertEqual(response.data, {"error": "Password is not found"})

class PasswordUpdateTests(APITestCase):
    def setUp(self):
        # Create a test user
        self.user = User.objects.create_user(username='testuser', password='testpassword')
        # Create a StoredPassword instance for the test user
        self.test_website = 'https://example.com'
        self.test_password = 'password123'
        StoredPassword.objects.create(user=self.user, website=self.test_website, username='exampleuser', password=self.test_password)
        # URL for the retrieve_password view
        self.update_url = 'https://27c7-217-164-202-47.ngrok-free.app/vault/passwords/update/'

    def test_update_password_success(self):
        # Authenticate the test client
        self.client.force_authenticate(user=self.user)

        # Make a PUT request to the view with the website data
        response = self.client.put(self.update_url, {'website': self.test_website, 'password':'updated123'}, format='json')
        
        # Check that the response is successful and the password is indeed updated
        self.assertEqual(response.status_code, status.HTTP_200_OK)
        self.assertEqual(response.data, {"message": "Password is updated"})

        updated_row = StoredPassword.objects.get(user=self.user,website=self.test_website)
        self.assertEqual(updated_row.password, 'updated123')

    # def test_retrieve_password_no_website(self):
    #     # Authenticate the test client
    #     self.client.force_authenticate(user=self.user)

    #     # Make a POST request to the view without the website data
    #     response = self.client.post(self.retrieve_url, {}, format='json')
        
    #     # Check that the response indicates a website is required
    #     self.assertEqual(response.status_code, status.HTTP_400_BAD_REQUEST)
    #     self.assertEqual(response.data, {"error": "Website is required"})

    # def test_retrieve_password_not_found(self):
    #     # Authenticate the test client
    #     self.client.force_authenticate(user=self.user)

    #     # Make a POST request to the view with a website that doesn't match any stored passwords
    #     response = self.client.post(self.retrieve_url, {'website': 'https://nonexistent.com'}, format='json')
        
    #     # Check that the response indicates the password is not found
    #     self.assertEqual(response.status_code, status.HTTP_404_NOT_FOUND)
    #     self.assertEqual(response.data, {"error": "Password is not found"})


class PasswordDeleteTests(APITestCase):
    def setUp(self):
        # Create a test user
        self.user = User.objects.create_user(username='testuser', password='testpassword')
        # Create a StoredPassword instance for the test user
        self.test_website = 'https://example.com'
        self.test_password = 'password123'
        StoredPassword.objects.create(user=self.user, website=self.test_website, username='exampleuser', password=self.test_password)
        # URL for the delete view
        self.delete_url = 'https://27c7-217-164-202-47.ngrok-free.app/vault/passwords/delete/'
        self.retrieve_url = 'https://27c7-217-164-202-47.ngrok-free.app/vault/search/'

    def test_delete_password_success(self):
        # Authenticate the test client
        self.client.force_authenticate(user=self.user)

        # Make a DELETE request to the view with the website url
        response = self.client.delete(self.delete_url, {'website': self.test_website}, format='json')
        
        # Check that the status code is 204
        self.assertEqual(response.status_code, status.HTTP_204_NO_CONTENT)
        self.assertEqual(response.data, {"message": "Password deleted successfully."})

        # Check that this website does not exist
        # Make a POST request to the view with the website data
        response = self.client.post(self.retrieve_url, {'website': self.test_website}, format='json')
        
        self.assertEqual(response.data, {"error": "Password is not found"})
        self.assertEqual(response.status_code, status.HTTP_404_NOT_FOUND)