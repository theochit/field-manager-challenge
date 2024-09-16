import pandas as pd
import json
from rest_framework import viewsets, serializers
from rest_framework.decorators import action
from rest_framework.response import Response
from rest_framework.permissions import IsAuthenticated
from .models import Field, ChannelPartner, Landowner
from .serializers import FieldSerializer, ChannelPartnerSerializer, LandownerSerializer
from django.contrib.auth import authenticate, login, logout
from django.contrib.auth.models import User
from rest_framework import status
from rest_framework.authtoken.models import Token
from rest_framework.decorators import api_view, permission_classes
from rest_framework.permissions import AllowAny
from rest_framework.response import Response

class FieldViewSet(viewsets.ModelViewSet):
    queryset = Field.objects.all()  # Define the queryset attribute for the router
    serializer_class = FieldSerializer
    # permission_classes = [IsAuthenticated]

    def get_queryset(self):
        user = self.request.user
        if hasattr(user, 'landowner'):
            return Field.objects.filter(landowner=user.id)
        return Field.objects.all()

    def perform_create(self, serializer):
        landowner_id = self.request.data.get('landowner')
        if not landowner_id:
            raise serializers.ValidationError('landowner is required')
        try:
            landowner = Landowner.objects.get(id=landowner_id)
            field = serializer.save(landowner=landowner)
            field.acreage = field.calculate_acreage() # Acreage is calculated here since Django doesn't have an 
            field.save()
        except Landowner.DoesNotExist:
            raise serializers.ValidationError('Landowner not found')

class LandownerViewSet(viewsets.ModelViewSet):
    queryset = Landowner.objects.all()
    serializer_class = LandownerSerializer

    @action(detail=True, methods=['get'])
    def fields(self, request, pk=None):
        landowner = self.get_object()
        fields = Field.objects.filter(landowner=landowner)
        serializer = FieldSerializer(fields, many=True)
        return Response(serializer.data)

class ChannelPartnerViewSet(viewsets.ModelViewSet):
    queryset = ChannelPartner.objects.all()
    serializer_class = ChannelPartnerSerializer

    @action(detail=True, methods=['get'])
    def clients(self, request, pk=None):
        channel_partner = self.get_object()
        landowners = Landowner.objects.filter(channel_partner=channel_partner)
        serializer = LandownerSerializer(landowners, many=True)
        return Response(serializer.data)
    
    @action(detail=True, methods=['get'])
    def fields(self, request, pk=None):
        channel_partner = self.get_object()
        landowners = Landowner.objects.filter(channel_partner=channel_partner)
        fields = Field.objects.filter(landowner__in=landowners)
        serializer = FieldSerializer(fields, many=True)
        return Response(serializer.data)
    

@api_view(['POST'])
@permission_classes([AllowAny])
def register_user(request):
    username = request.data.get('username')
    password = request.data.get('password')
    role = request.data.get('role')
    channel_partner_id = request.data.get('channel_partner_id')

    if not username or not password or not role:
        return Response({'error': 'Please provide username, password, and role'},
                        status=status.HTTP_400_BAD_REQUEST)

    if role not in ['channel_partner', 'landowner']:
        return Response({'error': 'Invalid role. Must be either "channel_partner" or "landowner"'},
                        status=status.HTTP_400_BAD_REQUEST)

    if role == 'channel_partner':
        user = ChannelPartner.objects.create_user(username=username, password=password)
    elif role == 'landowner':
        if not channel_partner_id:
            return Response({'error': 'Landowner registration requires a ChannelPartner'},
                            status=status.HTTP_400_BAD_REQUEST)
        try:
            channel_partner = ChannelPartner.objects.get(id=channel_partner_id)
        except ChannelPartner.DoesNotExist:
            return Response({'error': 'Invalid ChannelPartner ID'},
                            status=status.HTTP_400_BAD_REQUEST)
        user = Landowner.objects.create_user(username=username, password=password, channel_partner=channel_partner)

    token, _ = Token.objects.get_or_create(user=user)
    return Response({'token': token.key}, status=status.HTTP_201_CREATED)

@api_view(['POST'])
@permission_classes([AllowAny])
def user_login(request):
    username = request.data.get('username')
    password = request.data.get('password')
    user = authenticate(username=username, password=password)
    if user:
        login(request, user)
        token, _ = Token.objects.get_or_create(user=user)
        
        # Determine user type using related attributes
        if hasattr(user, 'landowner'):
            role = 'landowner'
        elif hasattr(user, 'channelpartner'):
            role = 'channel_partner'
        else:
            return Response({'error': 'Invalid user type'}, status=status.HTTP_400_BAD_REQUEST)

        return Response({
            'token': token.key,
            'role': role,
            'id': user.id
        }, status=status.HTTP_200_OK)
    return Response({'error': 'Invalid credentials'}, status=status.HTTP_401_UNAUTHORIZED)

@api_view(['POST'])
def user_logout(request):
    logout(request)
    return Response(status=status.HTTP_200_OK)

@api_view(['GET'])
def get_channel_partners(request):
    channel_partners = ChannelPartner.objects.all()
    serializer = ChannelPartnerSerializer(channel_partners, many=True)
    return Response(serializer.data)

@api_view(['POST'])
def upload_csv(request):
    file = request.FILES['file']
    try:
        df = pd.read_csv(file)  # Use Pandas to read CSV
        fields = []
        for index, row in df.iterrows():
            try:
                geometry = json.loads(row['geometry'])
                if geometry['type'] != 'Polygon':
                    return Response({'error': f"Row {index}: Invalid geometry type."}, status=400)

                # Landowner must already exist
                landowner = Landowner.objects.get(id=row['landowner'])

                field = Field.objects.create(
                    field_name=row['field_name'],
                    acreage=row['acreage'],
                    geometry=geometry,
                    landowner=landowner
                )
                fields.append(field)
            except Exception as e:
                return Response({'error': f"Error processing row {index}: {str(e)}"}, status=400)

        return Response({'message': 'Fields uploaded successfully.', 'fields': FieldSerializer(fields, many=True).data}, status=201)

    except pd.errors.ParserError as e:
        return Response({'error': f"Error parsing CSV: {str(e)}"}, status=400)