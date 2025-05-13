import { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { Container, Row, Col, Card, Form, Button, Alert } from 'react-bootstrap';
import { useAuth } from '../context/AuthContext';
import axios from 'axios'; 

const Login = () => {
  const [formData, setFormData] = useState({
    email: '',
    password: ''
  });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [serverStatus, setServerStatus] = useState('');
  const { login, currentUser, isAdmin } = useAuth();
  const navigate = useNavigate();

  const { email, password } = formData;

  useEffect(() => {
    const testServerConnection = async () => {
      setServerStatus('Checking server connection...');
      try {
        const serverUrls = [
          'http://localhost:5000/api/auth/test',
          'http://localhost:5001/api/auth/test',
          'http://localhost:5002/api/auth/test'
        ];
        
        let connected = false;
        for (const url of serverUrls) {
          try {
            await axios.get(url.replace('/test', ''), { 
              timeout: 3000,
              withCredentials: true 
            });
            console.log(`Server connection successful to ${url}`);
            connected = true;
            setServerStatus(`Server connected at ${url}`);
            break;
          } catch (err) {
            console.log(`Failed to connect to ${url}:`, err.message);
          }
        }
        
        if (!connected) {
          setServerStatus('Could not connect to any server. Please check if the server is running.');
        }
      } catch (err) {
        setServerStatus(`Server connection failed: ${err.message}`);
      }
    };
    
    testServerConnection();
  }, []);

  useEffect(() => {
    if (currentUser) {
      if (currentUser.role === 'admin') {
        navigate('/admin');
      } else {
        navigate('/'); 
      }
    }
  }, [currentUser, navigate]);

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
    setError(''); 
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setLoading(true);
    
    if (!email || !password) {
      setError('Please enter both email and password');
      setLoading(false);
      return;
    }
    
    console.log('Attempting login with email:', email);

    try {
      const loginPromise = login(formData);
      
      const timeoutPromise = new Promise((_, reject) => {
        setTimeout(() => reject(new Error('Login request timed out after 15 seconds')), 15000);
      });
      
      const response = await Promise.race([loginPromise, timeoutPromise]);
      
      console.log('Login response received:', response);
      
      if (!response || !response.success) {
        console.error('Invalid response structure:', response);
        setError('Invalid response from server. Please try again.');
        setLoading(false);
        return;
      }
      
      if (!response.user || !response.user.role) {
        console.error('Missing user data in response:', response);
        setError('Invalid response from server. Missing user data.');
        setLoading(false);
        return;
      }
      
      console.log('User role:', response.user.role);

      setTimeout(() => {
        if (response.user.role === 'admin') {
          console.log('Redirecting admin to admin dashboard');
          navigate('/admin');
        } else {
          console.log('Redirecting regular user to home page');
          navigate('/'); 
        }
      }, 500);
    } catch (error) {
      console.error('Login error:', error);
      
      if (error.message === 'Login request timed out after 15 seconds') {
        setError('Login request timed out. Please check your server connection.');
      } else if (error.response) {
        console.error('Error status:', error.response.status);
        console.error('Error data:', error.response.data);
        setError(error.response.data?.message || 'Login failed. Please try again.');
      } else if (error.request) {
        console.error('No response received:', error.request);
        setError('No response from server. Please check your connection.');
      } else {
        console.error('Error message:', error.message);
        setError(error.message || 'Login failed. Please try again.');
      }
    } finally {
      setLoading(false);
    }
  };

  return (
    <Container className="py-5 mt-5">
      <Row className="justify-content-center">
        <Col md={6}>
          <Card className="shadow-sm border-0">
            <Card.Body className="p-5">
              <h2 className="text-center mb-4">Login</h2>
              
              {error && <Alert variant="danger">{error}</Alert>}
              
              <Form onSubmit={handleSubmit}>
                <Form.Group className="mb-3">
                  <Form.Label>Email Address</Form.Label>
                  <Form.Control
                    type="email"
                    name="email"
                    value={email}
                    onChange={handleChange}
                    placeholder="Enter your email"
                    required
                  />
                </Form.Group>

                <Form.Group className="mb-4">
                  <Form.Label>Password</Form.Label>
                  <Form.Control
                    type="password"
                    name="password"
                    value={password}
                    onChange={handleChange}
                    placeholder="Enter your password"
                    required
                  />
                </Form.Group>

                <Button 
                  variant="primary" 
                  type="submit" 
                  className="w-100 py-2 mb-3"
                  disabled={loading}
                >
                  {loading ? 'Logging in...' : 'Login'}
                </Button>
                
                <div className="text-center">
                  <p className="mb-0">
                    Don't have an account? <Link to="/register">Register</Link>
                  </p>
                </div>
              </Form>
            </Card.Body>
          </Card>
        </Col>
      </Row>
    </Container>
  );
};

export default Login; 