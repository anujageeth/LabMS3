import React, { useState, useEffect, useRef } from "react";
import { useNavigate } from "react-router-dom";
import './Home.css';

import LoginModal from "./components/LoginModal";

const HomePage = () => {
  const [showLoginModal, setShowLoginModal] = useState(false);
  const [visible, setVisible] = useState({
    header: false,
    features1: false,
    features2: false,
    about: false
  });

  const navigate = useNavigate();
  
  // Refs for sections to observe
  const headerRef = useRef(null);
  const features1Ref = useRef(null);
  const features2Ref = useRef(null);
  const aboutRef = useRef(null);

  // Handle scroll animations
  useEffect(() => {
    // Set header initially visible
    setVisible(prev => ({ ...prev, header: true }));
    
    const observerOptions = {
      root: null,
      rootMargin: '0px',
      threshold: 0.2
    };

    const observerCallback = (entries) => {
      entries.forEach(entry => {
        if (entry.isIntersecting) {
          if (entry.target === features1Ref.current) {
            setVisible(prev => ({ ...prev, features1: true }));
          } else if (entry.target === features2Ref.current) {
            setVisible(prev => ({ ...prev, features2: true }));
          } else if (entry.target === aboutRef.current) {
            setVisible(prev => ({ ...prev, about: true }));
          }
        }
      });
    };

    const observer = new IntersectionObserver(observerCallback, observerOptions);
    
    if (features1Ref.current) observer.observe(features1Ref.current);
    if (features2Ref.current) observer.observe(features2Ref.current);
    if (aboutRef.current) observer.observe(aboutRef.current);

    return () => {
      if (features1Ref.current) observer.unobserve(features1Ref.current);
      if (features2Ref.current) observer.unobserve(features2Ref.current);
      if (aboutRef.current) observer.unobserve(aboutRef.current);
    };
  }, []);

  
  return (
    <div className="homePageFullBox">
      <div className="homeBackImage">
        <div className={`homeHeader ${visible.header ? 'visible' : ''}`} ref={headerRef}>
          <div className="homeLabMStitleBox">
            <h1 className="homeLabMStitle">LabMS</h1>
          </div>
          <div className="homeWelcome">
            <p>Laboratory Management System</p>
          </div><br/>
          
          <button className="homeLoginBtn" onClick={() => setShowLoginModal(true)}>
            <b>Get started</b>
          </button>

          <LoginModal showLoginModal={showLoginModal} setShowLoginModal={setShowLoginModal} />
        </div>
      </div>

      <div className="section">
        <h1 className={`homeTopics ${visible.features1 ? 'visible' : ''}`}>Key Features</h1>
        <div className={`features ${visible.features1 ? 'visible' : ''}`} ref={features1Ref}>
          <div className="feature-card">
            <h3>Equipment Management</h3>
            <p>Easily add, update, and monitor equipment with real-time data.</p>
          </div>
          <div className="feature-card feature-delay-1">
            <h3>User Role Management</h3>
            <p>Assign roles and control access for department heads, technical officers, and students.</p>
          </div>
          <div className="feature-card feature-delay-2">
            <h3>Reporting & Analytics</h3>
            <p>Generate detailed reports and insights for informed decision-making.</p>
          </div>
        </div>
        <div className={`features ${visible.features2 ? 'visible' : ''}`} ref={features2Ref}>
          <div className="feature-card">
            <h3>Real-Time Inventory Monitoring</h3>
            <p>Keep track of all laboratory items with real-time updates, ensuring accurate data for better decision-making.</p>
          </div>
          <div className="feature-card feature-delay-1">
            <h3>Maintenance Scheduling</h3>
            <p>Automatically schedule and receive alerts for equipment maintenance, ensuring all tools are in optimal condition.
            </p>
          </div>
          <div className="feature-card feature-delay-2">
            <h3>Usage Analytics</h3>
            <p>Generate detailed reports on equipment usage, helping department heads make informed decisions on resource allocation and future procurement.</p>
          </div>
        </div>
      </div>

      <div className="section">
        <h1 className={`homeTopics ${visible.about ? 'visible' : ''}`}>About LabMS</h1>
        <div className={`about-container ${visible.about ? 'visible' : ''}`} ref={aboutRef}>
          <p className="about-text">
            LabMS is designed to streamline lab management by automating routine tasks, tracking equipment usage, and providing a single platform to manage laboratory resources. Built for universities, research institutions, and industrial labs, our system enhances operational efficiency and improves user satisfaction.
          </p>
        </div>
      </div>

      <div className="footer">
        <p>© 2024 Laboratory Management System. All rights reserved.</p>
        <p>Contact: support@labms.com</p>
      </div>
    </div>
  );
};

export default HomePage;