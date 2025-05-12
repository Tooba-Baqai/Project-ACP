const jwt = require('jsonwebtoken');
const mongoose = require('mongoose');
const User = require('../models/User');
const dotenv = require('dotenv');

// Load environment variables
dotenv.config();

// Secret key for JWT
const secret = process.env.JWT_SECRET || 'art_heaven_secret_key_2023';
console.log('Using JWT secret:', process.env.JWT_SECRET ? 'from env' : 'fallback');

// Connect to MongoDB
mongoose.connect(process.env.MONGO_URI || 'mongodb://localhost:27017/art-heaven', {
  useNewUrlParser: true,
  useUnifiedTopology: true
})
.then(() => console.log('MongoDB Connected for token test'))
.catch(err => {
  console.error('MongoDB Connection Error:', err);
  process.exit(1);
});

const testToken = async () => {
  try {
    // Find admin user
    const admin = await User.findOne({ email: 'admin@artheaven.com' });
    
    if (!admin) {
      console.log('Admin user not found');
      process.exit(1);
    }
    
    console.log('Found admin user:', admin.name, '(role:', admin.role, ')');
    
    // Generate a token using the model method
    const token = admin.getSignedJwtToken();
    console.log('Generated token:', token);
    
    // Verify the token
    try {
      const decoded = jwt.verify(token, secret);
      console.log('Token verified successfully!');
      console.log('Decoded payload:', decoded);
      
      // Check if user ID in token matches the admin ID
      if (decoded.id === admin._id.toString()) {
        console.log('User ID in token matches admin ID ✅');
      } else {
        console.log('User ID mismatch ❌');
        console.log('Token ID:', decoded.id);
        console.log('Admin ID:', admin._id.toString());
      }
    } catch (error) {
      console.error('Token verification failed:', error.message);
    }

    process.exit(0);
  } catch (error) {
    console.error('Error testing token:', error);
    process.exit(1);
  }
};

testToken(); 