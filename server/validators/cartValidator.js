const { body } = require('express-validator');

const addToCartValidator = [
  body('productId').notEmpty().withMessage('productId is required'),
  body('quantity')
    .optional()
    .isInt({ min: 1 })
    .withMessage('Quantity must be a whole number of at least 1'),
];

const updateCartItemValidator = [
  body('quantity')
    .isInt({ min: 1 })
    .withMessage('Quantity must be a whole number of at least 1'),
];

module.exports = { addToCartValidator, updateCartItemValidator };
