const mongoose = require('mongoose');
const Product = require('../models/Product');
const products = require('../data/products.json');
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

// Import products
const importProducts = async () => {
  try {
    await Product.deleteMany();
    console.log('All existing products deleted');
    
    await Product.insertMany(products);
    console.log(`${products.length} products imported successfully`);
    
    process.exit();
  } catch (error) {
    console.error('Error importing products:', error);
    process.exit(1);
  }
};

importProducts(); 