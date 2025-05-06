import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { useNavigate } from "react-router-dom";
import AdminProtected from './services/AdminProcted';
import "./DashCard.css";
import CheckInOutForm from './CheckInOutForm';

import {
    Box,
    Paper,
    Table,
    TableBody,
    TableCell,
    TableContainer,
    TableRow,
  } from "@mui/material";

function DashCheckInCard() {

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


    const handleOpenCheckIn = () => {
      setIsModalOpen(true);
    };

    const closeModal = () => {
      setIsModalOpen(false);
    };


  return (
    <div>
        <div className='dashCardTitle'>Recent Check-ins</div>
        <Box sx={{ width: "100%" }}>
            <Paper sx={{ width: "100%", mb: 2 }}>
                <TableContainer>
                    <Table size={dense ? "small" : "medium"}>
                        <TableBody className='dashCardTable'>
                        {records
                            .filter((record) => record.action === "checkin")
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
                                    className='dashCardTable'
                                >
                                
                                <TableCell className='dashCardTable'>{record.equipment?.Name}</TableCell>
                                <TableCell className='dashCardTable'>{`${record.selectedUser?.FirstName} ${record.selectedUser?.LastName}`}</TableCell>
                                <TableCell className='dashCardTable'>{new Date(record.date).toLocaleString()}</TableCell>
                                </TableRow>
                            );
                            })}
                        </TableBody>
                    </Table>
                </TableContainer>
            </Paper>
        </Box>
        <div className='dashCardBtns'>
          <button className='dashCardBtn' onClick={() => navigate('/booking')}>
            See all
          </button>
          <button className='dashCardBtn' onClick={handleOpenCheckIn}>
            Check-in
          </button>
        </div>
        

        {isModalOpen && (
          <div className="listViewModal2">
            <div className="listViewModal-content2">
            <AdminProtected><CheckInOutForm /></AdminProtected>
              <button
                className="listViewBtn3"
                id="closeListBtn"
                onClick={closeModal}
              >
                Close
              </button>
            </div>
          </div>
        )}
    </div>
  )
}

export default DashCheckInCard;
