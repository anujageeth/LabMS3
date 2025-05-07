import React, { useEffect, useState, useNavigate } from 'react';
import { FaFlask, FaUsersCog, FaChartLine, FaBoxes, FaTools, FaChartBar } from 'react-icons/fa';
import './Home2.css';
import LoginModal from "./components/LoginModal";

const HomePage = () => {
    const [showLoginModal, setShowLoginModal] = useState(false);
    //const navigate = useNavigate();

  useEffect(() => {
    // Animation for the hero section elements
    const heroElements = document.querySelectorAll('.hero-content > *');
    heroElements.forEach((element, index) => {
      setTimeout(() => {
        element.classList.add('visible');
      }, 300 * index);
    });

    // Make all features visible immediately to ensure they show up
    const features = document.querySelectorAll('.feature-card');
    features.forEach(feature => {
      feature.classList.add('feature-visible');
    });

    // Then add the scroll animation
    const handleScroll = () => {
      features.forEach(feature => {
        const featurePosition = feature.getBoundingClientRect().top;
        const screenPosition = window.innerHeight / 1.3;
        
        if (featurePosition < screenPosition) {
          feature.classList.add('feature-visible');
        }
      });
    };

    window.addEventListener('scroll', handleScroll);
    handleScroll(); // Check on initial load

    return () => {
      window.removeEventListener('scroll', handleScroll);
    };
  }, []);

  return (
    <div className="home-page">
      {/* Hero Section */}
      <section className="hero-section">
        <div className="hero-content">
          <div className="logo-container">
            <FaFlask className="hero-logo" />
          </div>
          <h1>LabMS</h1>
          <h2>Laboratory Management System</h2>
          <p className="hero-description">
            Streamlining laboratory operations for the Department of Electrical & Information Engineering
          </p>
          <button className="get-started-btn" onClick={() => setShowLoginModal(true)}>Get Started</button>

          <LoginModal showLoginModal={showLoginModal} setShowLoginModal={setShowLoginModal} />

            

          
        </div>
        <div className="wave-container">
          <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 1440 320">
            <path fill="#005766" fillOpacity="1" d="M0,192L48,176C96,160,192,128,288,138.7C384,149,480,203,576,213.3C672,224,768,192,864,181.3C960,171,1056,181,1152,197.3C1248,213,1344,235,1392,245.3L1440,256L1440,320L1392,320C1344,320,1248,320,1152,320C1056,320,960,320,864,320C768,320,672,320,576,320C480,320,384,320,288,320C192,320,96,320,48,320L0,320Z"></path>
          </svg>
        </div>
      </section>

      {/* About Section */}
      <section className="about-section">
        <div className="container">
          <h2>About LabMS</h2>
          <p>
            LabMS is designed to streamline lab management by automating routine tasks, tracking equipment usage, 
            and providing a single platform to manage laboratory resources. Built for universities, research institutions, 
            and industrial labs, our system enhances operational efficiency and improves user satisfaction.
          </p>
        </div>
      </section>

      {/* Features Section */}
      <section className="features-section">
        <div className="container">
          <h2>Key Features</h2>
          <div className="features-grid">
            {/* Pre-apply the 'feature-visible' class to ensure these are always visible */}
            <div className="feature-card feature-visible">
              <div className="feature-icon">
                <FaBoxes />
              </div>
              <h3>Equipment Management</h3>
              <p>Easily add, update, and monitor equipment with real-time data.</p>
            </div>

            <div className="feature-card feature-visible">
              <div className="feature-icon">
                <FaUsersCog />
              </div>
              <h3>User Role Management</h3>
              <p>Assign roles and control access for department heads, technical officers, and students.</p>
            </div>

            <div className="feature-card feature-visible">
              <div className="feature-icon">
                <FaChartLine />
              </div>
              <h3>Reporting & Analytics</h3>
              <p>Generate detailed reports and insights for informed decision-making.</p>
            </div>

            <div className="feature-card feature-visible">
              <div className="feature-icon">
                <FaBoxes />
              </div>
              <h3>Real-Time Inventory Monitoring</h3>
              <p>Keep track of all laboratory items with real-time updates, ensuring accurate data for better decision-making.</p>
            </div>

            <div className="feature-card feature-visible">
              <div className="feature-icon">
                <FaTools />
              </div>
              <h3>Maintenance Scheduling</h3>
              <p>Automatically schedule and receive alerts for equipment maintenance, ensuring all tools are in optimal condition.</p>
            </div>

            <div className="feature-card feature-visible">
              <div className="feature-icon">
                <FaChartBar />
              </div>
              <h3>Usage Analytics</h3>
              <p>Generate detailed reports on equipment usage, helping department heads make informed decisions on resource allocation.</p>
            </div>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="cta-section">
        <div className="container">
          <h2>Ready to Optimize Your Laboratory Management?</h2>
          <button className="cta-btn">Start Using LabMS Today</button>
        </div>
      </section>

      {/* Footer */}
      <footer className="footer">
        <div className="container">
          <p>© 2025 Laboratory Management System</p>
        </div>
      </footer>
    </div>
  );
};

export default HomePage;