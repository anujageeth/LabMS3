
// // import React, { useState, useEffect } from "react";
// // import Calendar from "react-calendar";
// // import { FaCalendarAlt } from "react-icons/fa";
// // import {
// //     Box,
// //     Paper,
// //     Table,
// //     TableBody,
// //     TableCell,
// //     TableContainer,
// //     TableHead,
// //     TableRow,
// //     TablePagination,
// //     Checkbox,
// //     IconButton,
// //     Tabs,
// //     Tab,
// // } from "@mui/material";
// // import DeleteIcon from "@mui/icons-material/Delete";
// // import SideNavigation from "./components/SideNavigation";
// // import UserDetails from "./components/UserDetails";
// // import BookingForm from "./components/BookingForm";
// // import "./BookingReservation.css";
// // import "react-calendar/dist/Calendar.css";

// // const BookingReservation = () => {
// //     const [date, setDate] = useState(new Date());
// //     const [isCalendarVisible, setIsCalendarVisible] = useState(false);
// //     const [isFormVisible, setIsFormVisible] = useState(false);
// //     const [bookings, setBookings] = useState([]);
// //     const [page, setPage] = useState(0);
// //     const [rowsPerPage, setRowsPerPage] = useState(5);
// //     const [selected, setSelected] = useState([]);
// //     const [user, setUser] = useState(null);
// //     const [availableSlots, setAvailableSlots] = useState([]);
// //     const [isPastDate, setIsPastDate] = useState(false);
// //     const [activeTab, setActiveTab] = useState(0); // 0 for availabilities, 1 for bookings

// //     // Predefined time slots
// //     const predefinedSlots = [
// //         { start: "08:30", end: "11:30", label: "8:30 AM - 11:30 AM" },
// //         { start: "13:30", end: "16:30", label: "1:30 PM - 4:30 PM" },
// //     ];

// //     // Labs
// //     const labs = [
// //         "Electrical Machines Lab",
// //         "Communication Lab",
// //         "Measurements Lab",
// //         "High Voltage Lab",
// //     ];

// //     // Check if selected date is in the past
// //     useEffect(() => {
// //         const today = new Date();
// //         today.setHours(0, 0, 0, 0);
// //         setIsPastDate(date < today);
// //     }, [date]);

// //     // Fetch bookings for the selected date
// //     useEffect(() => {
// //         fetchBookings();
// //     }, [date]);

// //     const fetchBookings = async () => {
// //         try {
// //             const formattedDate = date.toISOString().split("T")[0];
// //             const response = await fetch(
// //                 `http://localhost:3001/api/bookings?date=${formattedDate}`
// //             );
// //             if (response.ok) {
// //                 const data = await response.json();
// //                 setBookings(data);
// //                 calculateAvailableSlots(data, formattedDate);
// //             } else {
// //                 console.error("Failed to fetch bookings.");
// //             }
// //         } catch (error) {
// //             console.error("Error fetching bookings:", error.message);
// //         }
// //     };

// //     const calculateAvailableSlots = (bookings, date) => {
// //         const bookedSlots = bookings.map((booking) => ({
// //             start: booking.timeSlot.split("-")[0],
// //             end: booking.timeSlot.split("-")[1],
// //             labPlace: booking.labPlace,
// //             isCustom: !predefinedSlots.some(
// //                 (slot) =>
// //                     slot.start === booking.timeSlot.split("-")[0] &&
// //                     slot.end === booking.timeSlot.split("-")[1]
// //             ),
// //         }));

// //         const slots = labs.map((lab) => {
// //             const labBookings = bookedSlots.filter((booking) => booking.labPlace === lab);

// //             return {
// //                 lab,
// //                 predefinedSlots: predefinedSlots.map((slot) => {
// //                     const isBooked = labBookings.some(
// //                         (booking) =>
// //                             booking.start === slot.start && booking.end === slot.end
// //                     );

// //                     const isCrossed = labBookings.some(
// //                         (booking) =>
// //                             booking.isCustom &&
// //                             ((booking.start >= slot.start && booking.start < slot.end) ||
// //                             (booking.end > slot.start && booking.end <= slot.end) ||
// //                             (booking.start <= slot.start && booking.end >= slot.end))
// //                     );

// //                     return {
// //                         ...slot,
// //                         isBooked,
// //                         isCrossed,
// //                     };
// //                 }),
// //                 otherBookings: labBookings
// //                     .filter((booking) => booking.isCustom)
// //                     .map((booking) => `${booking.start}-${booking.end}`),
// //             };
// //         });

// //         setAvailableSlots(slots);
// //     };

// //     // Custom calendar tile styling
// //     const tileClassName = ({ date, view }) => {
// //         if (view === 'month') {
// //             const today = new Date();
// //             today.setHours(0, 0, 0, 0);
            
// //             if (date < today) {
// //                 return 'past-date';
// //             }
            
// //             if (date.toDateString() === today.toDateString()) {
// //                 return 'current-date';
// //             }
// //         }
// //         return null;
// //     };

// //     // Custom calendar tile content
// //     const tileContent = ({ date, view }) => {
// //         if (view === 'month') {
// //             const today = new Date();
// //             today.setHours(0, 0, 0, 0);
            
// //             const formattedDate = date.toISOString().split('T')[0];
// //             const hasBookings = bookings.some(booking => 
// //                 new Date(booking.date).toDateString() === date.toDateString()
// //             );
            
// //             if (hasBookings) {
// //                 return <div className="booking-indicator"></div>;
// //             }
// //         }
// //         return null;
// //     };

// //     const onDateChange = (newDate) => {
// //         const year = newDate.getFullYear();
// //         const month = newDate.getMonth();
// //         const day = newDate.getDate();
// //         const localDate = new Date(year, month, day, 12, 0, 0);
// //         setDate(localDate);
// //         setIsCalendarVisible(false);
// //     };

// //     const toggleCalendar = () => setIsCalendarVisible((prev) => !prev);

// //     const toggleFormVisibility = () => setIsFormVisible(!isFormVisible);

// //     const handleTabChange = (event, newValue) => {
// //         setActiveTab(newValue);
// //     };

// //     const handleClick = (event, row) => {
// //         const selectedIndex = selected.indexOf(row._id);
// //         let newSelected = [];

// //         if (selectedIndex === -1) {
// //             newSelected = newSelected.concat(selected, row._id);
// //         } else if (selectedIndex === 0) {
// //             newSelected = newSelected.concat(selected.slice(1));
// //         } else if (selectedIndex === selected.length - 1) {
// //             newSelected = newSelected.concat(selected.slice(0, -1));
// //         } else if (selectedIndex > 0) {
// //             newSelected = newSelected.concat(
// //                 selected.slice(0, selectedIndex),
// //                 selected.slice(selectedIndex + 1)
// //             );
// //         }

// //         setSelected(newSelected);
// //     };

// //     const isSelected = (id) => selected.indexOf(id) !== -1;

// //     const handleChangePage = (event, newPage) => {
// //         setPage(newPage);
// //     };

// //     const handleChangeRowsPerPage = (event) => {
// //         setRowsPerPage(parseInt(event.target.value, 10));
// //         setPage(0);
// //     };

// //     const handleUserDataFetched = (userData) => {
// //         setUser(userData);
// //     };

// //     const handleDeleteBooking = async (id) => {
// //         try {
// //             const response = await fetch(`http://localhost:3001/api/bookings/${id}`, {
// //                 method: "DELETE",
// //             });

// //             if (response.ok) {
// //                 fetchBookings();
// //             } else {
// //                 console.error("Failed to delete booking.");
// //             }
// //         } catch (error) {
// //             console.error("Error deleting booking:", error.message);
// //         }
// //     };

// //     return (
// //         <div className="dashPage">
// //             <div className="gridBox">
// //                 <SideNavigation />
// //                 <div className="rightPanel">
// //                     <UserDetails onUserDataFetched={handleUserDataFetched} />
// //                     <div className="dashBoxer">
// //                         <div className="dashBox">
// //                             <div className="dashName">
// //                                 <h1 className="pageTitle">Booking & Reservation</h1>
// //                             </div>

// //                             <div className="addNsearch">
// //                                 {!isPastDate && (
// //                                     <div className="addItem" id="fullReportGap">
// //                                         <button className="addItemBtn" onClick={toggleFormVisibility}>
// //                                             <b>Book your lab</b>
// //                                         </button>
// //                                     </div>
// //                                 )}

// //                                 <div className="addItem">
// //                                     <button className="addItemBtn" onClick={toggleCalendar}>
// //                                         <FaCalendarAlt size={20} />
// //                                     </button>
// //                                     <div className="calenderDiv">
// //                                         {isCalendarVisible && (
// //                                             <Calendar 
// //                                                 onChange={onDateChange} 
// //                                                 value={date}
// //                                                 tileClassName={tileClassName}
// //                                                 tileContent={tileContent}
// //                                             />
// //                                         )}
// //                                     </div>
// //                                 </div>
// //                             </div>
// //                         </div>

// //                         <Box sx={{ width: "100%", marginBottom: 2 }}>
// //                             <Tabs value={activeTab} onChange={handleTabChange} centered>
// //                                 <Tab label="Lab Availabilities" />
// //                                 <Tab label="Bookings List" />
// //                             </Tabs>
// //                         </Box>

// //                         {activeTab === 0 && (
// //                             <div className="bookingTableBox">
// //                                 <Box sx={{ width: "100%" }}>
// //                                     <Paper sx={{ width: "100%", mb: 2 }}>
// //                                         <TableContainer>
// //                                             <Table size="small">
// //                                                 <TableHead>
// //                                                     <TableRow>
// //                                                         <TableCell><b>Venue</b></TableCell>
// //                                                         {predefinedSlots.map((slot, index) => (
// //                                                             <TableCell key={index} align="center">
// //                                                                 <b>{slot.label}</b>
// //                                                             </TableCell>
// //                                                         ))}
// //                                                         <TableCell align="center"><b>Other Bookings</b></TableCell>
// //                                                     </TableRow>
// //                                                 </TableHead>
// //                                                 <TableBody>
// //                                                     {availableSlots.map((labSlot, labIndex) => (
// //                                                         <TableRow key={labIndex}>
// //                                                             <TableCell><b>{labSlot.lab}</b></TableCell>
// //                                                             {labSlot.predefinedSlots.map((slot, slotIndex) => (
// //                                                                 <TableCell
// //                                                                     key={slotIndex}
// //                                                                     align="center"
// //                                                                     style={{
// //                                                                         backgroundColor: slot.isBooked ? "#ffcccc" : "#ccffcc",
// //                                                                         textDecoration: slot.isCrossed ? "line-through" : "none",
// //                                                                         fontWeight: "bold",
// //                                                                     }}
// //                                                                 >
// //                                                                     {slot.isBooked ? "Booked" : "Available"}
// //                                                                 </TableCell>
// //                                                             ))}
// //                                                             <TableCell align="center">
// //                                                                 {labSlot.otherBookings.map((booking, index) => (
// //                                                                     <div
// //                                                                         key={index}
// //                                                                         style={{
// //                                                                             backgroundColor: "#ffcccc",
// //                                                                             padding: "5px",
// //                                                                             margin: "2px",
// //                                                                             borderRadius: "5px",
// //                                                                             fontWeight: "bold",
// //                                                                         }}
// //                                                                     >
// //                                                                         {booking}
// //                                                                     </div>
// //                                                                 ))}
// //                                                             </TableCell>
// //                                                         </TableRow>
// //                                                     ))}
// //                                                 </TableBody>
// //                                             </Table>
// //                                         </TableContainer>
// //                                     </Paper>
// //                                 </Box>
// //                             </div>
// //                         )}

// //                         {activeTab === 1 && (
// //                             <div className="bookingTableBox">
// //                                 <Box sx={{ width: "100%" }}>
// //                                     <Paper sx={{ width: "100%", mb: 2 }}>
// //                                         <TableContainer>
// //                                             <Table size="small">
// //                                                 <TableHead>
// //                                                     <TableRow>
// //                                                         <TableCell padding="checkbox"></TableCell>
// //                                                         <TableCell><b>Lab Name</b></TableCell>
// //                                                         <TableCell><b>Venue</b></TableCell>
// //                                                         <TableCell><b>Date</b></TableCell>
// //                                                         <TableCell><b>Time Interval</b></TableCell>
// //                                                         <TableCell><b>Booked By</b></TableCell>
// //                                                         <TableCell><b>Actions</b></TableCell>
// //                                                     </TableRow>
// //                                                 </TableHead>
// //                                                 <TableBody>
// //                                                     {bookings
// //                                                         .slice(
// //                                                             page * rowsPerPage,
// //                                                             page * rowsPerPage + rowsPerPage
// //                                                         )
// //                                                         .map((booking) => {
// //                                                             const isItemSelected = isSelected(booking._id);
// //                                                             return (
// //                                                                 <TableRow
// //                                                                     hover
// //                                                                     onClick={(event) => handleClick(event, booking)}
// //                                                                     role="checkbox"
// //                                                                     aria-checked={isItemSelected}
// //                                                                     tabIndex={-1}
// //                                                                     key={booking._id}
// //                                                                     selected={isItemSelected}
// //                                                                 >
// //                                                                     <TableCell padding="checkbox">
// //                                                                         <Checkbox
// //                                                                             color="primary"
// //                                                                             checked={isItemSelected}
// //                                                                             inputProps={{
// //                                                                                 "aria-labelledby": `enhanced-table-checkbox-${booking._id}`,
// //                                                                             }}
// //                                                                         />
// //                                                                     </TableCell>
// //                                                                     <TableCell>{booking.labName}</TableCell>
// //                                                                     <TableCell>{booking.labPlace}</TableCell>
// //                                                                     <TableCell>{booking.date}</TableCell>
// //                                                                     <TableCell>{booking.timeSlot}</TableCell>
// //                                                                     <TableCell>{booking.bookedBy}</TableCell>
// //                                                                     <TableCell>
// //                                                                         <IconButton
// //                                                                             onClick={(e) => {
// //                                                                                 e.stopPropagation();
// //                                                                                 handleDeleteBooking(booking._id);
// //                                                                             }}
// //                                                                             aria-label="delete"
// //                                                                         >
// //                                                                             <DeleteIcon />
// //                                                                         </IconButton>
// //                                                                     </TableCell>
// //                                                                 </TableRow>
// //                                                             );
// //                                                         })}
// //                                                 </TableBody>
// //                                             </Table>
// //                                         </TableContainer>
// //                                         <TablePagination
// //                                             rowsPerPageOptions={[5, 10, 25]}
// //                                             component="div"
// //                                             count={bookings.length}
// //                                             rowsPerPage={rowsPerPage}
// //                                             page={page}
// //                                             onPageChange={handleChangePage}
// //                                             onRowsPerPageChange={handleChangeRowsPerPage}
// //                                         />
// //                                     </Paper>
// //                                 </Box>
// //                             </div>
// //                         )}
// //                     </div>
// //                 </div>
// //             </div>

// //             {isFormVisible && (
// //                 <BookingForm
// //                     closeForm={toggleFormVisibility}
// //                     selectedDate={date}
// //                     onBookingAdded={fetchBookings}
// //                     user={user}
// //                 />
// //             )}
// //         </div>
// //     );
// // };

// // export default BookingReservation;


// import React, { useState, useEffect } from "react";
// import Calendar from "react-calendar";
// import { FaCalendarAlt, FaEdit } from "react-icons/fa";
// import {
//   Box,
//   Paper,
//   Table,
//   TableBody,
//   TableCell,
//   TableContainer,
//   TableHead,
//   TableRow,
//   TablePagination,
//   Checkbox,
//   IconButton,
//   Tabs,
//   Tab,
//   Dialog,
//   DialogTitle,
//   DialogContent,
//   DialogActions,
//   Button,
//   TextField,
//   Select,
//   MenuItem,
//   InputLabel,
//   FormControl,
//   Snackbar,
//   Alert,
//   Typography,
//   List,
//   ListItem,
//   ListItemText
// } from "@mui/material";
// import DeleteIcon from "@mui/icons-material/Delete";
// import SideNavigation from "./components/SideNavigation";
// import UserDetails from "./components/UserDetails";
// import BookingForm from "./components/BookingForm";
// import "./BookingReservation.css";
// import "react-calendar/dist/Calendar.css";

// const API_BASE_URL = "http://localhost:3001/api";

// const BookingReservation = () => {
//   // State management
//   const [date, setDate] = useState(new Date());
//   const [isCalendarVisible, setIsCalendarVisible] = useState(false);
//   const [isFormVisible, setIsFormVisible] = useState(false);
//   const [bookings, setBookings] = useState([]);
//   const [page, setPage] = useState(0);
//   const [rowsPerPage, setRowsPerPage] = useState(5);
//   const [selected, setSelected] = useState([]);
//   const [user, setUser] = useState(null);
//   const [availableSlots, setAvailableSlots] = useState([]);
//   const [isPastDate, setIsPastDate] = useState(false);
//   const [activeTab, setActiveTab] = useState(0);
//   const [isDetailsDialogOpen, setIsDetailsDialogOpen] = useState(false);
//   const [academicDetails, setAcademicDetails] = useState({
//     semesters: [],
//     modulesBySemester: {},
//     labsByModule: {}
//   });
//   const [newSemester, setNewSemester] = useState({ name: "", number: "" });
//   const [newModule, setNewModule] = useState({ 
//     name: "", 
//     code: "",
//     semesterId: "" 
//   });
//   const [newLab, setNewLab] = useState({ 
//     name: "", 
//     location: "",
//     moduleId: "" 
//   });
//   const [snackbar, setSnackbar] = useState({
//     open: false,
//     message: "",
//     severity: "success",
//   });

//   // Constants
//   const labPlaces = [
//     "Electrical Machines Lab",
//     "Communication Lab",
//     "Measurements Lab",
//     "High Voltage Lab",
//   ];

//   const predefinedSlots = [
//     { start: "08:30", end: "11:30", label: "8:30 AM - 11:30 AM" },
//     { start: "13:30", end: "16:30", label: "1:30 PM - 4:30 PM" },
//   ];

//   // Snackbar function
//   const showSnackbar = (message, severity = "success") => {
//     setSnackbar({
//       open: true,
//       message,
//       severity
//     });
//   };

//   const handleCloseSnackbar = () => {
//     setSnackbar({ ...snackbar, open: false });
//   };

//   // Effects
//   useEffect(() => {
//     const today = new Date();
//     today.setHours(0, 0, 0, 0);
//     setIsPastDate(date < today);
//   }, [date]);

//   useEffect(() => {
//     fetchBookings();
//     fetchAcademicDetails();
//   }, [date]);

//   // Data fetching
//   const fetchAcademicDetails = async () => {
//     try {
//       const response = await fetch(`${API_BASE_URL}/academic-details`);
//       if (response.ok) {
//         const data = await response.json();
//         setAcademicDetails(data);
//       } else {
//         throw new Error("Failed to fetch academic details");
//       }
//     } catch (error) {
//       showSnackbar(error.message, "error");
//     }
//   };

//   const fetchBookings = async () => {
//     try {
//       const formattedDate = date.toISOString().split("T")[0];
//       const response = await fetch(
//         `${API_BASE_URL}/bookings?date=${formattedDate}`
//       );
//       if (response.ok) {
//         const data = await response.json();
//         setBookings(data);
//         calculateAvailableSlots(data, formattedDate);
//       }
//     } catch (error) {
//       showSnackbar("Error fetching bookings", "error");
//     }
//   };

//   // Helper functions
//   const calculateAvailableSlots = (bookings, date) => {
//     const bookedSlots = bookings.map((booking) => ({
//       start: booking.timeSlot.split("-")[0],
//       end: booking.timeSlot.split("-")[1],
//       labPlace: booking.labPlace,
//       isCustom: !predefinedSlots.some(
//         (slot) =>
//           slot.start === booking.timeSlot.split("-")[0] &&
//           slot.end === booking.timeSlot.split("-")[1]
//       ),
//     }));

//     const slots = labPlaces.map((lab) => {
//       const labBookings = bookedSlots.filter((booking) => booking.labPlace === lab);

//       return {
//         lab,
//         predefinedSlots: predefinedSlots.map((slot) => {
//           const isBooked = labBookings.some(
//             (booking) =>
//               booking.start === slot.start && booking.end === slot.end
//           );

//           const isCrossed = labBookings.some(
//             (booking) =>
//               booking.isCustom &&
//               ((booking.start >= slot.start && booking.start < slot.end) ||
//               (booking.end > slot.start && booking.end <= slot.end) ||
//               (booking.start <= slot.start && booking.end >= slot.end))
//           );

//           return {
//             ...slot,
//             isBooked,
//             isCrossed,
//           };
//         }),
//         otherBookings: labBookings
//           .filter((booking) => booking.isCustom)
//           .map((booking) => `${booking.start}-${booking.end}`),
//       };
//     });

//     setAvailableSlots(slots);
//   };

//   // CRUD operations
//   const handleAddSemester = async () => {
//     if (!newSemester.name.trim() || !newSemester.number) {
//       showSnackbar("Semester name and number are required", "error");
//       return;
//     }

//     try {
//       const response = await fetch(`${API_BASE_URL}/academic-details/semesters`, {
//         method: "POST",
//         headers: {
//           "Content-Type": "application/json",
//         },
//         body: JSON.stringify(newSemester),
//       });

//       if (response.ok) {
//         setNewSemester({ name: "", number: "" });
//         fetchAcademicDetails();
//         showSnackbar("Semester added successfully", "success");
//       } else {
//         const errorData = await response.json();
//         throw new Error(errorData.error || "Failed to add semester");
//       }
//     } catch (error) {
//       showSnackbar(error.message, "error");
//     }
//   };

//   const handleAddModule = async () => {
//     if (!newModule.name.trim() || !newModule.code.trim() || !newModule.semesterId) {
//       showSnackbar("Module name, code and semester selection are required", "error");
//       return;
//     }

//     try {
//       const response = await fetch(
//         `${API_BASE_URL}/academic-details/semesters/${newModule.semesterId}/modules`,
//         {
//           method: "POST",
//           headers: {
//             "Content-Type": "application/json",
//           },
//           body: JSON.stringify({
//             name: newModule.name,
//             code: newModule.code
//           }),
//         }
//       );

//       if (response.ok) {
//         setNewModule({ name: "", code: "", semesterId: "" });
//         fetchAcademicDetails();
//         showSnackbar("Module added successfully", "success");
//       } else {
//         const errorData = await response.json();
//         throw new Error(errorData.error || "Failed to add module");
//       }
//     } catch (error) {
//       showSnackbar(error.message, "error");
//     }
//   };

//   const handleAddLab = async () => {
//     if (!newLab.name.trim() || !newLab.location.trim() || !newLab.moduleId) {
//       showSnackbar("Lab name, location and module selection are required", "error");
//       return;
//     }

//     try {
//       const response = await fetch(
//         `${API_BASE_URL}/academic-details/modules/${newLab.moduleId}/labs`,
//         {
//           method: "POST",
//           headers: {
//             "Content-Type": "application/json",
//           },
//           body: JSON.stringify({
//             name: newLab.name,
//             location: newLab.location
//           }),
//         }
//       );

//       if (response.ok) {
//         setNewLab({ name: "", location: "", moduleId: "" });
//         fetchAcademicDetails();
//         showSnackbar("Lab added successfully", "success");
//       } else {
//         const errorData = await response.json();
//         throw new Error(errorData.error || "Failed to add lab");
//       }
//     } catch (error) {
//       showSnackbar(error.message, "error");
//     }
//   };

//   const handleDeleteItem = async (type, id) => {
//     try {
//       let endpoint = "";
//       switch (type) {
//         case "semester":
//           endpoint = `${API_BASE_URL}/academic-details/semesters/${id}`;
//           break;
//         case "module":
//           endpoint = `${API_BASE_URL}/academic-details/modules/${id}`;
//           break;
//         case "lab":
//           endpoint = `${API_BASE_URL}/academic-details/labs/${id}`;
//           break;
//         default:
//           throw new Error("Invalid item type");
//       }

//       const response = await fetch(endpoint, {
//         method: "DELETE",
//       });

//       if (response.ok) {
//         fetchAcademicDetails();
//         showSnackbar(`${type.charAt(0).toUpperCase() + type.slice(1)} deleted successfully`, "success");
//       } else {
//         const errorData = await response.json();
//         throw new Error(errorData.error || `Failed to delete ${type}`);
//       }
//     } catch (error) {
//       showSnackbar(error.message, "error");
//     }
//   };

//   // UI handlers
//   const onDateChange = (newDate) => {
//     const year = newDate.getFullYear();
//     const month = newDate.getMonth();
//     const day = newDate.getDate();
//     const localDate = new Date(year, month, day, 12, 0, 0);
//     setDate(localDate);
//     setIsCalendarVisible(false);
//   };

//   const toggleCalendar = () => setIsCalendarVisible((prev) => !prev);
//   const toggleFormVisibility = () => setIsFormVisible(!isFormVisible);
//   const toggleDetailsDialog = () => setIsDetailsDialogOpen(!isDetailsDialogOpen);

//   const handleTabChange = (event, newValue) => {
//     setActiveTab(newValue);
//   };

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

//   const handleUserDataFetched = (userData) => {
//     setUser(userData);
//   };

//   const handleDeleteBooking = async (id) => {
//     try {
//       const response = await fetch(`${API_BASE_URL}/bookings/${id}`, {
//         method: "DELETE",
//       });

//       if (response.ok) {
//         fetchBookings();
//         showSnackbar("Booking deleted successfully", "success");
//       } else {
//         showSnackbar("Failed to delete booking", "error");
//       }
//     } catch (error) {
//       showSnackbar("Error deleting booking", "error");
//     }
//   };

//   // Calendar styling functions
//   const tileClassName = ({ date, view }) => {
//     if (view === 'month') {
//       const today = new Date();
//       today.setHours(0, 0, 0, 0);
      
//       if (date < today) {
//         return 'past-date';
//       }
      
//       if (date.toDateString() === today.toDateString()) {
//         return 'current-date';
//       }
//     }
//     return null;
//   };

//   const tileContent = ({ date, view }) => {
//     if (view === 'month') {
//       const today = new Date();
//       today.setHours(0, 0, 0, 0);
      
//       const formattedDate = date.toISOString().split('T')[0];
//       const hasBookings = bookings.some(booking => 
//         new Date(booking.date).toDateString() === date.toDateString()
//       );
      
//       if (hasBookings) {
//         return <div className="booking-indicator"></div>;
//       }
//     }
//     return null;
//   };

//   // Render function
//   return (
//     <div className="dashPage">
//       <div className="gridBox">
//         <SideNavigation />
//         <div className="rightPanel">
//           <UserDetails onUserDataFetched={handleUserDataFetched} />
//           <div className="dashBoxer">
//             <div className="dashBox">
//               <div className="dashName">
//                 <h1 className="pageTitle">Booking & Reservation</h1>
//               </div>

//               <div className="addNsearch">
//                 {!isPastDate && (
//                   <div className="addItem" id="fullReportGap">
//                     <button className="addItemBtn" onClick={toggleFormVisibility}>
//                       <b>Book your lab</b>
//                     </button>
//                   </div>
//                 )}

//                 <div className="addItem">
//                   <button className="addItemBtn" onClick={toggleCalendar}>
//                     <FaCalendarAlt size={20} />
//                   </button>
//                   <div className="calenderDiv">
//                     {isCalendarVisible && (
//                       <Calendar 
//                         onChange={onDateChange} 
//                         value={date}
//                         tileClassName={tileClassName}
//                         tileContent={tileContent}
//                       />
//                     )}
//                   </div>
//                 </div>

//                 <div className="addItem">
//                   <button 
//                     className="addItemBtn" 
//                     onClick={toggleDetailsDialog}
//                   >
//                     <FaEdit size={20} />
//                     <span style={{ marginLeft: '5px' }}>Edit Details</span>
//                   </button>
//                 </div>
//               </div>
//             </div>

//             <Box sx={{ width: "100%", marginBottom: 2 }}>
//               <Tabs value={activeTab} onChange={handleTabChange} centered>
//                 <Tab label="Lab Availabilities" />
//                 <Tab label="Bookings List" />
//               </Tabs>
//             </Box>

//             {activeTab === 0 && (
//               <div className="bookingTableBox">
//                 <Box sx={{ width: "100%" }}>
//                   <Paper sx={{ width: "100%", mb: 2 }}>
//                     <TableContainer>
//                       <Table size="small">
//                         <TableHead>
//                           <TableRow>
//                             <TableCell><b>Venue</b></TableCell>
//                             {predefinedSlots.map((slot, index) => (
//                               <TableCell key={index} align="center">
//                                 <b>{slot.label}</b>
//                               </TableCell>
//                             ))}
//                             <TableCell align="center"><b>Other Bookings</b></TableCell>
//                           </TableRow>
//                         </TableHead>
//                         <TableBody>
//                           {availableSlots.map((labSlot, labIndex) => (
//                             <TableRow key={labIndex}>
//                               <TableCell><b>{labSlot.lab}</b></TableCell>
//                               {labSlot.predefinedSlots.map((slot, slotIndex) => (
//                                 <TableCell
//                                   key={slotIndex}
//                                   align="center"
//                                   style={{
//                                     backgroundColor: slot.isBooked ? "#ffcccc" : "#ccffcc",
//                                     textDecoration: slot.isCrossed ? "line-through" : "none",
//                                     fontWeight: "bold",
//                                   }}
//                                 >
//                                   {slot.isBooked ? "Booked" : "Available"}
//                                 </TableCell>
//                               ))}
//                               <TableCell align="center">
//                                 {labSlot.otherBookings.map((booking, index) => (
//                                   <div
//                                     key={index}
//                                     style={{
//                                       backgroundColor: "#ffcccc",
//                                       padding: "5px",
//                                       margin: "2px",
//                                       borderRadius: "5px",
//                                       fontWeight: "bold",
//                                     }}
//                                   >
//                                     {booking}
//                                   </div>
//                                 ))}
//                               </TableCell>
//                             </TableRow>
//                           ))}
//                         </TableBody>
//                       </Table>
//                     </TableContainer>
//                   </Paper>
//                 </Box>
//               </div>
//             )}

//             {activeTab === 1 && (
//               <div className="bookingTableBox">
//                 <Box sx={{ width: "100%" }}>
//                   <Paper sx={{ width: "100%", mb: 2 }}>
//                     <TableContainer>
//                       <Table size="small">
//                         <TableHead>
//                           <TableRow>
//                             <TableCell padding="checkbox"></TableCell>
//                             <TableCell><b>Lab Name</b></TableCell>
//                             <TableCell><b>Venue</b></TableCell>
//                             <TableCell><b>Date</b></TableCell>
//                             <TableCell><b>Time Interval</b></TableCell>
//                             <TableCell><b>Booked By</b></TableCell>
//                             <TableCell><b>Actions</b></TableCell>
//                           </TableRow>
//                         </TableHead>
//                         <TableBody>
//                           {bookings
//                             .slice(
//                               page * rowsPerPage,
//                               page * rowsPerPage + rowsPerPage
//                             )
//                             .map((booking) => {
//                               const isItemSelected = isSelected(booking._id);
//                               return (
//                                 <TableRow
//                                   hover
//                                   onClick={(event) => handleClick(event, booking)}
//                                   role="checkbox"
//                                   aria-checked={isItemSelected}
//                                   tabIndex={-1}
//                                   key={booking._id}
//                                   selected={isItemSelected}
//                                 >
//                                   <TableCell padding="checkbox">
//                                     <Checkbox
//                                       color="primary"
//                                       checked={isItemSelected}
//                                       inputProps={{
//                                         "aria-labelledby": `enhanced-table-checkbox-${booking._id}`,
//                                       }}
//                                     />
//                                   </TableCell>
//                                   <TableCell>{booking.labName}</TableCell>
//                                   <TableCell>{booking.labPlace}</TableCell>
//                                   <TableCell>{booking.date}</TableCell>
//                                   <TableCell>{booking.timeSlot}</TableCell>
//                                   <TableCell>{booking.bookedBy}</TableCell>
//                                   <TableCell>
//                                     <IconButton
//                                       onClick={(e) => {
//                                         e.stopPropagation();
//                                         handleDeleteBooking(booking._id);
//                                       }}
//                                       aria-label="delete"
//                                     >
//                                       <DeleteIcon />
//                                     </IconButton>
//                                   </TableCell>
//                                 </TableRow>
//                               );
//                             })}
//                         </TableBody>
//                       </Table>
//                     </TableContainer>
//                     <TablePagination
//                       rowsPerPageOptions={[5, 10, 25]}
//                       component="div"
//                       count={bookings.length}
//                       rowsPerPage={rowsPerPage}
//                       page={page}
//                       onPageChange={handleChangePage}
//                       onRowsPerPageChange={handleChangeRowsPerPage}
//                     />
//                   </Paper>
//                 </Box>
//               </div>
//             )}
//           </div>
//         </div>
//       </div>

//       {/* Booking Form */}
//       {isFormVisible && (
//         <BookingForm
//           closeForm={toggleFormVisibility}
//           selectedDate={date}
//           onBookingAdded={fetchBookings}
//           user={user}
//           academicDetails={academicDetails}
//         />
//       )}

//       {/* Academic Details Dialog */}
//       <Dialog 
//         open={isDetailsDialogOpen} 
//         onClose={toggleDetailsDialog}
//         maxWidth="md"
//         fullWidth
//       >
//         <DialogTitle>Manage Academic Details</DialogTitle>
//         <DialogContent>
//           {/* Semester Section */}
//           <Box sx={{ mb: 4, p: 2, border: '1px solid #eee', borderRadius: 1 }}>
//             <Typography variant="h6" gutterBottom>Add Semester</Typography>
//             <Box sx={{ display: 'flex', gap: 2, mb: 2 }}>
//               <TextField
//                 label="Semester Name"
//                 value={newSemester.name}
//                 onChange={(e) => setNewSemester({...newSemester, name: e.target.value})}
//                 fullWidth
//               />
//               <TextField
//                 label="Semester Number"
//                 type="number"
//                 value={newSemester.number}
//                 onChange={(e) => setNewSemester({...newSemester, number: e.target.value})}
//                 fullWidth
//               />
//               <Button 
//                 variant="contained" 
//                 onClick={handleAddSemester}
//                 disabled={!newSemester.name.trim() || !newSemester.number}
//               >
//                 Add Semester
//               </Button>
//             </Box>
            
//             <Typography variant="subtitle1" gutterBottom>Existing Semesters</Typography>
//             {academicDetails.semesters.length > 0 ? (
//               <List dense>
//                 {academicDetails.semesters.map(semester => (
//                   <ListItem 
//                     key={semester.id}
//                     secondaryAction={
//                       <IconButton
//                         edge="end"
//                         onClick={() => handleDeleteItem('semester', semester.id)}
//                       >
//                         <DeleteIcon />
//                       </IconButton>
//                     }
//                   >
//                     <ListItemText 
//                       primary={`${semester.number}. ${semester.name}`}
//                     />
//                   </ListItem>
//                 ))}
//               </List>
//             ) : (
//               <Typography variant="body2" color="textSecondary">
//                 No semesters added yet
//               </Typography>
//             )}
//           </Box>

//           {/* Module Section */}
//           <Box sx={{ mb: 4, p: 2, border: '1px solid #eee', borderRadius: 1 }}>
//             <Typography variant="h6" gutterBottom>Add Module</Typography>
//             <Box sx={{ display: 'flex', gap: 2, mb: 2 }}>
//               <FormControl fullWidth>
//                 <InputLabel>Semester</InputLabel>
//                 <Select
//                   value={newModule.semesterId}
//                   onChange={(e) => setNewModule({...newModule, semesterId: e.target.value})}
//                   label="Semester"
//                 >
//                   {academicDetails.semesters.map(semester => (
//                     <MenuItem key={semester.id} value={semester.id}>
//                       {semester.name}
//                     </MenuItem>
//                   ))}
//                 </Select>
//               </FormControl>
//               <TextField
//                 label="Module Name"
//                 value={newModule.name}
//                 onChange={(e) => setNewModule({...newModule, name: e.target.value})}
//                 fullWidth
//               />
//               <TextField
//                 label="Module Code"
//                 value={newModule.code}
//                 onChange={(e) => setNewModule({...newModule, code: e.target.value})}
//                 fullWidth
//               />
//               <Button 
//                 variant="contained" 
//                 onClick={handleAddModule}
//                 disabled={!newModule.name.trim() || !newModule.code.trim() || !newModule.semesterId}
//               >
//                 Add Module
//               </Button>
//             </Box>
            
//             <Typography variant="subtitle1" gutterBottom>Existing Modules</Typography>
//             {Object.keys(academicDetails.modulesBySemester).length > 0 ? (
//               Object.entries(academicDetails.modulesBySemester).map(([semesterId, modules]) => {
//                 const semester = academicDetails.semesters.find(s => s.id === semesterId);
//                 return (
//                   <Box key={semesterId} sx={{ mb: 2 }}>
//                     <Typography variant="subtitle2">
//                       {semester ? semester.name : 'Unknown Semester'}
//                     </Typography>
//                     <List dense>
//                       {modules.map(module => (
//                         <ListItem 
//                           key={module.id}
//                           secondaryAction={
//                             <IconButton
//                               edge="end"
//                               onClick={() => handleDeleteItem('module', module.id)}
//                             >
//                               <DeleteIcon />
//                             </IconButton>
//                           }
//                         >
//                           <ListItemText 
//                             primary={`${module.code} - ${module.name}`}
//                           />
//                         </ListItem>
//                       ))}
//                     </List>
//                   </Box>
//                 );
//               })
//             ) : (
//               <Typography variant="body2" color="textSecondary">
//                 No modules added yet
//               </Typography>
//             )}
//           </Box>

//           {/* Lab Section */}
//           <Box sx={{ p: 2, border: '1px solid #eee', borderRadius: 1 }}>
//             <Typography variant="h6" gutterBottom>Add Lab</Typography>
//             <Box sx={{ display: 'flex', gap: 2, mb: 2 }}>
//               <FormControl fullWidth>
//                 <InputLabel>Module</InputLabel>
//                 <Select
//                   value={newLab.moduleId}
//                   onChange={(e) => setNewLab({...newLab, moduleId: e.target.value})}
//                   label="Module"
//                 >
//                   {Object.entries(academicDetails.modulesBySemester).flatMap(([semesterId, modules]) => {
//                     const semester = academicDetails.semesters.find(s => s.id === semesterId);
//                     return modules.map(module => (
//                       <MenuItem key={module.id} value={module.id}>
//                         {semester ? `${semester.name} - ` : ''}{module.name}
//                       </MenuItem>
//                     ));
//                   })}
//                 </Select>
//               </FormControl>
//               <TextField
//                 label="Lab Name"
//                 value={newLab.name}
//                 onChange={(e) => setNewLab({...newLab, name: e.target.value})}
//                 fullWidth
//               />
//               <TextField
//                 label="Lab Location"
//                 value={newLab.location}
//                 onChange={(e) => setNewLab({...newLab, location: e.target.value})}
//                 fullWidth
//               />
//               <Button 
//                 variant="contained" 
//                 onClick={handleAddLab}
//                 disabled={!newLab.name.trim() || !newLab.location.trim() || !newLab.moduleId}
//               >
//                 Add Lab
//               </Button>
//             </Box>
            
//             <Typography variant="subtitle1" gutterBottom>Existing Labs</Typography>
//             {Object.keys(academicDetails.labsByModule).length > 0 ? (
//               Object.entries(academicDetails.labsByModule).map(([moduleId, labs]) => {
//                 const module = Object.values(academicDetails.modulesBySemester)
//                   .flat()
//                   .find(m => m.id === moduleId);
//                 const semester = module ? 
//                   academicDetails.semesters.find(s => 
//                     academicDetails.modulesBySemester[s.id]?.some(m => m.id === moduleId)
//                   ) : null;
                
//                 return (
//                   <Box key={moduleId} sx={{ mb: 2 }}>
//                     <Typography variant="subtitle2">
//                       {semester ? `${semester.name} - ` : ''}
//                       {module ? module.name : 'Unknown Module'}
//                     </Typography>
//                     <List dense>
//                       {labs.map(lab => (
//                         <ListItem 
//                           key={lab.id}
//                           secondaryAction={
//                             <IconButton
//                               edge="end"
//                               onClick={() => handleDeleteItem('lab', lab.id)}
//                             >
//                               <DeleteIcon />
//                             </IconButton>
//                           }
//                         >
//                           <ListItemText 
//                             primary={`${lab.name} (${lab.location})`}
//                           />
//                         </ListItem>
//                       ))}
//                     </List>
//                   </Box>
//                 );
//               })
//             ) : (
//               <Typography variant="body2" color="textSecondary">
//                 No labs added yet
//               </Typography>
//             )}
//           </Box>
//         </DialogContent>
//         <DialogActions>
//           <Button onClick={toggleDetailsDialog}>Close</Button>
//         </DialogActions>
//       </Dialog>

//       {/* Snackbar for notifications */}
//       <Snackbar
//         open={snackbar.open}
//         autoHideDuration={6000}
//         onClose={handleCloseSnackbar}
//         anchorOrigin={{ vertical: "top", horizontal: "right" }}
//       >
//         <Alert onClose={handleCloseSnackbar} severity={snackbar.severity}>
//           {snackbar.message}
//         </Alert>
//       </Snackbar>
//     </div>
//   );
// };

// export default BookingReservation;



import React, { useState, useEffect } from "react";
import Calendar from "react-calendar";
import { FaCalendarAlt, FaEdit } from "react-icons/fa";
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
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Button,
  TextField,
  Select,
  MenuItem,
  InputLabel,
  FormControl,
  Snackbar,
  Alert,
  Typography,
  List,
  ListItem,
  ListItemText,
  Divider
} from "@mui/material";
import DeleteIcon from "@mui/icons-material/Delete";
import SideNavigation from "./components/SideNavigation";
import UserDetails from "./components/UserDetails";
import BookingForm from "./components/BookingForm";
import StudentBookingForm from "./components/StudentBookingForm";
import "./BookingReservation.css";
import "react-calendar/dist/Calendar.css";

const API_BASE_URL = "http://localhost:3001/api";

const BookingReservation = () => {
  // State management
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
  const [activeTab, setActiveTab] = useState(0);
  const [isDetailsDialogOpen, setIsDetailsDialogOpen] = useState(false);
  const [academicDetails, setAcademicDetails] = useState({
    modulesBySemester: {},
    labsByModule: {}
  });
  const [selectedSemester, setSelectedSemester] = useState("");
  const [selectedModule, setSelectedModule] = useState("");
  const [newModule, setNewModule] = useState({ 
    name: "", 
    code: "",
  });
  const [newLab, setNewLab] = useState({ 
    name: "",
    moduleId: ""
  });
  const [snackbar, setSnackbar] = useState({
    open: false,
    message: "",
    severity: "success",
  });

  // Constants
  const labPlaces = [
    "Electrical Machines Lab",
    "Communication Lab",
    "Measurements Lab",
    "High Voltage Lab",
  ];

  const predefinedSlots = [
    { start: "08:30", end: "11:30", label: "8:30 AM - 11:30 AM" },
    { start: "13:30", end: "16:30", label: "1:30 PM - 4:30 PM" },
  ];

  // Fixed list of 8 semesters
  const semesters = [
    { id: "sem1", number: 1, name: "First Semester" },
    { id: "sem2", number: 2, name: "Second Semester" },
    { id: "sem3", number: 3, name: "Third Semester" },
    { id: "sem4", number: 4, name: "Fourth Semester" },
    { id: "sem5", number: 5, name: "Fifth Semester" },
    { id: "sem6", number: 6, name: "Sixth Semester" },
    { id: "sem7", number: 7, name: "Seventh Semester" },
    { id: "sem8", number: 8, name: "Eighth Semester" },
  ];

  // Snackbar function
  const showSnackbar = (message, severity = "success") => {
    setSnackbar({
      open: true,
      message,
      severity
    });
  };

  const handleCloseSnackbar = () => {
    setSnackbar({ ...snackbar, open: false });
  };

  // Effects
// Add this near your other useEffect hooks
useEffect(() => {
    console.log("User updated:", user);
    console.log("User role:", user?.Role);
  }, [user]);

  useEffect(() => {
    const today = new Date();
    today.setHours(0, 0, 0, 0);
    setIsPastDate(date < today);
  }, [date]);

  useEffect(() => {
    fetchBookings();
    fetchAcademicDetails();
  }, [date]);

  // Data fetching
  const fetchAcademicDetails = async () => {
    try {
      const response = await fetch(`${API_BASE_URL}/academic-details`);
      if (response.ok) {
        const data = await response.json();
        setAcademicDetails(data);
        // Reset module selection if the selected module no longer exists
        if (selectedModule && !Object.values(data.modulesBySemester)
          .flat()
          .some(m => m.id === selectedModule)) {
          setSelectedModule("");
        }
      } else {
        throw new Error("Failed to fetch academic details");
      }
    } catch (error) {
      showSnackbar(error.message, "error");
    }
  };

  const fetchBookings = async () => {
    try {
      const formattedDate = date.toISOString().split("T")[0];
      const response = await fetch(
        `${API_BASE_URL}/bookings?date=${formattedDate}`
      );
      if (response.ok) {
        const data = await response.json();
        setBookings(data);
        calculateAvailableSlots(data, formattedDate);
      }
    } catch (error) {
      showSnackbar("Error fetching bookings", "error");
    }
  };

  // Helper functions
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

    const slots = labPlaces.map((lab) => {
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

  // CRUD operations
  const handleAddModule = async () => {
    if (!newModule.name.trim() || !newModule.code.trim() || !selectedSemester) {
      showSnackbar("Module name, code and semester selection are required", "error");
      return;
    }

    try {
      const response = await fetch(
        `${API_BASE_URL}/academic-details/semesters/${selectedSemester}/modules`,
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            name: newModule.name,
            code: newModule.code
          }),
        }
      );

      if (response.ok) {
        setNewModule({ name: "", code: "" });
        fetchAcademicDetails();
        showSnackbar("Module added successfully", "success");
      } else {
        const errorData = await response.json();
        throw new Error(errorData.error || "Failed to add module");
      }
    } catch (error) {
      showSnackbar(error.message, "error");
    }
  };

  const handleAddLab = async () => {
    if (!newLab.name.trim() || !selectedModule) {
      showSnackbar("Lab name and module selection are required", "error");
      return;
    }

    try {
      const response = await fetch(
        `${API_BASE_URL}/academic-details/modules/${selectedModule}/labs`,
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            name: newLab.name
          }),
        }
      );

      if (response.ok) {
        setNewLab({ name: "", moduleId: "" });
        fetchAcademicDetails();
        showSnackbar("Lab added successfully", "success");
      } else {
        const errorData = await response.json();
        throw new Error(errorData.error || "Failed to add lab");
      }
    } catch (error) {
      showSnackbar(error.message, "error");
    }
  };

  const handleDeleteItem = async (type, id) => {
    try {
      let endpoint = "";
      switch (type) {
        case "module":
          endpoint = `${API_BASE_URL}/academic-details/modules/${id}`;
          break;
        case "lab":
          endpoint = `${API_BASE_URL}/academic-details/labs/${id}`;
          break;
        default:
          throw new Error("Invalid item type");
      }

      const response = await fetch(endpoint, {
        method: "DELETE",
      });

      if (response.ok) {
        fetchAcademicDetails();
        showSnackbar(`${type.charAt(0).toUpperCase() + type.slice(1)} deleted successfully`, "success");
      } else {
        const errorData = await response.json();
        throw new Error(errorData.error || `Failed to delete ${type}`);
      }
    } catch (error) {
      showSnackbar(error.message, "error");
    }
  };

  // UI handlers
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
  const toggleDetailsDialog = () => {
    setIsDetailsDialogOpen(!isDetailsDialogOpen);
    // Reset selections when dialog is closed
    if (isDetailsDialogOpen) {
      setSelectedSemester("");
      setSelectedModule("");
    }
  };

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
      const response = await fetch(`${API_BASE_URL}/bookings/${id}`, {
        method: "DELETE",
      });

      if (response.ok) {
        fetchBookings();
        showSnackbar("Booking deleted successfully", "success");
      } else {
        showSnackbar("Failed to delete booking", "error");
      }
    } catch (error) {
      showSnackbar("Error deleting booking", "error");
    }
  };

  // Calendar styling functions
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

  // Get modules for selected semester
  const getModulesForSelectedSemester = () => {
    if (!selectedSemester) return [];
    return academicDetails.modulesBySemester[selectedSemester] || [];
  };

  // Get labs for selected module
  const getLabsForSelectedModule = () => {
    if (!selectedModule) return [];
    return academicDetails.labsByModule[selectedModule] || [];
  };

  // Render function
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

                {/* Only show Edit Details button if user is not a student */}
  {user?.Role !== "student" && (
    <div className="addItem">
      <button 
        className="addItemBtn" 
        onClick={toggleDetailsDialog}
      >
        <FaEdit size={20} />
        <span style={{ marginLeft: '5px' }}>Edit Details</span>
      </button>
    </div>
  )}
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

      {/* Booking Form */}
      {isFormVisible && (
  user?.Role === "student" ? (
    <StudentBookingForm
      closeForm={toggleFormVisibility}
      selectedDate={date}
      onBookingAdded={fetchBookings}
      user={user}
    />
  ) : (
    <BookingForm
      closeForm={toggleFormVisibility}
      selectedDate={date}
      onBookingAdded={fetchBookings}
      user={user}
      academicDetails={{ ...academicDetails, semesters }}
    />
  )
)}

      {/* Academic Details Dialog */}
      <Dialog
  open={isDetailsDialogOpen}
  onClose={toggleDetailsDialog}
  maxWidth={false} // Disable Material-UI's maxWidth
  PaperProps={{
    style: {
      width: '500px', // Fixed width
      maxWidth: 'none', // Override default maxWidth
      borderRadius: '30px',
      padding: '20px',
      margin: '16px' // Add some margin
    }
  }}
>
  <DialogTitle style={{ 
    textAlign: 'center', 
    padding: '16px 0',
    fontSize: '20px',
    fontWeight: 'bold'
  }}>
    Manage Academic Details
  </DialogTitle>
  
  <DialogContent style={{ 
    padding: '0 20px 20px',
    display: 'flex',
    flexDirection: 'column',
    gap: '20px'
  }}>
    {/* Semester Selection */}
    <Box style={{ width: '100%' }}>
      <FormControl fullWidth>
        <InputLabel>Select Semester</InputLabel>
        <Select
          value={selectedSemester}
          onChange={(e) => {
            setSelectedSemester(e.target.value);
            setSelectedModule("");
          }}
          style={{
            borderRadius: '30px',
            height: '40px'
          }}
        >
          {semesters.map(semester => (
            <MenuItem key={semester.id} value={semester.id}>
              {semester.number}. {semester.name}
            </MenuItem>
          ))}
        </Select>
      </FormControl>
    </Box>

    {selectedSemester && (
      <>
        {/* Module Section */}
        <Box style={{
          width: '100%',
          padding: '16px',
          border: '1px solid #eee',
          borderRadius: '12px'
        }}>
          <Typography variant="h6" style={{ marginBottom: '16px' }}>
            Manage Modules
          </Typography>
          
          {/* Add Module Form */}
          <Box style={{ 
            display: 'flex', 
            gap: '12px',
            marginBottom: '16px',
            alignItems: 'flex-end'
          }}>
            <TextField
              label="Module Name"
              value={newModule.name}
              onChange={(e) => setNewModule({...newModule, name: e.target.value})}
              fullWidth
              size="small"
            />
            <TextField
              label="Module Code"
              value={newModule.code}
              onChange={(e) => setNewModule({...newModule, code: e.target.value})}
              fullWidth
              size="small"
            />
            <Button 
              variant="contained" 
              onClick={handleAddModule}
              disabled={!newModule.name.trim() || !newModule.code.trim()}
              style={{
                height: '40px',
                minWidth: '100px',
                color: '#fff',
                backgroundColor: '#007bff',
              }}
            >
              Add
            </Button>
          </Box>
          
          {/* Module List */}
          <Typography variant="subtitle1" style={{ marginBottom: '8px' }}>
            Modules in Selected Semester
          </Typography>
          {getModulesForSelectedSemester().length > 0 ? (
            <List dense style={{ maxHeight: '200px', overflowY: 'auto' }}>
              {getModulesForSelectedSemester().map(module => (
                <ListItem 
                  key={module.id}
                  style={{
                    padding: '8px 16px',
                    borderBottom: '1px solid #f0f0f0'
                  }}
                  secondaryAction={
                    <IconButton
                      edge="end"
                      onClick={() => handleDeleteItem('module', module.id)}
                      size="small"
                    >
                      <DeleteIcon fontSize="small" />
                    </IconButton>
                  }
                >
                  <ListItemText 
                    primary={`${module.code} - ${module.name}`}
                    primaryTypographyProps={{ style: { fontSize: '14px' } }}
                  />
                </ListItem>
              ))}
            </List>
          ) : (
            <Typography variant="body2" style={{ color: '#666' }}>
              No modules added for this semester
            </Typography>
          )}
        </Box>

        {/* Module Selection for Labs */}
        <Box style={{ width: '100%' }}>
          <FormControl fullWidth>
            <InputLabel>Select Module</InputLabel>
            <Select
              value={selectedModule}
              onChange={(e) => setSelectedModule(e.target.value)}
              disabled={getModulesForSelectedSemester().length === 0}
              style={{
                borderRadius: '30px',
                height: '40px'
              }}
            >
              {getModulesForSelectedSemester().map(module => (
                <MenuItem key={module.id} value={module.id}>
                  {module.code} - {module.name}
                </MenuItem>
              ))}
            </Select>
          </FormControl>
        </Box>

        {selectedModule && (
          /* Lab Section */
          <Box style={{
            width: '100%',
            padding: '16px',
            border: '1px solid #eee',
            borderRadius: '12px'
          }}>
            <Typography variant="h6" style={{ marginBottom: '16px' }}>
              Manage Labs
            </Typography>
            
            {/* Add Lab Form */}
            <Box style={{ 
              display: 'flex', 
              gap: '12px',
              marginBottom: '16px',
              alignItems: 'flex-end'
            }}>
              <TextField
                label="Lab Name"
                value={newLab.name}
                onChange={(e) => setNewLab({...newLab, name: e.target.value})}
                fullWidth
                size="small"
              />
              <Button 
                variant="contained" 
                onClick={handleAddLab}
                disabled={!newLab.name.trim()}
                style={{
                  height: '40px',
                  minWidth: '100px'
                }}
              >
                Add
              </Button>
            </Box>
            
            {/* Lab List */}
            <Typography variant="subtitle1" style={{ marginBottom: '8px' }}>
              Labs in Selected Module
            </Typography>
            {getLabsForSelectedModule().length > 0 ? (
              <List dense style={{ maxHeight: '200px', overflowY: 'auto' }}>
                {getLabsForSelectedModule().map(lab => (
                  <ListItem 
                    key={lab.id}
                    style={{
                      padding: '8px 16px',
                      borderBottom: '1px solid #f0f0f0'
                    }}
                    secondaryAction={
                      <IconButton
                        edge="end"
                        onClick={() => handleDeleteItem('lab', lab.id)}
                        size="small"
                      >
                        <DeleteIcon fontSize="small" />
                      </IconButton>
                    }
                  >
                    <ListItemText 
                      primary={lab.name}
                      primaryTypographyProps={{ style: { fontSize: '14px' } }}
                    />
                  </ListItem>
                ))}
              </List>
            ) : (
              <Typography variant="body2" style={{ color: '#666' }}>
                No labs added for this module
              </Typography>
            )}
          </Box>
        )}
      </>
    )}
  </DialogContent>
  <DialogActions style={{ 
    padding: '16px 24px',
    justifyContent: 'center'
  }}>
    <Button 
      onClick={toggleDetailsDialog}
      variant="contained"
      style={{
        width: '120px',
        borderRadius: '20px'
      }}
    >
      Close
    </Button>
  </DialogActions>
</Dialog>

      {/* Snackbar for notifications */}
      <Snackbar
        open={snackbar.open}
        autoHideDuration={6000}
        onClose={handleCloseSnackbar}
        anchorOrigin={{ vertical: "top", horizontal: "right" }}
      >
        <Alert onClose={handleCloseSnackbar} severity={snackbar.severity}>
          {snackbar.message}
        </Alert>
      </Snackbar>
    </div>
  );
};

export default BookingReservation;






