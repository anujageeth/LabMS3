import React from 'react';
import { useNavigate } from 'react-router-dom';
import '../styles/AddConsumableButton.css';

const AddConsumableButton = () => {
  const navigate = useNavigate();

  const handleClick = () => {
    navigate('/add-consumable');
  };

  return (
    <button 
      className="add-consumable-btn"
      onClick={handleClick}
    >
      <span className="icon">+</span>
      <span className="text">Add Consumable Item</span>
    </button>
  );
};

export default AddConsumableButton; 