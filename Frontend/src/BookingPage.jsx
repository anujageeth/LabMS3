// import React, { useState, useEffect } from "react";
// import Calendar from "react-calendar";
// import { FaCalendarAlt } from "react-icons/fa";
// import {
//   Box,
//   Paper,
//   Table,
//   TableBody,
//   TableCell,
//   TableContainer,
//   TableHead,
//   TablePagination,
//   TableRow,
//   Checkbox,
//   Tooltip,
//   IconButton,
// } from "@mui/material";
// import AddIcon from "@mui/icons-material/Add";
// import RemoveIcon from "@mui/icons-material/Remove";
// import SideNavigation from "./components/SideNavigation";
// import UserDetails from "./components/UserDetails";
// import BookingForm from "./components/BookingForm";
// import "./BookingReservation.css";
// import "react-calendar/dist/Calendar.css";

// const BookingReservation = () => {
//   const [date, setDate] = useState(new Date());
//   const [isCalendarVisible, setIsCalendarVisible] = useState(false);
//   const [isFormVisible, setIsFormVisible] = useState(false);
//   const [bookings, setBookings] = useState([]);
//   const [page, setPage] = useState(0);
//   const [rowsPerPage, setRowsPerPage] = useState(5);
//   const [selected, setSelected] = useState([]);

//   useEffect(() => {
//     fetchBookings();
//   }, [date]);

//   const fetchBookings = async () => {
//     try {
//       const formattedDate = date.toISOString().split("T")[0];
//       const response = await fetch(
//         `http://localhost:3001/api/bookings?date=${formattedDate}`
//       );
//       if (response.ok) {
//         const data = await response.json();
//         setBookings(data);
//       } else {
//         console.error("Failed to fetch bookings.");
//       }
//     } catch (error) {
//       console.error("Error fetching bookings:", error.message);
//     }
//   };

//   const onDateChange = (newDate) => {
//     // Extract year, month, and day from the selected date
//     const year = newDate.getFullYear();
//     const month = newDate.getMonth(); // Months are 0-based
//     const day = newDate.getDate();
  
//     // Create a new date in local time (without UTC conversion)
//     const localDate = new Date(year, month, day, 12, 0, 0); // Set time to noon to prevent any timezone shifts
  
//     setDate(localDate);
//     setIsCalendarVisible(false);
//   };
  

//   const toggleCalendar = () => setIsCalendarVisible(!isCalendarVisible);

//   const toggleFormVisibility = () => setIsFormVisible(!isFormVisible);

//   const handleClick = (event, row) => {
//     const selectedIndex = selected.indexOf(row._id);
//     let newSelected = [];

//     if (selectedIndex === -1) {
//       newSelected = newSelected.concat(selected, row._id);
//     } else if (selectedIndex === 0) {
//       newSelected = newSelected.concat(selected.slice(1));
//     } else if (selectedIndex === selected.length - 1) {
//       newSelected = newSelected.concat(selected.slice(0, -1));
//     } else if (selectedIndex > 0) {
//       newSelected = newSelected.concat(
//         selected.slice(0, selectedIndex),
//         selected.slice(selectedIndex + 1)
//       );
//     }

//     setSelected(newSelected);
//   };

//   const isSelected = (id) => selected.indexOf(id) !== -1;

//   const handleChangePage = (event, newPage) => {
//     setPage(newPage);
//   };

//   const handleChangeRowsPerPage = (event) => {
//     setRowsPerPage(parseInt(event.target.value, 10));
//     setPage(0);
//   };

//   return (
//     <div className="dashPage">
//       <div className="gridBox">
//         <SideNavigation />
//         <div className="rightPanel">
//           <UserDetails />

//           <div className="dashBoxer">
//             <div className="dashBox">
//               <div className="dashName">
//                 <h1 className="pageTitle">Booking & Reservation</h1>
//               </div>

//               <div className="addNsearch">
//                 <div className="addItem">
//                   <button className="addItemBtn" onClick={toggleFormVisibility}>
//                     <b>Book your lab</b>
//                   </button>
//                 </div>

//                 <div className="calendar">
//                   <div className="calendarIcon" onClick={toggleCalendar}>
//                     <FaCalendarAlt size={24} />
//                   </div>
//                   {isCalendarVisible && (
//                     <Calendar onChange={onDateChange} value={date} />
//                   )}
//                 </div>
//               </div>
//             </div>

//             <div className="dataTableBox">
//               <Box sx={{ width: "100%" }}>
//                 <Paper sx={{ width: "100%", mb: 2 }}>
//                   <TableContainer>
//                     <Table size="small">
//                       <TableHead>
//                         <TableRow>
//                           <TableCell padding="checkbox"></TableCell>
//                           <TableCell><b>Lab Name</b></TableCell>
//                           <TableCell><b>Lab Place</b></TableCell>
//                           <TableCell><b>Date</b></TableCell>
//                           <TableCell><b>Time</b></TableCell>
//                           <TableCell><b>Duration</b></TableCell>
//                           <TableCell><b>Booked By</b></TableCell>
//                         </TableRow>
//                       </TableHead>
//                       <TableBody>
//                         {bookings
//                           .slice(
//                             page * rowsPerPage,
//                             page * rowsPerPage + rowsPerPage
//                           )
//                           .map((booking) => {
//                             const isItemSelected = isSelected(booking._id);
//                             return (
//                               <TableRow
//                                 hover
//                                 onClick={(event) => handleClick(event, booking)}
//                                 role="checkbox"
//                                 aria-checked={isItemSelected}
//                                 tabIndex={-1}
//                                 key={booking._id}
//                                 selected={isItemSelected}
//                               >
//                                 <TableCell padding="checkbox">
//                                   <Checkbox
//                                     color="primary"
//                                     checked={isItemSelected}
//                                     inputProps={{
//                                       "aria-labelledby": `enhanced-table-checkbox-${booking._id}`,
//                                     }}
//                                   />
//                                 </TableCell>
//                                 <TableCell>{booking.labName}</TableCell>
//                                 <TableCell>{booking.labPlace}</TableCell>
//                                 <TableCell>{booking.date}</TableCell>
//                                 <TableCell>{booking.time}</TableCell>
//                                 <TableCell>{booking.duration} hrs</TableCell>
//                                 <TableCell>{booking.bookedBy}</TableCell>
//                               </TableRow>
//                             );
//                           })}
//                       </TableBody>
//                     </Table>
//                   </TableContainer>
//                   <TablePagination
//                     rowsPerPageOptions={[5, 10, 25]}
//                     component="div"
//                     count={bookings.length}
//                     rowsPerPage={rowsPerPage}
//                     page={page}
//                     onPageChange={handleChangePage}
//                     onRowsPerPageChange={handleChangeRowsPerPage}
//                   />
//                 </Paper>
//               </Box>
//             </div>
//           </div>
//         </div>
//       </div>

//       {isFormVisible && (
//         <BookingForm
//           closeForm={toggleFormVisibility}
//           selectedDate={date}
//           onBookingAdded={fetchBookings}
//         />
//       )}
//     </div>
//   );
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
    TablePagination,
    TableRow,
    Checkbox,
    Tooltip,
    IconButton,
} from "@mui/material";
import AddIcon from "@mui/icons-material/Add";
import RemoveIcon from "@mui/icons-material/Remove";
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
            } else {
                console.error("Failed to fetch bookings.");
            }
        } catch (error) {
            console.error("Error fetching bookings:", error.message);
        }
    };

    const onDateChange = (newDate) => {
        const year = newDate.getFullYear();
        const month = newDate.getMonth();
        const day = newDate.getDate();
        const localDate = new Date(year, month, day, 12, 0, 0);
        setDate(localDate);
        setIsCalendarVisible(false);
    };

    const toggleCalendar = () => setIsCalendarVisible(!isCalendarVisible);

    const toggleFormVisibility = () => setIsFormVisible(!isFormVisible);

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
        setUser(userData); // Set user data in state
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
                                <div className="addItem">
                                    <button className="addItemBtn" onClick={toggleFormVisibility}>
                                        <b>Book your lab</b>
                                    </button>
                                </div>

                                <div className="calendar">
                                    <div className="calendarIcon" onClick={toggleCalendar}>
                                        <FaCalendarAlt size={24} />
                                    </div>
                                    {isCalendarVisible && (
                                        <Calendar onChange={onDateChange} value={date} />
                                    )}
                                </div>
                            </div>
                        </div>

                        <div className="dataTableBox">
                            <Box sx={{ width: "100%" }}>
                                <Paper sx={{ width: "100%", mb: 2 }}>
                                    <TableContainer>
                                        <Table size="small">
                                            <TableHead>
                                                <TableRow>
                                                    <TableCell padding="checkbox"></TableCell>
                                                    <TableCell><b>Lab Name</b></TableCell>
                                                    <TableCell><b>Lab Place</b></TableCell>
                                                    <TableCell><b>Date</b></TableCell>
                                                    <TableCell><b>Time</b></TableCell>
                                                    <TableCell><b>Duration</b></TableCell>
                                                    <TableCell><b>Booked By</b></TableCell>
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
                                                                <TableCell>{booking.time}</TableCell>
                                                                <TableCell>{booking.duration} hrs</TableCell>
                                                                <TableCell>{booking.bookedBy}</TableCell>
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

            {isFormVisible && (
                <BookingForm
                    closeForm={toggleFormVisibility}
                    selectedDate={date}
                    onBookingAdded={fetchBookings}
                    user={user} // Pass user data to BookingForm
                />
            )}
        </div>
    );
};

export default BookingReservation;