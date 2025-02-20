// const mongoose = require("mongoose");

// const checkinCheckoutSchema = new mongoose.Schema(
//   {
//     equipment: {
//       type: mongoose.Schema.Types.ObjectId,
//       ref: "Equipment",
//       required: true,
//     },
//     username: { type: String, required: true },
//     quantity: { type: Number, required: true },
//     action: { type: String, enum: ["checkin", "checkout"], required: true },
//     date: { type: Date, default: Date.now },
//   },
//   { timestamps: true }
// );

// module.exports = mongoose.model("CheckinCheckout", checkinCheckoutSchema);
//const mongoose = require("mongoose");

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
  date: {
    type: Date,
    default: Date.now
  },
  damageDescription: String,
  notes: String
});

module.exports = mongoose.model("CheckInOut", checkInOutSchema);