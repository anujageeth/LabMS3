import React, { useState, useEffect } from "react";
import {
    getUserData, createUserData
} from "../src/services/userDataService";
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
import EditIcon from "@mui/icons-material/Edit";
import DeleteIcon from "@mui/icons-material/Delete";
import "./components/tableModal2.css";
import CategoryFilter from "./components/CategoryFilter"; // Import the CategoryFilter component
import CategorySelect from "./components/CategorySelect";

import SideNavigation from "./components/SideNavigation";
import UserDetails from "./components/UserDetails";

const UserManagePage2 = ({ onRefresh, refresh }) => {
    const [user, setUser] = useState([]);
    const [userData, setUserData] = useState([]);
    const [roles, setRoles] = useState([]);
    const [filteredUser, setFilteredUser] = useState([]); // State for filtered equipment
    const [filteredRole, setFilteredRole] = useState([]);
    const [selected, setSelected] = useState("");
    const [dense, setDense] = useState(true);
    const [page, setPage] = useState(0);
    const [rowsPerPage, setRowsPerPage] = useState(5);
    const [editModalOpen, setEditModalOpen] = useState(false);
    const [editData, setEditData] = useState(null);
    const [categories, setCategories] = useState([]); // State for category options
    const [selectedUser, setSelectedUser] = useState(""); // State to track selected category
    const [selectedRole, setSelectedRole] = useState("");
    const [searchTerm, setSearchTerm] = useState(""); // State for search input
    const [selectedCategory, setSelectedCategory] = useState([]);

    const [records, setRecords] = useState([]);
    const [selectedRecords, setSelectedRecords] = useState([]);
    const [usersList, setUsersList] = useState([]);
    const [form, setForm] = useState({
        equipmentId: "",
        username: "",
        quantity: 1,
        action: "checkout",
    });
    //const navigate = useNavigate();

    useEffect(() => {
        fetchUsersList();
      }, []);

    const fetchUsersList = async () => {
        try {
        const data = await getUserData();
        setUserData(data); // Store the user data in the `records` state
        } catch (error) {
        console.error("Error fetching user data:", error);
        }
    };

    const handleInputChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
    };

    useEffect(() => {
        let filtered = userData;
    
        // Apply category filter
        if (selectedUser) {
            filtered = filtered.filter(
                (item) => item.Role === selectedUser
            );
        }
    
        // Apply search term filter
        if (searchTerm) {
          filtered = filtered.filter(item =>
            item.Email.toLowerCase().includes(searchTerm.toLowerCase()) ||
            item.FirstName.toLowerCase().includes(searchTerm.toLowerCase())
          );
        }
    
        setFilteredUser(filtered);
      }, [selectedUser, searchTerm, userData]);
    
    const handleUserFilter = (categoryId) => {
    setSelectedUser(categoryId);
    };

    // Search handler
    const handleSearch = (event) => {
    setSearchTerm(event.target.value);
    };

    // Handle selection of rows
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

    const isSelectedRow = (id) => selected === id;


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

  const handleAddUserClick = () => {
    navigate("/adduser");
  };

  const handleInventoryClick = () => {
    navigate("/table2");
  };

  // Open edit modal
  const handleEdit = () => {
    const itemToEdit = userData.find((item) => item._id === selected[0]);
    setEditData(itemToEdit);
    setEditModalOpen(true);
  };

  // Close modal
  const closeEditModal = () => {
    setEditModalOpen(false);
    setEditData(null);
  };

  const handleUpdate = async () => {
    try {
      const token = localStorage.getItem("token");
      if (!token) {
        navigate("/login"); // Redirect if no token is found
        return;
      }
      await axios.put(
        `http://localhost:3001/api/users/${editData._id}`,
        editData,
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );
      // Refresh after update
      setUserData((prev) =>
        prev.map((item) =>
          item._id === editData._id ? { ...item, ...editData } : item
        )
      );
      onRefresh();
      closeEditModal();
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
          "Error updating equipment:",
          error.response?.data || error
        );
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
          axios.delete(`http://localhost:3001/api/users/${id}`, {
            headers: {
              Authorization: `Bearer ${token}`,
            },
          })
        )
      );
      setSelected([]); // Clear selection after delete
      // Refresh equipment data
      setUserData((prev) =>
        prev.filter((item) => !selected.includes(item._id))
      );
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


  return (
    <div className="dashPage">
      <div className="gridBox">
        <SideNavigation />
        <div className="rightPanel">
          <UserDetails />

          <div className="dashBoxer">
            <div className="dashBox">
              <div className="dashName">
                <h1 className="pageTitle">User Management</h1>
              </div>

              <div className="addNsearch">
                <div className="addItem">
                  <button
                    className="addItemBtn"
                    id="addBtn"
                    onClick={handleAddUserClick}
                  >
                    <b>Add user</b>
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
                    value={selectedUser}
                    onChange={(e) => handleUserFilter(e.target.value)}
                  >
                    <option value="">All user roles</option>
                    <option value="lecturer">Lecturers</option>
                    <option value="instructor">Instructors</option>
                    <option value="hod">HOD</option>
                    <option value="technical officer">TO</option>
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

                        {/*<Tooltip title="Edit">
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
                        </Tooltip>*/}
                        <Tooltip title="Delete">
                          <IconButton
                            onClick={handleDelete}
                            disabled={selected.length === 0}
                            className={
                              selected.length > 0
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
                      <Table size={dense ? "small" : "medium"}>
                          <TableHead>
                          <TableRow>
                              <TableCell padding="checkbox">
                                <Checkbox
                                  indeterminate={
                                    selected.length > 0 &&
                                    selected.length < filteredUser.length
                                  }
                                  checked={
                                    filteredUser.length > 0 &&
                                    selected.length === filteredUser.length
                                  }
                                  onChange={(event) =>
                                    setSelected(
                                      event.target.checked
                                        ? filteredUser.map((n) => n._id)
                                        : []
                                    )
                                  }
                                />
                              </TableCell>
                              <TableCell><b>Name</b></TableCell>
                              <TableCell><b>Role</b></TableCell>
                              <TableCell><b>Email</b></TableCell>
                          </TableRow>
                          </TableHead>
                          <TableBody>
                          {filteredUser
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
                                  <TableCell>{record.Title} {record.FirstName} {record.LastName}</TableCell>
                                  <TableCell>{record.Role}</TableCell>
                                  <TableCell>{record.Email}</TableCell>
                                  </TableRow>
                              );
                              })}
                          </TableBody>
                      </Table>
                      </TableContainer>
                      <TablePagination
                        rowsPerPageOptions={[6]}
                        component="div"
                        count={filteredUser.length}
                        rowsPerPage={rowsPerPage}
                        page={page}
                        onPageChange={handleChangePage}
                        onRowsPerPageChange={handleChangeRowsPerPage}
                      />
                  </Paper>

                  {/* Edit Modal */}
                  {editModalOpen && (
                    <div className="">
                      <div className="tableModal2">
                        <h3 className="tableModalH3">Edit Equipment</h3>
                        <input
                          className="tableModalInput"
                          type="text"
                          value={editData.Name}
                          onChange={(e) =>
                            setEditData({ ...editData, Name: e.target.value })
                          }
                          placeholder="Name"
                        />
                        <input
                          className="tableModalInput"
                          type="text"
                          value={editData.Lab}
                          onChange={(e) =>
                            setEditData({ ...editData, Lab: e.target.value })
                          }
                          placeholder="Lab"
                        />
                        {/*<input
                            className="tableModalInput"
                            type="text"
                            value={editData.Category}
                            onChange={(e) =>
                                setEditData({ ...editData, Category: e.target.value })
                            }
                            placeholder="Category"
                            />*/}

                        <CategorySelect
                          formData={editData.Category}
                          setFormData={setEditData}
                        />

                        <input
                          className="tableModalInput"
                          type="number"
                          value={editData.Quantity}
                          onChange={(e) =>
                            setEditData({ ...editData, Quantity: e.target.value })
                          }
                          placeholder="Quantity"
                        />
                        <button className="tableModalBtn" onClick={handleUpdate}>
                          Save
                        </button>
                        <button
                          className="tableModalBtn"
                          id="editCancelBtn"
                          onClick={closeEditModal}
                        >
                          Cancel
                        </button>
                      </div>
                    </div>
                  )}
              </Box>
            </div>
            

          </div>
        </div>
      </div>
    </div>

    
  );
};

export default UserManagePage2;
