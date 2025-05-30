const Category = require("../../models/Category");

// POST /categories
exports.addCategory = asyncHandler(async (req, res) => {
  const { name } = req.body;
  const brandId = req.user._id;
  const role = req.user.role;

  if (role !== 'brand') {
    return res.status(403).json({ message: 'Only brands can add categories' });
  }

  const category = await Category.create({
    name,
    brandId
  });

  res.status(201).json({
    message: 'Category created successfully',
    category
  });
});


// GET /categories
exports.getCategory = asyncHandler(async (req, res) => {
  const brandId = req.user._id;
  const role = req.user.role;

  if (role !== 'brand') {
    return res.status(403).json({ message: 'Only brands can view their categories' });
  }

  const categories = await Category.find({ brandId });

  res.status(200).json(categories);
});


// PUT /categories/:id
exports.updateCategory = asyncHandler(async (req, res) => {
  const { id } = req.params;
  const { name } = req.body;
  const brandId = req.user._id;
  const role = req.user.role;

  if (role !== 'brand') {
    return res.status(403).json({ message: 'Only brands can update categories' });
  }

  const category = await Category.findById(id);

  if (!category) {
    return res.status(404).json({ message: 'Category not found' });
  }

  if (category.brandId.toString() !== brandId.toString()) {
    return res.status(403).json({ message: 'Not authorized to update this category' });
  }

  if (name) category.name = name;
  category.updatedAt = new Date();

  await category.save();

  res.status(200).json({ message: 'Category updated successfully', category });
});


// DELETE /categories/:id
exports.deleteCategory = asyncHandler(async (req, res) => {
  const { id } = req.params;

  const category = await Category.findById(id);
  if (!category) {
    return res.status(404).json({ message: 'Category not found' });
  }

  const associatedProducts = await Product.findOne({ categoryId: id });
  if (associatedProducts) {
    return res.status(400).json({
      message: 'Cannot delete category. There are products assigned to this category. Please reassign them before deleting.'
    });
  }

  await category.deleteOne();

  res.status(200).json({ message: 'Category deleted successfully' });
});
