import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import EquipmentStats from './EquipmentStats';
import SideNavigation from './SideNavigation';
import UserDetails from './UserDetails';
import axios from 'axios';
import './equipmentStatsPage.css'

const EquipmentStatsPage = () => {
  const navigate = useNavigate();
  const [stats, setStats] = useState(null);

  const fetchStats = async () => {
    try {
      const token = localStorage.getItem("token");
      if (!token) {
        navigate("/login");
        return;
      }

      const response = await axios.get(
        // Make sure this path matches exactly with your backend route
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
              <div className="pageBtnDiv">
                <button className="pageBtn" onClick={() => navigate("/additem")}>Add new +</button>
                <button className="pageBtn" onClick={() => navigate("/table2")}>Table View</button>
                <button className="pageBtn" onClick={() => navigate("/list2")}>List View</button>
              </div>
            </div>
            <EquipmentStats stats={stats} />
          </div>
        </div>
      </div>
    </div>
  );
};

export default EquipmentStatsPage;