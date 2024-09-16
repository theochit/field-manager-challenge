import React, { useEffect, useState, useContext } from 'react';
import { Button, Card, Col, Container, Row, Spinner } from 'react-bootstrap';
import { useParams } from 'react-router-dom';
import axios from 'axios';

import config from '../../config';
import EditFieldForm from '../forms/EditFieldForm';
import MapComponent from '../common/MapComponent';
import UnauthorizedPage from '../common/UnauthorizedPage';
import { UserContext } from '../common/UserContext';

const BACKEND_URL = config.backendUrl;

const FieldDetail = () => {
  const { user } = useContext(UserContext);
  const { id } = useParams();  // Get the field ID from the URL
  const [field, setField] = useState(null);
  const [loading, setLoading] = useState(true);
  const [showEditModal, setShowEditModal] = useState(false);
  const [unauthorized, setUnauthorized] = useState(false); // New state for unauthorized access

  useEffect(() => {
    // Fetch the field data from the backend
    axios.get(`${BACKEND_URL}/fields/${id}/`)
      .then(response => {
        const fetchedField = response.data;
        // Check if user is landowner and ID does not match
        if (user.role === 'landowner' && fetchedField.landowner != user.id) {
          setUnauthorized(true); // Set unauthorized state if user can't access the field
        } else {
          setField(fetchedField);
        }
        setLoading(false);
      })
      .catch(error => {
        console.error('Error fetching field:', error);
        setLoading(false);
      });
  }, [id, user]);

  const handleEditClick = () => {
    setShowEditModal(!showEditModal);
  };

  // Show unauthorized page if the user is not authorized
  if (unauthorized) {
    return <UnauthorizedPage />;
  }

  // Show loading spinner while data is being fetched
  if (loading) {
    return (
      <Container className="text-center mt-5">
        <Spinner animation="border" role="status">
          <span className="visually-hidden">Loading...</span>
        </Spinner>
        <p>Loading Field Data...</p>
      </Container>
    );
  }

  return (
    <Container className="mt-5">
      <Row className="mb-4">
        <Col>
          <Card className="text-center">
            <Card.Body>
              <Card.Title>{field.field_name}</Card.Title>
              <Card.Text>
                <strong>Acreage:</strong> {field.acreage.toFixed(2)} acres <br />
                <strong>Field ID:</strong> {field.id} <br />
                <strong>Landowner ID:</strong> {field.landowner}
              </Card.Text>
              <Button variant="primary" className="me-2" onClick={handleEditClick}>Edit Field</Button>
            </Card.Body>
          </Card>
        </Col>
      </Row>

      <Row className="justify-content-center">
        <Col md={8}>
          <Card>
            <Card.Body>
              {field.geometry && <MapComponent geometry={field.geometry} />}  {/* Ensure the geometry exists */}
            </Card.Body>
          </Card>
        </Col>
      </Row>

      <EditFieldForm
        field={field}
        show={showEditModal}
        handleClose={handleEditClick}
        setField={setField}
      />
    </Container>
  );
};

export default FieldDetail;
