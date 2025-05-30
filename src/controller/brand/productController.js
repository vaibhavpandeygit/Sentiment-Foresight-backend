// controllers/productController.js

const asyncHandler = require('express-async-handler');
const Product = require('../../models/Product');

// POST /products
exports.addProduct = asyncHandler(async (req, res) => {
  const role = req.user.role;
  const brandId = req.user._id;

  if (role !== 'brand') {
    return res.status(403).json({ message: 'Only brands can add products' });
  }

  const {
    categoryId,
    title,
    description,
    price,
    tags,
    stock,
    sku
  } = req.body;

  if (!title || !price) {
    return res.status(400).json({ message: 'Title and price are required' });
  }

  let imageUrl = '';
  if (req.file) {
    imageUrl = req.file.path || req.file.location; // Use .location if using S3
  }

  const newProduct = new Product({
    brandId,
    categoryId,
    title,
    description,
    price,
    images: imageUrl,
    tags,
    stock,
    sku
  });

  const savedProduct = await newProduct.save();

  res.status(201).json({
    message: 'Product added successfully',
    product: savedProduct
  });
});


exports.updateProduct = asyncHandler(async (req, res) => {
  const role = req.user.role;
  const brandId = req.user._id;
  const productId = req.params.id;

  if (role !== 'brand') {
    return res.status(403).json({ message: 'Only brands can update products' });
  }

  const product = await Product.findById(productId);

  if (!product) {
    return res.status(404).json({ message: 'Product not found' });
  }

  if (product.brandId.toString() !== brandId.toString()) {
    return res.status(403).json({ message: 'You are not authorized to update this product' });
  }

  const {
    categoryId,
    title,
    description,
    price,
    tags,
    stock,
    sku
  } = req.body;

  // Update only fields provided
  if (categoryId) product.categoryId = categoryId;
  if (title) product.title = title;
  if (description) product.description = description;
  if (price) product.price = price;
  if (tags) product.tags = tags;
  if (typeof stock !== 'undefined') product.stock = stock;
  if (sku) product.sku = sku;

  product.updatedAt = new Date();

  const updatedProduct = await product.save();

  res.status(200).json({
    message: 'Product updated successfully',
    product: updatedProduct
  });
});


// GET /products or /products/:id
exports.getProduct = asyncHandler(async (req, res) => {
  const { id } = req.params;

  if (id) {
    const product = await Product.findById(id)
      .populate('brandId', 'name email brandDetails.brandName')
      .populate('categoryId', 'name');

    if (!product) {
      return res.status(404).json({ message: 'Product not found' });
    }

    return res.status(200).json(product);
  }

  // If no ID, return all products
  const products = await Product.find()
    .populate('brandId', 'name email brandDetails.brandName')
    .populate('categoryId', 'name');

  res.status(200).json(products);
});


// DELETE /products/:id
exports.deleteProduct = asyncHandler(async (req, res) => {
  const { id } = req.params;

  const product = await Product.findById(id);

  if (!product) {
    return res.status(404).json({ message: 'Product not found' });
  }

  await product.deleteOne();

  res.status(200).json({ message: 'Product deleted successfully' });
});
