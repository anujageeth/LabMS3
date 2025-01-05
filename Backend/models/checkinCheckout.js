const mongoose = require("mongoose");

const checkinCheckoutSchema = new mongoose.Schema(
  {
    equipment: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Equipment",
      required: true,
    },
    username: { type: String, required: true },
    quantity: { type: Number, required: true },
    action: { type: String, enum: ["checkin", "checkout"], required: true },
    date: { type: Date, default: Date.now },
  },
  { timestamps: true }
);

module.exports = mongoose.model("CheckinCheckout", checkinCheckoutSchema);
