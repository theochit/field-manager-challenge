import React, { useContext } from 'react';
import { Navigate, Outlet } from 'react-router-dom';

import UnauthorizedPage from './UnauthorizedPage';
import { UserContext } from './UserContext';

const ProtectedRoute = ({ allowedRoles }) => {
  const { user } = useContext(UserContext);

  if (!user || !user.token) {
    // User is not logged in, redirect to login
    return <Navigate to="/login" replace />;
  }

  if (allowedRoles && !allowedRoles.includes(user.role)) {
    // User does not have any of the allowed roles, show "Not Authorized" message
    return (
      <UnauthorizedPage />
    );
  }

  // If authenticated and the role matches, render the child routes
  return <Outlet />;
};

export default ProtectedRoute;