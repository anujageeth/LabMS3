// models/ReportHistory.js
const mongoose = require("mongoose");

const reportHistorySchema = new mongoose.Schema({
  user: { type: mongoose.Schema.Types.ObjectId, ref: "User", required: true },
  reportType: { type: String, required: true },
  filters: { type: String, default: "None" },
  action: { type: String, required: true },
  createdAt: { type: Date, default: Date.now }
}, {
  timestamps: true // Adds createdAt and updatedAt automatically
});
module.exports = mongoose.model("ReportHistory", reportHistorySchema);