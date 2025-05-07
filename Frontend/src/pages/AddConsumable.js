import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { createConsumable } from '../services/consumableService';
import '../styles/AddConsumable.css';

const AddConsumable = ({ onRefresh }) => {
  const navigate = useNavigate();
  const [formData, setFormData] = useState({
    Name: '',
    Category: '',
    Lab: '',
    Quantity: '',
    MinimumQuantity: '5', // Default minimum quantity for low stock alerts
    Unit: 'pcs', // Default unit value from the enum
    StorageLocation: '',
    Notes: '', // Changed from Description to Notes to match backend
    image: null
  });
  const [error, setError] = useState(null);
  const [loading, setLoading] = useState(false);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handleFileChange = (e) => {
    setFormData(prev => ({
      ...prev,
      image: e.target.files[0]
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError(null);

    try {
      const jsonData = {
        Name: formData.Name,
        Category: formData.Category,
        Lab: formData.Lab,
        Quantity: Number(formData.Quantity),
        MinimumQuantity: Number(formData.MinimumQuantity),
        Unit: formData.Unit,
        StorageLocation: formData.StorageLocation || '',
        Notes: formData.Notes || ''
      };

      // First create the consumable record
      const response = await createConsumable(jsonData);

      // If there's an image and we have an ID, we could handle image upload here
      // This would need a separate endpoint in your backend
      // Similar to what we did in the AddConsumableItems component
      
      if (onRefresh) onRefresh();
      navigate('/consumables');
    } catch (err) {
      setError('Failed to add consumable item. Please try again.');
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="add-consumable-container">
      <h1>Add New Consumable Item</h1>
      
      {error && <div className="error-message">{error}</div>}

      <form onSubmit={handleSubmit} className="consumable-form">
        <div className="typeBoxControl" id="addAvailabilityBtn">
          <label htmlFor="Name">Name</label>
          <input
            type="text"
            id="Name"
            name="Name"
            value={formData.Name}
            onChange={handleChange}
            required
          />
        </div>

        <div className="typeBoxControl" id="addAvailabilityBtn">
          <label htmlFor="Category">Category</label>
          <input
            type="text"
            id="Category"
            name="Category"
            value={formData.Category}
            onChange={handleChange}
            required
          />
        </div>

        <div className="typeBoxControl" id="addAvailabilityBtn">
          <label htmlFor="Lab">Lab</label>
          <select
            id="Lab"
            name="Lab"
            value={formData.Lab}
            onChange={handleChange}
            required
            className="select-control"
          >
            <option value="" disabled>Select Lab</option>
            <option value="Electrical Machines Lab">Electrical Machines Lab</option>
            <option value="Communication Lab">Communication Lab</option>
            <option value="Measurements Lab">Measurements Lab</option>
            <option value="High Voltage Lab">High Voltage Lab</option>
          </select>
        </div>

        <div className="typeBoxControl" id="addAvailabilityBtn">
          <div className="form-group">
            <label htmlFor="Quantity">Quantity</label>
            <input
              type="number"
              id="Quantity"
              name="Quantity"
              value={formData.Quantity}
              onChange={handleChange}
              min="0"
              required
            />
          </div>

          <div className="typeBoxControl" id="addAvailabilityBtn">
            <label htmlFor="MinimumQuantity">Minimum Quantity</label>
            <input
              type="number"
              id="MinimumQuantity"
              name="MinimumQuantity"
              value={formData.MinimumQuantity}
              onChange={handleChange}
              min="0"
              required
              placeholder="For low stock alerts"
            />
          </div>
        </div>

        <div className="typeBoxControl" id="addAvailabilityBtn">
          <label htmlFor="Unit">Unit</label>
          <select
            id="Unit"
            name="Unit"
            value={formData.Unit}
            onChange={handleChange}
            required
            className="select-control"
          >
            <option value="" disabled>Select Unit</option>
            <option value="pcs">Pieces</option>
            <option value="meters">Meters</option>
            <option value="grams">Grams</option>
            <option value="liters">Liters</option>
            <option value="boxes">Boxes</option>
            <option value="packs">Packs</option>
            <option value="rolls">Rolls</option>
          </select>
        </div>

        <div className="typeBoxControl" id="addAvailabilityBtn">
          <label htmlFor="StorageLocation">Storage Location</label>
          <input
            type="text"
            id="StorageLocation"
            name="StorageLocation"
            value={formData.StorageLocation}
            onChange={handleChange}
          />
        </div>

        <div className="form-group">
          <label htmlFor="Notes">Notes</label>
          <textarea
            id="Notes"
            name="Notes"
            value={formData.Notes}
            onChange={handleChange}
            rows="3"
          />
        </div>

        <div className="form-group">
          <label htmlFor="image">Image</label>
          <input
          className="addImageBtn"
            type="file"
            id="image"
            name="image"
            onChange={handleFileChange}
            accept="image/*"
          />
        </div>

        <div className="form-actions">
          <button 
            type="button" 
            className="cancel-btn"
            onClick={() => navigate('/consumables')}
          >
            Cancel
          </button>
          <button 
            type="submit" 
            className="submit-btn"
            disabled={loading}
          >
            {loading ? 'Adding...' : 'Add Consumable'}
          </button>
        </div>
      </form>
    </div>
  );
};

export default AddConsumable; 