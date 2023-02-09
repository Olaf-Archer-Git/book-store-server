const Discount = require("../models/discountModel");
const validateMongoDB = require("../utils/validateMongoDB");

const createDiscount = async (req, res) => {
  try {
    const newDiscount = await Discount.create(req.body);
    res.json(newDiscount);
  } catch (error) {
    throw new Error(error, "createDiscount");
  }
};

const getAllDiscounts = async (req, res) => {
  try {
    const getDiscounts = await Discount.find();
    res.json(getDiscounts);
  } catch (error) {
    throw new Error(error, "getAllDiscounts");
  }
};

const deleteDiscounts = async (req, res) => {
  const { id } = req.params;
  validateMongoDB(id);
  try {
    const deleteDiscount = await Discount.findByIdAndDelete(id);
    res.json(deleteDiscount);
  } catch (error) {
    throw new Error(error, "deleteDiscounts");
  }
};

module.exports = { createDiscount, getAllDiscounts, deleteDiscounts };
