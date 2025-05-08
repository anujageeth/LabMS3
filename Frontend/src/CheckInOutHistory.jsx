import React, { useState, useEffect } from 'react';
import axios from 'axios';
import CheckInOutForm from './CheckInOutForm';
import SideNavigation from "./components/SideNavigation";
import UserDetails from "./components/UserDetails";
import { useNavigate } from "react-router-dom";
import {
  Box, Paper, Table, TableBody, TableCell, TableContainer,
  TableHead, TablePagination, TableRow, CircularProgress
} from "@mui/material";
import AdminProtected from './services/AdminProcted';
import './checkinForm.css';

function CheckInOutTable() {
  const [records, setRecords] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [page, setPage] = useState(0);
  const [rowsPerPage, setRowsPerPage] = useState(10);
  const [totalItems, setTotalItems] = useState(0);
  const [filters, setFilters] = useState({
    action: '',
    startDate: '',
    endDate: ''
  });

  const navigate = useNavigate();

  const api = axios.create({
    baseURL: 'http://localhost:3001/api',
    headers: {
      Authorization: `Bearer ${localStorage.getItem('token')}`
    }
  });

  const fetchRecords = async () => {
    try {
      setLoading(true);
      const { data } = await api.get('/checkinout', {
        params: {
          page: page + 1, // Backend uses 1-based pagination
          limit: rowsPerPage,
          sortBy: 'timestamp',
          sortOrder: 'desc',
          ...filters
        }
      });

      setRecords(data.records);
      setTotalItems(data.pagination.total);
      setError('');
    } catch (err) {
      setError(err.response?.data?.message || 'Failed to load records');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchRecords();
  }, [page, rowsPerPage, filters, isModalOpen]);

  const handleFilterChange = (newFilters) => {
    setFilters(prev => ({ ...prev, ...newFilters }));
    setPage(0); // Reset to the first page when filters change
  };

  const formatDateTime = (dateString) => {
    if (!dateString) return '-';

    try {
      // Parse the ISO 8601 date string
      const date = new Date(dateString);
      if (isNaN(date.getTime())) return '-'; // Invalid date check

      // Format the date to 'DD/MM/YYYY, HH:MM AM/PM'
      return date.toLocaleString('en-GB', {
        day: '2-digit',
        month: '2-digit',
        year: 'numeric',
        hour: '2-digit',
        minute: '2-digit',
        hour12: true
      });
    } catch (error) {
      console.error('Date formatting error:', error);
      return '-';
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
                <h1 className="pageTitle">Equipment Management</h1>
              </div>
              <div className="addNsearch">
                <div className="pageBtnDiv">
                  <button className="pageBtn" onClick={() => setIsModalOpen(true)}>
                    <b>Check in / out</b>
                  </button>
                  <button className="pageBtn" onClick={() => navigate("/table2")}>
                    <b>Equipment list</b>
                  </button>
                </div>
                <div className="pageBtnDiv">
                  <select
                    id="categoryFilter"
                    value={filters.action}
                    onChange={(e) => handleFilterChange({ action: e.target.value })}
                  >
                    <option value="">All Actions</option>
                    <option value="checkin">Check In</option>
                    <option value="checkout">Check Out</option>
                  </select>
                  {/*<div className='checkInOutCalenderNavText'>From:</div>*/}
                  <input
                    id="categoryFilter"
                    type="date"
                    value={filters.startDate}
                    onChange={(e) => handleFilterChange({ startDate: e.target.value })}
                  />
                  {/*<div className='checkInOutCalenderNavText'>To:</div>*/}
                  <input
                    id="categoryFilter"
                    type="date"
                    value={filters.endDate}
                    onChange={(e) => handleFilterChange({ endDate: e.target.value })}
                  />
                </div>
              </div>
            </div>

            <div className="dataTableBox">
              <Box sx={{ width: "100%" }}>
                <Paper sx={{ width: "100%", mb: 2 }}>
                  <TableContainer>
                    <Table size="small">
                      <TableHead>
                        <TableRow>
                          <TableCell><b>Serial</b></TableCell>
                          <TableCell><b>Equipment</b></TableCell>
                          <TableCell><b>Action</b></TableCell>
                          <TableCell><b>Handled By</b></TableCell>
                          <TableCell><b>User</b></TableCell>
                          <TableCell><b>Date & Time</b></TableCell>
                          <TableCell><b>Condition</b></TableCell>
                          <TableCell><b>Notes</b></TableCell>
                        </TableRow>
                      </TableHead>
                      <TableBody>
                        {loading ? (
                          <TableRow>
                            <TableCell colSpan={8} align="center">
                              <CircularProgress />
                            </TableCell>
                          </TableRow>
                        ) : records.map((record) => (
                          <TableRow
                            hover
                            key={record._id}
                            sx={{
                              backgroundColor: record.equipment?.condition === 'damaged' ?
                                'rgba(255, 0, 0, 0.05)' : 'inherit'
                            }}
                          >
                            <TableCell>{record.equipment?.Serial}</TableCell>
                            <TableCell>
                              {record.equipment?.Name}
                              {record.equipment?.condition === 'damaged' && (
                                <span className="damage-badge">Damaged</span>
                              )}
                            </TableCell>
                            <TableCell>{record.action}</TableCell>
                            <TableCell>{`${record.user?.FirstName} ${record.user?.LastName}`}</TableCell>
                            <TableCell>{`${record.selectedUser?.FirstName} ${record.selectedUser?.LastName}`}</TableCell>
                            <TableCell>{formatDateTime(record.timestamp)}</TableCell>
                            <TableCell>{record.equipment?.condition || '-'}</TableCell>
                            <TableCell>{record.notes || '-'}</TableCell>
                          </TableRow>
                        ))}
                      </TableBody>
                    </Table>
                  </TableContainer>
                  <TablePagination
                    rowsPerPageOptions={[5]}
                    component="div"
                    count={totalItems}
                    rowsPerPage={rowsPerPage}
                    page={page}
                    onPageChange={(_, newPage) => setPage(newPage)}
                    onRowsPerPageChange={(e) => {
                      setRowsPerPage(parseInt(e.target.value, 10));
                      setPage(0);
                    }}
                  />
                </Paper>
              </Box>
            </div>
          </div>
        </div>
      </div>

      {isModalOpen && (
        <div className="listViewModal2">
          <div className="listViewModal-content2">
            <AdminProtected>
              <CheckInOutForm onComplete={() => {
                setIsModalOpen(false);
                fetchRecords();
              }} />
            </AdminProtected>
            <button
              className="listViewBtn3"
              id="closeListBtn"
              onClick={() => setIsModalOpen(false)}
            >
              Close
            </button>
          </div>
        </div>
      )}
    </div>
  );
}

export default CheckInOutTable;

