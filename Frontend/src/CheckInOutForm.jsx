import React, { useEffect, useState } from "react";
import { BrowserRouter as Router } from "react-router-dom";
import {
    getCheckinCheckoutRecords,
    addCheckinCheckoutRecord,
  } from "../src/services/checkinCheckoutService";
import { useNavigate } from "react-router-dom";
import "./AddItem.css";
import { getAllEquipment } from "../src/services/equipmentService";

import { register } from "./services/authService";

const CheckInOutForm = () => {
  const navigate = useNavigate();
  const [firstName, setFirstName] = useState("");
  const [lastName, setLastName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [role, setRole] = useState("");
  const [title, setTitle] = useState("");
  //const [studentID, setStudentID] = useState("");

    const [records, setRecords] = useState([]);
    const [equipmentList, setEquipmentList] = useState([]);
    const [form, setForm] = useState({
        equipmentId: "",
        username: "",
        quantity: 1,
        action: "checkout",
    });

    useEffect(() => {
        fetchRecords();
        fetchEquipmentList();
      }, []);
    
    const fetchRecords = async () => {
        const data = await getCheckinCheckoutRecords();
        setRecords(data);
    };

    const fetchEquipmentList = async () => {
        const data = await getAllEquipment();
        setEquipmentList(data);
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        await addCheckinCheckoutRecord(form);
        fetchRecords();
        await navigate("/checkinouthistory");
    };

    const handleInputChange = (e) => {
        setForm({ ...form, [e.target.name]: e.target.value });
    };

    const handleCancelClick = () => {
        navigate("/checkinouthistory");
    };
  

  return (
    <div className="loginPage">
      <div className="fullBox">
        <div className="overlay"></div>
        <div className="loginBox" id="addUserBox">
            <h2 className="loginTitle">Check in / out</h2>
            <form onSubmit={handleSubmit}>
                <div className="typeBox">
                    <select
                    name="equipmentId"
                    value={form.equipmentId}
                    onChange={handleInputChange}
                    required
                    className="typeBoxControl"
                    id="addAvailabilityBtn"
                    >
                    <option value="">Select Equipment</option>
                    {equipmentList.map((equipment) => (
                        <option key={equipment._id} value={equipment._id}>
                        {equipment.Name}
                        </option>
                    ))}
                    </select>
                </div>

                <div className="typeBox">
                    <input
                    type="text"
                    placeholder="Username"
                    autoComplete="off"
                    name="username"
                    value={form.username}
                    onChange={handleInputChange}
                    className="typeBoxControl"
                    required
                    />
                </div>

                <div className="typeBox">
                    <input
                    type="number"
                    placeholder="Quantity"
                    autoComplete="off"
                    name="quantity"
                    value={form.quantity}
                    onChange={handleInputChange}
                    min="1"
                    className="typeBoxControl"
                    required
                    />
                </div>

                <div className="typeBox">
                    <select
                    name="action"
                    value={form.action}
                    onChange={handleInputChange}
                    required
                    className="typeBoxControl"
                    id="addAvailabilityBtn"
                    >
                    <option value="checkout">Check-out</option>
                    <option value="checkin">Check-in</option>
                    </select>
                </div>

                <button type="submit" className="loginBtn">
                    <b>Submit</b>
                </button>

                <button type="button" className="loginBtn" onClick={handleCancelClick}>
                    <b>History</b>
                </button>
                </form>
        </div>
      </div>
    </div>
  );
};

export default CheckInOutForm;
