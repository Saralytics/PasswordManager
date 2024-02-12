from rest_framework import serializers
from .models import StoredPassword

class PasswordSerializer(serializers.ModelSerializer):
    class Meta:
        model = StoredPassword
        fields = ['id', 'website', 'username', 'password', 'created_at', 'updated_at']
    