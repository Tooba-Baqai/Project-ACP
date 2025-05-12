import { useState, useEffect } from 'react';
import { Container, Row, Col, Card, Table, Button, Form, Modal, Alert, Badge } from 'react-bootstrap';
import { useAuth } from '../context/AuthContext';

const AdminUsers = () => {
  const { api } = useAuth();
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showDetailsModal, setShowDetailsModal] = useState(false);
  const [currentUser, setCurrentUser] = useState(null);
  const [searchTerm, setSearchTerm] = useState('');
  const [message, setMessage] = useState({ text: '', type: '' });

  // Fetch users
  useEffect(() => {
    fetchUsers();
  }, []);

  const fetchUsers = async () => {
    setLoading(true);
    try {
      const res = await api.get('/auth/users');
      setUsers(res.data.data || []);
    } catch (error) {
      console.error('Error fetching users:', error);
      setMessage({ 
        text: error.response?.data?.message || 'Failed to fetch users', 
        type: 'danger' 
      });
    } finally {
      setLoading(false);
    }
  };

  // Delete user
  const handleDeleteUser = async (userId) => {
    if (window.confirm('Are you sure you want to delete this user? This action cannot be undone.')) {
      try {
        const res = await api.delete(`/auth/users/${userId}`);
        if (res.status === 200) {
          setUsers(users.filter(user => user._id !== userId));
          setMessage({ text: 'User deleted successfully!', type: 'success' });
          
          // If the user details modal is open for this user, close it
          if (currentUser && currentUser._id === userId) {
            setShowDetailsModal(false);
          }
        }
      } catch (error) {
        console.error('Error deleting user:', error);
        setMessage({
          text: error.response?.data?.message || 'Failed to delete user',
          type: 'danger'
        });
      }
    }
  };

  // View user details
  const viewUserDetails = (user) => {
    setCurrentUser(user);
    setShowDetailsModal(true);
  };

  // Filter users based on search term
  const filteredUsers = users.filter(
    (user) => {
      if (searchTerm) {
        const searchTermLower = searchTerm.toLowerCase();
        return (
          user.name.toLowerCase().includes(searchTermLower) ||
          user.email.toLowerCase().includes(searchTermLower) ||
          (user.role && user.role.toLowerCase().includes(searchTermLower))
        );
      }
      return true;
    }
  );

  return (
    <div className="admin-users-page">
      <Container className="py-5 mt-5">
        <Card className="border-0 shadow-sm">
          <Card.Header className="bg-white py-3">
            <div className="d-flex justify-content-between align-items-center">
              <h1 className="h3 mb-0">User Management</h1>
            </div>
          </Card.Header>
          <Card.Body>
            {message.text && (
              <Alert variant={message.type} dismissible onClose={() => setMessage({ text: '', type: '' })}>
                {message.text}
              </Alert>
            )}

            {/* Search Bar */}
            <Row className="mb-3">
              <Col md={6} lg={4}>
                <Form.Group>
                  <Form.Control 
                    type="text" 
                    placeholder="Search users..." 
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                  />
                </Form.Group>
              </Col>
            </Row>

            {/* Users Table */}
            {loading ? (
              <div className="text-center py-5">
                <div className="spinner-border text-primary" role="status">
                  <span className="visually-hidden">Loading...</span>
                </div>
                <p className="mt-3">Loading users...</p>
              </div>
            ) : (
              <>
                {filteredUsers.length > 0 ? (
                  <div className="table-responsive">
                    <Table hover className="align-middle">
                      <thead>
                        <tr>
                          <th>Name</th>
                          <th>Email</th>
                          <th>Role</th>
                          <th>Joined Date</th>
                          <th>Actions</th>
                        </tr>
                      </thead>
                      <tbody>
                        {filteredUsers.map((user) => (
                          <tr key={user._id || user.id}>
                            <td>{user.name}</td>
                            <td>{user.email}</td>
                            <td>
                              <Badge bg={user.role === 'admin' ? 'danger' : 'primary'}>
                                {user.role}
                              </Badge>
                            </td>
                            <td>{new Date(user.createdAt).toLocaleDateString()}</td>
                            <td>
                              <Button 
                                variant="outline-primary" 
                                size="sm" 
                                onClick={() => viewUserDetails(user)}
                                className="me-2"
                              >
                                <i className="fas fa-eye me-1"></i> View
                              </Button>
                              {user.role !== 'admin' && (
                                <Button
                                  variant="outline-danger"
                                  size="sm"
                                  onClick={() => handleDeleteUser(user._id)}
                                >
                                  <i className="fas fa-trash me-1"></i> Delete
                                </Button>
                              )}
                            </td>
                          </tr>
                        ))}
                      </tbody>
                    </Table>
                  </div>
                ) : (
                  <div className="text-center py-5">
                    <i className="fas fa-users text-muted fa-3x mb-3"></i>
                    <h5>No users found</h5>
                    <p className="text-muted">
                      {searchTerm ? `No users match "${searchTerm}"` : "There are no users yet."}
                    </p>
                  </div>
                )}
              </>
            )}
          </Card.Body>
        </Card>
      </Container>

      {/* User Details Modal */}
      <Modal show={showDetailsModal} onHide={() => setShowDetailsModal(false)}>
        <Modal.Header closeButton>
          <Modal.Title>User Details</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          {currentUser && (
            <>
              <div className="mb-4">
                <h5 className="fw-bold">User Information</h5>
                <p className="mb-1">
                  <strong>Name:</strong> {currentUser.name}
                </p>
                <p className="mb-1">
                  <strong>Email:</strong> {currentUser.email}
                </p>
                <p className="mb-1">
                  <strong>Role:</strong>{' '}
                  <Badge bg={currentUser.role === 'admin' ? 'danger' : 'primary'}>
                    {currentUser.role}
                  </Badge>
                </p>
                <p className="mb-1">
                  <strong>Phone:</strong> {currentUser.phone || 'N/A'}
                </p>
                <p className="mb-1">
                  <strong>Address:</strong> {currentUser.address || 'N/A'}
                </p>
                <p className="mb-1">
                  <strong>Joined Date:</strong> {new Date(currentUser.createdAt).toLocaleString()}
                </p>
              </div>
            </>
          )}
        </Modal.Body>
        <Modal.Footer>
          <Button variant="secondary" onClick={() => setShowDetailsModal(false)}>
            Close
          </Button>
          {currentUser && currentUser.role !== 'admin' && (
            <Button 
              variant="danger" 
              onClick={() => {
                setShowDetailsModal(false);
                handleDeleteUser(currentUser._id);
              }}
            >
              Delete User
            </Button>
          )}
        </Modal.Footer>
      </Modal>
    </div>
  );
};

export default AdminUsers; 