import React, { useEffect } from 'react';
import WebMap from '@arcgis/core/WebMap';
import MapView from '@arcgis/core/views/MapView';
import GeoJSONLayer from '@arcgis/core/layers/GeoJSONLayer';

const MapComponent = ({ geometry }) => {
  useEffect(() => {
    let view;

    const initMap = async () => {
      try {
        const webMap = new WebMap({
          basemap: 'osm'
        });

        const geoJson = {
          type: "Feature",
          geometry,
        };

        const geoJsonLayer = new GeoJSONLayer({
          url: URL.createObjectURL(new Blob([JSON.stringify(geoJson)], { type: "application/json" })),
          renderer: {
            type: 'simple',
            symbol: {
              type: 'simple-fill',
              color: [227, 139, 79, 0.8],
              outline: {
                color: [255, 255, 255],
                width: 1
              }
            }
          }
        });

        webMap.add(geoJsonLayer);

        // Create a MapView and set its container and map
        view = new MapView({
          container: 'mapDiv',
          map: webMap
        });

        // Wait for both the map and the GeoJSON layer to be ready before making further changes
        await view.when();
        await geoJsonLayer.when();

        view.goTo(geoJsonLayer.fullExtent).then(() => {
          view.zoom -= 1;  // Adjust the zoom level to give a better view of the geometry
        }).catch(error => {
          console.error('Error in goTo method:', error);
        });

      } catch (error) {
        console.error('Error loading map or GeoJSON layer:', error);
      }
    };

    initMap();

    // Clean up map view when the component is unmounted
    return () => {
      if (view) {
        view.destroy();
      }
    };
  }, [geometry]);

  return (
    <div id="mapDiv" style={{ height: '500px', width: '100%' }}>
      {/* Map will be rendered inside this div */}
    </div>
  );
};

export default MapComponent;
