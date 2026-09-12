const Category = require('../models/Category');

exports.getCategories = async (req, res, next) => {
  try {
    const categories = await Category.find({ isActive: true }).sort({ sortOrder: 1, name: 1 });
    res.json(categories);
  } catch (err) {
    next(err);
  }
};

exports.getCategoryBySlug = async (req, res, next) => {
  try {
    const category = await Category.findOne({ slug: req.params.slug });
    if (!category) return res.status(404).json({ message: 'Category not found' });
    res.json(category);
  } catch (err) {
    next(err);
  }
};

exports.createCategory = async (req, res, next) => {
  try {
    const category = await Category.create(req.body);
    res.status(201).json(category);
  } catch (err) {
    next(err);
  }
};

exports.updateCategory = async (req, res, next) => {
  try {
    const category = await Category.findByIdAndUpdate(req.params.id, req.body, {
      new: true,
      runValidators: true,
    });
    if (!category) return res.status(404).json({ message: 'Category not found' });
    res.json(category);
  } catch (err) {
    next(err);
  }
};

exports.deleteCategory = async (req, res, next) => {
  try {
    const category = await Category.findByIdAndDelete(req.params.id);
    if (!category) return res.status(404).json({ message: 'Category not found' });
    res.json({ message: 'Category deleted' });
  } catch (err) {
    next(err);
  }
};

// Admin: list all (including inactive)
exports.getAllCategoriesAdmin = async (req, res, next) => {
  try {
    const categories = await Category.find().sort({ sortOrder: 1, name: 1 });
    res.json(categories);
  } catch (err) {
    next(err);
  }
};
