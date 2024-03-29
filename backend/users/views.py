from django.http import HttpResponse, HttpResponseRedirect, JsonResponse
from .serializers import UserSerializer
from rest_framework.decorators import api_view, permission_classes
from rest_framework.permissions import IsAuthenticated, AllowAny
from rest_framework.response import Response
from rest_framework import status
from django.contrib.auth import authenticate
from rest_framework_simplejwt.tokens import RefreshToken
from django.middleware import csrf
from django.conf import settings


def get_tokens_for_user(user):
    refresh = RefreshToken.for_user(user)
    return {
        'refresh': str(refresh),
        'access': str(refresh.access_token),
    }


@api_view(['GET','PUT'])
@permission_classes([IsAuthenticated])
def user_home(request):
    if request.method == 'GET':
        # # Extract the token and decode it
        # jwt_object = JWTAuthentication()
        # header = jwt_object.get_header(request)
        # raw_token = jwt_object.get_raw_token(header)
        # validated_token = jwt_object.get_validated_token(raw_token)
        # user_id = jwt_object.get_user(validated_token).id

        # # Get the user
        # user = User.objects.get(id=user_id)

        # # Serialize the user
        # user_serializer = UserSerializer(user)

        return HttpResponse(f"Hi, you are logged in")


@api_view(['POST'])
@permission_classes([AllowAny])
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
@permission_classes([AllowAny])
def login_view(request):
    if request.method == 'POST':
        response = Response()
        username = request.data.get('username')
        password = request.data.get('password')
        user = authenticate(username=username, password=password)

        if user is not None:
            if user.is_active:
                data = get_tokens_for_user(user)
                response.set_cookie(
                    key = settings.SIMPLE_JWT['AUTH_COOKIE'],
                    value = data["access"],
                    expires = settings.SIMPLE_JWT['ACCESS_TOKEN_LIFETIME'],
                    secure = settings.SIMPLE_JWT['AUTH_COOKIE_SECURE'],
                    httponly = settings.SIMPLE_JWT['AUTH_COOKIE_HTTP_ONLY'],
                    samesite = settings.SIMPLE_JWT['AUTH_COOKIE_SAMESITE']
                )
                csrf.get_token(request) # Django sets the token in cookie
                response.data = {"Success" : "Login successfully","data":data}  
                return response
            
        else:
            # Authentication failed
            return Response({'message': 'Invalid Credentials'}, status=status.HTTP_401_UNAUTHORIZED)


@api_view(['POST'])
@permission_classes([IsAuthenticated])
def logout_view(request):
    response = HttpResponse("User logged out")
    response.delete_cookie('access_token')
    return response


@api_view(['GET'])
@permission_classes([IsAuthenticated])
def verify_user_view(request):
    # If the request reaches this point, the user is authenticated
    return Response({
        "isAuthenticated": True,
        "username": request.user.username,
    }, status=status.HTTP_200_OK)


