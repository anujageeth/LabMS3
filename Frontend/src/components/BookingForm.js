
import React, { useState } from "react";
import "./BookingForm.css";
import SidePopup from "./SidePopup"

const BookingForm = ({ closeForm, selectedDate, onBookingAdded }) => {
    const [labName, setLabName] = useState("");
    const [labPlace, setLabPlace] = useState("");
    const [bookedBy, setBookedBy] = useState("");
    const [time, setTime] = useState("");
    const [duration, setDuration] = useState(1);

    const [isSuccessPopupOpen, setIsSuccessPopupOpen] = useState(false);
    const [isErrorPopupOpen, setIsErrorPopupOpen] = useState(false);
    const [isAlreadyPopupOpen, setIsAlreadyPopupOpen] = useState(false);
    

    const labPlaceOptions = ["Lab 1", "Lab 2", "Lab 3", "Lab 4"];

    const handleSubmit = async (e) => {
        e.preventDefault();

        const bookingData = {
            labName,
            labPlace,
            date: selectedDate.toISOString().split("T")[0],
            // bookedBy,
            time,
            duration,
        };

        try {
            const response = await fetch("http://localhost:3001/api/bookings", {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                    Authorization: `Bearer ${localStorage.getItem('token')}`
                },
                body: JSON.stringify(bookingData),
            });

            if (response.ok) {
                setIsSuccessPopupOpen(true);
                // alert("Booking successful!");
                onBookingAdded(); // Refresh bookings list
                setTimeout(() => {
                    closeForm(); // Close the form after the popup is shown
                }, 2000); // Adjust the delay (2000ms = 2 seconds)
            } else {
                const result = await response.json();
                if (result.error === "Lab is already booked at that time.") {
                    setIsAlreadyPopupOpen(true)
                    // alert("The selected lab is already booked for this time. Please choose a different time.");
                } else {
                    setIsErrorPopupOpen(false)
                    // alert(result.error || "Failed to book the lab.");
                }
            }
        } catch (error) {
            console.error("Error submitting the form:", error.message);
            setIsErrorPopupOpen(false)
            // alert("An error occurred while trying to book the lab. Please try again later.");
        }
    };

    return (
        <div className="booking-form-container">
            <div className="booking-form">
                <h2>📅 Book Laboratory</h2>
                <form onSubmit={handleSubmit}>
                    <label>Lab Name</label>
                    <input
                        type="text"
                        value={labName}
                        onChange={(e) => setLabName(e.target.value)}
                        required
                    />

                    <label>
                        <select
                            
                            name="LabPlace"
                            value={labPlace}
                            onChange={(e) => setLabPlace(e.target.value)}
                            required
                        >
                            <option value="" disabled>
                            Select Lab Place
                            </option>
                            <option value="Electrical machines Lab">Electrical Machines Lab</option>
                            <option value="Communication Lab">Communication Lab</option>
                            <option value="Measurements Lab">Measurements Lab</option>
                            <option value="High Voltage Lab">High Voltage Lab</option>
                        </select>
                    </label>


                    <label>Date</label>
                    <input type="text" value={selectedDate.toDateString()} disabled />

                    <label>Start Time</label>
                    <input type="time" value={time} onChange={(e) => setTime(e.target.value)} required />

                    <label>Duration (in hours)</label>
                    <input
                        type="number"
                        value={duration}
                        onChange={(e) => setDuration(e.target.value)}
                        min="1"
                        required
                    />

                    {/*
                    <label>Booked By</label>
                    <input
                        type="text"
                        value={bookedBy}
                        onChange={(e) => setBookedBy(e.target.value)}
                        required
                    />
                    */}

                    <div className="form-actions">
                        <button type="submit">Confirm Booking</button>
                        <button type="button" onClick={closeForm}>Cancel</button>
                    </div>
                </form>
            </div>

            <SidePopup
                type="success"
                title="Successful"
                message="Lab booking successful!"
                isOpen={isSuccessPopupOpen}
                onClose={() => setIsSuccessPopupOpen(false)}
                duration={3000} // Optional: customize duration in milliseconds
            />

            <SidePopup
                type="error"
                title="Error"
                message="Couldn't book the lab!"
                isOpen={isErrorPopupOpen}
                onClose={() => setIsErrorPopupOpen(false)}
                duration={3000} // Optional: customize duration in milliseconds
            />

            <SidePopup
                type="error"
                title="Error"
                message="Already booked the lab!"
                isOpen={isAlreadyPopupOpen}
                onClose={() => setIsAlreadyPopupOpen(false)}
                duration={3000} // Optional: customize duration in milliseconds
            />
        </div>
    );
};


export default BookingForm;
