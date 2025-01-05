const mongoose = require("mongoose");

const feedbackSchema = new mongoose.Schema({
  //FeedBackID: { type: mongoose.Schema.Types.ObjectId, required: true },
  UserID: { type: mongoose.Schema.Types.ObjectId, ref: "User", required: true },
  Description: { type: String, required: true },
  Date: { type: Date, default: Date.now, required: true },
});

const Feedback = mongoose.model("Feedback", feedbackSchema);
module.exports = Feedback;
