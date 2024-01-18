from rest_framework import serializers
from .models import User
from rest_framework.fields import CharField, EmailField, DateTimeField

class UserSerializer(serializers.ModelSerializer):
    username = CharField(required=True)
    email = EmailField(required=True)
    password = CharField(required=True)

    class Meta:
        model = User
        fields = ['username',
                  'email',
                  'password']
        
    def create(self, validated_data):
        """
        Create and return a new `User` instance, given the validated data.
        """
        return User.objects.create(**validated_data)