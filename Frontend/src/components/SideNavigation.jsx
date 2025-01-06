import React from 'react';
import { useNavigate, useLocation } from 'react-router-dom';

import './SideNavigation.css';

function SideNavigation() {
  const navigate = useNavigate();
  const location = useLocation();

  const handleLogoClick = () => {
    navigate("/");
  };

  const handleDashClick = () => {
    navigate("/dashboard");
  };

  const handleInventoryClick = () => {
    navigate("/table2");
  };

  const handleReportClick = () => {
    navigate("/report1");
  };

  const handleUserManage1Click = () => {
    navigate("/usermanage2");
  };

  const handleEquipment1Click = () => {
    navigate("/checkinouthistory");
  };

  const handleBookingClick = () => {
    navigate("/booking");
  };

  const handleLogoutClick = () => {
    navigate("/");
  };

  const getActiveClass = (paths) => {
    if (Array.isArray(paths)) {
      return paths.includes(location.pathname) ? "activeBtn" : "";
    }
    return location.pathname === paths ? "activeBtn" : "";
  };

  return (
    <div className="navBar">
      <br />
      <div className="uniLogo">
        <img
          className="uniLogoImage"
          onClick={handleLogoClick}
          src="https://firebasestorage.googleapis.com/v0/b/labms-images.appspot.com/o/uniLogo.png?alt=media&token=b367591e-1baa-45f6-a460-a1088c3e2e2c"
          alt="University Logo"
        />
      </div>
      <div className="navTitleDiv">
        <h2 className="navTitle">LabMS</h2>
      </div>
      <p className="navSubTitle">Laboratory Management System</p>
      <br />

      <button
        className={`navBtn ${getActiveClass("/dashboard")}`}
        onClick={handleDashClick}
        id="top"
      >
        <b>Dashboard</b>
      </button>
      <br />

      <button
        className={`navBtn ${getActiveClass(["/table2", "/list2"])}`}
        onClick={handleInventoryClick}
      >
        <b>Inventory Management</b>
      </button>
      <br />

      <button
        className={`navBtn ${getActiveClass("/checkinouthistory")}`}
        onClick={handleEquipment1Click}
      >
        <b>Equipment Management</b>
      </button>
      <br />

      <button className={`navBtn ${getActiveClass("/booking")}`
    }
    onClick={handleBookingClick}>
        <b>Booking & Reservations</b>
      </button>
      <br />

      <button
        className={`navBtn ${getActiveClass("/report1")}`}
        onClick={handleReportClick}
      >
        <b>Reports</b>
      </button>
      <br />

      <button
        className={`navBtn ${getActiveClass("/usermanage2")}`}
        onClick={handleUserManage1Click}
      >
        <b>User Management</b>
      </button>
      <br />

      <button className={`navBtn ${getActiveClass("/feedback")}`} id="bottom">
        <b>Feedback</b>
      </button>

      <br />
      <br />
      <button className="logOutBtn" onClick={handleLogoutClick}>
        <b>Log out</b>
      </button>
    </div>
  );
}

export default SideNavigation;
