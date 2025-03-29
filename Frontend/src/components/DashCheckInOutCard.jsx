import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { useNavigate } from "react-router-dom";
import AdminProtected from '../services/AdminProcted';

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

function DashCheckInOutCard() {

    const [records, setRecords] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState('');
    const [isModalOpen, setIsModalOpen] = useState(false);
    
    const [selected, setSelected] = useState([]);
    const [page, setPage] = useState(0);
    const [rowsPerPage, setRowsPerPage] = useState(3);
    const [dense, setDense] = useState(true);

    const api = axios.create({
        baseURL:  'http://localhost:3001/api',
        headers: {
          Authorization: `Bearer ${localStorage.getItem('token')}`
        }
    });

    useEffect(() => {
        const fetchRecords = async () => {
          try {
            const { data } = await api.get('/checkinout');
            setRecords(data);
          } catch (err) {
            setError(err.response?.data?.message || 'Failed to load records');
          } finally {
            setLoading(false);
          }
        };
    
        fetchRecords();
    }, [isModalOpen]);

    const navigate = useNavigate();

    const isSelected = (id) => selected.indexOf(id) !== -1;

    const handleChangePage = (event, newPage) => {
        setPage(newPage);
    };
      
    const handleChangeRowsPerPage = (event) => {
        setRowsPerPage(parseInt(event.target.value, 10));
        setPage(0);
    };

  return (
    <div>
        <div className='dashCardTitle'>Recent Check-ins</div>
        <Box sx={{ width: "100%" }}>
            <Paper sx={{ width: "100%", mb: 2 }}>
                <TableContainer>
                    <Table size={dense ? "small" : "medium"}>
                        <TableHead>
                            <TableRow>
                                <TableCell><b>Equipment</b></TableCell>
                                <TableCell><b>Action</b></TableCell>
                                <TableCell><b>User</b></TableCell>
                                <TableCell><b>Date & Time</b></TableCell>
                            </TableRow>
                        </TableHead>
                        <TableBody>
                        {records
                            .slice(page * rowsPerPage, page * rowsPerPage + rowsPerPage)
                            .map((record, index) => {
                            const isItemSelected = isSelected(record._id);
                            return (
                                <TableRow
                                hover
                                role="checkbox"
                                aria-checked={isItemSelected}
                                tabIndex={-1}
                                key={record._id}
                                selected={isItemSelected}
                                >
                                
                                <TableCell>{record.equipment?.Name}</TableCell>
                                <TableCell>{record.action}</TableCell>
                                <TableCell>{`${record.selectedUser?.FirstName} ${record.selectedUser?.LastName}`}</TableCell>
                                <TableCell>{new Date(record.date).toLocaleString()}</TableCell>
                                </TableRow>
                            );
                            })}
                        </TableBody>
                    </Table>
                </TableContainer>
            </Paper>
        </Box>
    </div>
  )
}

export default DashCheckInOutCard;
