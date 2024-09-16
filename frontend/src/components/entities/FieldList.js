import React, { useContext,useEffect, useState } from 'react';
import { Button, Card, Col, Container, Modal,Row } from 'react-bootstrap';
import { Link, useParams } from 'react-router-dom';
import axios from 'axios';

import config from '../../config';
import { deleteResource } from '../../utils';
import AddFieldForm from '../forms/AddFieldForm';
import { UserContext } from '../common/UserContext';

const BACKEND_URL = config.backendUrl;

const FieldList = () => {
  const { landownerId } = useParams();  // Extract landownerId from URL
  const { user } = useContext(UserContext);
  const [fields, setFields] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showForm, setShowForm] = useState(false);
  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const [selectedField, setSelectedField] = useState(null);

  useEffect(() => {
    const url = landownerId
      ? `${BACKEND_URL}/landowner/${landownerId}/fields/`
      : `${BACKEND_URL}/${user.role}/${user.id}/fields/`;

    axios.get(url, {
      headers: {
        Authorization: `Bearer ${user.token}`
      }
    })
      .then(response => {
        setFields(response.data);  // Set fields from the response
        setLoading(false);
      })
      .catch(error => {
        console.error('Error fetching fields:', error);
        setLoading(false);
      });
  }, [user, landownerId]);

  // Handle delete field (using the deleteResource utility)
  const handleDeleteClick = (field) => {
    setSelectedField(field); 
    setShowDeleteModal(true);
  };

  const confirmDelete = async () => {
    if (selectedField) {
      try {
        await deleteResource('fields', selectedField.id);
        setFields(fields.filter(field => field.id !== selectedField.id));
        setShowDeleteModal(false);
        setSelectedField(null);
      } catch (error) {
        console.error('Error deleting field:', error);
      }
    }
  };

  // Add a new field to the state after form submission or CSV upload
  const addField = (newField) => {
    setFields(prevFields => [...prevFields, newField]);
  };

  return (
    <Container>
      <Row>
        <Col>
          <h1>Fields</h1>
          {loading ? (
            <p>Loading fields...</p>
          ) : (
            <Row>
              {fields.map(field => (
                <Col key={field.id} md={4}>
                  <Card className="mb-4">
                    <Card.Body>
                      <Card.Title>{field.field_name}</Card.Title>
                      <Card.Text>Acreage: {field.acreage.toFixed(2)}</Card.Text>
                      {user.role === 'channel_partner' && <Card.Text>LandownerID: {field.landowner}</Card.Text>}
                      <Button variant="primary" as={Link} to={`/fields/${field.id}`}>View Details</Button>
                      <Button variant="danger" onClick={() => handleDeleteClick(field)}>Delete</Button>
                    </Card.Body>
                  </Card>
                </Col>
              ))}
            </Row>
          )}

          <Button variant="primary" onClick={() => setShowForm(true)}>Add Field</Button>

          <AddFieldForm
            show={showForm}
            handleClose={() => setShowForm(false)}
            addField={addField}
          />

          <Modal show={showDeleteModal} onHide={() => setShowDeleteModal(false)}>
            <Modal.Header closeButton>
              <Modal.Title>Confirm Delete</Modal.Title>
            </Modal.Header>
            <Modal.Body>
              Are you sure you want to delete the field <strong>{selectedField?.name}</strong>?
            </Modal.Body>
            <Modal.Footer>
              <Button variant="secondary" onClick={() => setShowDeleteModal(false)}>Cancel</Button>
              <Button variant="danger" onClick={confirmDelete}>Delete</Button>
            </Modal.Footer>
          </Modal>
        </Col>
      </Row>
    </Container>
  );
};

export default FieldList;
