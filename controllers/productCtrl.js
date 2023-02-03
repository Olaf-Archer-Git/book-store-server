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
    //filter products
    const queryObj = { ...req.query };
    const excludefields = ["sort", "page", "limit", "fields"];
    excludefields.forEach((item) => delete queryObj[item]);

    let queryString = JSON.stringify(queryObj);
    queryString = queryString.replace(
      /\b(gte|gt|lte|lt)\b/g,
      (match) => `$${match}`
    );

    //sorting products
    let query = Product.find(JSON.parse(queryString));
    if (req.query.sort) {
      const sortBy = req.query.sort.split(",").join(" ");
      query = query.sort(sortBy);
    } else {
      query = query.sort("-createdAt");
    }

    //limit the fields
    if (req.query.fields) {
      const fields = req.query.fields.split(",").join(" ");
      query = query.select(fields);
    }
    // else {
    //   query = query.select("__v");
    // }
    /////////////////////////

    //pagination
    const page = req.query.page;
    const limit = req.query.limit;
    const skip = (page - 1) * limit;
    query = query.skip(skip).limit(limit);
    if (req.query.page) {
      const productCount = await Product.countDocuments();
      if (skip >= productCount)
        throw new Error("This Page Does Not Exist, pagination, productcount");
    }

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
