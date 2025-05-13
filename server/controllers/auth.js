const User = require('../models/User');

exports.register = async (req, res) => {
  try {
    console.log('Registration attempt with data:', {
      ...req.body,
      password: '******' 
    });

    const { name, email, password } = req.body;
    if (!name || !email || !password) {
      return res.status(400).json({
        success: false,
        message: 'Please provide all required fields (name, email, password)'
      });
    }
    if (password.length < 6) {
      return res.status(400).json({
        success: false,
        message: 'Password must be at least 6 characters'
      });
    }

    const userExists = await User.findOne({ email });

    if (userExists) {
      console.log('Registration failed: Email already exists:', email);
      return res.status(400).json({
        success: false,
        message: 'Email already in use. Please choose another email address.'
      });
    }
    const userData = {
      name,
      email,
      password,
      phone: req.body.phone || '',
      address: req.body.address || '',
      role: 'user' 
    };

    console.log('Creating new user with email:', email);
    const user = await User.create(userData);

    console.log('User created successfully:', user._id);
    
    const userResponse = {
      id: user._id,
      name: user.name,
      email: user.email,
      role: user.role
    };

    const token = user.getSignedJwtToken();
    
    res.status(201).json({
      success: true,
      token,
      user: userResponse
    });
  } catch (error) {
    console.error('Registration error:', error);
    res.status(500).json({
      success: false,
      message: 'Server Error during registration. Please try again later.',
      error: error.message
    });
  }
};

exports.login = async (req, res) => {
  try {
    const { email, password } = req.body;

    console.log('Login attempt with email:', email);

    if (!email || !password) {
      return res.status(400).json({
        success: false,
        message: 'Please provide both email and password'
      });
    }

    const user = await User.findOne({ email }).select('+password');

    if (!user) {
      console.log('Login failed: User not found with email:', email);
      return res.status(401).json({
        success: false,
        message: 'Invalid credentials. Please check your email and password.'
      });
    }

    const isMatch = await user.matchPassword(password);

    if (!isMatch) {
      console.log('Login failed: Invalid password for user:', email);
      return res.status(401).json({
        success: false,
        message: 'Invalid credentials. Please check your email and password.'
      });
    }

    console.log('Login successful for user:', email);
    sendTokenResponse(user, 200, res);
  } catch (error) {
    console.error('Login error:', error);
    res.status(500).json({
      success: false,
      message: 'Server Error during login. Please try again later.',
      error: error.message
    });
  }
};

exports.getMe = async (req, res) => {
  try {
    console.log('getMe endpoint called for user ID:', req.user.id);
    
    const user = await User.findById(req.user.id);
    
    if (!user) {
      console.log('User not found in database for ID:', req.user.id);
      return res.status(404).json({
        success: false,
        message: 'User not found'
      });
    }
    
    console.log('User found with role:', user.role);
    
    res.status(200).json({
      success: true,
      data: {
        id: user._id,
        name: user.name,
        email: user.email,
        role: user.role,
        phone: user.phone,
        address: user.address,
        createdAt: user.createdAt
      }
    });
  } catch (error) {
    console.error('getMe error:', error);
    res.status(500).json({
      success: false,
      message: 'Server Error',
      error: error.message
    });
  }
};

exports.logout = async (req, res) => {
  res.status(200).json({
    success: true,
    message: 'User logged out successfully'
  });
};

exports.getUsers = async (req, res) => {
  try {
    console.log('Getting all users by admin user:', req.user.id);
    
    if (req.user.role !== 'admin') {
      return res.status(403).json({
        success: false,
        message: 'Not authorized to access user list'
      });
    }
    
    const users = await User.find();
    
    res.status(200).json({
      success: true,
      count: users.length,
      data: users.map(user => ({
        _id: user._id,
        name: user.name,
        email: user.email,
        role: user.role,
        phone: user.phone || '',
        address: user.address || '',
        createdAt: user.createdAt
      }))
    });
  } catch (error) {
    console.error('Error fetching users:', error);
    res.status(500).json({
      success: false,
      message: 'Server Error',
      error: error.message
    });
  }
};

exports.updateProfile = async (req, res) => {
  try {
    console.log('Updating profile for user:', req.user.id);

    let user = await User.findById(req.user.id);
    
    if (!user) {
      return res.status(404).json({
        success: false,
        message: 'User not found'
      });
    }
    
    const fieldsToUpdate = {
      name: req.body.name || user.name,
      phone: req.body.phone || user.phone,
      address: req.body.address || user.address
    };

    if (req.body.email && req.user.role === 'admin') {
      fieldsToUpdate.email = req.body.email;
    }

    user = await User.findByIdAndUpdate(req.user.id, fieldsToUpdate, {
      new: true,
      runValidators: true
    });
    
    res.status(200).json({
      success: true,
      data: {
        id: user._id,
        name: user.name,
        email: user.email,
        role: user.role,
        phone: user.phone,
        address: user.address,
        createdAt: user.createdAt
      }
    });
  } catch (error) {
    console.error('Error updating profile:', error);
    res.status(500).json({
      success: false,
      message: 'Server Error',
      error: error.message
    });
  }
};

exports.deleteUser = async (req, res) => {
  try {
    console.log('Deleting user with ID:', req.params.id);
    
    if (req.user.role !== 'admin') {
      return res.status(403).json({
        success: false,
        message: 'Not authorized to delete users'
      });
    }
    
    const user = await User.findById(req.params.id);
    
    if (!user) {
      return res.status(404).json({
        success: false,
        message: 'User not found'
      });
    }
    
    if (user._id.toString() === req.user.id) {
      return res.status(400).json({
        success: false,
        message: 'Cannot delete your own account'
      });
    }
    
    await user.deleteOne();
    
    res.status(200).json({
      success: true,
      data: {}
    });
  } catch (error) {
    console.error('Error deleting user:', error);
    res.status(500).json({
      success: false,
      message: 'Server Error',
      error: error.message
    });
  }
};

exports.changePassword = async (req, res) => {
  try {
    console.log('Change password request received for user:', req.user.id);
    const { currentPassword, newPassword } = req.body;

    if (!currentPassword || !newPassword) {
      return res.status(400).json({
        success: false,
        message: 'Please provide current password and new password'
      });
    }

    if (newPassword.length < 6) {
      return res.status(400).json({
        success: false,
        message: 'New password must be at least 6 characters'
      });
    }
    const user = await User.findById(req.user.id).select('+password');
    
    if (!user) {
      return res.status(404).json({
        success: false,
        message: 'User not found'
      });
    }
    const isMatch = await user.matchPassword(currentPassword);
    if (!isMatch) {
      return res.status(401).json({
        success: false,
        message: 'Current password is incorrect'
      });
    }
    user.password = newPassword;
    await user.save();

    console.log('Password changed successfully for user:', req.user.id);
    
    res.status(200).json({
      success: true,
      message: 'Password updated successfully'
    });
  } catch (error) {
    console.error('Error changing password:', error);
    res.status(500).json({
      success: false,
      message: 'Server Error',
      error: error.message
    });
  }
};

const sendTokenResponse = (user, statusCode, res) => {
  try {
    const token = user.getSignedJwtToken();
    
    console.log('Login successful for user:', user.email);
    console.log('User role:', user.role);
    console.log('Generated token successfully for user:', user._id);

    const userResponse = {
      id: user._id,
      name: user.name,
      email: user.email,
      role: user.role
    };
    
    console.log('Sending user data in response:', userResponse);
    
    res.status(statusCode).json({
      success: true,
      token,
      user: userResponse
    });
  } catch (error) {
    console.error('Token generation error:', error);
    res.status(500).json({
      success: false,
      message: 'Error generating authentication token',
      error: error.message
    });
  }
}; 