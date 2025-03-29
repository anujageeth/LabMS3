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
//     TableRow,
//     TablePagination,
//     Checkbox,
//     IconButton,
// } from "@mui/material";
// import DeleteIcon from "@mui/icons-material/Delete";
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
//     const [user, setUser] = useState(null);
//     const [availableSlots, setAvailableSlots] = useState([]);
//     const [isPastDate, setIsPastDate] = useState(false);

//     // Predefined time slots
//     const predefinedSlots = [
//         { start: "08:30", end: "11:30", label: "8:30 AM - 11:30 AM" },
//         { start: "13:30", end: "16:30", label: "1:30 PM - 4:30 PM" },
//     ];

//     // Labs
//     const labs = [
//         "Electrical Machines Lab",
//         "Communication Lab",
//         "Measurements Lab",
//         "High Voltage Lab",
//     ];

//     // Check if selected date is in the past
//     useEffect(() => {
//         const today = new Date();
//         today.setHours(0, 0, 0, 0);
//         setIsPastDate(date < today);
//     }, [date]);

//     // Fetch bookings for the selected date
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
//                 calculateAvailableSlots(data, formattedDate);
//             } else {
//                 console.error("Failed to fetch bookings.");
//             }
//         } catch (error) {
//             console.error("Error fetching bookings:", error.message);
//         }
//     };

//     const calculateAvailableSlots = (bookings, date) => {
//         const bookedSlots = bookings.map((booking) => ({
//             start: booking.timeSlot.split("-")[0],
//             end: booking.timeSlot.split("-")[1],
//             labPlace: booking.labPlace,
//             isCustom: !predefinedSlots.some(
//                 (slot) =>
//                     slot.start === booking.timeSlot.split("-")[0] &&
//                     slot.end === booking.timeSlot.split("-")[1]
//             ),
//         }));

//         const slots = labs.map((lab) => {
//             const labBookings = bookedSlots.filter((booking) => booking.labPlace === lab);

//             return {
//                 lab,
//                 predefinedSlots: predefinedSlots.map((slot) => {
//                     const isBooked = labBookings.some(
//                         (booking) =>
//                             booking.start === slot.start && booking.end === slot.end
//                     );

//                     const isCrossed = labBookings.some(
//                         (booking) =>
//                             booking.isCustom &&
//                             ((booking.start >= slot.start && booking.start < slot.end) ||
//                             (booking.end > slot.start && booking.end <= slot.end) ||
//                             (booking.start <= slot.start && booking.end >= slot.end))
//                     );

//                     return {
//                         ...slot,
//                         isBooked,
//                         isCrossed,
//                     };
//                 }),
//                 otherBookings: labBookings
//                     .filter((booking) => booking.isCustom)
//                     .map((booking) => `${booking.start}-${booking.end}`),
//             };
//         });

//         setAvailableSlots(slots);
//     };

//     // Custom calendar tile styling
//     const tileClassName = ({ date, view }) => {
//         if (view === 'month') {
//             const today = new Date();
//             today.setHours(0, 0, 0, 0);
            
//             if (date < today) {
//                 return 'past-date';
//             }
            
//             if (date.toDateString() === today.toDateString()) {
//                 return 'current-date';
//             }
//         }
//         return null;
//     };

//     // Custom calendar tile content
//     const tileContent = ({ date, view }) => {
//         if (view === 'month') {
//             const today = new Date();
//             today.setHours(0, 0, 0, 0);
            
//             const formattedDate = date.toISOString().split('T')[0];
//             const hasBookings = bookings.some(booking => 
//                 new Date(booking.date).toDateString() === date.toDateString()
//             );
            
//             if (hasBookings) {
//                 return <div className="booking-indicator"></div>;
//             }
//         }
//         return null;
//     };

//     const onDateChange = (newDate) => {
//         const year = newDate.getFullYear();
//         const month = newDate.getMonth();
//         const day = newDate.getDate();
//         const localDate = new Date(year, month, day, 12, 0, 0);
//         setDate(localDate);
//         setIsCalendarVisible(false);
//     };

//     const toggleCalendar = () => setIsCalendarVisible((prev) => !prev);

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
//         setUser(userData);
//     };

//     const handleDeleteBooking = async (id) => {
//         try {
//             const response = await fetch(`http://localhost:3001/api/bookings/${id}`, {
//                 method: "DELETE",
//             });

//             if (response.ok) {
//                 fetchBookings();
//             } else {
//                 console.error("Failed to delete booking.");
//             }
//         } catch (error) {
//             console.error("Error deleting booking:", error.message);
//         }
//     };

//     return (
//         <div className="dashPage">
//             <div className="gridBox">
//                 <SideNavigation />
//                 <div className="rightPanel">
//                     <UserDetails onUserDataFetched={handleUserDataFetched} />
//                     <div className="dashBoxer">
//                         <div className="dashBox">
//                             <div className="dashName">
//                                 <h1 className="pageTitle">Booking & Reservation</h1>
//                             </div>

//                             <div className="addNsearch">
//                                 {!isPastDate && (
//                                     <div className="addItem" id="fullReportGap">
//                                         <button className="addItemBtn" onClick={toggleFormVisibility}>
//                                             <b>Book your lab</b>
//                                         </button>
//                                     </div>
//                                 )}

//                                 <div className="addItem">
//                                     <button className="addItemBtn" onClick={toggleCalendar}>
//                                         <FaCalendarAlt size={20} />
//                                     </button>
//                                     <div className="calenderDiv">
//                                         {isCalendarVisible && (
//                                             <Calendar 
//                                                 onChange={onDateChange} 
//                                                 value={date}
//                                                 tileClassName={tileClassName}
//                                                 tileContent={tileContent}
//                                             />
//                                         )}
//                                     </div>
//                                 </div>
//                             </div>
//                         </div>

//                         <div className="bookingTableBox">
//                             <Box sx={{ width: "100%" }}>
//                                 <Paper sx={{ width: "100%", mb: 2 }}>
//                                     <TableContainer>
//                                         <Table size="small">
//                                             <TableHead>
//                                                 <TableRow>
//                                                     <TableCell><b>Venue</b></TableCell>
//                                                     {predefinedSlots.map((slot, index) => (
//                                                         <TableCell key={index} align="center">
//                                                             <b>{slot.label}</b>
//                                                         </TableCell>
//                                                     ))}
//                                                     <TableCell align="center"><b>Other Bookings</b></TableCell>
//                                                 </TableRow>
//                                             </TableHead>
//                                             <TableBody>
//                                                 {availableSlots.map((labSlot, labIndex) => (
//                                                     <TableRow key={labIndex}>
//                                                         <TableCell><b>{labSlot.lab}</b></TableCell>
//                                                         {labSlot.predefinedSlots.map((slot, slotIndex) => (
//                                                             <TableCell
//                                                                 key={slotIndex}
//                                                                 align="center"
//                                                                 style={{
//                                                                     backgroundColor: slot.isBooked ? "#ffcccc" : "#ccffcc",
//                                                                     textDecoration: slot.isCrossed ? "line-through" : "none",
//                                                                     fontWeight: "bold",
//                                                                 }}
//                                                             >
//                                                                 {slot.isBooked ? "Booked" : "Available"}
//                                                             </TableCell>
//                                                         ))}
//                                                         <TableCell align="center">
//                                                             {labSlot.otherBookings.map((booking, index) => (
//                                                                 <div
//                                                                     key={index}
//                                                                     style={{
//                                                                         backgroundColor: "#ffcccc",
//                                                                         padding: "5px",
//                                                                         margin: "2px",
//                                                                         borderRadius: "5px",
//                                                                         fontWeight: "bold",
//                                                                     }}
//                                                                 >
//                                                                     {booking}
//                                                                 </div>
//                                                             ))}
//                                                         </TableCell>
//                                                     </TableRow>
//                                                 ))}
//                                             </TableBody>
//                                         </Table>
//                                     </TableContainer>
//                                 </Paper>
//                             </Box>
//                         </div>

//                         <div className="bookingTableBox">
//                             <Box sx={{ width: "100%" }}>
//                                 <Paper sx={{ width: "100%", mb: 2 }}>
//                                     <TableContainer>
//                                         <Table size="small">
//                                             <TableHead>
//                                                 <TableRow>
//                                                     <TableCell padding="checkbox"></TableCell>
//                                                     <TableCell><b>Lab Name</b></TableCell>
//                                                     <TableCell><b>Venue</b></TableCell>
//                                                     <TableCell><b>Date</b></TableCell>
//                                                     <TableCell><b>Time Interval</b></TableCell>
//                                                     <TableCell><b>Booked By</b></TableCell>
//                                                     <TableCell><b>Actions</b></TableCell>
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
//                                                                 <TableCell>{booking.timeSlot}</TableCell>
//                                                                 <TableCell>{booking.bookedBy}</TableCell>
//                                                                 <TableCell>
//                                                                     <IconButton
//                                                                         onClick={(e) => {
//                                                                             e.stopPropagation();
//                                                                             handleDeleteBooking(booking._id);
//                                                                         }}
//                                                                         aria-label="delete"
//                                                                     >
//                                                                         <DeleteIcon />
//                                                                     </IconButton>
//                                                                 </TableCell>
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
//                     user={user}
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
    Tabs,
    Tab,
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
    const [user, setUser] = useState(null);
    const [availableSlots, setAvailableSlots] = useState([]);
    const [isPastDate, setIsPastDate] = useState(false);
    const [activeTab, setActiveTab] = useState(0); // 0 for availabilities, 1 for bookings

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

    // Check if selected date is in the past
    useEffect(() => {
        const today = new Date();
        today.setHours(0, 0, 0, 0);
        setIsPastDate(date < today);
    }, [date]);

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
                calculateAvailableSlots(data, formattedDate);
            } else {
                console.error("Failed to fetch bookings.");
            }
        } catch (error) {
            console.error("Error fetching bookings:", error.message);
        }
    };

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

    // Custom calendar tile styling
    const tileClassName = ({ date, view }) => {
        if (view === 'month') {
            const today = new Date();
            today.setHours(0, 0, 0, 0);
            
            if (date < today) {
                return 'past-date';
            }
            
            if (date.toDateString() === today.toDateString()) {
                return 'current-date';
            }
        }
        return null;
    };

    // Custom calendar tile content
    const tileContent = ({ date, view }) => {
        if (view === 'month') {
            const today = new Date();
            today.setHours(0, 0, 0, 0);
            
            const formattedDate = date.toISOString().split('T')[0];
            const hasBookings = bookings.some(booking => 
                new Date(booking.date).toDateString() === date.toDateString()
            );
            
            if (hasBookings) {
                return <div className="booking-indicator"></div>;
            }
        }
        return null;
    };

    const onDateChange = (newDate) => {
        const year = newDate.getFullYear();
        const month = newDate.getMonth();
        const day = newDate.getDate();
        const localDate = new Date(year, month, day, 12, 0, 0);
        setDate(localDate);
        setIsCalendarVisible(false);
    };

    const toggleCalendar = () => setIsCalendarVisible((prev) => !prev);

    const toggleFormVisibility = () => setIsFormVisible(!isFormVisible);

    const handleTabChange = (event, newValue) => {
        setActiveTab(newValue);
    };

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

    const isSelected = (id) => selected.indexOf(id) !== -1;

    const handleChangePage = (event, newPage) => {
        setPage(newPage);
    };

    const handleChangeRowsPerPage = (event) => {
        setRowsPerPage(parseInt(event.target.value, 10));
        setPage(0);
    };

    const handleUserDataFetched = (userData) => {
        setUser(userData);
    };

    const handleDeleteBooking = async (id) => {
        try {
            const response = await fetch(`http://localhost:3001/api/bookings/${id}`, {
                method: "DELETE",
            });

            if (response.ok) {
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
                    <UserDetails onUserDataFetched={handleUserDataFetched} />
                    <div className="dashBoxer">
                        <div className="dashBox">
                            <div className="dashName">
                                <h1 className="pageTitle">Booking & Reservation</h1>
                            </div>

                            <div className="addNsearch">
                                {!isPastDate && (
                                    <div className="addItem" id="fullReportGap">
                                        <button className="addItemBtn" onClick={toggleFormVisibility}>
                                            <b>Book your lab</b>
                                        </button>
                                    </div>
                                )}

                                <div className="addItem">
                                    <button className="addItemBtn" onClick={toggleCalendar}>
                                        <FaCalendarAlt size={20} />
                                    </button>
                                    <div className="calenderDiv">
                                        {isCalendarVisible && (
                                            <Calendar 
                                                onChange={onDateChange} 
                                                value={date}
                                                tileClassName={tileClassName}
                                                tileContent={tileContent}
                                            />
                                        )}
                                    </div>
                                </div>
                            </div>
                        </div>

                        <Box sx={{ width: "100%", marginBottom: 2 }}>
                            <Tabs value={activeTab} onChange={handleTabChange} centered>
                                <Tab label="Lab Availabilities" />
                                <Tab label="Bookings List" />
                            </Tabs>
                        </Box>

                        {activeTab === 0 && (
                            <div className="bookingTableBox">
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
                        )}

                        {activeTab === 1 && (
                            <div className="bookingTableBox">
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
                                                                                e.stopPropagation();
                                                                                handleDeleteBooking(booking._id);
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
                        )}
                    </div>
                </div>
            </div>

            {isFormVisible && (
                <BookingForm
                    closeForm={toggleFormVisibility}
                    selectedDate={date}
                    onBookingAdded={fetchBookings}
                    user={user}
                />
            )}
        </div>
    );
};

export default BookingReservation;