import { useState } from "react";
import { BrowserRouter, Routes, Route } from "react-router-dom";
//import 'bootstrap/dist/css/bootstrap.min.css'
import Login from "./Login";
import Dashboard from "./Dashboard";
import Inventory from "./Inventory";
import AddItem from "./AddItem copy";
import AddUser from "./AddUser";
import Home from "./Home";
import ReportPage1 from "./components/ReportNew";
import EquipmentPage1 from "./EquipmentPage1";
import UserManagePage2 from "./UserManagePage2";
import CheckinCheckoutPage from "./equipmentManagement";
import EquipmentTable from "./components/EquipmentTable";
import EquipmentTable2 from "./components/EquipmentTable2";
//import EquipmentList from "./components/EquipmentList";
import EquipmentList2 from "./components/EquipmentList";
import ProtectedRoute from "./services/ProtectedRoute";
import CheckInOutHistory from "./CheckInOutHistory";
import CheckInOutForm from "./CheckInOutForm";
import BookingPage from "./BookingPage";
import AddBulkUser from "./AddBulkUser";
import AdminProtected from "./services/AdminProcted";
import Profile from "./components/Profile";
import EquipmentStatsPage from "./components/EquipmentStatsPage";
import ConsumableItems from "./pages/ConsumableItems";
import AddConsumable from "./pages/AddConsumable";

import DashCheckInOutCard from "./components/DashCheckInOutCard";
import Dashboard2 from "./Dashboard2";
import Home2 from "./Home2";



function App() {
  const [user, setUser] = useState(null);
  const [refresh, setRefresh] = useState(false);

  const handleRefresh = () => {
    setRefresh(!refresh);
  };

  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<Home2 />}></Route>
        <Route
          path="/login"
          element={<Login user={user} setUser={setUser} />}
        ></Route>
        <Route
          path="/dashboard"
          element={<ProtectedRoute><Dashboard user={user} setUser={setUser} /></ProtectedRoute>}
        ></Route>
        <Route path="/inventory" element={<Inventory />}></Route>
        <Route
          path="/additem"
          element={<AdminProtected><AddItem onRefresh={handleRefresh} /></AdminProtected>}
        ></Route>
        
        <Route path="/adduser" element={<AdminProtected><AddUser /></AdminProtected>}></Route>
        <Route
          path="/table"
          element={
            <AdminProtected><EquipmentTable refresh={refresh} onRefresh={handleRefresh} /></AdminProtected>
          }
        />
        <Route
          path="/table2"
          element={
            <ProtectedRoute> <EquipmentTable2 refresh={refresh} onRefresh={handleRefresh} /></ProtectedRoute>
          }
        />
        {/* <Route
          path="/list"
          element={
            <EquipmentList refresh={refresh} onRefresh={handleRefresh} />
          }
        /> */}
        <Route
          path="/list2"
          element={
            <ProtectedRoute><EquipmentList2 refresh={refresh} onRefresh={handleRefresh} /></ProtectedRoute>
          }
        />
        <Route
          path="/report1"
          element={<ProtectedRoute><ReportPage1 refresh={refresh} onRefresh={handleRefresh} /></ProtectedRoute>}
        />
        <Route
          path="/equipment1"
          element={
            <ProtectedRoute><EquipmentPage1 refresh={refresh} onRefresh={handleRefresh} /></ProtectedRoute>
          }
        />
        <Route
          path="/usermanage2"
          element={
            <AdminProtected><UserManagePage2 refresh={refresh} onRefresh={handleRefresh} /></AdminProtected>
          }
        />
        <Route
          path="/checkin-checkout"
          element={
            <AdminProtected><CheckinCheckoutPage refresh={refresh} onRefresh={handleRefresh} /></AdminProtected>
          }
        />
        <Route
          path="/checkinouthistory"
          element={
            <ProtectedRoute><CheckInOutHistory refresh={refresh} onRefresh={handleRefresh} /></ProtectedRoute>
          }
        />
        <Route
          path="/checkinoutform"
          element={
            <AdminProtected> <CheckInOutForm refresh={refresh} onRefresh={handleRefresh} /></AdminProtected>
          }
        />

        <Route
          path="/booking"
          element={
            <ProtectedRoute><BookingPage refresh={refresh} onRefresh={handleRefresh} /></ProtectedRoute>
          }
        />

        <Route
          path="/addbulkuser"
          element={
            <ProtectedRoute><AddBulkUser refresh={refresh} onRefresh={handleRefresh} /></ProtectedRoute>
          }
        />
        <Route 
          path="/equipment-stats" 
          element={
            
              <EquipmentStatsPage />
            
          } 
        />

        <Route
          path="/profile"
          element={
            <ProtectedRoute><Profile /></ProtectedRoute>
          }
        />

        <Route
          path="/dashcard1"
          element={
            <ProtectedRoute><DashCheckInOutCard refresh={refresh} onRefresh={handleRefresh} /></ProtectedRoute>
          }
        />

        <Route
          path="/dashboard2"
          element={
            <ProtectedRoute><Dashboard2 refresh={refresh} onRefresh={handleRefresh} /></ProtectedRoute>
          }
        />
        
        {/* Consumable Item Routes */}
        <Route
          path="/consumables"
          element={
            <ProtectedRoute><ConsumableItems refresh={refresh} onRefresh={handleRefresh} /></ProtectedRoute>
          }
        />
        <Route
          path="/add-consumable"
          element={
            <AdminProtected><AddConsumable onRefresh={handleRefresh} /></AdminProtected>
          }
        />
        <Route
          path="/consumables/:id"
          element={
            <ProtectedRoute><ConsumableItems refresh={refresh} onRefresh={handleRefresh} /></ProtectedRoute>
          }
        />

        <Route path="/home2" element={<Home />}></Route>
      
      </Routes>
    </BrowserRouter>
  );
}

export default App;