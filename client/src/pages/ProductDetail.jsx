import { useState, useEffect } from 'react';
import { useParams, Link, useNavigate } from 'react-router-dom';
import { Container, Row, Col, Card, Button, Spinner, Alert, Form } from 'react-bootstrap';
import { useAuth } from '../context/AuthContext';
import { useCart } from '../context/CartContext';
import { toast } from 'react-toastify';

const ProductDetail = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const { api, isAuthenticated } = useAuth();
  const { addToCart, cart } = useCart();
  const [product, setProduct] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [quantity, setQuantity] = useState(1);
  const [addingToCart, setAddingToCart] = useState(false);

  useEffect(() => {
    const fetchProduct = async () => {
      try {
        const res = await api.get(`/products/${id}`);
        setProduct(res.data.data);
      } catch (error) {
        setError('Failed to fetch product details. Please try again later.');
        console.error('Error fetching product:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchProduct();
  }, [api, id]);

  // Option B: Add to cart, then go to order page
  const handleOrderClick = async () => {
    if (!isAuthenticated) {
      navigate('/login', { state: { from: `/products/${id}` } });
      return;
    }
    if (!product || !product.inStock) {
      toast.error('Product is not available');
      return;
    }
    setAddingToCart(true);
    try {
      
      const productId = typeof id === 'string' ? id : String(id);
      const qty = parseInt(quantity) > 0 ? parseInt(quantity) : 1;
      const success = await addToCart(productId, qty);
      if (success) {
        toast.success(`${product.name} added to cart! Redirecting to order page...`);
        navigate(`/place-order/${id}`);
      }
    } catch (error) {
      toast.error('Failed to add item to cart. Please try again.');
    } finally {
      setAddingToCart(false);
    }
  };

  const handleAddToCart = async () => {
    if (!isAuthenticated) {
      toast.info('Please login to add items to cart');
      navigate('/login', { state: { from: `/products/${id}` } });
      return;
    }
    if (!product || !product.inStock) {
      toast.error('Product is not available');
      return;
    }
    setAddingToCart(true);
    try {
      // Ensure id is a string and quantity is a positive integer
      const productId = typeof id === 'string' ? id : String(id);
      const qty = parseInt(quantity) > 0 ? parseInt(quantity) : 1;
      const success = await addToCart(productId, qty);
      if (success) {
        toast.success(`${product.name} added to cart!`);
      }
    } catch (error) {
      if (error.response && error.response.data && error.response.data.message) {
        toast.error('Backend: ' + error.response.data.message);
      } else if (error.message) {
        toast.error('Frontend: ' + error.message);
      } else {
        toast.error('Failed to add item to cart. Please try again.');
      }
      console.error('Error adding to cart:', error);
    } finally {
      setAddingToCart(false);
    }
  };

  const handleQuantityChange = (e) => {
    const value = parseInt(e.target.value);
    setQuantity(value > 0 ? value : 1);
  };

  if (loading) {
    return (
      <Container className="py-4 mt-3 text-center">
        <Spinner animation="border" role="status" variant="primary">
          <span className="visually-hidden">Loading...</span>
        </Spinner>
        <p className="mt-3">Loading product details...</p>
      </Container>
    );
  }

  if (error || !product) {
    return (
      <Container className="py-4 mt-3">
        <Alert variant="danger">
          {error || 'Product not found.'}
        </Alert>
        <Link to="/products" className="btn btn-primary mt-3">
          Back to Products
        </Link>
      </Container>
    );
  }

  return (
    <Container className="py-4 mt-3" style={{ paddingTop: "1.5rem", paddingBottom: "2rem" }}>
      <Link to="/products" className="btn btn-outline-secondary mb-4">
        <i className="fas fa-arrow-left me-2"></i> Back to Products
      </Link>

      <Row className="mt-4">
        <Col md={6} className="mb-4">
          <Card className="border-0 shadow-sm">
            <div className="product-detail-img-container">
              <Card.Img 
                variant="top" 
                src={product.image} 
                alt={product.name} 
                className="product-detail-img"
              />
            </div>
          </Card>
        </Col>
        <Col md={6}>
          <h2 className="mb-3">{product.name}</h2>
          <p className="text-muted mb-3">
            {product.type} - {product.material}
          </p>
          <h3 className="text-primary mb-4">${product.price.toFixed(2)}</h3>
          
          <div className="mb-4">
            <h5>Description</h5>
            <p>{product.description}</p>
          </div>

          <div className="mb-4">
            <h5>Details</h5>
            <ul className="list-unstyled">
              <li className="mb-2">
                <strong>Type:</strong> {product.type}
              </li>
              <li className="mb-2">
                <strong>Material:</strong> {product.material}
              </li>
              <li className="mb-2">
                <strong>Availability:</strong>{' '}
                {product.inStock ? (
                  <span className="text-success">In Stock</span>
                ) : (
                  <span className="text-danger">Out of Stock</span>
                )}
              </li>
            </ul>
          </div>

          {product.inStock && (
            <Form.Group className="mb-3">
              <Form.Label>Quantity</Form.Label>
              <Form.Control
                type="number"
                min="1"
                value={quantity}
                onChange={handleQuantityChange}
                style={{ width: '100px' }}
              />
            </Form.Group>
          )}

          <div className="d-grid gap-2">
            <Button 
              variant="outline-primary" 
              size="lg"
              onClick={handleOrderClick}
              disabled={!product.inStock}
            >
              Order Now
            </Button>
            <Button 
              as={Link}
              to="/contact" 
              variant="outline-secondary"
              size="lg"
            >
              Ask a Question
            </Button>
          </div>
        </Col>
      </Row>

      <Row className="mt-5">
        <Col>
          <h3 className="mb-4">Product Information</h3>
          <Card className="border-0 shadow-sm">
            <Card.Body>
              <Row>
                <Col md={4}>
                  <div className="text-center mb-4 mb-md-0">
                    <i className="fas fa-shipping-fast fa-3x text-primary mb-3"></i>
                    <h5>Fast Shipping</h5>
                    <p className="text-muted">Delivery within 3-5 business days</p>
                  </div>
                </Col>
                <Col md={4}>
                  <div className="text-center mb-4 mb-md-0">
                    <i className="fas fa-undo fa-3x text-primary mb-3"></i>
                    <h5>Easy Returns</h5>
                    <p className="text-muted">30-day money-back guarantee</p>
                  </div>
                </Col>
                <Col md={4}>
                  <div className="text-center">
                    <i className="fas fa-shield-alt fa-3x text-primary mb-3"></i>
                    <h5>Secure Payments</h5>
                    <p className="text-muted">All transactions are secured</p>
                  </div>
                </Col>
              </Row>
            </Card.Body>
          </Card>
        </Col>
      </Row>
    </Container>
  );
};

export default ProductDetail;