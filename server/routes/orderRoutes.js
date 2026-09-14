const express = require('express');
const {
  createOrder,
  getMyOrders,
  getOrderById,
  getAllOrders,
  updateOrderStatus,
} = require('../controllers/orderController');
const { createOrderValidator, updateStatusValidator } = require('../validators/orderValidator');
const validate = require('../middleware/validate');
const protect = require('../middleware/auth');
const adminOnly = require('../middleware/adminOnly');

const router = express.Router();

router.use(protect);

router.post('/', createOrderValidator, validate, createOrder);
router.get('/my-orders', getMyOrders);
router.get('/', adminOnly, getAllOrders);
router.get('/:id', getOrderById);
router.put('/:id/status', adminOnly, updateStatusValidator, validate, updateOrderStatus);

module.exports = router;
