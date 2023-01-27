const jwt = require("jsonwebtoken");

const generateRefreshToken = (_id) => {
  return jwt.sign({ _id }, process.env.JWT, { expiresIn: "30d" });
};

module.exports = generateRefreshToken;