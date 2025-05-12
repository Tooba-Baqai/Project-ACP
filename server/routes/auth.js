const express = require('express');
const { 
  register, 
  login, 
  getMe, 
  logout, 
  getUsers, 
  updateProfile, 
  deleteUser,
  changePassword 
} = require('../controllers/auth');
const { protect, authorize } = require('../middleware/auth');

const router = express.Router();

// Test route to check API connectivity
router.get('/', (req, res) => {
  res.json({
    success: true,
    message: 'Auth API is working'
  });
});

// Public routes
router.post('/register', register);
router.post('/login', login);
router.get('/logout', logout);

// Protected routes
router.get('/me', protect, getMe);
router.put('/profile', protect, updateProfile);
router.put('/password', protect, changePassword);

// Admin routes
router.get('/users', protect, authorize('admin'), getUsers);
router.delete('/users/:id', protect, authorize('admin'), deleteUser);

module.exports = router; 