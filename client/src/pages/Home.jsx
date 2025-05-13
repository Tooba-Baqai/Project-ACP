import { useEffect, useState } from 'react';
import { Container, Row, Col, Card, Button } from 'react-bootstrap';
import { Link } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import heroImage from '../assets/images/hero-banner.png';

// Replace the imported hero image with a component
const HeroImage = () => {
  return (
    <div 
      className="hero-image-container rounded shadow overflow-hidden"
      style={{ 
        height: '400px', 
        width: '100%',
      }}
    >
      <img 
        src={heroImage}
        alt="Art Heaven Pottery Collection" 
        className="img-fluid w-100 h-100" 
        style={{ objectFit: 'cover' }}
      />
    </div>
  );
};

const Home = () => {
  const { api } = useAuth();
  const [featuredProducts, setFeaturedProducts] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchProducts = async () => {
      try {
        const res = await api.get('/products');
        const randomProducts = res.data.data
          .sort(() => 0.5 - Math.random())
          .slice(0, 4);
        setFeaturedProducts(randomProducts);
      } catch (error) {
        console.error('Error fetching products:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchProducts();
  }, [api]);

  return (
    <>
      {/* Hero Section */}
      <section className="hero-section bg-primary text-white text-center py-5 mt-5">
        <Container>
          <Row className="align-items-center">
            <Col lg={6} className="text-lg-start mb-4 mb-lg-0">
              <p className="lead"> Welcome To Our Store!</p>
              <h1 className="display-4 fw-bold mb-4">Art Heaven</h1>
              <p className="fs-5 mb-4">
                Discover handcrafted pottery and artistic treasures that bring beauty to your everyday life. Each piece tells a unique story.
              </p>
              <Link to="/products" className="btn btn-light btn-lg me-3">
                Explore Products
              </Link>
              <Link to="/contact" className="btn btn-outline-light btn-lg">
                Contact Us
              </Link>
            </Col>
            <Col lg={6}>
              <HeroImage />
            </Col>
          </Row>
        </Container>
      </section>

      {/* About Section */}
      <section className="py-5">
        <Container>
          <Row className="justify-content-center">
            <Col md={8} className="text-center">
              <h2 className="fw-bold mb-4">About Art Heaven</h2>
              <p className="lead mb-4">
                Welcome to Art Heaven, where creativity knows no bounds! We are a passionate team of artisans dedicated to curating and creating handcrafted wonders that add a touch of artistic elegance to your life.
              </p>
              <p className="mb-4">
                At Art Heaven, we believe that every piece tells a unique story and brings joy to those who appreciate the beauty of handmade craftsmanship. Our collection showcases a diverse range of meticulously crafted artworks, from intricately designed jewelry to charming home decor items.
              </p>
              <Link to="/about" className="btn btn-primary">
                Learn More About Us
              </Link>
            </Col>
          </Row>
        </Container>
      </section>

      {/* Services Section */}
      <section className="bg-light py-5">
        <Container>
          <h2 className="text-center fw-bold mb-5">Our Services</h2>
          <Row>
            <Col md={4} className="mb-4">
              <Card className="h-100 border-0 shadow-sm">
                <Card.Body className="text-center p-4">
                  <div className="mb-3">
                    <i className="fas fa-palette fa-3x" style={{ color: '#533b37' }}></i>
                  </div>
                  <Card.Title className="fw-bold">Pottery</Card.Title>
                  <Card.Text>
                    Handcrafted ceramic and clay pottery made with traditional techniques and modern designs.
                  </Card.Text>
                </Card.Body>
              </Card>
            </Col>
            <Col md={4} className="mb-4">
              <Card className="h-100 border-0 shadow-sm">
                <Card.Body className="text-center p-4">
                  <div className="mb-3">
                    <i className="fas fa-paint-brush fa-3x" style={{ color: '#533b37' }}></i>
                  </div>
                  <Card.Title className="fw-bold">Blue Pottery</Card.Title>
                  <Card.Text>
                    Traditional blue pottery with intricate designs and patterns inspired by Persian and Indian art.
                  </Card.Text>
                </Card.Body>
              </Card>
            </Col>
            <Col md={4} className="mb-4">
              <Card className="h-100 border-0 shadow-sm">
                <Card.Body className="text-center p-4">
                  <div className="mb-3">
                    <i className="fas fa-gift fa-3x" style={{ color: '#533b37' }}></i>
                  </div>
                  <Card.Title className="fw-bold">Custom Orders</Card.Title>
                  <Card.Text>
                    Personalized pottery and art pieces created according to your specifications and preferences.
                  </Card.Text>
                </Card.Body>
              </Card>
            </Col>
          </Row>
          <div className="text-center mt-4">
            <Link to="/services" className="btn btn-primary">
              View All Services
            </Link>
          </div>
        </Container>
      </section>

      {/* Featured Products */}
      <section className="py-5">
        <Container>
          <h2 className="text-center fw-bold mb-5">Featured Products</h2>
          {loading ? (
            <div className="text-center">Loading products...</div>
          ) : (
            <Row>
              {featuredProducts.map((product) => (
                <Col md={3} className="mb-4" key={product._id}>
                  <Card className="h-100 border-0 shadow-sm product-card">
                    <div className="product-img-container">
                      <Card.Img
                        variant="top"
                        src={product.image}
                        alt={product.name}
                        className="product-img"
                      />
                    </div>
                    <Card.Body>
                      <Card.Title className="fw-bold">{product.name}</Card.Title>
                      <Card.Text className="text-muted mb-2">
                        {product.type} - {product.material}
                      </Card.Text>
                      <Card.Text className="fw-bold text-primary mb-3">
                        ${product.price.toFixed(2)}
                      </Card.Text>
                      <Link
                        to={`/products/${product._id}`}
                        className="btn btn-outline-primary w-100"
                      >
                        View Details
                      </Link>
                    </Card.Body>
                  </Card>
                </Col>
              ))}
            </Row>
          )}
          <div className="text-center mt-4">
            <Link to="/products" className="btn btn-primary">
              View All Products
            </Link>
          </div>
        </Container>
      </section>

      {/* Testimonials */}
      <section className="bg-light py-5">
        <Container>
          <h2 className="text-center fw-bold mb-5">What Our Customers Say</h2>
          <Row>
            <Col md={4} className="mb-4">
              <Card className="h-100 border-0 shadow-sm">
                <Card.Body className="p-4">
                  <div className="mb-3 text-warning">
                    <i className="fas fa-star"></i>
                    <i className="fas fa-star"></i>
                    <i className="fas fa-star"></i>
                    <i className="fas fa-star"></i>
                    <i className="fas fa-star"></i>
                  </div>
                  <Card.Text className="mb-3">
                    "The pottery pieces I purchased from Art Heaven are absolutely stunning! The craftsmanship is impeccable, and they've become the focal point of my living room."
                  </Card.Text>
                  <div className="d-flex align-items-center">
                    <div className="rounded-circle text-white fw-bold d-flex align-items-center justify-content-center me-3" style={{ width: '50px', height: '50px', backgroundColor: '#533b37', borderRadius: '50%' }}>
                      AR
                    </div>
                    <div>
                      <h6 className="fw-bold mb-0">Alina R.</h6>
                      <small className="text-muted">Loyal Customer</small>
                    </div>
                  </div>
                </Card.Body>
              </Card>
            </Col>
            <Col md={4} className="mb-4">
              <Card className="h-100 border-0 shadow-sm">
                <Card.Body className="p-4">
                  <div className="mb-3 text-warning">
                    <i className="fas fa-star"></i>
                    <i className="fas fa-star"></i>
                    <i className="fas fa-star"></i>
                    <i className="fas fa-star"></i>
                    <i className="fas fa-star"></i>
                  </div>
                  <Card.Text className="mb-3">
                    "I ordered a custom-made vase for my mother's birthday, and it exceeded all expectations. The attention to detail was remarkable, and the service was top-notch!"
                  </Card.Text>
                  <div className="d-flex align-items-center">
                    <div className="rounded-circle text-white fw-bold d-flex align-items-center justify-content-center me-3" style={{ width: '50px', height: '50px', backgroundColor: '#533b37', borderRadius: '50%' }}>
                      AJ
                    </div>
                    <div>
                      <h6 className="fw-bold mb-0">Atiqa J.</h6>
                      <small className="text-muted">Happy Customer</small>
                    </div>
                  </div>
                </Card.Body>
              </Card>
            </Col>
            <Col md={4} className="mb-4">
              <Card className="h-100 border-0 shadow-sm">
                <Card.Body className="p-4">
                  <div className="mb-3 text-warning">
                    <i className="fas fa-star"></i>
                    <i className="fas fa-star"></i>
                    <i className="fas fa-star"></i>
                    <i className="fas fa-star"></i>
                    <i className="fas fa-star-half-alt"></i>
                  </div>
                  <Card.Text className="mb-3">
                    "Art Heaven has the most unique and beautiful pottery I've ever seen. Each piece tells a story, and I love how they've transformed my home with their artistic touch."
                  </Card.Text>
                  <div className="d-flex align-items-center">
                    <div className="rounded-circle text-white fw-bold d-flex align-items-center justify-content-center me-3" style={{ width: '50px', height: '50px', backgroundColor: '#533b37', borderRadius: '50%' }}>
                      AP
                    </div>
                    <div>
                      <h6 className="fw-bold mb-0">Aneeza P.</h6>
                      <small className="text-muted">Art Enthusiast</small>
                    </div>
                  </div>
                </Card.Body>
              </Card>
            </Col>
          </Row>
        </Container>
      </section>

      {/* Join Our Artistic Journey Section */}
      <section className="py-5" style={{ backgroundColor: '#533b37' }}>
        <Container>
          <Row className="justify-content-center text-center text-white">
            <Col md={8}>
              <h2 className="fw-bold mb-4">Join Our Artistic Journey</h2>
              <p className="lead mb-4">
                Become part of our growing community of art enthusiasts and craft lovers. Sign up for workshops, get exclusive offers, and stay updated on new arrivals.
              </p>
              <Link to="/register" className="btn btn-light btn-lg me-3">
                Sign Up Now
              </Link>
              <Link to="/contact" className="btn btn-outline-light btn-lg">
                Contact Us
              </Link>
            </Col>
          </Row>
        </Container>
      </section>
    </>
  );
};

export default Home; 