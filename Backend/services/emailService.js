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

exports.sendTechnicalOfficerNotification = async (booking, techOfficerEmail, techOfficerName, user) => {
  try {
    // Format equipment list to show one item per line
    let equipmentList = '';
    if (booking.equipmentNeeded && booking.equipmentNeeded !== 'N/A') {
      // Split the equipment string by newlines
      const items = booking.equipmentNeeded.split(/\r?\n/).filter(item => item.trim());
      
      if (items.length > 0) {
        equipmentList = `
          <li><strong>Equipment/Materials Needed:</strong>
            <ul>
              ${items.map(item => `<li>${item.trim()}</li>`).join('')}
            </ul>
          </li>
        `;
      }
    }

    await transporter.sendMail({
      from: `Lab Booking System <${process.env.EMAIL_USER}>`,
      to: techOfficerEmail,
      subject: 'Lab Booking Alert - Technical Preparation Required',
      html: `
        <h2>Lab Booking - Technical Preparation Required</h2>
        <p>Dear ${techOfficerName},</p>
        <p>A lab has been booked and requires technical preparation:</p>
        <h3>Booking Details:</h3>
        <ul>
          <li><strong>Lab:</strong> ${booking.labName}</li>
          <li><strong>Venue:</strong> ${booking.labPlace}</li>
          <li><strong>Date:</strong> ${booking.date}</li>
          <li><strong>Time Slot:</strong> ${booking.timeSlot}</li>
          ${booking.module && booking.module !== 'N/A' ? `<li><strong>Module:</strong> ${booking.module}</li>` : ''}
        </ul>
        
        <h3>Lab Practical Information:</h3>
        <ul>
          ${booking.experimentTitle && booking.experimentTitle !== 'N/A' ? `<li><strong>Experiment Title:</strong> ${booking.experimentTitle}</li>` : ''}
          ${booking.experimentDescription && booking.experimentDescription !== 'N/A' ? `<li><strong>Experiment Description:</strong> ${booking.experimentDescription}</li>` : ''}
          ${equipmentList}
        </ul>
        
        <h3>User Details:</h3>
        <ul>
          <li><strong>Name:</strong> ${user.FirstName} ${user.LastName}</li>
          <li><strong>Email:</strong> ${user.Email}</li>
          <li><strong>Role:</strong> ${user.Role}</li>
          ${user.StudentID ? `<li><strong>Student ID:</strong> ${user.StudentID}</li>` : ''}
        </ul>
        <p>Please ensure that the lab is properly prepared with all required equipment and materials for this session.</p>
        <p><em>This is an automated message. Please do not reply to this email.</em></p>
      `
    });
    return true;
  } catch (error) {
    console.error('Error sending technical officer notification email:', error);
    return false;
  }
};