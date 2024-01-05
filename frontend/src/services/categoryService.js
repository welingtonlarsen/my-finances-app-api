const categoryRepository = require('../repositories/categoryRepository');

exports.createCategory = async (name) => {
  // Validações se necessárias
  return await categoryRepository.createCategory(name);
};

exports.getCategories = async () => {
  return categoryRepository.getCategories()
}