const mongoose = require('mongoose');

const CartItemSchema = new mongoose.Schema({
  product: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Product',
    required: true
  },
  quantity: {
    type: Number,
    required: true,
    min: [1, 'Quantity cannot be less than 1'],
    default: 1
  },
  price: {
    type: Number,
    required: true
  },
  name: {
    type: String,
    required: true
  },
  image: {
    type: String,
    default: 'no-image.jpg'
  }
}, { 
  timestamps: true,
  toJSON: { virtuals: true },
  toObject: { virtuals: true }
});

const CartSchema = new mongoose.Schema({
  user: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true,
    index: true // Add index for faster queries
  },
  items: [CartItemSchema],
  totalAmount: {
    type: Number,
    default: 0
  },
  createdAt: {
    type: Date,
    default: Date.now
  },
  updatedAt: {
    type: Date,
    default: Date.now
  }
}, {
  timestamps: true,
  toJSON: { virtuals: true },
  toObject: { virtuals: true }
});

// Update the 'updatedAt' field and calculate total amount on save
CartSchema.pre('save', function(next) {
  try {
    this.updatedAt = Date.now();
    
    // Calculate total amount
    let total = 0;
    if (this.items && this.items.length > 0) {
      total = this.items.reduce((sum, item) => {
        // Make sure price and quantity are valid numbers
        const price = parseFloat(item.price) || 0;
        const quantity = parseInt(item.quantity) || 0;
        return sum + (price * quantity);
      }, 0);
    }
    this.totalAmount = parseFloat(total.toFixed(2)); // Round to 2 decimal places
    
    next();
  } catch (error) {
    console.error('Error in Cart pre-save hook:', error);
    next(error);
  }
});

// Add a method to check if a product is in the cart
CartSchema.methods.hasProduct = function(productId) {
  return this.items.some(item => item.product.toString() === productId.toString());
};

// Add a method to get a specific item by product ID
CartSchema.methods.getItemByProductId = function(productId) {
  return this.items.find(item => item.product.toString() === productId.toString());
};

module.exports = mongoose.model('Cart', CartSchema); 