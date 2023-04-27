const Product = require("../models/productModel");
const User = require("../models/userModel");
const asyncHandler = require("express-async-handler");
const slugify = require("slugify");
const validateMongoose = require("../utils/validateMongoDB");

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

// update product
const productUpdate = asyncHandler(async (req, res) => {
  const { id } = req.params;
  validateMongoose(id);
  try {
    const updateProduct = await Product.findByIdAndUpdate(id, req.body, {
      new: true,
    });
    res.json(updateProduct);
  } catch (error) {
    throw new Error(error, "updateBlog error");
  }
});

//get all products
const getAllProducts = async (req, res) => {
  try {
    const getProducts = await Product.find();
    res.json(getProducts);
  } catch (error) {
    throw new Error(error, "getAllProductss error");
  }
};

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

//delete product
const productDelete = async (req, res) => {
  const { id } = req.params;
  try {
    const deleteProduct = await Product.findByIdAndDelete(id);
    res.json(deleteProduct);
  } catch (error) {
    throw new Error(error, "productDelete, productCtrl");
  }
};

//favorite product
const addToFavorite = async (req, res) => {
  const { _id } = req.user;
  const { prodID } = req.body;

  try {
    const user = await User.findById(_id);
    const alreadyAdded = user.favorite.find(
      (id) => id.toString() === prodID.toString()
    );
    if (alreadyAdded) {
      const user = await User.findByIdAndUpdate(
        _id,
        {
          $pull: { favorite: prodID },
        },
        { new: true }
      );
      res.json(user);
    } else {
      const user = await User.findByIdAndUpdate(
        _id,
        {
          $push: { favorite: prodID },
        },
        { new: true }
      );
      res.json(user);
    }
  } catch (error) {
    throw new Error(error, "addToFavorite");
  }
};

//product rating
const totalRating = async (req, res) => {
  const { _id } = req.user;
  const { star, prodID, comment } = req.body;

  try {
    const product = await Product.findById(prodID);
    const alreadyRated = product?.ratings.find(
      (userID) => userID?.postedBy?.toString() === _id.toString()
    );
    if (alreadyRated) {
      const updateRating = await Product.updateOne(
        {
          ratings: { $elemMatch: alreadyRated },
        },
        { $set: { "ratings.$.star": star, "ratings.$.comment": comment } },
        { new: true }
      );
    } else {
      const rateProduct = await Product.findByIdAndUpdate(
        prodID,
        {
          $push: { ratings: { star: star, comment: comment, postedBy: _id } },
        },
        { new: true }
      );
    }
    //
    const getAllRatings = await Product.findById(prodID);
    let totalRatings = getAllRatings.ratings.length;

    let sumOfRatings = getAllRatings.ratings
      .map((item) => item.star)
      .reduce((prev, current) => prev + current, 0);

    let actualRating = Math.round(sumOfRatings / totalRatings);

    let finalProduct = await Product.findByIdAndUpdate(
      prodID,
      {
        totalRating: actualRating,
      },
      { new: true }
    );
    res.json(finalProduct);
  } catch (error) {
    throw new Error(error, "totalRating");
  }
};

module.exports = {
  createProduct,
  getAllProducts,
  getProduct,
  productUpdate,
  productDelete,
  addToFavorite,
  totalRating,
};
