const axios = require('axios');

// Base URL for API
const API_BASE_URL = 'http://localhost:5000/api';

// Test endpoints
async function testEndpoints() {
  console.log('Testing API endpoints...');
  
  try {
    // Test auth route
    console.log('\n1. Testing auth API...');
    const authResponse = await axios.get(`${API_BASE_URL}/auth`);
    console.log('Auth API Response:', authResponse.data);
    
    // Test login with default user
    console.log('\n2. Testing login...');
    const loginResponse = await axios.post(`${API_BASE_URL}/auth/login`, {
      email: 'user@example.com',
      password: 'password123'
    });
    console.log('Login Response:', loginResponse.data);
    
    // If login successful, get token
    let token = null;
    if (loginResponse.data.success && loginResponse.data.token) {
      token = loginResponse.data.token;
      console.log('Login successful! Token received.');
    } else {
      console.log('Login failed. Check credentials or server logs.');
    }
    
    // Test products endpoint
    console.log('\n3. Testing products API...');
    const productsResponse = await axios.get(`${API_BASE_URL}/products`);
    console.log('Products API Response:', productsResponse.data);
    
    // Test protected route if we have token
    if (token) {
      console.log('\n4. Testing protected route (get me)...');
      const meResponse = await axios.get(`${API_BASE_URL}/auth/me`, {
        headers: {
          'Authorization': `Bearer ${token}`
        }
      });
      console.log('Get Me Response:', meResponse.data);
    }
    
  } catch (error) {
    console.error('API Test Error:', error.message);
    if (error.response) {
      console.log('Error Response Data:', error.response.data);
      console.log('Error Response Status:', error.response.status);
    }
    console.log('Check if server is running on port 5000');
  }
}

testEndpoints(); 