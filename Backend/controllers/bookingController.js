

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

// Get bookings for a specific date
exports.getBookingsByDate = async (req, res) => {
    try {
        const { date } = req.query;
        const bookings = await Booking.find({ date });
        res.status(200).json(bookings);
    } catch (error) {
        console.error("Error fetching bookings:", error.message);
        res.status(500).json({ error: "Error fetching bookings." });
    }
};

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