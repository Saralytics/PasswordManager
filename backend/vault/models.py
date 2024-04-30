from django.db import models
from django.contrib.auth.models import User
from fernet_fields import EncryptedTextField, EncryptedCharField


class StoredPassword(models.Model):
    user = models.ForeignKey(
        User, on_delete=models.CASCADE, related_name='stored_passwords')
    website = models.CharField(max_length=255)
    username = EncryptedCharField(
        max_length=255, null=True, blank=True)
    password = EncryptedCharField(
        max_length=255, null=True, blank=True)
    created_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)

    class Meta:
        ordering = ['website']

    def __str__(self):
        return self.website
