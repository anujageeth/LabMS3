import { useState } from "react";
import { BrowserRouter, Routes, Route } from "react-router-dom";
//import 'bootstrap/dist/css/bootstrap.min.css'
import Login from "./Login";
import Dashboard from "./Dashboard";
import Inventory from "./Inventory";
import AddItem from "./AddItem";
import AddUser from "./AddUser";
import Home from "./Home";
import ReportPage1 from "./components/ReportPage1";
import AddItemTemp from "./AddItemTemp";
import EquipmentPage1 from "./EquipmentPage1";
import UserManagePage1 from "./UserManagePage1";
import CheckinCheckoutPage from "./equipmentManagement";
import EquipmentTable from "./components/EquipmentTable";
import EquipmentTable2 from "./components/EquipmentTable2";
//import EquipmentList from "./components/EquipmentList";
import EquipmentList2 from "./components/EquipmentList2";
import ProtectedRoute from "./services/ProtectedRoute";
import CheckInOutHistory from "./CheckInOutHistory";
import CheckInOutForm from "./CheckInOutForm";
import BookingPage from "./BookingPage";





function App() {
  const [user, setUser] = useState(null);
  const [refresh, setRefresh] = useState(false);

  const handleRefresh = () => {
    setRefresh(!refresh);
  };

  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<Home />}></Route>
        <Route
          path="/login"
          element={<Login user={user} setUser={setUser} />}
        ></Route>
        <Route
          path="/dashboard"
          element={<Dashboard user={user} setUser={setUser} />}
        ></Route>
        <Route path="/inventory" element={<Inventory />}></Route>
        <Route
          path="/additem"
          element={<AddItem onRefresh={handleRefresh} />}
        ></Route>
        <Route
          path="/additemtemp"
          element={<AddItemTemp onRefresh={handleRefresh} />}
        ></Route>
        <Route path="/adduser" element={<AddUser />}></Route>
        <Route
          path="/table"
          element={
            <EquipmentTable refresh={refresh} onRefresh={handleRefresh} />
          }
        />
        <Route
          path="/table2"
          element={
            <EquipmentTable2 refresh={refresh} onRefresh={handleRefresh} />
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
            <EquipmentList2 refresh={refresh} onRefresh={handleRefresh} />
          }
        />
        <Route
          path="/report1"
          element={<ReportPage1 refresh={refresh} onRefresh={handleRefresh} />}
        />
        <Route
          path="/equipment1"
          element={
            <EquipmentPage1 refresh={refresh} onRefresh={handleRefresh} />
          }
        />
        <Route
          path="/usermanage1"
          element={
            <UserManagePage1 refresh={refresh} onRefresh={handleRefresh} />
          }
        />
        <Route
          path="/checkin-checkout"
          element={
            <CheckinCheckoutPage refresh={refresh} onRefresh={handleRefresh} />
          }
        />
        <Route
          path="/checkinouthistory"
          element={
            <CheckInOutHistory refresh={refresh} onRefresh={handleRefresh} />
          }
        />
        <Route
          path="/checkinoutform"
          element={
            <CheckInOutForm refresh={refresh} onRefresh={handleRefresh} />
          }
        />

<Route
          path="/booking"
          element={
            <BookingPage refresh={refresh} onRefresh={handleRefresh} />
          }
        />
      
      </Routes>
    </BrowserRouter>
  );
}

export default App;