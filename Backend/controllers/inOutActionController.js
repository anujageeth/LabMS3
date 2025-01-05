const express = require("express");
const router = express.Router();
const CheckinCheckout = require("../models/checkinCheckout");
const Equipment = require("../models/equipment");

// Add a check-in or check-out
router.post("/checkin-checkout", async (req, res) => {
  try {
    const { equipmentId, username, quantity, action } = req.body;

    // Validate availability for check-out
    if (action === "checkout") {
      const equipment = await Equipment.findById(equipmentId);
      if (equipment.Quantity < quantity) {
        return res
          .status(400)
          .json({ error: "Insufficient quantity available." });
      }
      equipment.Quantity -= quantity;
      await equipment.save();
    }

    // Adjust quantity for check-in
    if (action === "checkin") {
      const equipment = await Equipment.findById(equipmentId);
      equipment.Quantity += quantity;
      await equipment.save();
    }

    const record = new CheckinCheckout({
      equipment: equipmentId,
      username,
      quantity,
      action,
    });

    await record.save();
    res.status(201).json(record);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// Get all check-in and check-out records
router.get("/checkin-checkout", async (req, res) => {
  try {
    const records = await CheckinCheckout.find()
      .populate("equipment", "Name Category")
      .exec();
    res.json(records);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

module.exports = router;
