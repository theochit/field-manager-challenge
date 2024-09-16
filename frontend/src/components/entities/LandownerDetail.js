import React, { useEffect, useState } from 'react';
import { Button,Card, Container } from 'react-bootstrap';  // Import Bootstrap components
import { Link,useParams } from 'react-router-dom';
import axios from 'axios';

import config from '../../config';

const BACKEND_URL = config.backendUrl;

const LandownerDetail = () => {
  const { id } = useParams();  // Get the ID from the URL
  const [landowner, setLandowner] = useState(null);

  useEffect(() => {
    axios.get(`${BACKEND_URL}/landowner/${id}/`)
      .then(response => setLandowner(response.data))
      .catch(error => console.error('Error fetching landowner:', error));
  }, [id]);

  if (!landowner) {
    return <div>Loading...</div>;
  }

  return (
    <Container className="mt-5">
      <Card>
        <Card.Header as="h1">User: {landowner.username}</Card.Header>
        <Card.Body>
          <Card.Text>
            <strong>Landowner ID:</strong> {landowner.id}
          </Card.Text>
          <Button variant="primary" as={Link} to="/landowners" className="mt-3">
            Back to Landowners
          </Button>
        </Card.Body>
      </Card>
    </Container>
  );
};

export default LandownerDetail;