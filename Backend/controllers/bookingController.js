

// const Booking = require("../models/Booking");

// // Get bookings for a specific date
// exports.getBookingsByDate = async (req, res) => {
//     try {
//         const { date } = req.query;
//         const bookings = await Booking.find({ date });
//         res.status(200).json(bookings);
//     } catch (error) {
//         console.error("Error fetching bookings:", error.message);
//         res.status(500).json({ error: "Error fetching bookings." });
//     }
// };

// // Create a new booking
// exports.createBooking = async (req, res) => {
//     try {
//         const { labName, labPlace, date, bookedBy, time, duration } = req.body;

//         // Calculate start and end times for the booking
//         const startTime = new Date(`${date}T${time}`);
//         const endTime = new Date(startTime.getTime() + duration * 60 * 60 * 1000);

//         // Check for conflicting bookings
//         const conflictingBooking = await Booking.findOne({
//             labPlace, // Same lab
//             date, // Same date
//             $or: [
//                 {
//                     // Existing booking starts during the new booking
//                     time: { $gte: time },
//                     $expr: {
//                         $lt: [
//                             { $toDate: { $concat: [date, "T", "$time"] } },
//                             endTime,
//                         ],
//                     },
//                 },
//                 {
//                     // New booking starts during the existing booking
//                     time: { $lte: time },
//                     $expr: {
//                         $gt: [
//                             { $add: [{ $toDate: { $concat: [date, "T", "$time"] } }, { $multiply: ["$duration", 60 * 60 * 1000] }] },
//                             startTime,
//                         ],
//                     },
//                 },
//             ],
//         });

//         if (conflictingBooking) {
//             return res.status(400).json({ error: "Lab is already booked at that time." });
//         }

//         // Create new booking
//         const newBooking = new Booking({ labName, labPlace, date, bookedBy, time, duration });
//         await newBooking.save();

//         res.status(201).json(newBooking);
//     } catch (error) {
//         console.error("Error creating booking:", error.message);
//         res.status(500).json({ error: "Error creating booking." });
//     }
// };


const Booking = require("../models/Booking");
const User = require("../models/user");
const NotificationService = require("../services/NotificationService");
const emailService = require('../services/emailService');

// Get bookings for a specific date
exports.getBookingsByDate = async (req, res) => {
    try {
        const { date } = req.query;

        if (!date) {
            return res.status(400).json({ error: "Date is required." });
        }

        const bookings = await Booking.find({ date });

        res.status(200).json(bookings);
    } catch (error) {
        console.error("Error fetching bookings:", error.message);
        res.status(500).json({ error: "Error fetching bookings." });
    }
};

// Create a new booking
// Create a new booking
exports.createBooking = async (req, res) => {
    try {
        const { labName, labPlace, date, bookedBy, timeSlot } = req.body;

        // Define time slot ranges
        const timeSlots = {
            "8:30-11:30": { start: "08:30", end: "11:30" },
            "1:30-4:30": { start: "13:30", end: "16:30" },
            custom: { start: null, end: null }, // Custom time will be handled separately
        };

        // Get the selected time slot
        const selectedSlot = timeSlots[timeSlot];

        // If custom time, validate the start and end times
        if (timeSlot === "custom") {
            const startTime = req.body.startTime;
            const endTime = req.body.endTime;
            if (startTime >= endTime) {
                return res.status(400).json({ error: "End time must be after start time." });
            }
            selectedSlot.start = startTime;
            selectedSlot.end = endTime;
        }

        // Convert time strings to Date objects for comparison
        const newStartTime = new Date(`${date}T${selectedSlot.start}`);
        const newEndTime = new Date(`${date}T${selectedSlot.end}`);

        // Check for conflicting bookings
        const conflictingBookings = await Booking.find({
            labPlace, // Same lab
            date, // Same date
        });

        const isConflict = conflictingBookings.some((booking) => {
            const existingStartTime = new Date(`${date}T${booking.timeSlot.split("-")[0]}`);
            const existingEndTime = new Date(`${date}T${booking.timeSlot.split("-")[1]}`);

            // Check for overlapping time slots
            return (
                (newStartTime >= existingStartTime && newStartTime < existingEndTime) || // New booking starts during an existing booking
                (newEndTime > existingStartTime && newEndTime <= existingEndTime) || // New booking ends during an existing booking
                (newStartTime <= existingStartTime && newEndTime >= existingEndTime) // New booking completely overlaps an existing booking
            );
        });

        if (isConflict) {
            return res.status(400).json({ error: "Lab is already booked at that time." });
        }

        // Create new booking
        const newBooking = new Booking({
            labName,
            labPlace,
            date,
            bookedBy,
            timeSlot: `${selectedSlot.start}-${selectedSlot.end}`, // Save time interval
        });
        await newBooking.save();

        // Notify admins about the new booking
        const user = await User.findOne({ Email: bookedBy });
        const admins = await User.find({ Role: { $in: ["hod", "technical officer"] } });
        
        if (user && admins.length > 0) {
            for (const admin of admins) {
                await NotificationService.createNotification({
                    recipient: admin._id,
                    type: "lab_reminder",
                    title: "New Lab Booking",
                    message: `${user.FirstName} ${user.LastName} has booked ${labName} at ${labPlace} on ${date} at ${selectedSlot.start}-${selectedSlot.end}`,
                    relatedItem: newBooking._id,
                    itemModel: "Booking",
                    adminOnly: true,
                    isRead: false 
                });
            }
            
            // Also notify the user who made the booking
            await NotificationService.createNotification({
                recipient: user._id,
                type: "lab_reminder",
                title: "Lab Booking Confirmation",
                message: `You have successfully booked ${labName} at ${labPlace} on ${date} at ${selectedSlot.start}-${selectedSlot.end}`,
                relatedItem: newBooking._id,
                itemModel: "Booking",
                isRead: false 
            });

            // Send email notifications (non-blocking)
            try {
                // Email to user
                await emailService.sendBookingConfirmation(
                    newBooking, 
                    user.Email,
                    `${user.FirstName} ${user.LastName}`
                );
                
                // Email to admins
                for (const admin of admins) {
                    await emailService.sendAdminNotification(
                        newBooking,
                        admin.Email,
                        `${admin.FirstName} ${admin.LastName}`,
                        `${user.FirstName} ${user.LastName}`
                    );
                }
            } catch (emailError) {
                console.error("Error sending emails:", emailError);
                // Don't fail the request if email fails
            }
        }


        res.status(201).json(newBooking);
    } catch (error) {
        console.error("Error creating booking:", error.message);
        res.status(500).json({ error: "Error creating booking." });
    }
};

// Delete a booking by ID
exports.deleteBooking = async (req, res) => {
    try {
        const { id } = req.params;
        const deletedBooking = await Booking.findByIdAndDelete(id);

        if (!deletedBooking) {
            return res.status(404).json({ error: "Booking not found." });
        }

        res.status(200).json({ message: "Booking deleted successfully." });
    } catch (error) {
        console.error("Error deleting booking:", error.message);
        res.status(500).json({ error: "Error deleting booking." });
    }
};