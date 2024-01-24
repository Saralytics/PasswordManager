from django.urls import path

from . import views

app_name = "users"
urlpatterns = [
    path("", views.user_list, name="userlist"),
    path("register/", views.user_register, name="register"),
    # path("/auth", views.user_auth, name="auth"),
]