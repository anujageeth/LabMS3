

const { authenticateToken } = require("../middleware/authMiddleware");
const express = require("express");
const { getBookingsByDate, createBooking } = require("../controllers/bookingController");

const router = express.Router();

// Get bookings for a specific date
router.get("/bookings", getBookingsByDate);

// Create a new booking
router.post("/bookings", authenticateToken, createBooking);

module.exports = router; 
