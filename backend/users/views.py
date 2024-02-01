from django.http import HttpResponse, HttpResponseRedirect, JsonResponse
from django.contrib.auth.models import User
from .serializers import UserSerializer
from rest_framework.decorators import api_view, permission_classes
from rest_framework.permissions import IsAuthenticated
from rest_framework.response import Response
from rest_framework import status
from django.contrib.auth import authenticate
from rest_framework_simplejwt.authentication import JWTAuthentication
from rest_framework_simplejwt.tokens import RefreshToken


def set_token_cookie(response, token):
    response.set_cookie(
        'auth_token',  # Cookie name
        token, 
        httponly=True,
        secure=False,  
        samesite='Lax'
    )
    return response


@permission_classes([IsAuthenticated])
@api_view(['GET','PUT'])
def user_list(request):
    if request.method == 'GET':
        # Extract the token and decode it
        jwt_object = JWTAuthentication()
        header = jwt_object.get_header(request)
        raw_token = jwt_object.get_raw_token(header)
        validated_token = jwt_object.get_validated_token(raw_token)
        user_id = jwt_object.get_user(validated_token).id

        # Get the user
        user = User.objects.get(id=user_id)

        # Serialize the user
        user_serializer = UserSerializer(user)

        return HttpResponse(f"Hi {user.username}, you are logged in")


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
            # Create a new token for the user
            refresh = RefreshToken.for_user(user)
            refresh_token = str(refresh)
            token = str(refresh.access_token)
            response = HttpResponse({
                'message': 'Successful Login'
            }, status=status.HTTP_200_OK)
            response = set_token_cookie(response, token)
            return response
            
        else:
            # Authentication failed
            return Response({'message': 'Invalid Credentials'}, status=status.HTTP_401_UNAUTHORIZED)

def logout_view(request):
    response = HttpResponse("User logged out")
    response.delete_cookie('auth_token')
    return response