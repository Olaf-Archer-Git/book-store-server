const Product = require("../models/productModel");
const User = require("../models/userModel");
const asyncHandler = require("express-async-handler");
const slugify = require("slugify");
const validateMongoose = require("../utils/validateMongoDB");
const cloudinaryUploadIMG = require("../utils/cloudinary");
const fs = require("fs");

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

//favorite product
const addToFavorite = async (req, res) => {
  const { _id } = req.user;
  const { prodID } = req.body;
  validateMongoose(_id);

  try {
    const user = await User.findById(_id);
    const alreadyAdded = user?.favorite?.find(
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

//upload images
const uploadImages = async (req, res) => {
  const { id } = req.params;

  validateMongoose(id);
  try {
    const uploader = (path) => cloudinaryUploadIMG(path, "images");
    const URLs = [];
    const files = req.files;

    for (const file of files) {
      const { path } = file;
      const newPath = await uploader(path);
      URLs.push(newPath);
      fs.unlinkSync(path);
    }
    const findProduct = await Product.findByIdAndUpdate(
      id,
      {
        images: URLs.map((file) => {
          return file;
        }),
      },
      {
        new: true,
      }
    );
    res.json(findProduct);
  } catch (error) {
    throw new Error(error, "Upload Images Product");
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
  uploadImages,
};
