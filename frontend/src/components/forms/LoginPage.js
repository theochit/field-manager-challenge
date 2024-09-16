import React, { useContext,useState } from 'react';
import { Alert,Button, Form } from 'react-bootstrap';
import { useNavigate } from 'react-router-dom';

import { UserContext } from '../common/UserContext.js'; 

function LoginPage() {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const navigate = useNavigate();
  const { handleLogin } = useContext(UserContext); 

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    const result = await handleLogin(username, password);
    if (result.success) {
      navigate('/fields');
    } else {
      setError(result.error);
    }
  };

  return (
    <div>
      <h2>Login</h2>
      {error && <Alert variant="danger">{error}</Alert>}
      <Form onSubmit={handleSubmit}>
        <Form.Group className="mb-3" controlId="formBasicUsername">
          <Form.Label>Username</Form.Label>
          <Form.Control
            type="text"
            placeholder="Enter username"
            value={username}
            onChange={(e) => setUsername(e.target.value)}
            required
          />
        </Form.Group>

        <Form.Group className="mb-3" controlId="formBasicPassword">
          <Form.Label>Password</Form.Label>
          <Form.Control
            type="password"
            placeholder="Password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            required
          />
        </Form.Group>

        <Button variant="primary" type="submit">
          Login
        </Button>
      </Form>
    </div>
  );
}

export default LoginPage;