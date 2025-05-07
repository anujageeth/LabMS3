const mongoose = require("mongoose");

const checkInOutSchema = new mongoose.Schema({
  user: { 
    type: mongoose.Schema.Types.ObjectId,
    ref: "User",
    required: true
  },
  equipment: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "Equipment",
    required: true
  },
  action: {
    type: String,
    enum: ["checkin", "checkout"],
    required: true
  },
  selectedUser: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "User",
    required: true
  },
  timestamp: {
    type: Date,
    default: Date.now
  },
  damageDescription: String,
  notes: String
}, { timestamps: true });

// Simple date formatter
checkInOutSchema.methods.getFormattedDate = function() {
  return this.timestamp.toLocaleString();
};

const CheckInOut = mongoose.model("CheckInOut", checkInOutSchema);
module.exports = CheckInOut;