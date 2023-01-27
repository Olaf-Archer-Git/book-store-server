const mongoose = require("mongoose");

const validateMongoose = (id) => {
  const isValid = mongoose.Types.ObjectId.isValid(id);
  if (!isValid) {
    throw new Error("The ID Is Not Valid");
  }
};

module.exports = validateMongoose;
