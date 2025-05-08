import React, { useState, useEffect } from "react";
import SideNavigation from "./SideNavigation";
import UserDetails from "./UserDetails";
import axios from "axios";
import { useNavigate } from "react-router-dom";

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
  Typography,
  IconButton,
  Avatar
} from "@mui/material";
import SendIcon from "@mui/icons-material/Send";
import NotificationsIcon from "@mui/icons-material/Notifications";
import CloseIcon from "@mui/icons-material/Close";
import SidePopup from "./SidePopup";
import "./Profile.css";

const Profile = () => {
  const navigate = useNavigate();
  const [isEditing, setIsEditing] = useState(false);
  const [user, setUser] = useState(null);
  const [isChangingPassword, setIsChangingPassword] = useState(false);
  const [isSuccessPopupOpen, setIsSuccessPopupOpen] = useState(false);
  const [passwords, setPasswords] = useState({
    oldPassword: "",
    newPassword: "",
    confirmPassword: "",
  });

  // Broadcast notification states
  const [openBroadcastDialog, setOpenBroadcastDialog] = useState(false);
  const [broadcastForm, setBroadcastForm] = useState({
    title: "",
    message: "",
    recipientRoles: []
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
          navigate("/login");
          return;
        }
        const response = await axios.get("http://10.50.227.93:3001/api/users/me", {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        });
        setUser(response.data);
      } catch (error) {
        console.error("Error fetching user data:", error);
        if (error.response && error.response.status === 401) {
          localStorage.removeItem("token");
          navigate("/login");
        }
      }
    };

    fetchUserProfile();
  }, [navigate]);

  const handlePasswordChange = (e) => {
    const { name, value } = e.target;
    setPasswords((prev) => ({ ...prev, [name]: value }));
  };

  const handleChangePassword = async () => {
    if (passwords.newPassword !== passwords.confirmPassword) {
      alert("Passwords do not match!");
      return;
    }

    try {
      const token = localStorage.getItem("token");
      const response = await axios.put(
        `http://10.50.227.93:3001/api/update/change`,
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

      alert(response.data.message);
      setIsChangingPassword(false);
      setPasswords({ oldPassword: "", newPassword: "", confirmPassword: "" });
    } catch (error) {
      console.error("Error in password change:", error);
      alert(error.response?.data?.message || "Error changing password");
    }
  };

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setUser((prevUser) => ({
      ...prevUser,
      [name]: value,
    }));
  };

  const formatRole = (role) => {
    if (!role) return "";

    const roleMapping = {
      hod: "Head of the Department",
      "technical officer": "Technical Officer",
      instructor: "Instructor",
      lecturer: "Lecturer",
      student: "Student",
    };

    return roleMapping[role.toLowerCase()] || role;
  };

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
      await axios.post(
        "http://10.50.227.93:3001/api/notifications/broadcast",
        broadcastForm,
        {
          headers: { Authorization: `Bearer ${token}` },
        }
      );
      
      setIsSuccessPopupOpen(true);
      handleBroadcastDialogClose();
    } catch (error) {
      console.error("Error sending broadcast notification:", error);
    }
  };

  const handleSaveProfile = async () => {
    try {
      const token = localStorage.getItem("token");
      await axios.put(
        "http://10.50.227.93:3001/api/users/update",
        {
          FirstName: user.FirstName,
          LastName: user.LastName,
          Email: user.Email
        },
        {
          headers: { Authorization: `Bearer ${token}` },
        }
      );
      setIsEditing(false);
      setIsSuccessPopupOpen(true);
    } catch (error) {
      console.error("Error updating profile:", error);
    }
  };

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

                <div className="form-row">
                  <div className="form-group111">
                    {isEditing ? (
                      <>
                        <button
                          className="change-password-btn"
                          onClick={handleSaveProfile}
                        >
                          Save Changes
                        </button>
                        <button
                          className="change-password-btn"
                          onClick={() => setIsEditing(false)}
                        >
                          Cancel
                        </button>
                      </>
                    ) : (
                      <button
                        className="change-password-btn"
                        onClick={() => setIsEditing(true)}
                      >
                        Edit Profile
                      </button>
                    )}
                  </div>
                </div>
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
        duration={3000}
      />
    </div>
  );
};

export default Profile;