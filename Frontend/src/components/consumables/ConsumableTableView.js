import React from 'react';
import { useNavigate } from 'react-router-dom';
import '../../styles/ConsumableTableView.css';

const ConsumableTableView = ({ items, onPageChange, currentPage, totalPages }) => {
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
    <div className="consumable-table">
      <table>
        <thead>
          <tr>
            <th>Name</th>
            <th>Category</th>
            <th>Lab</th>
            <th>Quantity</th>
            <th>Unit</th>
            <th>Status</th>
            <th>Storage Location</th>
            <th>Last Restocked</th>
          </tr>
        </thead>
        <tbody>
          {items.map((item) => (
            <tr 
              key={item._id}
              onClick={() => navigate(`/consumables/${item._id}`)}
              className="clickable-row"
            >
              <td>{item.Name}</td>
              <td>{item.Category}</td>
              <td>{item.Lab}</td>
              <td>{item.Quantity}</td>
              <td>{item.Unit}</td>
              <td>
                <span className={`status ${getStatusColor(item.Status)}`}>
                  {item.Status}
                </span>
              </td>
              <td>{item.StorageLocation}</td>
              <td>
                {item.LastRestocked 
                  ? new Date(item.LastRestocked).toLocaleDateString()
                  : 'N/A'}
              </td>
            </tr>
          ))}
        </tbody>
      </table>

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

export default ConsumableTableView; 