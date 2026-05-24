const Order = require('../models/orderModel');
const Product = require('../models/productModel');

const createOrder = async (userId, orderData) => {
  const product = await Product.findById(orderData.productId);
  if (!product) throw new Error('Product not found');
  if (product.quantity < orderData.quantity) throw new Error('Insufficient stock');

  const order = await Order.create({ user: userId, ...orderData });

  // Reduce stock
  product.quantity -= orderData.quantity;
  await product.save();

  return order;
};

const getOrders_by_cusid = async (userId) => {
  return await Order.find({ user: userId }).sort({ createdAt: -1 });
};

const getAllOrders = async () => {
  return await Order.find().populate('user', 'name email').sort({ createdAt: -1 });
};

const updateOrderStatus = async (id, status) => {
  const order = await Order.findByIdAndUpdate(id, { status }, { new: true });
  if (!order) throw new Error('Order not found');
  return order;
};

module.exports = { createOrder, getOrders_by_cusid, getAllOrders, updateOrderStatus };