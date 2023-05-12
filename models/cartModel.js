const mongoose = require("mongoose");

const cartSchema = new mongoose.Schema(
  {
    userID: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
    },

    productID: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Product",
    },

    quantity: {
      type: Number,
      required: true,
    },

    price: {
      type: Number,
      required: true,
    },
  },
  {
    timestamps: true,
  }
);

//Export the model
module.exports = mongoose.model("Cart", cartSchema);
