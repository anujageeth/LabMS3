import React from "react";
import { Navigate } from "react-router-dom";

const ProtectedRoute = ({ children }) => {
  // const token = localStorage.getItem("token");

  // // If no token, redirect to login page
  // if (!token) {
  //   return <Navigate to="/login" />;
  // }

  // // If token exists, render the requested component
  // return children;


  const currentUser = JSON.parse(localStorage.getItem("user"));
    // Check if user is an admin  
    if (!currentUser) {
      return <Navigate to="/login" />;
    }
    return children;


  
};

export default ProtectedRoute;
