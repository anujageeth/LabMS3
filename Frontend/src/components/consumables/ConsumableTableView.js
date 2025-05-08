import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { deleteConsumable } from '../../services/consumableService';
import {
  Box,
  Paper,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TablePagination,
  TableRow,
  TableSortLabel,
  Checkbox,
  IconButton,
  Tooltip,
  FormControlLabel,
  Switch,
  TextField,
  Select,
  MenuItem,
  FormControl,
  InputLabel,
  Chip,
  CircularProgress,
} from "@mui/material";
import EditIcon from "@mui/icons-material/Edit";
import DeleteIcon from "@mui/icons-material/Delete";

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

  const [selected, setSelected] = useState("");
  const [dense, setDense] = useState(true);
  const [page, setPage] = useState(0);
  const [rowsPerPage, setRowsPerPage] = useState(4);

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

  const isSelected = (id) => id && selected.indexOf(id) !== -1;

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
    <div>
      {error && <div className="error-message">{error}</div>}
      
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

<div className="dataTableBox">
  <Box sx={{ width: "100%" }}>
    <Paper sx={{ width: "100%", mb: 2 }}>
      {/* Show Edit and Delete Buttons based on selection */}
      <Box
        sx={{ display: "flex", justifyContent: "flex-end", p: 2 }}
      >
        {/* Category Filter 
            <CategoryFilter
              className="categoryFilter"
              selectedCategory={selectedCategory}
              setSelectedCategory={setSelectedCategory}
            />*/}

        <Tooltip title="Edit">
          <IconButton
            onClick={() => selectedItems.length === 1 && handleEditClick(items.find(item => item._id === selectedItems[0]))}
            disabled={selectedItems.length !== 1}
            className={
              selectedItems.length === 1
                ? "icon-button-enabled"
                : "icon-button-disabled"
            }
          >
            <EditIcon className="iconButtonLogo" />
          </IconButton>
        </Tooltip>
        <Tooltip title="Delete">
          <IconButton
            onClick={handleDeleteClick}
            disabled={selectedItems.length === 0}
            className={
              selectedItems.length > 0
                ? "icon-button-enabled"
                : "icon-button-disabled"
            }
          >
            <DeleteIcon className="iconButtonLogo" />
            {/*<button className="tableRowEdit">Delete</button>*/}
          </IconButton>
        </Tooltip>
      </Box>
      <TableContainer>
        <Table size="small">
          <TableHead>
            <TableRow>
              <TableCell padding="checkbox">
                <Checkbox
                  indeterminate={
                    selectedItems.length === items.length &&
                    items.length > 0
                  }
                  onChange={handleSelectAll}
                  checked={selectedItems.length === items.length && items.length > 0}
                />
              </TableCell>
              <TableCell><b>Name</b></TableCell>
              <TableCell><b>Category</b></TableCell>
              <TableCell><b>Lab</b></TableCell>
              <TableCell><b>Quantity</b></TableCell>
              <TableCell><b>Unit</b></TableCell>
              <TableCell><b>Status</b></TableCell>
              <TableCell><b>Storage Location</b></TableCell>
              <TableCell><b>Last Restocked</b></TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {loading ? (
              <TableRow>
                <TableCell colSpan={8} align="center">
                  <CircularProgress />
                </TableCell>
              </TableRow>
            ) : (
              items.map((item) => {
                const isItemSelected = isSelected(item._id);
                return (
                  <TableRow
                    hover
                    role="checkbox"
                    aria-checked={isItemSelected}
                    tabIndex={-1}
                    key={item._id}
                    className={`clickable-row ${selectedItems.includes(item._id) ? 'selected-row' : ''}`}
                    selected={isItemSelected}
                  >
                    <TableCell padding="checkbox">
                      <Checkbox
                        checked={selectedItems.includes(item._id)}
                        onChange={() => handleSelectItem(item._id)}
                      />
                    </TableCell>
                    <TableCell>{item.Name}</TableCell>
                    <TableCell>{item.Category}</TableCell>
                    <TableCell>{item.Lab}</TableCell>
                    <TableCell>{item.Quantity}</TableCell>
                    <TableCell>{item.Unit}</TableCell>
                    <TableCell>
                      <Chip 
                        label={item.Status || 'good'} 
                        className={`status ${getStatusColor(item.Status)}`}
                        size="small"
                      />
                    </TableCell>
                    <TableCell>{item.StorageLocation}</TableCell>
                    <TableCell>{
                      item.LastRestocked 
                      ? new Date(item.LastRestocked).toLocaleDateString()
                      : 'N/A'}
                    </TableCell>
                    
                  </TableRow>
                );
              })
            )}
          </TableBody>
        </Table>
      </TableContainer>
      <TablePagination
        component="div"
        count={items.length}
        page={page}
        onPageChange={(e, newPage) => setPage(newPage)}
        rowsPerPage={rowsPerPage}
        onRowsPerPageChange={(e) => {
          setRowsPerPage(parseInt(e.target.value, 10));
          setPage(0);
        }}
        rowsPerPageOptions={[5]}
      />
    </Paper>

  </Box>

  <button 
    className="add-consumable-button"
    onClick={() => navigate("/additem")}
    title="Add new consumable item"
  >
    <span className="plus-icon">+</span>
  </button>
</div>

      
    </div>
  );
};

export default ConsumableTableView; 