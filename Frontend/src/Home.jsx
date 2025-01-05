import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import './Home.css';

import LoginModal from "./components/LoginModal";

const HomePage = () => {

  const [showLoginModal, setShowLoginModal] = useState(false);

  const navigate = useNavigate();

  const handleLogoutClick = () => {
    navigate("/login");
  };

  return (
    <div className="homePageFullBox">
      <div className="homeBackImage">
        <div className="homeHeader">
          <div className="homeLabMStitleBox">
            <h1 className="homeLabMStitle">LabMS</h1>
          </div>
          <div className="homeWelcome">
            <p>Laboratry Management System</p>
          </div><br/>
          
          <button className="homeLoginBtn" onClick={() => setShowLoginModal(true)}>
            <b>Get started</b>
          </button>

          <LoginModal showLoginModal={showLoginModal} setShowLoginModal={setShowLoginModal} />
        </div>
      </div>

      
      
      <div class="section">
        <h1 className="homeTopics">Key Features</h1>
        <div class="features">
          <div class="feature-card">
            <h3>Equipment Management</h3>
            <p>Easily add, update, and monitor equipment with real-time data.</p>
          </div>
          <div class="feature-card">
            <h3>User Role Management</h3>
            <p>Assign roles and control access for department heads, technical officers, and students.</p>
          </div>
          <div class="feature-card">
            <h3>Reporting & Analytics</h3>
            <p>Generate detailed reports and insights for informed decision-making.</p>
          </div>
        </div>
        <div class="features">
          <div class="feature-card">
            <h3>Equipment Management</h3>
            <p>Easily add, update, and monitor equipment with real-time data.</p>
          </div>
          <div class="feature-card">
            <h3>User Role Management</h3>
            <p>Assign roles and control access for department heads, technical officers, and students.</p>
          </div>
          <div class="feature-card">
            <h3>Reporting & Analytics</h3>
            <p>Generate detailed reports and insights for informed decision-making.</p>
          </div>
        </div>
      </div>

      <div class="section">
        <h1 className="homeTopics">About LabMS</h1>
        <p class="about-text">
          LabMS is designed to streamline lab management by automating routine tasks, tracking equipment usage, and providing a single platform to manage laboratory resources. Built for universities, research institutions, and industrial labs, our system enhances operational efficiency and improves user satisfaction.
        </p>
      </div>

      <div class="footer">
        <p>© 2024 Laboratory Management System. All rights reserved.</p>
        <p>Contact: support@labms.com</p>
      </div>
    </div>
  );
};

export default HomePage;
