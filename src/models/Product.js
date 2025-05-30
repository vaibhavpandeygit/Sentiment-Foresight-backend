// models/Product.js
const mongoose = require('mongoose');

const productSchema = new mongoose.Schema({
  brandId: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
  categoryId: { type: mongoose.Schema.Types.ObjectId, ref: 'Category' },
  title: { type: String, required: true },
  description: { type: String },
  price: { type: Number, required: true },
  images: { type: String },
  tags: [{ type: String }],
  stock: { type: Number, default: 0 },
  sku: { type: String },
  createdAt: { type: Date, default: Date.now },
  updatedAt: { type: Date, default: Date.now }
});

module.exports = mongoose.model('Product', productSchema);