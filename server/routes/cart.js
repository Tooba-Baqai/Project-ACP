const express = require('express');
const {
  getCart,
  addToCart,
  updateCartItem,
  removeCartItem,
  clearCart
} = require('../controllers/cart');
const { protect } = require('../middleware/auth');

const router = express.Router();

// All cart routes require authentication
router.use(protect);

router
  .route('/')
  .get(getCart)
  .post(addToCart)
  .delete(clearCart);

router
  .route('/:itemId')
  .put(updateCartItem)
  .delete(removeCartItem);

module.exports = router; 