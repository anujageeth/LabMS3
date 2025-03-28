import React, { useState, useEffect } from "react";
import "./BookingForm.css";
import SidePopup from "./SidePopup";

const BookingForm = ({ closeForm, selectedDate, onBookingAdded, user }) => {
    const [selectedSemester, setSelectedSemester] = useState("");
    const [selectedModule, setSelectedModule] = useState("");
    const [selectedLab, setSelectedLab] = useState("");
    const [labPlace, setLabPlace] = useState("");
    const [bookedBy, setBookedBy] = useState(user ? `${user.FirstName} ${user.LastName}` : "");
    const [timeSlot, setTimeSlot] = useState("8:30-11:30");
    const [customStartTime, setCustomStartTime] = useState("");
    const [customEndTime, setCustomEndTime] = useState("");
    const [isPastDate, setIsPastDate] = useState(false);

    const [isSuccessPopupOpen, setIsSuccessPopupOpen] = useState(false);
    const [isErrorPopupOpen, setIsErrorPopupOpen] = useState(false);
    const [isAlreadyPopupOpen, setIsAlreadyPopupOpen] = useState(false);

    // Check if selected date is in the past
    useEffect(() => {
        const today = new Date();
        today.setHours(0, 0, 0, 0); // Reset time to compare dates only
        
        setIsPastDate(selectedDate < today);
    }, [selectedDate]);

    // Define semesters
    const semesters = [
        { id: 1, name: "Semester 1" },
        { id: 2, name: "Semester 2" },
        { id: 3, name: "Semester 3" },
        { id: 4, name: "Semester 4" },
        { id: 5, name: "Semester 5" },
        { id: 6, name: "Semester 6" },
        { id: 7, name: "Semester 7" },
    ];

    // Define modules by semester
    const modulesBySemester = {
        1: [
            "Introduction to Electrical Engineering",
            "Mathematics for Engineers",
            "Basic Electronics",
            "Engineering Drawing"
        ],
        2: [
            "Circuit Theory",
            "Electromagnetic Fields",
            "Engineering Mathematics II",
            "Computer Programming"
        ],
        3: [
            "Electrical Machines I",
            "Power Systems I",
            "Electronic Devices",
            "Signals and Systems"
        ],
        4: [
            "Electrical Machines II",
            "Power Systems II",
            "Control Systems",
            "Digital Electronics"
        ],
        5: [
            "Power Electronics",
            "High Voltage Engineering",
            "Renewable Energy Systems",
            "Microprocessors"
        ],
        6: [
            "Power System Protection",
            "Industrial Electronics",
            "Electrical Drives",
            "Project Management"
        ],
        7: [
            "Advanced Power Systems",
            "Smart Grid Technologies",
            "Energy Management",
            "Final Year Project"
        ]
    };

    // Define labs by module
    const labsByModule = {
        "Introduction to Electrical Engineering": ["Basic Circuits Lab", "Electrical Measurements Lab"],
        "Mathematics for Engineers": ["Computer Lab 1A", "Computer Lab 1B"],
        "Basic Electronics": ["Electronics Lab 1", "Electronics Lab 2"],
        "Engineering Drawing": ["Drawing Studio A", "Drawing Studio B"],
        "Circuit Theory": ["Circuit Analysis Lab 1", "Circuit Analysis Lab 2"],
        "Electromagnetic Fields": ["EM Lab 1", "EM Lab 2"],
        "Engineering Mathematics II": ["Computer Lab 2A", "Computer Lab 2B"],
        "Computer Programming": ["Programming Lab 1", "Programming Lab 2"],
        "Electrical Machines I": ["Machines Lab 1", "Machines Lab 2"],
        "Power Systems I": ["Power Systems Lab 1", "Power Systems Lab 2"],
        "Electronic Devices": ["Devices Lab 1", "Devices Lab 2"],
        "Signals and Systems": ["Signals Lab 1", "Signals Lab 2"],
        "Electrical Machines II": ["Machines Lab 3", "Machines Lab 4"],
        "Power Systems II": ["Power Systems Lab 3", "Power Systems Lab 4"],
        "Control Systems": ["Control Lab 1", "Control Lab 2"],
        "Digital Electronics": ["Digital Lab 1", "Digital Lab 2"],
        "Power Electronics": ["Power Electronics Lab 1", "Power Electronics Lab 2"],
        "High Voltage Engineering": ["High Voltage Lab 1", "High Voltage Lab 2"],
        "Renewable Energy Systems": ["Renewable Energy Lab"],
        "Microprocessors": ["Microprocessor Lab"],
        "Power System Protection": ["Protection Lab"],
        "Industrial Electronics": ["Industrial Electronics Lab"],
        "Electrical Drives": ["Drives Lab"],
        "Project Management": ["Project Lab"],
        "Advanced Power Systems": ["Advanced Power Lab"],
        "Smart Grid Technologies": ["Smart Grid Lab"],
        "Energy Management": ["Energy Lab"],
        "Final Year Project": ["Project Lab 1", "Project Lab 2"]
    };

    // Handle semester change
    const handleSemesterChange = (e) => {
        const semesterId = e.target.value;
        setSelectedSemester(semesterId);
        setSelectedModule("");
        setSelectedLab("");
    };

    // Handle module change
    const handleModuleChange = (e) => {
        setSelectedModule(e.target.value);
        setSelectedLab("");
    };

    // Handle lab change
    const handleLabChange = (e) => {
        setSelectedLab(e.target.value);
    };

    // Handle form submission
    const handleSubmit = async (e) => {
        e.preventDefault();

        if (isPastDate) {
            setIsErrorPopupOpen(true);
            return;
        }

        const bookingData = {
            labName: selectedLab,
            labPlace,
            date: selectedDate.toISOString().split("T")[0],
            bookedBy,
            timeSlot,
            module: selectedModule
        };

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
                onBookingAdded();
                setTimeout(() => {
                    closeForm();
                }, 2000);
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
                {isPastDate ? (
                    <div className="past-date-message">
                        <p>You cannot book labs for past dates.</p>
                        <button type="button" onClick={closeForm} className="close-button">
                            Close
                        </button>
                    </div>
                ) : (
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

                        {/* Module Selection */}
                        <label>Module</label>
                        <select
                            value={selectedModule}
                            onChange={handleModuleChange}
                            required
                            disabled={!selectedSemester}
                        >
                            <option value="" disabled>
                                Select Module
                            </option>
                            {selectedSemester &&
                                modulesBySemester[selectedSemester].map((module, index) => (
                                    <option key={index} value={module}>
                                        {module}
                                    </option>
                                ))}
                        </select>

                        {/* Lab Selection */}
                        <label>Lab Name</label>
                        <select
                            value={selectedLab}
                            onChange={handleLabChange}
                            required
                            disabled={!selectedModule}
                        >
                            <option value="" disabled>
                                Select Lab
                            </option>
                            {selectedModule && labsByModule[selectedModule] && 
                                labsByModule[selectedModule].map((lab, index) => (
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
                            value={bookedBy}
                            onChange={(e) => setBookedBy(e.target.value)}
                            required
                            disabled
                        />

                        {/* Form Actions */}
                        <div className="form-actions">
                            <button type="submit">Confirm Booking</button>
                            <button type="button" onClick={closeForm}>
                                Cancel
                            </button>
                        </div>
                    </form>
                )}
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
                message={isPastDate ? "Cannot book labs for past dates!" : "Couldn't book the lab!"}
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