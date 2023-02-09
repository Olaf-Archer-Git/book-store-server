const express = require("express");
const router = express.Router();
const {
  createDiscount,
  getAllDiscounts,
  deleteDiscounts,
} = require("../controllers/discountCtrl");
const {
  authMiddleware,
  adminMiddleware,
} = require("../middlewares/authMiddleware");

router.post("/", authMiddleware, adminMiddleware, createDiscount);
router.get("/", authMiddleware, adminMiddleware, getAllDiscounts);
router.delete("/:id", authMiddleware, adminMiddleware, deleteDiscounts);


module.exports = router;
