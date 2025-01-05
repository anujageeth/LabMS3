const express = require("express");
const { registerUser, loginUser } = require("../controllers/authController");
const { authenticateToken } = require("../middleware/authMiddleware");

const router = express.Router();

// User registration and login routes
router.post("/register", registerUser);
router.post("/login", loginUser, authenticateToken);

module.exports = router;
