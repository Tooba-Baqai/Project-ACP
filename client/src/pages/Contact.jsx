import { useState } from 'react';
import { Container, Row, Col, Card, Form, Button, Alert } from 'react-bootstrap';
import { useAuth } from '../context/AuthContext';

const Contact = () => {
  const { api, currentUser } = useAuth();
  const [formData, setFormData] = useState({
    name: currentUser?.name || '',
    email: currentUser?.email || '',
    subject: '',
    message: ''
  });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState(false);

  const { name, email, subject, message } = formData;

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setLoading(true);
    setSuccess(false);

    try {
      await api.post('/contacts', formData);
      setSuccess(true);
      setFormData({
        name: currentUser?.name || '',
        email: currentUser?.email || '',
        subject: '',
        message: ''
      });
    } catch (error) {
      setError(error.response?.data?.message || 'Failed to send message. Please try again later.');
      console.error('Error sending message:', error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <Container className="py-4 mt-3" style={{ paddingTop: "1.5rem", paddingBottom: "2rem" }}>
      {/* Hero Section */}
      <section className="hero py-4 mt-2" style={{ backgroundColor: '#533b37' }}>
        <Container>
          <Row className="justify-content-center text-center">
            <Col md={8}>
              <h1 className="fw-bold mb-4">Contact Us</h1>
              <p className="lead">
                We'd love to hear from you! Get in touch with us for any questions or inquiries.
              </p>
            </Col>
          </Row>
        </Container>
      </section>

      <Row className="justify-content-center mt-5 pt-4">
        <Col lg={10}>
          <h1 className="text-center mb-5">Contact Us</h1>

          <Row>
            <Col md={5} className="mb-4 mb-md-0">
              <Card className="border-0 shadow-sm h-100">
                <Card.Body className="p-4">
                  <h4 className="mb-4">Get In Touch</h4>
                  <p className="mb-4">
                    Have questions about our products or services? We're here to help!
                    Fill out the form and we'll get back to you as soon as possible.
                  </p>

                  <div className="mb-4">
                    <h5 className="mb-3">Our Information</h5>
                    <p className="mb-2">
                      <i className="fas fa-map-marker-alt me-2 text-primary"></i>
                      F-7 Markaz, Islamabad, Pakistan
                    </p>
                    <p className="mb-2">
                      <i className="fas fa-phone-alt me-2 text-primary"></i>
                      0123456789
                    </p>
                    <p className="mb-2">
                      <i className="fas fa-envelope me-2 text-primary"></i>
                      artheaven@gmail.com
                    </p>
                  </div>

                  <div>
                    <h5 className="mb-3">Follow Us</h5>
                    <div className="d-flex gap-3">
                      <a href="https://facebook.com" target="_blank" rel="noopener noreferrer" className="text-primary">
                        <i className="fab fa-facebook-f fa-lg"></i>
                      </a>
                      <a href="https://twitter.com" target="_blank" rel="noopener noreferrer" className="text-primary">
                        <i className="fab fa-twitter fa-lg"></i>
                      </a>
                      <a href="https://instagram.com" target="_blank" rel="noopener noreferrer" className="text-primary">
                        <i className="fab fa-instagram fa-lg"></i>
                      </a>
                      <a href="https://pinterest.com" target="_blank" rel="noopener noreferrer" className="text-primary">
                        <i className="fab fa-pinterest fa-lg"></i>
                      </a>
                    </div>
                  </div>
                </Card.Body>
              </Card>
            </Col>

            <Col md={7}>
              <Card className="border-0 shadow-sm">
                <Card.Body className="p-4">
                  <h4 className="mb-4">Send a Message</h4>
                  
                  {error && <Alert variant="danger">{error}</Alert>}
                  {success && (
                    <Alert variant="success">
                      Your message has been sent successfully! We'll get back to you soon.
                    </Alert>
                  )}
                  
                  <Form onSubmit={handleSubmit}>
                    <Form.Group className="mb-3">
                      <Form.Label>Name</Form.Label>
                      <Form.Control
                        type="text"
                        name="name"
                        value={name}
                        onChange={handleChange}
                        placeholder="Enter your name"
                        required
                      />
                    </Form.Group>

                    <Form.Group className="mb-3">
                      <Form.Label>Email</Form.Label>
                      <Form.Control
                        type="email"
                        name="email"
                        value={email}
                        onChange={handleChange}
                        placeholder="Enter your email"
                        required
                      />
                    </Form.Group>

                    <Form.Group className="mb-3">
                      <Form.Label>Subject</Form.Label>
                      <Form.Control
                        type="text"
                        name="subject"
                        value={subject}
                        onChange={handleChange}
                        placeholder="Enter subject"
                        required
                      />
                    </Form.Group>

                    <Form.Group className="mb-4">
                      <Form.Label>Message</Form.Label>
                      <Form.Control
                        as="textarea"
                        rows={5}
                        name="message"
                        value={message}
                        onChange={handleChange}
                        placeholder="Enter your message"
                        required
                      />
                    </Form.Group>

                    <Button 
                      variant="primary" 
                      type="submit" 
                      className="w-100"
                      disabled={loading}
                    >
                      {loading ? 'Sending...' : 'Send Message'}
                    </Button>
                  </Form>
                </Card.Body>
              </Card>
            </Col>
          </Row>
        </Col>
      </Row>

      <Row className="mt-5">
        <Col>
          <Card className="border-0 shadow-sm">
            <Card.Body className="p-0">
              <iframe
                src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d13290.113243379223!2d73.02731979638892!3d33.728530835378164!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x38dfbfd07891722f%3A0x6974e2f3e85b12a4!2sF-7%20Markaz%20F-7%2C%20Islamabad%2C%20Islamabad%20Capital%20Territory%2C%20Pakistan!5e0!3m2!1sen!2s!4v1714919452743!5m2!1sen!2s"
                width="100%"
                height="450"
                style={{ border: 0 }}
                allowFullScreen=""
                loading="lazy"
                referrerPolicy="no-referrer-when-downgrade"
                title="Google Maps"
              ></iframe>
            </Card.Body>
          </Card>
        </Col>
      </Row>
    </Container>
  );
};

export default Contact; 