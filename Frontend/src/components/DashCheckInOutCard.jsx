import React, { useState, useEffect } from 'react';
import axios from 'axios';
import {
    Box,
    Paper,
    Table,
    TableBody,
    TableCell,
    TableContainer,
    TableHead,
    TableRow,
} from "@mui/material";

function DashCheckInOutCard() {
    const [records, setRecords] = useState([]);
    const [page, setPage] = useState(0);
    const [rowsPerPage] = useState(3);
    const [dense] = useState(true);

    const api = axios.create({
        baseURL: 'http://10.50.227.93:3001/api',
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
            console.error('Failed to load records:', err);
          }
        };
    
        fetchRecords();
    }, [api]);

    const handleChangePage = (newPage) => {
        setPage(newPage);
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
                                    .map((record) => (
                                        <TableRow
                                            hover
                                            tabIndex={-1}
                                            key={record._id}
                                        >
                                            <TableCell>{record.equipment?.Name}</TableCell>
                                            <TableCell>{record.action}</TableCell>
                                            <TableCell>{`${record.selectedUser?.FirstName} ${record.selectedUser?.LastName}`}</TableCell>
                                            <TableCell>{new Date(record.date).toLocaleString()}</TableCell>
                                        </TableRow>
                                    ))}
                            </TableBody>
                        </Table>
                    </TableContainer>
                    <div className="pagination-controls">
                        <button
                            onClick={() => handleChangePage(Math.max(0, page - 1))}
                            disabled={page === 0}
                        >
                            Previous
                        </button>
                        <span>Page {page + 1} of {Math.ceil(records.length / rowsPerPage)}</span>
                        <button
                            onClick={() => handleChangePage(Math.min(Math.ceil(records.length / rowsPerPage) - 1, page + 1))}
                            disabled={page >= Math.ceil(records.length / rowsPerPage) - 1}
                        >
                            Next
                        </button>
                    </div>
                </Paper>
            </Box>
        </div>
    );
}

export default DashCheckInOutCard;
