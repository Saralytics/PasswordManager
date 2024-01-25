from django.http import HttpResponse, HttpResponseRedirect, JsonResponse
from django.contrib.auth.models import User
from .serializers import UserSerializer
from rest_framework.decorators import api_view
from rest_framework.response import Response
from rest_framework import status
from django.contrib.auth import authenticate


@api_view(['GET','PUT'])
def user_list(request):
    if request.method == 'GET':
        # get users
        users = User.objects.all()
        # serialize users
        users_serializer = UserSerializer(users, many=True)
        username = users_serializer.data[0]["username"]
        return HttpResponse(f"Hi {username}, you are logged in")


@api_view(['POST'])
def user_register(request):
        serializer = UserSerializer(data=request.data)
        if serializer.is_valid():
            user = serializer.save()
            return Response({
                "user": serializer.data
            }, status=status.HTTP_201_CREATED)
        else:
            return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)
        
@api_view(['POST'])
def login_view(request):
    if request.method == 'POST':
        username = request.data.get('username')
        password = request.data.get('password')
        user = authenticate(username=username, password=password)
        if user is not None:
            # Authentication is successful
            # You can now log the user in and/or return a token
            return Response({"message": "Successful Login"}, status=status.HTTP_200_OK)
        else:
            # Authentication failed
            return Response({"message": "Invalid Credentials"}, status=status.HTTP_401_UNAUTHORIZED)