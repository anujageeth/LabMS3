// import React, { useState, useEffect } from "react";
// import SideNavigation from "./SideNavigation";
// import UserDetails from "./UserDetails";
// import axios from "axios";
// import { useNavigate } from "react-router-dom";
// import "./Profile.css";
// const userId = localStorage.getItem("userId");
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
//   const [user, setUser] = useState(null);// State to store user data
//   const [isChangingPassword, setIsChangingPassword] = useState(false); 
//   const [passwords, setPasswords] = useState({
//     newPassword: "",
//     confirmPassword: "",
//   });

//   // Fetch profile data when the component mounts
//   useEffect(() => {
//     const fetchUserProfile = async () => {
//         try {
//           const token = localStorage.getItem("token");
//           if (!token) {
//             navigate("/login"); // Redirect if no token is found
//             return;
//           }
//           const response = await axios.get("http://localhost:3001/api/users/me", {
//             headers: {
//               Authorization: `Bearer ${token}`,
//             },
//           });
//           setUser(response.data);
//           //console.log(user);
//         } catch (error) {
//           console.error("Error fetching user data:", error);
//           if (error.response && error.response.status === 401) {
//             localStorage.removeItem("token"); // Clear token if unauthorized
//             navigate("/login"); // Redirect to login
//           }
//         }
//       };

//     fetchUserProfile();
//   }, []);

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
//         alert("Passwords do not match!");
//         return;
//     }

//     console.log("Sending request with passwords:", passwords);  // Log passwords for debugging

//     try {
//         const response = await axios.put(
//   `http://localhost:3001/api/users/change`,
//   {
//     currentPassword: passwords.oldPassword,  // Ensure field names match in request
//     newPassword: passwords.newPassword
//   },
//   {
//     headers: { Authorization: `Bearer ${localStorage.getItem("token")}` },
//   },
//   {
//     timeout: 10000  // Set timeout to 10 seconds
//   } 
// );


//         console.log("Response received:", response);  // Log the response
//         alert(response.data.message);
//         setIsChangingPassword(false);
//         setPasswords({ oldPassword: "", newPassword: "", confirmPassword: "" });
//     } catch (error) {
//         console.error("Error in password change:", error);  // Log any errors that occur
//         alert(error.response?.data?.message || "Error changing password");
//     }
// };



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
//       <SideNavigation />
//       <div className="rightPanel">
//         <UserDetails />
//         <div className="dashBoxer">
//           <div>
//             <div className="profile-header">
//               <div className="profile-pic-container">
//                 <img src={profilePic} alt="Profile" className="profile-pic" />
//                 <button className="edit-profile-btn" onClick={triggerFileInput}>
//                   <i className="edit-icon">✎</i>
//                 </button>
//                 <input
//                   type="file"
//                   id="profilePicInput"
//                   accept="image/*"
//                   style={{ display: "none" }}
//                   onChange={handleProfilePicChange}
//                 />
//               </div>
//               <div className="profile-info">
//                 <h2>
//                   {user?.FirstName} {user?.LastName}
//                 </h2>
//                 <p>{user?.Role}</p>
//               </div>
//             </div>
//           </div>

//           <div className="dataTableBox">
//             <div className="profile-form">
//               <div className="form-row">
//                 <div className="form-group">
//                   <label>First Name</label>
//                   <div className="input-container">
//                     <input
//                       type="text"
//                       name="FirstName"
//                       value={user?.FirstName}
//                       onChange={handleInputChange}
//                       disabled={!isEditing}
//                     />
//                   </div>
//                 </div>

//                 <div className="form-group">
//                   <label>Last Name</label>
//                   <div className="input-container">
//                     <input
//                       type="text"
//                       name="LastName"
//                       value={user?.LastName}
//                       onChange={handleInputChange}
//                       disabled={!isEditing}
//                     />
//                   </div>
//                 </div>
//               </div>

//               <div className="form-row">
//                 <div className="form-group">
//                   <label>Email</label>
//                   <div className="input-container">
//                     <input
//                       type="text"
//                       name="Email"
//                       value={user?.Email}
//                       onChange={handleInputChange}
//                       disabled={!isEditing}
//                     />
//                   </div>
//                 </div>

//                 <div className="form-group">
//                   <label>Role</label>
//                   <div className="input-container">
//                     <input
//                       type="text"
//                       name="Role"
//                       value={user?.Role}
//                       onChange={handleInputChange}
//                       disabled={!isEditing}
//                     />
//                   </div>
//                 </div>
//               </div>

//               {isChangingPassword ? (
//                   <>
//                     <div className="form-row">
//                       <div className="form-group">
//                         <label>Current Password</label>
//                         <div className="input-container">
//                           <input
//                             type="password"
//                             name="currentPassword"
//                             value={passwords.currentPassword}
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
//                       <button className="save-btn" onClick={handleChangePassword}>
//                         Save New Password
//                       </button>
//                       <button
//                         className="cancel-btn"
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
//             </div>
//           </div>
//         </div>
//       </div>
//     </div>

//       <style jsx>{`
//         .profile-header {
//           display: flex;
//           align-items: center;
//           gap: 1rem;
//           padding: 1rem;
//           padding-bottom: 0;
//         }

//         .profile-pic-container {
//           position: relative;
//           display: inline-block;
//         }

//         .profile-pic {
//           width: 48px;
//           height: 48px;
//           border-radius: 50%;
//           object-fit: cover;
//         }

//         .edit-profile-btn {
//           position: absolute;
//           bottom: 0;
//           right: 0;
//           width: 22px;
//           height: 22px;
//           background: white;
//           border: 1px solid #ccc;
//           border-radius: 50%;
//           display: flex;
//           align-items: center;
//           justify-content: center;
//           cursor: pointer;
//           font-size: 12px;
//           color: #333;
//           transition: background 0.3s;
//         }

//         .edit-profile-btn:hover {
//           background: #e0e0e0;
//         }

//         .profile-info h2 {
//           margin: 0;
//           font-size: 1.25rem;
//           font-weight: 600;
//         }

//         .profile-info p {
//           margin: 0;
//           color: #666;
//         }

//         .profile-form {
//           padding: 2rem;
//           background: white;
//           border-radius: 24px;
//           box-shadow: 0 2px 4px rgba(0, 0, 0, 0.1);
//         }

//         .form-row {
//           display: grid;
//           grid-template-columns: 1fr 1fr;
//           gap: 5.5rem;
//           margin-bottom: 1.5rem;
//         }

//         .form-group {
//           display: flex;
//           flex-direction: column;
//           gap: 0.5rem;
//         }

//         .form-group label {
//           font-size: 0.875rem;
//           font-weight: 500;
//         }

//         .input-container {
//           position: relative;
//         }

//         .input-container input {
//           width: 100%;
//           padding: 0.75rem;
//           border-radius: 0.5rem;
//           border: none;
//           background: #EDF6F9;
//         }

//         .edit-btn {
//           position: absolute;
//           right: 0.75rem;
//           top: 50%;
//           transform: translateY(-50%);
//           background: none;
//           border: none;
//           cursor: pointer;
//           color: #666;
//         }

//         .edit-icon {
//           font-style: normal;
//         }
//       `}</style>
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
  const [passwords, setPasswords] = useState({
    oldPassword: "",
    newPassword: "",
    confirmPassword: "",
  });

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
        //console.log(user);
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

  const handleChangePassword = async () => {
    if (passwords.newPassword !== passwords.confirmPassword) {
      alert("Passwords do not match!");
      return;
    }

    console.log("Sending request with passwords:", passwords); // Log passwords for debugging

    try {
      const token = localStorage.getItem("token");
      const response = await axios.put(
        `http://localhost:3001/api/update/change`,
        {
          newUsername: user.Email, // Use the current email as the new username
          oldPassword: passwords.oldPassword,
          newPassword: passwords.newPassword,
          confirmPassword: passwords.confirmPassword,
        },
        {
          headers: { Authorization: `Bearer ${token}` },
        },
        {
          timeout: 10000, // Set timeout to 10 seconds
        }
      );

      console.log("Response received:", response); // Log the response
      alert(response.data.message);
      setIsChangingPassword(false);
      setPasswords({ oldPassword: "", newPassword: "", confirmPassword: "" });
    } catch (error) {
      console.error("Error in password change:", error); // Log any errors that occur
      alert(error.response?.data?.message || "Error changing password");
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

  return (
    <div className="dashPage">
      <div className="gridBox">
        <SideNavigation />
        <div className="rightPanel">
          <UserDetails />
          <div className="dashBoxer">
            <div>
              <div className="profile-header">
                <div className="profile-pic-container">
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
                </div>
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
                        value={user?.Role}
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

      
    </div>
  );
};

export default Profile;