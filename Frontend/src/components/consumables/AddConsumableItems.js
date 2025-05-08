import React, { useState } from 'react';
import axios from 'axios';
import '../../styles/AddConsumableItems.css';

const AddConsumableItems = ({ onRefresh, onCancel }) => {
  const [formData, setFormData] = useState({
    Name: '',
    Category: '',
    Lab: '',
    Quantity: '',
    MinimumQuantity: '5', // Default value for minimum quantity
    Unit: 'pcs', // Default unit from the enum
    StorageLocation: '',
    Description: ''
  });
  const [isLoading, setIsLoading] = useState(false);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsLoading(true);

    try {
      const token = localStorage.getItem('token');
      if (!token) {
        alert('Please log in to add consumable items');
        return;
      }

      // Handle the JSON data submission
      const jsonData = {
        Name: formData.Name,
        Category: formData.Category,
        Lab: formData.Lab,
        Quantity: Number(formData.Quantity),
        MinimumQuantity: Number(formData.MinimumQuantity),
        Unit: formData.Unit,
        StorageLocation: formData.StorageLocation || '',
        Notes: formData.Description || ''
      };

      console.log('Sending data to server:', jsonData);

       const response = await axios.post(
         'http://10.50.227.93:3001/api/consumables',
         jsonData,
         {
           headers: {
             Authorization: `Bearer ${token}`,
             'Content-Type': 'application/json'
           }
         }
       );

      onRefresh && onRefresh();
      
      // Reset form
      setFormData({
        Name: '',
        Category: '',
        Lab: '',
        Quantity: '',
        MinimumQuantity: '5',
        Unit: 'pcs',
        StorageLocation: '',
        Description: ''
      });
      
    } catch (error) {
      console.error('Error adding consumable item:', error.response?.data || error);
      alert('Failed to add consumable item: ' + (error.response?.data?.message || error.message));
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div>
      <form onSubmit={handleSubmit}>
        {/* Name Field */}
        <div className="typeBox">
          <input
            type="text"
            placeholder=" Name"
            name="Name"
            value={formData.Name}
            onChange={handleChange}
            required
            className="typeBoxControl"
            
          />
        </div>

        {/* Category Field */}
        <div className="typeBox">
          <input
            type="text"
            placeholder=" Category"
            name="Category"
            value={formData.Category}
            onChange={handleChange}
            required
            className="typeBoxControl"
          />
        </div>

        {/* Lab Selection */}
        <label>
          <select className="typeBoxControl" id="addAvailabilityBtn" name="Lab" value={formData.Lab} onChange={handleChange} required>
            <option value="" disabled>Select Lab</option>
            <option value="Electrical Machines Lab">Electrical Machines Lab</option>
            <option value="Communication Lab">Communication Lab</option>
            <option value="Measurements Lab">Measurements Lab</option>
            <option value="High Voltage Lab">High Voltage Lab</option>
          </select>
        </label>

        {/* Quantity and Unit */}
        <div className="typeBox">
          <input
            type="number"
            placeholder=" Quantity"
            name="Quantity"
            value={formData.Quantity}
            onChange={handleChange}
            required
            min="0"
            className="typeBoxControl"
          />
        </div>

        {/* Minimum Quantity */}
        <div className="typeBox">
          <input
            type="number"
            placeholder="Minimum Quantity (for low stock alert)"
            name="MinimumQuantity"
            value={formData.MinimumQuantity}
            onChange={handleChange}
            required
            min="0"
            className="typeBoxControl"
          />
        </div>

        {/* Unit Selection - to match the enum in the model */}
        <label>
          <select className="typeBoxControl" id="addAvailabilityBtn" name="Unit" value={formData.Unit} onChange={handleChange} required>
            <option value="" disabled>Select Unit</option>
            <option value="pcs">Pieces</option>
            <option value="meters">Meters</option>
            <option value="grams">Grams</option>
            <option value="liters">Liters</option>
            <option value="boxes">Boxes</option>
            <option value="packs">Packs</option>
            <option value="rolls">Rolls</option>
          </select>
        </label>

        {/* Storage Location */}
        <div className="typeBox">
          <input
            type="text"
            placeholder=" Storage Location"
            name="StorageLocation"
            value={formData.StorageLocation}
            onChange={handleChange}
            className="typeBoxControl"
          />
        </div>

        {/* Description */}
        <div className="typeBox">
          <textarea
            placeholder=" Notes"
            name="Description"
            value={formData.Description}
            onChange={handleChange}
            className="typeBoxControl"
            id="consumableNotes"
            rows="3"
          />
        </div>

        {/* Submit Button */}
        <button type="submit" className="loginBtn" id="saveUserBtn" disabled={isLoading}>
          <b>{isLoading ? 'SAVING...' : 'SAVE'}</b>
        </button>
      </form>
    </div>
  );
};

export default AddConsumableItems; 
