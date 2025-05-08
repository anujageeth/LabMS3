import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import ConsumableEditModal from './ConsumableEditModal';
import { deleteConsumable } from '../../services/consumableService';
import '../../styles/ConsumableListView.css';

const ConsumableListView = ({ items, onPageChange, currentPage, totalPages, onRefresh }) => {
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
    <div className="consumable-container">
      <div className="consumable-list">
        <div className="consumable-list-items">
          {items.map((item) => (
            <div 
              key={item._id} 
              className="consumable-list-item"
              //onClick={() => navigate(`/consumables/${item._id}`)}
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
                <button className="listViewBtn2" onClick={() => handleEditClick(item)}>
                  Update
                </button>
                <button className="listViewBtn2" id="deleteListBtn" onClick={() => {
                  setSelectedItems([item._id]); // Set this one item as selected
                  setIsDeleteConfirmOpen(true); // Open delete modal
                }}>
                  Delete
                </button>
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

      {isDeleteConfirmOpen && (
        <div className="delete-confirm-modal">
          <div className="delete-modal-content">
            <h3>Confirm Deletion</h3>
            <p>Are you sure you want to delete {selectedItems.length} item(s)?</p>
            <p>This action cannot be undone.</p>
            <div className="modal-actions">
              
              <button 
                className="delete-btn" 
                onClick={handleConfirmDelete}
                disabled={loading}
              >
                {loading ? 'Deleting...' : 'Delete'}
              </button>
              <button 
                className="cancel-btn" 
                onClick={handleCancelDelete}
                disabled={loading}
              >
                Cancel
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
    </div>
  );
};

export default ConsumableListView; 