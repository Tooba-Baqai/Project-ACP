import { useState, useEffect } from 'react';
import { Container, Row, Col, Card, Table, Button, Form, Modal, Alert, Badge } from 'react-bootstrap';
import { useAuth } from '../context/AuthContext';

const AdminContacts = () => {
  const { api } = useAuth();
  const [contacts, setContacts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showDetailsModal, setShowDetailsModal] = useState(false);
  const [currentContact, setCurrentContact] = useState(null);
  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState('all');
  const [message, setMessage] = useState({ text: '', type: '' });

  // Fetch contacts
  useEffect(() => {
    fetchContacts();
  }, []);

  const fetchContacts = async () => {
    setLoading(true);
    try {
      const res = await api.get('/contacts');
      setContacts(res.data.data);
    } catch (error) {
      console.error('Error fetching contacts:', error);
      setMessage({ 
        text: error.response?.data?.message || 'Failed to fetch contacts', 
        type: 'danger' 
      });
    } finally {
      setLoading(false);
    }
  };

  // Handle status update
  const updateContactStatus = async (contactId, status) => {
    try {
      const res = await api.put(`/contacts/${contactId}`, { status });
      if (res.status === 200) {
        setContacts(
          contacts.map((contact) =>
            contact._id === contactId ? { ...contact, status } : contact
          )
        );
        
        if (currentContact && currentContact._id === contactId) {
          setCurrentContact({ ...currentContact, status });
        }
        
        setMessage({ text: 'Contact status updated successfully!', type: 'success' });
      }
    } catch (error) {
      console.error('Error updating contact status:', error);
      setMessage({ 
        text: error.response?.data?.message || 'Failed to update contact status', 
        type: 'danger' 
      });
    }
  };

  // View contact details
  const viewContactDetails = (contact) => {
    setCurrentContact(contact);
    setShowDetailsModal(true);
  };

  // Filter contacts based on search term and status
  const filteredContacts = contacts.filter(
    (contact) => {
      // Status filter
      if (statusFilter !== 'all' && contact.status !== statusFilter) {
        return false;
      }
      
      // Search term filter (name, email, or subject)
      if (searchTerm) {
        const searchTermLower = searchTerm.toLowerCase();
        return (
          contact.name.toLowerCase().includes(searchTermLower) ||
          contact.email.toLowerCase().includes(searchTermLower) ||
          contact.subject.toLowerCase().includes(searchTermLower)
        );
      }
      
      return true;
    }
  );

  // Get badge color based on status
  const getStatusBadgeVariant = (status) => {
    switch (status) {
      case 'New':
        return 'primary';
      case 'In Progress':
        return 'warning';
      case 'Resolved':
        return 'success';
      case 'Closed':
        return 'secondary';
      default:
        return 'info';
    }
  };

  return (
    <div className="admin-contacts-page">
      <Container className="py-5 mt-5">
        <Card className="border-0 shadow-sm">
          <Card.Header className="bg-white py-3">
            <div className="d-flex justify-content-between align-items-center">
              <h1 className="h3 mb-0">Contact Management</h1>
            </div>
          </Card.Header>
          <Card.Body>
            {message.text && (
              <Alert variant={message.type} dismissible onClose={() => setMessage({ text: '', type: '' })}>
                {message.text}
              </Alert>
            )}

            {/* Filters */}
            <Row className="mb-3">
              <Col md={4} className="mb-3 mb-md-0">
                <Form.Group>
                  <Form.Control 
                    type="text" 
                    placeholder="Search by name, email or subject..." 
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                  />
                </Form.Group>
              </Col>
              <Col md={3}>
                <Form.Select 
                  value={statusFilter}
                  onChange={(e) => setStatusFilter(e.target.value)}
                >
                  <option value="all">All Status</option>
                  <option value="New">New</option>
                  <option value="In Progress">In Progress</option>
                  <option value="Resolved">Resolved</option>
                  <option value="Closed">Closed</option>
                </Form.Select>
              </Col>
            </Row>

            {/* Contacts Table */}
            {loading ? (
              <div className="text-center py-5">
                <div className="spinner-border text-primary" role="status">
                  <span className="visually-hidden">Loading...</span>
                </div>
                <p className="mt-3">Loading contacts...</p>
              </div>
            ) : (
              <>
                {filteredContacts.length > 0 ? (
                  <div className="table-responsive">
                    <Table hover className="align-middle">
                      <thead>
                        <tr>
                          <th>Name</th>
                          <th>Email</th>
                          <th>Subject</th>
                          <th>Date</th>
                          <th>Status</th>
                          <th>Actions</th>
                        </tr>
                      </thead>
                      <tbody>
                        {filteredContacts.map((contact) => (
                          <tr key={contact._id}>
                            <td>{contact.name}</td>
                            <td>{contact.email}</td>
                            <td>{contact.subject}</td>
                            <td>{new Date(contact.createdAt).toLocaleDateString()}</td>
                            <td>
                              <Badge bg={getStatusBadgeVariant(contact.status)}>
                                {contact.status}
                              </Badge>
                            </td>
                            <td>
                              <Button 
                                variant="outline-primary" 
                                size="sm" 
                                onClick={() => viewContactDetails(contact)}
                              >
                                <i className="fas fa-eye me-1"></i> View
                              </Button>
                            </td>
                          </tr>
                        ))}
                      </tbody>
                    </Table>
                  </div>
                ) : (
                  <div className="text-center py-5">
                    <i className="fas fa-envelope-open-text text-muted fa-3x mb-3"></i>
                    <h5>No contacts found</h5>
                    <p className="text-muted">
                      {searchTerm || statusFilter !== 'all'
                        ? 'No contacts match your search criteria. Try different filters.'
                        : 'There are no customer inquiries in the system yet.'}
                    </p>
                  </div>
                )}
              </>
            )}
          </Card.Body>
        </Card>
      </Container>

      {/* Contact Details Modal */}
      <Modal show={showDetailsModal} onHide={() => setShowDetailsModal(false)}>
        <Modal.Header closeButton>
          <Modal.Title>Contact Details</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          {currentContact && (
            <>
              <div className="mb-4">
                <h5 className="fw-bold">Contact Information</h5>
                <p className="mb-1">
                  <strong>Name:</strong> {currentContact.name}
                </p>
                <p className="mb-1">
                  <strong>Email:</strong> {currentContact.email}
                </p>
                <p className="mb-1">
                  <strong>Phone:</strong> {currentContact.phone || 'N/A'}
                </p>
                <p className="mb-1">
                  <strong>Date:</strong> {new Date(currentContact.createdAt).toLocaleString()}
                </p>
                <p className="mb-1">
                  <strong>Status:</strong>{' '}
                  <Badge bg={getStatusBadgeVariant(currentContact.status)}>
                    {currentContact.status}
                  </Badge>
                </p>
              </div>

              <div className="mb-4">
                <h5 className="fw-bold">Subject</h5>
                <p>{currentContact.subject}</p>
              </div>

              <div className="mb-4">
                <h5 className="fw-bold">Message</h5>
                <p style={{ whiteSpace: 'pre-line' }}>{currentContact.message}</p>
              </div>

              <div className="mt-4">
                <h5 className="fw-bold mb-3">Update Status</h5>
                <div className="d-flex gap-2">
                  <Button 
                    variant={currentContact.status === 'New' ? 'primary' : 'outline-primary'}
                    size="sm"
                    onClick={() => updateContactStatus(currentContact._id, 'New')}
                    className="flex-grow-1"
                  >
                    New
                  </Button>
                  <Button 
                    variant={currentContact.status === 'In Progress' ? 'warning' : 'outline-warning'}
                    size="sm"
                    onClick={() => updateContactStatus(currentContact._id, 'In Progress')}
                    className="flex-grow-1"
                  >
                    In Progress
                  </Button>
                  <Button 
                    variant={currentContact.status === 'Resolved' ? 'success' : 'outline-success'}
                    size="sm"
                    onClick={() => updateContactStatus(currentContact._id, 'Resolved')}
                    className="flex-grow-1"
                  >
                    Resolved
                  </Button>
                  <Button 
                    variant={currentContact.status === 'Closed' ? 'secondary' : 'outline-secondary'}
                    size="sm"
                    onClick={() => updateContactStatus(currentContact._id, 'Closed')}
                    className="flex-grow-1"
                  >
                    Closed
                  </Button>
                </div>
              </div>
            </>
          )}
        </Modal.Body>
        <Modal.Footer>
          <Button variant="secondary" onClick={() => setShowDetailsModal(false)}>
            Close
          </Button>
          {currentContact && (
            <Button 
              variant="primary" 
              href={`mailto:${currentContact.email}?subject=Re: ${currentContact.subject}`}
              target="_blank"
            >
              <i className="fas fa-reply me-2"></i>
              Reply via Email
            </Button>
          )}
        </Modal.Footer>
      </Modal>
    </div>
  );
};

export default AdminContacts; 