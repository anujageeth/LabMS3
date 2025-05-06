import React from "react";
import { Navigate } from "react-router-dom";

const ProtectedRoute = ({ children }) => {
  

  const currentUser = JSON.parse(localStorage.getItem("user"));
    // Check if user is an admin  
    if (!currentUser) {
      return <Navigate to="/login" />;
    }
    return children;


  
};

export default ProtectedRoute;
