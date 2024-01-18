from django.shortcuts import get_object_or_404, render

# Create your views here.
from django.http import HttpResponse, HttpResponseRedirect, JsonResponse
from django.template import loader
from .models import User
from django.http import Http404
from django.urls import reverse
from .serializers import UserSerializer
from rest_framework.decorators import api_view
from rest_framework.response import Response
from rest_framework import status


@api_view(['GET','PUT','POST'])
def user_list(request):
    if request.method == 'GET':
        # get users
        users = User.objects.all()
        # serialize users
        users_serializer = UserSerializer(users, many=True)
        # return json
        return JsonResponse(users_serializer.data, safe=False)
    
    if request.method == 'POST':
        serializer = UserSerializer(data=request.data)
        if serializer.is_valid():
            serializer.save()
        # data = request.data
        # new_user = User(username='li',email='li@example.com',password='873453kjneg',created_at='2023-01-01')
        # new_user.save()
        return HttpResponse(serializer.data, status=status.HTTP_201_CREATED)