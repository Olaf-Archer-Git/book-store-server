const User = require("../models/userModel");
const jwt = require("jsonwebtoken");

const authMiddleware = async (req, res, next) => {
  let token;
  if (req?.headers?.authorization?.startsWith("Bearer")) {
    token = req.headers.authorization.split(" ")[1];

    try {
      if (token) {
        const decoded = jwt.verify(token, process.env.JWT);
        const user = await User.findById(decoded?.id);
        req.user = user;
        next();
      }
    } catch (error) {
      throw new Error("Not Authorized token expired, Please Login again");
    }
  } else {
    throw new Error(" There is no token attached to header");
  }
};

const adminMiddleware = async (req, res, next) => {
  const { email } = req.user;
  const userAdmin = await User.findOne({ email });
  if (userAdmin.role !== "admin") {
    throw new Error("User Is Not Admin, check adminMiddleware");
  } else {
    //pass the request
    next();
  }
};

module.exports = { authMiddleware, adminMiddleware };
