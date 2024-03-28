# myapp/authentication.py
from rest_framework.authentication import BaseAuthentication
from rest_framework_simplejwt.exceptions import InvalidToken, AuthenticationFailed
from rest_framework_simplejwt.authentication import JWTAuthentication
from django.contrib.auth.models import User

class JWTAuthenticationFromCookie(BaseAuthentication):
    def authenticate(self, request):
        # Define the name of your HTTP-only cookie
        jwt_cookie_name = 'access_token'
        
        # Attempt to retrieve the JWT token from the cookie
        token = request.COOKIES.get(jwt_cookie_name, None)
        if token is None:
            return None

        # Use SimpleJWT's JWTAuthentication to validate the token
        jwt_auth = JWTAuthentication()
        
        try:
            # Decode and validate the token
            validated_token = jwt_auth.get_validated_token(token)
            user = jwt_auth.get_user(validated_token)
            
            # Ensure we got a user back
            if user is None:
                raise AuthenticationFailed('Invalid token')
            
            return (user, token)
        except InvalidToken as e:
            raise AuthenticationFailed('Invalid token') from e
