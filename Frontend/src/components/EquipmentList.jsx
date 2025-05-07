import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import "./listModal2.css";
//import "../components/damageBatch.css";

import SideNavigation from "./SideNavigation";
import UserDetails from "./UserDetails";

const EquipmentList2 = ({ refresh, onRefresh }) => {
  const [equipment, setEquipment] = useState([]);
  const [filteredEquipment, setFilteredEquipment] = useState([]);
  const [totalItems, setTotalItems] = useState(0);
  const [page, setPage] = useState(1);
  const [limit, setLimit] = useState(6); // Show 12 items per page in grid
  const [sortBy, setSortBy] = useState('Name');
  const [sortOrder, setSortOrder] = useState('asc');
  const [loading, setLoading] = useState(false);

  const [selectedCategory, setSelectedCategory] = useState("");
  const [searchTerm, setSearchTerm] = useState(""); // Name filter
  const [selectedBrand, setSelectedBrand] = useState("");
  const [selectedLab, setSelectedLab] = useState("");

  const [selectedEquipment, setSelectedEquipment] = useState(null); // For modal
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [deleteModalOpen, setDeleteModalOpen] = useState(false);
  const [editEquipment, setEditEquipment] = useState({
    Name: "",
    Lab: "",
    Category: "",
    Brand: "",
    SerialCode: "",
  });

  const navigate = useNavigate();

  useEffect(() => {
    fetchEquipment();
  }, [page, limit, sortBy, sortOrder, selectedCategory, searchTerm, selectedBrand, selectedLab, refresh]);

  const fetchEquipment = async () => {
    try {
      setLoading(true);
      const token = localStorage.getItem("token");
      if (!token) {
        navigate("/login");
        return;
      }

      const queryParams = new URLSearchParams({
        page,
        limit,
        sortBy,
        sortOrder,
        ...(searchTerm && { search: searchTerm }),
        ...(selectedCategory && { Category: selectedCategory }),
        ...(selectedLab && { Lab: selectedLab }),
        ...(selectedBrand && { Brand: selectedBrand })
      });

      // Updated endpoint to match backend route
      const response = await axios.get(
        `http://localhost:3001/api/equipmentImage?${queryParams}`,
        {
          headers: { Authorization: `Bearer ${token}` }
        }
      );

      // If loading more, append to existing items
      if (page > 1) {
        setEquipment(prev => [...prev, ...response.data.equipment]);
        setFilteredEquipment(prev => [...prev, ...response.data.equipment]);
      } else {
        setEquipment(response.data.equipment);
        setFilteredEquipment(response.data.equipment);
      }
      
      setTotalItems(response.data.pagination.total);
      setLoading(false);
    } catch (error) {
      setLoading(false);
      handleAuthError(error);
    }
  };

  const handleLoadMore = () => {
    setPage(prevPage => prevPage + 1);
  };

  // Open modal for selected equipment
  const handleSelect = (item) => {
    setSelectedEquipment(item);
    setIsModalOpen(true);
    setEditEquipment(item);
    
  };

  // Close modal
  const closeModal = () => {
    setIsModalOpen(false);
    setSelectedEquipment(null);
  };

  // Handle delete action
  const handleDelete = async (id) => {
    try {
      const token = localStorage.getItem("token");
      if (!token) {
        navigate("/login");
        return;
      }
      await axios.delete(`http://localhost:3001/api/equipmentImage/${id}`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      onRefresh();
      closeModal();
    } catch (error) {
      handleAuthError(error);
    }
  };
    // Handle input changes for editing
    const handleInputChange = (e) => {
        const { name, value } = e.target;
        setEditEquipment((prev) => ({ ...prev, [name]: value }));
      };
    
  const handleAuthError = (error) => {
    if (error.response?.status === 403) {
      alert("Your session has expired. Please log in again.");
      localStorage.removeItem("token");
      navigate("/login");
    } else {
      console.error("Error:", error.response?.data || error);
    }
  };

  const handleUpdate = async () => {
    try {
      const token = localStorage.getItem("token");
      if (!token) {
        navigate("/login");
        return;
      }

      // Include condition and availability in update
      const updateData = {
        ...editEquipment,
        condition: editEquipment.condition || 'good',
        Availability: editEquipment.condition === 'damaged' ? false : editEquipment.Availability
      };

      await axios.put(
        `http://localhost:3001/api/equipmentImage/${selectedEquipment._id}`,
        updateData,
        { headers: { Authorization: `Bearer ${token}` } }
      );
      onRefresh();
      closeModal();
    } catch (error) {
      handleAuthError(error);
    }
  };

  const closeDeleteModal = () => {
    setDeleteModalOpen(false);
  }

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

                <div className="pageBtnDiv">
                  <button className="pageBtn" onClick={() => navigate("/additem")}>Add new +</button>
                  <button className="pageBtn" onClick={() => navigate("/table2")}>Table View</button>
                  <button className="pageBtn" onClick={() => navigate("/equipment-stats")}>Statistics</button>
                </div>
                
                <div className="pageBtnDiv">
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
                
                <div className="pageBtnDiv">
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
              <ul className="equipment-list2">
                {filteredEquipment.map((item) => (
                  <li key={item._id} className="equipment-item2">
                    {item.condition === 'damaged' && (
                      <div className="listViewDamageLabel"><span className="damage-badge">Damaged</span></div>
                    )}
                    <h3>{item.Brand} {item.Name}</h3>
                    <p><b>Lab:</b> {item.Lab}</p>
                    <p><b>Category:</b> {item.Category}</p>
                    <p><b>Brand:</b> {item.Brand}</p>
                    <p><b>Serial Code:</b> {item.Serial}</p>
                    <p><b>Availability:</b> {item.Availability ? "Available" : "Not Available"}</p>
                    {/*<p><b>Condition:</b> {item.condition}</p>*/}
                    <p><b>Added on:</b> {new Date(item.createdAt).toLocaleDateString()}</p>
                    <p><b>Last updated on:</b> {new Date(item.updatedAt).toLocaleDateString()}</p>
                    <img
                      src={item.imageUrl === "default"
                        ? "https://firebasestorage.googleapis.com/v0/b/labms-images.appspot.com/o/noImageAvailable.png?alt=media"
                        : item.imageUrl}
                      alt={item.Name}
                    />
                    <br />
                    <button className="listViewBtn2" onClick={() => {handleSelect(item)}}>
                      Select
                    </button>
                  </li>
                ))}
              </ul>

              {loading && (
                <div className="loading-indicator">
                  Loading...
                </div>
              )}

              {!loading && filteredEquipment.length < totalItems && (
                <button 
                  className="load-more-btn" 
                  onClick={handleLoadMore}
                >
                  Load More
                </button>
              )}
            </div>
          </div>
        </div>
      </div>

      {/* Modal for Edit/Delete */}
      {isModalOpen && selectedEquipment && (
        
        <div className="listViewModal2">
          <div className="listViewModal-content2">
            <h2>Edit Equipment</h2>
            <input className="listViewModalInput2" type="text" name="Name" value={editEquipment.Name} onChange={handleInputChange} placeholder="Equipment Name" />
            <input className="listViewModalInput2" type="text" name="Category" value={editEquipment.Category} onChange={handleInputChange} placeholder="Category" />
            <input className="listViewModalInput2" type="text" name="Brand" value={editEquipment.Brand} onChange={handleInputChange} placeholder="Brand" />
            <input className="listViewModalInput2" type="text" name="SerialCode" value={editEquipment.Serial} onChange={handleInputChange} placeholder="Serial Code" />
            
            <select 
              className="listViewModalInput2" 
              id="listViewModalInput2Select"
              name="Lab" 
              value={editEquipment.Lab} 
              onChange={handleInputChange}
            >
              <option value="Electrical Machines Lab">Electrical Machines Lab</option>
              <option value="Communication Lab">Communication Lab</option>
              <option value="Measurements Lab">Measurements Lab</option>
              <option value="High Voltage Lab">High Voltage Lab</option>
            </select>
            
            


            {/* Add condition select */}
            <select
              className="listViewModalInput2"
              name="condition"
              value={editEquipment.condition || 'good'}
              onChange={handleInputChange}
            >
              <option value="good">Good</option>
              <option value="damaged">Damaged</option>
            </select>

            <button className="listViewBtn3" onClick={handleUpdate}>Update</button>
            <button className="listViewBtn3" id="deleteListBtn" onClick={() => setDeleteModalOpen(true)}>Delete</button>
            <button className="listViewBtn3" id="closeListBtn" onClick={closeModal}>Close</button>
          </div>
        </div>
      )}

      {deleteModalOpen &&
        <div className="listViewModal2">
          <div className="listViewModal-content2">
          <h2>Delete Equipment</h2>
          <button
            className="listViewBtn3"
            id="deleteListBtn"
            onClick={() => {
              handleDelete(editEquipment._id);
              closeDeleteModal();
              closeModal();
            }}
          >
            Confirm
          </button>

          <button className="listViewBtn3" id="closeListBtn" onClick={closeDeleteModal}>Cancel</button>
          </div>
        </div>
      }
      
    </div>
  );
};

export default EquipmentList2;
