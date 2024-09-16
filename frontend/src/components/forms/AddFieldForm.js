import React, { useContext, useState } from 'react';
import PropTypes from 'prop-types';  // Import PropTypes
import { Alert, Button, Form, Modal } from 'react-bootstrap';

import { addResource, uploadCsv, validateGeoJSON } from '../../utils';
import { UserContext } from '../common/UserContext';

const AddFieldForm = ({ show, handleClose, addField: addFieldToState }) => {
  const { user } = useContext(UserContext);
  const [fieldName, setFieldName] = useState('');
  const [acreage, setAcreage] = useState('');
  const [geometry, setGeometry] = useState('');
  const [landowner, setLandowner] = useState(user.role === 'landowner' ? user.id : '');  
  const [error, setError] = useState(null);  // Error state for invalid GeoJSON
  const [csvFile, setCsvFile] = useState(null);
  const [csvErrors, setCsvErrors] = useState([]);

  // If the modal is closed or hidden, reset the form fields and errors
  const resetErrors = () => {
    setError(null); 
    setCsvErrors([]);
    resetForm();
  };
  
  const handleSubmit = async (e) => {
    e.preventDefault();

    const validation = validateGeoJSON(geometry);
    if (!validation.isValid) {
      setError(validation.message);
      return;
    }

    const newField = {
      field_name: fieldName,
      acreage,
      geometry: JSON.parse(geometry).geometry || JSON.parse(geometry),  // Use the geometry if it's a single feature
      landowner: user.role === 'channel_partner' ? landowner : user.id  // A channel_partner can specify a landowner, otherwise use the current user
    };

    try {
      const addedField = await addResource('fields', newField, user.token);
      addFieldToState(addedField);
      handleClose();
      resetForm(); 
    } catch (error) {
      setError('Failed to add field. Please try again.');
    }
  };

  const resetForm = () => {
    setFieldName('');
    setAcreage('');
    setGeometry('');
    setLandowner(user.role === 'landowner' ? user.id : '');
    setError(null);
    setCsvFile(null);
    setCsvErrors([]);
  };

  const handleCsvUpload = (e) => {
    const file = e.target.files[0];
    setCsvFile(file);
  };

  const handleCsvSubmit = async () => {
    if (!csvFile) {
      setError('Please upload a CSV file');
      return;
    }

    try {
      const uploadedFields = await uploadCsv(csvFile, user.token);
      if (uploadedFields && uploadedFields.length > 0) {
        uploadedFields.forEach(field => addFieldToState(field));  // Add each new field to the state
      }
      handleClose();
      resetForm();
    } catch (error) {
      setError('Error uploading CSV');
    }
  };

  return (
    <Modal show={show} onHide={() => {
      handleClose();
      resetErrors();
    }}>
      <Modal.Header closeButton>
        <Modal.Title>Add Field</Modal.Title>
      </Modal.Header>
      <Modal.Body>
        <Form onSubmit={handleSubmit}>
          <Form.Group controlId="formFieldName">
            <Form.Label>Field Name</Form.Label>
            <Form.Control
              type="text"
              value={fieldName}
              onChange={(e) => setFieldName(e.target.value)}
              required
            />
          </Form.Group>
          <Form.Group controlId="formGeometry">
            <Form.Label>Geometry (GeoJSON)</Form.Label>
            <Form.Control
              as="textarea"
              rows={3}
              value={geometry}
              onChange={(e) => setGeometry(e.target.value)}
              required
            />
          </Form.Group>
          {user.role === 'channel_partner' && (
            <Form.Group controlId="formLandowner">
              <Form.Label>Landowner</Form.Label>
              <Form.Control
                type="text"
                value={landowner}
                onChange={(e) => setLandowner(e.target.value)}
                required
              />
            </Form.Group>
          )}
          {error && <Alert variant="danger">{error}</Alert>}
          <Button className="mt-2" variant="primary" type="submit">Submit</Button>
        </Form>
        <hr />
        <Form>
          <Form.Group controlId="formCsvUpload">
            <Form.Label>Upload CSV</Form.Label>
            <Form.Control
              type="file"
              accept=".csv"
              onChange={handleCsvUpload}
            />
          </Form.Group>
          <Button className="mt-2" variant="secondary" onClick={handleCsvSubmit}>Upload CSV</Button>
        </Form>
        {csvErrors.length > 0 && (
          <Alert variant="danger">
            <ul>
              {csvErrors.map((err, idx) => <li key={idx}>{err}</li>)}
            </ul>
          </Alert>
        )}
      </Modal.Body>
    </Modal>
  );
};

AddFieldForm.propTypes = {
  show: PropTypes.bool.isRequired,
  handleClose: PropTypes.func.isRequired,
  addField: PropTypes.func.isRequired
};

export default AddFieldForm;
