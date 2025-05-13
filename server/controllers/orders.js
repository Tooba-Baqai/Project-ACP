const Order = require('../models/Order');
const Product = require('../models/Product');
const Cart = require('../models/Cart');

exports.getOrders = async (req, res) => {
  try {
    let query;
    const { status } = req.query;

    if (req.user.role !== 'admin') {
      query = Order.find({ user: req.user.id });
      
      if (status) {
        query = query.find({ status });
      }
      
      query = query.populate({
        path: 'items.product',
        select: 'name type material price image'
      });
    } else {
      query = Order.find();
      
      if (status) {
        query = query.find({ status });
      }
      query = query.populate({
        path: 'items.product',
        select: 'name type material price image'
      }).populate({
        path: 'user',
        select: 'name email'
      });
    }

    query = query.sort({ updatedAt: -1, orderDate: -1, createdAt: -1 });

    const orders = await query;

    res.status(200).json({
      success: true,
      count: orders.length,
      data: orders
    });
  } catch (error) {
    console.error('Error fetching orders:', error);
    res.status(500).json({
      success: false,
      message: 'Server Error',
      error: error.message
    });
  }
};

exports.getOrder = async (req, res) => {
  try {
    const order = await Order.findById(req.params.id)
      .populate({
        path: 'items.product',
        select: 'name type material price image'
      })
      .populate({
        path: 'user',
        select: 'name email'
      });

    if (!order) {
      return res.status(404).json({
        success: false,
        message: 'Order not found'
      });
    }

    if (order.user._id.toString() !== req.user.id && req.user.role !== 'admin') {
      return res.status(401).json({
        success: false,
        message: 'Not authorized to access this order'
      });
    }

    res.status(200).json({
      success: true,
      data: order
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Server Error',
      error: error.message
    });
  }
};

exports.createOrder = async (req, res) => {
  try {
    console.log('Creating order from cart with data:', req.body);
    
    const { shippingAddress, contactNumber, paymentMethod, notes } = req.body;
 
    const cart = await Cart.findOne({ user: req.user.id });
    
    if (!cart || !cart.items || cart.items.length === 0) {
      return res.status(400).json({
        success: false,
        message: 'Cart is empty. Please add items before placing an order.'
      });
    }
    for (const item of cart.items) {
      const product = await Product.findById(item.product);
      
      if (!product) {
        return res.status(404).json({
          success: false,
          message: `Product ${item.name} not found`
        });
      }
      
      if (!product.inStock) {
        return res.status(400).json({
          success: false,
          message: `Product ${product.name} is out of stock`
        });
      }
    }

    const orderData = {
      user: req.user.id,
      items: cart.items,
      shippingAddress: shippingAddress || req.user.address || 'Pickup in store',
      contactNumber: contactNumber || req.user.phone || 'Not provided',
      totalAmount: cart.totalAmount,
      paymentMethod: paymentMethod || 'cash',
      notes: notes || '',
      orderDate: new Date()
    };
    
    const order = await Order.create(orderData);
    
    cart.items = [];
    await cart.save();
    
    console.log('Order created successfully:', order._id);
    console.log('Order total amount:', order.totalAmount);

    res.status(201).json({
      success: true,
      data: order
    });
  } catch (error) {
    console.error('Error creating order:', error);
    res.status(500).json({
      success: false,
      message: 'Server Error',
      error: error.message
    });
  }
};

exports.updateOrder = async (req, res) => {
  try {
    let order = await Order.findById(req.params.id);

    if (!order) {
      return res.status(404).json({
        success: false,
        message: 'Order not found'
      });
    }

    if (order.user.toString() !== req.user.id && req.user.role !== 'admin') {
      return res.status(401).json({
        success: false,
        message: 'Not authorized to update this order'
      });
    }

    req.body.updatedAt = new Date();

    order = await Order.findByIdAndUpdate(req.params.id, req.body, {
      new: true,
      runValidators: true
    }).populate({
      path: 'items.product',
      select: 'name type material price image'
    }).populate({
      path: 'user',
      select: 'name email'
    });

    res.status(200).json({
      success: true,
      data: order
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Server Error',
      error: error.message
    });
  }
};

exports.deleteOrder = async (req, res) => {
  try {
    const order = await Order.findById(req.params.id);

    if (!order) {
      return res.status(404).json({
        success: false,
        message: 'Order not found'
      });
    }

    if (order.user.toString() !== req.user.id && req.user.role !== 'admin') {
      return res.status(401).json({
        success: false,
        message: 'Not authorized to delete this order'
      });
    }

    await order.deleteOne();

    res.status(200).json({
      success: true,
      data: {}
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Server Error',
      error: error.message
    });
  }
}; 