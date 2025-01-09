import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import "./AddItem.css";
import axios from "axios";

import AddCategory from "./components/AddCategory";

function AddItem(onRefresh) {
  const navigate = useNavigate();
  const [categories, setCategories] = useState([]);

  const handleCancelClick = () => {
    navigate("/table2");
  };

  const [formData, setFormData] = useState({
    Name: "",
    Lab: "",
    Category: "",
    Brand: "",
    Availability: true,
    Quantity: 1,
    image: null,
  });

  const [showModal, setShowModal] = useState(false); // For the add new category modal
  const [newCategory, setNewCategory] = useState(""); // State to handle new category
  const [newCategoryDescription, setNewCategoryDescription] = useState(""); // State to handle new category description

  // Fetch categories when the component loads
  useEffect(() => {
    const fetchCategories = async () => {
      try {
        const response = await axios.get(
          "http://localhost:3001/api/categories"
        );
        setCategories(response.data); // Set the fetched categories
      } catch (error) {
        console.error("Error fetching categories:", error);
      }
    };

    fetchCategories();
  }, []);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleFileChange = (e) => {
    setFormData((prev) => ({
      ...prev,
      image: e.target.files[0],
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    const formDataToSend = new FormData();
    Object.entries(formData).forEach(([key, value]) => {
      formDataToSend.append(key, value);
    });

    try {
      const token = localStorage.getItem("token");
      if (!token) {
        navigate("/login"); // Redirect if no token is found
        return;
      }
      await axios.post(
        "http://localhost:3001/api/equipmentImage",
        formDataToSend,
        {
          headers: {
            Authorization: `Bearer ${token}`,
            "Content-Type": "multipart/form-data",
          },
        }
      );
      handleCancelClick();
      onRefresh();
      setFormData({
        Name: "",
        Lab: "",
        Category: "",
        Brand: "",
        Availability: true,
        Quantity: 1,
        image: null,
      });
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
        console.error(error);
      }
    }
  };

  const handleAddNewCategory = async () => {
    try {
      const response = await axios.post("http://localhost:3001/api/category", {
        name: newCategory,
        description: newCategoryDescription, // Add this if required
      });

      setCategories((prev) => [...prev, response.data.category]);
      setFormData((prev) => ({
        ...prev,
        Category: response.data.category._id,
      }));
      setShowModal(false);
      setNewCategory("");
    } catch (error) {
      if (error.response) {
        console.error(
          "Server responded with an error:",
          error.response.data.message
        );
      } else if (error.request) {
        console.error("No response received:", error.request);
      } else {
        console.error("Error setting up the request:", error.message);
      }
    }
  };

  return (
    <div className="loginPage">
      <div className="fullBox">
        <div className="overlay"></div>
        <div className="loginBox" id="addUserBox">
          <h2 className="loginTitle">Add item</h2>
          <form onSubmit={handleSubmit}>
            <div className="typeBox">
              <input
                type="text"
                name="Name"
                placeholder=" Equipment name"
                autoComplete="on"
                value={formData.Name}
                onChange={handleChange}
                className="typeBoxControl"
              />
            </div>
            <label>
              <select
                className="typeBoxControl"
                id="addAvailabilityBtn"
                name="Lab"
                value={formData.Lab}
                onChange={handleChange}
              >
                <option value="" disabled>
                  Select Lab
                </option>
                <option value="Electrical machines Lab">Electrical Machines Lab</option>
                <option value="Communication Lab">Communication Lab</option>
                <option value="Measurements Lab">Measurements Lab</option>
                <option value="High Voltage Lab">High Voltage Lab</option>
              </select>
            </label>

            <div className="typeBox">
              {/* Category Select */}
              <select
                name="Category"
                value={formData.Category}
                onChange={handleChange}
                className="typeBoxControl"
                id="categorySelectBox"
              >
                <option value="">Select Category</option>
                {categories.map((category) => (
                  <option key={category._id} value={category._id}>
                    {category.name}
                  </option>
                ))}
              </select>
              <button
                type="button"
                onClick={() => setShowModal(true)}
                className="typeBoxControl"
                id="addCategoryBtn"
              >
                New
              </button>
            </div>

            <div className="typeBox">
              <input
                type="text"
                placeholder="Brand"
                value={formData.Brand}
                onChange={handleChange}
                autoComplete="on"
                name="Brand"
                className="typeBoxControl"
              />
            </div>
            <div className="typeBox">
              <input
                type="number"
                placeholder=" Quantity"
                autoComplete="on"
                name="Quantity"
                value={formData.Quantity}
                onChange={handleChange}
                className="typeBoxControl"
              />
            </div>
            <label>
              <select
                className="typeBoxControl"
                id="addAvailabilityBtn"
                name="Availability"
                value={formData.Availability}
                onChange={handleChange}
              >
                <option
                  value="true"
                  className="addItemDropItem"
                  id="addItemDropItemTop"
                >
                  Available
                </option>
                <option
                  value="false"
                  className="addItemDropItem"
                  id="addItemDropItemBottom"
                >
                  Not Available
                </option>
              </select>
            </label>
            <div className="addItemImageBox">
              <input
                className="addImageBtn"
                type="file"
                name="image"
                onChange={handleFileChange}
                accept="image/*"
              />
            </div>

            <button
              type="submit"
              className="loginBtn"
              id="saveUserBtn"
              onClick={handleSubmit}
            >
              <b>SAVE</b>
            </button>
          </form>

          <button
            type="submit"
            className="loginBtn"
            onClick={handleCancelClick}
          >
            <b>Cancel</b>
          </button>
        </div>
      </div>

      {/* Modal for adding new category */}
      <AddCategory showModal={showModal} setShowModal={setShowModal} />
    </div>
  );
}

export default AddItem;
