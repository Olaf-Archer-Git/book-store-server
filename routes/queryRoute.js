const express = require("express");
const router = express.Router();
const {
  createQuery,
  getSingleQuery,
  getAllQueries,
  updateQuery,
  deleteQuery,
} = require("../controllers/queryCtrl");
const {
  authMiddleware,
  adminMiddleware,
} = require("../middlewares/authMiddleware");

router.post("/", createQuery);
router.get("/", getAllQueries);
router.get("/:id", getSingleQuery);
router.put("/:id", authMiddleware, adminMiddleware, updateQuery);
router.delete("/:id", authMiddleware, adminMiddleware, deleteQuery);

module.exports = router;
