const { body } = require('express-validator');
const { CATEGORIES } = require('../models/Product');

const productValidator = [
  body('name').trim().notEmpty().withMessage('Product name is required').isLength({ max: 120 }),
  body('description').trim().notEmpty().withMessage('Description is required'),
  body('price').isFloat({ min: 0 }).withMessage('Price must be a non-negative number'),
  body('originalPrice')
    .optional()
    .isFloat({ min: 0 })
    .withMessage('Original price must be a non-negative number'),
  body('category')
    .isIn(CATEGORIES)
    .withMessage(`Category must be one of: ${CATEGORIES.join(', ')}`),
  body('images').isArray({ min: 1 }).withMessage('At least one image URL is required'),
  body('stock').isInt({ min: 0 }).withMessage('Stock must be a non-negative integer'),
  body('featured').optional().isBoolean(),
];

// For PUT: same rules, but every field is optional since updates can be partial
const productUpdateValidator = [
  body('name').optional().trim().notEmpty().withMessage('Product name cannot be empty').isLength({ max: 120 }),
  body('description').optional().trim().notEmpty().withMessage('Description cannot be empty'),
  body('price').optional().isFloat({ min: 0 }).withMessage('Price must be a non-negative number'),
  body('originalPrice')
    .optional()
    .isFloat({ min: 0 })
    .withMessage('Original price must be a non-negative number'),
  body('category')
    .optional()
    .isIn(CATEGORIES)
    .withMessage(`Category must be one of: ${CATEGORIES.join(', ')}`),
  body('images').optional().isArray({ min: 1 }).withMessage('At least one image URL is required'),
  body('stock').optional().isInt({ min: 0 }).withMessage('Stock must be a non-negative integer'),
  body('featured').optional().isBoolean(),
];

module.exports = { productValidator, productUpdateValidator };
