const express = require('express');
const { getCart, addToCart, updateCartItem, removeCartItem, clearCart } = require('../controllers/cartController');
const { addToCartValidator, updateCartItemValidator } = require('../validators/cartValidator');
const validate = require('../middleware/validate');
const protect = require('../middleware/auth');

const router = express.Router();

router.use(protect);

router.get('/', getCart);
router.post('/', addToCartValidator, validate, addToCart);
router.put('/:productId', updateCartItemValidator, validate, updateCartItem);
router.delete('/:productId', removeCartItem);
router.delete('/', clearCart);

module.exports = router;
