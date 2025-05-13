import { Container, Row, Col } from 'react-bootstrap';
import { Link } from 'react-router-dom';
import { FaFacebook, FaTwitter, FaInstagram, FaLinkedin, FaPinterest } from 'react-icons/fa';

const Footer = () => {
  return (
    <footer className="bg-dark text-light py-5">
      <Container>
        <Row>
          <Col md={4} className="mb-4">
            <h5 className="text-white mb-4">Art Heaven</h5>
            <p>
              Welcome to Art Heaven, where creativity knows no bounds! We are passionate artisans dedicated to creating handcrafted wonders that add artistic elegance to your life.
            </p>
            <div className="social-icons d-flex gap-3 mb-3">
              <a href="https://facebook.com" target="_blank" rel="noopener noreferrer" className="text-light">
                <FaFacebook size={20} />
              </a>
              <a href="https://twitter.com" target="_blank" rel="noopener noreferrer" className="text-light">
                <FaTwitter size={20} />
              </a>
              <a href="https://instagram.com" target="_blank" rel="noopener noreferrer" className="text-light">
                <FaInstagram size={20} />
              </a>
              <a href="https://linkedin.com" target="_blank" rel="noopener noreferrer" className="text-light">
                <FaLinkedin size={20} />
              </a>
              <a href="https://pinterest.com" target="_blank" rel="noopener noreferrer" className="text-light">
                <FaPinterest size={20} />
              </a>
            </div>
          </Col>
          <Col md={2} className="mb-4">
            <h5 className="text-white mb-4">Quick Links</h5>
            <ul className="list-unstyled">
              <li className="mb-2">
                <Link to="/" className="text-light text-decoration-none">Home</Link>
              </li>
              <li className="mb-2">
                <Link to="/about" className="text-light text-decoration-none">About Us</Link>
              </li>
              <li className="mb-2">
                <Link to="/services" className="text-light text-decoration-none">Services</Link>
              </li>
              <li className="mb-2">
                <Link to="/gallery" className="text-light text-decoration-none">Gallery</Link>
              </li>
              <li className="mb-2">
                <Link to="/products" className="text-light text-decoration-none">Products</Link>
              </li>
              <li className="mb-2">
                <Link to="/contact" className="text-light text-decoration-none">Contact</Link>
              </li>
            </ul>
          </Col>
          <Col md={3} className="mb-4">
            <h5 className="text-white mb-4">Our Services</h5>
            <ul className="list-unstyled">
              <li className="mb-2">Pottery</li>
              <li className="mb-2">Showpieces</li>
              <li className="mb-2">Clay Plates</li>
              <li className="mb-2">Blue Pottery</li>
              <li className="mb-2">Clay Matka</li>
              <li className="mb-2">Custom Orders</li>
            </ul>
          </Col>
          <Col md={3} className="mb-4">
            <h5 className="text-white mb-4">Contact Us</h5>
            <address className="mb-0">
              <p className="mb-1">F-7 Markaz</p>
              <p className="mb-1">Islamabad, Pakistan</p>
              <p className="mb-1">Phone: 0123456789</p>
              <p className="mb-1">Email: artheaven@gmail.com</p>
            </address>
          </Col>
        </Row>
        <hr className="mt-4 mb-4 bg-secondary" />
        <Row>
          <Col className="text-center">
            <p className="mb-0">
              &copy; {new Date().getFullYear()} Art Heaven. All rights reserved.
            </p>
          </Col>
        </Row>
      </Container>
    </footer>
  );
};

export default Footer; 