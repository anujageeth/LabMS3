// const mongoose = require("mongoose");

// const userSchema = new mongoose.Schema({
//   FirstName: { type: String, required: true },
//   LastName: { type: String, required: true },
//   Title: { type: String, required: true },
//   Email: { type: String, unique: true, required: [true, "Email is required"] },
//   Role: {
//     type: String,
//     required: [true, "Role is required"],
//     // enum: ["lecturer", "hod", "technical officer", "instructors", "student"], // Added 'student' role
//     // default: "student",
//   },
//   Password: { type: String, required: [true, "Password is required"] },
  
// });

// const User = mongoose.model("User", userSchema);
// module.exports = User;

const mongoose = require("mongoose");

const userSchema = new mongoose.Schema({
  FirstName: { type: String, required: true },
  LastName: { type: String, required: true },
  Title: { type: String },
  Email: { 
    type: String, 
    unique: true, 
    required: true,
    match: [/^[^\s@]+@[^\s@]+\.[^\s@]+$/, "Invalid email format"]
  },
  Role: {
    type: String,
    required: true,
    enum: ["student", "lecturer", "hod", "technical officer", "instructor"]
  },
  Password: { type: String, required: true },
  studentId: { type: String, sparse: true },
  temporaryPassword: { type: Boolean, default: true },
  lastPasswordChange: Date
});

module.exports = mongoose.model("User", userSchema);
