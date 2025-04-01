


// const express = require("express");
// const { getBookingsByDate, createBooking } = require("../controllers/bookingController");

// const router = express.Router();

// // Get bookings for a specific date
// router.get("/bookings", getBookingsByDate);

// // Create a new booking
// router.post("/bookings", createBooking);

// module.exports = router; 

const express = require("express");
const {
    getBookingsByDate,
    createBooking,
    deleteBooking, // Import the delete function
    createStudentBooking // Add the new controller
} = require("../controllers/bookingController");

const router = express.Router();

// Get bookings for a specific date
router.get("/bookings", getBookingsByDate);

// Create a new booking
router.post("/bookings", createBooking);

// Create a new student booking request
router.post("/bookings/student", createStudentBooking);


// Delete a booking by ID
router.delete("/bookings/:id", deleteBooking); // Add this route

module.exports = router;