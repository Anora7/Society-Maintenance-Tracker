from rest_framework import generics, permissions
from rest_framework_simplejwt.views import TokenObtainPairView

from .serializers import RegisterSerializer, UserSerializer


class RegisterView(generics.CreateAPIView):
    permission_classes = (permissions.AllowAny,)
    serializer_class = RegisterSerializer


class LoginView(TokenObtainPairView):
    permission_classes = (permissions.AllowAny,)


from rest_framework import generics, permissions, status
from rest_framework.response import Response
from rest_framework.views import APIView
from rest_framework_simplejwt.views import TokenObtainPairView

from .serializers import (
    ChangePasswordSerializer,
    ProfileUpdateSerializer,
    RegisterSerializer,
    UserSerializer,
)


class RegisterView(generics.CreateAPIView):
    permission_classes = (permissions.AllowAny,)
    serializer_class = RegisterSerializer


class LoginView(TokenObtainPairView):
    permission_classes = (permissions.AllowAny,)


class MeView(generics.RetrieveUpdateAPIView):
    permission_classes = (permissions.IsAuthenticated,)

    def get_object(self):
        return self.request.user

    def get_serializer_class(self):
        if self.request.method in ('PATCH', 'PUT'):
            return ProfileUpdateSerializer
        return UserSerializer


class ChangePasswordView(APIView):
    permission_classes = (permissions.IsAuthenticated,)

    def post(self, request):
        serializer = ChangePasswordSerializer(data=request.data, context={'request': request})
        serializer.is_valid(raise_exception=True)
        request.user.set_password(serializer.validated_data['new_password'])
        request.user.save(update_fields=['password'])
        return Response({'detail': 'Password updated successfully.'}, status=status.HTTP_200_OK)