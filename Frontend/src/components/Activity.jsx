import React, { useState, useEffect } from "react";
import SideNavigation from "./SideNavigation";
import UserDetails from "./UserDetails";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import "./Activity.css";

const Activity = () => {


  return (
    <div className="dashPage">
      <div className="gridBox">
        <SideNavigation />
        <div className="rightPanel">
          <UserDetails />
          <div className="dashBoxer">
            <div>
            <div className="activity-header">
            <strong>Recent Activities</strong>
            </div>
            <div className="activity-form">

            </div>
            </div>

          </div>
        </div>
      </div>

      
    </div>
  );
};

export default Activity;