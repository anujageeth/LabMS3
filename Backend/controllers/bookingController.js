
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

// exports.createBooking = async (req, res) => {
//     try {
//         const { labName, labPlace, date, bookedBy, time, duration } = req.body;

//         // Calculate start and end times for the booking
//         const startTime = new Date(`${date}T${time}`);
//         const endTime = new Date(startTime.getTime() + duration * 60 * 60 * 1000);
//         console.log(date);
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
//                         ]
//                     },
//                 },
//                 {
//                     // New booking starts during the existing booking
//                     time: { $lte: time },
//                     $expr: {
//                         $gt: [
//                             { $add: [{ $toDate: { $concat: [date, "T", "$time"] } }, { $multiply: ["$duration", 60 * 60 * 1000] }] },
//                             startTime,
//                         ]
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
// }

const Booking = require("../models/Booking");
const { authenticateToken } = require("../middleware/authMiddleware");

exports.getBookingsByDate = async (req, res) => {
    try {
        const { date } = req.query;
        const bookings = await Booking.find({ date })
        .populate('user', 'FirstName LastName');
        res.status(200).json(bookings);
    } catch (error) {
        console.error("Error fetching bookings:", error.message);
        res.status(500).json({ error: "Error fetching bookings." });
    }
};

exports.createBooking = async (req, res) => {
    try {

        if (!req.user || !req.user.userId) {
            return res.status(401).json({ error: "User not authenticated" });
        }

        const { labName, labPlace, date, time, duration } = req.body;

        // Convert date and time properly
        const startTime = new Date(`${date}T${time}`);
        const endTime = new Date(startTime.getTime() + duration * 60 * 60 * 1000);

        // Check for conflicting bookings
        const conflictingBooking = await Booking.findOne({
            labPlace,
            date, // Convert date properly
            $or: [
                {
                    time: { $gte: time },
                    $expr: {
                        $lt: [
                            { $toDate: { $concat: [date, "T", "$time"] } },
                            endTime,
                        ]
                    },
                },
                {
                    time: { $lte: time },
                    $expr: {
                        $gt: [
                            { $add: [{ $toDate: { $concat: [date, "T", "$time"] } }, { $multiply: ["$duration", 60 * 60 * 1000] }] },
                            startTime,
                        ]
                    },
                },
            ],
        });

        if (conflictingBooking) {
            return res.status(400).json({ error: "Lab is already booked at that time." });
        }

        // Create new booking
        const newBooking = new Booking({
            user: req.user.userId,
            labName,
            labPlace,
            date,
            time,
            duration
        });

        await newBooking.save();
        res.status(201).json(newBooking);
    } catch (error) {
        console.error("Error creating booking:", error.message);
        res.status(500).json({ error: "Error creating booking." });
    }
};
