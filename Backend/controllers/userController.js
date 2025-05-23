const User = require("../models/user");
const bcrypt = require("bcryptjs");
const mongoose = require("mongoose");

// Add a new user (HOD and Technical Officer)
const addUser = async (req, res) => {
  try {
    const { FirstName, LastName, Title, Email, Role, Password, studentId } = req.body;
    const hashedPassword = await bcrypt.hash(Password, 10);

    const newUser = new User({
      FirstName,
      LastName,
      Title,
      Email,
      Role,
      Password: hashedPassword,
      studentId,
      // StudentID: Role === "student" ? StudentID : undefined,
    });

    await newUser.save();
    res
      .status(201)
      .send({ message: "User added successfully.", user: newUser });
  } catch (error) {
    res.status(400).send({ error: error.message });
  }
};

// Retrieve all users (HOD and Technical Officer)
const getAllUsers = async (req, res) => {
  try {
    const users = await User.find();
    res.status(200).send(users);
  } catch (error) {
    res.status(400).send({ error: error.message });
  }
};

// Update a user by ID (HOD and Technical Officer)
const updateUser = async (req, res) => {
  try {
    const { id } = req.params;
    const updates = req.body;

    if (updates.Password) {
      updates.Password = await bcrypt.hash(updates.Password, 10); // Hash password if it's being updated
    }

    const updatedUser = await User.findByIdAndUpdate(id, updates, {
      new: true,
    });

    if (!updatedUser) {
      return res.status(404).send("User not found.");
    }

    res.status(200).send(updatedUser);
  } catch (error) {
    res.status(400).send({ error: error.message });
  }
};

// Delete a user by ID (HOD and Technical Officer)
const deleteUser = async (req, res) => {
  try {
    const { id } = req.params;
    const user = await User.findByIdAndDelete(id);

    if (!user) {
      return res.status(404).send("User not found.");
    }

    res.status(200).send({ message: "User deleted successfully." });
  } catch (error) {
    res.status(400).send({ error: error.message });
  }
};
const getOneUser = async (req, res) => {
  try {
    const user = await User.findById(req.user.userId);
    if (!user) return res.status(404).json({ message: "user not found" });
    res.json(user);
  } catch (error) {
    res.status(500).json({ message: "Server Error ", error });
  }
};

const router = require("express").Router();
const multer = require("multer");
const csv = require("csv-parser");
//const bcrypt = require("bcryptjs");
const nodemailer = require("nodemailer");
const stream = require("stream");
const { authenticateToken, authorizeRoles } = require("../middleware/authMiddleware");

// Configure email transporter
const transporter = nodemailer.createTransport({
  service: "gmail",
  auth: {
    user: process.env.EMAIL_USER,
    pass: process.env.EMAIL_PASS
  }
});

// Bulk import endpoint
router.post("/bulk-import",
  authenticateToken,
  authorizeRoles("technical officer", "hod"),
  multer().single("csv"),
  async (req, res) => {
    const results = [];
    const errors = [];
    const bufferStream = new stream.PassThrough();
    bufferStream.end(req.file.buffer);

    bufferStream
      .pipe(csv())
      .on("data", async (row) => {
        try {
          // Generate default password
          const username = row.Email.split("@")[0];
          const tempPassword = `${username}@${Math.random().toString(36).slice(-4)}`;
          const hashedPassword = await bcrypt.hash(tempPassword, 10);

          // Create user object
          const userData = {
            FirstName: row.FirstName,
            LastName: row.LastName,
            Title: row.Title,
            Email: row.Email,
            Role: row.Role,
            Password: hashedPassword,
            temporaryPassword: true,
          };

          // Add student-specific fields
          if (row.Role === "student") {
            userData.studentId = row.StudentID;
          }

          // Save user
          const user = new User(userData);
          await user.save();

          // Send email
          await transporter.sendMail({
            to: row.Email,
            subject: "Your Lab System Credentials",
            html: `<p>Welcome to the Lab Management System!</p>
                  <p>Username: ${row.Email}</p>
                  <p>Temporary Password: ${tempPassword}</p>
                  <p>Please change your password after first login.</p>`
          });

          results.push({ success: true, email: row.Email });
        } catch (error) {
          errors.push({ error: error.message, row });
        }
      })
      .on("end", () => {
        res.status(207).json({
          successCount: results.length,
          errorCount: errors.length,
          results,
          errors
        });
      });
  }
);

// Get user statistics for dashboard
const getUserStats = async (req, res) => {
  try {
    const { startDate, endDate } = req.query;
    
    // Get total number of users
    const totalUsers = await User.countDocuments();
    
    // Get newly added users within date range
    const dateFilter = {};
    if (startDate && endDate) {
      dateFilter._id = {
        $gte: mongoose.Types.ObjectId.createFromTime(new Date(startDate).getTime() / 1000),
        $lte: mongoose.Types.ObjectId.createFromTime(new Date(endDate).getTime() / 1000)
      };
    } else if (startDate) {
      dateFilter._id = {
        $gte: mongoose.Types.ObjectId.createFromTime(new Date(startDate).getTime() / 1000)
      };
    } else if (endDate) {
      dateFilter._id = {
        $lte: mongoose.Types.ObjectId.createFromTime(new Date(endDate).getTime() / 1000)
      };
    }
    
    const newUsers = await User.countDocuments(dateFilter);
    
    // Get active users in the last 30 minutes
    // This requires a lastActive field in the user model, typically updated on each login
    // For demo purposes, we'll use lastPasswordChange as a proxy
    const thirtyMinutesAgo = new Date();
    thirtyMinutesAgo.setMinutes(thirtyMinutesAgo.getMinutes() - 30);
    
    const activeUsers = await User.countDocuments({
      lastPasswordChange: { $gte: thirtyMinutesAgo }
    });
    
    // Get user distribution by role
    const roleDistribution = await User.aggregate([
      { $group: { _id: "$Role", count: { $sum: 1 } } },
      { $sort: { count: -1 } }
    ]);
    
    res.status(200).json({
      totalUsers,
      newUsers,
      activeUsers,
      roleDistribution
    });
    
  } catch (error) {
    console.error("Error fetching user statistics:", error);
    res.status(500).json({ error: "Failed to fetch user statistics" });
  }
};

module.exports = { addUser, getAllUsers, updateUser, deleteUser, getOneUser, getUserStats };
