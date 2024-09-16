from django.contrib.auth.models import User
from rest_framework import serializers
from .models import Field, ChannelPartner, Landowner

class ChannelPartnerSerializer(serializers.ModelSerializer):
    class Meta:
        model = ChannelPartner
        fields = '__all__'

class LandownerSerializer(serializers.ModelSerializer):
    channel_partner = ChannelPartnerSerializer()

    class Meta:
        model = Landowner
        fields = '__all__'

class FieldSerializer(serializers.ModelSerializer):
    class Meta:
        model = Field
        fields = ['id', 'landowner', 'field_name', 'geometry', 'acreage']
        read_only_fields = ['acreage']  # Acreage should not be updated by the client