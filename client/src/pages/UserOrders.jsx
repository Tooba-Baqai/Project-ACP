import { useState, useEffect } from 'react';
import { Container, Row, Col, Card, Table, Badge, Button, Spinner, Alert } from 'react-bootstrap';
import { Link } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';

const UserOrders = () => {
  const { api, currentUser } = useAuth();
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    const fetchUserOrders = async () => {
      if (!currentUser || !currentUser.id) {
        setError('User information is missing. Please try logging in again.');
        setLoading(false);
        return;
      }

      try {
        console.log('Fetching orders for current user:', currentUser.name);
        const res = await api.get('/orders');
        console.log('User orders received:', res.data);
        setOrders(res.data.data || []);
      } catch (error) {
        console.error('Error fetching user orders:', error);
        setError('Failed to fetch your orders. Please try again later.');
      } finally {
        setLoading(false);
      }
    };

    fetchUserOrders();
  }, [api, currentUser]);

  const getStatusBadge = (status) => {
    switch (status) {
      case 'pending':
        return <Badge bg="warning">Pending</Badge>;
      case 'processing':
        return <Badge bg="info">Processing</Badge>;
      case 'shipped':
        return <Badge bg="primary">Shipped</Badge>;
      case 'delivered':
        return <Badge bg="success">Delivered</Badge>;
      case 'cancelled':
        return <Badge bg="danger">Cancelled</Badge>;
      default:
        return <Badge bg="secondary">{status}</Badge>;
    }
  };

  const formatDate = (dateString) => {
    const options = { year: 'numeric', month: 'long', day: 'numeric' };
    return new Date(dateString).toLocaleDateString(undefined, options);
  };

  const handleCancelOrder = async (orderId) => {
    if (!window.confirm('Are you sure you want to cancel this order?')) {
      return;
    }

    try {
      await api.put(`/orders/${orderId}`, { status: 'cancelled' });
      
      setOrders(orders.map(order => 
        order._id === orderId ? { ...order, status: 'cancelled' } : order
      ));
    } catch (error) {
      alert('Failed to cancel the order. Please try again later.');
      console.error('Error cancelling order:', error);
    }
  };

  if (loading) {
    return (
      <Container className="py-5 mt-5 text-center">
        <Spinner animation="border" role="status" variant="primary">
          <span className="visually-hidden">Loading...</span>
        </Spinner>
        <p className="mt-3">Loading your orders...</p>
      </Container>
    );
  }

  return (
    <Container className="py-5 mt-5">
      <h2 className="mb-4">My Orders</h2>
      
      {error ? (
        <Alert variant="danger">{error}</Alert>
      ) : orders.length === 0 ? (
        <Card className="border-0 shadow-sm">
          <Card.Body className="text-center py-5">
            <h4 className="mb-3">You don't have any orders yet</h4>
            <p className="mb-4">Browse our products and place your first order!</p>
            <Button as={Link} to="/products" variant="primary">
              Shop Now
            </Button>
          </Card.Body>
        </Card>
      ) : (
        <Card className="border-0 shadow-sm">
          <Card.Body>
            <div className="table-responsive">
              <Table hover className="align-middle mb-0">
                <thead>
                  <tr>
                    <th>Order ID</th>
                    <th>Product</th>
                    <th>Date</th>
                    <th>Total</th>
                    <th>Status</th>
                    <th>Actions</th>
                  </tr>
                </thead>
                <tbody>
                  {orders.map((order) => (
                    <tr key={order._id}>
                      <td>
                        <small className="text-muted">
                          {order._id.substring(order._id.length - 8)}
                        </small>
                      </td>
                      <td>
                        {order.items && order.items.length > 0 ? (
                          <div className="d-flex align-items-center">
                            {order.items[0].image ? (
                              <img
                                src={order.items[0].image}
                                alt={order.items[0].name}
                                className="me-3"
                                style={{
                                  width: '50px',
                                  height: '50px',
                                  objectFit: 'cover',
                                  borderRadius: '4px'
                                }}
                              />
                            ) : order.items[0].product && order.items[0].product.image ? (
                              <img
                                src={order.items[0].product.image}
                                alt={order.items[0].product.name}
                                className="me-3"
                                style={{
                                  width: '50px',
                                  height: '50px',
                                  objectFit: 'cover',
                                  borderRadius: '4px'
                                }}
                              />
                            ) : (
                              <div 
                                className="me-3 bg-light d-flex align-items-center justify-content-center"
                                style={{
                                  width: '50px',
                                  height: '50px',
                                  borderRadius: '4px'
                                }}
                              >
                                <span className="text-muted">No image</span>
                              </div>
                            )}
                            <div>
                              <p className="fw-bold mb-0">
                                {order.items[0].name || 
                                 (order.items[0].product && order.items[0].product.name) || 
                                 'Product Unavailable'}
                              </p>
                              <small className="text-muted">
                                Qty: {order.items[0].quantity || 1}
                                {order.items.length > 1 && ` + ${order.items.length - 1} more items`}
                              </small>
                            </div>
                          </div>
                        ) : (
                          <div>No items in this order</div>
                        )}
                      </td>
                      <td>{formatDate(order.orderDate || order.createdAt)}</td>
                      <td>
                        ${order.totalAmount ? order.totalAmount.toFixed(2) : '0.00'}
                      </td>
                      <td>{getStatusBadge(order.status)}</td>
                      <td>
                        {order.items && order.items.length > 0 && order.items[0].product && (
                          <Link
                            to={`/products/${order.items[0].product._id || order.items[0].product}`}
                            className="btn btn-sm btn-outline-primary me-2"
                          >
                            View Product
                          </Link>
                        )}
                        {order.status === 'pending' && (
                          <Button
                            variant="outline-danger"
                            size="sm"
                            onClick={() => handleCancelOrder(order._id)}
                          >
                            Cancel
                          </Button>
                        )}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </Table>
            </div>
          </Card.Body>
        </Card>
      )}
    </Container>
  );
};

export default UserOrders; 