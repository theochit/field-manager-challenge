from django.contrib.auth.models import User
from django.db import models
from shapely.geometry import shape  # Import shape to handle GeoJSON geometries
from shapely.geometry.polygon import Polygon

class ChannelPartner(User):

    def get_landowners(self):
        """Returns a queryset of Landowners associated with this ChannelPartner."""
        return self.landowners.all()


class Landowner(User):
    channel_partner = models.ForeignKey(ChannelPartner, related_name="landowners", on_delete=models.CASCADE)


class Field(models.Model):
    landowner = models.ForeignKey(Landowner, on_delete=models.CASCADE)
    field_name = models.CharField(max_length=255)
    acreage = models.FloatField(null=True, blank=True)  # Acreage will be auto-calculated, see save() override
    geometry = models.JSONField()  # GeoJSON geometry

    def __str__(self):
        return self.field_name

    def calculate_acreage(self):
        """Calculate acreage based on the GeoJSON geometry."""
        geom = shape(self.geometry)
        
        if isinstance(geom, Polygon):
            area_in_square_meters = geom.area 
            acres = area_in_square_meters * 0.000247105  # Convert m^2 to acres
            return acres
        return None

    def save(self, *args, **kwargs):
        """Override save method to calculate acreage from geometry."""
        """NOTE: This does not work for manually inserted rows, since that bypasses Django's save method."""
        if self.geometry:
            self.acreage = self.calculate_acreage()  # Automatically calculate acreage
        super().save(*args, **kwargs)
