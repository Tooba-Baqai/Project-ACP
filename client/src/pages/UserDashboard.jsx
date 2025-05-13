import { useEffect } from 'react';
import { useNavigate, Link, useLocation } from 'react-router-dom';
import { Container, Row, Col, Card, Button, ListGroup } from 'react-bootstrap';
import { useAuth } from '../context/AuthContext';

const UserDashboard = () => {
  const { currentUser, isAdmin, logout } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();

  useEffect(() => {
    if (!currentUser) {
      navigate('/login');
    } else if (isAdmin) {
      navigate('/admin'); 
    }
  }, [currentUser, isAdmin, navigate]);

  const handleLogout = () => {
    logout();
    navigate('/');
  };

  if (!currentUser || isAdmin) {
    return null; 
  }

  return (
    <Container className="py-5 mt-5">
      <h2 className="mb-4">User Dashboard</h2>
      <Row>
        <Col md={4}>
          {}
          <Card className="mb-4">
            <Card.Header as="h5">
              Welcome, {currentUser.name}
            </Card.Header>
            <ListGroup variant="flush">
              <ListGroup.Item action as={Link} to="/profile" active={location.pathname === '/profile'}>
                My Profile
              </ListGroup.Item>
              <ListGroup.Item action as={Link} to="/orders" active={location.pathname === '/orders'}>
                My Orders
              </ListGroup.Item>
              <ListGroup.Item action onClick={handleLogout}>
                Logout
              </ListGroup.Item>
            </ListGroup>
          </Card>
        </Col>
        <Col md={8}>
          {}
          <Card>
            <Card.Body>
              <h3>Account Summary</h3>
              <hr />
              <Row>
                <Col md={6}>
                  <p><strong>Name:</strong> {currentUser.name}</p>
                  <p><strong>Email:</strong> {currentUser.email}</p>
                </Col>
                <Col md={6}>
                  <p><strong>Account Type:</strong> Regular User</p>
                  <p><strong>Member Since:</strong> {new Date(currentUser.createdAt).toLocaleDateString()}</p>
                </Col>
              </Row>
              <hr />
              <h5>Recent Activity</h5>
              <p>View your recent orders and activity below.</p>
              <Button as={Link} to="/orders" variant="primary">
                View Order History
              </Button>
            </Card.Body>
          </Card>
        </Col>
      </Row>
    </Container>
  );
};

export default UserDashboard; 