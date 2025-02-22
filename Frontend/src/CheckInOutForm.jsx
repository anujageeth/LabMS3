// import React, { useEffect, useState } from "react";
// import { BrowserRouter as Router } from "react-router-dom";
// import {
//     getCheckinCheckoutRecords,
//     addCheckinCheckoutRecord,
//   } from "../src/services/checkinCheckoutService";
// import { useNavigate } from "react-router-dom";
// import "./AddItem.css";
// import { getAllEquipment } from "../src/services/equipmentService";

// import { register } from "./services/authService";

// const CheckInOutForm = () => {
//   const navigate = useNavigate();
//   const [firstName, setFirstName] = useState("");
//   const [lastName, setLastName] = useState("");
//   const [email, setEmail] = useState("");
//   const [password, setPassword] = useState("");
//   const [confirmPassword, setConfirmPassword] = useState("");
//   const [role, setRole] = useState("");
//   const [title, setTitle] = useState("");
//   //const [studentID, setStudentID] = useState("");

//     const [records, setRecords] = useState([]);
//     const [equipmentList, setEquipmentList] = useState([]);
//     const [form, setForm] = useState({
//         equipmentId: "",
//         username: "",
//         quantity: 1,
//         action: "checkout",
//     });

//     useEffect(() => {
//         fetchRecords();
//         fetchEquipmentList();
//       }, []);
    
//     const fetchRecords = async () => {
//         const data = await getCheckinCheckoutRecords();
//         setRecords(data);
//     };

//     const fetchEquipmentList = async () => {
//         const data = await getAllEquipment();
//         setEquipmentList(data);
//     };

//     const handleSubmit = async (e) => {
//         e.preventDefault();
//         await addCheckinCheckoutRecord(form);
//         fetchRecords();
//         await navigate("/checkinouthistory");
//     };

//     const handleInputChange = (e) => {
//         setForm({ ...form, [e.target.name]: e.target.value });
//     };

//     const handleCancelClick = () => {
//         navigate("/checkinouthistory");
//     };
  

//   return (
//     <div className="loginPage">
//       <div className="fullBox">
//         <div className="overlay"></div>
//         <div className="loginBox" id="addUserBox">
//             <h2 className="loginTitle">Check in / out</h2>
//             <form onSubmit={handleSubmit}>
//                 <div className="typeBox">
//                     <select
//                     name="equipmentId"
//                     value={form.equipmentId}
//                     onChange={handleInputChange}
//                     required
//                     className="typeBoxControl"
//                     id="addAvailabilityBtn"
//                     >
//                     <option value="">Select Equipment</option>
//                     {equipmentList.map((equipment) => (
//                         <option key={equipment._id} value={equipment._id}>
//                         {equipment.Name}
//                         </option>
//                     ))}
//                     </select>
//                 </div>

//                 <div className="typeBox">
//                     <input
//                     type="text"
//                     placeholder="Username"
//                     autoComplete="off"
//                     name="username"
//                     value={form.username}
//                     onChange={handleInputChange}
//                     className="typeBoxControl"
//                     required
//                     />
//                 </div>

//                 <div className="typeBox">
//                     <input
//                     type="number"
//                     placeholder="Quantity"
//                     autoComplete="off"
//                     name="quantity"
//                     value={form.quantity}
//                     onChange={handleInputChange}
//                     min="1"
//                     className="typeBoxControl"
//                     required
//                     />
//                 </div>

//                 <div className="typeBox">
//                     <select
//                     name="action"
//                     value={form.action}
//                     onChange={handleInputChange}
//                     required
//                     className="typeBoxControl"
//                     id="addAvailabilityBtn"
//                     >
//                     <option value="checkout">Check-out</option>
//                     <option value="checkin">Check-in</option>
//                     </select>
//                 </div>

//                 <button type="submit" className="loginBtn">
//                     <b>Submit</b>
//                 </button>

//                 <button type="button" className="loginBtn" onClick={handleCancelClick}>
//                     <b>History</b>
//                 </button>
//                 </form>
//         </div>
//       </div>
//     </div>
//   );
// };

// export default CheckInOutForm;
// components/EquipmentTransaction.jsx
import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';
import SidePopup from "./components/SidePopup"

function CheckInOutForm() {
  const [action, setAction] = useState('checkout');
  const [serials, setSerials] = useState('');
  const [damage, setDamage] = useState('');
  const [notes, setNotes] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');
  const navigate = useNavigate();

  const [isSuccessPopupOpen, setIsSuccessPopupOpen] = useState(false);
  const [isErrorPopupOpen, setIsErrorPopupOpen] = useState(false);
  const [isEquipmentPopupOpen, setIsEquipmentPopupOpen] = useState(false);
  const [isCheckedInPopupOpen, setIsCheckedInPopupOpen] = useState(false);
  const [isCheckedOutPopupOpen, setIsCheckedOutPopupOpen] = useState(false);

  const [users, setUsers] = useState([]);
  const [selectedUser, setSelectedUser] = useState("");

  const api = axios.create({
    baseURL: 'http://localhost:3001/api',
    headers: {
      Authorization: `Bearer ${localStorage.getItem('token')}`
    }
  });

  useEffect(() => {
    const fetchUsers = async () => {
      try {
        const { data } = await api.get('/users');
        setUsers(data);
      } catch (err) {
        setError('Failed to fetch users');
        setTimeout(() => setError(''), 5000);
      }
    };

    fetchUsers();
  }, []);

  /*
  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError('');
    setSuccess('');

    try {
      const serialList = serials.split('\n').map(s => s.trim()).filter(s => s);
      
      const { data } = await api.post('/checkinout/bulk', {
        action,
        selectedUser,
        serials: serialList,
        damageDescription: action === 'checkin' ? damage : undefined,
        notes
      });
      if(data.status === "Equipment not found"){
        alert("Equipment not found");
      }else{
        setIsSuccessPopupOpen(true);
      setSuccess('Operation completed successfully!');
      setSerials('');
      setDamage('');
      setNotes('');
      setSelectedUser('');
      setTimeout(() => setSuccess(''), 3000);
      }

      

    } catch (err) {
      setIsErrorPopupOpen(true);
      setError(err.response?.data?.message || 'Something went wrong');
      setTimeout(() => setError(''), 5000);
    } finally {
      setLoading(false);
    }
  };*/

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError('');
    setSuccess('');

    try {
        const serialList = serials.split('\n').map(s => s.trim()).filter(s => s);
        
        const { data } = await api.post('/checkinout/bulk', {
            action,
            selectedUser,
            serials: serialList,
            damageDescription: action === 'checkin' ? damage : undefined,
            notes
        });

        // Categorizing errors
        const notFoundItems = data.filter(item => item.status === "Equipment not found");
        const alreadyCheckedOutItems = data.filter(item => item.status === "Already checked out");
        const alreadyCheckedInItems = data.filter(item => item.status === "Already checked in");
        const successItems = data.filter(item => item.status === "Success");

        let errorMessage = "";

        if (notFoundItems.length > 0) {
            setIsEquipmentPopupOpen(true);
            // errorMessage += `🔴 Equipment not found:\n${notFoundItems.map(i => i.serial).join(", ")}\n\n`;
        }
        if (alreadyCheckedOutItems.length > 0) {
            setIsCheckedOutPopupOpen(true);
            // errorMessage += `⚠️ Already checked out:\n${alreadyCheckedOutItems.map(i => i.serial).join(", ")}\n\n`;
        }
        if (alreadyCheckedInItems.length > 0) {
            setIsCheckedInPopupOpen(true);
            // errorMessage += `⚠️ Already checked in:\n${alreadyCheckedInItems.map(i => i.serial).join(", ")}\n\n`;
        }

        if (errorMessage) {
            setIsErrorPopupOpen(true);
            // setError(errorMessage.trim());
        }

        if (successItems.length > 0) {
            setIsSuccessPopupOpen(true);
            // setSuccess('Operation completed successfully!');
        }

        setSerials('');
        setDamage('');
        setNotes('');
        setSelectedUser('');

        setTimeout(() => {
            setError('');
            setSuccess('');
        }, 3000);

    } catch (err) {
        setIsErrorPopupOpen(true);
        setError(err.response?.data?.message || 'Something went wrong');
        setTimeout(() => setError(''), 5000);
    } finally {
        setLoading(false);
    }
};


  return (
    <form onSubmit={handleSubmit}>
      {error && <div className="error">{error}</div>}
      {success && <div className="success">{success}</div>}

      <select 
        className="listViewModalInput2"
        value={action} 
        onChange={(e) => setAction(e.target.value)}
        disabled={loading}
      >
        <option value="checkout">Check Out</option>
        <option value="checkin">Check In</option>
      </select>

      <select
        className="listViewModalInput2"
        value={selectedUser}
        onChange={(e) => setSelectedUser(e.target.value)}
        disabled={loading}
        required
      >
        <option value="">Select User</option>
        {users
          .filter(user => user.Role !== "student")
          .map((user) => (
            <option key={user._id} value={user._id}>
              {`${user.Title} ${user.FirstName} ${user.LastName} (${user.Role})`}
            </option>
        ))}
      </select>

      <textarea
        className="listViewModalInput2"
        value={serials}
        onChange={(e) => setSerials(e.target.value)}
        placeholder="Enter serial numbers, one per line"
        required
        disabled={loading}
      />

      {action === 'checkin' && (
        <input
          className="listViewModalInput2"
          type="text"
          value={damage}
          onChange={(e) => setDamage(e.target.value)}
          placeholder="Damage description (if any)"
          disabled={loading}
        />
      )}

      <input
        className="listViewModalInput2"
        type="text"
        value={notes}
        onChange={(e) => setNotes(e.target.value)}
        placeholder="Additional notes"
        disabled={loading}
      />

      <button className="listViewBtn3" type="submit" disabled={loading}>
        {loading ? 'Processing...' : 'Submit'}
      </button>

      <SidePopup
        type="success"
        title="🟢 Successful"
        message="Checked in / out successfully"
        isOpen={isSuccessPopupOpen}
        onClose={() => setIsSuccessPopupOpen(false)}
        duration={3000} // Optional: customize duration in milliseconds
      />

      <SidePopup
        type="error"
        title="🔴 Error"
        message="Couldn't check in/out"
        isOpen={isErrorPopupOpen}
        onClose={() => setIsErrorPopupOpen(false)}
        duration={3000} // Optional: customize duration in milliseconds
      />

      <SidePopup
        type="error"
        title="🔴 Error"
        message="Equipment is not found"
        isOpen={isEquipmentPopupOpen}
        onClose={() => setIsEquipmentPopupOpen(false)}
        duration={3000} // Optional: customize duration in milliseconds
      />

      <SidePopup
        type="error"
        title="🔴 Error"
        message="Already checked in"
        isOpen={isCheckedInPopupOpen}
        onClose={() => setIsCheckedInPopupOpen(false)}
        duration={3000} // Optional: customize duration in milliseconds
      />

      <SidePopup
        type="error"
        title="🔴 Error"
        message="Already checked out"
        isOpen={isCheckedOutPopupOpen}
        onClose={() => setIsCheckedOutPopupOpen(false)}
        duration={3000} // Optional: customize duration in milliseconds
      />
    </form>
  );
}

export default CheckInOutForm;