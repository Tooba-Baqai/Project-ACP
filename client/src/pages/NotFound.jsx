import { Container, Row, Col, Button } from 'react-bootstrap';
import { Link } from 'react-router-dom';

const NotFound = () => {
  return (
    <div className="not-found-page">
      <Container className="py-5 mt-5 text-center">
        <Row className="justify-content-center">
          <Col md={8} lg={6}>
            <div className="error-container mb-4">
              <h1 className="display-1 fw-bold text-primary">404</h1>
              <div className="position-relative">
                <div className="error-divider bg-light mb-4"></div>
                <i className="fas fa-search position-absolute top-50 start-50 translate-middle bg-white px-3 text-primary"></i>
              </div>
            </div>
            <h2 className="mb-4">Page Not Found</h2>
            <p className="lead text-muted mb-5">
              The page you are looking for might have been removed, had its name changed, or is temporarily unavailable.
            </p>
            <div className="d-flex justify-content-center gap-3">
              <Button as={Link} to="/" variant="primary">
                <i className="fas fa-home me-2"></i> Back to Home
              </Button>
              <Button as={Link} to="/products" variant="outline-primary">
                <i className="fas fa-shopping-bag me-2"></i> Browse Products
              </Button>
            </div>
          </Col>
        </Row>
      </Container>

      {/* Custom CSS */}
      <style jsx="true">{`
        .error-container {
          position: relative;
        }
        .error-divider {
          height: 4px;
          width: 100%;
        }
      `}</style>
    </div>
  );
};

export default NotFound; 