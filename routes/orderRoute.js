const express = require("express");
const router = express.Router();
const { authMiddleware } = require("../middlewares/authMiddleware");
const {
  orderCart,
  getOrderCart,
  emptyCart,
} = require("../controllers/orderCtrl");

router.post("/cart", authMiddleware, orderCart);

router.get("/cart", authMiddleware, getOrderCart);

router.delete("/empty-cart", authMiddleware, emptyCart);

module.exports = router;
