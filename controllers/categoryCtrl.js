const Category = require("../models/categoryModel");
const validateMongoose = require("../utils/validateMongoDB");

const createCategory = async (req, res) => {
  try {
    const newCategory = await Category.create(req.body);
    res.json(newCategory);
  } catch (error) {
    throw new Error(error, "createCategory");
  }
};

// const updateCategory = async (req, res) => {
//   const { id } = req.params;
//   validateMongoose(id);
//   try {
//     const updatedCategory = await Category.findByIdAndUpdate(id, req.body, {
//       new: true,
//     });
//     res.json(updatedCategory);
//   } catch (error) {
//     throw new Error(error, "updateCategory");
//   }
// };

const getCategory = async (req, res) => {
  const { id } = req.params;
  validateMongoose(id);
  try {
    const singleCategory = await Category.findById(id);
    res.json(singleCategory);
  } catch (error) {
    throw new Error(error, "getCategory");
  }
};

const getAllCategories = async (req, res) => {
  try {
    const allCategories = await Category.find();
    res.json(allCategories);
  } catch (error) {
    throw new Error(error, "getCategory");
  }
};

const deleteCategory = async (req, res) => {
  const { id } = req.params;
  validateMongoose(id);
  try {
    const deletedCategory = await Category.findByIdAndDelete(id);
    res.json(deletedCategory);
  } catch (error) {
    throw new Error(error, "deleteCategory");
  }
};

module.exports = {
  createCategory,
  // updateCategory,
  deleteCategory,
  getCategory,
  getAllCategories,
};
