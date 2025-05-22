import { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { Container, Row, Col, Card, Form, Button, Alert, Spinner } from 'react-bootstrap';
import { useAuth } from '../context/AuthContext';

const UserProfile = () => {
  const { currentUser, api, updateUserInfo } = useAuth();
  const navigate = useNavigate();
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    phone: '',
    address: ''
  });
  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState('');
  const [error, setError] = useState('');
  
  const isAdmin = currentUser?.role === 'admin';

  useEffect(() => {
    if (currentUser) {
      setFormData({
        name: currentUser.name || '',
        email: currentUser.email || '',
        phone: currentUser.phone || '',
        address: currentUser.address || ''
      });
    }
    
    if (isAdmin) {
      const handleKeyDown = (e) => {
        if (e.altKey && e.key === 'a') {
          navigate('/admin');
        }
      };
      
      window.addEventListener('keydown', handleKeyDown);
      return () => {
        window.removeEventListener('keydown', handleKeyDown);
      };
    }
  }, [currentUser, isAdmin, navigate]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError('');
    setSuccess('');

    try {
      const res = await api.put(`/auth/users/${currentUser.id}`, formData);
      console.log('Profile updated:', res.data);
      
      updateUserInfo(res.data.data);
      setSuccess('Profile updated successfully!');
    } catch (error) {
      console.error('Error updating profile:', error);
      setError(error.response?.data?.message || 'Failed to update profile');
    } finally {
      setLoading(false);
    }
  };

  if (!currentUser) {
    return (
      <Container className="py-5 mt-5 text-center">
        <Spinner animation="border" role="status">
          <span className="visually-hidden">Loading...</span>
        </Spinner>
      </Container>
    );
  }

  return (
    <Container className="py-5 mt-5">
      <h2 className="mb-4">My Profile</h2>
      
      <Row>
        <Col md={4} className="mb-4">
          <Card className="border-0 shadow-sm">
            <Card.Body className="text-center py-5">
              <div className="avatar-circle mb-4 mx-auto">
                <span className="avatar-initials">
                  {currentUser.name?.charAt(0).toUpperCase() || 'U'}
                </span>
              </div>
              
              <Button 
                as={Link} 
                to="/orders" 
                variant="outline-primary" 
                className="d-block w-100"
                size="lg"
              >
                My Orders
              </Button>

              {}
              {isAdmin && (
                <div className="mt-4 pt-3 border-top">
                  <h6 className="text-muted mb-3">Admin Access</h6>
                  <Button
                    as={Link}
                    to="/admin"
                    variant="outline-secondary"
                    size="sm"
                    className="w-100"
                  >
                    <i className="fas fa-lock me-2"></i> Admin Dashboard
                  </Button>
                  <small className="d-block text-muted mt-2">
                    Or press <kbd>Alt</kbd>+<kbd>A</kbd> to access
                  </small>
                </div>
              )}
            </Card.Body>
          </Card>
        </Col>
        
        <Col md={8}>
          <Card className="border-0 shadow-sm">
            <Card.Body className="p-4">
              <h4 className="mb-4">Profile Information</h4>
              
              {success && <Alert variant="success">{success}</Alert>}
              {error && <Alert variant="danger">{error}</Alert>}
              
              <Form onSubmit={handleSubmit}>
                <Form.Group className="mb-3">
                  <Form.Label>Full Name</Form.Label>
                  <Form.Control
                    type="text"
                    name="name"
                    value={formData.name}
                    onChange={handleChange}
                    required
                  />
                </Form.Group>
                
                <Form.Group className="mb-3">
                  <Form.Label>Email Address</Form.Label>
                  <Form.Control
                    type="email"
                    name="email"
                    value={formData.email}
                    disabled
                    readOnly
                  />
                  <Form.Text className="text-muted">
                    Email cannot be changed
                  </Form.Text>
                </Form.Group>
                
                <Form.Group className="mb-3">
                  <Form.Label>Phone Number</Form.Label>
                  <Form.Control
                    type="tel"
                    name="phone"
                    value={formData.phone}
                    onChange={handleChange}
                  />
                </Form.Group>
                
                <Form.Group className="mb-4">
                  <Form.Label>Shipping Address</Form.Label>
                  <Form.Control
                    as="textarea"
                    name="address"
                    value={formData.address}
                    onChange={handleChange}
                    rows={3}
                  />
                </Form.Group>
                
                <Button
                  type="submit"
                  variant="primary"
                  className="px-4"
                  disabled={loading}
                >
                  {loading ? 'Saving...' : 'Save Changes'}
                </Button>
              </Form>
            </Card.Body>
          </Card>
        </Col>
      </Row>
    </Container>
  );
};

export default UserProfile;