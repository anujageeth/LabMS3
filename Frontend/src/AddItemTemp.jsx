import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import "./AddItem.css";

function AddItemTemp({ onRefresh }) {
  const navigate = useNavigate();
  const [categories, setCategories] = useState([]);
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
      await axios.post(
        "http://localhost:3001/api/equipmentImage",
        formDataToSend,
        {
          headers: {
            "Content-Type": "multipart/form-data",
          },
        }
      );
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
      console.error(error);
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
    <div className="addItemPage">
      <div className="fullBox">
        <div className="overlay"></div>
        <div className="loginBox">
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
            <div className="typeBox">
              <input
                type="text"
                name="Lab"
                placeholder=" Lab"
                autoComplete="on"
                value={formData.Lab}
                onChange={handleChange}
                className="typeBoxControl"
              />
            </div>
            <div className="typeBox">
              {/* Category Select */}
              <select
                name="Category"
                value={formData.Category}
                onChange={handleChange}
                className="typeBoxControl"
              >
                <option value="">Select Category</option>
                {categories.map((category) => (
                  <option key={category._id} value={category._id}>
                    {category.name}
                  </option>
                ))}
              </select>
              <button type="button" onClick={() => setShowModal(true)}>
                Add New Category
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
              Availability:
              <select
                name="Availability"
                value={formData.Availability}
                onChange={handleChange}
              >
                <option value="true">Available</option>
                <option value="false">Not Available</option>
              </select>
            </label>
            <div className="typeBox">
              <input
                type="file"
                name="image"
                onChange={handleFileChange}
                accept="image/*"
              />
            </div>
            <button type="submit" className="loginBtn">
              <b>SAVE</b>
            </button>
          </form>

          <button
            type="button"
            className="loginBtn"
            onClick={() => navigate("/inventory")}
          >
            <b>Cancel</b>
          </button>
        </div>
      </div>

      {/* Modal for adding new category */}
      {showModal && (
        <div className="catModal">
          <div className="catModalContent">
            <h3>Add New Category</h3>
            <input
              type="text"
              placeholder="New Category Name"
              value={newCategory}
              onChange={(e) => setNewCategory(e.target.value)}
            />
            <textarea
              placeholder="New Category Description"
              value={newCategoryDescription}
              onChange={(e) => setNewCategoryDescription(e.target.value)}
            ></textarea>
            <button onClick={handleAddNewCategory}>Add Category</button>
            <button onClick={() => setShowModal(false)}>Close</button>
          </div>
        </div>
      )}
    </div>
  );
}

export default AddItemTemp;
