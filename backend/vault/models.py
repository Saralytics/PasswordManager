from django.db import models
from django.contrib.auth.models import User

class StoredPassword(models.Model):
    user = models.ForeignKey(User, on_delete=models.CASCADE, related_name='stored_passwords')
    website = models.CharField(max_length=255)
    username = models.CharField(max_length=255)
    password = models.CharField(max_length=255)
    created_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)

    def __str__(self):
        return self.website
    

