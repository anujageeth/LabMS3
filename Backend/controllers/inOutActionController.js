// const express = require("express");
// const router = express.Router();
// const CheckinCheckout = require("../models/checkinCheckout");
// const Equipment = require("../models/equipment");

// // Add a check-in or check-out
// router.post("/checkin-checkout", async (req, res) => {
//   try {
//     const { equipmentId, username, quantity, action } = req.body;

//     // Validate availability for check-out
//     if (action === "checkout") {
//       const equipment = await Equipment.findById(equipmentId);
//       if (equipment.Quantity < quantity) {
//         return res
//           .status(400)
//           .json({ error: "Insufficient quantity available." });
//       }
//       equipment.Quantity -= quantity;
//       await equipment.save();
//     }

//     // Adjust quantity for check-in
//     if (action === "checkin") {
//       const equipment = await Equipment.findById(equipmentId);
//       equipment.Quantity += quantity;
//       await equipment.save();
//     }

//     const record = new CheckinCheckout({
//       equipment: equipmentId,
//       username,
//       quantity,
//       action,
//     });

//     await record.save();
//     res.status(201).json(record);
//   } catch (error) {
//     res.status(500).json({ error: error.message });
//   }
// });

// // Get all check-in and check-out records
// router.get("/checkin-checkout", async (req, res) => {
//   try {
//     const records = await CheckinCheckout.find()
//       .populate("equipment", "Name Category")
//       .exec();
//     res.json(records);
//   } catch (error) {
//     res.status(500).json({ error: error.message });
//   }
// });

// module.exports = router;
const express = require("express");
const router = express.Router();
const { authenticateToken } = require("../middleware/authMiddleware");
const Equipment = require("../models/equipment");
const selectedUser = require("../models/user")
const CheckInOut = require("../models/checkinCheckout");


// Bulk check-in/check-out
router.post("/checkinout/bulk", authenticateToken, async (req, res) => {
  try {
    const { action, selectedUser, serials, damageDescription, notes } = req.body;
    const results = [];
    
    for (const serial of serials) {
      const equipment = await Equipment.findOne({ Serial: serial });
      
      if (!equipment) {
        results.push({ serial, status: "Equipment not found" });
        continue;
      }

      if (action === "checkout" && !equipment.Availability) {
        results.push({ serial, status: "Already checked out" });
        continue;
      }

      if (action === "checkin" && equipment.Availability) {
        results.push({ serial, status: "Already checked in" });
        continue;
      }

      const record = new CheckInOut({
        user: req.user.userId,
        equipment: equipment._id,
        selectedUser,
        action,
        damageDescription,
        notes
      });

      await record.save();
      
      // Update equipment status
      equipment.Availability = action === "checkin";
      if (action === "checkin" && damageDescription) {
        equipment.condition = "damaged";
      }
      await equipment.save();

      results.push({ serial, status: "Success" });
    }

    res.status(207).json(results);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

// Get all check-in/out records
router.get("/checkinout", authenticateToken, async (req, res) => {
  try {
    const records = await CheckInOut.find()
      .populate("user", "FirstName LastName Email")
      .populate("equipment", "Name Category Serial Brand")
      .populate("selectedUser", "FirstName LastName Email Role");
    res.json(records);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

module.exports = router;