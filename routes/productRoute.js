const express = require("express");
const {
  createProduct,
  getProduct,
  getAllProducts,
  productUpdate,
  productDelete,
} = require("../controllers/productCtrl");
const router = express.Router();
const {
  adminMiddleware,
  authMiddleware,
} = require("../middlewares/authMiddleware");

//first of all needs to pass authMiddleware than adminMiddleware
router.post("/", authMiddleware, adminMiddleware, createProduct);
router.get("/", getAllProducts);
router.get("/:id", getProduct);
router.put("/:id", authMiddleware, adminMiddleware, productUpdate);
router.delete("/:id", authMiddleware, adminMiddleware, productDelete);

module.exports = router;
