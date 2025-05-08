import React from "react";
import { useNavigate } from "react-router-dom";
import { FaBoxOpen, FaClipboardList, FaCogs, FaUsers, FaFileAlt, FaRegCommentDots, FaFlask } from 'react-icons/fa';  // Added FaFlask
import "./Dashboard.css";
import UserDetails from "./components/UserDetails";
import { hasFullAccess, hasInventoryViewAccess, hasBookingAccess,hasEquipmentManagementAccess } from './utils/rolePermissions';
//import getCurrentUser from './services/authService';
const getCurrentUser = () => {
  return JSON.parse(localStorage.getItem("user"));
};

function Dashboard() {
  const navigate = useNavigate();
  const currentUser = getCurrentUser();
  const userRole = currentUser?.Role || ""; // Get the user's role from the context

  const handleInventoryClick = () => {
    navigate("/table2");
  };

  const handleReport1Click = () => {
    navigate("/report1");
  };

  const handleBooking1Click = () => {
    navigate("/booking");
  };

  const handleEquipment1Click = () => {
    navigate("/checkinouthistory");
  };

  const handleUserManage1Click = () => {
    navigate("/usermanage2");
  };

  const handleLogoutClick = () => {
    navigate("/");
  };

  const handleAddUsrClick = () => {
    navigate("/adduser");
  };
  
  const handleConsumablesClick = () => {
    navigate("/consumables");
  };

  const handleNavigate = (path) => {
    navigate(path);
  };

  return (
    <div className="dashPage">
      <div className="gridBox">
        <div className="navBar">
          <br />
          <div className="uniLogo">
            <img
              className="uniLogoImage"
              src="https://firebasestorage.googleapis.com/v0/b/labms-images.appspot.com/o/uniLogo.png?alt=media&token=b367591e-1baa-45f6-a460-a1088c3e2e2c"
              alt="University Logo"
            />
          </div>
          <div className="navTitleDiv">
            <h2 className="navTitle">LabMS</h2>
          </div>
          <p className="navSubTitle">Laboratory Management System</p>
          <br />
          <br />
          <br />
          <br />
          <br />
          <br />
          <br />
          <br />
          <br />

          {hasFullAccess(userRole) && (
            <>
              <button className="logOutBtn" onClick={handleAddUsrClick}>
                <b>Add new user</b>
              </button>
              <br />
              <br />
            </>
          )}

          <button className="logOutBtn" onClick={handleLogoutClick}>
            <b>Log out</b>
          </button>
        </div>
        <div className="rightPanel">
          <UserDetails />
          <div className="dashBoxer">
            <div className="dashName">
              <h1 className="pageTitle">Dashboard</h1>
            </div>
            <div className="boooo">
              <div className="menuBoxes">
                {/* Inventory visible to all except students */}
                {hasInventoryViewAccess(userRole) && (
                  <div className="menuBox" onClick={handleInventoryClick}>
                    <div className="menuBoxImageDiv">
                      <FaBoxOpen size={64} />
                    </div>
                    <div className="menuBoxText">Inventory Management</div>
                  </div>
                )}
                
                {/* Consumables only visible to HOD and TO */}
                {hasFullAccess(userRole) && (
                  <div className="menuBox" onClick={handleConsumablesClick}>
                    <div className="menuBoxImageDiv">
                      <FaFlask size={64} />
                    </div>
                    <div className="menuBoxText">Consumables</div>
                  </div>
                )}

                {/* Equipment Management only visible to HOD and TO */}
                {hasEquipmentManagementAccess(userRole) && (
                  <div className="menuBox" onClick={handleEquipment1Click}>
                    <div className="menuBoxImageDiv">
                      <FaClipboardList size={64} />
                    </div>
                    <div className="menuBoxText">Equipment Management</div>
                  </div>
                )}
              </div>

              <div className="menuBoxes">
                {/* Bookings visible to all users */}
                {hasBookingAccess(userRole) && (
                  <div className="menuBox" onClick={handleBooking1Click}>
                    <div className="menuBoxImageDiv">
                      <FaCogs size={64} />
                    </div>
                    <div className="menuBoxText">Bookings & Reservations</div>
                  </div>
                )}

                {/* Reports only visible to HOD and TO */}
                {hasFullAccess(userRole) && (
                  <div className="menuBox" onClick={handleReport1Click}>
                    <div className="menuBoxImageDiv">
                      <FaFileAlt size={64} />
                    </div>
                    <div className="menuBoxText">Reports</div>
                  </div>
                )}

                {/* User Management only visible to HOD and TO */}
                {hasFullAccess(userRole) && (
                  <div className="menuBox" onClick={handleUserManage1Click}>
                    <div className="menuBoxImageDiv">
                      <FaUsers size={64} />
                    </div>
                    <div className="menuBoxText">User Management</div>
                  </div>
                )}
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}


export default Dashboard;
