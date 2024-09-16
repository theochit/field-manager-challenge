from django.urls import path, include
from .views import FieldViewSet, LandownerViewSet, ChannelPartnerViewSet, upload_csv
from rest_framework.routers import DefaultRouter

router = DefaultRouter()
router.register(r'fields', FieldViewSet)
router.register(r'landowner', LandownerViewSet)
router.register(r'channel_partner', ChannelPartnerViewSet)

urlpatterns = [
    path('', include(router.urls)),
    path('upload_csv/', upload_csv, name='upload_csv'),  # Add this line
]