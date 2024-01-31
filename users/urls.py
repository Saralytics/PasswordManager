from django.urls import path
from rest_framework_simplejwt.views import TokenObtainPairView, TokenRefreshView
from . import views

app_name = "users"
urlpatterns = [
    path("users/", views.user_list, name="userlist"),
    path("register/", views.user_register, name="register"),
    path("auth/", views.login_view, name="auth"),
    path("token/",TokenObtainPairView.as_view(), name="token_obtain"),
    path("token/refresh",TokenRefreshView.as_view(), name="token_refresh"),
]