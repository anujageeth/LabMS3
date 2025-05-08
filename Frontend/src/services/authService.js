// src/services/authService.js
import axios from "axios";

const API_URL = "http://10.50.227.93:3001/api";

export const register = async (
  FirstName,
  LastName,
  Title,
  Email,
  Password,
  Role,
  studentId
) => {
  try {
    const response = await axios.post(`${API_URL}/register`, {
      FirstName,
      LastName,
      Title,
      Email,
      Password,
      Role,
      studentId,
    });
    return response.data; // Return the actual data from the response
  } catch (error) {
    console.error("Registration error:", error.response?.data || error.message);
    throw error.response?.data || error.message; // Throw the error so it can be handled by the calling function
  }
};


export const login = async (email, password) => {
  try {
    const response = await axios.post("http://10.50.227.93:3001/api/login", {
      email, // lowercase
      password, // lowercase
    });

    if (response.data.token) {
      localStorage.setItem("token", response.data.token);
      localStorage.setItem("user", JSON.stringify(response.data.user));
      console.log("Storing token:", response.data.token);
      console.log("Username:", response.data.user.FirstName);
    }

    return response.data;
  } catch (error) {
    console.error("Login API error:", error.message); // Updated error log to give more insight
    throw error;
  }
};

export const logout = () => {
  localStorage.removeItem("user");
};

export const getCurrentUser = () => {
  return JSON.parse(localStorage.getItem("user"));
};

export const getUserData = async () => {
  try {
    const response = await axios.get(`${API_URL}//user-data`, {
      headers: {
        Authorization: `Bearer ${localStorage.getItem("token")}`, // or wherever you store the token
      },
    });
    return response.data.data;
  } catch (error) {
    console.error("Error fetching user data:", error);
    throw error;
  }
};

export const createUserData = async (data) => {
  try {
    const response = await axios.post(`${API_URL}//user-data`, data, {
      headers: {
        Authorization: `Bearer ${localStorage.getItem("token")}`,
      },
    });
    return response.data.data;
  } catch (error) {
    console.error("Error creating user data:", error);
    throw error;
  }
};
