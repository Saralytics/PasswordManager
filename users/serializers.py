from rest_framework import serializers
from .models import User
from rest_framework.fields import CharField, EmailField

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
        user = User(**validated_data)
        user.full_clean()  # Validate before saving
        user.save()
        return user
    
    def update(self, instance, validated_data):
        for attr, value in validated_data.items():
            setattr(instance, attr, value)
        instance.full_clean()  # Validate before saving
        instance.save()
        return instance