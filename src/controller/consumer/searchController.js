// controllers/productController.js
const asyncHandler = require('express-async-handler');
const User = require('../../models/User');
const Category = require('../../models/Category');
const Product = require('../../models/Product');

// GET /search?query=some+text
exports.searchProducts = asyncHandler(async (req, res) => {
  const { query } = req.query;

  if (!query) {
    return res.status(400).json({ message: 'Search query is required' });
  }

  const regexQuery = new RegExp(query, 'i'); // case-insensitive regex

  // Find matching brands
  const matchingBrands = await User.find({
    role: 'brand',
    'brandDetails.brandName': regexQuery
  }).select('_id');

  // Find matching categories
  const matchingCategories = await Category.find({
    name: regexQuery
  }).select('_id');

  const products = await Product.find({
    $or: [
      { title: regexQuery },
      { description: regexQuery },
      { tags: regexQuery },
      { brandId: { $in: matchingBrands.map(b => b._id) } },
      { categoryId: { $in: matchingCategories.map(c => c._id) } }
    ]
  })
    .populate('brandId', 'name email brandDetails.brandName')
    .populate('categoryId', 'name');

  res.status(200).json(products);
});
