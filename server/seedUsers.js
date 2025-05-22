const mongoose = require('mongoose');
const User = require('./models/User');
const dotenv = require('dotenv');

// Load environment variables
dotenv.config();

// Connect to MongoDB
mongoose.connect(process.env.MONGO_URI || 'mongodb://localhost:27017/art-heaven', {
  useNewUrlParser: true,
  useUnifiedTopology: true
})
.then(() => console.log('MongoDB Connected for seeding'))
.catch(err => {
  console.error('MongoDB Connection Error:', err);
  process.exit(1);
});

// Users to create
const users = [
  {
    name: 'Admin User',
    email: 'admin@artheaven.com',
    password: 'admin123',
    role: 'admin'
  },
  {
    name: 'Regular User',
    email: 'user@example.com',
    password: 'password123',
    role: 'user'
  }
];


const seedUsers = async () => {
  try {
    await User.deleteMany({});
    console.log('Deleted all existing users');

    for (const userData of users) {
      const existingUser = await User.findOne({ email: userData.email });
      if (existingUser) {
        console.log(`User ${userData.email} already exists, skipping...`);
        continue;
      }
      // Do NOT hash the password here; let the Mongoose pre-save hook handle it
      const user = await User.create(userData);
      console.log(`Created user: ${user.email} with role: ${user.role}`);
    }

    console.log('Seed completed successfully!');
    process.exit(0);
  } catch (error) {
    console.error('Error seeding users:', error);
    process.exit(1);
  }
};

// Run the seed function
seedUsers();