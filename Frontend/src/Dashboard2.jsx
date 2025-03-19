import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { FaBoxOpen, FaClipboardList, FaCogs, FaUsers, FaFileAlt, FaRegCommentDots } from 'react-icons/fa';  // Importing icons
import "./Dashboard.css";
import UserDetails from "./components/UserDetails";
import SideNavigation from "./components/SideNavigation";
import DashCheckInCard from "./DashCheckInCard";
import DashCheckOutCard from "./DashCheckOutCard";

function Dashboard2() {

    const [user, setUser] = useState(null);

    const handleUserDataFetched = (userData) => {
        setUser(userData); // Set user data in state
    };

  return (
    <div>
      <div className="dashPage">
            <div className="gridBox">
                <SideNavigation />
                <div className="rightPanel">
                    <UserDetails onUserDataFetched={handleUserDataFetched} /> {/* Pass callback */}
                    <div className="dashBoxer">
                        <h1 className="pageTitle" id="dash2Title">Dashboard</h1>
                        <div className="dashCardRow">
                            <div className="dashCardDiv">
                                <DashCheckInCard />
                            </div>

                            <div className="dashCardDiv">
                                <DashCheckOutCard />
                            </div>
                        </div>

                        <div className="dashCardRow">
                            <div className="dashCardDiv">
                                <DashCheckInCard />
                            </div>
                            
                            <div className="dashCardDiv">
                                <DashCheckInCard />
                            </div>
                        </div>
                    </div>
                </div>
            </div>

            
        </div>
    </div>
  )
}

export default Dashboard2;
