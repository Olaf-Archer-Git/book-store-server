const express = require("express");
const router = express.Router();
const {
  adminMiddleware,
  authMiddleware,
} = require("../middlewares/authMiddleware");
const {
  createBlog,
  updateBlog,
  getAllBlogs,
  getBlog,
  blogLikes,
  blogDislikes,
  deleteBlog,
} = require("../controllers/blogCtrl");

router.post("/", authMiddleware, adminMiddleware, createBlog);
router.put("/likes", authMiddleware, blogLikes);
router.put("/dislikes", authMiddleware, blogDislikes);

router.put("/:id", authMiddleware, adminMiddleware, updateBlog);
router.get("/", getAllBlogs);
router.get("/:id", getBlog);

router.delete("/:id", authMiddleware, adminMiddleware, deleteBlog);

module.exports = router;
