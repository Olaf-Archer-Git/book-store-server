const express = require("express");
const {
  createProduct,
  getProduct,
  getAllProducts,
  productUpdate,
  productDelete,
  addToFavorite,
  totalRating,
} = require("../controllers/productCtrl");
const router = express.Router();
const {
  adminMiddleware,
  authMiddleware,
} = require("../middlewares/authMiddleware"); 


router.post("/", authMiddleware, adminMiddleware, createProduct);
router.get("/", getAllProducts);
router.get("/:id", getProduct);
router.put("/favorite", authMiddleware, addToFavorite);
router.put("/rating", authMiddleware, totalRating);
router.put("/:id", authMiddleware, adminMiddleware, productUpdate);
router.delete("/:id", authMiddleware, adminMiddleware, productDelete);

module.exports = router;
