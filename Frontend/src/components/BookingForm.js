
// import React, { useState } from "react";
// import "./BookingForm.css";
// import SidePopup from "./SidePopup";

// const BookingForm = ({ closeForm, selectedDate, onBookingAdded, user }) => {
//     const [selectedSemester, setSelectedSemester] = useState("");
//     const [selectedLab, setSelectedLab] = useState("");
//     const [labPlace, setLabPlace] = useState("");
//     const [bookedBy, setBookedBy] = useState(user ? `${user.FirstName} ${user.LastName}` : ""); // Auto-fill bookedBy
//     const [time, setTime] = useState("");
//     const [duration, setDuration] = useState(1);

//     const [isSuccessPopupOpen, setIsSuccessPopupOpen] = useState(false);
//     const [isErrorPopupOpen, setIsErrorPopupOpen] = useState(false);
//     const [isAlreadyPopupOpen, setIsAlreadyPopupOpen] = useState(false);

//     // Define semesters and labs
//     const semesters = [
//         { id: 1, name: "Semester 1" },
//         { id: 2, name: "Semester 2" },
//         { id: 3, name: "Semester 3" },
//         { id: 4, name: "Semester 4" },
//         { id: 5, name: "Semester 5" },
//         { id: 6, name: "Semester 6" },
//         { id: 7, name: "Semester 7" },
//     ];

//     const labsBySemester = {
//         1: ["Lab 1A", "Lab 1B", "Lab 1C", "Lab 1D"],
//         2: ["Lab 2A", "Lab 2B", "Lab 2C", "Lab 2D"],
//         3: ["Lab 3A", "Lab 3B", "Lab 3C", "Lab 3D"],
//         4: ["Lab 4A", "Lab 4B", "Lab 4C", "Lab 4D"],
//         5: ["Lab 5A", "Lab 5B", "Lab 5C", "Lab 5D"],
//         6: ["Lab 6A", "Lab 6B", "Lab 6C", "Lab 6D"],
//         7: ["Lab 7A", "Lab 7B", "Lab 7C", "Lab 7D"],
//     };

//     // Handle semester change
//     const handleSemesterChange = (e) => {
//         const semesterId = e.target.value;
//         setSelectedSemester(semesterId);
//         setSelectedLab(""); // Reset lab selection when semester changes
//     };

//     // Handle lab change
//     const handleLabChange = (e) => {
//         setSelectedLab(e.target.value);
//     };

//     // Handle form submission
//     const handleSubmit = async (e) => {
//         e.preventDefault();

//         const bookingData = {
//             labName: selectedLab,
//             labPlace,
//             date: selectedDate.toISOString().split("T")[0],
//             bookedBy,
//             time,
//             duration,
//         };

//         try {
//             const response = await fetch("http://localhost:3001/api/bookings", {
//                 method: "POST",
//                 headers: {
//                     "Content-Type": "application/json",
//                 },
//                 body: JSON.stringify(bookingData),
//             });

//             if (response.ok) {
//                 setIsSuccessPopupOpen(true);
//                 onBookingAdded(); // Refresh bookings list
//                 setTimeout(() => {
//                     closeForm(); // Close the form after the popup is shown
//                 }, 2000); // Adjust the delay (2000ms = 2 seconds)
//             } else {
//                 const result = await response.json();
//                 if (result.error === "Lab is already booked at that time.") {
//                     setIsAlreadyPopupOpen(true);
//                 } else {
//                     setIsErrorPopupOpen(true);
//                 }
//             }
//         } catch (error) {
//             console.error("Error submitting the form:", error.message);
//             setIsErrorPopupOpen(true);
//         }
//     };

//     return (
//         <div className="booking-form-container">
//             <div className="booking-form">
//                 <h2>📅 Book Laboratory</h2>
//                 <form onSubmit={handleSubmit}>
//                     {/* Semester Selection */}
//                     <label>Semester</label>
//                     <select
//                         value={selectedSemester}
//                         onChange={handleSemesterChange}
//                         required
//                     >
//                         <option value="" disabled>
//                             Select Semester
//                         </option>
//                         {semesters.map((semester) => (
//                             <option key={semester.id} value={semester.id}>
//                                 {semester.name}
//                             </option>
//                         ))}
//                     </select>

//                     {/* Lab Selection */}
//                     <label>Lab Name</label>
//                     <select
//                         value={selectedLab}
//                         onChange={handleLabChange}
//                         required
//                         disabled={!selectedSemester}
//                     >
//                         <option value="" disabled>
//                             Select Lab
//                         </option>
//                         {selectedSemester &&
//                             labsBySemester[selectedSemester].map((lab, index) => (
//                                 <option key={index} value={lab}>
//                                     {lab}
//                                 </option>
//                             ))}
//                     </select>

//                     {/* Lab Place Selection */}
//                     <label>Lab Place</label>
//                     <select
//                         value={labPlace}
//                         onChange={(e) => setLabPlace(e.target.value)}
//                         required
//                     >
//                         <option value="" disabled>
//                             Select Lab Place
//                         </option>
//                         <option value="Electrical Machines Lab">Electrical Machines Lab</option>
//                         <option value="Communication Lab">Communication Lab</option>
//                         <option value="Measurements Lab">Measurements Lab</option>
//                         <option value="High Voltage Lab">High Voltage Lab</option>
//                     </select>

//                     {/* Date */}
//                     <label>Date</label>
//                     <input type="text" value={selectedDate.toDateString()} disabled />

//                     {/* Start Time */}
//                     <label>Start Time</label>
//                     <input
//                         type="time"
//                         value={time}
//                         onChange={(e) => setTime(e.target.value)}
//                         required
//                     />

//                     {/* Duration */}
//                     <label>Duration (in hours)</label>
//                     <input
//                         type="number"
//                         value={duration}
//                         onChange={(e) => setDuration(e.target.value)}
//                         min="1"
//                         required
//                     />

//                     {/* Booked By */}
//                     <label>Booked By</label>
//                     <input
//                         type="text"
//                         value={bookedBy}
//                         onChange={(e) => setBookedBy(e.target.value)}
//                         required
//                         disabled // Disable the input to prevent manual changes
//                     />

//                     {/* Form Actions */}
//                     <div className="form-actions">
//                         <button type="submit">Confirm Booking</button>
//                         <button type="button" onClick={closeForm}>
//                             Cancel
//                         </button>
//                     </div>
//                 </form>
//             </div>

//             {/* Success Popup */}
//             <SidePopup
//                 type="success"
//                 title="Successful"
//                 message="Lab booking successful!"
//                 isOpen={isSuccessPopupOpen}
//                 onClose={() => setIsSuccessPopupOpen(false)}
//                 duration={3000}
//             />

//             {/* Error Popup */}
//             <SidePopup
//                 type="error"
//                 title="Error"
//                 message="Couldn't book the lab!"
//                 isOpen={isErrorPopupOpen}
//                 onClose={() => setIsErrorPopupOpen(false)}
//                 duration={3000}
//             />

//             {/* Already Booked Popup */}
//             <SidePopup
//                 type="error"
//                 title="Error"
//                 message="Already booked the lab!"
//                 isOpen={isAlreadyPopupOpen}
//                 onClose={() => setIsAlreadyPopupOpen(false)}
//                 duration={3000}
//             />
//         </div>
//     );
// };

// export default BookingForm;


import React, { useState } from "react";
import "./BookingForm.css";
import SidePopup from "./SidePopup";

const BookingForm = ({ closeForm, selectedDate, onBookingAdded, user }) => {
    const [selectedSemester, setSelectedSemester] = useState("");
    const [selectedLab, setSelectedLab] = useState("");
    const [labPlace, setLabPlace] = useState("");
    const [bookedByName, setBookedByName] = useState(user ? `${user.FirstName} ${user.LastName}` : ""); // Auto-fill bookedBy
    const [bookedBy, setBookedBy] = useState(user ? `${user.Email}` : ""); // Auto-fill bookedBy
    const [timeSlot, setTimeSlot] = useState("8:30-11:30"); // Default time slot
    const [customStartTime, setCustomStartTime] = useState("");
    const [customEndTime, setCustomEndTime] = useState("");

    const [isSuccessPopupOpen, setIsSuccessPopupOpen] = useState(false);
    const [isErrorPopupOpen, setIsErrorPopupOpen] = useState(false);
    const [isAlreadyPopupOpen, setIsAlreadyPopupOpen] = useState(false);

    // Define semesters and labs
    const semesters = [
        { id: 1, name: "Semester 1" },
        { id: 2, name: "Semester 2" },
        { id: 3, name: "Semester 3" },
        { id: 4, name: "Semester 4" },
        { id: 5, name: "Semester 5" },
        { id: 6, name: "Semester 6" },
        { id: 7, name: "Semester 7" },
    ];

    const labsBySemester = {
        1: ["Lab 1A", "Lab 1B", "Lab 1C", "Lab 1D"],
        2: ["Lab 2A", "Lab 2B", "Lab 2C", "Lab 2D"],
        3: ["Lab 3A", "Lab 3B", "Lab 3C", "Lab 3D"],
        4: ["Lab 4A", "Lab 4B", "Lab 4C", "Lab 4D"],
        5: ["Lab 5A", "Lab 5B", "Lab 5C", "Lab 5D"],
        6: ["Lab 6A", "Lab 6B", "Lab 6C", "Lab 6D"],
        7: ["Lab 7A", "Lab 7B", "Lab 7C", "Lab 7D"],
    };

    // Handle semester change
    const handleSemesterChange = (e) => {
        const semesterId = e.target.value;
        setSelectedSemester(semesterId);
        setSelectedLab(""); // Reset lab selection when semester changes
    };

    // Handle lab change
    const handleLabChange = (e) => {
        setSelectedLab(e.target.value);
    };

    // Handle form submission
    const handleSubmit = async (e) => {
        e.preventDefault();

        const bookingData = {
            labName: selectedLab,
            labPlace,
            date: selectedDate.toISOString().split("T")[0],
            bookedBy,
            timeSlot,
        };

        // Add custom time if selected
        if (timeSlot === "custom") {
            bookingData.startTime = customStartTime;
            bookingData.endTime = customEndTime;
        }

        try {
            const response = await fetch("http://localhost:3001/api/bookings", {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                },
                body: JSON.stringify(bookingData),
            });

            if (response.ok) {
                setIsSuccessPopupOpen(true);
                onBookingAdded(); // Refresh bookings list
                setTimeout(() => {
                    closeForm(); // Close the form after the popup is shown
                }, 2000); // Adjust the delay (2000ms = 2 seconds)
            } else {
                const result = await response.json();
                if (result.error === "Lab is already booked at that time.") {
                    setIsAlreadyPopupOpen(true);
                } else {
                    setIsErrorPopupOpen(true);
                }
            }
        } catch (error) {
            console.error("Error submitting the form:", error.message);
            setIsErrorPopupOpen(true);
        }
    };

    return (
        <div className="booking-form-container">
            <div className="booking-form">
                <h2>📅 Book Laboratory</h2>
                <form onSubmit={handleSubmit}>
                    {/* Semester Selection */}
                    <label>Semester</label>
                    <select
                        value={selectedSemester}
                        onChange={handleSemesterChange}
                        required
                    >
                        <option value="" disabled>
                            Select Semester
                        </option>
                        {semesters.map((semester) => (
                            <option key={semester.id} value={semester.id}>
                                {semester.name}
                            </option>
                        ))}
                    </select>

                    {/* Lab Selection */}
                    <label>Lab Name</label>
                    <select
                        value={selectedLab}
                        onChange={handleLabChange}
                        required
                        disabled={!selectedSemester}
                    >
                        <option value="" disabled>
                            Select Lab
                        </option>
                        {selectedSemester &&
                            labsBySemester[selectedSemester].map((lab, index) => (
                                <option key={index} value={lab}>
                                    {lab}
                                </option>
                            ))}
                    </select>

                    {/* Lab Place Selection */}
                    <label>Lab Place</label>
                    <select
                        value={labPlace}
                        onChange={(e) => setLabPlace(e.target.value)}
                        required
                    >
                        <option value="" disabled>
                            Select Lab Place
                        </option>
                        <option value="Electrical Machines Lab">Electrical Machines Lab</option>
                        <option value="Communication Lab">Communication Lab</option>
                        <option value="Measurements Lab">Measurements Lab</option>
                        <option value="High Voltage Lab">High Voltage Lab</option>
                    </select>

                    {/* Date */}
                    <label>Date</label>
                    <input type="text" value={selectedDate.toDateString()} disabled />

                    {/* Time Slot Selection */}
                    <label>Time Slot</label>
                    <select
                        value={timeSlot}
                        onChange={(e) => setTimeSlot(e.target.value)}
                        required
                    >
                        <option value="8:30-11:30">8:30 AM - 11:30 AM</option>
                        <option value="1:30-4:30">1:30 PM - 4:30 PM</option>
                        <option value="custom">Custom Time</option>
                    </select>

                    {/* Custom Time Inputs */}
                    {timeSlot === "custom" && (
                        <>
                            <label>Start Time</label>
                            <input
                                type="time"
                                value={customStartTime}
                                onChange={(e) => setCustomStartTime(e.target.value)}
                                required
                            />
                            <label>End Time</label>
                            <input
                                type="time"
                                value={customEndTime}
                                onChange={(e) => setCustomEndTime(e.target.value)}
                                required
                            />
                        </>
                    )}

                    {/* Booked By */}
                    <label>Booked By</label>
                    <input
                        type="text"
                        value={bookedByName}
                        onChange={(e) => setBookedByName(e.target.value)}
                        required
                        disabled // Disable the input to prevent manual changes
                    />

                    {/* Form Actions */}
                    <div className="form-actions">
                        <button type="submit">Confirm Booking</button>
                        <button type="button" onClick={closeForm}>
                            Cancel
                        </button>
                    </div>
                </form>
            </div>

            {/* Success Popup */}
            <SidePopup
                type="success"
                title="Successful"
                message="Lab booking successful!"
                isOpen={isSuccessPopupOpen}
                onClose={() => setIsSuccessPopupOpen(false)}
                duration={3000}
            />

            {/* Error Popup */}
            <SidePopup
                type="error"
                title="Error"
                message="Couldn't book the lab!"
                isOpen={isErrorPopupOpen}
                onClose={() => setIsErrorPopupOpen(false)}
                duration={3000}
            />

            {/* Already Booked Popup */}
            <SidePopup
                type="error"
                title="Error"
                message="Already booked the lab!"
                isOpen={isAlreadyPopupOpen}
                onClose={() => setIsAlreadyPopupOpen(false)}
                duration={3000}
            />
        </div>
    );
};

export default BookingForm;