from django.urls import path

from . import views

app_name = "users"
urlpatterns = [
    # path("", views.welcome, name="homepage"),
    path("users/", views.user_home, name="userlist"),
    path("register/", views.user_register, name="register"),
    path("auth/", views.login_view, name="auth"),
    path("logout", views.logout_view, name="logout"),
    path("auth/verify", views.verify_user_view, name="user-verify"),
    path("get_csrf/", views.get_csrf, name="get-csrf"),
]