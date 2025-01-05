const mongoose = require("mongoose");

const userSchema = new mongoose.Schema({
  FirstName: { type: String, required: true },
  LastName: { type: String, required: true },
  Title: { type: String, required: true },
  Email: { type: String, unique: true, required: [true, "Email is required"] },
  Role: {
    type: String,
    required: [true, "Role is required"],
    // enum: ["lecturer", "hod", "technical officer", "instructors", "student"], // Added 'student' role
    // default: "student",
  },
  Password: { type: String, required: [true, "Password is required"] },
  
});

const User = mongoose.model("User", userSchema);
module.exports = User;
