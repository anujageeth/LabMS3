




// import React, { useState, useEffect } from "react";
// import SideNavigation from "./SideNavigation";
// import UserDetails from "./UserDetails";
// import axios from "axios";
// import { useNavigate } from "react-router-dom";
// import "./Profile.css";

// const Profile = () => {
//   const [profilePic, setProfilePic] = useState(
//     "https://firebasestorage.googleapis.com/v0/b/labms-images.appspot.com/o/tempUser.jpg?alt=media&token=02e254e8-8b02-4dc9-b415-0bf5eccb5cc0"
//   );
//   const [profile, setProfile] = useState({
//     FirstName: "",
//     LastName: "",
//     Username: "",
//     Role: "",
//     Email: "",
//     Title: "",
//   });

//   const navigate = useNavigate();
//   const [isEditing, setIsEditing] = useState(false);
//   const [user, setUser] = useState(null); // State to store user data
//   const [isChangingPassword, setIsChangingPassword] = useState(false);
//   const [passwords, setPasswords] = useState({
//     oldPassword: "",
//     newPassword: "",
//     confirmPassword: "",
//   });

//   // Fetch profile data when the component mounts
//   useEffect(() => {
//     const fetchUserProfile = async () => {
//       try {
//         const token = localStorage.getItem("token");
//         if (!token) {
//           navigate("/login"); // Redirect if no token is found
//           return;
//         }
//         const response = await axios.get("http://localhost:3001/api/users/me", {
//           headers: {
//             Authorization:`Bearer ${token}`,
//           },
//         });
//         setUser(response.data);
//         //console.log(user);
//       } catch (error) {
//         console.error("Error fetching user data:", error);
//         if (error.response && error.response.status === 401) {
//           localStorage.removeItem("token"); // Clear token if unauthorized
//           navigate("/login"); // Redirect to login
//         }
//       }
//     };

//     fetchUserProfile();
//   }, [navigate]);

//   const handleProfilePicChange = (event) => {
//     const file = event.target.files[0];
//     if (file) {
//       const imageUrl = URL.createObjectURL(file);
//       setProfilePic(imageUrl);
//     }
//   };

//   const handlePasswordChange = (e) => {
//     const { name, value } = e.target;
//     setPasswords((prev) => ({ ...prev, [name]: value }));
//   };

//   const handleChangePassword = async () => {
//     if (passwords.newPassword !== passwords.confirmPassword) {
//       alert("Passwords do not match!");
//       return;
//     }

//     console.log("Sending request with passwords:", passwords); // Log passwords for debugging

//     try {
//       const token = localStorage.getItem("token");
//       const response = await axios.put(
//         `http://localhost:3001/api/update/change`,
//         {
//           newUsername: user.Email, // Use the current email as the new username
//           oldPassword: passwords.oldPassword,
//           newPassword: passwords.newPassword,
//           confirmPassword: passwords.confirmPassword,
//         },
//         {
//           headers: { Authorization: `Bearer ${token}` },
//         },
//         {
//           timeout: 10000, // Set timeout to 10 seconds
//         }
//       );

//       console.log("Response received:", response); // Log the response
//       alert(response.data.message);
//       setIsChangingPassword(false);
//       setPasswords({ oldPassword: "", newPassword: "", confirmPassword: "" });
//     } catch (error) {
//       console.error("Error in password change:", error); // Log any errors that occur
//       alert(error.response?.data?.message || "Error changing password");
//     }
//   };

//   const triggerFileInput = () => {
//     document.getElementById("profilePicInput").click();
//   };

//   const handleInputChange = (e) => {
//     const { name, value } = e.target;
//     setProfile((prevProfile) => ({
//       ...prevProfile,
//       [name]: value,
//     }));
//   };

//   const handleSaveProfile = async () => {
//     try {
//       const response = await fetch("/api/user/users/me", {
//         method: "PUT",
//         headers: {
//           "Content-Type": "application/json",
//           Authorization: `Bearer ${localStorage.getItem("token")}`,
//         },
//         body: JSON.stringify(profile),
//       });

//       if (!response.ok) {
//         throw new Error("Failed to update profile");
//       }

//       setIsEditing(false);
//     } catch (err) {
//       console.error("Error saving profile:", err);
//     }
//   };

//   return (
//     <div className="dashPage">
//       <div className="gridBox">
//         <SideNavigation />
//         <div className="rightPanel">
//           <UserDetails />
//           <div className="dashBoxer">
//             <div>
//               <div className="profile-header">
//                 <div className="profile-pic-container">
//                   <img src={profilePic} alt="Profile" className="profile-pic" />
//                   <button className="edit-profile-btn" onClick={triggerFileInput}>
//                     <i className="edit-icon">✎</i>
//                   </button>
//                   <input
//                     type="file"
//                     id="profilePicInput"
//                     accept="image/*"
//                     style={{ display: "none" }}
//                     onChange={handleProfilePicChange}
//                   />
//                 </div>
//                 <div className="profile-info">
//                   <h2>
//                     {user?.FirstName} {user?.LastName}
//                   </h2>
//                   <p>{user?.Role}</p>
//                 </div>
//               </div>
//             </div>

//             <div className="dataTableBox">
//               <div className="profile-form">
//                 <div className="form-row">
//                   <div className="form-group">
//                     <label>First Name</label>
//                     <div className="input-container">
//                       <input
//                         type="text"
//                         name="FirstName"
//                         value={user?.FirstName}
//                         onChange={handleInputChange}
//                         disabled={!isEditing}
//                       />
//                     </div>
//                   </div>

//                   <div className="form-group">
//                     <label>Last Name</label>
//                     <div className="input-container">
//                       <input
//                         type="text"
//                         name="LastName"
//                         value={user?.LastName}
//                         onChange={handleInputChange}
//                         disabled={!isEditing}
//                       />
//                     </div>
//                   </div>
//                 </div>

//                 <div className="form-row">
//                   <div className="form-group">
//                     <label>Email</label>
//                     <div className="input-container">
//                       <input
//                         type="text"
//                         name="Email"
//                         value={user?.Email}
//                         onChange={handleInputChange}
//                         disabled={!isEditing}
//                       />
//                     </div>
//                   </div>

//                   <div className="form-group">
//                     <label>Role</label>
//                     <div className="input-container">
//                       <input
//                         type="text"
//                         name="Role"
//                         value={user?.Role}
//                         onChange={handleInputChange}
//                         disabled={!isEditing}
//                       />
//                     </div>
//                   </div>
//                 </div>

//                 {isChangingPassword ? (
//                   <>
//                     <div className="form-row">
//                       <div className="form-group">
//                         <label>Current Password</label>
//                         <div className="input-container">
//                           <input
//                             type="password"
//                             name="oldPassword"
//                             value={passwords.oldPassword}
//                             onChange={handlePasswordChange}
//                           />
//                         </div>
//                       </div>
//                     </div>

//                     <div className="form-row">
//                       <div className="form-group">
//                         <label>New Password</label>
//                         <div className="input-container">
//                           <input
//                             type="password"
//                             name="newPassword"
//                             value={passwords.newPassword}
//                             onChange={handlePasswordChange}
//                           />
//                         </div>
//                       </div>

//                       <div className="form-group">
//                         <label>Confirm Password</label>
//                         <div className="input-container">
//                           <input
//                             type="password"
//                             name="confirmPassword"
//                             value={passwords.confirmPassword}
//                             onChange={handlePasswordChange}
//                           />
//                         </div>
//                       </div>
//                     </div>

//                     <div className="form-row">
//                       <button className="change-password-btn" onClick={handleChangePassword}>
//                         Save New Password
//                       </button>
//                       <button
//                         className="change-password-btn"
//                         onClick={() => setIsChangingPassword(false)}
//                       >
//                         Cancel
//                       </button>
//                     </div>
//                   </>
//                 ) : (
//                   <div className="form-row">
//                     <div className="form-group111">
//                       <button
//                         className="change-password-btn"
//                         onClick={() => setIsChangingPassword(true)}
//                       >
//                         Change password
//                       </button>
//                     </div>
//                   </div>
//                 )}
//               </div>
//             </div>
//           </div>
//         </div>
//       </div>

      
//     </div>
//   );
// };

// export default Profile;

import React, { useState, useEffect } from "react";
import SideNavigation from "./SideNavigation";
import UserDetails from "./UserDetails";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import "./Profile.css";
import SidePopup from "./SidePopup";
// Material UI imports
import { 
  Button, 
  Dialog, 
  DialogActions, 
  DialogContent, 
  DialogTitle, 
  TextField, 
  FormControl, 
  InputLabel, 
  Select, 
  MenuItem, 
  Chip, 
  Box, 
  Snackbar, 
  Alert, 
  Typography,
  IconButton,
  Avatar
} from "@mui/material";
import SendIcon from "@mui/icons-material/Send";
import NotificationsIcon from "@mui/icons-material/Notifications";
import CloseIcon from "@mui/icons-material/Close";

const Profile = () => {
  const [profilePic, setProfilePic] = useState(
    "https://firebasestorage.googleapis.com/v0/b/labms-images.appspot.com/o/tempUser.jpg?alt=media&token=02e254e8-8b02-4dc9-b415-0bf5eccb5cc0"
  );
  const [profile, setProfile] = useState({
    FirstName: "",
    LastName: "",
    Username: "",
    Role: "",
    Email: "",
    Title: "",
  });

  const navigate = useNavigate();
  const [isEditing, setIsEditing] = useState(false);
  const [user, setUser] = useState(null); // State to store user data
  const [isChangingPassword, setIsChangingPassword] = useState(false);
  const [isSuccessPopupOpen, setIsSuccessPopupOpen] = useState(false);
  const [passwords, setPasswords] = useState({
    oldPassword: "",
    newPassword: "",
    confirmPassword: "",
  });

  const [isErrorPopupOpen, setIsErrorPopupOpen] = useState(false);
  const [popupMessage, setPopupMessage] = useState("");
  

//   // Add this function to your Profile.jsx
// const showSnackbar = (message, severity = "success") => {
//   setSnackbar({
//     open: true,
//     message,
//     severity
//   });
// };

// const handleCloseSnackbar = () => {
//   setSnackbar(prev => ({
//     ...prev,
//     open: false
//   }));
// };

  // Broadcast notification states
  const [openBroadcastDialog, setOpenBroadcastDialog] = useState(false);
  const [broadcastForm, setBroadcastForm] = useState({
    title: "",
    message: "",
    recipientRoles: []
  });
  const [snackbar, setSnackbar] = useState({
    open: false,
    message: "",
    severity: "success"
  });

  // Available roles for notifications
  const availableRoles = ["student", "lecturer", "hod", "technical officer", "instructor"];

  // Check if user is admin
  const isAdmin = user?.Role === "hod" || user?.Role === "technical officer";

  // Fetch profile data when the component mounts
  useEffect(() => {
    const fetchUserProfile = async () => {
      try {
        const token = localStorage.getItem("token");
        if (!token) {
          navigate("/login"); // Redirect if no token is found
          return;
        }
        const response = await axios.get("http://localhost:3001/api/users/me", {
          headers: {
            Authorization:`Bearer ${token}`,
          },
        });
        setUser(response.data);
      } catch (error) {
        console.error("Error fetching user data:", error);
        if (error.response && error.response.status === 401) {
          localStorage.removeItem("token"); // Clear token if unauthorized
          navigate("/login"); // Redirect to login
        }
      }
    };

    fetchUserProfile();
  }, [navigate]);

  const handleProfilePicChange = (event) => {
    const file = event.target.files[0];
    if (file) {
      const imageUrl = URL.createObjectURL(file);
      setProfilePic(imageUrl);
    }
  };

  const handlePasswordChange = (e) => {
    const { name, value } = e.target;
    setPasswords((prev) => ({ ...prev, [name]: value }));
  };

  // const handleChangePassword = async () => {
  //   if (passwords.newPassword !== passwords.confirmPassword) {
  //     alert("Passwords do not match!");
  //     return;
  //   }

  //   try {
  //     const token = localStorage.getItem("token");
  //     const response = await axios.put(
  //       `http://localhost:3001/api/update/change`,
  //       {
  //         newUsername: user.Email, // Use the current email as the new username
  //         oldPassword: passwords.oldPassword,
  //         newPassword: passwords.newPassword,
  //         confirmPassword: passwords.confirmPassword,
  //       },
  //       {
  //         headers: { Authorization: `Bearer ${token}` },
  //       },
  //       {
  //         timeout: 10000, // Set timeout to 10 seconds
  //       }
  //     );

  //     alert(response.data.message);
  //     setIsChangingPassword(false);
  //     setPasswords({ oldPassword: "", newPassword: "", confirmPassword: "" });
  //   } catch (error) {
  //     console.error("Error in password change:", error); // Log any errors that occur
  //     alert(error.response?.data?.message || "Error changing password");
  //   }
  // };


  const handleChangePassword = async () => {
    if (passwords.newPassword !== passwords.confirmPassword) {
      setPopupMessage("Passwords do not match!");
      setIsErrorPopupOpen(true);
      return;
    }
  
    try {
      const token = localStorage.getItem("token");
      const response = await axios.put(
        `http://localhost:3001/api/update/change`,
        {
          newUsername: user.Email,
          oldPassword: passwords.oldPassword,
          newPassword: passwords.newPassword,
          confirmPassword: passwords.confirmPassword,
        },
        {
          headers: { Authorization: `Bearer ${token}` },
        },
        {
          timeout: 10000,
        }
      );
  
      setPopupMessage("Password changed successfully!");
      setIsSuccessPopupOpen(true);
      setIsChangingPassword(false);
      setPasswords({ oldPassword: "", newPassword: "", confirmPassword: "" });
    } catch (error) {
      console.error("Error in password change:", error);
      setPopupMessage(error.response?.data?.message || "Error changing password");
      setIsErrorPopupOpen(true);
    }
  };


  const triggerFileInput = () => {
    document.getElementById("profilePicInput").click();
  };

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setProfile((prevProfile) => ({
      ...prevProfile,
      [name]: value,
    }));
  };

  const formatRole = (role) => {
    if (!role) return ""; // Handle undefined/null cases
  
    const roleMapping = {
      hod: "Head of the Department",
      "technical officer": "Technical Officer",
      instructor: "Instructor",
      lecturer: "Lecturer",
      student: "Student",
    };
  
    return roleMapping[role.toLowerCase()] || role; // Default to original if not mapped
  };

  const handleSaveProfile = async () => {
    try {
      const response = await fetch("/api/user/users/me", {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${localStorage.getItem("token")}`,
        },
        body: JSON.stringify(profile),
      });

      if (!response.ok) {
        throw new Error("Failed to update profile");
      }

      setIsEditing(false);
    } catch (err) {
      console.error("Error saving profile:", err);
    }
  };

  // Broadcast notification handlers
  const handleBroadcastDialogOpen = () => {
    setOpenBroadcastDialog(true);
  };

  const handleBroadcastDialogClose = () => {
    setOpenBroadcastDialog(false);
    setBroadcastForm({
      title: "",
      message: "",
      recipientRoles: []
    });
  };

  const handleBroadcastFormChange = (e) => {
    const { name, value } = e.target;
    setBroadcastForm(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handleRolesChange = (event) => {
    const {
      target: { value },
    } = event;
    setBroadcastForm(prev => ({
      ...prev,
      recipientRoles: typeof value === 'string' ? value.split(',') : value,
    }));
  };

  const handleSubmitBroadcast = async () => {
    try {
      const token = localStorage.getItem("token");
      const response = await axios.post(
        "http://localhost:3001/api/notifications/broadcast",
        broadcastForm,
        {
          headers: { Authorization: `Bearer ${token}` },
        }
      );
      
      setIsSuccessPopupOpen(true);
      setSnackbar({
        open: true,
        message: "Broadcast notification sent successfully!",
        severity: "success"
      });
      handleBroadcastDialogClose();
    } catch (error) {
      console.error("Error sending broadcast notification:", error);
      setSnackbar({
        open: true,
        message: error.response?.data?.message || "Error sending notification",
        severity: "error"
      });
    }
  };

  // const handleCloseSnackbar = () => {
  //   setSnackbar(prev => ({
  //     ...prev,
  //     open: false
  //   }));
  // };

  return (
    <div className="dashPage">
      <div className="gridBox">
        <SideNavigation />
        <div className="rightPanel">
          <UserDetails />
          <div className="dashBoxer">
            <div>
              <div className="profile-header">
              <Box sx={{ 
                    display: 'flex',
                    alignItems: 'center',
                    gap: 2
              }}>
                <Avatar 
                  sx={{ 
                    width: 80, 
                    height: 80, 
                    bgcolor: '#0073a5',
                    fontSize: '2rem',
                    boxShadow: 1,
                    border: '3px solid #fff'
                  }}
                >
                  {user?.FirstName?.charAt(0).toUpperCase()}{user?.LastName?.charAt(0).toUpperCase()}
                </Avatar>

                <Box sx={{ display: 'flex', flexDirection: 'column', gap: 0.5 }}>
                  <Typography variant="h5" sx={{ fontWeight: 600, color: '#2c3e50' }}>
                    {user?.FirstName} {user?.LastName}
                  </Typography>
                  <Typography variant="subtitle1" sx={{ color: '#7f8c8d' }}>
                    {user?.Role}
                  </Typography>
                </Box>

              </Box>

                  {isAdmin && (
                    <Button 
                      variant="contained" 
                      color="primary" 
                      startIcon={<NotificationsIcon />}
                      onClick={handleBroadcastDialogOpen}
                      style={{ marginTop: '10px' }}
                    >
                      Send Broadcast
                    </Button>
                  )}
                {/*<div className="profile-pic-container">
                  <img src={profilePic} alt="Profile" className="profile-pic" />
                  <button className="edit-profile-btn" onClick={triggerFileInput}>
                    <i className="edit-icon">✎</i>
                  </button>
                  <input
                    type="file"
                    id="profilePicInput"
                    accept="image/*"
                    style={{ display: "none" }}
                    onChange={handleProfilePicChange}
                  />
                </div>
                <div className="profile-info">
                  <h2>
                    {user?.FirstName} {user?.LastName}
                  </h2>
                  <p>{user?.Role}</p>
                  
                  {isAdmin && (
                    <Button 
                      variant="contained" 
                      color="primary" 
                      startIcon={<NotificationsIcon />}
                      onClick={handleBroadcastDialogOpen}
                      style={{ marginTop: '10px' }}
                    >
                      Send Broadcast
                    </Button>
                  )}
                </div>*/}
                
              </div>
              
            </div>

            <div className="dataTableBox">
              <div className="profile-form">
                <div className="form-row">
                  <div className="form-group">
                    <label>First Name</label>
                    <div className="input-container">
                      <input
                        type="text"
                        name="FirstName"
                        value={user?.FirstName}
                        onChange={handleInputChange}
                        disabled={!isEditing}
                      />
                    </div>
                  </div>

                  <div className="form-group">
                    <label>Last Name</label>
                    <div className="input-container">
                      <input
                        type="text"
                        name="LastName"
                        value={user?.LastName}
                        onChange={handleInputChange}
                        disabled={!isEditing}
                      />
                    </div>
                  </div>
                </div>

                <div className="form-row">
                  <div className="form-group">
                    <label>Email</label>
                    <div className="input-container">
                      <input
                        type="text"
                        name="Email"
                        value={user?.Email}
                        onChange={handleInputChange}
                        disabled={!isEditing}
                      />
                    </div>
                  </div>

                  <div className="form-group">
                    <label>Role</label>
                    <div className="input-container">
                    <input
                      type="text"
                      name="Role"
                      value={formatRole(user?.Role)}
                      onChange={handleInputChange}
                      disabled={!isEditing}
                    />
                    </div>
                  </div>
                </div>

                {isChangingPassword ? (
                  <>
                    <div className="form-row">
                      <div className="form-group">
                        <label>Current Password</label>
                        <div className="input-container">
                          <input
                            type="password"
                            name="oldPassword"
                            value={passwords.oldPassword}
                            onChange={handlePasswordChange}
                          />
                        </div>
                      </div>
                    </div>

                    <div className="form-row">
                      <div className="form-group">
                        <label>New Password</label>
                        <div className="input-container">
                          <input
                            type="password"
                            name="newPassword"
                            value={passwords.newPassword}
                            onChange={handlePasswordChange}
                          />
                        </div>
                      </div>

                      <div className="form-group">
                        <label>Confirm Password</label>
                        <div className="input-container">
                          <input
                            type="password"
                            name="confirmPassword"
                            value={passwords.confirmPassword}
                            onChange={handlePasswordChange}
                          />
                        </div>
                      </div>
                    </div>

                    <div className="form-row">
                      <button className="change-password-btn" onClick={handleChangePassword}>
                        Save New Password
                      </button>
                      <button
                        className="change-password-btn"
                        onClick={() => setIsChangingPassword(false)}
                      >
                        Cancel
                      </button>
                    </div>
                  </>
                ) : (
                  <div className="form-row">
                    <div className="form-group111">
                      <button
                        className="change-password-btn"
                        onClick={() => setIsChangingPassword(true)}
                      >
                        Change password
                      </button>
                    </div>
                  </div>
                )}
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Broadcast Notification Dialog */}
      <Dialog 
        open={openBroadcastDialog} 
        onClose={handleBroadcastDialogClose}
        fullWidth
        maxWidth="md"
      >
        <DialogTitle>
          Send Broadcast Notification
          <IconButton
            aria-label="close"
            onClick={handleBroadcastDialogClose}
            sx={{
              position: 'absolute',
              right: 8,
              top: 8,
            }}
          >
            <CloseIcon />
          </IconButton>
        </DialogTitle>
        <DialogContent dividers>
          <Typography variant="body2" color="textSecondary" gutterBottom>
            Send notifications to multiple users based on their roles. Leave recipient roles empty to send to all users.
          </Typography>
          
          <TextField
            autoFocus
            margin="dense"
            id="title"
            name="title"
            label="Notification Title"
            type="text"
            fullWidth
            variant="outlined"
            value={broadcastForm.title}
            onChange={handleBroadcastFormChange}
            required
            sx={{ mb: 3 }}
          />
          
          <TextField
            margin="dense"
            id="message"
            name="message"
            label="Notification Message"
            type="text"
            fullWidth
            variant="outlined"
            value={broadcastForm.message}
            onChange={handleBroadcastFormChange}
            required
            multiline
            rows={4}
            sx={{ mb: 3 }}
          />
          
          <FormControl fullWidth>
            <InputLabel id="roles-select-label">Select Recipients (Optional)</InputLabel>
            <Select
              labelId="roles-select-label"
              id="roles-select"
              multiple
              value={broadcastForm.recipientRoles}
              onChange={handleRolesChange}
              renderValue={(selected) => (
                <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 0.5 }}>
                  {selected.map((value) => (
                    <Chip key={value} label={value} />
                  ))}
                </Box>
              )}
            >
              {availableRoles.map((role) => (
                <MenuItem key={role} value={role}>
                  {role === "hod" ? role.charAt(0).toUpperCase() + role.charAt(1) +role.charAt(2).toUpperCase() :role.charAt(0).toUpperCase() + role.slice(1)}
                </MenuItem>
              ))}
            </Select>
          </FormControl>
        </DialogContent>
        <DialogActions>
          <Button onClick={handleBroadcastDialogClose}>Cancel</Button>
          <Button 
            onClick={handleSubmitBroadcast} 
            variant="contained" 
            color="primary"
            endIcon={<SendIcon />}
            disabled={!broadcastForm.title || !broadcastForm.message}
          >
            Send Notification
          </Button>
        </DialogActions>
      </Dialog>
      
      {/* Notification Snackbar */}
      <SidePopup
        type="success"
        title="Successful"
        message="Broadcast notification sent!"
        isOpen={isSuccessPopupOpen}
        onClose={() => setIsSuccessPopupOpen(false)}
        duration={3000} // Optional: customize duration in milliseconds
      />

{/* Success Popup */}
<SidePopup
  type="success"
  title="Success"
  message={popupMessage || "Operation completed successfully"}
  isOpen={isSuccessPopupOpen}
  onClose={() => setIsSuccessPopupOpen(false)}
  duration={3000}
/>

{/* Error Popup */}
<SidePopup
  type="error"
  title="Error"
  message={popupMessage || "An error occurred"}
  isOpen={isErrorPopupOpen}
  onClose={() => setIsErrorPopupOpen(false)}
  duration={3000}
/>

    </div>
  );
};

export default Profile;