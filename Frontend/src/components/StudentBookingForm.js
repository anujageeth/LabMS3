import React, { useState, useEffect } from "react";
import "./StudentBookingForm.css";
import SidePopup from "./SidePopup";

const StudentBookingForm = ({ closeForm, selectedDate, onBookingAdded, user }) => {
    const [formData, setFormData] = useState({
        labPlace: "",
        timeSlot: "8:30-11:30",
        description: "",
        customStartTime: "",
        customEndTime: ""
    });
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

    const handleChange = (e) => {
        const { name, value } = e.target;
        setFormData(prev => ({ ...prev, [name]: value }));
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
    
        if (isPastDate) {
            setIsErrorPopupOpen(true);
            return;
        }
    
        // Prepare the time slot
        let finalTimeSlot = formData.timeSlot;
        if (formData.timeSlot === "custom") {
            if (!formData.customStartTime || !formData.customEndTime) {
                setIsErrorPopupOpen(true);
                return;
            }
            finalTimeSlot = `${formData.customStartTime}-${formData.customEndTime}`;
        }
    
        const bookingData = {
            labName: "Student Lab Request",
            labPlace: formData.labPlace,
            date: selectedDate.toISOString().split("T")[0], // Format: YYYY-MM-DD
            bookedBy: user ? `${user.FirstName} ${user.LastName}` : "",
            timeSlot: finalTimeSlot,
            description: formData.description,
            module: "Student Request" // Add a default module
        };
    
        // For custom time, include separate start/end times
        if (formData.timeSlot === "custom") {
            bookingData.startTime = formData.customStartTime;
            bookingData.endTime = formData.customEndTime;
            bookingData.timeSlot = `${formData.customStartTime}-${formData.customEndTime}`;
        }
    
        try {
            const token = localStorage.getItem("token");
        if (!token) {
            throw new Error("No authentication token found");
        }
    
            const response = await fetch("http://localhost:3001/api/bookings/student", {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                    "Authorization": `Bearer ${token}`
                },
                body: JSON.stringify(bookingData),
            });
    
            // Check if the response is ok first
        if (!response.ok) {
            // Now try to parse the error message from the JSON response
            try {
                const errorData = await response.json();
                throw new Error(errorData.error || "Booking failed");
            } catch (jsonError) {
                // If we can't parse JSON, use the status text
                throw new Error(`Booking failed: ${response.statusText}`);
            }
        }
        
        // If we get here, the response was successful
        // Try to parse the response JSON if needed
        try {
            const result = await response.json();
            console.log("Booking successful:", result);
        } catch (jsonError) {
            // If response has no JSON body or invalid JSON, that's ok as long as status was success
            console.log("Booking successful (no JSON response)");
        }
    
            setIsSuccessPopupOpen(true);
            onBookingAdded();
            setTimeout(() => {
                closeForm();
            }, 2000);
        } catch (error) {
            console.error("Booking error:", error.message);
            if (error.message.includes("already booked")) {
                setIsAlreadyPopupOpen(true);
            } else {
                setIsErrorPopupOpen(true);
            }
        }
    };

    return (
        <div className="student-booking-form-container">
            <div className="student-booking-form">
                <h2>📝 Request Lab Booking</h2>
                {isPastDate ? (
                    <div className="past-date-message">
                        <p>You cannot book labs for past dates.</p>
                        <button type="button" onClick={closeForm} className="close-button">
                            Close
                        </button>
                    </div>
                ) : (
                    <form onSubmit={handleSubmit}>
                        {/* Lab Place Selection */}
                        <label>Lab Place <span className="required">*</span></label>
                        <select
                            name="labPlace"
                            value={formData.labPlace}
                            onChange={handleChange}
                            required
                            className="form-select"
                        >
                            <option value="" disabled>Select Lab Place</option>
                            <option value="Electrical Machines Lab">Electrical Machines Lab</option>
                            <option value="Communication Lab">Communication Lab</option>
                            <option value="Measurements Lab">Measurements Lab</option>
                            <option value="High Voltage Lab">High Voltage Lab</option>
                        </select>

                        {/* Date */}
                        <label>Date</label>
                        <input 
                            type="text" 
                            value={selectedDate.toDateString()} 
                            disabled 
                            className="form-input date-input"
                        />

                        {/* Time Slot Selection */}
                        <label>Time Slot <span className="required">*</span></label>
                        <select
                            name="timeSlot"
                            value={formData.timeSlot}
                            onChange={handleChange}
                            required
                            className="form-select"
                        >
                            <option value="8:30-11:30">8:30 AM - 11:30 AM</option>
                            <option value="1:30-4:30">1:30 PM - 4:30 PM</option>
                            <option value="custom">Custom Time</option>
                        </select>

                        {/* Custom Time Inputs */}
                        {formData.timeSlot === "custom" && (
                            <div className="custom-time-inputs">
                                <div className="time-input-group">
                                    <label>Start Time <span className="required">*</span></label>
                                    <input
                                        type="time"
                                        name="customStartTime"
                                        value={formData.customStartTime}
                                        onChange={handleChange}
                                        required
                                        className="form-input time-input"
                                    />
                                </div>
                                <div className="time-input-group">
                                    <label>End Time <span className="required">*</span></label>
                                    <input
                                        type="time"
                                        name="customEndTime"
                                        value={formData.customEndTime}
                                        onChange={handleChange}
                                        required
                                        className="form-input time-input"
                                    />
                                </div>
                            </div>
                        )}

                        {/* Description */}
                        <label>Description <span className="required">*</span></label>
                        <textarea
                            name="description"
                            value={formData.description}
                            onChange={handleChange}
                            required
                            placeholder="Please describe the purpose of your lab booking request"
                            className="form-textarea"
                            rows="4"
                        ></textarea>

                        {/* Booked By */}
                        <label>Requested By</label>
                        <input
                            type="text"
                            value={user ? `${user.FirstName} ${user.LastName}` : ""}
                            disabled
                            className="form-input user-input"
                        />

                        {/* Form Actions */}
                        <div className="form-actions">
                            <button type="submit" className="submit-button">Submit Request</button>
                            <button type="button" onClick={closeForm} className="cancel-button">
                                Cancel
                            </button>
                        </div>
                    </form>
                )}
            </div>

            {/* Success Popup */}
            <SidePopup
                type="success"
                title="Request Submitted"
                message="Your lab booking request has been submitted successfully!"
                isOpen={isSuccessPopupOpen}
                onClose={() => setIsSuccessPopupOpen(false)}
                duration={3000}
            />

            {/* Error Popup */}
            <SidePopup
                type="error"
                title="Error"
                message={isPastDate ? "Cannot book labs for past dates!" : "The lab is already booked at that time. "}
                isOpen={isErrorPopupOpen}
                onClose={() => setIsErrorPopupOpen(false)}
                duration={3000}
            />

            {/* Already Booked Popup */}
            <SidePopup
                type="error"
                title="Time Conflict"
                message="The lab is already booked at that time. Please select a different time slot."
                isOpen={isAlreadyPopupOpen}
                onClose={() => setIsAlreadyPopupOpen(false)}
                duration={3000}
            />
        </div>
    );
};

export default StudentBookingForm;