const express = require("express");
const {
  createUser,
  loginUserCtrl,
  getAllUsers,
  getSingleUser,
  updateUser,
  blockUser,
  unblockUser,
  deleteUser,
  handleRefreshToken,
  logOutUser,
  updatePassword,
  forgotPasswordToken,
} = require("../controllers/userCtrl");
const router = express.Router();
const {
  authMiddleware,
  adminMiddleware,
} = require("../middlewares/authMiddleware");

router.post("/register", createUser);
router.post("/login", loginUserCtrl);
router.post("/forgot-password", forgotPasswordToken);
router.get("/all-users", getAllUsers);
router.get("/refresh", handleRefreshToken);
router.get("/logout", logOutUser);
router.get("/:id", authMiddleware, adminMiddleware, getSingleUser);
router.put("/edit-user", authMiddleware, updateUser);
router.put("/block-user/:id", authMiddleware, adminMiddleware, blockUser);
router.put("/unblock-user/:id", authMiddleware, adminMiddleware, unblockUser);
router.put("/update-password", authMiddleware, updatePassword);

router.delete("/:id", deleteUser);

module.exports = router;
