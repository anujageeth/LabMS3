import React, { useState, useEffect, useCallback } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";
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
  Chip,
  CircularProgress,
} from "@mui/material";
import EditIcon from "@mui/icons-material/Edit";
import DeleteIcon from "@mui/icons-material/Delete";
import "../components/tableModal2.css";
import SideNavigation from "./SideNavigation";
import UserDetails from "./UserDetails";
import "./PageButtons.css"
import { hasFullAccess, hasInventoryViewAccess, hasBookingAccess,hasEquipmentManagementAccess } from '../utils/rolePermissions';


const getCurrentUser = () => {
  return JSON.parse(localStorage.getItem("user"));
};

const EquipmentTable = ({ onRefresh, refresh }) => {
  const navigate = useNavigate();
  const [equipment, setEquipment] = useState([]);
  const [loading, setLoading] = useState(false);
  const [selected, setSelected] = useState([]);
  const [page, setPage] = useState(0);
  const [rowsPerPage, setRowsPerPage] = useState(5);
  const [totalItems, setTotalItems] = useState(0);
  const [sortBy, setSortBy] = useState('Name');
  const [sortOrder, setSortOrder] = useState('asc');
  const [editModalOpen, setEditModalOpen] = useState(false);
  const [deleteModalOpen, setDeleteModalOpen] = useState(false);
  const [editData, setEditData] = useState(null);
  const [filters, setFilters] = useState({
    search: '',
    category: '',
    lab: '',
    brand: '',
    condition: ''
  });

  const currentUser = getCurrentUser();
  const userRole = currentUser?.Role || "";

  // Fetch equipment with pagination and filters
  const fetchEquipment = useCallback(async () => {
    try {
      setLoading(true);
      const token = localStorage.getItem("token");
      if (!token) {
        navigate("/login");
        return;
      }

      const queryParams = new URLSearchParams({
        page: page + 1,
        limit: rowsPerPage,
        sortBy,
        sortOrder,
        ...(filters.search && { search: filters.search }),
        ...(filters.category && { Category: filters.category }),
        ...(filters.lab && { Lab: filters.lab }),
        ...(filters.brand && { Brand: filters.brand }),
        ...(filters.condition && { condition: filters.condition })
      });

      const response = await axios.get(
        `http://10.50.227.93:3001/api/equipmentImage?${queryParams}`,
        {
          headers: { Authorization: `Bearer ${token}` }
        }
      );

      if (response.data && response.data.equipment) {
        setEquipment(response.data.equipment);
        setTotalItems(response.data.pagination.total);
      } else {
        console.error("Invalid response format:", response.data);
      }
    } catch (error) {
      console.error("Error fetching equipment:", error);
      if (error.response?.status === 403) {
        alert("Your session has expired. Please log in again.");
        localStorage.removeItem("token");
        navigate("/login");
      }
    } finally {
      setLoading(false);
    }
  }, [navigate, page, rowsPerPage, sortBy, sortOrder, filters]);

  useEffect(() => {
    fetchEquipment();
    return () => {
      setEquipment([]);
      setSelected([]);
    };
  }, [fetchEquipment, refresh]);

  // Handle sort
  const handleSort = (property) => {
    const isAsc = sortBy === property && sortOrder === 'asc';
    setSortOrder(isAsc ? 'desc' : 'asc');
    setSortBy(property);
  };

  // Render sort label
  const renderSortLabel = (id, label) => (
    <TableCell>
      <TableSortLabel
        active={sortBy === id}
        direction={sortBy === id ? sortOrder : 'asc'}
        onClick={() => handleSort(id)}
      >
        <b>{label}</b>
      </TableSortLabel>
    </TableCell>
  );

  // Handle filter changes
  const handleFilterChange = (field, value) => {
    setFilters(prev => ({ ...prev, [field]: value }));
    setPage(0); // Reset to first page when filters change
  };

  const handleClick = (event, row) => {
    const selectedIndex = selected.indexOf(row._id);
    let newSelected = [];

    if (selectedIndex === -1) {
      newSelected = newSelected.concat(selected, row._id);
    } else if (selectedIndex === 0) {
      newSelected = newSelected.concat(selected.slice(1));
    } else if (selectedIndex === selected.length - 1) {
      newSelected = newSelected.concat(selected.slice(0, -1));
    } else if (selectedIndex > 0) {
      newSelected = newSelected.concat(
        selected.slice(0, selectedIndex),
        selected.slice(selectedIndex + 1)
      );
    }
    setSelected(newSelected);
  };

  const handleEdit = () => {
    const itemToEdit = equipment.find((item) => item._id === selected[0]);
    setEditData(itemToEdit);
    setEditModalOpen(true);
  };

  const closeEditModal = () => {
    setEditModalOpen(false);
    setEditData(null);
  };

  const closeDeleteModal = () => {
    setDeleteModalOpen(false);
  }

  const handleUpdate = async () => {
    try {
      const token = localStorage.getItem("token");
      if (!token) {
        navigate("/login");
        return;
      }

      // Set availability based on condition
      const updatedData = {
        ...editData,
        Availability: editData.condition === 'damaged' ? false : true
      };

      await axios.put(
        `http://10.50.227.93:3001/api/equipmentImage/${editData._id}`,
        updatedData,
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );

      // Update local state
      setEquipment((prev) =>
        prev.map((item) =>
          item._id === editData._id ? { ...item, ...updatedData } : item
        )
      );
      onRefresh();
      closeEditModal();
    } catch (error) {
      if (error.response?.status === 403) {
        alert("Your session has expired. Please log in again.");
        localStorage.removeItem("token");
        navigate("/login");
      } else if (error.response?.status === 408) {
        alert("Administrators only");
      } else {
        console.error("Error updating equipment:", error);
      }
    }
  };

  const handleDelete = async () => {
    try {
      const token = localStorage.getItem("token");
      if (!token) {
        navigate("/login"); // Redirect if no token is found
        return;
      }
      await Promise.all(
        selected.map((id) =>
          axios.delete(`http://10.50.227.93:3001/api/equipmentImage/${id}`, {
            headers: {
              Authorization: `Bearer ${token}`,
            },
          })
        )
      );
      setSelected([]); // Clear selection after delete
      // Refresh equipment data
      setEquipment((prev) =>
        prev.filter((item) => !selected.includes(item._id))
      );
      onRefresh();
    } catch (error) {
      if (error.response?.status === 403) {
        console.log("Token expired. Redirecting to login.");
        alert("Your session has expired. Please log in again.");
        localStorage.removeItem("token");
        navigate("/login");
      } else if (error.response?.status === 408) {
        console.log("You have no access");
        alert("Anministrators only");
      } else {
        console.error(
          "Error deleting equipment:",
          error.response?.data || error
        );
      }
    }
  };

  const isSelected = (id) => id && selected.indexOf(id) !== -1;

  return (
    <div className="dashPage">
      <div className="gridBox">
        <SideNavigation />
        <div className="rightPanel">
          <UserDetails />
          
            
          <div className="dashBoxer">
            <div className="dashBox">
              <div className="dashName">
                <h1 className="pageTitle">Inventory Management</h1>
              </div>

              <div className="addNsearch">
                <div className="pageBtnDiv">
                  {hasFullAccess(userRole) && (
                    <button className="pageBtn" onClick={() => navigate("/additem")}>Add new +</button>
                  )}
                  <button className="pageBtn" onClick={() => navigate("/list2")}>List View</button>
                  <button className="pageBtn" onClick={() => navigate("/equipment-stats")}>Statistics</button>
                </div>
                
                <div className="pageBtnDiv">
                  <div className="searchContainer">
                  <input
                    type="search"
                    placeholder="Search by Name..."
                    className="searchInput"
                    id="searchList"
                    value={filters.search}
                    onChange={(e) => handleFilterChange('search', e.target.value)}
                  />
                  </div>
                </div>
                
                <div className="pageBtnDiv">
                  <select 
                    id="categoryFilter"
                    value={filters.condition} 
                    onChange={(e) => handleFilterChange('condition', e.target.value)}
                  >
                    <option value="">All Conditions</option>
                    <option value="good">Good</option>
                    <option value="damaged">Damaged</option>
                  </select>

                  {/* Existing filters */}
                  <select id="categoryFilter" value={filters.category} onChange={(e) => handleFilterChange('category', e.target.value)}>
                    <option value="">All Categories</option>
                    {Array.from(new Set(equipment.map((item) => item.Category))).map((category) => (
                      <option key={category} value={category}>
                        {category}
                      </option>
                    ))}
                  </select>

                  

                  {/*<select id="categoryFilter" value={filters.brand} onChange={(e) => handleFilterChange('brand', e.target.value)}>
                    <option value="">All Brands</option>
                    {Array.from(new Set(equipment.map((item) => item.Brand))).map((brand) => (
                      <option key={brand} value={brand}>
                        {brand}
                      </option>
                    ))}
                  </select>*/}

                  <select id="categoryFilter" value={filters.lab} onChange={(e) => handleFilterChange('lab', e.target.value)}>
                    <option value="">All Labs</option>
                    {Array.from(new Set(equipment.map((item) => item.Lab))).map((lab) => (
                      <option key={lab} value={lab}>
                        {lab}
                      </option>
                    ))}
                  </select>

                </div>
              </div>
            </div>
            
            
            <div className="dataTableBox">
              <Box sx={{ width: "100%" }}>
                <Paper sx={{ width: "100%", mb: 2 }}>
                  {/* Show Edit and Delete Buttons based on selection */}
                  <Box
                    sx={{ display: "flex", justifyContent: "flex-end", p: 2 }}
                  >
                    <Tooltip title="Edit">
                      <IconButton
                        onClick={handleEdit}
                        disabled={selected.length !== 1}
                        className={
                          selected.length === 1
                            ? "icon-button-enabled"
                            : "icon-button-disabled"
                        }
                      >
                        <EditIcon className="iconButtonLogo" />
                      </IconButton>
                    </Tooltip>
                    <Tooltip title="Delete">
                      <IconButton
                        onClick={() => setDeleteModalOpen(true)}
                        disabled={selected.length === 0}
                        className={
                          selected.length > 0
                            ? "icon-button-enabled"
                            : "icon-button-disabled"
                        }
                      >
                        <DeleteIcon className="iconButtonLogo" />
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
                                selected.length > 0 &&
                                selected.length < equipment.length
                              }
                              checked={
                                equipment.length > 0 &&
                                selected.length === equipment.length
                              }
                              onChange={(event) =>
                                setSelected(
                                  event.target.checked
                                    ? equipment.map((n) => n._id)
                                    : []
                                )
                              }
                            />
                          </TableCell>
                          {renderSortLabel('Name', 'Name')}
                          {renderSortLabel('Serial', 'Serial No')}
                          {renderSortLabel('Brand', 'Brand')}
                          {renderSortLabel('Category', 'Category')}
                          {renderSortLabel('Lab', 'LAB')}
                          {renderSortLabel('condition', 'Condition')}
                          {renderSortLabel('Availability', 'Availability')}
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
                          equipment.map((row) => {
                            const isItemSelected = isSelected(row._id);
                            return (
                              <TableRow
                                hover
                                onClick={(event) => handleClick(event, row)}
                                role="checkbox"
                                aria-checked={isItemSelected}
                                tabIndex={-1}
                                key={row._id}
                                selected={isItemSelected}
                              >
                                <TableCell padding="checkbox">
                                  <Checkbox checked={isItemSelected} />
                                </TableCell>
                                <TableCell>{row.Name}</TableCell>
                                <TableCell>{row.Serial}</TableCell>
                                <TableCell>{row.Brand}</TableCell>
                                <TableCell>{row.Category}</TableCell>
                                <TableCell>{row.Lab}</TableCell>
                                <TableCell>
                                  <Chip 
                                    label={row.condition || 'good'} 
                                    color={row.condition === 'damaged' ? 'error' : 'success'}
                                    size="small"
                                  />
                                </TableCell>
                                <TableCell>
                                  <Chip 
                                    label={row.Availability ? "Available" : "Unavailable"}
                                    color={row.Availability ? "success" : "error"}
                                    size="small"
                                  />
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
                    count={totalItems}
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

                {/* Edit Modal */}
                {editModalOpen && (
                  <div className="listViewModal2">
                    <div className="listViewModal-content2">
                      <h2>Edit Equipment</h2>
                      <input
                        className="listViewModalInput2"
                        type="text"
                        value={editData.Name}
                        onChange={(e) =>
                          setEditData({ ...editData, Name: e.target.value })
                        }
                        placeholder="Name"
                      />
                      
                      <input
                        className="listViewModalInput2"
                        type="text"
                        value={editData.Category}
                        onChange={(e) =>
                          setEditData({ ...editData, Category: e.target.value })
                        }
                        placeholder="Category"
                      />

                      <input
                        className="listViewModalInput2"
                        type="text"
                        value={editData.Brand}
                        onChange={(e) =>
                          setEditData({ ...editData, Brand: e.target.value })
                        }
                        placeholder="Category"
                      />

                      <input
                        className="listViewModalInput2"
                        type="text"
                        value={editData.Serial}
                        onChange={(e) =>
                          setEditData({ ...editData, Serial: e.target.value })
                        }
                        placeholder="Category"
                      />

                     <select 
                        className="listViewModalInput2" 
                        id="listViewModalInput2Select"
                        name="Lab" 
                        value={editData.Lab} 
                        onChange={(e) =>
                          setEditData({ ...editData, Lab: e.target.value })
                        }
                      >
                        <option value="Electrical Machines Lab">Electrical Machines Lab</option>
                        <option value="Communication Lab">Communication Lab</option>
                        <option value="Measurements Lab">Measurements Lab</option>
                        <option value="High Voltage Lab">High Voltage Lab</option>
                      </select>

                      <select 
                        className="listViewModalInput2" 
                        name="condition" 
                        value={editData.condition} 
                        onChange={(e) =>
                          setEditData({ ...editData, condition: e.target.value })
                        }
                      >
                        
                        <option value="good">Good</option>
                        <option value="damaged">Damaged</option>
                      </select>

                      <button className="listViewBtn3" onClick={handleUpdate}>
                        Save
                      </button>

                      <button 
                        className="listViewBtn3"
                        id="deleteListBtn"
                        onClick={() => setDeleteModalOpen(true)}
                        >
                          Delete
                        </button>
                      <button
                        className="listViewBtn3"
                        id="closeListBtn"
                        onClick={closeEditModal}
                      >
                        Cancel
                      </button>
                    </div>
                  </div>
                )}

                {deleteModalOpen &&
                  <div className="listViewModal2">
                    <div className="listViewModal-content2" id="deleteConfirmBox">
                    <h2>Delete Equipment</h2>
                    <p>
                      Are you sure you want to delete?<br />
                      This action cannot be undone.
                    </p>
                    <button
                      className="listViewBtn3"
                      id="deleteListBtn"
                      onClick={() => {
                        handleDelete();
                        closeDeleteModal();
                        closeEditModal();
                      }}
                    >
                      Confirm
                    </button>

                    <button className="listViewBtn3" id="closeListBtn" onClick={closeDeleteModal}>Cancel</button>
                    </div>
                  </div>
                }
              </Box>

              {/* {hasFullAccess(userRole) && (
                <button 
                  className="add-consumable-button"
                  onClick={() => navigate("/additem")}
                  title="Add new consumable item"
                >
                  <span className="plus-icon">+</span>
                </button>
              )} */}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default EquipmentTable;
