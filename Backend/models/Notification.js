const mongoose = require("mongoose");

const notificationSchema = new mongoose.Schema(
  {
    recipient: { 
      type: mongoose.Schema.Types.ObjectId, 
      ref: "User",
      required: true 
    },
    type: { 
      type: String, 
      enum: ["lab_reminder", "equipment_checkout", "equipment_checkin", "damage_report", "broadcast"],
      required: true 
    },
    title: { 
      type: String, 
      required: true 
    },
    message: { 
      type: String, 
      required: true 
    },
    relatedItem: { 
      // Could be a lab booking ID, equipment ID, etc.
      type: mongoose.Schema.Types.ObjectId,
      refPath: "itemModel"
    },
    itemModel: {
      // Defines which model the relatedItem refers to
      type: String,
      enum: ["Booking", "Equipment", "CheckInOut"]
    },
    isRead: { 
      type: Boolean, 
      default: false 
    },
    isBroadcast: {
      type: Boolean,
      default: false
    },
    sender: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User"
    },
    adminOnly: {
      type: Boolean,
      default: false
    }
  },
  { timestamps: true }
);

// Create a compound index for efficiently querying notifications for a user
notificationSchema.index({ recipient: 1, isRead: 1, createdAt: -1 });

const Notification = mongoose.model("Notification", notificationSchema);
module.exports = Notification;