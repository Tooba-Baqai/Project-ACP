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
            <h3>No cart functionality available</h3>
            <p className="text-muted">Please use the Order button on product pages to place orders directly.</p>
          </Card.Body>
        </Card>
      </Container>
    );
  }

  // Remove cart table and summary UI
  return (
    <Container className="py-5">
      <h2 className="mb-4">Cart Disabled</h2>
      <Card className="shadow-sm">
        <Card.Body className="text-center py-5">
          <h3>Cart functionality has been removed.</h3>
          <p className="text-muted">Please use the Order button on product pages to place orders directly.</p>
        </Card.Body>
      </Card>
    </Container>
  );
};

export default Cart;