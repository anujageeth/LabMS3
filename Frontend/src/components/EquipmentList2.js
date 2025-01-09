import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import "../components/listModal2.css";
import CategorySelect from "./CategorySelect"; // Assuming you have a separate CategorySelect component

import SideNavigation from "./SideNavigation";
import UserDetails from "./UserDetails";

const EquipmentList2 = ({ refresh, onRefresh }) => {
  const [equipment, setEquipment] = useState([]);
  const [filteredEquipment, setFilteredEquipment] = useState([]); // State for filtered equipment
  const [selectedEquipment, setSelectedEquipment] = useState(null);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editEquipment, setEditEquipment] = useState({
    Name: "",
    Lab: "",
    Category: "",
    Brand: "",
    Quantity: "",
  });

  const [formData, setFormData] = useState({
    Category: "",
  });

  const [categories, setCategories] = useState([]); // To store categories
  const [selectedCategory, setSelectedCategory] = useState(""); // Filter category
  const [searchTerm, setSearchTerm] = useState(""); // State for search input

  useEffect(() => {
    const fetchEquipment = async () => {
      try {
        const response = await axios.get(
          "http://localhost:3001/api/equipmentImage"
        );
        setEquipment(response.data);
        setFilteredEquipment(response.data); // Set initially to show all
      } catch (error) {
        console.error(error);
      }
    };
    fetchEquipment();

    // Fetch categories for the filter dropdown
    const fetchCategories = async () => {
      try {
        const response = await axios.get(
          "http://localhost:3001/api/categories"
        );
        setCategories(response.data);
      } catch (error) {
        console.error("Error fetching categories:", error);
      }
    };
    fetchCategories();
  }, [refresh]);

  const navigate = useNavigate();

  // Filter equipment based on selected category
  const handleCategoryFilter = (categoryId) => {
    setSelectedCategory(categoryId);
    filterEquipment(searchTerm, categoryId); // Update based on both search and category
  };

  const handleSearch = (e) => {
    const value = e.target.value;
    setSearchTerm(value);
    filterEquipment(value, selectedCategory); // Filter with both search and category
  };

  // const filterEquipment = (search, category) => {
  //   const filtered = equipment.filter((item) => {
  //     const matchesCategory = category ? item.Category._id === category : true;
  //     const matchesSearch = item.Name.toLowerCase().includes(
  //       search.toLowerCase()
  //     );
  //     return matchesCategory && matchesSearch;
  //   });
  //   setFilteredEquipment(filtered);
  // };
  const filterEquipment = (search, categoryId) => {
    console.log("Filtering with category:", categoryId, "and search:", search);

    // Find the category name corresponding to the categoryId
    const categoryName = categoryId
      ? categories.find((cat) => String(cat._id) === String(categoryId))?.name
      : "";

    console.log("Category Name for ID:", categoryId, "is", categoryName);

    const filtered = equipment.filter((item) => {
      const matchesCategory = categoryName
        ? item.Category === categoryName // Match category name
        : true;

      const matchesSearch = search
        ? item.Name.toLowerCase().includes(search.toLowerCase()) // Match search term
        : true;

      console.log(
        "Item:",
        item.Name,
        "Category:",
        item.Category,
        "Category Match:",
        matchesCategory,
        "Search Match:",
        matchesSearch
      );

      return matchesCategory && matchesSearch;
    });

    console.log("Filtered Equipment:", filtered);
    setFilteredEquipment(filtered);
  };

  // Open modal to show details when an equipment is selected
  const handleSelect = (item) => {
    setSelectedEquipment(item);
    setEditEquipment(item); // Load selected equipment into edit state
    setIsModalOpen(true);
  };

  // Close the modal
  const closeModal = () => {
    setSelectedEquipment(null);
    setIsModalOpen(false);
  };

  // Handle input changes for editing
  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setEditEquipment((prev) => ({ ...prev, [name]: value }));
  };

  // Handle delete action
  const handleDelete = async (id) => {
    try {
      const token = localStorage.getItem("token");
      if (!token) {
        navigate("/login"); // Redirect if no token is found
        return;
      }
      await axios.delete(`http://localhost:3001/api/equipmentImage/${id}`, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });
      onRefresh(); // Refresh the list after delete
      closeModal(); // Close modal after delete
    } catch (error) {
      if (error.response?.status === 403) {
        console.log("Token expired. Redirecting to login.");
        alert("Your session has expired. Please log in again.");
        localStorage.removeItem("token");
        navigate("/login");
      } else {
        console.error(error);
      }
    }
  };

  // Handle update action
  const handleUpdate = async () => {
    try {
      const token = localStorage.getItem("token");
      if (!token) {
        navigate("/login"); // Redirect if no token is found
        return;
      }
      console.log(selectedEquipment);
      //console.log("Edit Equipment Data:", editEquipment);
      await axios.put(
        `http://localhost:3001/api/equipmentImage/${selectedEquipment._id}`,
        editEquipment,
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );
      onRefresh(); // Refresh the list after update
      closeModal(); // Close modal after update
    } catch (error) {
      if (error.response?.status === 403) {
        console.log("Token expired. Redirecting to login.");
        alert("Your session has expired. Please log in again.");
        localStorage.removeItem("token");
        navigate("/login");
      } else if (error.response?.status === 408) {
        console.log("You have no access");
        alert("Anministrators only");
      } else {
        console.error(
          "Error updating equipment:",
          error.response?.data || error
        );
      }
    }
  };

  const handleDashClick = () => {
    navigate("/dashboard");
  };
  const handleTableViewClick = () => {
    navigate("/table2");
  };
  const handleListViewClick = () => {
    navigate("/table2");
  };

  const handleAddItemClick = () => {
    navigate("/additem");
  };

  const handleLogoutClick = () => {
    navigate("/login");
  };

  return (
    <div className="dashPage">
      <div className="gridBox">
        <SideNavigation />
        <div className="rightPanel">
          <UserDetails />

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
                  <button
                    className="addItemBtn"
                    id="listBtn1"
                    onClick={handleListViewClick}
                  >
                    <b>Table View</b>
                  </button>
                </div>

                <div className="search">
                  <div className="searchContainer">
                    <input
                      type="search"
                      placeholder=" Search..."
                      className="searchInput"
                      value={searchTerm}
                      onChange={handleSearch} // Handle search input
                    />
                  </div>
                  <select
                    id="categoryFilter"
                    value={selectedCategory}
                    onChange={(e) => handleCategoryFilter(e.target.value)}
                  >
                    <option value="">All Categories</option>
                    {categories.map((category) => (
                      <option key={category._id} value={category._id}>
                        {category.name}
                      </option>
                    ))}
                  </select>
                </div>
              </div>
            </div>

            <div className="dataTableBox">
              <ul className="equipment-list2">
                {filteredEquipment.map((item) => (
                  <li key={item._id} className="equipment-item2">
                    <h3>{item.Name}</h3>
                    <p>Lab: {item.Lab}</p>
                    <p>Category: {item.Category}</p>
                    <p>Brand: {item.Brand}</p>
                    <p>
                      Availability:{" "}
                      {item.Availability ? "Available" : "Not Available"}
                    </p>
                    <p>Quantity: {item.Quantity}</p>
                    <p>
                      Added on: {new Date(item.createdAt).toLocaleDateString()}
                    </p>{" "}
                    {/* Display added date */}
                    <p>
                      Last updated on:{" "}
                      {new Date(item.updatedAt).toLocaleDateString()}
                    </p>{" "}
                    {/* Display updated date */}
                    <img src={item.imageUrl === "default"? "https://firebasestorage.googleapis.com/v0/b/labms-images.appspot.com/o/noImageAvailable.png?alt=media&token=ae25d497-543a-4ad6-bbfb-89e970c117f6": item.imageUrl} alt={item.Name} />
                    <br />
                    <button
                      className="listViewBtn2"
                      onClick={() => handleSelect(item)}
                    >
                      Select
                    </button>
                  </li>
                ))}
              </ul>

              {/* Modal for showing and editing selected equipment details */}
              {isModalOpen && selectedEquipment && (
                <div className="listViewModal2">
                  <div className="listViewModal-content2">
                    <h2>Edit Equipment</h2>
                    <input
                      className="listViewModalInput2"
                      type="text"
                      name="Name"
                      value={editEquipment.Name}
                      onChange={handleInputChange}
                      placeholder="Equipment Name"
                    />
                    <input
                      className="listViewModalInput2"
                      type="text"
                      name="Lab"
                      value={editEquipment.Lab}
                      onChange={handleInputChange}
                      placeholder="Lab"
                    />

                    <CategorySelect
                      formData={editEquipment.Category}
                      setFormData={setEditEquipment}
                    />
                    {/*<input
                            className="listViewModalInput2"
                            type="text"
                            name="Category"
                            value={editEquipment.Category}
                            onChange={handleInputChange}
                            placeholder="Category"
                            />*/}

                    <input
                      className="listViewModalInput2"
                      type="text"
                      name="Brand"
                      value={editEquipment.Brand}
                      onChange={handleInputChange}
                      placeholder="Brand"
                    />
                    <input
                      className="listViewModalInput2"
                      type="number"
                      name="Quantity"
                      value={editEquipment.Quantity}
                      onChange={handleInputChange}
                      placeholder="Quantity"
                    />
                    <br />

                    <button className="listViewBtn3" onClick={handleUpdate}>
                      Update
                    </button>
                    <button
                      className="listViewBtn3"
                      id="deleteListBtn"
                      onClick={() => handleDelete(selectedEquipment._id)}
                    >
                      Delete
                    </button>
                    <button
                      className="listViewBtn3"
                      id="closeListBtn"
                      onClick={closeModal}
                    >
                      Close
                    </button>
                  </div>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default EquipmentList2;
