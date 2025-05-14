import { useEffect } from 'react';
import { Container, Card, Button, Row, Col, Alert } from 'react-bootstrap';
import { Link, useLocation, useNavigate } from 'react-router-dom';

const OrderConfirmation = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const { order } = location.state || {};

  useEffect(() => {
    if (!order) {
      navigate('/');
    }
  }, [order, navigate]);

  if (!order) {
    return (
      <Container className="py-5">
        <Alert variant="warning">
          <h4>No order information available</h4>
          <p>Please place an order to view confirmation details.</p>
          <Button 
            as={Link} 
            to="/products" 
            variant="primary"
            className="mt-2"
          >
            Browse Products
          </Button>
        </Alert>
      </Container>
    );
  }

  return (
    <Container className="py-5">
      <Card className="shadow-sm mb-4">
        <Card.Body className="text-center py-5">
          <div className="mb-4">
            <i className="fas fa-check-circle fa-5x text-success"></i>
          </div>
          <h2 className="mb-3">Thank You for Your Order!</h2>
          <p className="text-muted mb-4">
            Your order has been placed successfully. We'll process it right away!
          </p>
          <h5 className="mb-3">Order Number: {order._id}</h5>
        </Card.Body>
      </Card>

      <Card className="shadow-sm mb-4">
        <Card.Header className="bg-white">
          <h5 className="mb-0">Order Details</h5>
        </Card.Header>
        <Card.Body>
          <Row className="mb-3">
            <Col md={6}>
              <h6>Shipping Information</h6>
              <p className="mb-1">{order.shippingAddress}</p>
              <p className="mb-0">Contact: {order.contactNumber}</p>
            </Col>
            <Col md={6}>
              <h6>Order Information</h6>
              <p className="mb-1">Date: {new Date(order.orderDate).toLocaleDateString()}</p>
              <p className="mb-1">Payment Method: {order.paymentMethod}</p>
              <p className="mb-0">Status: {order.status}</p>
            </Col>
          </Row>

          <h6 className="mt-4 mb-3">Items</h6>
          {order.items.map((item) => (
            <div key={item._id} className="d-flex justify-content-between mb-2 border-bottom pb-2">
              <div>
                <span className="fw-bold">{item.name}</span>
                <span className="text-muted ms-2">x{item.quantity}</span>
              </div>
              <span>${(item.price * item.quantity).toFixed(2)}</span>
            </div>
          ))}

          <div className="d-flex justify-content-between mt-4">
            <h6>Total Amount:</h6>
            <h6>${order.totalAmount.toFixed(2)}</h6>
          </div>

          {order.notes && (
            <div className="mt-4">
              <h6>Notes</h6>
              <p className="mb-0">{order.notes}</p>
            </div>
          )}
        </Card.Body>
      </Card>

      <div className="d-flex justify-content-center mt-4">
        <Button 
          as={Link} 
          to="/orders" 
          variant="primary"
          className="me-3"
        >
          View All Orders
        </Button>
        <Button 
          as={Link} 
          to="/products" 
          variant="outline-primary"
        >
          Continue Shopping
        </Button>
      </div>
    </Container>
  );
};

export default OrderConfirmation; 