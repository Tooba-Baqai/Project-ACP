const mongoose = require('mongoose');
const User = require('../models/User');
const dotenv = require('dotenv');

// Load environment variables
dotenv.config();

// Admin user details
const adminUser = {
  name: 'Admin User',
  email: 'admin@artheaven.com',
  password: 'admin123',
  role: 'admin',
  phone: '123-456-7890',
  address: 'Admin Office'
};

// Connect to MongoDB
mongoose.connect(process.env.MONGO_URI || 'mongodb://localhost:27017/art-heaven', {
  useNewUrlParser: true,
  useUnifiedTopology: true
})
.then(() => console.log('MongoDB Connected for admin creation'))
.catch(err => {
  console.error('MongoDB Connection Error:', err);
  process.exit(1);
});

// Create admin user
const createAdmin = async () => {
  try {
    // Check if admin already exists
    const existingAdmin = await User.findOne({ email: adminUser.email });
    
    if (existingAdmin) {
      console.log('Admin user already exists');
      process.exit(0);
    }
    
    // Create new admin user
    const user = await User.create(adminUser);
    console.log(`Admin user created successfully with ID: ${user._id}`);
    console.log('Email: admin@artheaven.com');
    console.log('Password: admin123');
    
    process.exit(0);
  } catch (error) {
    console.error('Error creating admin user:', error);
    process.exit(1);
  }
};

createAdmin(); 