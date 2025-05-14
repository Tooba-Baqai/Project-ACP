import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { Container, Row, Col, Card, Form, Button, Spinner } from 'react-bootstrap';
import { useAuth } from '../context/AuthContext';

const Products = () => {
  const { api } = useAuth();
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [filters, setFilters] = useState({
    type: '',
    material: '',
    priceRange: '',
    searchTerm: ''
  });

  useEffect(() => {
    const fetchProducts = async () => {
      try {
        const res = await api.get('/products');
        setProducts(res.data.data);
      } catch (error) {
        setError('Failed to fetch products. Please try again later.');
        console.error('Error fetching products:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchProducts();
  }, [api]);

  const handleFilterChange = (e) => {
    setFilters({ ...filters, [e.target.name]: e.target.value });
  };

  const resetFilters = () => {
    setFilters({
      type: '',
      material: '',
      priceRange: '',
      searchTerm: ''
    });
  };

  const filteredProducts = products.filter((product) => {
    let matchesSearchTerm = true;
    let matchesType = true;
    let matchesMaterial = true;
    let matchesPriceRange = true;

    if (filters.searchTerm) {
      matchesSearchTerm = 
        product.name.toLowerCase().includes(filters.searchTerm.toLowerCase()) ||
        product.description.toLowerCase().includes(filters.searchTerm.toLowerCase());
    }

    if (filters.type) {
      matchesType = product.type === filters.type;
    }

    if (filters.material) {
      matchesMaterial = product.material === filters.material;
    }

    if (filters.priceRange) {
      const [min, max] = filters.priceRange.split('-').map(Number);
      matchesPriceRange = product.price >= min && product.price <= max;
    }

    return matchesSearchTerm && matchesType && matchesMaterial && matchesPriceRange;
  });

  return (
    <Container className="py-4 mt-3" style={{ paddingTop: "1.5rem", paddingBottom: "2rem" }}>
      {}
      <section className="hero py-4 mt-2" style={{ backgroundColor: '#533b37' }}>
        <Container>
          <Row className="justify-content-center text-center">
            <Col md={8}>
              <h1 className="fw-bold mb-4">Our Products</h1>
              <p className="lead">
                Explore our collection of handcrafted pottery and artistic creations.
              </p>
            </Col>
          </Row>
        </Container>
      </section>

      <h1 className="text-center mb-4 mt-4">Our Pottery Collection</h1>

      <Row className="mb-4">
        <Col md={3}>
          <Card className="shadow-sm border-0 mb-4">
            <Card.Body>
              <h5 className="mb-3">Filters</h5>
              <Form>
                <Form.Group className="mb-3">
                  <Form.Label>Search</Form.Label>
                  <Form.Control
                    type="text"
                    name="searchTerm"
                    value={filters.searchTerm}
                    onChange={handleFilterChange}
                    placeholder="Search products..."
                  />
                </Form.Group>

                <Form.Group className="mb-3">
                  <Form.Label>Product Type</Form.Label>
                  <Form.Select
                    name="type"
                    value={filters.type}
                    onChange={handleFilterChange}
                  >
                    <option value="">All Types</option>
                    <option value="vase">Vase</option>
                    <option value="pottery">Pottery</option>
                    <option value="clay plate">Clay Plate</option>
                    <option value="clay matka">Clay Matka</option>
                    <option value="blue pottery">Blue Pottery</option>
                    <option value="showpiece">Showpiece</option>
                  </Form.Select>
                </Form.Group>

                <Form.Group className="mb-3">
                  <Form.Label>Material</Form.Label>
                  <Form.Select
                    name="material"
                    value={filters.material}
                    onChange={handleFilterChange}
                  >
                    <option value="">All Materials</option>
                    <option value="clay">Clay</option>
                    <option value="ceramic">Ceramic</option>
                  </Form.Select>
                </Form.Group>

                <Form.Group className="mb-3">
                  <Form.Label>Price Range</Form.Label>
                  <Form.Select
                    name="priceRange"
                    value={filters.priceRange}
                    onChange={handleFilterChange}
                  >
                    <option value="">All Prices</option>
                    <option value="0-50">$0 - $50</option>
                    <option value="50-100">$50 - $100</option>
                    <option value="100-200">$100 - $200</option>
                    <option value="200-500">$200 - $500</option>
                    <option value="500-1000">$500+</option>
                  </Form.Select>
                </Form.Group>

                <Button
                  variant="outline-secondary"
                  onClick={resetFilters}
                  className="w-100"
                >
                  Reset Filters
                </Button>
              </Form>
            </Card.Body>
          </Card>
        </Col>

        <Col md={9}>
          {loading ? (
            <div className="text-center py-5">
              <Spinner animation="border" role="status" variant="primary">
                <span className="visually-hidden">Loading...</span>
              </Spinner>
              <p className="mt-3">Loading products...</p>
            </div>
          ) : error ? (
            <div className="text-center py-5">
              <p className="text-danger">{error}</p>
            </div>
          ) : filteredProducts.length === 0 ? (
            <div className="text-center py-5">
              <p>No products found matching your filters. Try adjusting your search criteria.</p>
            </div>
          ) : (
            <Row>
              {filteredProducts.map((product) => (
                <Col md={4} className="mb-4" key={product._id}>
                  <Card className="h-100 shadow-sm border-0 product-card">
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
                      <Card.Text className="fw-bold text-primary mb-2">
                        ${product.price.toFixed(2)}
                      </Card.Text>
                      <Card.Text className="mb-3">
                        {product.description.substring(0, 80)}...
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
        </Col>
      </Row>
    </Container>
  );
};

export default Products; 