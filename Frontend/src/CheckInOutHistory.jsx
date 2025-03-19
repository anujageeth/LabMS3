// import React, { useState, useEffect } from "react";
// import {
//     getCheckinCheckoutRecords,
//     addCheckinCheckoutRecord,
// } from "../src/services/checkinCheckoutService";
// import { getAllEquipment } from "../src/services/equipmentService";

// import { useNavigate } from "react-router-dom";
// import axios from "axios";
// import {
//   Box,
//   Paper,
//   Table,
//   TableBody,
//   TableCell,
//   TableContainer,
//   TableHead,
//   TablePagination,
//   TableRow,
//   Checkbox,
//   IconButton,
//   Tooltip,
//   FormControlLabel,
//   Switch
// } from "@mui/material";
// import AddIcon from '@mui/icons-material/Add';
// import RemoveIcon from '@mui/icons-material/Remove';
// import "./components/tableModal2.css";
// import CategoryFilter from "./components/CategoryFilter"; // Import the CategoryFilter component
// import CategorySelect from "./components/CategorySelect";

// import SideNavigation from "./components/SideNavigation";
// import UserDetails from "./components/UserDetails";

// const CheckInOutHistory = ({ onRefresh, refresh }) => {
//     const [equipment, setEquipment] = useState([]);
//     const [filteredEquipment, setFilteredEquipment] = useState([]); // State for filtered equipment
//     const [selected, setSelected] = useState("");
//     const [dense, setDense] = useState(true);
//     const [page, setPage] = useState(0);
//     const [rowsPerPage, setRowsPerPage] = useState(5);
//     const [editModalOpen, setEditModalOpen] = useState(false);
//     const [editData, setEditData] = useState(null);
//     const [categories, setCategories] = useState([]); // State for category options
//     const [selectedCategory, setSelectedCategory] = useState(""); // State to track selected category
//     const [searchTerm, setSearchTerm] = useState(""); // State for search input
    
//     const [records, setRecords] = useState([]);
//     const [selectedRecords, setSelectedRecords] = useState([]);
//     const [equipmentList, setEquipmentList] = useState([]);
//     const [form, setForm] = useState({
//         equipmentId: "",
//         username: "",
//         quantity: 1,
//         action: "checkout",
//     });

//     useEffect(() => {
//       const fetchCategories = async () => {
//         try {
//           const response = await axios.get(
//             "http://localhost:3001/api/categories"
//           );
//           setCategories(response.data); // Set the fetched categories
//         } catch (error) {
//           console.error("Error fetching categories:", error);
//         }
//       };
  
//       fetchCategories();
//     }, []);

//     useEffect(() => {
//         fetchRecords();
//         fetchEquipmentList();
//       }, []);

//     const fetchRecords = async () => {
//         const data = await getCheckinCheckoutRecords();
//         setRecords(data);
//     };

//     const fetchEquipmentList = async () => {
//     const data = await getAllEquipment();
//     setEquipmentList(data);
//     };

//     const handleInputChange = (e) => {
//     setForm({ ...form, [e.target.name]: e.target.value });
//     };

//     useEffect(() => {
//         let filtered = records;
    
//         // Apply category filter
//         if (selectedCategory) {
//             filtered = filtered.filter(
//                 (item) => item.action === selectedCategory
//             );
//         }
    
//         // Apply search term filter
//         if (searchTerm) {
//           filtered = filtered.filter(item =>
//             item.equipment.Name.toLowerCase().includes(searchTerm.toLowerCase()) ||
//             item.equipment.Category.toLowerCase().includes(searchTerm.toLowerCase()) ||
//             item.username.toLowerCase().includes(searchTerm.toLowerCase()) ||
//             item.action.toLowerCase().includes(searchTerm.toLowerCase())
//           );
//         }
    
//         setFilteredEquipment(filtered);
//       }, [selectedCategory, searchTerm, records]);
    
//     const handleCategoryFilter = (categoryId) => {
//     setSelectedCategory(categoryId);
//     };

//     // Search handler
//     const handleSearch = (event) => {
//     setSearchTerm(event.target.value);
//     };

//     // Handle selection of rows
//     const handleClick = (event, row) => {
//     setSelected((prevSelected) => (prevSelected === row._id ? "" : row._id));
//     };

//     const isSelectedRow = (id) => selected === id;

//     // Open edit modal
//     const handleEdit = () => {
//     const itemToEdit = equipment.find((item) => item._id === selected[0]);
//     setEditData(itemToEdit);
//     setEditModalOpen(true);
//     };

//     // Close modal
//     const closeEditModal = () => {
//     setEditModalOpen(false);
//     setEditData(null);
//     };

//     // Handle update action
//     const handleUpdate = async () => {
//     try {
//         await axios.put(
//         `http://localhost:3001/api/equipmentImage/${editData._id}`,
//         editData
//         );
//         // Refresh after update
//         setEquipment((prev) =>
//         prev.map((item) =>
//             item._id === editData._id ? { ...item, ...editData } : item
//         )
//         );
//         onRefresh();
//         closeEditModal();
//     } catch (error) {
//         console.error("Error updating equipment:", error);
//     }
//     };

//     const handleDelete = async () => {
//     try {
//         await Promise.all(
//         selected.map((id) =>
//             axios.delete(`http://localhost:3001/api/equipmentImage/${id}`)
//         )
//         );
//         setSelected([]); // Clear selection after delete
//         // Refresh equipment data
//         setEquipment((prev) =>
//         prev.filter((item) => !selected.includes(item._id))
//         );
//     } catch (error) {
//         console.error("Error deleting equipment:", error);
//     }
//     };

//     const isSelected = (id) => selected.indexOf(id) !== -1;

//     const handleChangePage = (event, newPage) => {
//     setPage(newPage);
//     };

//     const handleChangeRowsPerPage = (event) => {
//     setRowsPerPage(parseInt(event.target.value, 10));
//     setPage(0);
//     };

//     const handleChangeDense = (event) => {
//     setDense(event.target.checked);
//     };

//     const navigate = useNavigate();

//   const handleCheckInOutClick = () => {
//     navigate("/checkinoutform");
//   };

//   const handleInventoryClick = () => {
//     navigate("/table2");
//   };


//   return (
//     <div className="dashPage">
//       <div className="gridBox">
//         <SideNavigation />
//         <div className="rightPanel">
//           <UserDetails />

//           <div className="dashBoxer">
//             <div className="dashBox">
//               <div className="dashName">
//                 <h1 className="pageTitle">Equipment Management</h1>
//               </div>

//               <div className="addNsearch">
//                 <div className="addItem">
//                   <button
//                     className="addItemBtn"
//                     id="addBtn"
//                     onClick={handleCheckInOutClick}
//                   >
//                     <b>Check in / out</b>
//                   </button>
//                   <button
//                     className="addItemBtn"
//                     id="listBtn1"
//                     onClick={handleInventoryClick}
//                   >
//                     <b>Equipment list</b>
//                   </button>
//                 </div>

//                 <div className="search">
//                   <div className="searchContainer">
//                     <input
//                       type="search"
//                       placeholder=" Search..."
//                       className="searchInput"
//                       value={searchTerm}
//                       onChange={handleSearch} // Handle search input
//                     />
//                   </div>
//                   <select
//                     id="categoryFilter"
//                     value={selectedCategory}
//                     onChange={(e) => handleCategoryFilter(e.target.value)}
//                   >
//                     <option value="">All Check in / out</option>
//                     <option value="checkin">Check in</option>
//                     <option value="checkout">Check out</option>
//                   </select>
//                 </div>
//               </div>
//             </div>
//             <div className="dataTableBox">
//               <Box sx={{ width: "100%" }}>
//                   <Paper sx={{ width: "100%", mb: 2 }}>

//                       {/* Show Edit and Delete Buttons based on selection */}
//                       <Box
//                         sx={{ display: "flex", justifyContent: "flex-end", p: 2 }}
//                       >
                        
//                         {/* Category Filter 
//                         <CategoryFilter
//                           className="categoryFilter"
//                           selectedCategory={selectedCategory}
//                           setSelectedCategory={setSelectedCategory}
//                         />*/}

                        
//                     </Box>
//                       <TableContainer>
//                       <Table size={dense ? "small" : "medium"}>
//                           <TableHead>
//                           <TableRow>
//                               <TableCell padding="checkbox">
                              
//                               </TableCell>
//                               <TableCell><b>Equipment Name</b></TableCell>
//                               <TableCell><b>Category</b></TableCell>
//                               <TableCell><b>Quantity</b></TableCell>
//                               <TableCell><b>Action</b></TableCell>
//                               <TableCell><b>Date</b></TableCell>
//                               <TableCell><b>Username</b></TableCell>
//                           </TableRow>
//                           </TableHead>
//                           <TableBody>
//                           {filteredEquipment
//                               .slice(page * rowsPerPage, page * rowsPerPage + rowsPerPage)
//                               .map((record) => {
//                               const isItemSelected = isSelected(record._id);
//                               return (
//                                   <TableRow
//                                   hover
//                                   onClick={(event) => handleClick(event, record)}
//                                   role="checkbox"
//                                   aria-checked={isItemSelected}
//                                   tabIndex={-1}
//                                   key={record._id}
//                                   selected={isItemSelected}
//                                   >
//                                   <TableCell padding="checkbox">
//                                     <Checkbox
//                                         color="primary"
//                                         checked={isItemSelected}
//                                         inputProps={{
//                                         "aria-labelledby": `enhanced-table-checkbox-${record._id}`,
//                                         }}
//                                     />
//                                   </TableCell>
//                                   <TableCell>{record.equipment?.Name}</TableCell>
//                                   <TableCell>{record.equipment.Category? categories.find(
//                                         (cat) =>
//                                           String(cat._id) ===
//                                           String(record.equipment.Category)
//                                       )?.name
//                                     : " "}</TableCell>
//                                   <TableCell>{record.quantity}</TableCell>
//                                   <TableCell>{record.action}</TableCell>
//                                   <TableCell>{new Date(record.date).toLocaleDateString()}</TableCell>
//                                   <TableCell>{record.username}</TableCell>
//                                   </TableRow>
//                               );
//                               })}
//                           </TableBody>
//                       </Table>
//                       </TableContainer>
//                       <TablePagination
//                         rowsPerPageOptions={[6]}
//                         component="div"
//                         count={filteredEquipment.length}
//                         rowsPerPage={rowsPerPage}
//                         page={page}
//                         onPageChange={handleChangePage}
//                         onRowsPerPageChange={handleChangeRowsPerPage}
//                       />
//                   </Paper>

                  
//               </Box>
//             </div>
            

//           </div>
//         </div>
//       </div>
//     </div>

    
//   );
// };

// export default CheckInOutHistory;
import React, { useState, useEffect } from 'react';
import axios from 'axios';
import CheckInOutForm from './CheckInOutForm';
import SideNavigation from "./components/SideNavigation";
import UserDetails from "./components/UserDetails";
import { useNavigate } from "react-router-dom";

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
import AdminProtected from './services/AdminProcted';

function CheckInOutTable() {
  const [records, setRecords] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [isModalOpen, setIsModalOpen] = useState(false);

  const [selected, setSelected] = useState([]);
const [page, setPage] = useState(0);
const [rowsPerPage, setRowsPerPage] = useState(6);
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

  const handleOpenCheckIn = () => {
    setIsModalOpen(true);
  };

  const closeModal = () => {
    setIsModalOpen(false);
  };

  const isSelected = (id) => selected.indexOf(id) !== -1;

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

  // if (loading) return <div>Loading records...</div>;
  // if (error) return <div className="error">{error}</div>;

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
              <div className="addItem">
                <button
                  className="addItemBtn"
                  id="addBtn"
                  onClick={handleOpenCheckIn}
                >
                  <b>Check in / out</b>
                </button>
                <button
                  className="addItemBtn"
                  id="listBtn1"
                  onClick={() => navigate("/table2")}
                >
                  <b>Equipment list</b>
                </button>
              </div>

              <div className="search">
                <div className="searchContainer">
                  
                </div>
                
              </div>
            </div>
          </div>
          <div className="dataTableBox">

            <Box sx={{ width: "100%" }}>
              <Paper sx={{ width: "100%", mb: 2 }}>
                <TableContainer>
                  <Table size={dense ? "small" : "medium"}>
                    <TableHead>
                      <TableRow>
                        <TableCell padding="checkbox">
                          <Checkbox
                            indeterminate={
                              selected.length > 0 &&
                              selected.length < records.length
                            }
                            checked={
                              records.length > 0 &&
                              selected.length === records.length
                            }
                            onChange={(event) =>
                              setSelected(
                                event.target.checked
                                  ? records.map((n) => n._id)
                                  : []
                              )
                            }
                          />
                        </TableCell>
                        <TableCell><b>Serial</b></TableCell>
                        <TableCell><b>Equipment</b></TableCell>
                        <TableCell><b>Action</b></TableCell>
                        <TableCell><b>Handled</b></TableCell>
                        <TableCell><b>User</b></TableCell>
                        <TableCell><b>Date & Time</b></TableCell>
                        <TableCell><b>Damages</b></TableCell>
                        <TableCell><b>Notes</b></TableCell>
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
                                    "aria-labelledby": `enhanced-table-checkbox-${index}`,
                                  }}
                                />
                              </TableCell>
                              <TableCell>{record.equipment?.Serial}</TableCell>
                              
                              <TableCell>{record.equipment?.Name}</TableCell>
                              <TableCell>{record.action}</TableCell>
                              <TableCell>{`${record.user?.FirstName} ${record.user?.LastName}`}</TableCell>
                              <TableCell>{`${record.selectedUser?.FirstName} ${record.selectedUser?.LastName} (${record.selectedUser?.Role})`}</TableCell>
                              <TableCell>{new Date(record.date).toLocaleString()}</TableCell>
                              <TableCell>{record.damageDescription || '-'}</TableCell>
                              <TableCell>{record.notes || '-'}</TableCell>
                            </TableRow>
                          );
                        })}
                    </TableBody>
                  </Table>
                </TableContainer>
                <TablePagination
                  rowsPerPageOptions={[5]}
                  component="div"
                  count={records.length}
                  rowsPerPage={rowsPerPage}
                  page={page}
                  onPageChange={handleChangePage}
                  onRowsPerPageChange={handleChangeRowsPerPage}
                />
              </Paper>
            </Box>

          {/*<><table>
      <thead>
        <tr>
          <th>User</th>
          <th>Equipment</th>
          <th>Category</th>
          <th>Serial</th>
          <th>Action</th>
          <th>Date</th>
          <th>Damage</th>
          <th>Notes</th>
        </tr>
      </thead>
      <tbody>
        {records.map(record => (
          <tr key={record._id}>
            <td>{record.user?.FirstName} {record.user?.LastName}</td>
            <td>{record.equipment?.Name} ({record.equipment?.Brand})</td>
            <td>{record.equipment?.Category}</td>
            <td>{record.equipment?.Serial}</td>
            <td>{record.action}</td>
            <td>{new Date(record.date).toLocaleString()}</td>
            <td>{record.damageDescription || '-'}</td>
            <td>{record.notes || '-'}</td>
          </tr>
        ))}
      </tbody>
    </table></>*/}
          </div>
          

        </div>
      </div>
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
  );
}

export default CheckInOutTable;