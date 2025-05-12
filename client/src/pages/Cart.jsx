import { useState } from 'react';
import { Container, Row, Col, Card, Button, Table, Form, Spinner, Alert } from 'react-bootstrap';
import { Link, useNavigate } from 'react-router-dom';
import { useCart } from '../context/CartContext';
import { useAuth } from '../context/AuthContext';

const Cart = () => {
  const { cart, loading, updateCartItem, removeCartItem, clearCart } = useCart();
  const { isAuthenticated } = useAuth();
  const navigate = useNavigate();
  const [checkoutLoading, setCheckoutLoading] = useState(false);

  // Handle quantity change
  const handleQuantityChange = async (itemId, newQuantity) => {
    if (newQuantity < 1) newQuantity = 1;
    await updateCartItem(itemId, newQuantity);
  };

  // Handle remove item
  const handleRemoveItem = async (itemId) => {
    await removeCartItem(itemId);
  };

  // Handle clear cart
  const handleClearCart = async () => {
    await clearCart();
  };

  // Handle checkout
  const handleCheckout = () => {
    navigate('/checkout');
  };

  if (!isAuthenticated) {
    return (
      <Container className="py-5">
        <Alert variant="warning">
          <h4>Please log in to view your cart</h4>
          <p>You need to be logged in to view and manage your shopping cart.</p>
          <Button 
            as={Link} 
            to="/login" 
            variant="primary"
            className="mt-2"
          >
            Login
          </Button>
        </Alert>
      </Container>
    );
  }

  if (loading) {
    return (
      <Container className="py-5 text-center">
        <Spinner animation="border" role="status" variant="primary">
          <span className="visually-hidden">Loading...</span>
        </Spinner>
        <p className="mt-3">Loading your cart...</p>
      </Container>
    );
  }

  if (!cart || !cart.items || cart.items.length === 0) {
    return (
      <Container className="py-5">
        <Card className="shadow-sm">
          <Card.Body className="text-center py-5">
            <i className="fas fa-shopping-cart fa-4x text-muted mb-4"></i>
            <h3>Your cart is empty</h3>
            <p className="text-muted">Start shopping to add items to your cart.</p>
            <Button 
              as={Link} 
              to="/products" 
              variant="primary"
              className="mt-3"
            >
              Browse Products
            </Button>
          </Card.Body>
        </Card>
      </Container>
    );
  }

  return (
    <Container className="py-5">
      <h2 className="mb-4">Your Shopping Cart</h2>
      
      <Row>
        <Col lg={8}>
          <Card className="shadow-sm mb-4">
            <Card.Body>
              <Table responsive className="align-middle">
                <thead>
                  <tr>
                    <th>Product</th>
                    <th>Price</th>
                    <th>Quantity</th>
                    <th>Total</th>
                    <th>Actions</th>
                  </tr>
                </thead>
                <tbody>
                  {cart.items.map((item) => (
                    <tr key={item._id}>
                      <td>
                        <div className="d-flex align-items-center">
                          {item.image && (
                            <img 
                              src={item.image} 
                              alt={item.name} 
                              style={{ width: '50px', height: '50px', objectFit: 'cover', marginRight: '10px' }}
                            />
                          )}
                          <div>
                            <h6 className="mb-0">{item.name}</h6>
                          </div>
                        </div>
                      </td>
                      <td>${item.price.toFixed(2)}</td>
                      <td style={{ width: '120px' }}>
                        <Form.Control
                          type="number"
                          min="1"
                          value={item.quantity}
                          onChange={(e) => handleQuantityChange(item._id, parseInt(e.target.value))}
                          style={{ width: '80px' }}
                        />
                      </td>
                      <td>${(item.price * item.quantity).toFixed(2)}</td>
                      <td>
                        <Button 
                          variant="outline-danger" 
                          size="sm"
                          onClick={() => handleRemoveItem(item._id)}
                        >
                          <i className="fas fa-trash"></i>
                        </Button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </Table>
            </Card.Body>
            <Card.Footer className="bg-white">
              <div className="d-flex justify-content-between">
                <Button 
                  variant="outline-secondary"
                  onClick={handleClearCart}
                >
                  Clear Cart
                </Button>
                <Button 
                  as={Link}
                  to="/products"
                  variant="outline-primary"
                >
                  Continue Shopping
                </Button>
              </div>
            </Card.Footer>
          </Card>
        </Col>
        
        <Col lg={4}>
          <Card className="shadow-sm">
            <Card.Header className="bg-white">
              <h5 className="mb-0">Order Summary</h5>
            </Card.Header>
            <Card.Body>
              <div className="d-flex justify-content-between mb-2">
                <span>Subtotal:</span>
                <span>${cart.totalAmount.toFixed(2)}</span>
              </div>
              <div className="d-flex justify-content-between mb-2">
                <span>Shipping:</span>
                <span>Free</span>
              </div>
              <hr />
              <div className="d-flex justify-content-between mb-3">
                <strong>Total:</strong>
                <strong>${cart.totalAmount.toFixed(2)}</strong>
              </div>
              <div className="d-grid">
                <Button 
                  variant="primary" 
                  size="lg"
                  onClick={handleCheckout}
                  disabled={checkoutLoading}
                >
                  {checkoutLoading ? (
                    <>
                      <Spinner
                        as="span"
                        animation="border"
                        size="sm"
                        role="status"
                        aria-hidden="true"
                        className="me-2"
                      />
                      Processing...
                    </>
                  ) : (
                    'Proceed to Checkout'
                  )}
                </Button>
              </div>
            </Card.Body>
          </Card>
        </Col>
      </Row>
    </Container>
  );
};

export default Cart; 