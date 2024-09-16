import React, { useContext, useState } from 'react';
import PropTypes from 'prop-types';
import { Alert, Button, Form, Modal } from 'react-bootstrap';
import axios from 'axios';

import config from '../../config';
import { validateGeoJSON } from '../../utils';
import { UserContext } from '../common/UserContext';

const BACKEND_URL = config.backendUrl;

const EditFieldForm = ({ field, show, handleClose, setField }) => {
  const { user } = useContext(UserContext);
  const [fieldName, setFieldName] = useState(field.field_name);
  const [geometry, setGeometry] = useState(JSON.stringify(field.geometry));
  const [landowner, setLandowner] = useState(field.landowner);
  const [geojsonError, setGeojsonError] = useState(null);
  const [submitError, setSubmitError] = useState(null);  // State for submission errors

  // If the modal is closed or hidden, reset the form fields and errors
  const resetErrors = () => {
    setFieldName(field.field_name);
    setGeometry(JSON.stringify(field.geometry));
    setLandowner(field.landowner);
    setGeojsonError(null);
    setSubmitError(null);
  };

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
      landowner: user.role === 'channel_partner' ? landowner : field.landowner,
    };

    // Send PUT request to update the field
    axios.put(`${BACKEND_URL}/fields/${field.id}/`, updatedField, {
      headers: {
        Authorization: `Bearer ${user.token}`,
      }
    })
      .then(response => {
        setField(response.data);
        resetErrors();
        handleClose();
      })
      .catch(error => {
        console.error('Error updating field:', error);
        setSubmitError(error.response?.data?.landowner?.[0] || 'Failed to update the field.');
      });
  };

  return (
    <Modal
      show={show}
      onHide={() => {
        resetErrors(); // Reset errors when modal is closed
        handleClose();
      }}
    >
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
          
          {user.role === 'channel_partner' && (
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
              value={JSON.stringify(JSON.parse(geometry || '{}'), null, 2)} // Pretty-printing
              onChange={(e) => setGeometry(e.target.value)}
              required
            />
          </Form.Group>
          {geojsonError && <Alert variant="danger">{geojsonError}</Alert>}
          {submitError && <Alert variant="danger">{submitError}</Alert>}
          <Button variant="primary" type="submit">
            Save Changes
          </Button>
        </Form>
      </Modal.Body>
    </Modal>
  );
};

EditFieldForm.propTypes = {
  field: PropTypes.shape({
    id: PropTypes.number.isRequired,
    field_name: PropTypes.string.isRequired,
    geometry: PropTypes.object.isRequired,
    landowner: PropTypes.number.isRequired,
  }).isRequired,
  show: PropTypes.bool.isRequired,
  handleClose: PropTypes.func.isRequired,
  setField: PropTypes.func.isRequired,
};

export default EditFieldForm;
