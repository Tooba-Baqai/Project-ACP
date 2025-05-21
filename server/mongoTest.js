const mongoose = require('mongoose');

// Try to connect with detailed error reporting
console.log('Attempting to connect to MongoDB...');

// Connection string - first try localhost without credentials
const connectionString = 'mongodb://localhost:27017/art-heaven';
console.log(`Using connection string: ${connectionString}`);

mongoose.connect(connectionString, {
  useNewUrlParser: true,
  useUnifiedTopology: true
})
.then(() => {
  console.log('✅ MongoDB Connected Successfully!');
  console.log('Connection Details:', mongoose.connection);
  process.exit(0);
})
.catch(err => {
  console.error('❌ MongoDB Connection Error:', err);
  console.error('Error Details:', {
    name: err.name,
    message: err.message,
    code: err.code,
    stack: err.stack
  });
  
  console.log('\nTroubleshooting tips:');
  console.log('1. Make sure MongoDB is installed and running');
  console.log('2. Check if MongoDB service is started');
  console.log('3. Verify the connection string is correct');
  console.log('4. Check for network issues or firewall blocking port 27017');
  
  process.exit(1);
}); 