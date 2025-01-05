const mongoose = require("mongoose");

const labBookingSchema = new mongoose.Schema({
  //BookingID: { type: mongoose.Schema.Types.ObjectId, required: true },
  UserID: { type: mongoose.Schema.Types.ObjectId, ref: "User", required: true },
  Lab: { type: mongoose.Schema.Types.ObjectId, ref: "Lab", required: true },
  TimeSlot: { type: String, required: true },
  Status: { type: String, required: true },
  Date: { type: Date, default: Date.now, required: true },
  RequestDate: { type: Date, default: Date.now, required: true },
});

const LabBooking = mongoose.model("LabBooking", labBookingSchema);
module.exports = LabBooking;
