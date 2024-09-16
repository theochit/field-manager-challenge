import React, { useContext,useState } from 'react';
import { Alert,Button, Form, Modal } from 'react-bootstrap';
import axios from 'axios';

import config from '../../config';
import { validateGeoJSON } from '../../utils';
import { UserContext } from '../common/UserContext';

const BACKEND_URL = config.backendUrl;

const EditFieldForm = ({ field, show, handleClose, setField }) => {
  const { user } = useContext(UserContext);
  const [fieldName, setFieldName] = useState(field.field_name);
  const [geometry, setGeometry] = useState(JSON.stringify(field.geometry));
  const [landowner, setLandowner] = useState(field.landowner);  // Set landowner state to the existing field's landowner
  const [geojsonError, setGeojsonError] = useState(null);

  const handleFormSubmit = (e) => {
    e.preventDefault();

    // Validate the GeoJSON before submitting
    const validation = validateGeoJSON(geometry);
    if (!validation.isValid) {
      setGeojsonError(validation.message);
      return;
    }

    const updatedField = {
      field_name: fieldName,
      geometry: JSON.parse(geometry),
      landowner: user.role === 'channel_partner' ? landowner : field.landowner,  // Use updated landowner only for channel_partner
    };

    // Send PUT request to update the field
    axios.put(`${BACKEND_URL}/fields/${field.id}/`, updatedField, {
      headers: {
        Authorization: `Bearer ${user.token}`,
      }
    })
      .then(response => {
        setField(response.data);  // Update field data in parent state, so that MapComponent updates
        handleClose();
      })
      .catch(error => {
        console.error('Error updating field:', error);
      });
  };

  return (
    <Modal show={show} onHide={handleClose}>
      <Modal.Header closeButton>
        <Modal.Title>Edit Field</Modal.Title>
      </Modal.Header>
      <Modal.Body>
        <Form onSubmit={handleFormSubmit}>
          <Form.Group controlId="formFieldName">
            <Form.Label>Field Name</Form.Label>
            <Form.Control
              type="text"
              value={fieldName}
              onChange={(e) => setFieldName(e.target.value)}
              required
            />
          </Form.Group>
          
          {user.role === 'channel_partner' && (  // Only ChannelPartners can edit the landowner
            <Form.Group controlId="formLandowner">
              <Form.Label>Landowner ID</Form.Label>
              <Form.Control
                type="text"
                value={landowner}
                onChange={(e) => setLandowner(e.target.value)}
                required
              />
            </Form.Group>
          )}

          <Form.Group controlId="formGeometry">
            <Form.Label>Geometry (GeoJSON)</Form.Label>
            <Form.Control
              as="textarea"
              rows={5}
              value={JSON.stringify(JSON.parse(geometry || '{}'), null, 2)} // Simple pretty-printing
              onChange={(e) => setGeometry(e.target.value)}
              required
            />
          </Form.Group>
          {geojsonError && <Alert variant="danger">{geojsonError}</Alert>}
          <Button variant="primary" type="submit">
            Save Changes
          </Button>
        </Form>
      </Modal.Body>
    </Modal>
  );
};

export default EditFieldForm;
