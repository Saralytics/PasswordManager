from django.http import HttpResponse, HttpResponseRedirect, JsonResponse
from .models import StoredPassword
from .serializers import PasswordSerializer
from rest_framework.decorators import api_view, permission_classes
from rest_framework.permissions import IsAuthenticated
from rest_framework.response import Response
from rest_framework import status
from django.conf import settings
from .utils import PasswordGenerator


@api_view(['POST'])
def create_stored_password(request):
        serializer = PasswordSerializer(data=request.data)
        if serializer.is_valid():
            serializer.save(user=request.user)
            return Response(serializer.data, status=status.HTTP_201_CREATED)
        return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)


@api_view(['POST'])
def retrieve_password(request):
    # get request with website, get password back
    website = request.data.get('website')
    if not website:
         return Response({"error": "Website is required"}, status=status.HTTP_400_BAD_REQUEST)
    
    stored_password = StoredPassword.objects.filter(user=request.user, website=website).first() # there should be only 1 password
    if stored_password:
        serializer = PasswordSerializer(stored_password)
        return Response({"password": serializer.data['password']})
    else:
        return Response({"error": "Password is not found"}, status=status.HTTP_404_NOT_FOUND)


@api_view(['PUT'])
def update_password(request):
    # get request with website, get password back
    website = request.data.get('website')
    new_password = request.data.get('password')
    if not website or not new_password:
        return Response({"error": "Website and new password are required"}, status=status.HTTP_400_BAD_REQUEST)
    
    try:
        stored_password = StoredPassword.objects.get(user=request.user, website=website) # there should be only 1 password
    
    except StoredPassword.DoesNotExist:
        return Response({'error': 'Password for the provided website not found.'}, status=status.HTTP_404_NOT_FOUND)
    
    serializer = PasswordSerializer(stored_password, data=request.data, partial=True)
    if serializer.is_valid():
         serializer.save()
         return Response({"message": "Password is updated"}, status=status.HTTP_200_OK)
    else:
         return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)


@api_view(['DELETE'])
def delete_stored_password(request):
    website = request.data.get('website')

    if not website:
        return Response({"error": "Website query parameter is required."}, status=status.HTTP_400_BAD_REQUEST)

    try:
        stored_password = StoredPassword.objects.get(user=request.user, website=website)
        stored_password.delete()
        return Response({"message": "Password deleted successfully."}, status=status.HTTP_204_NO_CONTENT)
    except StoredPassword.DoesNotExist:
        return Response({"error": "Stored password not found."}, status=status.HTTP_404_NOT_FOUND)
    

@api_view(['GET'])
def password_generate(request):
    generator = PasswordGenerator()
    new_password = generator.generate()

    # save the new password to cache
    # Define a unique cache key for this operation
    # cache_key = f"user_{request.user.id}_temp_password"
    # cache_timeout = 600  # Time in seconds for how long the password should be cached (e.g., 10 minutes)

    # Save the new password in the cache
    # cache.set(cache_key, new_password, cache_timeout)

    # Return the new password to user
    return Response({'password':new_password}, status=status.HTTP_201_CREATED)

@api_view(['GET'])
def list_vault(request):
    try:
        data = StoredPassword.objects.filter(user=request.user).all()
        if data:
            serializer = PasswordSerializer(data, many=True)
            return Response({'vault':serializer.data})
        else:
            return Response({'message':'You don\'t have any passwords yet.'})

    except Exception as e:
        return Response({'error': str(e)})    