import React from 'react';
import { Button } from 'react-bootstrap';
import { useNavigate } from 'react-router-dom';

const UnauthorizedPage = () => {
  const navigate = useNavigate();

  const handleGoBack = () => {
    navigate(-1); // Navigate back to the previous page
  };

  return (
    <div className="d-flex flex-column align-items-center" style={{ height: '100vh' }}>
      <h1 className="display-4">Unauthorized</h1>
      <p className="lead">You do not have permission to view this page.</p>
      <Button variant="primary" onClick={handleGoBack}>
        Go Back
      </Button>
    </div>
  );
};

export default UnauthorizedPage;