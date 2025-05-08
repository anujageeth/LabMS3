import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import "../components/listModal2.css";

import SideNavigation from "./SideNavigation";
import UserDetails from "./UserDetails";

const EquipmentList2 = ({ refresh, onRefresh }) => {
  const [equipment, setEquipment] = useState([]);
  const [filteredEquipment, setFilteredEquipment] = useState([]);
  const [expandedItems, setExpandedItems] = useState({});

  const [selectedCategory, setSelectedCategory] = useState("");
  const [searchTerm, setSearchTerm] = useState(""); // Name filter
  const [selectedBrand, setSelectedBrand] = useState("");
  const [selectedLab, setSelectedLab] = useState("");

  const [selectedEquipment, setSelectedEquipment] = useState(null); // For modal
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editEquipment, setEditEquipment] = useState({
    Name: "",
    Lab: "",
    Category: "",
    Brand: "",
    SerialCode: "",
  });

  const navigate = useNavigate();

  useEffect(() => {
    const fetchEquipment = async () => {
      try {
        const response = await axios.get("http://10.50.227.93:3001/api/equipmentImage");
        setEquipment(response.data);
        setFilteredEquipment(response.data);
      } catch (error) {
        console.error(error);
      }
    };
    fetchEquipment();
  }, [refresh]);

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

  // Toggle expanded state for a specific item
  const toggleExpand = (id) => {
    setExpandedItems(prev => ({
      ...prev,
      [id]: !prev[id]
    }));
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
      await axios.delete(`http://10.50.227.93:3001/api/equipmentImage/${id}`, {
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
      await axios.put(
        `http://10.50.227.93:3001/api/equipmentImage/${selectedEquipment._id}`,
        editEquipment,
        { headers: { Authorization: `Bearer ${token}` } }
      );
      onRefresh();
      closeModal();
    } catch (error) {
      handleAuthError(error);
    }
  };

  // Function to determine item card style based on condition
  const getItemStyle = (condition) => {
    if (condition === "damaged") {
      return {
        boxShadow: "0 0 8px 2px rgba(255, 0, 0, 0.5)",
        border: "1px solid #ff0000"
      };
    }
    return {};
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
              <ul className="equipment-list2">
                {filteredEquipment.map((item) => (
                  <li 
                    key={item._id} 
                    className="equipment-item2"
                    style={getItemStyle(item.condition)}
                  >
                    <h3>{item.Brand} {item.Name}</h3>
                    <p><b>Category:</b> {item.Category}</p>
                    <p><b>Serial Code:</b> {item.Serial}</p>
                    
                    {/* Conditional rendering based on expanded state */}
                    {expandedItems[item._id] && (
                      <div className="expanded-details">
                        <p><b>Lab:</b> {item.Lab}</p>
                        <p><b>Availability:</b> {item.Availability ? "Available" : "Not Available"}</p>
                        <p><b>Condition:</b> <span className={item.condition === "damaged" ? "damaged-text" : ""}>{item.condition}</span></p>
                        <p><b>Added on:</b> {new Date(item.createdAt).toLocaleDateString()}</p>
                        <p><b>Last updated on:</b> {new Date(item.updatedAt).toLocaleDateString()}</p>
                      </div>
                    )}
                    
                    <img
                      src={item.imageUrl === "default"
                        ? "https://firebasestorage.googleapis.com/v0/b/labms-images.appspot.com/o/noImageAvailable.png?alt=media"
                        : item.imageUrl}
                      alt={item.Name}
                    />
                    <br />
                    <div className="button-container">
                      <button 
                        className="toggle-btn listViewBtn2"
                        onClick={(e) => {
                          e.stopPropagation();
                          toggleExpand(item._id);
                        }}
                      >
                        {expandedItems[item._id] ? "Show Less" : "Show More"}
                      </button>
                      <button 
                        className="listViewBtn2" 
                        onClick={() => handleSelect(item)}
                      >
                        Select
                      </button>
                    </div>
                    
                    {/* Condition badge */}
                    {item.condition === "damaged" && (
                      <div className="condition-badge">
                        Damaged
                      </div>
                    )}
                  </li>
                ))}
              </ul>
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
            <input className="listViewModalInput2" type="text" name="Lab" value={editEquipment.Lab} onChange={handleInputChange} placeholder="Lab" />
            <input className="listViewModalInput2" type="text" name="Category" value={editEquipment.Category} onChange={handleInputChange} placeholder="Category" />
            <input className="listViewModalInput2" type="text" name="Brand" value={editEquipment.Brand} onChange={handleInputChange} placeholder="Brand" />
            <input className="listViewModalInput2" type="text" name="SerialCode" value={editEquipment.Serial} onChange={handleInputChange} placeholder="Serial Code" />
            
            <select 
              className="listViewModalInput2" 
              name="Lab" 
              value={editEquipment.Lab} 
              onChange={handleInputChange}
            >
              <option value="Electrical Machines Lab">Electrical Machines Lab</option>
              <option value="Communication Lab">Communication Lab</option>
              <option value="Measurements Lab">Measurements Lab</option>
              <option value="High Voltage Lab">High Voltage Lab</option>
            </select>
            
            <select 
              className="listViewModalInput2" 
              name="condition" 
              value={editEquipment.condition} 
              onChange={handleInputChange}
            >
              <option value="Good">Good</option>
              <option value="Damaged">Damaged</option>
            </select>


            <button className="listViewBtn3" onClick={handleUpdate}>Update</button>
            <button className="listViewBtn3" id="deleteListBtn" onClick={() => handleDelete(selectedEquipment._id)}>Delete</button>
            <button className="listViewBtn3" id="closeListBtn" onClick={closeModal}>Close</button>
          </div>
        </div>
      )}

      
    </div>
  );
};

export default EquipmentList2;