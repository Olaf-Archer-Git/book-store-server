const express = require("express");
const router = express.Router();
const {
  authMiddleware,
  adminMiddleware,
} = require("../middlewares/authMiddleware");
const {
  orderCart,
  getOrderCart,
  emptyCart,
  applyDiscount,
  createOrder,
  getSingleOrder,
  updateOrderStatus,
  getAllOrders,
} = require("../controllers/orderCtrl");

router.post("/cart", authMiddleware, orderCart);
router.post("/cart/discount", authMiddleware, applyDiscount);
router.post("/cash-order", authMiddleware, createOrder);
/////
router.get("/cart", authMiddleware, adminMiddleware, getOrderCart);
///
router.get("/all-orders", authMiddleware, getAllOrders);
router.get("/single-order", authMiddleware, getSingleOrder);

router.put(
  "/update-order/:id",
  authMiddleware,
  adminMiddleware,
  updateOrderStatus
);

router.delete("/empty-cart", authMiddleware, emptyCart);

module.exports = router;
