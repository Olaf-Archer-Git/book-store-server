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
  getOrderById,
} = require("../controllers/orderCtrl");

router.post("/cart", authMiddleware, orderCart);
router.post("/cart/discount", authMiddleware, applyDiscount);
router.post("/cash-order", authMiddleware, createOrder);
router.post("/orderById/:id", authMiddleware, adminMiddleware, getAllOrders);
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
