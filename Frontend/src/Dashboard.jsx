

import React from "react";
import { useNavigate } from "react-router-dom";
import "./Dashboard.css";

import UserDetails from "./components/UserDetails";

function Dashboard(user) {
  const navigate = useNavigate();

  const handleInventoryClick = () => {
    navigate("/table2");
  };

  const handleReport1Click = () => {
    navigate("/report1");
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

  const handleCheckInOutClick = () => {
    navigate("/checkinoutform");
  };

  const handleBookingClick = () => {
    navigate("/booking");
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

          <button className="logOutBtn" onClick={handleCheckInOutClick}>
            <b>Check IN / OUT</b>
          </button>

          <br /><br />

          <button className="logOutBtn" onClick={handleAddUsrClick}>
            <b>Add new user</b>
          </button>

          <br /><br /><br />

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
            <div className="menuBoxes">
              <div className="menuBox" onClick={handleInventoryClick}>
                <div className="menuBoxImageDiv">
                  <img
                    className="menuBoxLogo"
                    src="https://firebasestorage.googleapis.com/v0/b/labms-images.appspot.com/o/Dashboard%20icons%2Finventory.png?alt=media&token=a0e4e24f-7bc7-4172-b6c5-504e8f307704"
                  />
                </div>
                <div className="menuBoxText">Inventory Management</div>
              </div>
              <div className="menuBox" onClick={handleEquipment1Click}>
                <div className="menuBoxImageDiv">
                  <img
                    className="menuBoxLogo"
                    src="https://firebasestorage.googleapis.com/v0/b/labms-images.appspot.com/o/Dashboard%20icons%2Fequipment.png?alt=media&token=8e6adace-bc80-415f-9872-5de8a4e1ef83"
                  />
                </div>
                <div className="menuBoxText">Equipment Management</div>
              </div>
              <div className="menuBox" onClick={handleBookingClick}>
                <div className="menuBoxImageDiv">
                  <img
                    className="menuBoxLogo"
                    src="https://firebasestorage.googleapis.com/v0/b/labms-images.appspot.com/o/Dashboard%20icons%2Fbooking.png?alt=media&token=5981511e-d530-44dc-8e18-c999a2d7b591"
                  />
                </div>
                <div className="menuBoxText">Bookings & Reservations</div>
              </div>
            </div>

            <div className="menuBoxes">
              <div className="menuBox" onClick={handleReport1Click}>
                <div className="menuBoxImageDiv">
                  <img
                    className="menuBoxLogo"
                    src="https://firebasestorage.googleapis.com/v0/b/labms-images.appspot.com/o/Dashboard%20icons%2Freports.png?alt=media&token=f16cfde4-3c23-4eb8-946e-3c33da9f025d"
                  />
                </div>
                <div className="menuBoxText">Reports</div>
              </div>
              <div className="menuBox" onClick={handleUserManage1Click}>
                <div className="menuBoxImageDiv">
                  <img
                    className="menuBoxLogo"
                    src="https://firebasestorage.googleapis.com/v0/b/labms-images.appspot.com/o/Dashboard%20icons%2Fuser.png?alt=media&token=d0cd5cc7-eb8c-41f8-b8b0-5434ee74147b"
                  />
                </div>
                <div className="menuBoxText">User Management</div>
              </div>
              <div className="menuBox">
                <div className="menuBoxImageDiv">
                  <img
                    className="menuBoxLogo"
                    src="https://firebasestorage.googleapis.com/v0/b/labms-images.appspot.com/o/Dashboard%20icons%2Ffeedback.png?alt=media&token=357b83a0-ccc7-4cd5-9388-b4de1c9c9ab2"
                  />
                </div>
                <div className="menuBoxText">Feedback</div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default Dashboard;