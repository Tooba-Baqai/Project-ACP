import { createContext, useContext, useState, useEffect } from 'react';
import axios from 'axios';
import { toast } from 'react-toastify';
import jwt_decode from 'jwt-decode';

const AuthContext = createContext();

export const useAuth = () => useContext(AuthContext);

export const AuthProvider = ({ children }) => {
  const [currentUser, setCurrentUser] = useState(null);
  const [token, setToken] = useState(localStorage.getItem('token') || null);
  const [loading, setLoading] = useState(true);
  const [apiReady, setApiReady] = useState(true);
  const [isAdmin, setIsAdmin] = useState(false);

  // Use a direct API configuration with fixed URL
  const [api] = useState(() => {
    // Create the API instance with fixed URLs to try
    // Note: The server needs to be accessible from the client's origin 
    const serverUrls = [
      'http://localhost:5000/api',  // Standard (now first priority)
      'http://127.0.0.1:5000/api',  // Using IP
      'http://localhost:5001/api',  // Alternative port
      'http://127.0.0.1:5001/api',  // Alternative port with IP
      'http://localhost:5002/api',  // Another alternative
      'http://localhost:5173/api'   // Client-side port (typically used for Vite)
    ];
    
    const instance = axios.create({
      baseURL: serverUrls[0], // Start with first URL
      headers: {
        'Content-Type': 'application/json',
        'Accept': 'application/json'
      },
      withCredentials: true, // Changed to true to match server CORS config
      timeout: 15000 // Increased timeout for better reliability
    });
    
    // Try each URL in sequence for any request that fails with connection error
    instance.interceptors.response.use(
      response => response,
      async error => {
        if (error.message.includes('Network Error') || error.code === 'ECONNABORTED') {
          const originalRequest = error.config;
          
          // Don't retry if we've already tried all URLs
          if (originalRequest._retryCount >= serverUrls.length) {
            return Promise.reject(error);
          }
          
          // Initialize retry count if not set
          if (!originalRequest._retryCount) {
            originalRequest._retryCount = 0;
          }
          
          // Increment retry count
          originalRequest._retryCount++;
          
          // Try next server URL
          const nextUrlIndex = originalRequest._retryCount % serverUrls.length;
          instance.defaults.baseURL = serverUrls[nextUrlIndex];
          originalRequest.baseURL = serverUrls[nextUrlIndex];
          
          console.log(`Retrying with next server URL: ${instance.defaults.baseURL}`);
          
          return instance(originalRequest);
        }
        return Promise.reject(error);
      }
    );
    
    console.log('API instance created with baseURL:', instance.defaults.baseURL);
    
    return instance;
  });

  // Add token to header
  api.interceptors.request.use(
    (config) => {
      const currentToken = localStorage.getItem('token');
      if (currentToken) {
        config.headers.Authorization = `Bearer ${currentToken}`;
        console.log('Added auth token to request header');
      } else {
        console.log('No token available for request');
      }
      return config;
    },
    (error) => {
      return Promise.reject(error);
    }
  );

  // Check token expiration
  const isTokenExpired = (token) => {
    try {
      const decoded = jwt_decode(token);
      const currentTime = Date.now() / 1000;
      return decoded.exp < currentTime;
    } catch (error) {
      console.error('Error decoding token:', error);
      return true;
    }
  };

  // Load user data based on token
  useEffect(() => {
    const loadUser = async () => {
      if (token && !isTokenExpired(token)) {
        try {
          console.log('Loading user data with token');
          const res = await api.get('/auth/me');
          console.log('User data loaded:', res.data);
          
          // Check for role and set isAdmin accordingly
          const userData = res.data.data;
          setCurrentUser(userData);
          
          console.log('Current user role:', userData.role);
          
          // Force synchronize isAdmin with role to ensure consistency
          const isUserAdmin = userData.role === 'admin';
          console.log(`Setting isAdmin to ${isUserAdmin ? 'true' : 'false'} - user role is ${userData.role}`);
          setIsAdmin(isUserAdmin);
        } catch (error) {
          console.error('Error loading user:', error.response?.data || error.message);
          localStorage.removeItem('token');
          setToken(null);
          setCurrentUser(null);
          setIsAdmin(false);
        }
      } else if (token && isTokenExpired(token)) {
        console.log('Token expired, clearing user data');
        localStorage.removeItem('token');
        setToken(null);
        setCurrentUser(null);
        setIsAdmin(false);
      }
      setLoading(false);
    };

    loadUser();
  }, [token]);

  // Register user
  const register = async (userData) => {
    try {
      console.log('Attempting to register with data:', {
        ...userData,
        password: '*****' // Don't log actual password
      });
      
      if (!apiReady) {
        console.error('API not ready, cannot register');
        toast.error('Server connection not established. Please refresh the page and try again.');
        throw new Error('API not ready');
      }
      
      // Validate required fields on client side first
      if (!userData.name || !userData.email || !userData.password) {
        const message = 'Required fields missing';
        toast.error(message);
        throw new Error(message);
      }
      
      // Get the current baseURL
      const currentUrl = api.defaults.baseURL;
      
      const res = await api.post('/auth/register', userData);
      console.log('Registration successful, server response:', res.data);
      
      // Do NOT set token and user data after registration
      // This forces the user to explicitly log in
      // This is the key change to fix the admin redirection issue
      
      toast.success('Registration successful! Please log in.');
      return res.data;
    } catch (error) {
      console.error('Registration error:', error);
      
      if (error.response) {
        console.error('Error status:', error.response.status);
        console.error('Error data:', error.response.data);
        const message = error.response.data?.message || 'Registration failed';
        toast.error(message);
      } else if (error.request) {
        // Request was made but no response received
        console.error('No response received:', error.request);
        toast.error('No response from server. Please check your connection.');
      } else {
        // Something else caused the error
        console.error('Error message:', error.message);
        toast.error(error.message || 'Registration failed. Please try again.');
      }
      
      throw error;
    }
  };

  // Login user
  const login = async (userData) => {
    try {
      console.log('Login attempt with:', { email: userData.email, password: '******' });
      
      if (!apiReady) {
        console.error('API not ready, cannot login');
        toast.error('Server connection not established. Please refresh the page and try again.');
        throw new Error('API not ready');
      }
      
      const res = await api.post('/auth/login', userData);
      console.log('Login successful, response:', res.data);
      
      // Check if response is valid
      if (!res.data || !res.data.success) {
        console.error('Invalid login response structure:', res.data);
        toast.error('Invalid server response. Please try again.');
        throw new Error('Invalid response structure');
      }
      
      // Check if user and role were returned
      if (!res.data.user) {
        console.error('No user object in login response');
        setIsAdmin(false);
        toast.error('User data missing in response. Please try again.');
        throw new Error('No user data in response');
      } else {
        const userRole = res.data.user.role;
        console.log('User role from login:', userRole);
        
        // Explicitly check and sync admin role
        const isUserAdmin = userRole === 'admin';
        console.log(`Setting isAdmin to ${isUserAdmin ? 'true' : 'false'} - user role is ${userRole}`);
        setIsAdmin(isUserAdmin);
      }
      
      // Set token and user data
      setToken(res.data.token);
      localStorage.setItem('token', res.data.token);
      setCurrentUser(res.data.user);
      
      toast.success('Login successful!');
      return res.data;
    } catch (error) {
      console.error('Login error:', error);
      if (error.response) {
        console.error('Response status:', error.response.status);
        console.error('Response data:', error.response.data);
        const message = error.response.data?.message || 'Invalid credentials';
        toast.error(message);
      } else if (error.request) {
        // Request was made but no response received
        console.error('No response received:', error.request);
        toast.error('No response from server. Please check your connection.');
      } else {
        // Something else caused the error
        console.error('Error message:', error.message);
        toast.error(error.message || 'Login failed. Please try again.');
      }
      throw error;
    }
  };

  // Logout user
  const logout = () => {
    localStorage.removeItem('token');
    setToken(null);
    setCurrentUser(null);
    setIsAdmin(false);
    toast.success('Logout successful!');
  };

  // Update user information
  const updateUserInfo = (userData) => {
    console.log('Updating user data in context:', userData);
    setCurrentUser(userData);
    setIsAdmin(userData.role === 'admin');
    toast.success('Profile updated successfully!');
  };

  // Context value
  const value = {
    currentUser,
    token,
    loading,
    api,
    register,
    login,
    logout,
    updateUserInfo,
    isAuthenticated: !!token && !isTokenExpired(token),
    isAdmin
  };

  console.log('Auth context current state:', {
    authenticated: !!token && !isTokenExpired(token),
    isAdmin: isAdmin,
    userRole: currentUser?.role,
    currentUser: currentUser ? {
      id: currentUser.id,
      name: currentUser.name,
      email: currentUser.email,
      role: currentUser.role
    } : null
  });

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}; 