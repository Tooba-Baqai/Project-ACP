import { useState, useEffect } from 'react';
import { useNavigate, Link, useLocation } from 'react-router-dom';
import { Container, Row, Col, Card, Table, Button, Badge } from 'react-bootstrap';
import { useAuth } from '../context/AuthContext';

const AdminDashboard = () => {
  const { currentUser, isAdmin, api } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();
  
  const [stats, setStats] = useState({
    totalUsers: 0,
    totalProducts: 0,
    totalOrders: 0,
    pendingOrders: 0
  });
  
  const [recentOrders, setRecentOrders] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!currentUser) {
      navigate('/login');
    } else if (!isAdmin) {
      navigate('/profile'); 
    }
  }, [currentUser, isAdmin, navigate]);

  useEffect(() => {
    const fetchDashboardData = async () => {
      if (!currentUser || !isAdmin) return;
      
      try {
        setLoading(true);
        
        const usersRes = await api.get('/auth/users');
        const users = usersRes.data?.data || [];
        
        const productsRes = await api.get('/products');
        const products = productsRes.data?.data || [];
        
        const ordersRes = await api.get('/orders');
        const orders = ordersRes.data?.data || [];
      
        setStats({
          totalUsers: users.length,
          totalProducts: products.length,
          totalOrders: orders.length,
          pendingOrders: orders.filter(order => order.status === 'pending').length
        });
        
        setRecentOrders(orders.slice(0, 5));
        
      } catch (error) {
        console.error('Error fetching admin dashboard data:', error);
      } finally {
        setLoading(false);
      }
    };
    
    fetchDashboardData();
  }, [api, currentUser, isAdmin]);

  const formatDate = (dateString) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric'
    });
  };
  
  if (!currentUser || !isAdmin) {
    return null;
  }

  return (
    <Container fluid className="py-4">
      <h2 className="mb-4">Admin Dashboard</h2>
      
      {}
      <Row className="mb-4">
        <Col md={3} className="mb-3 mb-md-0">
          <Card className="text-center h-100 shadow-sm">
            <Card.Body>
              <div className="display-4 text-primary mb-2">{stats.totalUsers}</div>
              <Card.Title>Total Users</Card.Title>
            </Card.Body>
            <Card.Footer>
              <Button 
                as={Link} 
                to="/admin/users" 
                variant="outline-primary" 
                size="sm" 
                className="w-100"
              >
                Manage Users
              </Button>
            </Card.Footer>
          </Card>
        </Col>
        
        <Col md={3} className="mb-3 mb-md-0">
          <Card className="text-center h-100 shadow-sm">
            <Card.Body>
              <div className="display-4 text-success mb-2">{stats.totalProducts}</div>
              <Card.Title>Products</Card.Title>
            </Card.Body>
            <Card.Footer>
              <Button 
                as={Link} 
                to="/admin/products" 
                variant="outline-success" 
                size="sm" 
                className="w-100"
              >
                Manage Products
              </Button>
            </Card.Footer>
          </Card>
        </Col>
        
        <Col md={3} className="mb-3 mb-md-0">
          <Card className="text-center h-100 shadow-sm">
            <Card.Body>
              <div className="display-4 text-info mb-2">{stats.totalOrders}</div>
              <Card.Title>Total Orders</Card.Title>
            </Card.Body>
            <Card.Footer>
              <Button 
                as={Link} 
                to="/admin/orders" 
                variant="outline-info" 
                size="sm" 
                className="w-100"
              >
                View All Orders
              </Button>
            </Card.Footer>
          </Card>
        </Col>
        
        <Col md={3}>
          <Card className="text-center h-100 shadow-sm">
            <Card.Body>
              <div className="display-4 text-warning mb-2">{stats.pendingOrders}</div>
              <Card.Title>Pending Orders</Card.Title>
            </Card.Body>
            <Card.Footer>
              <Button 
                as={Link} 
                to="/admin/orders?status=pending" 
                variant="outline-warning" 
                size="sm" 
                className="w-100"
              >
                Process Orders
              </Button>
            </Card.Footer>
          </Card>
        </Col>
      </Row>
      
      {}
      <Row className="mb-4">
        <Col md={12}>
          <Card className="shadow-sm">
            <Card.Header className="bg-white d-flex justify-content-between align-items-center">
              <h5 className="mb-0">Recent Orders</h5>
              <Button 
                as={Link} 
                to="/admin/orders" 
                variant="primary" 
                size="sm"
              >
                View All
              </Button>
            </Card.Header>
            <Card.Body>
              {loading ? (
                <div className="text-center py-5">
                  <div className="spinner-border text-primary" role="status">
                    <span className="visually-hidden">Loading...</span>
                  </div>
                </div>
              ) : recentOrders.length > 0 ? (
                <Table responsive hover>
                  <thead>
                    <tr>
                      <th>Order ID</th>
                      <th>Customer</th>
                      <th>Product</th>
                      <th>Date</th>
                      <th>Amount</th>
                      <th>Status</th>
                      <th>Action</th>
                    </tr>
                  </thead>
                  <tbody>
                    {recentOrders.map(order => (
                      <tr key={order._id}>
                        <td>#{order._id.substring(0, 6)}</td>
                        <td>{order.user?.name || 'N/A'}</td>
                        <td>{order.product?.name || 'N/A'}</td>
                        <td>{formatDate(order.createdAt)}</td>
                        <td>₹{order.totalAmount || 0}</td>
                        <td>
                          <Badge bg={
                            order.status === 'delivered' ? 'success' :
                            order.status === 'processing' ? 'primary' :
                            'warning'
                          }>
                            {order.status}
                          </Badge>
                        </td>
                        <td>
                          <Button 
                            as={Link}
                            to={`/admin/orders/${order._id}`}
                            variant="outline-secondary"
                            size="sm"
                          >
                            Details
                          </Button>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </Table>
              ) : (
                <div className="text-center py-5">
                  <p className="mb-0">No orders found</p>
                </div>
              )}
            </Card.Body>
          </Card>
        </Col>
      </Row>
      
      {}
      <Row>
        <Col md={12}>
          <Card className="shadow-sm">
            <Card.Header className="bg-white">
              <h5 className="mb-0">Quick Actions</h5>
            </Card.Header>
            <Card.Body>
              <Row>
                <Col md={3} className="mb-3 mb-md-0">
                  <Button 
                    as={Link}
                    to="/admin/products"
                    variant="outline-primary"
                    className="w-100 py-3"
                  >
                    <i className="fa fa-plus-circle mb-2 d-block fs-4"></i>
                    Add New Product
                  </Button>
                </Col>
                
                <Col md={3} className="mb-3 mb-md-0">
                  <Button 
                    as={Link}
                    to="/admin/orders"
                    variant="outline-success"
                    className="w-100 py-3"
                  >
                    <i className="fa fa-shipping-fast mb-2 d-block fs-4"></i>
                    Manage Orders
                  </Button>
                </Col>
                
                <Col md={3} className="mb-3 mb-md-0">
                  <Button 
                    as={Link}
                    to="/admin/users"
                    variant="outline-info"
                    className="w-100 py-3"
                  >
                    <i className="fa fa-users mb-2 d-block fs-4"></i>
                    Manage Users
                  </Button>
                </Col>
                
                <Col md={3}>
                  <Button 
                    as={Link}
                    to="/admin/contacts"
                    variant="outline-warning"
                    className="w-100 py-3"
                  >
                    <i className="fa fa-envelope mb-2 d-block fs-4"></i>
                    View Messages
                  </Button>
                </Col>
              </Row>
            </Card.Body>
          </Card>
        </Col>
      </Row>
    </Container>
  );
};

export default AdminDashboard; 