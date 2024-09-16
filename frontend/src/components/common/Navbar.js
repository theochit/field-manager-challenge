import React from 'react';
import { Navbar, Container, Nav, Button } from 'react-bootstrap';
import { Link } from 'react-router-dom';
import { UserContext } from './UserContext';

const NavbarComponent = () => {
  return (
    <Navbar bg="light" expand="lg" className="py-1">
      <Container>
        <Navbar.Brand href="/" className="d-flex align-items-center">
          <img
            src="/arva-logo-dark.webp"
            className="d-flex align-items-center img-fluid"
            alt="Logo"
            style={{ maxHeight: '50px' }}
          />
          <span className="ms-2">Field Manager</span>
        </Navbar.Brand>
        <Navbar.Toggle aria-controls="basic-navbar-nav" />
        <Navbar.Collapse id="basic-navbar-nav">
          <Nav className="me-auto">
            <UserContext.Consumer>
              {({ user }) =>
                user.token && (
                  <>
                    <Nav.Link as={Link} to="/fields">Fields</Nav.Link>
                    {user.role === 'channel_partner' ? (
                      <Nav.Link as={Link} to="/landowners">Landowners</Nav.Link>
                    ) : null}
                  </>
                )
              }
            </UserContext.Consumer>
          </Nav>
          <Nav>
            <UserContext.Consumer>
              {({ user, handleLogout }) =>
                user.token ? (
                  <>
                    <Navbar.Text className="me-2">
                      Signed in as: {user.username} ({user.role} {user.id})
                    </Navbar.Text>
                    <Button onClick={handleLogout} variant="outline-primary">Logout</Button>
                  </>
                ) : (
                  <>
                    <Nav.Link as={Link} to="/login">Login</Nav.Link>
                    <Nav.Link as={Link} to="/register">Register</Nav.Link>
                  </>
                )
              }
            </UserContext.Consumer>
          </Nav>
        </Navbar.Collapse>
      </Container>
    </Navbar>
  );
};

export default NavbarComponent;