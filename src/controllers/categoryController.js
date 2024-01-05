const categoryService = require('../services/categoryService');

exports.createCategory = async (req, res) => {
  try {
    const category = await categoryService.createCategory(req.body.name);
    res.status(201).json(category);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

exports.getCategories = async (req, res) => {
  try {
    const categories = await categoryService.getCategories()
    res.status(200).json(categories)
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
}