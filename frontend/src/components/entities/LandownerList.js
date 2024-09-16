import React, { useEffect, useState } from 'react';
import { Button, Card, Col, Container, ListGroup,Row } from 'react-bootstrap';
import { Link } from 'react-router-dom';
import axios from 'axios';

import config from '../../config';

const BACKEND_URL = config.backendUrl;

const LandownerList = () => {
  const [landowners, setLandowners] = useState([]);

  useEffect(() => {
    axios.get(`${BACKEND_URL}/landowner/`)
      .then(response => setLandowners(response.data))
      .catch(error => console.error('Error fetching landowners:', error));
  }, []);

  return (
    <Container className="mt-5">
      <h1 className="mb-4">Landowner List</h1>
      <Row>
        {landowners.map(landowner => (
          <Col md={4} key={landowner.id} className="mb-4">
            <Card>
              <Card.Body>
                <Card.Title>{landowner.username}</Card.Title>
                <ListGroup variant="flush">
                  <ListGroup.Item>Landowner ID: {landowner.id}</ListGroup.Item>
                </ListGroup>
                <div className="d-grid gap-2">
                  <Button variant="primary" as={Link} to={`/landowners/${landowner.id}/fields/`} className="mt-3">
                    View Fields
                  </Button>
                  <Button variant="secondary" as={Link} to={`/landowners/${landowner.id}/`} className="mt-2">
                    View Landowner
                  </Button>
                </div>
              </Card.Body>
            </Card>
          </Col>
        ))}
      </Row>
    </Container>
  );
};

export default LandownerList;