const { body } = require('express-validator');

const createOrderValidator = [
  body('customerInfo.fullName').trim().notEmpty().withMessage('Full name is required'),
  body('customerInfo.email').trim().isEmail().withMessage('Valid email is required'),
  body('customerInfo.phone').trim().notEmpty().withMessage('Phone number is required'),

  body('shippingAddress.address').trim().notEmpty().withMessage('Address is required'),
  body('shippingAddress.city').trim().notEmpty().withMessage('City is required'),
  body('shippingAddress.state').trim().notEmpty().withMessage('State is required'),
  body('shippingAddress.postalCode').trim().notEmpty().withMessage('Postal code is required'),
  body('shippingAddress.country').trim().notEmpty().withMessage('Country is required'),

  body('paymentMethod').isIn(['COD', 'mock', 'stripe']).withMessage('Invalid payment method'),
];

const updateStatusValidator = [
  body('orderStatus')
    .isIn(['pending', 'confirmed', 'processing', 'shipped', 'delivered', 'cancelled'])
    .withMessage('Invalid order status'),
];

module.exports = { createOrderValidator, updateStatusValidator };
