import axios from 'axios';
import config from './config';

const BACKEND_URL = config.backendUrl;

export const deleteResource = async (resourceType, resourceId) => {
    try {
      await axios.delete(`${BACKEND_URL}/${resourceType}/${resourceId}/`);
      return true;
    } catch (error) {
      console.error(`Error deleting ${resourceType}:`, error);
      throw error;
    }
  };

export const addResource = async (resourceType, resource, token) => {
  try {
    const response = await axios.post(`${BACKEND_URL}/${resourceType}/`, resource, {
      headers: {
        Authorization: `Bearer ${token}`
      }
    });
    return response.data;
  } catch (error) {
    console.error(`Error adding ${resourceType}:`, error);
    throw error;
  }
};

export const uploadCsv = async (csvFile, token) => {
  try {
    const formData = new FormData();
    formData.append('file', csvFile);

    const response = await axios.post(`${BACKEND_URL}/upload_csv/`, formData, {
      headers: {
        'Content-Type': 'multipart/form-data',
        Authorization: `Bearer ${token}`
      }
    });

    return response.data.fields;
  } catch (error) {
    console.error('Error uploading CSV:', error);
    throw error;
  }
};

// In this project, only valid GeoJSONs and GeoJSON geometries are accepted
export const validateGeoJSON = (geojson) => {
  try {
    const parsedGeoJSON = JSON.parse(geojson);

    if (
      parsedGeoJSON.type !== "Feature" &&
      parsedGeoJSON.type !== "Polygon" &&
      parsedGeoJSON.type !== "FeatureCollection"
    ) {
      return { isValid: false, message: "GeoJSON must be a Feature or Polygon" };
    }

    if (parsedGeoJSON.type === "FeatureCollection") {
      return { isValid: false, message: "FeatureCollection is not allowed, please submit a single Feature." };
    }

    return { isValid: true };
  } catch (error) {
    return { isValid: false, message: "Invalid GeoJSON format." };
  }
};