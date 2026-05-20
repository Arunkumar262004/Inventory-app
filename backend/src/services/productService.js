const Product = require('../models/productModel');

const getAllProducts = async () => {
  return await Product.find().sort({ createdAt: -1 });
};

const getProductById = async (id) => {
  const product = await Product.findById(id);
  if (!product) throw new Error('Product not found');
  return product;
};

const createProduct = async (data) => {
  const product = await Product.create(data);
  return product;
};

const updateProduct = async (id, data) => {
  const product = await Product.findByIdAndUpdate(id, data, { new: true });
  if (!product) throw new Error('Product not found');
  return product;
};

const deleteProduct = async (id) => {
  const product = await Product.findByIdAndDelete(id);
  if (!product) throw new Error('Product not found');
  return product;
};

const searchProducts = async (query) => {
  return await Product.find({
    $or: [
      { name: { $regex: query, $options: 'i' } },
      { category: { $regex: query, $options: 'i' } }
    ]
  });
};

module.exports = {
  getAllProducts,
  getProductById,
  createProduct,
  updateProduct, 
  deleteProduct,
  searchProducts
};