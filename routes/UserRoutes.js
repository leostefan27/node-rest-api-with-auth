const express = require("express");
const router = express.Router();
const {
  getCurrentUser,
  createUser,
  loginUser,
  logoutUser,
  updateUser,
  deleteUser,
} = require("../controllers/UserController");
const protect = require("../middlewares/AuthMiddleware");

router.post("/register", createUser);
router.post("/login", loginUser);
router.post("/logout", logoutUser);
router.get("/me", protect, getCurrentUser);
router.put("/edit/:id", protect, updateUser);
router.delete("/delete/:id", protect, deleteUser);

module.exports = router;
