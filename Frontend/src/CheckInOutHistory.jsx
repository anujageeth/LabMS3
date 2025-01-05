import React, { useState, useEffect } from "react";
import {
    getCheckinCheckoutRecords,
    addCheckinCheckoutRecord,
} from "../src/services/checkinCheckoutService";
import { getAllEquipment } from "../src/services/equipmentService";

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
  Checkbox,
  IconButton,
  Tooltip,
  FormControlLabel,
  Switch
} from "@mui/material";
import AddIcon from '@mui/icons-material/Add';
import RemoveIcon from '@mui/icons-material/Remove';
import "./components/tableModal2.css";
import CategoryFilter from "./components/CategoryFilter"; // Import the CategoryFilter component
import CategorySelect from "./components/CategorySelect";

import SideNavigation from "./components/SideNavigation";
import UserDetails from "./components/UserDetails";

const CheckInOutHistory = ({ onRefresh, refresh }) => {
    const [equipment, setEquipment] = useState([]);
    const [filteredEquipment, setFilteredEquipment] = useState([]); // State for filtered equipment
    const [selected, setSelected] = useState("");
    const [dense, setDense] = useState(true);
    const [page, setPage] = useState(0);
    const [rowsPerPage, setRowsPerPage] = useState(5);
    const [editModalOpen, setEditModalOpen] = useState(false);
    const [editData, setEditData] = useState(null);
    const [categories, setCategories] = useState([]); // State for category options
    const [selectedCategory, setSelectedCategory] = useState(""); // State to track selected category
    const [searchTerm, setSearchTerm] = useState(""); // State for search input
    
    const [records, setRecords] = useState([]);
    const [equipmentList, setEquipmentList] = useState([]);
    const [form, setForm] = useState({
        equipmentId: "",
        username: "",
        quantity: 1,
        action: "checkout",
    });

    useEffect(() => {
        fetchRecords();
        fetchEquipmentList();
      }, []);

    const fetchRecords = async () => {
        const data = await getCheckinCheckoutRecords();
        setRecords(data);
    };

    const fetchEquipmentList = async () => {
    const data = await getAllEquipment();
    setEquipmentList(data);
    };

    const handleSubmit = async (e) => {
    e.preventDefault();
    await addCheckinCheckoutRecord(form);
    fetchRecords();
    };

    const handleInputChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
    };

    useEffect(() => {
        let filtered = equipment;
    
        // Apply category filter
        if (selectedCategory) {
          filtered = filtered.filter(item => item.Category._id === selectedCategory);
        }
    
        // Apply search term filter
        if (searchTerm) {
          filtered = filtered.filter(item =>
            item.Name.toLowerCase().includes(searchTerm.toLowerCase()) ||
            item.Lab.toLowerCase().includes(searchTerm.toLowerCase())
          );
        }
    
        setFilteredEquipment(filtered);
      }, [selectedCategory, searchTerm, equipment]);
    
    const handleCategoryFilter = (categoryId) => {
    setSelectedCategory(categoryId);
    };

    // Search handler
    const handleSearch = (event) => {
    setSearchTerm(event.target.value);
    };

    // Handle selection of rows
    const handleClick = (event, row) => {
    setSelected((prevSelected) => (prevSelected === row._id ? "" : row._id));
    };

    const isSelectedRow = (id) => selected === id;

    // Open edit modal
    const handleEdit = () => {
    const itemToEdit = equipment.find((item) => item._id === selected[0]);
    setEditData(itemToEdit);
    setEditModalOpen(true);
    };

    // Close modal
    const closeEditModal = () => {
    setEditModalOpen(false);
    setEditData(null);
    };

    // Handle update action
    const handleUpdate = async () => {
    try {
        await axios.put(
        `http://localhost:3001/api/equipmentImage/${editData._id}`,
        editData
        );
        // Refresh after update
        setEquipment((prev) =>
        prev.map((item) =>
            item._id === editData._id ? { ...item, ...editData } : item
        )
        );
        onRefresh();
        closeEditModal();
    } catch (error) {
        console.error("Error updating equipment:", error);
    }
    };

    const handleDelete = async () => {
    try {
        await Promise.all(
        selected.map((id) =>
            axios.delete(`http://localhost:3001/api/equipmentImage/${id}`)
        )
        );
        setSelected([]); // Clear selection after delete
        // Refresh equipment data
        setEquipment((prev) =>
        prev.filter((item) => !selected.includes(item._id))
        );
    } catch (error) {
        console.error("Error deleting equipment:", error);
    }
    };

    const isSelected = (id) => selected.indexOf(id) !== -1;

    const handleChangePage = (event, newPage) => {
    setPage(newPage);
    };

    const handleChangeRowsPerPage = (event) => {
    setRowsPerPage(parseInt(event.target.value, 10));
    setPage(0);
    };

    const handleChangeDense = (event) => {
    setDense(event.target.checked);
    };

    const navigate = useNavigate();

  const handleCheckInOutClick = () => {
    navigate("/checkinoutform");
  };

  const handleInventoryClick = () => {
    navigate("/table2");
  };


  return (
    <div className="dashPage">
      <div className="gridBox">
        <SideNavigation />
        <div className="rightPanel">
          <UserDetails />

          <div className="dashBoxer">
            <div className="dashBox">
              <div className="dashName">
                <h1 className="pageTitle">Equipment Management</h1>
              </div>

              <div className="addNsearch">
                <div className="addItem">
                  <button
                    className="addItemBtn"
                    id="addBtn"
                    onClick={handleCheckInOutClick}
                  >
                    <b>Check in / out</b>
                  </button>
                  <button
                    className="addItemBtn"
                    id="listBtn1"
                    onClick={handleInventoryClick}
                  >
                    <b>Equipment list</b>
                  </button>
                </div>

                <div className="search">
                  <div className="searchContainer">
                    <input
                      type="search"
                      placeholder=" Search..."
                      className="searchInput"
                      value={searchTerm}
                      onChange={handleSearch} // Handle search input
                    />
                  </div>
                  <select
                    id="categoryFilter"
                    value={selectedCategory}
                    onChange={(e) => handleCategoryFilter(e.target.value)}
                  >
                    <option value="">All Categories</option>
                    {categories.map((category) => (
                      <option key={category._id} value={category._id}>
                        {category.name}
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
                        
                        {/* Category Filter 
                        <CategoryFilter
                          className="categoryFilter"
                          selectedCategory={selectedCategory}
                          setSelectedCategory={setSelectedCategory}
                        />*/}

                        
                    </Box>
                      <TableContainer>
                      <Table size={dense ? "small" : "medium"}>
                          <TableHead>
                          <TableRow>
                              <TableCell padding="checkbox">
                              
                              </TableCell>
                              <TableCell><b>Equipment Name</b></TableCell>
                              <TableCell><b>Category</b></TableCell>
                              <TableCell><b>Quantity</b></TableCell>
                              <TableCell><b>Action</b></TableCell>
                              <TableCell><b>Date</b></TableCell>
                              <TableCell><b>Username</b></TableCell>
                          </TableRow>
                          </TableHead>
                          <TableBody>
                          {records
                              .slice(page * rowsPerPage, page * rowsPerPage + rowsPerPage)
                              .map((record) => {
                              const isItemSelected = isSelected(record._id);
                              return (
                                  <TableRow
                                  hover
                                  onClick={(event) => handleClick(event, record)}
                                  role="checkbox"
                                  aria-checked={isItemSelected}
                                  tabIndex={-1}
                                  key={record._id}
                                  selected={isItemSelected}
                                  >
                                  <TableCell padding="checkbox">
                                    <Checkbox
                                        color="primary"
                                        checked={isItemSelected}
                                        inputProps={{
                                        "aria-labelledby": `enhanced-table-checkbox-${record._id}`,
                                        }}
                                    />
                                  </TableCell>
                                  <TableCell>{record.equipment?.Name}</TableCell>
                                  <TableCell>{record.equipment?.Category}</TableCell>
                                  <TableCell>{record.quantity}</TableCell>
                                  <TableCell>{record.action}</TableCell>
                                  <TableCell>{new Date(record.date).toLocaleDateString()}</TableCell>
                                  <TableCell>{record.username}</TableCell>
                                  </TableRow>
                              );
                              })}
                          </TableBody>
                      </Table>
                      </TableContainer>
                      <TablePagination
                      rowsPerPageOptions={[6]}
                      component="div"
                      count={filteredEquipment.length}
                      rowsPerPage={rowsPerPage}
                      page={page}
                      onPageChange={handleChangePage}
                      onRowsPerPageChange={handleChangeRowsPerPage}
                      />
                  </Paper>

                  
              </Box>
            </div>
            

          </div>
        </div>
      </div>
    </div>

    
  );
};

export default CheckInOutHistory;
