from rest_framework import serializers
from .models import StoredPassword

class UserSerializer(serializers.ModelSerializer):
    class Meta:
        model = StoredPassword
        fields = ['id', 'website', 'username', 'password', 'created_at', 'updated_at']
        extra_kwargs = {'password': {'write_only': True}}
    