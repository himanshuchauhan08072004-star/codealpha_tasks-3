const mongoose = require('mongoose');
const Order = require('../models/Order');
const Cart = require('../models/Cart');
const Product = require('../models/Product');
const asyncHandler = require('../utils/asyncHandler');
const ApiError = require('../utils/apiError');
const { calculateTotals } = require('../services/orderService');

// POST /api/orders — builds order from the user's server-side cart, never from client totals
const createOrder = asyncHandler(async (req, res) => {
  const { customerInfo, shippingAddress, paymentMethod } = req.body;

  const cart = await Cart.findOne({ user: req.user._id }).populate('items.product');
  if (!cart || cart.items.length === 0) {
    throw new ApiError(400, 'Your cart is empty');
  }

  // Validate every item still exists and has sufficient stock before touching inventory
  const orderItems = [];
  let subtotal = 0;

  for (const item of cart.items) {
    const product = item.product;
    if (!product) {
      throw new ApiError(400, 'One or more items in your cart is no longer available');
    }
    if (item.quantity > product.stock) {
      throw new ApiError(400, `Only ${product.stock} units of "${product.name}" available`);
    }
    orderItems.push({
      product: product._id,
      name: product.name,
      image: product.images?.[0] || '',
      price: product.price,
      quantity: item.quantity,
    });
    subtotal += product.price * item.quantity;
  }

  const { shippingCost, tax, total } = calculateTotals(subtotal);

  const order = await Order.create({
    user: req.user._id,
    orderItems,
    customerInfo,
    shippingAddress,
    paymentMethod,
    paymentStatus: paymentMethod === 'COD' ? 'pending' : 'paid', // mock/stripe simulated as paid immediately
    orderStatus: 'pending',
    subtotal,
    shippingCost,
    tax,
    total,
  });

  // Reduce inventory now that the order is committed
  await Promise.all(
    cart.items.map((item) =>
      Product.updateOne({ _id: item.product._id }, { $inc: { stock: -item.quantity } })
    )
  );

  cart.items = [];
  await cart.save();

  res.status(201).json({ success: true, data: order });
});

// GET /api/orders/my-orders
const getMyOrders = asyncHandler(async (req, res) => {
  const orders = await Order.find({ user: req.user._id }).sort({ createdAt: -1 });
  res.json({ success: true, data: orders });
});

// GET /api/orders/:id — owner or admin only
const getOrderById = asyncHandler(async (req, res) => {
  if (!mongoose.Types.ObjectId.isValid(req.params.id)) {
    throw new ApiError(404, 'Order not found');
  }
  const order = await Order.findById(req.params.id);
  if (!order) throw new ApiError(404, 'Order not found');

  const isOwner = order.user.toString() === req.user._id.toString();
  if (!isOwner && req.user.role !== 'admin') {
    throw new ApiError(403, 'You do not have access to this order');
  }

  res.json({ success: true, data: order });
});

// GET /api/orders (admin) — all orders
const getAllOrders = asyncHandler(async (req, res) => {
  const orders = await Order.find().populate('user', 'name email').sort({ createdAt: -1 });
  res.json({ success: true, data: orders });
});

// PUT /api/orders/:id/status (admin)
const updateOrderStatus = asyncHandler(async (req, res) => {
  const order = await Order.findById(req.params.id);
  if (!order) throw new ApiError(404, 'Order not found');

  order.orderStatus = req.body.orderStatus;
  await order.save();

  res.json({ success: true, data: order });
});

module.exports = { createOrder, getMyOrders, getOrderById, getAllOrders, updateOrderStatus };
