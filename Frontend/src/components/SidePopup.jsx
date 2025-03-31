// components/NotificationPopup.jsx
import React, { useEffect, useState } from 'react';
import './SidePopup.css';

const NotificationPopup = ({ type = 'success', title, message, isOpen, onClose, duration = 3000 }) => {
  const [isVisible, setIsVisible] = useState(false);

  useEffect(() => {
    if (isOpen) {
      setIsVisible(true);
      
      // Auto close after duration
      const timer = setTimeout(() => {
        setIsVisible(false);
        onClose();
      }, duration);

      return () => clearTimeout(timer);
    }
  }, [isOpen, duration, onClose]);

  return (
    <div className={`popup-notification ${type} ${isVisible ? 'show' : ''}`}>
      <div className="popup-header">
        <span>{title}</span>
        <button className="side-close-button" onClick={() => {
          setIsVisible(false);
          onClose();
        }}>×</button>
      </div>
      <div className="side-popup-content">
        {message}
      </div>
    </div>
  );
};

export default NotificationPopup;