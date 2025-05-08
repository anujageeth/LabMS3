const express = require("express");
const bcrypt = require("bcryptjs");
const User = require("../models/user");
const { authenticateToken } = require("../middleware/authMiddleware");

const router = express.Router();

// Change Password Route
router.put("/change", authenticateToken, async (req, res) => {
// router.put("/change", async (req, res) => {
    try {
        const { oldPassword, newPassword, confirmPassword } = req.body;
        const userId = req.user.userId; // Extract user ID from token

        if (!oldPassword || !newPassword || !confirmPassword) {
            return res.status(400).json({ message: "All fields are required." });
        }

        if (newPassword !== confirmPassword) {
            return res.status(400).json({ message: "Passwords do not match." });
        }

        const user = await User.findById(userId);
        if (!user) {
            return res.status(404).json({ message: "User not found." });
        }

        
        // Check if old password is correct
        const isMatch = await bcrypt.compare(oldPassword, user.Password);
        if (!isMatch) {
            return res.status(400).json({ message: "Old password is incorrect." });
        }

        // Hash new password
        const salt = await bcrypt.genSalt(10);
        const hashedPassword = await bcrypt.hash(newPassword, salt);

        // Update user password
        user.Password = hashedPassword;
        await user.save();

        res.json({ message: "Password updated successfully." });
    } catch (error) {
        console.error("Error changing password:", error);
        res.status(500).json({ message: "Server error" });
    }
});

module.exports = router;