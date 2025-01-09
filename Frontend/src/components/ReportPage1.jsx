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
  Switch
} from "@mui/material";
import EditIcon from "@mui/icons-material/Edit";
import DeleteIcon from "@mui/icons-material/Delete";
import CategoryFilter from "./CategoryFilter"; // Import the CategoryFilter component
import CategorySelect from "./CategorySelect";

import "./ReportPage.css";
import SideNavigation from "./SideNavigation";
import UserDetails from "./UserDetails";

const ReportPage1 = ({ onRefresh, refresh }) => {
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

  const [categoryId, setCategoryId] = useState("");
  const [previewUrl, setPreviewUrl] = useState("");


  useEffect(() => {
    const fetchLabReports = async () => {
      try {
        const response = await axios.get("http://localhost:3001/api/labReport"); // Adjust endpoint as needed
        setEquipment(response.data); // Assuming 'setEquipment' is reused for lab reports
        setFilteredEquipment(response.data);
      } catch (error) {
        console.error("Error fetching lab reports:", error);
      }
    };
    fetchLabReports();
  }, [refresh]);  
  
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
        const response = await axios.get("http://localhost:3001/api/categories");
        setCategories(response.data);
      } catch (error) {
        console.error("Error fetching categories:", error);
      }
    };

    fetchEquipment();
    fetchCategories();
  }, [refresh]);

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

  const handleListViewClick = () => {
    navigate("/list2");
  };

  const handleAddItemClick = () => {
    navigate("/additem");
  };

  const fetchPreview = async (type) => {
    try {
      const endpoint =
        type === "full"
          ? "http://localhost:3001/api/reports/full/pdf"
          : `http://localhost:3001/api/reports/category/pdf?categoryId=${categoryId}`;

      if (type === "category" && !categoryId) {
        alert("Please select a category before previewing the report.");
        return;
      }

      // Fetch the PDF from the server
      const response = await axios.get(endpoint, { responseType: "blob" });

      // Create a Blob URL for the PDF
      const blob = new Blob([response.data], { type: "application/pdf" });
      const blobUrl = URL.createObjectURL(blob);

      // Set the Blob URL for preview
      //setPreviewUrl(blobUrl);
      window.open(blobUrl, "_blank");
    } catch (error) {
      console.error("Error fetching preview:", error.message);
      alert("Failed to fetch the report. Please try again.");
    }
  };

  // Download the report
  const downloadReport = async (type) => {
    try {
      const endpoint =
        type === "full"
          ? "http://localhost:3001/api/reports/full/pdf"
          : `http://localhost:3001/api/reports/category/pdf?categoryId=${categoryId}`;

      const response = await axios.get(endpoint, { responseType: "blob" });

      // Trigger download
      const blob = new Blob([response.data], { type: "application/pdf" });
      const url = window.URL.createObjectURL(blob);
      const link = document.createElement("a");
      link.href = url;
      link.setAttribute(
        "download",
        type === "full" ? "full_report.pdf" : "category_report.pdf"
      );
      document.body.appendChild(link);
      link.click();
      link.parentNode.removeChild(link);
    } catch (error) {
      console.error("Error downloading report:", error.message);
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
                <h1 className="pageTitle">Reports</h1>
              </div>

              <div className="addNsearch">
                <div className="addItem" id="fullReportGap">
                  <button
                    className="FullReport"
                  >
                    <b>Full report:</b>
                  </button>
                  <button
                    className="reportButton"
                    id="previewFullBtn"
                    onClick={() => fetchPreview("full")}
                  >
                    <b>Preview</b>
                  </button>
                  <button
                    className="reportButton"
                    id="printFullBtn"
                    onClick={() => downloadReport("full")}
                  >
                    <b>Download</b>
                  </button>
                </div>

                <div className="addItem">
                <select
                  className="FullReport"
                  value={categoryId} // Same as selectedCategory in Type 2
                  onChange={(e) => setCategoryId(e.target.value)} // Updating categoryId on selection
                >
                  <option value="">All Categories</option>
                  {categories.map((category) => (
                    <option key={category._id} value={category._id}>
                      {category.name}
                    </option>
                  ))}
                </select>


                  <button
                    className="reportButton"
                    id="previewFullBtn"
                    onClick={() => fetchPreview("category")}
                  >
                    <b>Preview</b>
                  </button>
                  <button
                    className="reportButton"
                    id="printFullBtn"
                    onClick={() => downloadReport("category")}
                  >
                    <b>Download</b>
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
                              <TableCell><b>Date</b></TableCell>
                              <TableCell><b>Time</b></TableCell>
                              <TableCell><b>Username</b></TableCell>
                              <TableCell><b>Categories</b></TableCell>
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
                                  <TableCell>{row.Category}</TableCell>
                                  <TableCell>{row.Category}</TableCell>
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

export default ReportPage1;
