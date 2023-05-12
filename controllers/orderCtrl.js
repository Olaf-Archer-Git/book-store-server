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
  const { id } = req.user;
  const { cashOrder, discountApplied } = req.body;
  validateMongoDB(id);

  try {
    if (!cashOrder) throw new Error("failed to create cash order");
    const user = await User.findById(id);
    const userCart = await Cart.findOne({ orderby: user.id });

    let finalCost = 0;
    if (discountApplied && userCart.totalAfterDiscount) {
      finalCost = userCart.totalAfterDiscount;
    } else {
      finalCost = userCart.cartTotal;
    }

    new Order({
      products: userCart.products,
      paymentIntent: {
        id: uuidv4(),
        method: "cashOrder",
        cost: finalCost,
        status: "Cash on Delivery",
        created: Date.now(),
        currency: "euro",
      },
      orderBy: user.id,
      orderStatus: "Cash on Delivery",
    }).save();

    const updateOrder = userCart.products.map((item) => {
      return {
        updateOne: {
          filter: { id: item.product.id },
          update: { $inc: { quantity: -item.count, sold: +item.count } },
        },
      };
    });

    await Product.bulkWrite(updateOrder, {});
    res.json({ message: "success" });
  } catch (error) {
    throw new Error("create order error");
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
};
