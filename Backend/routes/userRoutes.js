const express = require("express");
const {
  authenticateToken,
  authorizeRoles,
} = require("../middleware/authMiddleware");
const {
  addUser,
  getAllUsers,
  updateUser,
  deleteUser,
  getOneUser,
} = require("../controllers/userController");

const router = express.Router();

// Add a new user (Only HOD and Technical Officer)
router.post(
  "/users",
  authenticateToken,
  authorizeRoles("hod", "technical officer"),
  addUser
);

// Get all users (Only HOD and Technical Officer)
router.get(
  "/users",
  authenticateToken,
  authorizeRoles("hod", "technical officer"),
  getAllUsers
);

// Update a user by ID (Only HOD and Technical Officer)
router.put(
  "/users/:id",
  authenticateToken,
  authorizeRoles("hod", "technical officer"),
  updateUser
);

// Delete a user by ID (Only HOD and Technical Officer)
router.delete(
  "/users/:id",
  authenticateToken,
  authorizeRoles("hod", "technical officer"),
  deleteUser
);

router.get("/users/me", authenticateToken, getOneUser);

module.exports = router;
