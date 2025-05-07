import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import "./Inventory.css";

function Inventory() {
  const navigate = useNavigate();

  const handleDashClick = () => {
    navigate("/dashboard");
  };
  const handleTableViewClick = () => {
    navigate("/table");
  };
  const handleListViewClick = () => {
    navigate("/list");
  };

  const handleAddItemClick = () => {
    navigate("/additem");
  };

  const handleLogoutClick = () => {
    navigate("/login");
  };

  const [selectedRow, setSelectedRow] = useState(null);

  const [tableData, setTableData] = useState([
    {
      id: 1,
      name: "Digital Oscilloscope",
      category: "Oscilloscope",
      quantity: 5,
      supplier: "ABC",
    },
    {
      id: 2,
      name: "100 Ohms Resistor",
      category: "Resistor",
      quantity: 1,
      supplier: "DEF",
    },
    {
      id: 3,
      name: "Digital Multimeter",
      category: "Multimeter",
      quantity: 3,
      supplier: "ABC",
    },
  ]);


  return (
    <div className="dashPage">
      <div className="gridBox">
        <div className="navBar">
          <br />
          <div className="uniLogo"></div>
          <div className="navTitleDiv">
            <h2 className="navTitle">LabMS</h2>
          </div>
          <p className="navSubTitle">Laboratory Management System</p>
          <br />

          <button className="navBtn" id="top" onClick={handleDashClick}>
            <b>Dashboard</b>
          </button>
          <br />

          <button className="navBtn" id="activeBtn">
            <b>Inventory Management</b>
          </button>
          <br />

          <button className="navBtn">
            <b>Equipment Management</b>
          </button>
          <br />

          <button className="navBtn">
            <b>Booking & Reservations</b>
          </button>
          <br />

          <button className="navBtn">
            <b>Reports</b>
          </button>
          <br />

          <button className="navBtn">
            <b>User Management</b>
          </button>
          <br />

          <button className="navBtn" id="bottom">
            <b>Feedback</b>
          </button>

          <br />
          <br />
          <button className="logOutBtn" onClick={handleLogoutClick}>
            <b>Log out</b>
          </button>
        </div>
        <div className="rightPanel">
          <div className="userDetails">
            <div className="blankUserDetails"></div>
            <div className="userNameEmail">
              <div className="userNameDiv">
                <b>Jenny Jenny</b>
              </div>
              <div className="userNameDiv">jennyjenny@gmail.com</div>
            </div>
            <div className="userPicDiv"></div>
          </div>

          <div className="dashBoxer">
            <div className="dashBox">
              <div className="dashName">
                <h1 className="pageTitle">Inventory Management</h1>
              </div>

              <div className="addNsearch">
                <div className="addItem">
                  <button
                    className="addItemBtn"
                    id="addBtn"
                    onClick={handleAddItemClick}
                  >
                    <b>Add item</b>
                  </button>
                </div>

                <div className="search">
                  <div className="searchContainer">
                    <input
                      type="search"
                      placeholder=" Search..."
                      className="searchInput"
                    />
                  </div>
                  <button className="searchBtn">
                    <b>Search</b>
                  </button>
                </div>
              </div>
            </div>
            <div className="middleBox">
              <div className="tableDataView" onClick={handleTableViewClick}>
                <b>Table View</b>
              </div>
              <div className="tableDataView" onClick={handleListViewClick}>
                <b>List View</b>
              </div>
            </div>

            {/* <div className="tableContainer">
              <table className="dataTable">
                <thead>
                  <tr>
                    <th>Name</th>
                    <th>Category</th>
                    <th>Quantity</th>
                    <th>Supplier</th>
                    
                  </tr>
                </thead>
                <tbody>
                  {tableData.map((row) => (
                    <tr
                      key={row.id}
                      onClick={() => handleRowClick(row)} // Row click handler
                      style={{
                        backgroundColor:
                          selectedRow?.id === row.id ? "lightblue" : "white",
                      }}
                    >
                      <td>{row.name}</td>
                      <td>{row.category}</td>
                      <td>{row.quantity}</td>
                      <td>{row.supplier}</td>
                      
                  ))}
                </tbody>
              </table>
            </div> */}
          </div>
        </div>
      </div>
    </div>
  );
}

export default Inventory;
