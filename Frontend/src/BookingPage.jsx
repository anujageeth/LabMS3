

// import React, { useState, useEffect } from "react";
// import Calendar from "react-calendar";
// import { FaCalendarAlt } from "react-icons/fa";
// import {
//     Box,
//     Paper,
//     Table,
//     TableBody,
//     TableCell,
//     TableContainer,
//     TableHead,
//     TablePagination,
//     TableRow,
//     Checkbox,
//     Tooltip,
//     IconButton,
// } from "@mui/material";
// import AddIcon from "@mui/icons-material/Add";
// import RemoveIcon from "@mui/icons-material/Remove";
// import SideNavigation from "./components/SideNavigation";
// import UserDetails from "./components/UserDetails";
// import BookingForm from "./components/BookingForm";
// import "./BookingReservation.css";
// import "react-calendar/dist/Calendar.css";

// const BookingReservation = () => {
//     const [date, setDate] = useState(new Date());
//     const [isCalendarVisible, setIsCalendarVisible] = useState(false);
//     const [isFormVisible, setIsFormVisible] = useState(false);
//     const [bookings, setBookings] = useState([]);
//     const [page, setPage] = useState(0);
//     const [rowsPerPage, setRowsPerPage] = useState(5);
//     const [selected, setSelected] = useState([]);
//     const [user, setUser] = useState(null); // State to store user data

//     useEffect(() => {
//         fetchBookings();
//     }, [date]);

//     const fetchBookings = async () => {
//         try {
//             const formattedDate = date.toISOString().split("T")[0];
//             const response = await fetch(
//                 `http://localhost:3001/api/bookings?date=${formattedDate}`
//             );
//             if (response.ok) {
//                 const data = await response.json();
//                 setBookings(data);
//             } else {
//                 console.error("Failed to fetch bookings.");
//             }
//         } catch (error) {
//             console.error("Error fetching bookings:", error.message);
//         }
//     };

//     const onDateChange = (newDate) => {
//         const year = newDate.getFullYear();
//         const month = newDate.getMonth();
//         const day = newDate.getDate();
//         const localDate = new Date(year, month, day, 12, 0, 0);
//         setDate(localDate);
//         setIsCalendarVisible(false);
//     };

//     const toggleCalendar = () => setIsCalendarVisible(!isCalendarVisible);

//     const toggleFormVisibility = () => setIsFormVisible(!isFormVisible);

//     const handleClick = (event, row) => {
//         const selectedIndex = selected.indexOf(row._id);
//         let newSelected = [];

//         if (selectedIndex === -1) {
//             newSelected = newSelected.concat(selected, row._id);
//         } else if (selectedIndex === 0) {
//             newSelected = newSelected.concat(selected.slice(1));
//         } else if (selectedIndex === selected.length - 1) {
//             newSelected = newSelected.concat(selected.slice(0, -1));
//         } else if (selectedIndex > 0) {
//             newSelected = newSelected.concat(
//                 selected.slice(0, selectedIndex),
//                 selected.slice(selectedIndex + 1)
//             );
//         }

//         setSelected(newSelected);
//     };

//     const isSelected = (id) => selected.indexOf(id) !== -1;

//     const handleChangePage = (event, newPage) => {
//         setPage(newPage);
//     };

//     const handleChangeRowsPerPage = (event) => {
//         setRowsPerPage(parseInt(event.target.value, 10));
//         setPage(0);
//     };

//     const handleUserDataFetched = (userData) => {
//         setUser(userData); // Set user data in state
//     };

//     return (
//         <div className="dashPage">
//             <div className="gridBox">
//                 <SideNavigation />
//                 <div className="rightPanel">
//                     <UserDetails onUserDataFetched={handleUserDataFetched} /> {/* Pass callback */}
//                     <div className="dashBoxer">
//                         <div className="dashBox">
//                             <div className="dashName">
//                                 <h1 className="pageTitle">Booking & Reservation</h1>
//                             </div>

//                             <div className="addNsearch">
//                                 <div className="addItem">
//                                     <button className="addItemBtn" onClick={toggleFormVisibility}>
//                                         <b>Book your lab</b>
//                                     </button>
//                                 </div>

//                                 <div className="calendar">
//                                     <div className="calendarIcon" onClick={toggleCalendar}>
//                                         <FaCalendarAlt size={24} />
//                                     </div>
//                                     {isCalendarVisible && (
//                                         <Calendar onChange={onDateChange} value={date} />
//                                     )}
//                                 </div>
//                             </div>
//                         </div>

//                         <div className="dataTableBox">
//                             <Box sx={{ width: "100%" }}>
//                                 <Paper sx={{ width: "100%", mb: 2 }}>
//                                     <TableContainer>
//                                         <Table size="small">
//                                             <TableHead>
//                                                 <TableRow>
//                                                     <TableCell padding="checkbox"></TableCell>
//                                                     <TableCell><b>Lab Name</b></TableCell>
//                                                     <TableCell><b>Lab Place</b></TableCell>
//                                                     <TableCell><b>Date</b></TableCell>
//                                                     <TableCell><b>Time</b></TableCell>
//                                                     <TableCell><b>Duration</b></TableCell>
//                                                     <TableCell><b>Booked By</b></TableCell>
//                                                 </TableRow>
//                                             </TableHead>
//                                             <TableBody>
//                                                 {bookings
//                                                     .slice(
//                                                         page * rowsPerPage,
//                                                         page * rowsPerPage + rowsPerPage
//                                                     )
//                                                     .map((booking) => {
//                                                         const isItemSelected = isSelected(booking._id);
//                                                         return (
//                                                             <TableRow
//                                                                 hover
//                                                                 onClick={(event) => handleClick(event, booking)}
//                                                                 role="checkbox"
//                                                                 aria-checked={isItemSelected}
//                                                                 tabIndex={-1}
//                                                                 key={booking._id}
//                                                                 selected={isItemSelected}
//                                                             >
//                                                                 <TableCell padding="checkbox">
//                                                                     <Checkbox
//                                                                         color="primary"
//                                                                         checked={isItemSelected}
//                                                                         inputProps={{
//                                                                             "aria-labelledby": `enhanced-table-checkbox-${booking._id}`,
//                                                                         }}
//                                                                     />
//                                                                 </TableCell>
//                                                                 <TableCell>{booking.labName}</TableCell>
//                                                                 <TableCell>{booking.labPlace}</TableCell>
//                                                                 <TableCell>{booking.date}</TableCell>
//                                                                 <TableCell>{booking.time}</TableCell>
//                                                                 <TableCell>{booking.duration} hrs</TableCell>
//                                                                 <TableCell>{booking.bookedBy}</TableCell>
//                                                             </TableRow>
//                                                         );
//                                                     })}
//                                             </TableBody>
//                                         </Table>
//                                     </TableContainer>
//                                     <TablePagination
//                                         rowsPerPageOptions={[5, 10, 25]}
//                                         component="div"
//                                         count={bookings.length}
//                                         rowsPerPage={rowsPerPage}
//                                         page={page}
//                                         onPageChange={handleChangePage}
//                                         onRowsPerPageChange={handleChangeRowsPerPage}
//                                     />
//                                 </Paper>
//                             </Box>
//                         </div>
//                     </div>
//                 </div>
//             </div>

//             {isFormVisible && (
//                 <BookingForm
//                     closeForm={toggleFormVisibility}
//                     selectedDate={date}
//                     onBookingAdded={fetchBookings}
//                     user={user} // Pass user data to BookingForm
//                 />
//             )}
//         </div>
//     );
// };

// export default BookingReservation;


import React, { useState, useEffect } from "react";
import Calendar from "react-calendar";
import { FaCalendarAlt } from "react-icons/fa";
import {
    Box,
    Paper,
    Table,
    TableBody,
    TableCell,
    TableContainer,
    TableHead,
    TableRow,
    TablePagination,
    Checkbox,
    IconButton,
} from "@mui/material";
import DeleteIcon from "@mui/icons-material/Delete";
import SideNavigation from "./components/SideNavigation";
import UserDetails from "./components/UserDetails";
import BookingForm from "./components/BookingForm";
import "./BookingReservation.css";
import "react-calendar/dist/Calendar.css";

const BookingReservation = () => {
    const [date, setDate] = useState(new Date());
    const [isCalendarVisible, setIsCalendarVisible] = useState(false);
    const [isFormVisible, setIsFormVisible] = useState(false);
    const [bookings, setBookings] = useState([]);
    const [page, setPage] = useState(0);
    const [rowsPerPage, setRowsPerPage] = useState(5);
    const [selected, setSelected] = useState([]);
    const [user, setUser] = useState(null); // State to store user data
    const [availableSlots, setAvailableSlots] = useState([]); // State to store available slots

    // Predefined time slots
    const predefinedSlots = [
        { start: "08:30", end: "11:30", label: "8:30 AM - 11:30 AM" },
        { start: "13:30", end: "16:30", label: "1:30 PM - 4:30 PM" },
    ];

    // Labs
    const labs = [
        "Electrical Machines Lab",
        "Communication Lab",
        "Measurements Lab",
        "High Voltage Lab",
    ];

    // Fetch bookings for the selected date
    useEffect(() => {
        fetchBookings();
    }, [date]);

    const fetchBookings = async () => {
        try {
            const formattedDate = date.toISOString().split("T")[0];
            const response = await fetch(
                `http://localhost:3001/api/bookings?date=${formattedDate}`
            );
            if (response.ok) {
                const data = await response.json();
                setBookings(data);

                // Calculate available slots
                calculateAvailableSlots(data, formattedDate);
            } else {
                console.error("Failed to fetch bookings.");
            }
        } catch (error) {
            console.error("Error fetching bookings:", error.message);
        }
    };

    // Calculate available time slots
    const calculateAvailableSlots = (bookings, date) => {
        const bookedSlots = bookings.map((booking) => ({
            start: booking.timeSlot.split("-")[0],
            end: booking.timeSlot.split("-")[1],
            labPlace: booking.labPlace,
            isCustom: !predefinedSlots.some(
                (slot) =>
                    slot.start === booking.timeSlot.split("-")[0] &&
                    slot.end === booking.timeSlot.split("-")[1]
            ),
        }));

        const slots = labs.map((lab) => {
            const labBookings = bookedSlots.filter((booking) => booking.labPlace === lab);

            return {
                lab,
                predefinedSlots: predefinedSlots.map((slot) => {
                    const isBooked = labBookings.some(
                        (booking) =>
                            booking.start === slot.start && booking.end === slot.end
                    );

                    const isCrossed = labBookings.some(
                        (booking) =>
                            booking.isCustom &&
                            ((booking.start >= slot.start && booking.start < slot.end) ||
                            (booking.end > slot.start && booking.end <= slot.end) ||
                            (booking.start <= slot.start && booking.end >= slot.end))
                    );

                    return {
                        ...slot,
                        isBooked,
                        isCrossed,
                    };
                }),
                otherBookings: labBookings
                    .filter((booking) => booking.isCustom)
                    .map((booking) => `${booking.start}-${booking.end}`),
            };
        });

        setAvailableSlots(slots);
    };

    // Handle date change from the calendar
    const onDateChange = (newDate) => {
        const year = newDate.getFullYear();
        const month = newDate.getMonth();
        const day = newDate.getDate();
        const localDate = new Date(year, month, day, 12, 0, 0);
        setDate(localDate);
        setIsCalendarVisible(false);
    };

    // Toggle calendar visibility
    const toggleCalendar = () => setIsCalendarVisible((prev) => !prev);;

    // Toggle booking form visibility
    const toggleFormVisibility = () => setIsFormVisible(!isFormVisible);

    // Handle row selection in the table
    const handleClick = (event, row) => {
        const selectedIndex = selected.indexOf(row._id);
        let newSelected = [];

        if (selectedIndex === -1) {
            newSelected = newSelected.concat(selected, row._id);
        } else if (selectedIndex === 0) {
            newSelected = newSelected.concat(selected.slice(1));
        } else if (selectedIndex === selected.length - 1) {
            newSelected = newSelected.concat(selected.slice(0, -1));
        } else if (selectedIndex > 0) {
            newSelected = newSelected.concat(
                selected.slice(0, selectedIndex),
                selected.slice(selectedIndex + 1)
            );
        }

        setSelected(newSelected);
    };

    // Check if a row is selected
    const isSelected = (id) => selected.indexOf(id) !== -1;

    // Handle pagination page change
    const handleChangePage = (event, newPage) => {
        setPage(newPage);
    };

    // Handle rows per page change
    const handleChangeRowsPerPage = (event) => {
        setRowsPerPage(parseInt(event.target.value, 10));
        setPage(0);
    };

    // Handle user data fetched from UserDetails
    const handleUserDataFetched = (userData) => {
        setUser(userData); // Set user data in state
    };

    // Handle delete booking
    const handleDeleteBooking = async (id) => {
        try {
            const response = await fetch(`http://localhost:3001/api/bookings/${id}`, {
                method: "DELETE",
            });

            if (response.ok) {
                // Refresh the bookings list after deletion
                fetchBookings();
            } else {
                console.error("Failed to delete booking.");
            }
        } catch (error) {
            console.error("Error deleting booking:", error.message);
        }
    };

    return (
        <div className="dashPage">
            <div className="gridBox">
                <SideNavigation />
                <div className="rightPanel">
                    <UserDetails onUserDataFetched={handleUserDataFetched} /> {/* Pass callback */}
                    <div className="dashBoxer">
                        <div className="dashBox">
                            <div className="dashName">
                                <h1 className="pageTitle">Booking & Reservation</h1>
                            </div>

                            <div className="addNsearch">
                                <div className="addItem" id="fullReportGap">
                                    <button className="addItemBtn" onClick={toggleFormVisibility}>
                                        <b>Book your lab</b>
                                    </button>
                                </div>

                                <div className="addItem">
                                    <button className="addItemBtn" onClick={toggleCalendar}>
                                        <div className="calendar" id="calenderBtn"></div>
                                        <div className="calendarIcon">
                                            <FaCalendarAlt size={20} />
                                            Select date
                                        </div>
                                    </button>
                                        <div className="calenderDiv">
                                            {isCalendarVisible && (
                                                
                                                <Calendar onChange={onDateChange} value={date} />
                                            )}
                                        </div>
                                    
                                    
                                </div>
                            </div>
                        </div>

                        {/* Availability Table (Moved to Top) */}
                        <div className="dataTableBox">
                            <Box sx={{ width: "100%" }}>
                                <Paper sx={{ width: "100%", mb: 2 }}>
                                    <TableContainer>
                                        <Table size="small">
                                            <TableHead>
                                                <TableRow>
                                                    <TableCell><b>Venue</b></TableCell>
                                                    {predefinedSlots.map((slot, index) => (
                                                        <TableCell key={index} align="center">
                                                            <b>{slot.label}</b>
                                                        </TableCell>
                                                    ))}
                                                    <TableCell align="center"><b>Other Bookings</b></TableCell>
                                                </TableRow>
                                            </TableHead>
                                            <TableBody>
                                                {availableSlots.map((labSlot, labIndex) => (
                                                    <TableRow key={labIndex}>
                                                        <TableCell><b>{labSlot.lab}</b></TableCell>
                                                        {labSlot.predefinedSlots.map((slot, slotIndex) => (
                                                            <TableCell
                                                                key={slotIndex}
                                                                align="center"
                                                                style={{
                                                                    backgroundColor: slot.isBooked ? "#ffcccc" : "#ccffcc",
                                                                    textDecoration: slot.isCrossed ? "line-through" : "none",
                                                                    fontWeight: "bold",
                                                                }}
                                                            >
                                                                {slot.isBooked ? "Booked" : "Available"}
                                                            </TableCell>
                                                        ))}
                                                        <TableCell align="center">
                                                            {labSlot.otherBookings.map((booking, index) => (
                                                                <div
                                                                    key={index}
                                                                    style={{
                                                                        backgroundColor: "#ffcccc",
                                                                        padding: "5px",
                                                                        margin: "2px",
                                                                        borderRadius: "5px",
                                                                        fontWeight: "bold",
                                                                    }}
                                                                >
                                                                    {booking}
                                                                </div>
                                                            ))}
                                                        </TableCell>
                                                    </TableRow>
                                                ))}
                                            </TableBody>
                                        </Table>
                                    </TableContainer>
                                </Paper>
                            </Box>
                        </div>

                        {/* Existing Bookings Table (Moved to Bottom) */}
                        <div className="dataTableBox">
                            <Box sx={{ width: "100%" }}>
                                <Paper sx={{ width: "100%", mb: 2 }}>
                                    <TableContainer>
                                        <Table size="small">
                                            <TableHead>
                                                <TableRow>
                                                    <TableCell padding="checkbox"></TableCell>
                                                    <TableCell><b>Lab Name</b></TableCell>
                                                    <TableCell><b>Venue</b></TableCell>
                                                    <TableCell><b>Date</b></TableCell>
                                                    <TableCell><b>Time Interval</b></TableCell>
                                                    <TableCell><b>Booked By</b></TableCell>
                                                    <TableCell><b>Actions</b></TableCell>
                                                </TableRow>
                                            </TableHead>
                                            <TableBody>
                                                {bookings
                                                    .slice(
                                                        page * rowsPerPage,
                                                        page * rowsPerPage + rowsPerPage
                                                    )
                                                    .map((booking) => {
                                                        const isItemSelected = isSelected(booking._id);
                                                        return (
                                                            <TableRow
                                                                hover
                                                                onClick={(event) => handleClick(event, booking)}
                                                                role="checkbox"
                                                                aria-checked={isItemSelected}
                                                                tabIndex={-1}
                                                                key={booking._id}
                                                                selected={isItemSelected}
                                                            >
                                                                <TableCell padding="checkbox">
                                                                    <Checkbox
                                                                        color="primary"
                                                                        checked={isItemSelected}
                                                                        inputProps={{
                                                                            "aria-labelledby": `enhanced-table-checkbox-${booking._id}`,
                                                                        }}
                                                                    />
                                                                </TableCell>
                                                                <TableCell>{booking.labName}</TableCell>
                                                                <TableCell>{booking.labPlace}</TableCell>
                                                                <TableCell>{booking.date}</TableCell>
                                                                <TableCell>{booking.timeSlot}</TableCell>
                                                                <TableCell>{booking.bookedBy}</TableCell>
                                                                <TableCell>
                                                                    <IconButton
                                                                        onClick={(e) => {
                                                                            e.stopPropagation(); // Prevent row click event
                                                                            handleDeleteBooking(booking._id); // Call delete function
                                                                        }}
                                                                        aria-label="delete"
                                                                    >
                                                                        <DeleteIcon />
                                                                    </IconButton>
                                                                </TableCell>
                                                            </TableRow>
                                                        );
                                                    })}
                                            </TableBody>
                                        </Table>
                                    </TableContainer>
                                    <TablePagination
                                        rowsPerPageOptions={[5, 10, 25]}
                                        component="div"
                                        count={bookings.length}
                                        rowsPerPage={rowsPerPage}
                                        page={page}
                                        onPageChange={handleChangePage}
                                        onRowsPerPageChange={handleChangeRowsPerPage}
                                    />
                                </Paper>
                            </Box>
                        </div>
                    </div>
                </div>
            </div>

            {/* Booking Form Popup */}
            {isFormVisible && (

                <BookingForm
                    closeForm={toggleFormVisibility}
                    selectedDate={date}
                    onBookingAdded={fetchBookings}
                    user={user} // Pass user data to BookingForm
                />
                
                /*<div className="">
                    <div className="tableModal2">
                        <BookingForm
                            closeForm={toggleFormVisibility}
                            selectedDate={date}
                            onBookingAdded={fetchBookings}
                            user={user} // Pass user data to BookingForm
                        />
                    </div>
                </div>*/
                
            )}
        </div>
    );
};

export default BookingReservation;