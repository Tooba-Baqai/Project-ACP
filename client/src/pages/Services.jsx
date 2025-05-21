import { Container, Row, Col, Card } from 'react-bootstrap';
import { Link } from 'react-router-dom';

const Services = () => {
  return (
    <div className="services-page">
      {/* Hero Section */}
      <section className="hero py-5 mt-5" style={{ backgroundColor: '#533b37' }}>
        <Container>
          <Row className="justify-content-center text-center">
            <Col md={8}>
              <h1 className="fw-bold mb-4">Our Services</h1>
              <p className="lead">
                Discover our range of handcrafted pottery services, from custom orders to workshops.
              </p>
            </Col>
          </Row>
        </Container>
      </section>

      {/* Main Services Section */}
      <section className="py-5 bg-light">
        <Container>
          <h2 className="text-center fw-bold mb-5">What We Offer</h2>
          <Row>
            <Col lg={4} md={6} className="mb-4 mx-auto">
              <Card className="h-100 border-0 shadow-sm text-center">
                <Card.Body className="p-4">
                  <div className="mb-4">
                    <i className="fas fa-palette fa-4x" style={{ color: '#533b37' }}></i>
                  </div>
                  <Card.Title className="fw-bold">Pottery</Card.Title>
                  <Card.Text>
                    Handcrafted ceramic and clay pottery made with traditional techniques and modern designs.
                  </Card.Text>
                </Card.Body>
              </Card>
            </Col>
            <Col lg={4} md={6} className="mb-4 mx-auto">
              <Card className="h-100 border-0 shadow-sm text-center">
                <Card.Body className="p-4">
                  <div className="mb-4">
                    <i className="fas fa-paint-brush fa-4x" style={{ color: '#533b37' }}></i>
                  </div>
                  <Card.Title className="fw-bold">Blue Pottery</Card.Title>
                  <Card.Text>
                    Traditional blue pottery with intricate designs and patterns inspired by Persian and Indian art.
                  </Card.Text>
                </Card.Body>
              </Card>
            </Col>
            <Col lg={4} md={6} className="mb-4 mx-auto">
              <Card className="h-100 border-0 shadow-sm text-center">
                <Card.Body className="p-4">
                  <div className="mb-4">
                    <i className="fas fa-gift fa-4x" style={{ color: '#533b37' }}></i>
                  </div>
                  <Card.Title className="fw-bold">Custom Orders</Card.Title>
                  <Card.Text>
                    Personalized pottery and art pieces created according to your specifications and preferences.
                  </Card.Text>
                </Card.Body>
              </Card>
            </Col>
          </Row>
        </Container>
      </section>

      {/* Creative Clay Classes Section - Redesigned */}
      <section className="py-5">
        <Container>
          <h2 className="text-center fw-bold mb-5">Creative Clay Classes</h2>
          <p className="text-center mb-5">
            Experience the joy of pottery creation with our immersive clay classes. Led by skilled artisans, 
            these hands-on sessions cater to all skill levels, from complete beginners to experienced potters.
          </p>
          
          <div className="bg-white rounded shadow-sm p-4 mb-4">
            <div className="d-flex align-items-center">
              <div className="me-4" style={{ minWidth: '80px', textAlign: 'center' }}>
                <i className="fas fa-users fa-3x" style={{ color: '#533b37' }}></i>
              </div>
              <div>
                <h4 className="fw-bold mb-2">Beginner's Pottery</h4>
                <p className="mb-0">Perfect for those new to pottery. Learn basic techniques and create your first piece in a supportive environment. No prior experience required!</p>
              </div>
            </div>
          </div>
          
          <div className="bg-white rounded shadow-sm p-4 mb-4">
            <div className="d-flex align-items-center">
              <div className="me-4" style={{ minWidth: '80px', textAlign: 'center' }}>
                <i className="fas fa-paint-brush fa-3x" style={{ color: '#533b37' }}></i>
              </div>
              <div>
                <h4 className="fw-bold mb-2">Blue Pottery Techniques</h4>
                <p className="mb-0">Explore the traditional art of blue pottery and learn decorative techniques from masters of this ancient craft. Create stunning pieces with vibrant designs.</p>
              </div>
            </div>
          </div>
          
          <div className="bg-white rounded shadow-sm p-4 mb-4">
            <div className="d-flex align-items-center">
              <div className="me-4" style={{ minWidth: '80px', textAlign: 'center' }}>
                <i className="fas fa-graduation-cap fa-3x" style={{ color: '#533b37' }}></i>
              </div>
              <div>
                <h4 className="fw-bold mb-2">Advanced Throwing Techniques</h4>
                <p className="mb-0">For experienced potters looking to enhance their wheel-throwing skills. Master complex forms, refine your technique, and develop your unique artistic style.</p>
              </div>
            </div>
          </div>
          
          <div className="text-center mt-5">
            <Link to="/contact" className="btn btn-primary btn-lg">
              Inquire About Classes
            </Link>
          </div>
        </Container>
      </section>

      {/* Restoration Services */}
      <section className="py-5 bg-light">
        <Container>
          <h2 className="text-center fw-bold mb-5">Restoration Services</h2>
          <p className="text-center mb-5">
            Have a cherished pottery piece that's been damaged? Our restoration services can help bring it back to life. 
            Our skilled restorers use traditional techniques and modern materials to repair and restore pottery items with care and precision.
          </p>
          <Row className="justify-content-center">
            <Col lg={8} md={10} className="mb-4 mx-auto">
              <Card className="h-100 border-0 shadow-sm">
                <Card.Body className="p-4">
                  <Row>
                    <Col md={6} className="text-center mb-4 mb-md-0">
                      <div className="mb-4">
                        <i className="fas fa-tools fa-4x" style={{ color: '#533b37' }}></i>
                      </div>
                      <h4 className="fw-bold mb-3">Our Restoration Process</h4>
                      <p>We carefully assess each piece and develop a custom restoration plan to preserve its unique character and integrity.</p>
                    </Col>
                    <Col md={6}>
                      <h5 className="fw-bold mb-3">Services Include:</h5>
                      <ul className="list-unstyled">
                        <li className="mb-2"><i className="fas fa-check-circle text-primary me-2"></i> Crack and chip repair</li>
                        <li className="mb-2"><i className="fas fa-check-circle text-primary me-2"></i> Color matching and refinishing</li>
                        <li className="mb-2"><i className="fas fa-check-circle text-primary me-2"></i> Structural reinforcement</li>
                        <li><i className="fas fa-check-circle text-primary me-2"></i> Historical piece restoration</li>
                      </ul>
                      <div className="mt-4">
                        <Link to="/contact" className="btn btn-primary">
                          Inquire About Restoration
                        </Link>
                      </div>
                    </Col>
                  </Row>
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
    </div>
  );
};

export default Services; 