import { useState, useEffect } from 'react';
import { Container, Row, Col, Card, Table, Button, Form, Modal, Alert, Badge } from 'react-bootstrap';
import { useAuth } from '../context/AuthContext';

const AdminOrders = () => {
  const { api } = useAuth();
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showDetailsModal, setShowDetailsModal] = useState(false);
  const [currentOrder, setCurrentOrder] = useState(null);
  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState('all');
  const [message, setMessage] = useState({ text: '', type: '' });

  // Fetch orders
  useEffect(() => {
    fetchOrders();
  }, []);

  const fetchOrders = async () => {
    setLoading(true);
    try {
      const res = await api.get('/orders');
      setOrders(res.data.data);
    } catch (error) {
      console.error('Error fetching orders:', error);
      setMessage({ 
        text: error.response?.data?.message || 'Failed to fetch orders', 
        type: 'danger' 
      });
    } finally {
      setLoading(false);
    }
  };

  // Handle status update
  const updateOrderStatus = async (orderId, status) => {
    try {
      const res = await api.put(`/orders/${orderId}`, { status });
      if (res.status === 200) {
        setOrders(
          orders.map((order) =>
            order._id === orderId ? { ...order, status } : order
          )
        );
        
        if (currentOrder && currentOrder._id === orderId) {
          setCurrentOrder({ ...currentOrder, status });
        }
        
        // Special message for delivered orders
        if (status === 'delivered') {
          setMessage({ 
            text: 'Order marked as delivered successfully! It will now appear in the Successfully Delivered Orders section.',
            type: 'success' 
          });
          
          // If the modal is open, close it after marking as delivered
          if (showDetailsModal) {
            setTimeout(() => setShowDetailsModal(false), 1500);
          }
        } else {
          setMessage({ text: 'Order status updated successfully!', type: 'success' });
        }
        
        // If filtering by a status and we just changed to a different status, refresh the list
        if (statusFilter !== 'all' && statusFilter !== status) {
          fetchOrders();
        }
      }
    } catch (error) {
      console.error('Error updating order status:', error);
      setMessage({ 
        text: error.response?.data?.message || 'Failed to update order status', 
        type: 'danger' 
      });
    }
  };

  // View order details
  const viewOrderDetails = (order) => {
    setCurrentOrder(order);
    setShowDetailsModal(true);
  };

  // Filter orders based on search term and status
  const filteredOrders = orders.filter(
    (order) => {
      // Status filter
      if (statusFilter !== 'all' && order.status !== statusFilter) {
        return false;
      }
      
      // Search term filter (customer name or order ID)
      if (searchTerm) {
        const searchTermLower = searchTerm.toLowerCase();
        return (
          order.user.name.toLowerCase().includes(searchTermLower) ||
          order._id.toLowerCase().includes(searchTermLower)
        );
      }
      
      return true;
    }
  );

  // Get badge color based on status
  const getStatusBadgeVariant = (status) => {
    const statusLower = status ? status.toLowerCase() : '';
    
    switch (statusLower) {
      case 'pending':
        return 'warning';
      case 'processing':
        return 'primary';
      case 'shipped':
        return 'info';
      case 'delivered':
        return 'success';
      case 'cancelled':
        return 'danger';
      default:
        return 'secondary';
    }
  };

  // Display a formatted status (capitalized)
  const formatStatus = (status) => {
    if (!status) return '';
    return status.charAt(0).toUpperCase() + status.slice(1).toLowerCase();
  };

  // Format date with fallback
  const formatDate = (dateString) => {
    if (!dateString) return 'No date';
    
    try {
      const date = new Date(dateString);
      if (isNaN(date.getTime())) {
        return 'Invalid date';
      }
      return date.toLocaleDateString();
    } catch (error) {
      console.error('Error formatting date:', error);
      return 'Invalid date';
    }
  };

  // Format price with fallback
  const formatPrice = (price) => {
    if (price === undefined || price === null) return '$0.00';
    
    try {
      const numPrice = Number(price);
      if (isNaN(numPrice)) return '$0.00';
      return `$${numPrice.toFixed(2)}`;
    } catch (error) {
      console.error('Error formatting price:', error);
      return '$0.00';
    }
  };

  return (
    <div className="admin-orders-page">
      <Container className="py-5 mt-5">
        <Card className="border-0 shadow-sm">
          <Card.Header className="bg-white py-3">
            <div className="d-flex justify-content-between align-items-center">
              <h1 className="h3 mb-0">Order Management</h1>
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
                    placeholder="Search by customer name or order ID..." 
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
                  <option value="pending">Pending</option>
                  <option value="processing">Processing</option>
                  <option value="shipped">Shipped</option>
                  <option value="delivered">Delivered</option>
                  <option value="cancelled">Cancelled</option>
                </Form.Select>
              </Col>
            </Row>

            {/* Orders Table */}
            {loading ? (
              <div className="text-center py-5">
                <div className="spinner-border text-primary" role="status">
                  <span className="visually-hidden">Loading...</span>
                </div>
                <p className="mt-3">Loading orders...</p>
              </div>
            ) : (
              <>
                {filteredOrders.length > 0 ? (
                  <div className="table-responsive">
                    <Table hover className="align-middle">
                      <thead>
                        <tr>
                          <th>Order ID</th>
                          <th>Customer</th>
                          <th>Date</th>
                          <th>Total</th>
                          <th>Status</th>
                          <th>Actions</th>
                        </tr>
                      </thead>
                      <tbody>
                        {filteredOrders.map((order) => (
                          <tr key={order._id}>
                            <td>#{order._id.substr(-6)}</td>
                            <td>{order.user?.name || 'Unknown user'}</td>
                            <td>{formatDate(order.createdAt || order.orderDate)}</td>
                            <td>{formatPrice(order.totalAmount)}</td>
                            <td>
                              <Badge bg={getStatusBadgeVariant(order.status)}>
                                {formatStatus(order.status)}
                              </Badge>
                            </td>
                            <td>
                              <Button 
                                variant="outline-primary" 
                                size="sm" 
                                className="me-2"
                                onClick={() => viewOrderDetails(order)}
                              >
                                <i className="fas fa-eye me-1"></i> View
                              </Button>
                              {order.status !== 'delivered' && order.status !== 'cancelled' && (
                                <Button 
                                  variant="outline-success" 
                                  size="sm"
                                  onClick={() => {
                                    if (window.confirm('Mark this order as delivered?')) {
                                      updateOrderStatus(order._id, 'delivered');
                                    }
                                  }}
                                >
                                  <i className="fas fa-check me-1"></i> Mark Delivered
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
                    <i className="fas fa-shopping-bag text-muted fa-3x mb-3"></i>
                    <h5>No orders found</h5>
                    <p className="text-muted">
                      {searchTerm || statusFilter !== 'all'
                        ? 'No orders match your search criteria. Try different filters.'
                        : 'There are no orders in the system yet.'}
                    </p>
                  </div>
                )}
              </>
            )}
          </Card.Body>
        </Card>
      </Container>

      {/* Order Details Modal */}
      <Modal show={showDetailsModal} onHide={() => setShowDetailsModal(false)} size="lg">
        <Modal.Header closeButton>
          <Modal.Title>
            Order Details
            {currentOrder?.status === 'delivered' && (
              <Badge bg="success" className="ms-2">Successfully Delivered</Badge>
            )}
          </Modal.Title>
        </Modal.Header>
        <Modal.Body>
          {currentOrder && (
            <>
              <Row className="mb-4">
                <Col md={6}>
                  <h5 className="fw-bold">Order Information</h5>
                  <p className="mb-1">
                    <strong>Order ID:</strong> #{currentOrder._id.substr(-6)}
                  </p>
                  <p className="mb-1">
                    <strong>Date:</strong> {formatDate(currentOrder.createdAt || currentOrder.orderDate)}
                  </p>
                  <p className="mb-1">
                    <strong>Status:</strong>{' '}
                    <Badge bg={getStatusBadgeVariant(currentOrder.status)}>
                      {formatStatus(currentOrder.status)}
                    </Badge>
                  </p>
                  <p className="mb-1">
                    <strong>Total Amount:</strong> {formatPrice(currentOrder.totalAmount)}
                  </p>
                </Col>
                <Col md={6}>
                  <h5 className="fw-bold">Customer Information</h5>
                  <p className="mb-1">
                    <strong>Name:</strong> {currentOrder.user.name}
                  </p>
                  <p className="mb-1">
                    <strong>Email:</strong> {currentOrder.user.email}
                  </p>
                  <p className="mb-1">
                    <strong>Phone:</strong> {currentOrder.phone || 'N/A'}
                  </p>
                  <p className="mb-1">
                    <strong>Shipping Address:</strong> {currentOrder.address || 'N/A'}
                  </p>
                </Col>
              </Row>

              <h5 className="fw-bold mb-3">Order Items</h5>
              <Table responsive className="align-middle">
                <thead>
                  <tr>
                    <th style={{ width: '60px' }}>Image</th>
                    <th>Product</th>
                    <th>Price</th>
                    <th>Quantity</th>
                    <th>Subtotal</th>
                  </tr>
                </thead>
                <tbody>
                  {currentOrder.items && currentOrder.items.length > 0 ? (
                    currentOrder.items.map((item, index) => (
                      <tr key={index}>
                        <td>
                          <img 
                            src={item.product?.image || item.image || '/images/product-placeholder.jpg'} 
                            alt={item.product?.name || item.name || 'Product'} 
                            className="img-thumbnail" 
                            style={{ width: '50px', height: '50px', objectFit: 'cover' }}
                          />
                        </td>
                        <td>{item.product?.name || item.name || 'Unknown Product'}</td>
                        <td>{formatPrice(item.price || 0)}</td>
                        <td>{item.quantity || 1}</td>
                        <td>{formatPrice((item.price || 0) * (item.quantity || 1))}</td>
                      </tr>
                    ))
                  ) : (
                    <tr>
                      <td colSpan="5" className="text-center">
                        <div className="p-3">
                          <p className="mb-0">Single product order</p>
                          {currentOrder.product && (
                            <div className="d-flex align-items-center justify-content-center mt-2">
                              <img
                                src={currentOrder.product.image || '/images/product-placeholder.jpg'}
                                alt={currentOrder.product.name}
                                className="img-thumbnail me-3"
                                style={{ width: '50px', height: '50px', objectFit: 'cover' }}
                              />
                              <div>
                                <p className="mb-0"><strong>{currentOrder.product.name}</strong></p>
                                <p className="mb-0">Quantity: {currentOrder.quantity || 1}</p>
                                <p className="mb-0">Price: {formatPrice(currentOrder.product.price || 0)}</p>
                                <p className="mb-0">Total: {formatPrice((currentOrder.product.price || 0) * (currentOrder.quantity || 1))}</p>
                              </div>
                            </div>
                          )}
                        </div>
                      </td>
                    </tr>
                  )}
                </tbody>
                <tfoot>
                  <tr>
                    <td colSpan="4" className="text-end fw-bold">Total:</td>
                    <td className="fw-bold">{formatPrice(currentOrder.totalAmount)}</td>
                  </tr>
                </tfoot>
              </Table>

              <div className="mt-4">
                <h5 className="fw-bold mb-3">Update Order Status</h5>
                <div className="d-flex gap-2">
                  <Button 
                    variant={currentOrder.status.toLowerCase() === 'pending' ? 'warning' : 'outline-warning'}
                    size="sm"
                    onClick={() => updateOrderStatus(currentOrder._id, 'pending')}
                    className="flex-grow-1"
                  >
                    Pending
                  </Button>
                  <Button 
                    variant={currentOrder.status.toLowerCase() === 'processing' ? 'primary' : 'outline-primary'}
                    size="sm"
                    onClick={() => updateOrderStatus(currentOrder._id, 'processing')}
                    className="flex-grow-1"
                  >
                    Processing
                  </Button>
                  <Button 
                    variant={currentOrder.status.toLowerCase() === 'shipped' ? 'info' : 'outline-info'}
                    size="sm"
                    onClick={() => updateOrderStatus(currentOrder._id, 'shipped')}
                    className="flex-grow-1"
                  >
                    Shipped
                  </Button>
                  <Button 
                    variant={currentOrder.status.toLowerCase() === 'delivered' ? 'success' : 'outline-success'}
                    size="sm"
                    onClick={() => updateOrderStatus(currentOrder._id, 'delivered')}
                    className="flex-grow-1"
                  >
                    Delivered
                  </Button>
                  <Button 
                    variant={currentOrder.status.toLowerCase() === 'cancelled' ? 'danger' : 'outline-danger'}
                    size="sm"
                    onClick={() => updateOrderStatus(currentOrder._id, 'cancelled')}
                    className="flex-grow-1"
                  >
                    Cancelled
                  </Button>
                </div>
              </div>

              {currentOrder.notes && (
                <div className="mt-4">
                  <h5 className="fw-bold mb-2">Order Notes</h5>
                  <p className="mb-0">{currentOrder.notes}</p>
                </div>
              )}
            </>
          )}
        </Modal.Body>
        <Modal.Footer>
          <Button variant="secondary" onClick={() => setShowDetailsModal(false)}>
            Close
          </Button>
        </Modal.Footer>
      </Modal>
    </div>
  );
};

export default AdminOrders; 