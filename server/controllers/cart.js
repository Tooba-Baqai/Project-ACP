const Cart = require('../models/Cart');
const Product = require('../models/Product');
const mongoose = require('mongoose');

exports.getCart = async (req, res) => {
  try {
    console.log('Getting cart for user:', req.user.id);
    
    let cart = await Cart.findOne({ user: req.user.id })
      .populate('items.product', 'name price image inStock');
    
    if (!cart) {
      console.log('No cart found, creating new cart for user:', req.user.id);
      cart = await Cart.create({
        user: req.user.id,
        items: []
      });
    }
    
    res.status(200).json({
      success: true,
      data: cart
    });
  } catch (error) {
    console.error('Error getting cart:', error);
    res.status(500).json({
      success: false,
      message: 'Server Error',
      error: error.message
    });
  }
};

exports.addToCart = async (req, res) => {
  try {
    const { productId, quantity = 1 } = req.body;
    
    console.log('Adding to cart - User:', req.user.id, 'Product:', productId, 'Quantity:', quantity);
    
    if (!productId) {
      return res.status(400).json({
        success: false,
        message: 'Please provide product ID'
      });
    }

    if (!mongoose.Types.ObjectId.isValid(productId)) {
      return res.status(400).json({
        success: false,
        message: 'Invalid product ID format'
      });
    }
    
    const product = await Product.findById(productId);
    
    if (!product) {
      return res.status(404).json({
        success: false,
        message: 'Product not found'
      });
    }
    
    if (!product.inStock) {
      return res.status(400).json({
        success: false,
        message: 'Product is out of stock'
      });
    }
    
    let cart = await Cart.findOne({ user: req.user.id });
    
    if (!cart) {
      console.log('Creating new cart for user:', req.user.id);
      cart = await Cart.create({
        user: req.user.id,
        items: []
      });
    }
    
    const itemIndex = cart.items.findIndex(item => 
      item.product && item.product.toString() === productId
    );
    
    if (itemIndex > -1) {
      console.log('Product already in cart, updating quantity');
      cart.items[itemIndex].quantity += parseInt(quantity);
    } else {
      console.log('Adding new product to cart');
      cart.items.push({
        product: productId,
        quantity: parseInt(quantity),
        price: parseFloat(product.price),
        name: product.name,
        image: product.image || 'no-image.jpg'
      });
    }

    await cart.save();
    
    const updatedCart = await Cart.findById(cart._id)
      .populate('items.product', 'name price image inStock');
    
    res.status(200).json({
      success: true,
      message: 'Item added to cart',
      data: updatedCart
    });
  } catch (error) {
    console.error('Error adding to cart:', error);
    res.status(500).json({
      success: false,
      message: 'Server Error',
      error: error.message
    });
  }
};

exports.updateCartItem = async (req, res) => {
  try {
    const { quantity } = req.body;
    const { itemId } = req.params;
    
    console.log('Updating cart item - User:', req.user.id, 'Item:', itemId, 'Quantity:', quantity);
    
    if (!quantity || quantity < 1) {
      return res.status(400).json({
        success: false,
        message: 'Please provide a valid quantity (minimum 1)'
      });
    }

    const cart = await Cart.findOne({ user: req.user.id });
    
    if (!cart) {
      return res.status(404).json({
        success: false,
        message: 'Cart not found'
      });
    }

    const itemIndex = cart.items.findIndex(item => 
      item._id.toString() === itemId
    );
    
    if (itemIndex === -1) {
      return res.status(404).json({
        success: false,
        message: 'Item not found in cart'
      });
    }
    
    cart.items[itemIndex].quantity = parseInt(quantity);
    
    await cart.save();
    
    const updatedCart = await Cart.findById(cart._id)
      .populate('items.product', 'name price image inStock');
    
    res.status(200).json({
      success: true,
      message: 'Cart updated',
      data: updatedCart
    });
  } catch (error) {
    console.error('Error updating cart:', error);
    res.status(500).json({
      success: false,
      message: 'Server Error',
      error: error.message
    });
  }
};

exports.removeCartItem = async (req, res) => {
  try {
    const { itemId } = req.params;
    
    console.log('Removing item from cart - User:', req.user.id, 'Item:', itemId);

    const cart = await Cart.findOne({ user: req.user.id });
    
    if (!cart) {
      return res.status(404).json({
        success: false,
        message: 'Cart not found'
      });
    }
    
    cart.items = cart.items.filter(item => 
      item._id.toString() !== itemId
    );
    
    await cart.save();
    
    const updatedCart = await Cart.findById(cart._id)
      .populate('items.product', 'name price image inStock');
    
    res.status(200).json({
      success: true,
      message: 'Item removed from cart',
      data: updatedCart
    });
  } catch (error) {
    console.error('Error removing from cart:', error);
    res.status(500).json({
      success: false,
      message: 'Server Error',
      error: error.message
    });
  }
};

exports.clearCart = async (req, res) => {
  try {
    console.log('Clearing cart - User:', req.user.id);
    
    const cart = await Cart.findOne({ user: req.user.id });
    
    if (!cart) {
      return res.status(404).json({
        success: false,
        message: 'Cart not found'
      });
    }
    
    cart.items = [];
    
    await cart.save();
    
    res.status(200).json({
      success: true,
      message: 'Cart cleared',
      data: cart
    });
  } catch (error) {
    console.error('Error clearing cart:', error);
    res.status(500).json({
      success: false,
      message: 'Server Error',
      error: error.message
    });
  }
}; 