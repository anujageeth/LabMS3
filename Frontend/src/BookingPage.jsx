import React, { useState, useEffect } from "react";
import Calendar from "react-calendar";
import { FaCalendarAlt } from "react-icons/fa";
import "./BookingReservation.css";
import "react-calendar/dist/Calendar.css";
import BookingForm from "./components/BookingForm";

const BookingReservation = () => {
    const [date, setDate] = useState(new Date());
    const [isCalendarVisible, setIsCalendarVisible] = useState(false);
    const [isFormVisible, setIsFormVisible] = useState(false);
    const [bookings, setBookings] = useState([]);

    useEffect(() => {
        fetchBookings();
    }, [date]);

    const fetchBookings = async () => {
        try {
            const formattedDate = date.toISOString().split("T")[0];
            const response = await fetch(`http://localhost:3001/api/bookings?date=${formattedDate}`);
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
        setDate(newDate);
        setIsCalendarVisible(false);
    };

    const toggleCalendar = () => setIsCalendarVisible(!isCalendarVisible);

    const toggleFormVisibility = () => setIsFormVisible(!isFormVisible);

    return (
        <div className="booking-container">
            <h1>Booking & Reservation</h1>
            <div className="top-section">
                <button onClick={toggleFormVisibility}>Book your lab</button>
                <div onClick={toggleCalendar}>
                    <FaCalendarAlt size={24} />
                </div>
                {isCalendarVisible && <Calendar onChange={onDateChange} value={date} />}
            </div>

            {isFormVisible && (
                <BookingForm
                    closeForm={toggleFormVisibility}
                    selectedDate={date}
                    onBookingAdded={fetchBookings}
                />
            )}

            <table>
                <thead>
                    <tr>
                        <th>Lab Name</th>
                        <th>Lab Place</th>
                        <th>Date</th>
                        <th>Time</th>
                        <th>Duration</th>
                        <th>Booked By</th>
                    </tr>
                </thead>
                <tbody>
                    {bookings.length > 0 ? (
                        bookings.map((booking) => (
                            <tr key={booking._id}>
                                <td>{booking.labName}</td>
                                <td>{booking.labPlace}</td>
                                <td>{booking.date}</td>
                                <td>{booking.time}</td>
                                <td>{booking.duration} hrs</td>
                                <td>{booking.bookedBy}</td>
                            </tr>
                        ))
                    ) : (
                        <tr>
                            <td colSpan="6">No bookings available for the selected date.</td>
                        </tr>
                    )}
                </tbody>
            </table>
        </div>
    );
};

export default BookingReservation;


