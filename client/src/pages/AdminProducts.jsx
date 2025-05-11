import { useState, useEffect } from 'react';
import { Container, Row, Col, Card, Table, Button, Form, Modal, Alert } from 'react-bootstrap';
import { useAuth } from '../context/AuthContext';

const AdminProducts = () => {
  const { api } = useAuth();
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showAddModal, setShowAddModal] = useState(false);
  const [showEditModal, setShowEditModal] = useState(false);
  const [currentProduct, setCurrentProduct] = useState(null);
  const [searchTerm, setSearchTerm] = useState('');
  const [message, setMessage] = useState({ text: '', type: '' });
  const [productForm, setProductForm] = useState({
    name: '',
    description: '',
    price: '',
    image: '',
    type: 'pottery',
    material: 'clay',
    inStock: true,
  });

  useEffect(() => {
    fetchProducts();
  }, []);

  const fetchProducts = async () => {
    setLoading(true);
    try {
      const res = await api.get('/products');
      setProducts(res.data.data);
    } catch (error) {
      console.error('Error fetching products:', error);
      setMessage({ 
        text: error.response?.data?.message || 'Failed to fetch products', 
        type: 'danger' 
      });
    } finally {
      setLoading(false);
    }
  };

  const handleInputChange = (e) => {
    const { name, value, type, checked } = e.target;
    setProductForm({
      ...productForm,
      [name]: type === 'checkbox' ? checked : value,
    });
  };

  const handleAddProduct = async (e) => {
    e.preventDefault();
    try {
      setLoading(true);
      
      const productData = {
        name: productForm.name.trim(),
        description: productForm.description.trim(),
        price: parseFloat(productForm.price),
        image: productForm.image.trim() || '/images/product-placeholder.jpg',
        type: productForm.type,
        material: productForm.material,
        inStock: productForm.inStock
      };
      
      console.log('Sending product data:', productData);
      
      const requiredFields = ['name', 'description', 'type', 'material', 'price'];
      const missingFields = requiredFields.filter(field => {
        return productData[field] === undefined || productData[field] === '' || 
               (field === 'price' && isNaN(productData[field]));
      });
      
      if (missingFields.length > 0) {
        setMessage({ 
          text: `Missing required fields: ${missingFields.join(', ')}`, 
          type: 'danger' 
        });
        setLoading(false);
        return;
      }
      
      if (isNaN(productData.price) || productData.price <= 0) {
        setMessage({ 
          text: 'Please enter a valid price', 
          type: 'danger' 
        });
        setLoading(false);
        return;
      }

      console.log('Using API with baseURL:', api.defaults.baseURL);
      
      const res = await api.post('/products', productData);
      console.log('Product creation response:', res.data);
      
      if (res.status === 201) {
        await fetchProducts();
        setShowAddModal(false);
        resetForm();
        setMessage({ text: 'Product added successfully!', type: 'success' });
      }
    } catch (error) {
      console.error('Error adding product:', error);
      
      if (error.response) {
        console.error('Response status:', error.response.status);
        console.error('Response data:', error.response.data);
        setMessage({ 
          text: error.response.data?.message || 'Failed to add product', 
          type: 'danger' 
        });
      } else if (error.request) {
        console.error('No response received:', error.request);
        setMessage({ 
          text: 'No response from server. Please check your connection.', 
          type: 'danger' 
        });
      } else {
        console.error('Error message:', error.message);
        setMessage({ 
          text: error.message || 'Failed to add product', 
          type: 'danger' 
        });
      }
    } finally {
      setLoading(false);
    }
  };

  const handleEditProduct = async (e) => {
    e.preventDefault();
    try {
      const productData = {
        name: productForm.name.trim(),
        description: productForm.description.trim(),
        price: parseFloat(productForm.price),
        image: productForm.image.trim() || '/images/product-placeholder.jpg',
        type: productForm.type,
        material: productForm.material,
        inStock: productForm.inStock
      };
      
      console.log('Sending updated product data:', productData);
      
      const requiredFields = ['name', 'description', 'type', 'material', 'price'];
      const missingFields = requiredFields.filter(field => !productData[field]);
      
      if (missingFields.length > 0) {
        setMessage({ 
          text: `Missing required fields: ${missingFields.join(', ')}`, 
          type: 'danger' 
        });
        return;
      }
      
      if (isNaN(productData.price) || productData.price <= 0) {
        setMessage({ 
          text: 'Please enter a valid price', 
          type: 'danger' 
        });
        return;
      }
      
      const res = await api.put(`/products/${currentProduct._id}`, productData);
      console.log('Product update response:', res.data);
      
      if (res.status === 200) {
        setProducts(
          products.map((product) =>
            product._id === currentProduct._id ? res.data.data : product
          )
        );
        setShowEditModal(false);
        resetForm();
        setMessage({ text: 'Product updated successfully!', type: 'success' });
      }
    } catch (error) {
      console.error('Error updating product:', error);
      console.error('Error details:', error.response?.data);
      setMessage({ 
        text: error.response?.data?.message || 'Failed to update product', 
        type: 'danger' 
      });
    }
  };

  const handleDeleteProduct = async (id) => {
    if (window.confirm('Are you sure you want to delete this product?')) {
      try {
        const res = await api.delete(`/products/${id}`);
        if (res.status === 200) {
          setProducts(products.filter((product) => product._id !== id));
          setMessage({ text: 'Product deleted successfully!', type: 'success' });
        }
      } catch (error) {
        console.error('Error deleting product:', error);
        setMessage({ 
          text: error.response?.data?.message || 'Failed to delete product', 
          type: 'danger' 
        });
      }
    }
  };

  const openEditModal = (product) => {
    setCurrentProduct(product);
    setProductForm({
      name: product.name,
      description: product.description,
      price: product.price.toString(),
      image: product.image,
      type: product.type,
      material: product.material,
      inStock: product.inStock
    });
    setShowEditModal(true);
  };

  const resetForm = () => {
    setProductForm({
      name: '',
      description: '',
      price: '',
      image: '',
      type: 'pottery',
      material: 'clay',
      inStock: true,
    });
    setCurrentProduct(null);
  };

  const filteredProducts = products.filter(
    (product) =>
      product.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      product.type.toLowerCase().includes(searchTerm.toLowerCase()) ||
      product.material.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <div className="admin-products-page">
      <Container className="py-5 mt-5">
        <Card className="border-0 shadow-sm">
          <Card.Header className="bg-white py-3">
            <div className="d-flex justify-content-between align-items-center">
              <h1 className="h3 mb-0">Product Management</h1>
              <Button variant="primary" onClick={() => setShowAddModal(true)}>
                <i className="fas fa-plus me-2"></i> Add Product
              </Button>
            </div>
          </Card.Header>
          <Card.Body>
            {message.text && (
              <Alert variant={message.type} dismissible onClose={() => setMessage({ text: '', type: '' })}>
                {message.text}
              </Alert>
            )}

            {}
            <Row className="mb-3">
              <Col md={6} lg={4}>
                <Form.Group>
                  <Form.Control 
                    type="text" 
                    placeholder="Search products..." 
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                  />
                </Form.Group>
              </Col>
            </Row>

            {}
            {loading ? (
              <div className="text-center py-5">
                <div className="spinner-border text-primary" role="status">
                  <span className="visually-hidden">Loading...</span>
                </div>
                <p className="mt-3">Loading products...</p>
              </div>
            ) : (
              <>
                {filteredProducts.length > 0 ? (
                  <div className="table-responsive">
                    <Table hover className="align-middle">
                      <thead>
                        <tr>
                          <th style={{ width: '80px' }}>Image</th>
                          <th>Name</th>
                          <th>Type</th>
                          <th>Material</th>
                          <th>Price</th>
                          <th>Stock</th>
                          <th style={{ width: '150px' }}>Actions</th>
                        </tr>
                      </thead>
                      <tbody>
                        {filteredProducts.map((product) => (
                          <tr key={product._id}>
                            <td>
                              <img 
                                src={product.image} 
                                alt={product.name} 
                                className="img-thumbnail" 
                                style={{ width: '50px', height: '50px', objectFit: 'cover' }}
                              />
                            </td>
                            <td>{product.name}</td>
                            <td>{product.type}</td>
                            <td>{product.material}</td>
                            <td>${product.price.toFixed(2)}</td>
                            <td>
                              <span className={`badge bg-${product.inStock ? 'success' : 'danger'}`}>
                                {product.inStock ? 'In Stock' : 'Out of Stock'}
                              </span>
                            </td>
                            <td>
                              <Button 
                                variant="outline-primary" 
                                size="sm" 
                                className="me-2"
                                onClick={() => openEditModal(product)}
                              >
                                <i className="fas fa-edit"></i>
                              </Button>
                              <Button 
                                variant="outline-danger" 
                                size="sm"
                                onClick={() => handleDeleteProduct(product._id)}
                              >
                                <i className="fas fa-trash"></i>
                              </Button>
                            </td>
                          </tr>
                        ))}
                      </tbody>
                    </Table>
                  </div>
                ) : (
                  <div className="text-center py-5">
                    <i className="fas fa-box-open text-muted fa-3x mb-3"></i>
                    <h5>No products found</h5>
                    <p className="text-muted">
                      {searchTerm 
                        ? `No products match "${searchTerm}". Try a different search term.` 
                        : "There are no products yet. Click 'Add Product' to create one."}
                    </p>
                  </div>
                )}
              </>
            )}
          </Card.Body>
        </Card>
      </Container>

      {}
      <Modal show={showAddModal} onHide={() => setShowAddModal(false)} size="lg">
        <Modal.Header closeButton>
          <Modal.Title>Add New Product</Modal.Title>
        </Modal.Header>
        <Form onSubmit={handleAddProduct}>
          <Modal.Body>
            <Row>
              <Col md={6} className="mb-3">
                <Form.Group controlId="name">
                  <Form.Label>Product Name</Form.Label>
                  <Form.Control
                    type="text"
                    name="name"
                    value={productForm.name}
                    onChange={handleInputChange}
                    required
                  />
                </Form.Group>
              </Col>
              <Col md={6} className="mb-3">
                <Form.Group controlId="price">
                  <Form.Label>Price</Form.Label>
                  <Form.Control
                    type="number"
                    step="0.01"
                    min="0"
                    name="price"
                    value={productForm.price}
                    onChange={handleInputChange}
                    required
                  />
                </Form.Group>
              </Col>
            </Row>

            <Row>
              <Col md={6} className="mb-3">
                <Form.Group controlId="type">
                  <Form.Label>Type</Form.Label>
                  <Form.Select
                    name="type"
                    value={productForm.type}
                    onChange={handleInputChange}
                    required
                  >
                    <option value="">Select Type</option>
                    <option value="vase">Vase</option>
                    <option value="pottery">Pottery</option>
                    <option value="clay plate">Clay Plate</option>
                    <option value="clay matka">Clay Matka</option>
                    <option value="blue pottery">Blue Pottery</option>
                    <option value="showpiece">Showpiece</option>
                  </Form.Select>
                </Form.Group>
              </Col>
              <Col md={6} className="mb-3">
                <Form.Group controlId="material">
                  <Form.Label>Material</Form.Label>
                  <Form.Select
                    name="material"
                    value={productForm.material}
                    onChange={handleInputChange}
                    required
                  >
                    <option value="">Select Material</option>
                    <option value="clay">Clay</option>
                    <option value="ceramic">Ceramic</option>
                  </Form.Select>
                </Form.Group>
              </Col>
            </Row>

            <Row>
              <Col md={6} className="mb-3">
                <Form.Group controlId="inStock">
                  <Form.Check 
                    type="checkbox"
                    label="Product is in stock"
                    name="inStock"
                    checked={productForm.inStock}
                    onChange={handleInputChange}
                  />
                </Form.Group>
              </Col>
              <Col md={6} className="mb-3">
                <Form.Group controlId="image">
                  <Form.Label>Image URL</Form.Label>
                  <Form.Control
                    type="text"
                    name="image"
                    value={productForm.image}
                    onChange={handleInputChange}
                    required
                  />
                </Form.Group>
              </Col>
            </Row>

            <Form.Group className="mb-3" controlId="description">
              <Form.Label>Description</Form.Label>
              <Form.Control
                as="textarea"
                rows={3}
                name="description"
                value={productForm.description}
                onChange={handleInputChange}
                required
              />
            </Form.Group>
          </Modal.Body>
          <Modal.Footer>
            <Button variant="secondary" onClick={() => setShowAddModal(false)}>
              Cancel
            </Button>
            <Button variant="primary" type="submit">
              Add Product
            </Button>
          </Modal.Footer>
        </Form>
      </Modal>

      {}
      <Modal show={showEditModal} onHide={() => setShowEditModal(false)} size="lg">
        <Modal.Header closeButton>
          <Modal.Title>Edit Product</Modal.Title>
        </Modal.Header>
        <Form onSubmit={handleEditProduct}>
          <Modal.Body>
            <Row>
              <Col md={6} className="mb-3">
                <Form.Group controlId="edit-name">
                  <Form.Label>Product Name</Form.Label>
                  <Form.Control
                    type="text"
                    name="name"
                    value={productForm.name}
                    onChange={handleInputChange}
                    required
                  />
                </Form.Group>
              </Col>
              <Col md={6} className="mb-3">
                <Form.Group controlId="edit-price">
                  <Form.Label>Price</Form.Label>
                  <Form.Control
                    type="number"
                    step="0.01"
                    min="0"
                    name="price"
                    value={productForm.price}
                    onChange={handleInputChange}
                    required
                  />
                </Form.Group>
              </Col>
            </Row>

            <Row>
              <Col md={6} className="mb-3">
                <Form.Group controlId="edit-type">
                  <Form.Label>Type</Form.Label>
                  <Form.Select
                    name="type"
                    value={productForm.type}
                    onChange={handleInputChange}
                    required
                  >
                    <option value="">Select Type</option>
                    <option value="vase">Vase</option>
                    <option value="pottery">Pottery</option>
                    <option value="clay plate">Clay Plate</option>
                    <option value="clay matka">Clay Matka</option>
                    <option value="blue pottery">Blue Pottery</option>
                    <option value="showpiece">Showpiece</option>
                  </Form.Select>
                </Form.Group>
              </Col>
              <Col md={6} className="mb-3">
                <Form.Group controlId="edit-material">
                  <Form.Label>Material</Form.Label>
                  <Form.Select
                    name="material"
                    value={productForm.material}
                    onChange={handleInputChange}
                    required
                  >
                    <option value="">Select Material</option>
                    <option value="clay">Clay</option>
                    <option value="ceramic">Ceramic</option>
                  </Form.Select>
                </Form.Group>
              </Col>
            </Row>

            <Row>
              <Col md={6} className="mb-3">
                <Form.Group controlId="edit-inStock">
                  <Form.Check 
                    type="checkbox"
                    label="Product is in stock"
                    name="inStock"
                    checked={productForm.inStock}
                    onChange={handleInputChange}
                  />
                </Form.Group>
              </Col>
              <Col md={6} className="mb-3">
                <Form.Group controlId="edit-image">
                  <Form.Label>Image URL</Form.Label>
                  <Form.Control
                    type="text"
                    name="image"
                    value={productForm.image}
                    onChange={handleInputChange}
                    required
                  />
                </Form.Group>
              </Col>
            </Row>

            <Form.Group className="mb-3" controlId="edit-description">
              <Form.Label>Description</Form.Label>
              <Form.Control
                as="textarea"
                rows={3}
                name="description"
                value={productForm.description}
                onChange={handleInputChange}
                required
              />
            </Form.Group>
          </Modal.Body>
          <Modal.Footer>
            <Button variant="secondary" onClick={() => setShowEditModal(false)}>
              Cancel
            </Button>
            <Button variant="primary" type="submit">
              Update Product
            </Button>
          </Modal.Footer>
        </Form>
      </Modal>
    </div>
  );
};

export default AdminProducts; 