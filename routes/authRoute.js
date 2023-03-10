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
  resetPassword,
  loginAdminCtrl,
  getFavoriteList,
  saveUserAddress,
} = require("../controllers/userCtrl");
const router = express.Router();
const {
  authMiddleware,
  adminMiddleware,
} = require("../middlewares/authMiddleware");

/////////////////
router.post("/register", createUser);
router.post("/forgot-password", forgotPasswordToken);
router.post("/login", loginUserCtrl);
router.post("/login-admin", loginAdminCtrl);

router.get("/all-users", getAllUsers);
router.get("/favorite", authMiddleware, getFavoriteList);
router.get("/refresh", handleRefreshToken);
router.get("/logout", logOutUser);
router.get("/:id", authMiddleware, adminMiddleware, getSingleUser);

router.put("/edit-user", authMiddleware, updateUser);
router.put("/save-address", authMiddleware, saveUserAddress);
router.put("/block-user/:id", authMiddleware, adminMiddleware, blockUser);
router.put("/unblock-user/:id", authMiddleware, adminMiddleware, unblockUser);
router.put("/update-password", authMiddleware, updatePassword);
router.put("/reset-password/:token", resetPassword);

router.delete("/:id", deleteUser);

module.exports = router;
