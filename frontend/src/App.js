// App.js
import React from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate, useNavigate } from 'react-router-dom';
import { Container } from 'react-bootstrap';
import {
  UserProvider,
  ProtectedRoute,
  LoginPage,
  RegisterPage,
  FieldList,
  FieldDetail,
  LandownerList,
  LandownerDetail,
  Navbar
} from './components';


const AppContent = () => {
  const navigate = useNavigate();

  return (
    <UserProvider navigate={navigate}>
      <Navbar bg="light" expand="lg" className="py-1"/>
      <Container className="mt-4">
      <Routes>
        <Route path="/login" element={<LoginPage />} />
        <Route path="/register" element={<RegisterPage />} />
        <Route element={<ProtectedRoute allowedRoles={["channel_partner", "landowner"]} />}>
          <Route path="/fields" element={<FieldList />} />
          <Route path="/fields/:id" element={<FieldDetail />} />
        </Route>
        <Route element={<ProtectedRoute allowedRoles={["channel_partner"]} />}>
          <Route path="/landowners" element={<LandownerList />} />
          <Route path="/landowners/:id" element={<LandownerDetail />} />
          <Route path="/landowners/:landownerId/fields" element={<FieldList/>} />
        </Route>
        <Route path="/" element={<Navigate to="/fields" replace />} />
      </Routes>
      </Container>
    </UserProvider>
  );
};

const App = () => (
  <Router>
    <AppContent />
  </Router>
);

export default App;
