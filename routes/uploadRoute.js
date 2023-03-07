const express = require("express");
const { uploadImages, deleteImages } = require("../controllers/uploadCtrl");
const router = express.Router();
const {
  adminMiddleware,
  authMiddleware,
} = require("../middlewares/authMiddleware");
const {
  uploadPhoto,
  productImgResize,
} = require("../middlewares/uploadImages");

router.post(
  "/",
  authMiddleware,
  adminMiddleware,
  uploadPhoto.array("images", 10),
  productImgResize,
  uploadImages
);

router.delete("/:id", authMiddleware, adminMiddleware, deleteImages);

module.exports = router;
