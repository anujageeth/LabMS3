import React from "react";
import { useState, useEffect, useRef } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import "./UserDetails.css";

function UserDetails() {
  const navigate = useNavigate();

  const [dropdownVisible, setDropdownVisible] = useState(false);
  const dropdownRef = useRef(null); // Reference to detect clicks outside
  const [user, setUser] = useState(null); // State to store user data

  const toggleDropdown = () => {
    setDropdownVisible(!dropdownVisible);
  };

  const handleProfileClick = (option) => {
    console.log(option);
    // Add your logic here based on the selected option
  };

  const handleActivityClick = (option) => {
    console.log(option);
    // Add your logic here based on the selected option
  };

  const handleLogoutClick = () => {
    // Clear token and navigate to login page
    localStorage.removeItem("token");
    navigate("/");
  };

  useEffect(() => {
    const fetchUserData = async () => {
      try {
        const token = localStorage.getItem("token");
        if (!token) {
          navigate("/login"); // Redirect if no token is found
          return;
        }
        const response = await axios.get("http://localhost:3001/api/users/me", {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        });
        setUser(response.data);
        //console.log(user);
      } catch (error) {
        console.error("Error fetching user data:", error);
        if (error.response && error.response.status === 401) {
          localStorage.removeItem("token"); // Clear token if unauthorized
          navigate("/login"); // Redirect to login
        }
      }
    };

    fetchUserData();
  }, [navigate]);

  useEffect(() => {
    const handleClickOutside = (event) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
        setDropdownVisible(false); // Close dropdown if clicked outside
      }
    };

    document.addEventListener("mousedown", handleClickOutside);
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, []);

  return (
    <div className="userDetails">
      <div className="blankUserDetails"></div>
      <div className="userNameEmail">
        <div className="userNameDiv">
          <b>
            {user?.FirstName} {user?.LastName}
          </b>
        </div>
        <div className="userNameDiv">{user?.Email}</div>
      </div>
      <div className="userPicDiv" onClick={toggleDropdown} ref={dropdownRef}>
        <img
          className="userPic"
          src="https://firebasestorage.googleapis.com/v0/b/labms-images.appspot.com/o/tempUser2.png?alt=media&token=2d6f3951-1e0f-4a67-93fb-02e9e30033ed"
        />
        {dropdownVisible && (
          <div className="dropdownMenu">
            <div
              onClick={() => handleProfileClick("User Settings")}
              className="userClickDropdown"
            >
              Profile
            </div>
            <div
              onClick={() => handleActivityClick("User Settings")}
              className="userClickDropdown"
            >
              Activity
            </div>
            <div
              onClick={() => handleLogoutClick("Logout")}
              className="userClickDropdown"
              id="dropdownLogout"
            >
              Logout
            </div>
          </div>
        )}
      </div>
    </div>
  );
}

export default UserDetails;
