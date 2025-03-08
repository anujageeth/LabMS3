// src/services/userDataService.js
import axios from "axios";
import { useNavigate } from "react-router-dom";


const API_URL = "http://localhost:3001/api/users";


export const getUserData = async () => {

  
  const token = localStorage.getItem("token");
  if (!token) throw new Error("No token found");

  try {
    const response = await axios.get(API_URL, {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });
    return response.data;
  } catch (error) {
    if (error.response?.status === 403) {
      console.log("Token expired. Redirecting to login.");
      alert("Your session has expired. Please log in again.");
      localStorage.removeItem("token");
      
    } else {
      console.error("Error fetching user data:", error);
    throw error;
    }
    
  }
};

export const createUserData = async (data) => {
  const token = localStorage.getItem("token");
  if (!token) throw new Error("No token found");

  try {
    const response = await axios.post(API_URL, data, {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });
    return response.data.data;
  } catch (error) {
    console.error("Error creating user data:", error);
    throw error;
  }
};
