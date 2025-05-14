import { Link, useNavigate } from "react-router-dom";
import { Container, Navbar, Nav, Button, NavDropdown } from "react-bootstrap";
import { useAuth } from "../context/AuthContext";

const LogoComponent = () => {
  return (
    <div className="logo">
      <span style={{ 
        color: '#0d6efd', 
        fontWeight: 'bold', 
        fontSize: '1.5rem',
        fontFamily: 'cursive' 
      }}>
        Art Heaven
      </span>
    </div>
  );
};

const Header = () => {
  const { user, logout } = useAuth();
  const navigate = useNavigate();
  
  const handleLogout = () => {
    logout();
    navigate('/login');
  };
  
  return (
    <Navbar bg="light" expand="lg" fixed="top" className="shadow-sm">
      <Container>
        <Navbar.Brand as={Link} to="/">
          <LogoComponent />
        </Navbar.Brand>
        <Navbar.Toggle aria-controls="basic-navbar-nav" />
        <Navbar.Collapse id="basic-navbar-nav">
          <Nav className="me-auto">
            <Nav.Link as={Link} to="/">Home</Nav.Link>
            <Nav.Link as={Link} to="/about">About</Nav.Link>
            <Nav.Link as={Link} to="/services">Services</Nav.Link>
            <Nav.Link as={Link} to="/gallery">Gallery</Nav.Link>
            <Nav.Link as={Link} to="/products">Products</Nav.Link>
            <Nav.Link as={Link} to="/contact">Contact</Nav.Link>
          </Nav>
          <Nav>
            {user ? (
              <>
                {user.isAdmin && (
                  <NavDropdown title="Admin" id="admin-dropdown">
                    <NavDropdown.Item as={Link} to="/admin">Dashboard</NavDropdown.Item>
                    <NavDropdown.Item as={Link} to="/admin/products">Products</NavDropdown.Item>
                    <NavDropdown.Item as={Link} to="/admin/orders">Orders</NavDropdown.Item>
                    <NavDropdown.Item as={Link} to="/admin/contacts">Contacts</NavDropdown.Item>
                  </NavDropdown>
                )}
                <NavDropdown title={user.name} id="user-dropdown">
                  <NavDropdown.Item as={Link} to="/profile">My Profile</NavDropdown.Item>
                  <NavDropdown.Item as={Link} to="/orders">My Orders</NavDropdown.Item>
                  <NavDropdown.Divider />
                  <NavDropdown.Item onClick={handleLogout}>Logout</NavDropdown.Item>
                </NavDropdown>
              </>
            ) : (
              <>
                <Button as={Link} to="/login" variant="outline-primary" className="me-2">Login</Button>
                <Button as={Link} to="/register" variant="primary">Register</Button>
              </>
            )}
          </Nav>
        </Navbar.Collapse>
      </Container>
    </Navbar>
  );
};

export default Header; 