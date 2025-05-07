import React, { useState, useEffect } from "react";
import "./BookingForm.css";
import SidePopup from "./SidePopup";

const BookingForm = ({ 
  closeForm, 
  selectedDate, 
  onBookingAdded, 
  user,
  academicDetails
}) => {
  const [formData, setFormData] = useState({
    semesterId: "",
    moduleId: "",
    labId: "",
    labPlace: "",
    timeSlot: "8:30-11:30",
    customStartTime: "",
    customEndTime: "",
    experimentTitle: "",
    experimentDescription: "",
    equipmentNeeded: ""
  });
  const [isPastDate, setIsPastDate] = useState(false);
  const [isSuccessPopupOpen, setIsSuccessPopupOpen] = useState(false);
  const [isErrorPopupOpen, setIsErrorPopupOpen] = useState(false);
  const [isAlreadyPopupOpen, setIsAlreadyPopupOpen] = useState(false);

  useEffect(() => {
    const today = new Date();
    today.setHours(0, 0, 0, 0);
    setIsPastDate(selectedDate < today);
  }, [selectedDate]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => {
      // When semester or module changes, reset the dependent fields
      const newData = { ...prev, [name]: value };
      if (name === "semesterId") {
        newData.moduleId = "";
        newData.labId = "";
      } else if (name === "moduleId") {
        newData.labId = "";
      }
      return newData;
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (isPastDate) {
      setIsErrorPopupOpen(true);
      return;
    }

    const selectedModule = Object.values(academicDetails.modulesBySemester)
      .flat()
      .find(m => m.id === formData.moduleId);
    const selectedLab = academicDetails.labsByModule[formData.moduleId]?.find(l => l.id === formData.labId);

    if (!selectedModule || !selectedLab) {
      setIsErrorPopupOpen(true);
      return;
    }

    const bookingData = {
      labName: selectedLab.name,
      labPlace: formData.labPlace,
      date: selectedDate.toISOString().split("T")[0],
      bookedBy: user?.Email,  // Use email for identifying the user in backend
      timeSlot: formData.timeSlot,
      module: selectedModule.name,
      experimentTitle: formData.experimentTitle,
      experimentDescription: formData.experimentDescription,
      equipmentNeeded: formData.equipmentNeeded,
      ...(formData.timeSlot === "custom" && {
        startTime: formData.customStartTime,
        endTime: formData.customEndTime
      })
    };

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
        // Call the onBookingAdded callback to show the Technical Officer notification
        onBookingAdded();
        // No need for separate timeout since onBookingAdded will handle form closure
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

  // Get available modules for selected semester
  const availableModules = formData.semesterId 
    ? academicDetails.modulesBySemester[formData.semesterId] || []
    : [];

  // Get available labs for selected module
  const availableLabs = formData.moduleId 
    ? academicDetails.labsByModule[formData.moduleId] || []
    : [];

  return (
    <div className="booking-form-container">
      <div className="loginBox" id="addUserBox">
        <h2 className="loginTitle">Book Laboratory</h2>
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
            {/* <label>Semester</label> */}
            <select
              name="semesterId"
              value={formData.semesterId}
              onChange={handleChange}
              required
              className="typeBoxControl"
              id="addAvailabilityBtn"
            >
              <option value="" disabled>Select Semester</option>
              {academicDetails.semesters.map((semester) => (
                <option key={semester.id} value={semester.id}>
                  {semester.name}
                </option>
              ))}
            </select>

            {/* Module Selection */}
            {/* <label>Module</label> */}
            <select
              name="moduleId"
              value={formData.moduleId}
              onChange={handleChange}
              required
              disabled={!formData.semesterId}
              className="typeBoxControl"
              id="addAvailabilityBtn"
            >
              <option value="" disabled>Select Module</option>
              {availableModules.map((module) => (
                <option key={module.id} value={module.id}>
                  {module.name}
                </option>
              ))}
            </select>

            {/* Lab Selection */}
            {/* <label>Lab Name</label> */}
            <select
              name="labId"
              value={formData.labId}
              onChange={handleChange}
              required
              disabled={!formData.moduleId}
              className="typeBoxControl"
              id="addAvailabilityBtn"
            >
              <option value="" disabled>Select Laboratory Name</option>
              {availableLabs.map((lab) => (
                <option key={lab.id} value={lab.id}>
                  {lab.name} ({lab.location})
                </option>
              ))}
            </select>

            {/* Lab Place Selection */}
            {/* <label>Lab Venue</label> */}
            <select
              name="labPlace"
              value={formData.labPlace}
              onChange={handleChange}
              required
              className="typeBoxControl"
              id="addAvailabilityBtn"
            >
              <option value="" disabled>Select Lab Venue</option>
              <option value="Electrical Machines Lab">Electrical Machines Lab</option>
              <option value="Communication Lab">Communication Lab</option>
              <option value="Measurements Lab">Measurements Lab</option>
              <option value="High Voltage Lab">High Voltage Lab</option>
            </select>

            {/* Date */}
            {/* <label>Date</label> */}
            <input 
              type="text" 
              value={`Date: ${selectedDate.toDateString()}` } 
              disabled 
              className="typeBoxControl"
              id="addAvailabilityBtn"
            />

            {/* Time Slot Selection */}
            {/* <label>Time Slot</label> */}
            <select
              name="timeSlot"
              value={formData.timeSlot}
              onChange={handleChange}
              required
              className="typeBoxControl"
              id="addAvailabilityBtn"
            >
              <option value="8:30-11:30">8:30 AM - 11:30 AM</option>
              <option value="1:30-4:30">1:30 PM - 4:30 PM</option>
              <option value="custom">Custom Time</option>
            </select>

            {/* Custom Time Inputs */}
            {formData.timeSlot === "custom" && (
              <div>
                <div className="custom-time-inputs">
                  <label>From </label>
                  <input
                    type="time"
                    name="customStartTime"
                    value={formData.customStartTime}
                    onChange={handleChange}
                    required
                    className="typeBoxControl"
                    id="customTimeBtn"
                  />
                </div>
                <div className="custom-time-inputs">
                  <label>To </label>
                  <input
                    type="time"
                    name="customEndTime"
                    value={formData.customEndTime}
                    onChange={handleChange}
                    required
                    className="typeBoxControl"
                    id="customTimeBtn"
                  />
                </div>
              </div>
            )}

            <br />
            {/* Lab Practical Information - New Fields */}
            <h3>Lab Practical Information</h3>
            
            {/* <label>Experiment Title</label> */}
            <input
              type="text"
              name="experimentTitle"
              value={formData.experimentTitle}
              onChange={handleChange}
              required
              placeholder="Title of the experiment"
              className="typeBoxControl"
              id="addAvailabilityBtn"
            />

            {/* <label>Experiment Description</label> */}
            <textarea
              name="experimentDescription"
              value={formData.experimentDescription}
              onChange={handleChange}
              required
              placeholder="Details about the experiment"
              rows="3"
              className="typeBoxControl"
              id="consumableNotes"
            ></textarea>

            {/* <label>Equipment/Materials Needed</label> */}
            <textarea
              name="equipmentNeeded"
              value={formData.equipmentNeeded}
              onChange={handleChange}
              required
              placeholder="List all equipment and materials required"
              rows="3"
              className="typeBoxControl"
              id="consumableNotes"
            ></textarea>

            {/* Booked By */}
            {/* <label>Booked By</label> */}
            <input
              type="text"
              value={user ? `Booked by: ${user.FirstName} ${user.LastName}` : ""}
              disabled
              className="typeBoxControl"
              id="addAvailabilityBtn"
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
        title="Booking Successful"
        message="Your lab has been booked successfully! Technical Officers have been notified and will prepare the lab for your session."
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