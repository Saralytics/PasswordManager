from django.http import HttpResponse, HttpResponseRedirect, JsonResponse
from .models import StoredPassword
from .serializers import PasswordSerializer
from rest_framework.decorators import api_view, permission_classes
from rest_framework.permissions import IsAuthenticated
from rest_framework.response import Response
from rest_framework import status
from django.middleware import csrf
from django.conf import settings


@permission_classes([IsAuthenticated])
@api_view(['POST'])
def create_stored_password(request):
        serializer = PasswordSerializer(data=request.data)
        if serializer.is_valid():
            serializer.save(user=request.user)
            return Response(serializer.data, status=status.HTTP_201_CREATED)
        return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)


@permission_classes([IsAuthenticated])
@api_view(['POST'])
def retrieve_password(request):
    # get request with website, get password back
    website = request.data.get('website')
    if not website:
         return Response({"error": "Website is required"}, status=status.HTTP_400_BAD_REQUEST)
    
    stored_password = StoredPassword.objects.filter(user=request.user, website=website).first() # there should be only 1 password
    if stored_password:
        serializer = PasswordSerializer(stored_password)
        return Response({"Password is": serializer.data['password']})
    else:
        return Response({"error": "Password is not found"}, status=status.HTTP_404_NOT_FOUND)
