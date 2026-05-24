const express = require('express');
const router = express.Router();
const { createOrder, getOrders_by_cusid, getAllOrders, updateOrderStatus } = require('../controllers/orderController');
const { protect } = require('../middleware/authMiddleware');

router.post('/', protect, createOrder);
router.get('/customer_order', protect, getOrders_by_cusid);
router.get('/', protect, getAllOrders);
router.put('/:id', protect, updateOrderStatus);

module.exports = router;