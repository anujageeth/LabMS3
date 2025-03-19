const Notification = require("../models/Notification");
const User = require("../models/user");
const Equipment = require("../models/equipment");
const Booking = require("../models/Booking");
const CheckInOut = require("../models/checkinCheckout");

class NotificationService {
  /**
   * Create a new notification for a specific user
   */
  static async createNotification(data) {
    try {
        const notificationData = {
            ...data,
            isRead: false
          };
      const notification = new Notification(notificationData);
      await notification.save();
      return notification;
    } catch (error) {
      console.error("Error creating notification:", error);
      throw error;
    }
  }

  /**
   * Send a broadcast notification to multiple users
   */
  static async createBroadcastNotification(data, recipients) {
    try {
      const notifications = [];
      
      for (const recipientId of recipients) {
        const notificationData = {
          ...data,
          recipient: recipientId,
          isBroadcast: true,
          isRead: false
        };
        
        const notification = new Notification(notificationData);
        await notification.save();
        notifications.push(notification);
        
      }
      
      return notifications;
    } catch (error) {
      console.error("Error creating broadcast notification:", error);
      throw error;
    }
  }

  /**
   * Create notifications for upcoming lab bookings
   * This should be called by a scheduled job
   */
  static async createUpcomingLabNotifications() {
    try {
      // Get bookings for tomorrow
      const tomorrow = new Date();
      tomorrow.setDate(tomorrow.getDate() + 1);
      const tomorrowString = tomorrow.toISOString().split('T')[0];
      
      const upcomingBookings = await Booking.find({ date: tomorrowString });
      
      for (const booking of upcomingBookings) {
        // Find the user who booked
        const user = await User.findOne({ Email: booking.bookedBy });
        
        if (user) {
          // Create notification for the user
          await this.createNotification({
            recipient: user._id,
            type: "lab_reminder",
            title: "Upcoming Lab Reminder",
            message: `You have an upcoming lab booking for ${booking.labName} at ${booking.labPlace} tomorrow at ${booking.timeSlot}.`,
            relatedItem: booking._id,
            itemModel: "Booking"
          });
          
          // Also notify admins
          const admins = await User.find({ 
            Role: { $in: ["hod", "technical officer"] } 
          });
          
          for (const admin of admins) {
            await this.createNotification({
              recipient: admin._id,
              type: "lab_reminder",
              title: "Upcoming Lab Session",
              message: `Lab ${booking.labName} at ${booking.labPlace} is booked for tomorrow at ${booking.timeSlot} by ${booking.bookedBy}.`,
              relatedItem: booking._id,
              itemModel: "Booking",
              adminOnly: true
            });
          }
        }
      }
    } catch (error) {
      console.error("Error creating upcoming lab notifications:", error);
      throw error;
    }
  }

  /**
   * Create notifications for equipment damage reports
   */
  static async createDamageReportNotifications() {
    try {
      // Get count of damaged equipment
      const damagedCount = await Equipment.countDocuments({ condition: "damaged" });
      
      if (damagedCount > 0) {
        // Notify admins about damaged equipment
        const admins = await User.find({ 
          Role: { $in: ["hod", "technical officer"] } 
        });
        
        for (const admin of admins) {
          await this.createNotification({
            recipient: admin._id,
            type: "damage_report",
            title: "Equipment Damage Report",
            message: `There are currently ${damagedCount} damaged equipment items that need attention.`,
            adminOnly: true,
            isRead: false
          });
        }
      }
    } catch (error) {
      console.error("Error creating damage report notifications:", error);
      throw error;
    }
  }

  /**
   * Create notifications for equipment check-ins and check-outs
   */
  static async createCheckInOutNotification(checkInOutRecord) {
    try {
      const equipment = await Equipment.findById(checkInOutRecord.equipment);
      const user = await User.findById(checkInOutRecord.user);
      const Reciver = await User.findById(checkInOutRecord.selectedUser);
      let selectedUser = checkInOutRecord.selectedUser;
      
      //if (!(selectedUser.includes("@"))) {
        // If selectedUser is not an email, try to find the user
        const userFound = await User.findById(selectedUser);
        if (userFound) {
          selectedUser = userFound.Email;
        }
      //}
      
      // Create notification for the user who checked out equipment
      const userNotification = {
        recipient: checkInOutRecord.selectedUser,
        type: checkInOutRecord.action === "checkout" ? "equipment_checkout" : "equipment_checkin",
        title: `Equipment ${checkInOutRecord.action === "checkout" ? "Checked Out" : "Checked In"}`,
        message: `You have ${checkInOutRecord.action === "checkout" ? "checked out" : "checked in"} ${equipment.Name} (${equipment.Serial}).`,
        relatedItem: checkInOutRecord._id,
        itemModel: "CheckInOut",
        isRead: false
      };
      
      await this.createNotification(userNotification);
      
      // Notify admins
      const admins = await User.find({ 
        Role: { $in: ["hod", "technical officer"] } 
      });
      
      for (const admin of admins) {
        await this.createNotification({
          recipient: admin._id,
          type: checkInOutRecord.action === "checkout" ? "equipment_checkout" : "equipment_checkin",
          title: `Equipment ${checkInOutRecord.action === "checkout" ? "Checked Out" : "Checked In"}`,
          message: `${Reciver.FirstName} ${Reciver.LastName} has ${checkInOutRecord.action === "checkout" ? "checked out" : "checked in"} ${equipment.Name} (${equipment.Serial}) ${checkInOutRecord.action === "checkout" ? "from" : "to"} ${user.Email}.${checkInOutRecord.damageDescription ? ` Damage reported: ${checkInOutRecord.damageDescription}` : ""}`,
          relatedItem: checkInOutRecord._id,
          itemModel: "CheckInOut",
          adminOnly: true,
          isRead: false
        });
      }
    } catch (error) {
      console.error("Error creating check-in/out notification:", error);
      throw error;
    }
  }

  /**
   * Mark a notification as read
   */
  static async markAsRead(id, userId) {
    try {
        // Modified to verify both notification ID and recipient
      const notification = await Notification.findOneAndUpdate(
        { _id: id, recipient: userId },
        { isRead: true },
        { new: true }
      );
      return notification;
    } catch (error) {
      console.error("Error marking notification as read:", error);
      throw error;
    }
  }

  /**
   * Mark all notifications as read for a user
   */
  static async markAllAsRead(userId) {
    try {
      const result = await Notification.updateMany(
        { recipient: userId, isRead: false },
        { isRead: true }
      );
      return result;
    } catch (error) {
      console.error("Error marking all notifications as read:", error);
      throw error;
    }
  }
}

module.exports = NotificationService;