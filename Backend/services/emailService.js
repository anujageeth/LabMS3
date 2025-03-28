const nodemailer = require('nodemailer');

const transporter = nodemailer.createTransport({
  service: process.env.EMAIL_SERVICE || 'gmail',
  auth: {
    user: process.env.EMAIL_USER,
    pass: process.env.EMAIL_PASS
  }
});

exports.sendBookingConfirmation = async (booking, userEmail, userName) => {
  try {
    await transporter.sendMail({
      from: `Lab Booking System <${process.env.EMAIL_USER}>`,
      to: userEmail,
      subject: 'Lab Booking Confirmation',
      html: `
        <h2>Your Lab Booking Details</h2>
        <p>Dear ${userName},</p>
        <p>Your lab booking has been confirmed with the following details:</p>
        <ul>
          <li><strong>Lab:</strong> ${booking.labName}</li>
          <li><strong>Venue:</strong> ${booking.labPlace}</li>
          <li><strong>Date:</strong> ${booking.date}</li>
          <li><strong>Time Slot:</strong> ${booking.timeSlot}</li>
        </ul>
        <p>Thank you for using our booking system.</p>
      `
    });
  } catch (error) {
    console.error('Error sending user confirmation email:', error);
  }
};

exports.sendAdminNotification = async (booking, adminEmail, adminName, bookedBy) => {
  try {
    await transporter.sendMail({
      from: `Lab Booking System <${process.env.EMAIL_USER}>`,
      to: adminEmail,
      subject: 'New Lab Booking Notification',
      html: `
        <h2>New Lab Booking</h2>
        <p>Dear ${adminName},</p>
        <p>A new lab booking has been made by ${bookedBy}:</p>
        <ul>
          <li><strong>Lab:</strong> ${booking.labName}</li>
          <li><strong>Venue:</strong> ${booking.labPlace}</li>
          <li><strong>Date:</strong> ${booking.date}</li>
          <li><strong>Time Slot:</strong> ${booking.timeSlot}</li>
        </ul>
        <p>Please prepare the lab accordingly.</p>
      `
    });
  } catch (error) {
    console.error('Error sending admin notification email:', error);
  }
};