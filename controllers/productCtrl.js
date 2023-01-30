const Product = require("../models/productModel");
const asyncHandler = require("express-async-handler");

const createProduct = asyncHandler(async (req, res) => {
  res.json({
    message: "this is product route",
  });
});

module.exports = { createProduct };
