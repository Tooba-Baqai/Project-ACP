import { useState, useEffect } from 'react';
import { Link, NavLink, useNavigate, useLocation } from 'react-router-dom';
import { Container, Navbar, Nav, Button, NavDropdown, Badge } from 'react-bootstrap';
import { useAuth } from '../context/AuthContext';
import { useCart } from '../context/CartContext';

const LogoComponent = () => {
  return (
    <div className="logo">
      <span style={{ 
        color: '#533b37', 
        fontWeight: 'bold', 
        fontSize: '1.8rem',
        fontFamily: 'cursive',
        textTransform: 'uppercase',
        letterSpacing: '1px'
      }}>
        Art Heaven
      </span>
    </div>
  );
};

const Header = () => {
  const { currentUser, isAuthenticated, isAdmin, logout } = useAuth();
  const { cart } = useCart();
  const navigate = useNavigate();
  const location = useLocation();
  const [expanded, setExpanded] = useState(false);

  if (isAdmin && currentUser?.role === 'admin' && location.pathname.startsWith('/admin')) {
    return null;
  }

  const handleLogout = () => {
    logout();
    navigate('/');
  };

  const closeNavbar = () => setExpanded(false);

  const cartItemCount = cart?.items?.reduce((total, item) => total + item.quantity, 0) || 0;

  return (
    <Navbar 
      bg="light" 
      expand="lg" 
      className="shadow-sm py-3"
      fixed="top"
      expanded={expanded}
    >
      <Container>
        <Navbar.Brand as={Link} to="/" onClick={closeNavbar}>
          <LogoComponent />
        </Navbar.Brand>
        <Navbar.Toggle 
          aria-controls="basic-navbar-nav" 
          onClick={() => setExpanded(!expanded)}
        />
        <Navbar.Collapse id="basic-navbar-nav">
          <Nav className="me-auto">
            <Nav.Link 
              as={NavLink} 
              to="/" 
              onClick={closeNavbar}
              className={({ isActive }) => isActive ? 'active' : ''}
            >
              Home
            </Nav.Link>
            <Nav.Link 
              as={NavLink} 
              to="/about" 
              onClick={closeNavbar}
              className={({ isActive }) => isActive ? 'active' : ''}
            >
              About
            </Nav.Link>
            <Nav.Link 
              as={NavLink} 
              to="/services" 
              onClick={closeNavbar}
              className={({ isActive }) => isActive ? 'active' : ''}
            >
              Services
            </Nav.Link>
            <Nav.Link 
              as={NavLink} 
              to="/gallery" 
              onClick={closeNavbar}
              className={({ isActive }) => isActive ? 'active' : ''}
            >
              Gallery
            </Nav.Link>
            <Nav.Link 
              as={NavLink} 
              to="/products" 
              onClick={closeNavbar}
              className={({ isActive }) => isActive ? 'active' : ''}
            >
              Products
            </Nav.Link>
            <Nav.Link 
              as={NavLink} 
              to="/contact" 
              onClick={closeNavbar}
              className={({ isActive }) => isActive ? 'active' : ''}
            >
              Contact
            </Nav.Link>
          </Nav>
          
          <Nav>
            <Nav.Link 
              as={NavLink} 
              to="/cart" 
              onClick={closeNavbar}
              className={`me-3 ${({ isActive }) => isActive ? 'active' : ''}`}
            >
              <i className="fas fa-shopping-cart"></i>
              {cartItemCount > 0 && (
                <Badge bg="primary" pill className="ms-1">
                  {cartItemCount}
                </Badge>
              )}
            </Nav.Link>
            
            {isAuthenticated ? (
              <NavDropdown 
                title={currentUser?.name || 'Account'} 
                id="user-dropdown"
                align="end"
              >
                {isAdmin ? (
                  <NavDropdown.Item 
                    as={Link} 
                    to="/admin" 
                    onClick={closeNavbar}
                  >
                    Admin Dashboard
                  </NavDropdown.Item>
                ) : (
                  <NavDropdown.Item 
                    as={Link} 
                    to="/dashboard" 
                    onClick={closeNavbar}
                  >
                    Dashboard
                  </NavDropdown.Item>
                )}
                <NavDropdown.Item 
                  as={Link} 
                  to="/orders" 
                  onClick={closeNavbar}
                >
                  Orders
                </NavDropdown.Item>
                <NavDropdown.Divider />
                <NavDropdown.Item 
                  onClick={() => {
                    closeNavbar();
                    handleLogout();
                  }}
                >
                  Logout
                </NavDropdown.Item>
              </NavDropdown>
            ) : (
              <>
                <Button 
                  as={Link} 
                  to="/login" 
                  variant="outline-primary" 
                  className="me-2"
                  onClick={closeNavbar}
                >
                  Login
                </Button>
                <Button 
                  as={Link} 
                  to="/register" 
                  variant="primary"
                  onClick={closeNavbar}
                >
                  Register
                </Button>
              </>
            )}
          </Nav>
        </Navbar.Collapse>
      </Container>
    </Navbar>
  );
};

export default Header; 