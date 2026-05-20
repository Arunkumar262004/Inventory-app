const express = require('express');
const router = express.Router();
const {
  getAllProducts,
  getProductById,
  createProduct,
  updateProduct,
  deleteProduct,
  searchProducts
} = require('../controllers/productController');
const { protect } = require('../middleware/authMiddleware');

// GET /api/products/search?q=query
router.get('/search', protect, searchProducts);

// GET /api/products
router.get('/', protect, getAllProducts);

// GET /api/products/:id
router.get('/:id', protect, getProductById);

// POST /api/products
router.post('/', protect, createProduct);

// PUT /api/products/:id
router.put('/:id', protect, updateProduct);

// DELETE /api/products/:id
router.delete('/:id', protect, deleteProduct);

module.exports = router;