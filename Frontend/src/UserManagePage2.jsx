import React, { useState, useEffect } from "react";
import {
    getUserData
} from "../src/services/userDataService";
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
  Tooltip
} from "@mui/material";
import EditIcon from "@mui/icons-material/Edit";
import DeleteIcon from "@mui/icons-material/Delete";
import "./components/tableModal2.css";

import SideNavigation from "./components/SideNavigation";

import UserDetails from "./components/UserDetails";

const UserManagePage2 = ({ onRefresh, refresh }) => {
    const [userData, setUserData] = useState([]);
    const [filteredUser, setFilteredUser] = useState([]); // State for filtered equipment
    const [selected, setSelected] = useState("");
    const [dense, setDense] = useState(true);
    const [page, setPage] = useState(0);
    const [rowsPerPage, setRowsPerPage] = useState(5);
    const [editModalOpen, setEditModalOpen] = useState(false);
    const [editData, setEditData] = useState(null);
    const [selectedUser, setSelectedUser] = useState(""); // State to track selected category
    const [searchTerm, setSearchTerm] = useState(""); // State for search input
    const [deleteModalOpen, setDeleteModalOpen] = useState(false);
    const [isSuccessPopupOpen, setIsSuccessPopupOpen] = useState(false);
    const [isDeleteSuccessPopupOpen, setIsDeleteSuccessPopupOpen] = useState(false);

    const [users, setUsers] = useState([]); // Store all users
    const [filteredUsers, setFilteredUsers] = useState([]);
    const [form, setForm] = useState({
        equipmentId: "",
        username: "",
        quantity: 1,
        action: "checkout",
    });
    //const navigate = useNavigate();

    useEffect(() => {
        fetchUsersList();
      }, [userData]);

    const fetchUsersList = async () => {
        try {
        const data = await getUserData();
        setUserData(data); // Store the user data in the `records` state
        } catch (error) {
        console.error("Error fetching user data:", error);
        }
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

    const selectedRoles = categoryId.split(",");
    const filtered = users.filter(user => selectedRoles.includes(user.role));
    setFilteredUsers(filtered);
    };

    // Search handler
    const handleSearch = (event) => {
    setSearchTerm(event.target.value);
    };

    // Handle selection of rows
    const handleClick = (event, record) => {
      const selectedIndex = selected.indexOf(record._id);
      let newSelected = [];
  
      if (selectedIndex === -1) {
        newSelected = newSelected.concat(selected, record._id);
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

    // const isSelectedRow = (id) => selected === id;


    const isSelected = (id) => id && selected.indexOf(id) !== -1;

    const handleChangePage = (event, newPage) => {
    setPage(newPage);
    };

    const handleChangeRowsPerPage = (event) => {
    setRowsPerPage(parseInt(event.target.value, 10));
    setPage(0);
    };


    const navigate = useNavigate();

  const handleAddUserClick = () => {
    navigate("/adduser");
  };

  const handleBulkUploadClick = () => {
    navigate("/addbulkuser");
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
      setIsSuccessPopupOpen(true);
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
      const updatedUserData = userData.filter((item) => !selected.includes(item._id));
      setUserData([...updatedUserData]); 
      setFilteredUser([...updatedUserData]); // Force update filtered list
      setSelected([]);
      setIsDeleteSuccessPopupOpen(true);
      closeDeleteModal();
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
          "Error deleting equipment:",
          error.response?.data || error
        );
      }
    }
  };

  const closeDeleteModal = () => {
    setDeleteModalOpen(false);
  }

  const roleMapping = {
    hod: "Head of The Department",
    technical_officer: "T.O.",
    lecturer: "Lecturer",
    instructor: "Instructor",
    student: "Student"
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
                    onClick={handleBulkUploadClick}
                  >
                    <b>Upload a bulk</b>
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
                    {/*<option value="lecturer,instructor">Academic</option>*/}
                    <option value="lecturer">Lecturers</option>
                    <option value="instructor">Instructors</option>
                    <option value="hod">HOD</option>
                    <option value="technical officer">TO</option>
                    <option value="student">Student</option>
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
                                    <Checkbox checked={isItemSelected} />
                                  </TableCell>
                                  <TableCell>{record.Title} {record.FirstName} {record.LastName}</TableCell>
                                  <TableCell>{roleMapping[record.Role] || record.Role}</TableCell>
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

                  {deleteModalOpen &&
                    <div className="equipment-popup">
                      <div className="listViewModal-content2" id="deleteBox">
                      <h2>Delete User</h2>
                      <button
                        className="listViewBtn3"
                        id="deleteListBtn"
                        onClick={() => {
                          handleDelete();
                          closeDeleteModal();
                          
                        }}
                      >
                        Confirm
                      </button>

                      <button className="listViewBtn3" id="closeListBtn" onClick={closeDeleteModal}>Cancel</button>
                      </div>
                    </div>
                  }

                  {/* Edit Modal */}
                  {editModalOpen && (
                    <div className="listViewModal2">
                      <div className="listViewModal-content2">
                        <h2>Edit User</h2>
                        <select
                          className="listViewModalInput2"
                          id="listViewModalInput2Select"
                          name="Title" 
                          value={editData.Title}
                          onChange={(e) =>
                            setEditData({ ...editData, Title: e.target.value })
                          }
                          placeholder="Title"
                        >
                          <option value="Mr">Mr</option>
                          <option value="Mrs">Mrs</option>
                          <option value="Dr">Dr</option>
                        </select>
                        <input
                          className="listViewModalInput2"
                          type="text"
                          value={editData.FirstName}
                          onChange={(e) =>
                            setEditData({ ...editData, FirstName: e.target.value })
                          }
                          placeholder="Name"
                        />
                        <input
                          className="listViewModalInput2"
                          type="text"
                          value={editData.LastName}
                          onChange={(e) =>
                            setEditData({ ...editData, LastName: e.target.value })
                          }
                          placeholder="Name"
                        />
                        <input
                          className="listViewModalInput2"
                          type="text"
                          value={editData.Email}
                          onChange={(e) =>
                            setEditData({ ...editData, Email: e.target.value })
                          }
                          placeholder="Email"
                        />
                        {/*<select
                          className="listViewModalInput2"
                          id="listViewModalInput2Select"
                          name="Role" 
                          value={editData.Role}
                          onChange={(e) =>
                            setEditData({ ...editData, Role: e.target.value })
                          }
                          placeholder="Title"
                        >
                          <option value="lecturer">Lecturer</option>
                          <option value="instructor">Instructor</option>
                          <option value="hod">Head of Department</option>
                          <option value="technical officer">Technical Officer</option>
                          <option value="student">Student</option>
                        </select>*/}
                        
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
              </Box>
            </div>
            

          </div>
        </div>
      </div>

      {/*
      <SidePopup
        type="success"
        title="Successful"
        message="Updated existing user"
        isOpen={isSuccessPopupOpen}
        onClose={() => setIsSuccessPopupOpen(false)}
        duration={3000} // Optional: customize duration in milliseconds
      />

      <SidePopup
        type="success"
        title="Successful"
        message="Deleted existing user"
        isOpen={isDeleteSuccessPopupOpen}
        onClose={() => setIsDeleteSuccessPopupOpen(false)}
        duration={3000} // Optional: customize duration in milliseconds
      />
      */}

    </div>

    
  );
};

export default UserManagePage2;
