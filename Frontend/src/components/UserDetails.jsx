

// import React, { useState, useEffect, useRef } from "react";
// import { useNavigate } from "react-router-dom";
// import axios from "axios";
// import "./UserDetails.css";

// function UserDetails({ onUserDataFetched }) {
//     const navigate = useNavigate();

//     const [dropdownVisible, setDropdownVisible] = useState(false);
//     const dropdownRef = useRef(null); // Reference to detect clicks outside
//     const [user, setUser] = useState(null); // State to store user data

//     const toggleDropdown = () => {
//         setDropdownVisible(!dropdownVisible);
//     };

//     const handleProfileClick = () => {
//         navigate("/Profile"); // Navigate to Profile page
//     };

//     const handleActivityClick = (option) => {
//         console.log(option);
//         // Add your logic here based on the selected option
//     };

//     const handleLogoutClick = () => {
//         // Clear token and navigate to login page
//         localStorage.removeItem("token");
//         navigate("/");
//     };

//     useEffect(() => {
//         const fetchUserData = async () => {
//             try {
//                 const token = localStorage.getItem("token");
//                 if (!token) {
//                     navigate("/login"); // Redirect if no token is found
//                     return;
//                 }
//                 const response = await axios.get("http://localhost:3001/api/users/me", {
//                     headers: {
//                         Authorization: `Bearer ${token}`,
//                     },
//                 });
//                 setUser(response.data);
//                 if (onUserDataFetched) {
//                     onUserDataFetched(response.data); // Pass user data to parent
//                 }
//             } catch (error) {
//                 console.error("Error fetching user data:", error);
//                 if (error.response && error.response.status === 401) {
//                     localStorage.removeItem("token"); // Clear token if unauthorized
//                     navigate("/login"); // Redirect to login
//                 }
//             }
//         };

//         fetchUserData();
//     }, [navigate, onUserDataFetched]);

//     useEffect(() => {
//         const handleClickOutside = (event) => {
//             if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
//                 setDropdownVisible(false); // Close dropdown if clicked outside
//             }
//         };

//         document.addEventListener("mousedown", handleClickOutside);
//         return () => {
//             document.removeEventListener("mousedown", handleClickOutside);
//         };
//     }, []);

//     return (
//         <div className="userDetails">
//             <div className="blankUserDetails"></div>
//             <div className="userNameEmail">
//                 <div className="userNameDiv">
//                     <b>
//                         {user?.FirstName} {user?.LastName}
//                     </b>
//                 </div>
//                 <div className="userNameDiv">{user?.Email}</div>
//             </div>
//             <div className="userPicDiv" onClick={toggleDropdown} ref={dropdownRef}>
//                 <img
//                     className="userPic"
//                     src="https://firebasestorage.googleapis.com/v0/b/labms-images.appspot.com/o/tempUser2.png?alt=media&token=2d6f3951-1e0f-4a67-93fb-02e9e30033ed"
//                 />
//                 {dropdownVisible && (
//                     <div className="dropdownMenu">
//                         <div
//                             onClick={() => handleProfileClick("Profile")}
//                             className="userClickDropdown"
//                         >
//                             Profile
//                         </div>
//                         <div
//                             onClick={() => handleActivityClick("User Settings")}
//                             className="userClickDropdown"
//                         >
//                             Activity
//                         </div>
//                         <div
//                             onClick={() => handleLogoutClick("Logout")}
//                             className="userClickDropdown"
//                             id="dropdownLogout"
//                         >
//                             Logout
//                         </div>
//                     </div>
//                 )}
//             </div>
//         </div>
//     );
// }

// export default UserDetails;


import React, { useState, useEffect, useRef } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import "./UserDetails.css";
import NotificationsIcon from '@mui/icons-material/Notifications';
import NotificationsActiveIcon from '@mui/icons-material/NotificationsActive';

import { 
    Avatar
  } from "@mui/material";

function UserDetails({ onUserDataFetched }) {
    const navigate = useNavigate();

    const [dropdownVisible, setDropdownVisible] = useState(false);
    const [notificationDropdownVisible, setNotificationDropdownVisible] = useState(false);
    const dropdownRef = useRef(null);
    const notificationDropdownRef = useRef(null);
    const [user, setUser] = useState(null);
    const [notifications, setNotifications] = useState([]);
    const [unreadCount, setUnreadCount] = useState(0);
    const [loading, setLoading] = useState(false);

    const toggleDropdown = () => {
        setDropdownVisible(!dropdownVisible);
        if (notificationDropdownVisible) setNotificationDropdownVisible(false);
    };

    const toggleNotificationDropdown = () => {
        setNotificationDropdownVisible(!notificationDropdownVisible);
        if (dropdownVisible) setDropdownVisible(false);
        if (!notificationDropdownVisible) {
            fetchNotifications();
        }
    };

    const handleProfileClick = () => {
        navigate("/Profile");
    };

    const handleActivityClick = (option) => {
        console.log(option);
    };

    const handleLogoutClick = () => {
        localStorage.removeItem("token");
        navigate("/");
    };

    const fetchUserData = async () => {
        try {
            const token = localStorage.getItem("token");
            if (!token) {
                navigate("/login");
                return;
            }
            const response = await axios.get("http://localhost:3001/api/users/me", {
                headers: {
                    Authorization: `Bearer ${token}`,
                },
            });
            setUser(response.data);
            if (onUserDataFetched) {
                onUserDataFetched(response.data);
            }
        } catch (error) {
            console.error("Error fetching user data:", error);
            if (error.response && error.response.status === 401) {
                localStorage.removeItem("token");
                navigate("/login");
            }
        }
    };

    const fetchUnreadCount = async () => {
        try {
            const token = localStorage.getItem("token");
            if (!token) return;
            
            const response = await axios.get("http://localhost:3001/api/notifications/unread-count", {
                headers: {
                    Authorization: `Bearer ${token}`,
                },
            });
            setUnreadCount(response.data.unreadCount);
        } catch (error) {
            console.error("Error fetching unread count:", error);
        }
    };

    const fetchNotifications = async () => {
        try {
            setLoading(true);
            const token = localStorage.getItem("token");
            if (!token) return;
            
            const response = await axios.get("http://localhost:3001/api/notifications", {
                headers: {
                    Authorization: `Bearer ${token}`,
                },
            });
            console.log('Notifications received:', response.data);
            setNotifications(response.data.notifications);
            setLoading(false);
        } catch (error) {
            console.error("Error fetching notifications:", error);
            setLoading(false);
        }
    };

    const markAsRead = async (id) => {
        try {
            const token = localStorage.getItem("token");
            if (!token) return;
            
            await axios.put(`http://localhost:3001/api/notifications/${id}/read`, {}, {
                headers: {
                    Authorization: `Bearer ${token}`,
                },
            });
            
            // Update the notification in the state
            setNotifications(notifications.map(notification => 
                notification._id === id ? { ...notification, isRead: true } : notification
            ));
            
            // Update unread count
            setUnreadCount(prevCount => Math.max(0, prevCount - 1));
        } catch (error) {
            console.error("Error marking notification as read:", error);
        }
    };

    const markAllAsRead = async () => {
        try {
            const token = localStorage.getItem("token");
            if (!token) return;
            
            await axios.put("http://localhost:3001/api/notifications/read-all", {}, {
                headers: {
                    Authorization: `Bearer ${token}`,
                },
            });
            
            // Update all notifications in state
            setNotifications(notifications.map(notification => ({ ...notification, isRead: true })));
            
            // Reset unread count
            setUnreadCount(0);
        } catch (error) {
            console.error("Error marking all notifications as read:", error);
        }
    };

    useEffect(() => {
        const currentUser = JSON.parse(localStorage.getItem("user"));
        
        if (!currentUser) {
            
            setUser(currentUser);
        } else {
            fetchUserData();
        }
    }, []);

    // Fetch unread count initially and set up periodic refresh
    useEffect(() => {
        fetchUnreadCount();
        
        // Refresh unread count every minute
        const intervalId = setInterval(fetchUnreadCount, 60000);
        
        return () => clearInterval(intervalId);
    }, []);

    useEffect(() => {
        const handleClickOutside = (event) => {
            if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
                setDropdownVisible(false);
            }
            if (notificationDropdownRef.current && !notificationDropdownRef.current.contains(event.target)) {
                setNotificationDropdownVisible(false);
            }
        };

        document.addEventListener("mousedown", handleClickOutside);
        return () => {
            document.removeEventListener("mousedown", handleClickOutside);
        };
    }, []);

    // Format date to a more readable format
    const formatDate = (dateString) => {
        const date = new Date(dateString);
        const now = new Date();
        const diffTime = Math.abs(now - date);
        const diffDays = Math.floor(diffTime / (1000 * 60 * 60 * 24));
        
        if (diffDays === 0) {
            // Today - show time
            return date.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
        } else if (diffDays === 1) {
            // Yesterday
            return "Yesterday";
        } else if (diffDays < 7) {
            // Days of the week
            return date.toLocaleDateString([], { weekday: 'long' });
        } else {
            // Full date
            return date.toLocaleDateString();
        }
    };

    return (
        <div className="userDetails">
            <div className="blankUserDetails"></div>
            
            {/* Notification Bell */}
            <div className="notificationBell" onClick={toggleNotificationDropdown} ref={notificationDropdownRef}>
                <div className="bellIcon">
                    {unreadCount > 0 ? (
                        <NotificationsActiveIcon className="bellIconSvg" style={{ fontSize: "45" }} />
                            ) : (
                        <NotificationsIcon className="bellIconSvg" style={{ fontSize: "45" }} />
                    )}
                    <i className="fas fa-bell"></i>
                    {unreadCount > 0 &&
                        <span className="notificationBadge">{unreadCount}</span>
                    }
                </div>
                
                {notificationDropdownVisible && (
                    <div className="notificationDropdown">
                        <div className="notificationHeader">
                            <h3>Notifications</h3>
                            {unreadCount > 0 && (
                                <button onClick={markAllAsRead} className="markAllRead">
                                    Mark all as read
                                </button>
                            )}
                        </div>
                        
                        <div className="notificationList">
                            {loading ? (
                                <div className="loadingNotifications">Loading...</div>
                            ) : notifications.length === 0 ? (
                                <div className="noNotifications">No notifications</div>
                            ) : (
                                notifications.map((notification) => (
                                    <div 
                                        key={notification._id} 
                                        className={`notificationItem ${!notification.isRead ? 'unread' : ''}`}
                                        onClick={() => markAsRead(notification._id)}
                                    >
                                        <div className="notificationContent">
                                            <div className="notificationTitle">{notification.title}</div>
                                            <div className="notificationMessage">{notification.message}</div>
                                        </div>
                                        <div className="notificationTime">{formatDate(notification.createdAt)}</div>
                                    </div>
                                ))
                            )}
                        </div>
                    </div>
                )}
            </div>
            
            <div className="userPicDiv" onClick={toggleDropdown} ref={dropdownRef}>
                <div className="userNamePicDiv">
                    <div className="userNameDiv">
                        <b>
                            {user?.FirstName} {user?.LastName}
                        </b>
                    </div>
                    <div className="userNameDiv">{user?.Email}</div>
                </div>
                <Avatar 
                    sx={{ 
                        width: 40, 
                        height: 40, 
                        bgcolor: '#0073a5',
                        border: '3px solid #fff'
                    }}
                    >
                    {user?.FirstName?.charAt(0).toUpperCase()}{user?.LastName?.charAt(0).toUpperCase()}
                </Avatar>
                {dropdownVisible && (
                    <div className="dropdownMenu">
                        <div
                            onClick={() => handleProfileClick("Profile")}
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