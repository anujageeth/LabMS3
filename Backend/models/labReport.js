const mongoose = require("mongoose");

const labReportSchema = new mongoose.Schema({
  // ReportID: { type: mongoose.Schema.Types.ObjectId, required: true },
  UserID: { type: mongoose.Schema.Types.ObjectId, ref: "User", required: true },
  Description: { type: String, required: true },
  Date: { type: Date, required: true, default: Date.now },
  //PDF: { type: String, required: true, default }, // Assuming you'll store the PDF as a binary file
});

const GeneratedLabReport = mongoose.model("labReport", labReportSchema);
module.exports = GeneratedLabReport;
