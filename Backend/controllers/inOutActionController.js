const express = require("express");
const router = express.Router();
const { authenticateToken } = require("../middleware/authMiddleware");
const Equipment = require("../models/equipment");
const User = require("../models/user")
const CheckInOut = require("../models/checkinCheckout");
const NotificationService = require("../services/NotificationService");


// Bulk check-in/check-out
router.post("/checkinout/bulk", authenticateToken, async (req, res) => {
  try {
    const { action, selectedUser, serials, damageDescription, notes } = req.body;

    // Validate input
    if (!Array.isArray(serials) || serials.length === 0) {
      return res.status(400).json({ message: "Serials must be a non-empty array" });
    }
    if (!["checkin", "checkout"].includes(action)) {
      return res.status(400).json({ message: "Invalid action. Must be 'checkin' or 'checkout'" });
    }

    const results = [];
    const errors = [];

    for (const serial of serials) {
      try {
        const equipment = await Equipment.findOne({ Serial: serial });

        if (!equipment) {
          errors.push({ serial, error: "Equipment not found" });
          continue;
        }

        if (action === "checkout" && !equipment.Availability) {
          errors.push({ serial, error: "Already checked out" });
          continue;
        }

        if (action === "checkin" && equipment.Availability) {
          errors.push({ serial, error: "Already checked in" });
          continue;
        }

        // Create check-in/out record
        const record = new CheckInOut({
          user: req.user.userId,
          equipment: equipment._id,
          action,
          selectedUser,
          damageDescription,
          notes
        });

        await record.save();

        // Update equipment status
        equipment.Availability = action === "checkin";
        if (action === "checkin" && damageDescription) {
          equipment.condition = "damaged";
        }
        await equipment.save();

        // Create notification
        try {
          await NotificationService.createCheckInOutNotification(record);
        } catch (notificationError) {
          console.error("Notification error:", notificationError.message);
        }

        results.push({ serial, status: "Success" });
      } catch (itemError) {
        errors.push({ serial, error: itemError.message });
      }
    }

    // Return a summary response
    res.status(200).json({
      results,
      errors,
      summary: {
        total: serials.length,
        successful: results.length,
        failed: errors.length
      }
    });
  } catch (error) {
    console.error("Bulk check-in/out error:", error.message);
    res.status(500).json({ message: "Internal server error", error: error.message });
  }
});

// Get all check-in/out records with filters, pagination, and sorting
router.get("/checkinout", authenticateToken, async (req, res) => {
  try {
    const {
      page = 1, // Default to page 1
      limit = 10, // Default to 10 records per page
      sortBy = "timestamp", // Default sorting field
      sortOrder = "desc", // Default sorting order
      action, // Filter by action (checkin/checkout)
      user, // Filter by user ID
      equipment, // Filter by equipment ID
      startDate, // Filter by start date
      endDate // Filter by end date
    } = req.query;

    // Build the filter object
    const filter = {};
    if (action) filter.action = action;
    if (user) filter.user = user;
    if (equipment) filter.equipment = equipment;
    if (startDate || endDate) {
      filter.timestamp = {};
      if (startDate) filter.timestamp.$gte = new Date(startDate);
      if (endDate) filter.timestamp.$lte = new Date(endDate);
    }

    // Role-based access control
    // Get the user's role from the authenticated user information
    const currentUser = await User.findById(req.user.userId);
    
    // If user is not a TO or HOD, limit view to only their records
    if (currentUser && currentUser.Role !== 'technical officer' && currentUser.Role !== 'hod') {
      // Regular users can only see their own records (either as user or selectedUser)
      filter.$or = [
        { user: req.user.userId },
        { selectedUser: req.user.userId }
      ];
    }

    // Calculate pagination
    const skip = (parseInt(page) - 1) * parseInt(limit);
    const sort = { [sortBy]: sortOrder === "desc" ? -1 : 1 };

    // Fetch records with filters, pagination, and sorting
    const [records, total] = await Promise.all([
      CheckInOut.find(filter)
        .sort(sort)
        .skip(skip)
        .limit(parseInt(limit))
        .populate("user", "FirstName LastName Email")
        .populate("equipment", "Name Category Serial Brand")
        .populate("selectedUser", "FirstName LastName Email Role"),
      CheckInOut.countDocuments(filter)
    ]);

    // Return paginated response with user role for frontend context
    res.status(200).json({
      records,
      pagination: {
        total,
        pages: Math.ceil(total / parseInt(limit)),
        currentPage: parseInt(page),
        limit: parseInt(limit)
      },
      userRole: currentUser ? currentUser.Role : null // Include user role for frontend rendering
    });
  } catch (error) {
    console.error("Error fetching check-in/out records:", error.message);
    res.status(500).json({ message: "Internal server error", error: error.message });
  }
});

module.exports = router;