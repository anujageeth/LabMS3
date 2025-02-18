require("dotenv").config();
const express = require("express");
const mongoose = require("mongoose");
const cors = require("cors");
const equipmentRoutes = require("./routes/equipmentRoutes");
const authRoutes = require("./routes/authRoutes");
const userRoutes = require("./routes/userRoutes");
//const fireImageRoutes = require("./controllers/fireImageController");
const categoryRoutes = require("./controllers/categoryController");
const reportRoutes = require("./controllers/reportGenerateController");
const checkinCheckoutRoutes = require("./controllers/inOutActionController");
const bcrypt = require("bcryptjs");
const User = require("./models/user");
const bookingRoutes = require("./routes/bookingRoutes");

const app = express();
app.use(cors());
 app.use(
   cors({
     origin: [
       "http://localhost:3000",
       "https://drive.google.com",
       "https://firebasestorage.googleapis.com",
       "https://ssl.gstatic.com",
     ], // Allow only these domains
     methods: ["GET", "POST", "PUT", "DELETE"],
     allowedHeaders: ["Content-Type", "Authorization"],
   })
 );

app.use(express.json());
app.use("/api", equipmentRoutes);
app.use("/api", userRoutes);
app.use("/api", authRoutes); // Include user routes
//app.use("/api", fireImageRoutes);
app.use("/api", categoryRoutes);
app.use("/api", reportRoutes);
app.use("/api", checkinCheckoutRoutes);
app.use("/api",bookingRoutes);

// Connect to MongoDB
mongoose
  .connect(process.env.MONGO_URI)
  .then(() => console.log("MongoDB connected"))
  .catch((error) => console.log(error));

// Start the server
const port = process.env.PORT || 3000;
app.listen(port, () => {
  console.log(`Server running on port ${port}`);
});

//  async function insertHodUser() {
//   try {
//      const hashedPassword = await bcrypt.hash("ruhuna", 10); // Hash the password

//      const hodUser = new User({
//      FirstName: "John",
//        LastName: "Doe",
//        Title: "Dr.",
//      Email: "johndoe@example.com",
//        Role: "hod",
//        Password: hashedPassword, // Store the hashed password
//        StudentID: null, // HOD doesn't need StudentID, can set to null
//     });

//     const savedUser = await hodUser.save();
//     console.log("HOD user inserted:", savedUser);
//    } catch (error) {
//    console.error("Error inserting HOD user:", error.message);
//    }
// }

// //Call the function to insert the HOD
// insertHodUser();
