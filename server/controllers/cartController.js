const Cart = require('../models/Cart');
const Product = require('../models/Product');
const asyncHandler = require('../utils/asyncHandler');
const ApiError = require('../utils/apiError');

// GET /api/cart
const getCart = asyncHandler(async (req, res) => {
  let cart = await Cart.findOne({ user: req.user._id }).populate('items.product');
  if (!cart) {
    cart = await Cart.create({ user: req.user._id, items: [] });
  }
  // Drop line items whose product was deleted since being added
  cart.items = cart.items.filter((i) => i.product);
  res.json({ success: true, data: cart });
});

// POST /api/cart  { productId, quantity }
const addToCart = asyncHandler(async (req, res) => {
  const { productId, quantity = 1 } = req.body;

  const product = await Product.findById(productId);
  if (!product) throw new ApiError(404, 'Product not found');
  if (quantity < 1) throw new ApiError(400, 'Quantity must be at least 1');

  let cart = await Cart.findOne({ user: req.user._id });
  if (!cart) cart = new Cart({ user: req.user._id, items: [] });

  const existing = cart.items.find((i) => i.product.toString() === productId);
  const newQty = (existing?.quantity || 0) + quantity;

  if (newQty > product.stock) {
    throw new ApiError(400, `Only ${product.stock} units of ${product.name} available`);
  }

  if (existing) {
    existing.quantity = newQty;
  } else {
    cart.items.push({ product: productId, quantity });
  }

  await cart.save();
  await cart.populate('items.product');
  res.status(201).json({ success: true, data: cart });
});

// PUT /api/cart/:productId  { quantity }
const updateCartItem = asyncHandler(async (req, res) => {
  const { quantity } = req.body;
  if (quantity < 1) throw new ApiError(400, 'Quantity must be at least 1');

  const product = await Product.findById(req.params.productId);
  if (!product) throw new ApiError(404, 'Product not found');
  if (quantity > product.stock) {
    throw new ApiError(400, `Only ${product.stock} units of ${product.name} available`);
  }

  const cart = await Cart.findOne({ user: req.user._id });
  if (!cart) throw new ApiError(404, 'Cart not found');

  const item = cart.items.find((i) => i.product.toString() === req.params.productId);
  if (!item) throw new ApiError(404, 'Item not in cart');

  item.quantity = quantity;
  await cart.save();
  await cart.populate('items.product');
  res.json({ success: true, data: cart });
});

// DELETE /api/cart/:productId
const removeCartItem = asyncHandler(async (req, res) => {
  const cart = await Cart.findOne({ user: req.user._id });
  if (!cart) throw new ApiError(404, 'Cart not found');

  cart.items = cart.items.filter((i) => i.product.toString() !== req.params.productId);
  await cart.save();
  await cart.populate('items.product');
  res.json({ success: true, data: cart });
});

// DELETE /api/cart
const clearCart = asyncHandler(async (req, res) => {
  const cart = await Cart.findOne({ user: req.user._id });
  if (cart) {
    cart.items = [];
    await cart.save();
  }
  res.json({ success: true, data: cart || { items: [] } });
});

module.exports = { getCart, addToCart, updateCartItem, removeCartItem, clearCart };
