const User = require("../models/userModel");
const Cart = require("../models/cartModel");
const Product = require("../models/productModel");
const Discount = require("../models/discountModel");
const Order = require("../models/orderModel");
const { v4: uuidv4 } = require("uuid");
const validateMongoDB = require("../utils/validateMongoDB");

const orderCart = async (req, res) => {
  const { id } = req.user;
  const { productID, quantity, price } = req.body;
  validateMongoDB(id);

  try {
    const newCart = await new Cart({
      userID: id,
      productID,
      quantity,
      price,
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
    const cart = await Cart.find({ userID: id }).populate("productID");
    res.json(cart);
  } catch (error) {
    throw new Error(error, "getOrderCart error");
  }
};

const removeProductFromCart = async (req, res) => {
  const { id } = req.user;
  const { cartItemId } = req.params;
  validateMongoDB(id);
  try {
    const removeProduct = await Cart.deleteOne({ userID: id, _id: cartItemId });
    res.json(removeProduct);
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

const applyDiscount = async (req, res) => {
  const { discount } = req.body;
  const { id } = req.user;
  validateMongoDB(id);

  const validDiscount = await Discount.findOne({ name: discount });
  if (validDiscount === null) {
    throw new Error("there is an error in discount data");
  }

  const user = await User.findOne({ id });

  const { cartTotal } = await Cart.findOne({ orderBy: user.id }).populate(
    "products.product"
  );

  let totalAfterDiscount = (
    cartTotal -
    (cartTotal * validDiscount.discount) / 100
  ).toFixed(2);

  await Cart.findOneAndUpdate(
    { orderBy: user.id },
    { totalAfterDiscount },
    { new: true }
  );
  res.json(totalAfterDiscount);
};

const createOrder = async (req, res) => {
  const { _id } = req.user;
  const {
    shippingInfo,
    orderItems,
    totalPrice,
    totalPriceAfterDiscount,
    paymentInfo,
  } = req.body;

  try {
    const order = await Order.create({
      shippingInfo,
      orderItems,
      totalPrice,
      totalPriceAfterDiscount,
      paymentInfo,
      user: _id,
    });

    res.json({ order, success: true });
  } catch (error) {
    throw new Error(error, "create order, orderCtrl");
  }
};

const getSingleOrder = async (req, res) => {
  const { id } = req.user;
  validateMongoDB(id);

  try {
    const userOrder = await Order.findOne({ orderBy: id })
      .populate("products.product")
      .populate("orderBy")
      .exec();
    res.json(userOrder);
  } catch (error) {
    throw new Error(error, "get order error");
  }
};

///////
const getAllOrders = async (req, res) => {
  try {
    const allOrders = await Order.find()
      .populate("products.product")
      .populate("orderBy")
      .exec();
    res.json(allOrders);
  } catch (error) {
    throw new Error(error, "get all orders error");
  }
};
//////

const getOrderById = async (req, res) => {
  const { id } = req.params;
  validateMongoDB(id);
  try {
    const userOrder = await Order.findOne({ orderBy: id })
      .populate("products.product")
      .populate("orderBy")
      .exec();
    res.json(userOrder);
  } catch (error) {
    throw new Error(error, "getOrderById");
  }
};

const updateOrderStatus = async (req, res) => {
  const { status } = req.body;
  const { id } = req.params;
  validateMongoDB(id);
  try {
    const updateStatus = await Order.findByIdAndUpdate(
      id,
      {
        orderStatus: status,
        paymentIntent: {
          status: status,
        },
      },
      { new: true }
    );
    res.json(updateStatus);
  } catch (error) {}
};

module.exports = {
  orderCart,
  getOrderCart,
  emptyCart,
  applyDiscount,
  createOrder,
  getSingleOrder,
  updateOrderStatus,
  getAllOrders,
  getOrderById,
  removeProductFromCart,
};
