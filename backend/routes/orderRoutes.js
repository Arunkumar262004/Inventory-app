const express = require('express');
const router = express.Router();
const { createOrder, getMyOrders, getAllOrders, updateOrderStatus } = require('../controllers/orderController');
const { protect } = require('../middleware/authMiddleware');

router.post('/', protect, createOrder);
router.get('/my', protect, getMyOrders);
router.get('/', protect, getAllOrders);
router.put('/:id', protect, updateOrderStatus);

module.exports = router;