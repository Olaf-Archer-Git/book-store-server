const express = require("express");
const {
  createProduct,
  getProduct,
  getAllProducts,
  productUpdate,
  productDelete,
  addToFavorite,
  totalRating,
  uploadImages,
} = require("../controllers/productCtrl");
const router = express.Router();
const {
  adminMiddleware,
  authMiddleware,
} = require("../middlewares/authMiddleware");
const {
  uploadPhoto,
  productImgResize,
} = require("../middlewares/uploadImages");

router.post("/", authMiddleware, adminMiddleware, createProduct);
router.get("/", getAllProducts);
router.get("/:id", getProduct);
router.put(
  "/upload/:id",
  authMiddleware,
  adminMiddleware,
  uploadPhoto.array("images", 10),
  productImgResize,
  uploadImages
);
router.put("/favorite", authMiddleware, addToFavorite);
router.put("/rating", authMiddleware, totalRating);
router.put("/:id", authMiddleware, adminMiddleware, productUpdate);

router.delete("/:id", authMiddleware, adminMiddleware, productDelete);

module.exports = router;
