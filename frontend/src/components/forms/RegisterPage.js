import React, { useEffect,useState } from 'react';
import { Alert,Button, Form } from 'react-bootstrap';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';

import { BACKEND_URL } from '../../config';

function RegisterPage() {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [role, setRole] = useState('channel_partner');
  const [channelPartners, setChannelPartners] = useState([]);
  const [selectedChannelPartner, setSelectedChannelPartner] = useState('');
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');
  const navigate = useNavigate();

  useEffect(() => {
    // New Landowners will need to pick their ChannelPartner
    const fetchChannelPartners = async () => {
      try {
        const response = await axios.get(`${BACKEND_URL}/channel_partner/`);
        setChannelPartners(response.data);
      } catch (error) {
        console.error('Error fetching ChannelPartners:', error);
      }
    };

    fetchChannelPartners();
  }, []);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setSuccess('');

    if (role === 'landowner' && !selectedChannelPartner) {
      setError('Landowner registration requires selecting a ChannelPartner.');
      return;
    }

    try {
      const response = await axios.post(`${BACKEND_URL}/register/`, { 
        username, 
        password, 
        role, 
        channel_partner_id: selectedChannelPartner 
      });
      if (response.status === 201) {
        setSuccess('Registration successful! Redirecting to login...');
        setTimeout(() => {
          navigate('/login');
        }, 1000);
      }
    } catch (error) {
      setError('Registration failed. Please try again.');
    }
  };

  return (
    <div>
      <h2>Register</h2>
      {error && <Alert variant="danger">{error}</Alert>}
      {success && <Alert variant="success">{success}</Alert>}
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

        <Form.Group className="mb-3" controlId="formBasicRole">
          <Form.Label>Role</Form.Label>
          <Form.Control
            as="select"
            value={role}
            onChange={(e) => setRole(e.target.value)}
            required
          >
            <option value="channel_partner">Channel Partner</option>
            <option value="landowner">Landowner</option>
          </Form.Control>
        </Form.Group>

        {role === 'landowner' && (
          <Form.Group className="mb-3" controlId="formBasicChannelPartner">
            <Form.Label>Channel Partner</Form.Label>
            <Form.Control
              as="select"
              value={selectedChannelPartner}
              onChange={(e) => setSelectedChannelPartner(e.target.value)}
              required
            >
              <option value="">Select a Channel Partner</option>
              {channelPartners.map(partner => (
                <option key={partner.id} value={partner.id}>{partner.username}</option>
              ))}
            </Form.Control>
          </Form.Group>
        )}

        <Button variant="primary" type="submit">
          Register
        </Button>
      </Form>
    </div>
  );
}

export default RegisterPage;