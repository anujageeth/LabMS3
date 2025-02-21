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
  Select,
  MenuItem,
  Button,
  FormControl,
  InputLabel
} from "@mui/material";
import "./ReportPage.css";
import SideNavigation from "./SideNavigation";
import UserDetails from "./UserDetails";
import { useNavigate } from "react-router-dom";

const ReportPage = () => {
  const [reportHistory, setReportHistory] = useState([]);
  const [page, setPage] = useState(0);
  const [rowsPerPage, setRowsPerPage] = useState(5);
  const [nameFilter, setNameFilter] = useState("");
  const [categoryFilter, setCategoryFilter] = useState("");
  const [categories, setCategories] = useState([]);
  const [names, setNames] = useState([]);
  const [user, setUser] = useState(null);

  const [dense, setDense] = useState(true);

  // Fetch categories and names on component mount
  useEffect(() => {
    const fetchOptions = async () => {
      try {
        const response = await axios.get("http://localhost:3001/api/report-options");
        setCategories(response.data.categories);
        setNames(response.data.names);
      } catch (error) {
        console.error("Error fetching options:", error);
      }
    };
    fetchOptions();
  }, []);
 
  const navigate = useNavigate();
  useEffect(() => {
    const fetchUserData = async () => {
      try {
        const token = localStorage.getItem("token");
        if (!token) {
          navigate("/login"); // Redirect if no token is found
          return;
        }
        const response = await axios.get("http://localhost:3001/api/users/me", {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        });
        setUser(response.data);
        //console.log(user);
      } catch (error) {
        console.error("Error fetching user data:", error);
        if (error.response && error.response.status === 401) {
          localStorage.removeItem("token"); // Clear token if unauthorized
          navigate("/login"); // Redirect to login
        }
      }
    };

    fetchUserData();
  }, [navigate]);

  // Function to handle report generation
  const handleReport = async (type, action) => {
    try {
      let endpoint = "http://localhost:3001/api/reports/";
      let queryParams = "";
      
      if (type === "full") {
        endpoint += "full/pdf";
      } else if (type === "filtered") {
        endpoint += "filtered/pdf";
        queryParams = `?name=${nameFilter}&category=${categoryFilter}`;
      }

      // Add preview parameter if previewing
      if (action === "preview") {
        queryParams += queryParams ? "&preview=true" : "?preview=true";
      }

      const response = await axios.get(endpoint + queryParams, { 
        responseType: action === "preview" ? "blob" : "blob"
      });
      
      const blob = new Blob([response.data], { type: "application/pdf" });
      const url = window.URL.createObjectURL(blob);

      if (action === "preview") {
        // Open in new window/tab
        window.open(url, "_blank");
      } else {
        // Download
        const link = document.createElement("a");
        link.href = url;
        link.setAttribute("download", `${type}_report.pdf`);
        document.body.appendChild(link);
        link.click();
        link.parentNode.removeChild(link);
      }

      // Add to report history
      const newHistory = {
        date: new Date().toLocaleDateString(),
        time: new Date().toLocaleTimeString(),
        username: "Current User", // Replace with actual user info
        type: type,
        filters: type === "filtered" ? `Name: ${nameFilter}, Category: ${categoryFilter}` : "None",
        action: action
      };
      setReportHistory([newHistory, ...reportHistory]);

    } catch (error) {
      console.error("Error with report:", error);
      alert("Failed to generate report. Please try again.");
    }
  };

  const handleChangePage = (event, newPage) => {
    setPage(newPage);
  };

  const handleChangeRowsPerPage = (event) => {
    setRowsPerPage(parseInt(event.target.value, 10));
    setPage(0);
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
                    onClick={() => handleReport("full", "preview")}
                  >
                    <b>Preview</b>
                  </button>
                  <button
                    className="reportButton"
                    id="printFullBtn"
                    onClick={() => handleReport("full", "download")}
                  >
                    <b>Download</b>
                  </button>
                </div>

                

                <div className="addItem">

                  <select
                    className="FullReport"
                    value={categoryFilter}
                    onChange={(e) => setCategoryFilter(e.target.value)}
                  >
                    <option value="">Category</option>
                    {categories.map((category) => (
                      <option key={category} value={category}>
                        {category}
                      </option>
                    ))}
                  </select>

                  <button
                    className="reportButton"
                    id="previewFullBtn"
                    onClick={() => handleReport("filtered", "preview")}
                  >
                    <b>Preview</b>
                  </button>
                  <button
                    className="reportButton"
                    id="printFullBtn"
                    onClick={() => handleReport("filtered", "download")}
                  >
                    <b>Download</b>
                  </button>
                </div>

                <div className="addItem">
                  <select
                    className="FullReport"
                    value={nameFilter}
                    onChange={(e) => setNameFilter(e.target.value)}
                  >
                    <option value="">Name</option>
                    {names.map((name) => (
                      <option key={name} value={name}>
                        {name}
                      </option>
                    ))}
                  </select>

                  <button
                    className="reportButton"
                    id="previewFullBtn"
                    onClick={() => handleReport("filtered", "preview")}
                  >
                    <b>Preview</b>
                  </button>
                  <button
                    className="reportButton"
                    id="printFullBtn"
                    onClick={() => handleReport("filtered", "download")}
                  >
                    <b>Download</b>
                  </button>
                </div>

                {/*<div className="search">
                  <div className="searchContainer">
                    <input
                      type="search"
                      placeholder=" Search..."
                      className="searchInput"
                      value={searchTerm}
                      onChange={handleSearch} // Handle search input
                    />
                  </div>
                  
                </div>*/}
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
                            <TableCell><b>Date</b></TableCell>
                            <TableCell><b>Time</b></TableCell>
                            <TableCell><b>Username</b></TableCell>
                            <TableCell><b>Report Type</b></TableCell>
                            <TableCell><b>Filters Applied</b></TableCell>
                            <TableCell><b>Action</b></TableCell>
                          </TableRow>
                          </TableHead>
                          <TableBody>
                            {reportHistory
                              .slice(page * rowsPerPage, page * rowsPerPage + rowsPerPage)
                              .map((report, index) => (
                                <TableRow key={index}>
                                  <TableCell>{report.date}</TableCell>
                                  <TableCell>{report.time}</TableCell>
                                  <TableCell>{user.FirstName}</TableCell>
                                  <TableCell>{report.type}</TableCell>
                                  <TableCell>{report.filters}</TableCell>
                                  <TableCell>{report.action}</TableCell>
                                </TableRow>
                            ))}
                          </TableBody>
                      </Table>
                      </TableContainer>
                      <TablePagination
                      rowsPerPageOptions={[6]}
                      component="div"
                      count={reportHistory.length}
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
    

    {/*<div className="reportPage">
      <Box sx={{ width: "100%", padding: 2 }}>
        <h1>Equipment Reports</h1>*/}
        
        {/* Report Generation Section */}
        {/*
        <Paper sx={{ p: 2, mb: 2 }}>
          <div className="reportControls">
            */}
            {/* Full Report Controls */}
            {/*
            <div className="fullReportControls" style={{ marginBottom: '20px' }}>
              <Button
                variant="contained"
                color="primary"
                onClick={() => handleReport("full", "preview")}
                sx={{ mr: 2 }}
              >
                Preview Full Report
              </Button>
              <Button
                variant="contained"
                color="primary"
                onClick={() => handleReport("full", "download")}
              >
                Download Full Report
              </Button>
            </div>
            */}

            {/* Filtered Report Controls */}
            {/*
            <div className="filterControls">
              <FormControl sx={{ mr: 2, minWidth: 200 }}>
                <InputLabel>Name</InputLabel>
                <Select
                  value={nameFilter}
                  onChange={(e) => setNameFilter(e.target.value)}
                  label="Name"
                >
                  <MenuItem value="">
                    <em>None</em>
                  </MenuItem>
                  {names.map((name) => (
                    <MenuItem key={name} value={name}>
                      {name}
                    </MenuItem>
                  ))}
                </Select>
              </FormControl>

              <FormControl sx={{ mr: 2, minWidth: 200 }}>
                <InputLabel>Category</InputLabel>
                <Select
                  value={categoryFilter}
                  onChange={(e) => setCategoryFilter(e.target.value)}
                  label="Category"
                >
                  <MenuItem value="">
                    <em>None</em>
                  </MenuItem>
                  {categories.map((category) => (
                    <MenuItem key={category} value={category}>
                      {category}
                    </MenuItem>
                  ))}
                </Select>
              </FormControl>

              <Button
                variant="contained"
                color="secondary"
                onClick={() => handleReport("filtered", "preview")}
                sx={{ mr: 2 }}
              >
                Preview Filtered Report
              </Button>
              <Button
                variant="contained"
                color="secondary"
                onClick={() => handleReport("filtered", "download")}
              >
                Download Filtered Report
              </Button>
            </div>
          </div>
        </Paper>
        */}

        {/* Report History Table */}
        {/*
        <Paper sx={{ width: "100%", mb: 2 }}>
          <TableContainer>
            <Table>
              <TableHead>
                <TableRow>
                  <TableCell><b>Date</b></TableCell>
                  <TableCell><b>Time</b></TableCell>
                  <TableCell><b>Username</b></TableCell>
                  <TableCell><b>Report Type</b></TableCell>
                  <TableCell><b>Filters Applied</b></TableCell>
                  <TableCell><b>Action</b></TableCell>
                </TableRow>
              </TableHead>
              <TableBody>
                {reportHistory
                  .slice(page * rowsPerPage, page * rowsPerPage + rowsPerPage)
                  .map((report, index) => (
                    <TableRow key={index}>
                      <TableCell>{report.date}</TableCell>
                      <TableCell>{report.time}</TableCell>
                      <TableCell>{user.FirstName}</TableCell>
                      <TableCell>{report.type}</TableCell>
                      <TableCell>{report.filters}</TableCell>
                      <TableCell>{report.action}</TableCell>
                    </TableRow>
                  ))}
              </TableBody>
            </Table>
          </TableContainer>
          <TablePagination
            rowsPerPageOptions={[5, 10, 25]}
            component="div"
            count={reportHistory.length}
            rowsPerPage={rowsPerPage}
            page={page}
            onPageChange={handleChangePage}
            onRowsPerPageChange={handleChangeRowsPerPage}
          />
        </Paper>
      </Box>
    </div>*/}

    </div>
  );
};

export default ReportPage;