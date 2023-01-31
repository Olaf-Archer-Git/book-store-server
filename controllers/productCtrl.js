const Product = require("../models/productModel");
const asyncHandler = require("express-async-handler");

const createProduct = asyncHandler(async (req, res) => {
  try {
    const newProduct = await Product.create(req.body);
    res.json(newProduct);
  } catch (error) {
    throw new Error(error, "create product, productCtrl");
  }
});

const getProduct = asyncHandler(async (req, res) => {
  try {
    const 
  } catch (error) {
    throw new Error(error, "getProduct, productCtrl");
  }
});

module.exports = { createProduct };
