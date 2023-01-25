const express = require("express");
const {
  createUser,
  loginUserCtrl,
  getAllUsers,
  getSingleUser,
  deleteUser,
} = require("../controllers/userCtrl");
const router = express.Router();

router.post("/register", createUser);
router.post("/login", loginUserCtrl);
router.get("/all-users", getAllUsers);
router.get("/:id", getSingleUser);
router.delete("/:id", deleteUser);

module.exports = router;
