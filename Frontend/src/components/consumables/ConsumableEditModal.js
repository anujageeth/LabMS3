import React, { useState, useEffect } from 'react';
import { updateConsumable } from '../../services/consumableService';
import '../../styles/ConsumableEditModal.css';

const ConsumableEditModal = ({ item, onClose, onUpdateSuccess }) => {
  const [formData, setFormData] = useState({
    Name: '',
    Category: '',
    Lab: '',
    Quantity: '',
    MinimumQuantity: '',
    Unit: '',
    StorageLocation: '',
    Notes: ''
  });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  useEffect(() => {
    if (item) {
      setFormData({
        Name: item.Name || '',
        Category: item.Category || '',
        Lab: item.Lab || '',
        Quantity: item.Quantity || '',
        MinimumQuantity: item.MinimumQuantity || '',
        Unit: item.Unit || '',
        StorageLocation: item.StorageLocation || '',
        Notes: item.Notes || ''
      });
    }
  }, [item]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
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

      await updateConsumable(item._id, jsonData);
      
      if (onUpdateSuccess) {
        onUpdateSuccess();
      }
    } catch (err) {
      setError('Failed to update consumable item. Please try again.');
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  const handleOutsideClick = (e) => {
    if (e.target.className === 'edit-modal-overlay') {
      onClose();
    }
  };

  return (
    <div className="edit-modal-overlay" onClick={handleOutsideClick}>
      <div className="edit-modal-content">
        <div className="edit-modal-header">
          <h2>Edit Consumable Item</h2>
          <button className="close-btn" onClick={onClose}>×</button>
        </div>
        
        {error && <div className="error-message">{error}</div>}
        
        <form onSubmit={handleSubmit} className="edit-form">
          <div className="form-row">
            <div className="form-group">
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

            <div className="form-group">
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
          </div>

          <div className="form-row">
            <div className="form-group">
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

            <div className="form-group">
              <label htmlFor="StorageLocation">Storage Location</label>
              <input
                type="text"
                id="StorageLocation"
                name="StorageLocation"
                value={formData.StorageLocation}
                onChange={handleChange}
              />
            </div>
          </div>

          <div className="form-row">
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

            <div className="form-group">
              <label htmlFor="MinimumQuantity">Minimum Quantity</label>
              <input
                type="number"
                id="MinimumQuantity"
                name="MinimumQuantity"
                value={formData.MinimumQuantity}
                onChange={handleChange}
                min="0"
                required
              />
            </div>
          </div>

          <div className="form-group">
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

          <div className="form-actions">
            <button 
              type="button" 
              className="cancel-btn"
              onClick={onClose}
              disabled={loading}
            >
              Cancel
            </button>
            <button 
              type="submit" 
              className="submit-btn"
              disabled={loading}
            >
              {loading ? 'Updating...' : 'Update Item'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default ConsumableEditModal; 