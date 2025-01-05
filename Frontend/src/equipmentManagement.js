import React, { useEffect, useState } from "react";
import {
  getCheckinCheckoutRecords,
  addCheckinCheckoutRecord,
} from "../src/services/checkinCheckoutService";
import { getAllEquipment } from "../src/services/equipmentService";

const CheckinCheckoutPage = () => {
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
  };

  const handleInputChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  return (
    <div>
      <h1>Check-in/Check-out</h1>

      {/* Form */}
      <form onSubmit={handleSubmit}>
        <select
          name="equipmentId"
          value={form.equipmentId}
          onChange={handleInputChange}
          required
        >
          <option value="">Select Equipment</option>
          {equipmentList.map((equipment) => (
            <option key={equipment._id} value={equipment._id}>
              {equipment.Name}
            </option>
          ))}
        </select>

        <input
          type="text"
          name="username"
          placeholder="Username"
          value={form.username}
          onChange={handleInputChange}
          required
        />

        <input
          type="number"
          name="quantity"
          placeholder="Quantity"
          value={form.quantity}
          onChange={handleInputChange}
          min="1"
          required
        />

        <select
          name="action"
          value={form.action}
          onChange={handleInputChange}
          required
        >
          <option value="checkout">Check-out</option>
          <option value="checkin">Check-in</option>
        </select>

        <button type="submit">Submit</button>
      </form>

      {/* Table */}
      <table>
        <thead>
          <tr>
            <th>Equipment Name</th>
            <th>Category</th>
            <th>Quantity</th>
            <th>Action</th>
            <th>Date</th>
            <th>Username</th>
          </tr>
        </thead>
        <tbody>
          {records.map((record) => (
            <tr key={record._id}>
              <td>{record.equipment?.Name}</td>
              <td>{record.equipment?.Category}</td>
              <td>{record.quantity}</td>
              <td>{record.action}</td>
              <td>{new Date(record.date).toLocaleDateString()}</td>
              <td>{record.username}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};

export default CheckinCheckoutPage;
