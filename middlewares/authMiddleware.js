const User = require("../models/userModel");
const jwt = require("jsonwebtoken");
const asyncHandler = require("express-async-handler");

const authMiddleware = asyncHandler(async (req, res, next) => {
  let token;
  if (req?.headers?.authorization?.startsWith("Bearer")) {
    token = req.headers.authorization.split(" ")[1];
    try {
      if (token) {
        const decoded = jwt.verify(token, process.env.JWT);
        //find user by ID
        const findUser = await User.findById(decoded?.id);
        req.user = findUser;
        next();
      }
    } catch (error) {
      throw new Error("Please Login Again");
    }
  } else {
    
    throw new Error("There Is No Token", "authMiddleware");
  }
});

const adminMiddleware = asyncHandler(async (req, res, next) => {
  const { email } = req.user;   
  const userAdmin = await User.findOne({ email });
  if (userAdmin.role !== "admin") {
    throw new Error("User Is Not Admin, check adminMiddleware");
  } else {
    //pass the request
    next();
  }
});

module.exports = { authMiddleware, adminMiddleware };
