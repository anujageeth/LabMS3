import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { deleteConsumable } from '../../services/consumableService';
import '../../styles/ConsumableTableView.css';
import ConsumableEditModal from './ConsumableEditModal';

const ConsumableTableView = ({ items, onPageChange, currentPage, totalPages, onRefresh }) => {
  const navigate = useNavigate();
  const [selectedItems, setSelectedItems] = useState([]);
  const [isDeleteConfirmOpen, setIsDeleteConfirmOpen] = useState(false);
  const [isEditModalOpen, setIsEditModalOpen] = useState(false);
  const [itemToEdit, setItemToEdit] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

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

  const handleSelectItem = (id) => {
    setSelectedItems(prev => {
      if (prev.includes(id)) {
        return prev.filter(itemId => itemId !== id);
      } else {
        return [...prev, id];
      }
    });
  };

  const handleSelectAll = () => {
    if (selectedItems.length === items.length) {
      setSelectedItems([]);
    } else {
      setSelectedItems(items.map(item => item._id));
    }
  };

  const handleEditClick = (item) => {
    setItemToEdit(item);
    setIsEditModalOpen(true);
  };

  const handleCloseEditModal = () => {
    setIsEditModalOpen(false);
    setItemToEdit(null);
  };

  const handleDeleteClick = () => {
    if (selectedItems.length > 0) {
      setIsDeleteConfirmOpen(true);
    }
  };

  const handleCancelDelete = () => {
    setIsDeleteConfirmOpen(false);
  };

  const handleConfirmDelete = async () => {
    setLoading(true);
    setError(null);
    
    try {
      // Process each deletion sequentially
      for (const id of selectedItems) {
        await deleteConsumable(id);
      }
      
      setSelectedItems([]);
      setIsDeleteConfirmOpen(false);
      if (onRefresh) onRefresh();
      
    } catch (err) {
      setError('Failed to delete selected items. Please try again.');
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  const handleUpdateSuccess = () => {
    setIsEditModalOpen(false);
    setItemToEdit(null);
    if (onRefresh) onRefresh();
  };

  return (
    <div className="consumable-table">
      {error && <div className="error-message">{error}</div>}
      
      {isDeleteConfirmOpen && (
        <div className="delete-confirm-modal">
          <div className="delete-modal-content">
            <h3>Confirm Deletion</h3>
            <p>Are you sure you want to delete {selectedItems.length} item(s)?</p>
            <p>This action cannot be undone.</p>
            <div className="modal-actions">
              <button 
                className="cancel-btn" 
                onClick={handleCancelDelete}
                disabled={loading}
              >
                Cancel
              </button>
              <button 
                className="delete-btn" 
                onClick={handleConfirmDelete}
                disabled={loading}
              >
                {loading ? 'Deleting...' : 'Delete'}
              </button>
            </div>
          </div>
        </div>
      )}

      {isEditModalOpen && itemToEdit && (
        <ConsumableEditModal 
          item={itemToEdit}
          onClose={handleCloseEditModal}
          onUpdateSuccess={handleUpdateSuccess}
        />
      )}

      <div className="table-actions">
        <div className="selected-count">
          {selectedItems.length > 0 && 
            <span>{selectedItems.length} item(s) selected</span>
          }
        </div>
        <div className="action-buttons">
          <button 
            className="edit-btn" 
            onClick={() => selectedItems.length === 1 && handleEditClick(items.find(item => item._id === selectedItems[0]))}
            disabled={selectedItems.length !== 1}
          >
            Edit
          </button>
          <button 
            className="delete-btn" 
            onClick={handleDeleteClick}
            disabled={selectedItems.length === 0}
          >
            Delete
          </button>
        </div>
      </div>

      <table>
        <thead>
          <tr>
            <th>
              <input 
                type="checkbox" 
                onChange={handleSelectAll}
                checked={selectedItems.length === items.length && items.length > 0}
              />
            </th>
            <th>Name</th>
            <th>Category</th>
            <th>Lab</th>
            <th>Quantity</th>
            <th>Unit</th>
            <th>Status</th>
            <th>Storage Location</th>
            <th>Last Restocked</th>
            <th>Actions</th>
          </tr>
        </thead>
        <tbody>
          {items.map((item) => (
            <tr 
              key={item._id}
              className={`clickable-row ${selectedItems.includes(item._id) ? 'selected-row' : ''}`}
            >
              <td>
                <input 
                  type="checkbox" 
                  checked={selectedItems.includes(item._id)}
                  onChange={() => handleSelectItem(item._id)}
                  onClick={(e) => e.stopPropagation()}
                />
              </td>
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
              <td className="action-cell">
                <button 
                  className="row-edit-btn" 
                  onClick={(e) => {
                    e.stopPropagation();
                    handleEditClick(item);
                  }}
                >
                  Edit
                </button>
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