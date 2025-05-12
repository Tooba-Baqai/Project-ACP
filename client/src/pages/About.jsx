import { Container, Row, Col, Card } from 'react-bootstrap';
import { Link } from 'react-router-dom';

const About = () => {
  return (
    <div className="about-page">
      {/* Hero Section */}
      <section className="hero py-5 mt-5" style={{ backgroundColor: '#533b37' }}>
        <Container>
          <Row className="justify-content-center text-center">
            <Col md={8}>
              <h1 className="fw-bold mb-4">About Art Heaven</h1>
              <p className="lead">
                Discover our story, our passion for craftsmanship, and our commitment to preserving artistic traditions.
              </p>
            </Col>
          </Row>
        </Container>
      </section>

      {/* Our Story Section */}
      <section className="py-5">
        <Container>
          <Row className="align-items-center">
            <Col lg={6} className="mb-4 mb-lg-0">
              <img
                src="https://images.unsplash.com/photo-1565193566173-7a0ee3dbe261?ixlib=rb-4.0.3&ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&auto=format&fit=crop&w=2670&q=80"
                alt="Art Heaven Workshop"
                className="img-fluid rounded shadow"
              />
            </Col>
            <Col lg={6}>
              <h2 className="fw-bold mb-4">Our Story</h2>
              <p className="mb-4">
                Art Heaven was founded in 2010 by a group of passionate artisans who shared a common vision: to create a platform where traditional art forms could be celebrated, preserved, and shared with the world.
              </p>
              <p className="mb-4">
                What began as a small workshop has now grown into a thriving community of artists, craftspeople, and art enthusiasts. Our journey has been marked by a relentless pursuit of excellence, a deep respect for artistic traditions, and an unwavering commitment to sustainability.
              </p>
              <p>
                Today, Art Heaven stands as a testament to the power of creativity and craftsmanship. We continue to work with artisans from across the country, helping them showcase their talents and connect with appreciative audiences worldwide.
              </p>
            </Col>
          </Row>
        </Container>
      </section>

      {/* Our Values Section */}
      <section className="bg-light py-5">
        <Container>
          <h2 className="text-center fw-bold mb-5">Our Values</h2>
          <Row>
            <Col md={4} className="mb-4">
              <Card className="h-100 border-0 shadow-sm">
                <Card.Body className="text-center p-4">
                  <div className="mb-3">
                    <i className="fas fa-hands fa-3x" style={{ color: '#533b37' }}></i>
                  </div>
                  <Card.Title className="fw-bold">Craftsmanship</Card.Title>
                  <Card.Text>
                    We believe in the value of handmade items. Each piece in our collection is crafted with precision, patience, and passion, reflecting the unique touch of its creator.
                  </Card.Text>
                </Card.Body>
              </Card>
            </Col>
            <Col md={4} className="mb-4">
              <Card className="h-100 border-0 shadow-sm">
                <Card.Body className="text-center p-4">
                  <div className="mb-3">
                    <i className="fas fa-seedling fa-3x" style={{ color: '#533b37' }}></i>
                  </div>
                  <Card.Title className="fw-bold">Sustainability</Card.Title>
                  <Card.Text>
                    We are committed to sustainable practices. From sourcing eco-friendly materials to minimizing waste in our production processes, we strive to be responsible stewards of our environment.
                  </Card.Text>
                </Card.Body>
              </Card>
            </Col>
            <Col md={4} className="mb-4">
              <Card className="h-100 border-0 shadow-sm">
                <Card.Body className="text-center p-4">
                  <div className="mb-3">
                    <i className="fas fa-users fa-3x" style={{ color: '#533b37' }}></i>
                  </div>
                  <Card.Title className="fw-bold">Community</Card.Title>
                  <Card.Text>
                    We value the communities that support us and the artisans we work with. We believe in fair trade practices and in creating opportunities for talented individuals to showcase their art.
                  </Card.Text>
                </Card.Body>
              </Card>
            </Col>
          </Row>
        </Container>
      </section>

      {/* Team section removed */}

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

export default About; 