const Product = require("../models/productModel");
const asyncHandler = require("express-async-handler");
const slugify = require("slugify");

//create product
const createProduct = asyncHandler(async (req, res) => {
  try {
    if (req.body.title) {
      req.body.slug = slugify(req.body.title);
    }
    const newProduct = await Product.create(req.body);
    res.json(newProduct);
  } catch (error) {
    throw new Error(error, "createProduct, productCtrl");
  }
});

//get all products
const getAllProducts = asyncHandler(async (req, res) => {
  try {
    const queryObj = { ...req.query };
    const excludefields = ["sort", "page", "limit", "fields"];
    excludefields.forEach((item) => delete queryObj[item]);

    let queryString = JSON.stringify(queryObj);
    queryString = queryString.replace(
      /\b(gte|gt|lte|lt)\b/g,
      (match) => `$${match}`
    );
    const query = Product.find(JSON.parse(queryString));
    const product = await query;
    res.json(product);
  } catch (error) {
    throw new Error(error, "getAllProducts, productCtrl");
  }
});

// get single product
const getProduct = asyncHandler(async (req, res) => {
  const { id } = req.params;
  try {
    const findProduct = await Product.findById(id);
    res.json(findProduct);
  } catch (error) {
    throw new Error(error, "getProduct, productCtrl");
  }
});

//update product
const productUpdate = asyncHandler(async (req, res) => {
  const { id } = req.params;
  try {
    if (req.body.title) {
      req.body.slug = slugify(req.body.title);
    }
    const updateProduct = await Product.findOneAndUpdate(id, req.body, {
      new: true,
    });
    res.json(updateProduct);
  } catch (error) {
    throw new Error(error, "productUpdate, productCtrl");
  }
});

//delete product
const productDelete = asyncHandler(async (req, res) => {
  const { id } = req.params;
  try {
    const deleteProduct = await Product.findByIdAndDelete(id);
    res.json(deleteProduct);
  } catch (error) {
    throw new Error(error, "productDelete, productCtrl");
  }
});

module.exports = {
  createProduct,
  getAllProducts,
  getProduct,
  productUpdate,
  productDelete,
};
