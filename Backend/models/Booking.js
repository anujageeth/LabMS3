const mongoose = require("mongoose");

const bookingSchema = new mongoose.Schema({
    labName: { type: String, required: true },
    labPlace: { type: String, required: true },
    date: { type: String, required: true },
    bookedBy: { type: String, required: true },
    timeSlot: { type: String, required: true }, // Time slot (e.g., "8:30-11:30")
    // Lab practical information
    experimentTitle: { type: String, required: false },
    experimentDescription: { type: String, required: false },
    equipmentNeeded: { type: String, required: false },
    module: { type: String, required: false }
});

module.exports = mongoose.model("Booking", bookingSchema); 

// const mongoose = require("mongoose");

// const bookingSchema = new mongoose.Schema({
//     labName: { type: String, required: true },
//     labPlace: { type: String, required: true },
//     date: { type: String, required: true },
//     bookedBy: { type: String, required: true },
//     time: { type: String, required: true }, // Start time
//     duration: { type: Number, required: true }, // Duration in hours
// });

// module.exports = mongoose.model("Booking", bookingSchema);