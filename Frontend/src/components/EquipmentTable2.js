import React, { useState, useEffect } from "react";
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
  Switch,
} from "@mui/material";
import EditIcon from "@mui/icons-material/Edit";
import DeleteIcon from "@mui/icons-material/Delete";
import "../components/tableModal2.css";
import CategoryFilter from "./CategoryFilter"; // Import the CategoryFilter component
import CategorySelect from "./CategorySelect";

import SideNavigation from "./SideNavigation";
import UserDetails from "./UserDetails";

const EquipmentTable = ({ onRefresh, refresh }) => {
  const [equipment, setEquipment] = useState([]);
  const [filteredEquipment, setFilteredEquipment] = useState([]); // State for filtered equipment
  const [selected, setSelected] = useState([]);
  const [dense, setDense] = useState(true);
  const [page, setPage] = useState(0);
  const [rowsPerPage, setRowsPerPage] = useState(5);
  const [editModalOpen, setEditModalOpen] = useState(false);
  const [editData, setEditData] = useState(null);
  const [categories, setCategories] = useState([]); // State for category options
  const [selectedCategory, setSelectedCategory] = useState(""); // State to track selected category
  const [searchTerm, setSearchTerm] = useState(""); // State for search input
  const [selectedBrand, setSelectedBrand] = useState("");
  const [selectedLab, setSelectedLab] = useState("");

  // Fetch equipment data
  useEffect(() => {
    const fetchEquipment = async () => {
      try {
        const response = await axios.get(
          "http://localhost:3001/api/equipmentImage"
        );
        setEquipment(response.data);
        setFilteredEquipment(response.data); // Initially set filtered data to all equipment
      } catch (error) {
        console.error("Error fetching equipment:", error);
      }
    };

    const fetchCategories = async () => {
      try {
        const response = await axios.get(
          "http://localhost:3001/api/categories"
        );
        setCategories(response.data);
      } catch (error) {
        console.error("Error fetching categories:", error);
      }
    };

    fetchEquipment();
    fetchCategories();
  }, [refresh]);

  // useEffect(() => {
  //   let filtered = equipment;

  //   // Apply category filter
  //   if (selectedCategory) {
  //     filtered = filtered.filter(
  //       (item) => item.Category._id === selectedCategory
  //     );
  //   }

  //   // Apply search term filter
  //   if (searchTerm) {
  //     filtered = filtered.filter(
  //       (item) =>
  //         item.Name.toLowerCase().includes(searchTerm.toLowerCase()) ||
  //         item.Lab.toLowerCase().includes(searchTerm.toLowerCase())
  //     );
  //   }

  //   setFilteredEquipment(filtered);
  // }, [selectedCategory, searchTerm, equipment]);

  useEffect(() => {
      filterEquipment();
    }, [selectedCategory, searchTerm, selectedBrand, selectedLab]);
  
    const filterEquipment = () => {
      let filtered = equipment;
  
      if (selectedCategory) {
        filtered = filtered.filter((item) => item.Category === selectedCategory);
      }
  
      if (searchTerm) {
        filtered = filtered.filter((item) =>
          item.Name.toLowerCase().includes(searchTerm.toLowerCase())
        );
      }
  
      if (selectedBrand) {
        filtered = filtered.filter((item) => item.Brand === selectedBrand);
      }

      if (selectedLab) {
        filtered = filtered.filter((item) => item.Lab === selectedLab);
      }
  
      setFilteredEquipment(filtered);
    };

  const handleCategoryFilter = (categoryId) => {
    setSelectedCategory(categoryId);
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
  // const handleUpdate = async () => {
  //   try {
  //     await axios.put(
  //       `http://localhost:3001/api/equipmentImage/${editData._id}`,
  //       editData
  //     );
  //     // Refresh after update
  //     setEquipment((prev) =>
  //       prev.map((item) =>
  //         item._id === editData._id ? { ...item, ...editData } : item
  //       )
  //     );
  //     onRefresh();
  //     closeEditModal();
  //   } catch (error) {
  //     console.error("Error updating equipment:", error);
  //   }
  // };

  const handleUpdate = async () => {
    try {
      const token = localStorage.getItem("token");
      if (!token) {
        navigate("/login"); // Redirect if no token is found
        return;
      }
      await axios.put(
        `http://localhost:3001/api/equipmentImage/${editData._id}`,
        editData,
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
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
          axios.delete(`http://localhost:3001/api/equipmentImage/${id}`, {
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

  // const handleDelete = async () => {
  //   try {
  //     await Promise.all(
  //       selected.map((id) =>
  //         axios.delete(`http://localhost:3001/api/equipmentImage/${id}`)
  //       )
  //     );
  //     setSelected([]); // Clear selection after delete
  //     // Refresh equipment data
  //     setEquipment((prev) =>
  //       prev.filter((item) => !selected.includes(item._id))
  //     );
  //   } catch (error) {
  //     console.error("Error deleting equipment:", error);
  //   }
  // };

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

  const handleListViewClick = () => {
    navigate("/list2");
  };

  const handleAddItemClick = () => {
    navigate("/additem");
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
                <h1 className="pageTitle">Inventory Management</h1>
              </div>

              <div className="addNsearch">
                <div className="addItem">
                  <button className="addItemBtn" id="addBtn" onClick={() => navigate("/additem")}>
                    <b>Add Item</b>
                  </button>
                  <button className="addItemBtn" id="listBtn1" onClick={() => navigate("/table2")}>
                    <b>Table View</b>
                  </button>
                </div>
                
                <div className="search">
                  <div className="searchContainer">
                  <input
                    type="search"
                    placeholder="Search by Name..."
                    className="searchInput"
                    id="searchList"
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                  />
                  </div>
                </div>
                
                <div className="search">
                  <select id="categoryFilter" value={selectedCategory} onChange={(e) => setSelectedCategory(e.target.value)}>
                    <option value="">All Categories</option>
                    {Array.from(new Set(equipment.map((item) => item.Category))).map((category) => (
                      <option key={category} value={category}>
                        {category}
                      </option>
                    ))}
                  </select>

                  

                  <select id="categoryFilter" value={selectedBrand} onChange={(e) => setSelectedBrand(e.target.value)}>
                    <option value="">All Brands</option>
                    {Array.from(new Set(equipment.map((item) => item.Brand))).map((brand) => (
                      <option key={brand} value={brand}>
                        {brand}
                      </option>
                    ))}
                  </select>

                  <select id="categoryFilter" value={selectedLab} onChange={(e) => setSelectedLab(e.target.value)}>
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
                    {/* Category Filter 
                        <CategoryFilter
                          className="categoryFilter"
                          selectedCategory={selectedCategory}
                          setSelectedCategory={setSelectedCategory}
                        />*/}

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
                                selected.length < filteredEquipment.length
                              }
                              checked={
                                filteredEquipment.length > 0 &&
                                selected.length === filteredEquipment.length
                              }
                              onChange={(event) =>
                                setSelected(
                                  event.target.checked
                                    ? filteredEquipment.map((n) => n._id)
                                    : []
                                )
                              }
                            />
                          </TableCell>
                          <TableCell>
                            <b>Name</b>
                          </TableCell>
                          <TableCell>
                            <b>Serial No</b>
                          </TableCell>
                          <TableCell>
                            <b>Brand</b>
                          </TableCell>
                          <TableCell>
                            <b>Category</b>
                          </TableCell>
                          <TableCell>
                            <b>LAB</b>
                          </TableCell>
                          <TableCell>
                            <b>Availability</b>
                          </TableCell>
                        </TableRow>
                      </TableHead>
                      <TableBody>
                        {filteredEquipment
                          .slice(
                            page * rowsPerPage,
                            page * rowsPerPage + rowsPerPage
                          )
                          .map((row, index) => {
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
                                  <Checkbox
                                    color="primary"
                                    checked={isItemSelected}
                                    inputProps={{
                                      "aria-labelledby": `enhanced-table-checkbox-${index}`,
                                    }}
                                  />
                                </TableCell>
                                <TableCell>{row.Name}</TableCell>
                                <TableCell>{row.Serial}</TableCell>
                                <TableCell>{row.Brand}</TableCell>
                                <TableCell>{row.Category}</TableCell>
                                <TableCell>{row.Lab}</TableCell>
                                <TableCell>{row.Availability ? "Yes" : "No"}</TableCell>
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

export default EquipmentTable;
