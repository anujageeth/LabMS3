require("dotenv").config();
const express = require("express");
const mongoose = require("mongoose");
const cors = require("cors");
const equipmentRoutes = require("./routes/equipmentRoutes");
const authRoutes = require("./routes/authRoutes");
const userRoutes = require("./routes/userRoutes");
const categoryRoutes = require("./controllers/categoryController");
const reportRoutes = require("./controllers/reportGenerateController");
const checkinCheckoutRoutes = require("./controllers/inOutActionController");
const bcrypt = require("bcryptjs");
const User = require("./models/user");
const bookingRoutes = require("./routes/bookingRoutes");
const updatePassword = require("./routes/Password");
const notificationRoutes = require("./routes/notificationRoutes");
const consumableRoutes = require('./routes/consumableRoutes');
const academicDetailsRoutes = require('./routes/academicDetailsRoutes');
const cron = require("node-cron");
const NotificationService = require("./services/NotificationService");

const app = express();

app.use(cors({
  origin: [
    "http://localhost:3000",
    "https://drive.google.com",
    "https://firebasestorage.googleapis.com",
    "https://ssl.gstatic.com",
  ],
  methods: ["GET", "POST", "PUT", "DELETE"],
  allowedHeaders: ["Content-Type", "Authorization"],
}));

app.use(express.json());
app.use("/api", equipmentRoutes);
app.use("/api", userRoutes);
app.use("/api", authRoutes);
app.use("/api", categoryRoutes);
app.use("/api", reportRoutes);
app.use("/api", checkinCheckoutRoutes);
app.use("/api", bookingRoutes);
app.use("/api/update", updatePassword);
app.use("/api", notificationRoutes);
app.use("/api/consumables", consumableRoutes);
app.use("/api/academic-details", academicDetailsRoutes);

// Connect to MongoDB
mongoose
  .connect(process.env.MONGO_URI)
  .then(async () => {
    console.log("MongoDB connected");
    
    // Check for existing admin users
    const adminExists = await User.exists({ 
      Role: { $in: ["hod", "technical officer"] } 
    });

    if (!adminExists) {
      const defaultPassword = process.env.DEFAULT_ADMIN_PASSWORD || "ruhuna";
      const hashedPassword = await bcrypt.hash(defaultPassword, 10);
      
      const adminUser = new User({
        FirstName: process.env.DEFAULT_ADMIN_FIRSTNAME || "Admin",
        LastName: process.env.DEFAULT_ADMIN_LASTNAME || "User",
        Title: process.env.DEFAULT_ADMIN_TITLE || "Dr.",
        Email: process.env.DEFAULT_ADMIN_EMAIL || "admin@example.com",
        Role: "hod",
        Password: hashedPassword,
        studentId: null,
        temporaryPassword: true
      });

      await adminUser.save();
      console.log("Default admin user created with temporary password");
    }
  })
  .catch((error) => console.log(error));

// Schedule jobs to run at specific times
// This runs at 6:00 PM every day to notify about tomorrow's labs
cron.schedule("0 18 * * *", async () => {
  try {
    console.log("Running scheduled job: Create upcoming lab notifications");
    await NotificationService.createUpcomingLabNotifications();
  } catch (error) {
    console.error("Error running scheduled job:", error);
  }
});

// This runs at 9:00 AM every Monday to report damaged equipment
cron.schedule("0 9 * * 1", async () => {
  try {
    console.log("Running scheduled job: Create damage report notifications");
    await NotificationService.createDamageReportNotifications();
  } catch (error) {
    console.error("Error running scheduled job:", error);
  }
});

// Start the server
const port = process.env.PORT || 3001;
app.listen(port, () => {
  console.log(`Server running on port ${port}`);
});


