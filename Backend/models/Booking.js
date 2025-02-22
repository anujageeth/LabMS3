
const mongoose = require("mongoose");

const bookingSchema = new mongoose.Schema({
    user: { 
        type: mongoose.Schema.Types.ObjectId,
        ref: "User",
        required: true
      },
    labName: { type: String, required: true },
    labPlace: { type: String, required: true },
    date: { type: String, required: true },
    // bookedBy: { type: String, required: true },
    time: { type: String, required: true }, // Start time
    duration: { type: Number, required: true }, // Duration in hours
});

module.exports = mongoose.model("Booking", bookingSchema); 