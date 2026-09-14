const express = require('express');
const {
  getProducts,
  getProductById,
  createProduct,
  updateProduct,
  deleteProduct,
} = require('../controllers/productController');
const { productValidator, productUpdateValidator } = require('../validators/productValidator');
const validate = require('../middleware/validate');
const protect = require('../middleware/auth');
const adminOnly = require('../middleware/adminOnly');

const router = express.Router();

router.get('/', getProducts);
router.get('/:id', getProductById);
router.post('/', protect, adminOnly, productValidator, validate, createProduct);
router.put('/:id', protect, adminOnly, productUpdateValidator, validate, updateProduct);
router.delete('/:id', protect, adminOnly, deleteProduct);

module.exports = router;
