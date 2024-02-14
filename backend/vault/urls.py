from django.urls import path
from . import views

appname = "vault"
urlpatterns = [
    path('passwords/', views.create_stored_password, name='stored_password_create'),
    path('updatepasswords/', views.update_password, name='update_stored_password_create'),
    path('search/', views.retrieve_password, name='get_stored_password'),
]
