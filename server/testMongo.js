const mongoose = require('mongoose');
const User = require('./models/User');
const dotenv = require('dotenv');

dotenv.config();

mongoose.connect(process.env.MONGO_URI || 'mongodb://localhost:27017/art-heaven', {
  useNewUrlParser: true,
  useUnifiedTopology: true
})
.then(() => console.log('MongoDB Connected'))
.catch(err => {
  console.error('MongoDB Connection Error:', err);
  process.exit(1);
});

const listUsers = async () => {
  try {
    console.log('Checking database connection and users...');
    
    const count = await User.countDocuments();
    console.log(`Total users in database: ${count}`);
    
    const users = await User.find().select('-password');
    
    if (users.length === 0) {
      console.log('No users found in database. Creating default admin and user...');
      
      await User.create({
        name: 'Admin User',
        email: 'admin@artheaven.com',
        password: 'admin123',
        role: 'admin'
      });

      await User.create({
        name: 'Regular User',
        email: 'user@example.com',
        password: 'password123',
        role: 'user'
      });
      
      console.log('Default users created successfully!');
      
      const newUsers = await User.find().select('-password');
      console.log('Users after creation:');
      console.log(newUsers);
    } else {
      console.log('Users in database:');
      users.forEach(user => {
        console.log(`- ${user.name} (${user.email}) - Role: ${user.role}`);
      });
    }
    
    console.log('Database check completed successfully!');
    process.exit(0);
  } catch (error) {
    console.error('Error testing MongoDB:', error);
    process.exit(1);
  }
};

listUsers(); 