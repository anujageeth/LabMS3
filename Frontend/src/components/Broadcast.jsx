import React, { useState, useEffect } from "react";
import SideNavigation from "./SideNavigation";
import UserDetails from "./UserDetails";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import "./Profile.css";
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

function Broadcast() {

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

    const availableRoles = ["student", "lecturer", "hod", "technical officer", "instructor"];


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
        "http://10.50.227.93:3001/api/notifications/broadcast",
        broadcastForm,
        {
          headers: { Authorization: `Bearer ${token}` },
        }
      );
      
      setSnackbar({
        open: true,
        message: "Broadcast notification sent successfully!",
        severity: "success"
      });
    } catch (error) {
      console.error("Error sending broadcast notification:", error);
      setSnackbar({
        open: true,
        message: error.response?.data?.message || "Error sending notification",
        severity: "error"
      });
    }
  };

  const handleCloseSnackbar = () => {
    setSnackbar(prev => ({
      ...prev,
      open: false
    }));
  };

    const handleCancelClick = () => {
        setBroadcastForm({
        title: "",
        message: "",
        recipientRoles: []
        });
    };
    
    
  return (
    <div>
      {/* Broadcast Notification Dialog */}
      <Dialog 
        fullWidth
        maxWidth="md"
      >
        <DialogTitle>
          Send Broadcast Notification
          <IconButton
            aria-label="close"
            // onClick={handleBroadcastDialogClose}
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
            <Button
                //onClick={handleBroadcastDialogClose}
            >
                Cancel
            </Button>
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
      <Snackbar 
        open={snackbar.open} 
        autoHideDuration={6000} 
        onClose={handleCloseSnackbar}
        anchorOrigin={{ vertical: 'bottom', horizontal: 'right' }}
      >
        <Alert onClose={handleCloseSnackbar} severity={snackbar.severity} sx={{ width: '100%' }}>
          {snackbar.message}
        </Alert>
      </Snackbar>
    </div>
  )
}

export default Broadcast
