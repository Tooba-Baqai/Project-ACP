import { useState, useEffect } from 'react';
import { Container, Card, Button } from 'react-bootstrap';
import { useAuth } from '../context/AuthContext';
import jwt_decode from 'jwt-decode';

const Debug = () => {
  const { token, currentUser, isAuthenticated, isAdmin } = useAuth();
  const [decodedToken, setDecodedToken] = useState(null);
  
  useEffect(() => {
    if (token) {
      try {
        const decoded = jwt_decode(token);
        setDecodedToken(decoded);
      } catch (error) {
        console.error('Error decoding token:', error);
        setDecodedToken({ error: 'Invalid token' });
      }
    }
  }, [token]);
  
  const refreshPage = () => {
    window.location.reload();
  };

  return (
    <Container className="py-5 mt-5">
      <h1>Auth Debug Page</h1>
      
      <Card className="mb-4">
        <Card.Header>Authentication Status</Card.Header>
        <Card.Body>
          <p><strong>Is Authenticated:</strong> {isAuthenticated ? 'Yes' : 'No'}</p>
          <p><strong>Is Admin:</strong> {isAdmin ? 'Yes' : 'No'}</p>
        </Card.Body>
      </Card>
      
      <Card className="mb-4">
        <Card.Header>Current User</Card.Header>
        <Card.Body>
          {currentUser ? (
            <div>
              <p><strong>Name:</strong> {currentUser.name}</p>
              <p><strong>Email:</strong> {currentUser.email}</p>
              <p><strong>Role:</strong> {currentUser.role}</p>
              <p><strong>ID:</strong> {currentUser.id}</p>
            </div>
          ) : (
            <p>No user logged in</p>
          )}
        </Card.Body>
      </Card>
      
      <Card className="mb-4">
        <Card.Header>JWT Token</Card.Header>
        <Card.Body>
          {token ? (
            <>
              <p style={{ wordBreak: 'break-all' }}><strong>Token:</strong> {token}</p>
              <hr />
              <h5>Decoded Token:</h5>
              <pre>{JSON.stringify(decodedToken, null, 2)}</pre>
            </>
          ) : (
            <p>No token found</p>
          )}
        </Card.Body>
      </Card>
      
      <Button onClick={refreshPage} variant="primary">Refresh Page</Button>
    </Container>
  );
};

export default Debug; 