const User = require("../models/userModel");
const asyncHandler = require("express-async-handler");
const { generateToken } = require("../config/jwToken");

//create new user (register)
const createUser = asyncHandler(async (req, res) => {
  const email = req.body.email;
  const findUser = await User.findOne({ email });
  if (!findUser) {
    // create a new user
    const newUser = await User.create(req.body);
    res.json(newUser);
  } else {
    throw new Error("User Already Exist");
  }
});

//login user
const loginUserCtrl = asyncHandler(async (req, res) => {
  const { email, password } = req.body;
  const findUser = await User.findOne({ email });
  if (findUser && (await findUser.isPasswordMatched(password))) {
    res.json({
      _id: findUser?._id,
      firstName: findUser?.firstName,
      lastName: findUser?.lastName,
      email: findUser?.email,
      mobile: findUser?.mobile,
      token: generateToken(findUser?._id),
    });
  } else {
    throw new Error("error - login user ctrl");
  }
});

//get all users
const getAllUsers = asyncHandler(async (req, res) => {
  try {
    const getUser = await User.find();
    res.json(getUser);
  } catch (error) {
    throw new Error(error, "getAllUsers");
  }
});

//get a single user
const getSingleUser = asyncHandler(async (req, res) => {
  const { id } = req.params;
  try {
    const singleUser = await User.findById(id);
    res.json(singleUser);
  } catch (error) {
    throw new Error(error, "getSingleUser");
  }
});

//update user
const updateUser = asyncHandler(async (req, res) => {
  const { _id } = req.user;
  try {
    const update = await User.findByIdAndUpdate(
      _id,
      {
        firstName: req?.body?.firstName,
        lastName: req?.body?.lastName,
        email: req?.body?.email,
        mobile: req?.body?.mobile,
      },
      {
        new: true,
      }
    );
    res.json(update);
  } catch (error) {
    throw new Error(error, "updateUser");
  }
});

//delete user
const deleteUser = asyncHandler(async (req, res) => {
  const { id } = req.params;
  try {
    const removeUser = await User.findByIdAndDelete(id);
    res.json(removeUser);
  } catch (error) {
    throw new Error(error, "deleteUser");
  }
});

module.exports = {
  createUser,
  loginUserCtrl,
  getAllUsers,
  getSingleUser,
  deleteUser,
  updateUser,
};
