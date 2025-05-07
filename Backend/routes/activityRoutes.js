// routes/activityRoutes.js
const express = require("express");
const router = express.Router();
const Activity = require("../models/Activity");

router.post("/add", async (req, res) => {
  const { user, action } = req.body;
  try {
    const newActivity = new Activity({ user, action });
    await newActivity.save();
    res.status(201).json(newActivity);
  } catch (err) {
    res.status(500).json({ message: "Failed to log activity" });
  }
});

router.get("/recent", async (req, res) => {
  try {
    const activities = await Activity.find().sort({ createdAt: -1 }).limit(5);
    res.json(activities);
  } catch (err) {
    res.status(500).json({ message: "Failed to fetch activities" });
  }
});

module.exports = router;
