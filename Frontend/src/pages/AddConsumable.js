import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { createConsumable } from '../services/consumableService';
import '../styles/AddConsumable.css';

const AddConsumable = () => {
  const navigate = useNavigate();
  const [formData, setFormData] = useState({
    Name: '',
    Category: '',
    Lab: '',
    Quantity: '',
    Unit: '',
    StorageLocation: '',
    Description: '',
    imageUrl: ''
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

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError(null);

    try {
      await createConsumable({
        ...formData,
        Quantity: Number(formData.Quantity),
        Status: 'in-stock'
      });
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

        <div className="form-group">
          <label htmlFor="Lab">Lab</label>
          <input
            type="text"
            id="Lab"
            name="Lab"
            value={formData.Lab}
            onChange={handleChange}
            required
          />
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
            <label htmlFor="Unit">Unit</label>
            <input
              type="text"
              id="Unit"
              name="Unit"
              value={formData.Unit}
              onChange={handleChange}
              placeholder="e.g., pieces, ml, g"
              required
            />
          </div>
        </div>

        <div className="form-group">
          <label htmlFor="StorageLocation">Storage Location</label>
          <input
            type="text"
            id="StorageLocation"
            name="StorageLocation"
            value={formData.StorageLocation}
            onChange={handleChange}
            required
          />
        </div>

        <div className="form-group">
          <label htmlFor="Description">Description</label>
          <textarea
            id="Description"
            name="Description"
            value={formData.Description}
            onChange={handleChange}
            rows="3"
          />
        </div>

        <div className="form-group">
          <label htmlFor="imageUrl">Image URL</label>
          <input
            type="url"
            id="imageUrl"
            name="imageUrl"
            value={formData.imageUrl}
            onChange={handleChange}
            placeholder="Optional"
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