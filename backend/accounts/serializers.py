from django.contrib.auth import get_user_model
from rest_framework import serializers
from django.contrib.auth.password_validation import validate_password


User = get_user_model()


class UserSerializer(serializers.ModelSerializer):
    class Meta:
        model = User
        fields = ('id', 'username', 'email', 'first_name', 'last_name', 'role', 'flat_number')
        read_only_fields = ('id', 'role')


class RegisterSerializer(serializers.ModelSerializer):
    password = serializers.CharField(write_only=True, min_length=8)

    class Meta:
        model = User
        fields = ('username', 'password', 'email', 'first_name', 'last_name', 'flat_number')

    def create(self, validated_data):
        return User.objects.create_user(**validated_data)



class ProfileUpdateSerializer(serializers.ModelSerializer):
    class Meta:
        model = User
        fields = ('id', 'username', 'email', 'role', 'flat_number')
        read_only_fields = ('id', 'username', 'email', 'role')


class ChangePasswordSerializer(serializers.Serializer):
    old_password = serializers.CharField(write_only=True)
    new_password = serializers.CharField(write_only=True, validators=[validate_password])

    def validate_old_password(self, value):
        user = self.context['request'].user
        if not user.check_password(value):
            raise serializers.ValidationError('Current password is incorrect.')
        return value