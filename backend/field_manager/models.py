import pyproj
from django.contrib.auth.models import User
from django.db import models
from shapely.geometry import shape  # Import shape to handle GeoJSON geometries
from shapely.geometry.polygon import Polygon
from shapely.ops import transform


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
        """Calculate acreage assuming the GeoJSON is EPSG:4326."""
        geom = shape(self.geometry)

        if isinstance(geom, Polygon):
            # Need to transform to a projection that uses meters in order to calculate acres.
            transformer = pyproj.Transformer.from_crs("EPSG:4326", "EPSG:3857", always_xy=True).transform
            geom_in_meters = transform(transformer, geom)

            # Calculate the area in square meters
            area_in_square_meters = geom_in_meters.area

            # Convert square meters to acres (1 acre = 4046.86 square meters)
            acres = area_in_square_meters / 4046.86
            return acres
        return None

    def save(self, *args, **kwargs):
        """Override save method to calculate acreage from geometry."""
        """NOTE: This does not work for manually inserted rows, since that bypasses Django's save method."""
        if self.geometry:
            self.acreage = self.calculate_acreage()  # Automatically calculate acreage
        super().save(*args, **kwargs)
