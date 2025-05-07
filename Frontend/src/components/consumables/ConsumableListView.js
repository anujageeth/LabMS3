import React from 'react';
import { useNavigate } from 'react-router-dom';
import '../../styles/ConsumableListView.css';

const ConsumableListView = ({ items, onPageChange, currentPage, totalPages }) => {
  const navigate = useNavigate();

  const getStatusColor = (status) => {
    switch (status) {
      case 'in-stock':
        return 'status-in-stock';
      case 'low-stock':
        return 'status-low-stock';
      case 'out-of-stock':
        return 'status-out-of-stock';
      default:
        return '';
    }
  };

  return (
    <div className="consumable-list">
      <div className="consumable-list-items">
        {items.map((item) => (
          <div 
            key={item._id} 
            className="consumable-list-item"
            onClick={() => navigate(`/consumables/${item._id}`)}
          >
            <div className="item-details">
              <h3>{item.Name}</h3>
              <p className="category">{item.Category}</p>
              <div className="item-meta">
                <span className={`status ${getStatusColor(item.Status)}`}>
                  {item.Status}
                </span>
                <span className="quantity">
                  {item.Quantity} {item.Unit}
                </span>
                <span className="location">
                  {item.StorageLocation}
                </span>
              </div>
            </div>
          </div>
        ))}
      </div>

      <div className="pagination">
        <button
          onClick={() => onPageChange(currentPage - 1)}
          disabled={currentPage === 1}
        >
          Previous
        </button>
        <span>
          Page {currentPage} of {totalPages}
        </span>
        <button
          onClick={() => onPageChange(currentPage + 1)}
          disabled={currentPage === totalPages}
        >
          Next
        </button>
      </div>
    </div>
  );
};

export default ConsumableListView; 