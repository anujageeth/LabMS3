import React, { useState, useEffect } from "react";
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
import "../components/tableModal.css";
import CategoryFilter from "./CategoryFilter"; // Import the CategoryFilter component
import CategorySelect from "./CategorySelect";
import { useNavigate } from "react-router-dom";

const EquipmentTable = ({ onRefresh, refresh }) => {
  const [equipment, setEquipment] = useState([]);
  const [filteredEquipment, setFilteredEquipment] = useState([]); // State for filtered equipment
  const [selected, setSelected] = useState([]);
  const [dense, setDense] = useState(false);
  const [page, setPage] = useState(0);
  const [rowsPerPage, setRowsPerPage] = useState(5);
  const [editModalOpen, setEditModalOpen] = useState(false);
  const [editData, setEditData] = useState(null);
  const [selectedCategory, setSelectedCategory] = useState(""); // State to track selected category

  const navigate = useNavigate();
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
    fetchEquipment();
  }, [refresh]);

  // Filter equipment by category
  useEffect(() => {
    if (selectedCategory) {
      const filtered = equipment.filter(
        (item) => item.Category._id === selectedCategory
      );
      setFilteredEquipment(filtered);
    } else {
      setFilteredEquipment(equipment); // Show all equipment if no category is selected
    }
  }, [selectedCategory, equipment]);

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

  return (
    <Box sx={{ width: "100%" }}>
      <Paper sx={{ width: "100%", mb: 2 }}>
        {/* Category Filter */}
        <Box sx={{ p: 2 }}>
          <CategoryFilter
            selectedCategory={selectedCategory}
            setSelectedCategory={setSelectedCategory}
          />
        </Box>

        <Box sx={{ display: "flex", justifyContent: "flex-end", p: 2 }}>
          {selected.length === 1 && (
            <Tooltip title="Edit">
              <IconButton onClick={handleEdit}>
                <EditIcon />
              </IconButton>
            </Tooltip>
          )}
          {selected.length > 0 && (
            <Tooltip title="Delete">
              <IconButton onClick={handleDelete}>
                <DeleteIcon />
              </IconButton>
            </Tooltip>
          )}
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
                <TableCell>Name</TableCell>
                <TableCell>Lab</TableCell>
                <TableCell>Category</TableCell>
                <TableCell>Quantity</TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {filteredEquipment
                .slice(page * rowsPerPage, page * rowsPerPage + rowsPerPage)
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
                      <TableCell>{row.Lab}</TableCell>
                      <TableCell>{row.Category.name}</TableCell>
                      <TableCell>{row.Quantity}</TableCell>
                    </TableRow>
                  );
                })}
            </TableBody>
          </Table>
        </TableContainer>
        <TablePagination
          rowsPerPageOptions={[5, 10, 25]}
          component="div"
          count={filteredEquipment.length}
          rowsPerPage={rowsPerPage}
          page={page}
          onPageChange={handleChangePage}
          onRowsPerPageChange={handleChangeRowsPerPage}
        />
      </Paper>
      <FormControlLabel
        control={<Switch checked={dense} onChange={handleChangeDense} />}
        label="Dense padding"
      />
      {/* Edit Modal */}
      {editModalOpen && (
        <div className="">
          <div className="tableModal">
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
            {/* <input
              className="tableModalInput"
              type="text"
              value={editData.Category}
              onChange={
                (e) =>
                  setEditData({
                    ...editData,
                    Category: { ...editData.Category, name: e.target.value },
                  }) // Update name in the Category object
              }
              placeholder="Category"
            /> */}
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
            <button className="cancel" onClick={closeEditModal}>
              Cancel
            </button>
          </div>
        </div>
      )}
    </Box>
  );
};

export default EquipmentTable;
