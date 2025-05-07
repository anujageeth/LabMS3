const express = require("express");
const {
    getBookingsByDate,
    createBooking,
    deleteBooking,
    createStudentBooking
} = require("../controllers/bookingController");

const router = express.Router();

// Get bookings for a specific date
router.get("/bookings", getBookingsByDate);

// Create a new booking
router.post("/bookings", createBooking);

// Student booking endpoint
router.post("/bookings/student", createStudentBooking);

// Delete a booking by ID
router.delete("/bookings/:id", deleteBooking);

module.exports = router;