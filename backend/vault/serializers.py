from rest_framework import serializers
from .models import StoredPassword

class PasswordSerializer(serializers.ModelSerializer):
    class Meta:
        model = StoredPassword
        fields = ['id', 'website', 'username', 'password', 'created_at', 'updated_at']
    
    def update(self, instance, validated_data):
        instance.password = validated_data.get('password', instance.password)
        instance.save()
        return instance