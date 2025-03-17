const express = require("express");
const router = express.Router();
const notificationController = require("../controllers/notificationController");
const { authenticateToken, isAdmin } = require("../middleware/authMiddleware");

// Get user notifications
router.get("/notifications", authenticateToken, notificationController.getNotifications);

// Get unread notification count
router.get("/notifications/unread-count", authenticateToken, notificationController.getUnreadCount);

// Mark notification as read
router.put("/notifications/:id/read", authenticateToken, notificationController.markAsRead);

// Mark all notifications as read
router.put("/notifications/read-all", authenticateToken, notificationController.markAllAsRead);

// Create broadcast notification (admin only)
router.post("/notifications/broadcast", authenticateToken, isAdmin, notificationController.createBroadcastNotification);

// Delete notification
router.delete("/notifications/:id", authenticateToken, notificationController.deleteNotification);

// Scheduled job endpoints (should be protected and only called by cron job or admin)
router.post("/notifications/generate-lab-reminders", authenticateToken, notificationController.createUpcomingLabNotifications);
router.post("/notifications/generate-damage-reports", authenticateToken, isAdmin, notificationController.createDamageReportNotifications);

module.exports = router;