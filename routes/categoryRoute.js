const express = require("express");
const router = express.Router();
const {
  createCategory,
  updateCategory,
  deleteCategory,
  getCategory,
  getAllCategories,
} = require("../controllers/categoryCtrl");
const {
  authMiddleware,
  adminMiddleware,
} = require("../middlewares/authMiddleware");

router.post("/", authMiddleware, adminMiddleware, createCategory);
router.put("/:id", authMiddleware, adminMiddleware, updateCategory);
router.get("/:id", getCategory);
router.get("/", getAllCategories);

router.delete("/:id", authMiddleware, adminMiddleware, deleteCategory);

module.exports = router;
