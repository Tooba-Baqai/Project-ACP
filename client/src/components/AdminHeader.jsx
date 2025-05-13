import { useState, useEffect } from 'react';
import { Link, NavLink, useNavigate, useLocation } from 'react-router-dom';
import { Container, Navbar, Nav, Button } from 'react-bootstrap';
import { useAuth } from '../context/AuthContext';

// AdminHeader component - used only for admin users
const AdminHeader = () => {
  const { currentUser, isAdmin, logout } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();
  const [expanded, setExpanded] = useState(false);

  // Ensure this header is only shown to admin users
  useEffect(() => {
    // If not an admin user or not on admin route, redirect
    if ((!isAdmin || currentUser?.role !== 'admin') && location.pathname.startsWith('/admin')) {
      console.log('Non-admin user detected on admin route, redirecting...');
      navigate('/');
    }
  }, [isAdmin, currentUser, location, navigate]);

  // If not admin or not on admin route, don't render this header
  if (!isAdmin || currentUser?.role !== 'admin' || !location.pathname.startsWith('/admin')) {
    return null;
  }

  const handleLogout = () => {
    logout();
    navigate('/');
  };

  const closeNavbar = () => setExpanded(false);

  return (
    <Navbar 
      bg="dark" 
      variant="dark"
      expand="lg" 
      className="shadow-sm py-3"
      fixed="top"
      expanded={expanded}
    >
      <Container>
        <Navbar.Brand as={Link} to="/admin" onClick={closeNavbar}>
          <div className="logo">
            <span style={{ 
              color: '#ffffff', 
              fontWeight: 'bold', 
              fontSize: '1.8rem',
              fontFamily: 'cursive',
              textTransform: 'uppercase',
              letterSpacing: '1px'
            }}>
              Art Heaven <span className="text-danger">Admin</span>
            </span>
          </div>
        </Navbar.Brand>
        <Navbar.Toggle 
          aria-controls="admin-navbar" 
          onClick={() => setExpanded(!expanded)}
        />
        <Navbar.Collapse id="admin-navbar">
          <Nav className="me-auto">
            <Nav.Link 
              as={NavLink} 
              to="/admin" 
              onClick={closeNavbar}
              className={({ isActive }) => isActive ? 'active' : ''}
            >
              Dashboard
            </Nav.Link>
            <Nav.Link 
              as={NavLink} 
              to="/admin/products" 
              onClick={closeNavbar}
              className={({ isActive }) => isActive ? 'active' : ''}
            >
              Products
            </Nav.Link>
            <Nav.Link 
              as={NavLink} 
              to="/admin/orders" 
              onClick={closeNavbar}
              className={({ isActive }) => isActive ? 'active' : ''}
            >
              Orders
            </Nav.Link>
            <Nav.Link 
              as={NavLink} 
              to="/admin/users" 
              onClick={closeNavbar}
              className={({ isActive }) => isActive ? 'active' : ''}
            >
              Users
            </Nav.Link>
            <Nav.Link 
              as={NavLink} 
              to="/admin/contacts" 
              onClick={closeNavbar}
              className={({ isActive }) => isActive ? 'active' : ''}
            >
              Messages
            </Nav.Link>
          </Nav>
          
          <Nav>
            <Button 
              variant="outline-light" 
              onClick={() => {
                closeNavbar();
                handleLogout();
              }}
            >
              Logout
            </Button>
          </Nav>
        </Navbar.Collapse>
      </Container>
    </Navbar>
  );
};

export default AdminHeader; 