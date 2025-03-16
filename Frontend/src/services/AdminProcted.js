import React from "react";
import { Navigate } from "react-router-dom";

const AdminProtected = ({ children }) => {
  const currentUser = JSON.parse(localStorage.getItem("user"));
  // Check if user is an admin  
  if (!currentUser || (currentUser.Role !== "technical officer" && currentUser.Role !== "hod")) {
    return <Navigate to="/login" />;
  }
  return children;
}



export default AdminProtected;
