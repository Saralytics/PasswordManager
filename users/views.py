from django.http import HttpResponse, HttpResponseRedirect, JsonResponse
from django.contrib.auth.models import User
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


@api_view(['POST'])
def user_register(request):
        serializer = UserSerializer(data=request.data)
        if serializer.is_valid():
            user = serializer.save()
            return Response({
                "user": serializer.data
            })
        else:
            return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)