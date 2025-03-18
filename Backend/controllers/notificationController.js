const Notification = require("../models/Notification");
const User = require("../models/user");
const NotificationService = require("../services/NotificationService");

exports.getNotifications = async (req, res) => {
  try {
    const { page = 1, limit = 10, unreadOnly = false } = req.query;
    const userId = req.user.userId;
    
    const query = { recipient: userId };
    if (unreadOnly === "true") {
      query.isRead = false;
    }
    
    const notifications = await Notification.find(query)
      .sort({ createdAt: -1 })
      .skip((page - 1) * limit)
      .limit(parseInt(limit, 10))
      .populate("sender", "FirstName LastName");
    
    const count = await Notification.countDocuments(query);
    
    res.status(200).json({
      notifications,
      totalPages: Math.ceil(count / limit),
      currentPage: page,
      totalNotifications: count
    });
  } catch (error) {
    console.error("Error fetching notifications:", error);
    res.status(500).json({ message: "Error fetching notifications" });
  }
};

exports.getUnreadCount = async (req, res) => {
  try {
    const userId = req.user.userId;
    const count = await Notification.countDocuments({ 
      recipient: userId, 
      isRead: false 
    });
    
    res.status(200).json({ unreadCount: count });
  } catch (error) {
    console.error("Error fetching unread count:", error);
    res.status(500).json({ message: "Error fetching unread count" });
  }
};

exports.markAsRead = async (req, res) => {
    try {
      const { id } = req.params;
      const userId = req.user.userId;
      
      const notification = await NotificationService.markAsRead(id, userId);
      
      if (!notification) {
        return res.status(404).json({ message: "Notification not found" });
      }
      
      res.status(200).json({ message: "Notification marked as read" });
    } catch (error) {
      console.error("Error marking notification as read:", error);
      res.status(500).json({ message: "Error marking notification as read" });
    }
  };

exports.markAllAsRead = async (req, res) => {
  try {
    const userId = req.user.userId;
    
    const result = await NotificationService.markAllAsRead(userId);
    
    res.status(200).json({ 
        message: "All notifications marked as read",
        updatedCount: result.modifiedCount 
      });
  } catch (error) {
    console.error("Error marking all notifications as read:", error);
    res.status(500).json({ message: "Error marking all notifications as read" });
  }
};

exports.createBroadcastNotification = async (req, res) => {
    try {
      const { title, message, recipientRoles } = req.body;
      const senderId = req.user.userId;
      
      if (!title || !message) {
        return res.status(400).json({ message: "Title and message are required" });
      }
      
      let recipients = [];
      
      // If specific roles are provided, filter users by role
      if (recipientRoles && recipientRoles.length > 0) {
        const users = await User.find({ Role: { $in: recipientRoles } &&  {$in: ["hod", "technical officer"]} });
        recipients = users.map(user => user._id);
      } else {
        // Otherwise, send to all users
        const users = await User.find();
        recipients = users.map(user => user._id);
      }
  
      // Create notifications for all recipients
      const notifications = await NotificationService.createBroadcastNotification({
        title,
        message,
        sender: senderId,
        type: 'broadcast'
      }, recipients);

      // const admins = await User.find({ 
      //   Role: { $in: ["hod", "technical officer"] } 
      // });
      
      // for (const admin of admins) {
      //   await NotificationService.createNotification({
      //     recipient: admin._id,
      //     type: "broadcast",
      //     title: "Message broadcasted   successfully",
      //     message: `Title : ${data.title}`,
      //     adminOnly: true,
      //     isRead: false
      //   });
      // }
  
      res.status(201).json({ 
        message: "Broadcast notification sent successfully",
        notifications 
      });
  
    } catch (error) {
      console.error("Error creating broadcast notification:", error);
      res.status(500).json({ message: "Error creating broadcast notification" });
    }
  };

// This is a scheduled job to create notifications for upcoming labs
exports.createUpcomingLabNotifications = async (req, res) => {
  try {
    await NotificationService.createUpcomingLabNotifications();
    res.status(200).json({ message: "Upcoming lab notifications created successfully" });
  } catch (error) {
    console.error("Error creating upcoming lab notifications:", error);
    res.status(500).json({ message: "Error creating upcoming lab notifications" });
  }
};

// This is a scheduled job to create notifications for damage reports
exports.createDamageReportNotifications = async (req, res) => {
  try {
    await NotificationService.createDamageReportNotifications();
    res.status(200).json({ message: "Damage report notifications created successfully" });
  } catch (error) {
    console.error("Error creating damage report notifications:", error);
    res.status(500).json({ message: "Error creating damage report notifications" });
  }
};

// Delete a notification
exports.deleteNotification = async (req, res) => {
  try {
    const { id } = req.params;
    const userId = req.user.userId;
    
    const notification = await Notification.findOne({ 
      _id: id, 
      recipient: userId 
    });
    
    if (!notification) {
      return res.status(404).json({ message: "Notification not found" });
    }
    
    await notification.remove();
    
    res.status(200).json({ message: "Notification deleted successfully" });
  } catch (error) {
    console.error("Error deleting notification:", error);
    res.status(500).json({ message: "Error deleting notification" });
  }
};