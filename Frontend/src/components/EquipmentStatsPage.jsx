import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import EquipmentStats from './EquipmentStats';
import SideNavigation from './SideNavigation';
import UserDetails from './UserDetails';
import axios from 'axios';
import './equipmentStatsPage.css';
import { TextField } from '@mui/material';

const EquipmentStatsPage = () => {
  const navigate = useNavigate();
  const [stats, setStats] = useState(null);
  const [searchTerm, setSearchTerm] = useState('');

  const fetchStats = async () => {
    try {
      const token = localStorage.getItem("token");
      if (!token) {
        navigate("/login");
        return;
      }

      const response = await axios.get(
        `http://localhost:3001/api/equipmentImage-stats`,
        {
          headers: { 
            Authorization: `Bearer ${token}`,
            'Content-Type': 'application/json'
          }
        }
      );

      if (response.data) {
        setStats(response.data);
      }
    } catch (error) {
      console.error("Error fetching equipment stats:", error);
      if (error.response?.status === 403) {
        alert("Your session has expired. Please log in again.");
        localStorage.removeItem("token");
        navigate("/login");
      }
    }
  };

  useEffect(() => {
    fetchStats();
  }, []);

  return (
    <div className="dashPage">
      <div className="gridBox">
        <SideNavigation />
        <div className="rightPanel">
          <UserDetails />
          <div className="dashBoxer">
            <div className="dashBox">
              <div className="dashName">
                <h1 className="pageTitle">Equipment Statistics</h1>
              </div>

              <div className="addNsearch">
                <div className="addItem">
                  <button className="addItemBtn" id="addBtn" onClick={() => navigate("/additem")}>
                    <b>Add Item</b>
                  </button>
                  <button className="addItemBtn" id="listBtn1" onClick={() => navigate(-1)}>
                    <b>Go back</b>
                  </button>
                </div>

                <div className="search">
                  <div className="searchContainer">
                    <input
                      type="search"
                      placeholder="  Search Equipment..."
                      className="searchInput"
                      id="searchList"
                      value={searchTerm}
                      onChange={(e) => setSearchTerm(e.target.value)}
                    />
                  </div>
                </div>

              </div>
            </div>

            <div className="dataTableBox">
              <EquipmentStats stats={stats} searchTerm={searchTerm} />
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default EquipmentStatsPage;