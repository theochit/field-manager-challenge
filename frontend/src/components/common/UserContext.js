import React, { createContext, useEffect, useState } from 'react';
import PropTypes from 'prop-types'; // Import PropTypes
import axios from 'axios';

import { BACKEND_URL } from '../../config';

export const UserContext = createContext();

export const UserProvider = ({ children, navigate }) => {
  const [user, setUser] = useState({
    token: localStorage.getItem('token'),
    username: localStorage.getItem('username') || '',
    role: localStorage.getItem('role') || '',
    id: localStorage.getItem('id') || ''
  });

  useEffect(() => {
    if (user.token) {
      setUser({
        token: localStorage.getItem('token'),
        username: localStorage.getItem('username') || '',
        role: localStorage.getItem('role') || '',
        id: localStorage.getItem('id') || ''
      });
    }
  }, [user.token]);

  const handleLogin = async (username, password) => {
    try {
      const response = await axios.post(`${BACKEND_URL}/login/`, { username, password });
      const newToken = response.data.token;
      setUser({
        token: newToken,
        username: username,
        role: response.data.role,
        id: response.data.id
      });
      localStorage.setItem('token', newToken);
      localStorage.setItem('username', username);
      localStorage.setItem('role', response.data.role);
      localStorage.setItem('id', response.data.id);
      return { success: true };
    } catch (error) {
      console.error('Login failed:', error);
      return { success: false, error: 'Login failed. Please check your credentials.' };
    }
  };

  const handleLogout = async () => {
    try {
      await axios.post(`${BACKEND_URL}/logout/`, null, {
        headers: { Authorization: `Token ${user.token}` }
      });
    } catch (error) {
      console.error('Logout failed:', error);
    } finally {
      setUser({
        token: null,
        username: '',
        role: '',
        id: ''
      });
      localStorage.removeItem('token');
      localStorage.removeItem('username');
      localStorage.removeItem('role');
      localStorage.removeItem('id');
      
      navigate('/login');
    }
  };

  return (
    <UserContext.Provider value={{ user, handleLogin, handleLogout }}>
      {children}
    </UserContext.Provider>
  );
};

UserProvider.propTypes = {
  children: PropTypes.node.isRequired,
  navigate: PropTypes.func.isRequired
};
