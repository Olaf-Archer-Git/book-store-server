const User = require("../models/userModel");
const Cart = require("../models/cartModel");
const Product = require("../models/productModel");
const validateMongoDB = require("../utils/validateMongoDB");

const orderCart = async (req, res) => {
  const { id } = req.user;
  const { cart } = req.body;
  validateMongoDB(id);

  try {
    const user = await User.findById(id);
    const cartAlreadyExist = await Cart.findOne({ orderBy: user.id });
    if (cartAlreadyExist) {
      cartAlreadyExist.remove();
    }

    const products = [];
    for (let i = 0; i < cart.length; i++) {
      let object = {};
      object.product = cart[i].id;
      object.count = cart[i].count;
      let getPrice = await Product.findById(cart[i].id).select("price").exec();
      object.price = getPrice.price;
      products.push(object);
    }

    let cartTotal = 0;
    for (let i = 0; i < products.length; i++) {
      cartTotal = cartTotal + products[i].price * products[i].count;
    }

    const newCart = await new Cart({
      products,
      cartTotal,
      orderBy: user?.id,
    }).save();

    res.json(newCart);
  } catch (error) {
    throw new Error(error, "order cart error");
  }
};

const getOrderCart = async (req, res) => {
  const { id } = req.user;
  validateMongoDB(id);
  try {
    const cart = await Cart.findOne({ orderBy: id }).populate(
      "products.product"
    );
    res.json(cart);
  } catch (error) {
    throw new Error(error, "getOrderCart error");
  }
};

const emptyCart = async (req, res) => {
  const { id } = req.user;
  validateMongoDB(id);
  try {
    const user = await User.findOne({ id });
    const cart = await Cart.findOneAndRemove({ orderBy: user.id });
    res.json(cart);
  } catch (error) {
    throw new Error(error, "empty cart error");
  }
};

module.exports = { orderCart, getOrderCart, emptyCart };
