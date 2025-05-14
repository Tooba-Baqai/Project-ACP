import { useState, useEffect } from 'react';
import { useParams, useNavigate, Link } from 'react-router-dom';
import { Container, Row, Col, Card, Form, Button, Alert, Spinner } from 'react-bootstrap';
import { useAuth } from '../context/AuthContext';

const PlaceOrder = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const { api, currentUser } = useAuth();
  const [product, setProduct] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [submitting, setSubmitting] = useState(false);
  const [success, setSuccess] = useState(false);
  
  const [formData, setFormData] = useState({
    quantity: 1,
    shippingAddress: '',
    contactNumber: ''
  });

  useEffect(() => {
    const fetchProductAndUserData = async () => {
      try {
        const productRes = await api.get(`/products/${id}`);
        setProduct(productRes.data.data);
        
        if (currentUser && currentUser.address) {
          setFormData(prevState => ({
            ...prevState,
            shippingAddress: currentUser.address
          }));
        }
        
        if (currentUser && currentUser.phone) {
          setFormData(prevState => ({
            ...prevState,
            contactNumber: currentUser.phone
          }));
        }
      } catch (error) {
        setError('Failed to fetch product details. Please try again later.');
        console.error('Error fetching data:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchProductAndUserData();
  }, [api, id, currentUser]);

  const handleChange = (e) => {
    const { name, value } = e.target;
  
    if (name === 'quantity') {
      const quantity = parseInt(value, 10);
      if (quantity < 1) return; 
      setFormData({ ...formData, [name]: quantity });
    } else {
      setFormData({ ...formData, [name]: value });
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setSubmitting(true);
    setError('');

    try {
      const orderData = {
        product: id,
        ...formData
      };

      await api.post('/orders', orderData);
      setSuccess(true);
  
      setFormData({
        quantity: 1,
        shippingAddress: '',
        contactNumber: ''
      });
      
      setTimeout(() => {
        navigate('/orders');
      }, 3000);
    } catch (error) {
      setError(error.response?.data?.message || 'Failed to place order. Please try again later.');
      console.error('Error placing order:', error);
    } finally {
      setSubmitting(false);
    }
  };

  const calculateTotal = () => {
    if (!product) return 0;
    return (product.price * formData.quantity).toFixed(2);
  };

  if (loading) {
    return (
      <Container className="py-5 mt-5 text-center">
        <Spinner animation="border" role="status" variant="primary">
          <span className="visually-hidden">Loading...</span>
        </Spinner>
        <p className="mt-3">Loading product details...</p>
      </Container>
    );
  }

  if (error && !product) {
    return (
      <Container className="py-5 mt-5">
        <Alert variant="danger">
          {error}
        </Alert>
        <Link to="/products" className="btn btn-primary mt-3">
          Back to Products
        </Link>
      </Container>
    );
  }

  if (success) {
    return (
      <Container className="py-5 mt-5">
        <Alert variant="success">
          <Alert.Heading>Order Placed Successfully!</Alert.Heading>
          <p>
            Thank you for your order. Your order has been placed successfully and will be processed soon.
            You will be redirected to your orders page in a few seconds...
          </p>
        </Alert>
        <Button as={Link} to="/orders" variant="primary">
          View My Orders
        </Button>
      </Container>
    );
  }

  return (
    <Container className="py-5 mt-5">
      <h2 className="text-center mb-4">Place Order</h2>
      
      <Row>
        <Col md={7} className="mb-4">
          <Card className="border-0 shadow-sm">
            <Card.Body>
              <h4 className="mb-4">Order Details</h4>
              
              {error && <Alert variant="danger">{error}</Alert>}
              
              <Form onSubmit={handleSubmit}>
                <Form.Group className="mb-3">
                  <Form.Label>Quantity</Form.Label>
                  <Form.Control
                    type="number"
                    name="quantity"
                    value={formData.quantity}
                    onChange={handleChange}
                    min="1"
                    required
                  />
                </Form.Group>

                <Form.Group className="mb-3">
                  <Form.Label>Shipping Address</Form.Label>
                  <Form.Control
                    as="textarea"
                    rows={3}
                    name="shippingAddress"
                    value={formData.shippingAddress}
                    onChange={handleChange}
                    placeholder="Enter your shipping address"
                    required
                  />
                </Form.Group>

                <Form.Group className="mb-4">
                  <Form.Label>Contact Number</Form.Label>
                  <Form.Control
                    type="text"
                    name="contactNumber"
                    value={formData.contactNumber}
                    onChange={handleChange}
                    placeholder="Enter your contact number"
                    required
                  />
                </Form.Group>

                <div className="d-grid gap-2">
                  <Button 
                    variant="primary" 
                    type="submit" 
                    size="lg"
                    disabled={submitting}
                  >
                    {submitting ? 'Processing...' : 'Place Order'}
                  </Button>
                  <Button 
                    as={Link}
                    to={`/products/${id}`}
                    variant="outline-secondary"
                    size="lg"
                  >
                    Cancel
                  </Button>
                </div>
              </Form>
            </Card.Body>
          </Card>
        </Col>
        
        <Col md={5}>
          <Card className="border-0 shadow-sm mb-4">
            <Card.Body>
              <h4 className="mb-4">Order Summary</h4>
              
              <div className="d-flex align-items-center mb-4">
                <img 
                  src={product?.image} 
                  alt={product?.name} 
                  className="img-thumbnail me-3" 
                  style={{ width: '80px', height: '80px', objectFit: 'cover' }}
                />
                <div>
                  <h5 className="mb-1">{product?.name}</h5>
                  <p className="text-muted mb-0">
                    {product?.type} - {product?.material}
                  </p>
                </div>
              </div>
              
              <hr />
              
              <div className="d-flex justify-content-between mb-2">
                <span>Price:</span>
                <span>${product?.price.toFixed(2)}</span>
              </div>
              
              <div className="d-flex justify-content-between mb-2">
                <span>Quantity:</span>
                <span>{formData.quantity}</span>
              </div>
              
              <div className="d-flex justify-content-between mb-2">
                <span>Shipping:</span>
                <span>Free</span>
              </div>
              
              <hr />
              
              <div className="d-flex justify-content-between mb-0">
                <strong>Total:</strong>
                <strong className="text-primary">${calculateTotal()}</strong>
              </div>
            </Card.Body>
          </Card>
          
          <Card className="border-0 shadow-sm">
            <Card.Body>
              <h5 className="mb-3">Need Help?</h5>
              <p>
                If you have any questions about your order, please contact our customer support team.
              </p>
              <Button 
                as={Link}
                to="/contact"
                variant="outline-primary"
                className="w-100"
              >
                Contact Us
              </Button>
            </Card.Body>
          </Card>
        </Col>
      </Row>
    </Container>
  );
};

export default PlaceOrder; 