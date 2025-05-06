import React from "react";
import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import "./CategorySelect.css";

function AddCategory({ showModal, setShowModal }) {
  const navigate = useNavigate();
  const [setCategories] = useState([]);

  const [setFormData] = useState({
    Name: "",
    Lab: "",
    Category: "",
    Brand: "",
    Availability: true,
    Quantity: 1,
    image: null,
  });

  const [newCategory, setNewCategory] = useState(""); 
  const [newCategoryDescription, setNewCategoryDescription] = useState(""); 

  
  const closeModal = () => {
    setShowModal(false);
  };

  
  useEffect(() => {
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
  }, []);

  const handleAddNewCategory = async () => {
    try {
      const response = await axios.post("http://localhost:3001/api/category", {
        name: newCategory,
        description: newCategoryDescription, 
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
    <div>
      {showModal && (
        <div>
          <div className="overlay"></div>
          <div className="catModal">
            <div className="catModalContent">
              <h3 className="AddCatTitle">Add New Category</h3>
              <input
                type="text"
                placeholder="Name*"
                className="typeBoxControl"
                value={newCategory}
                onChange={(e) => setNewCategory(e.target.value)}
              />
              <textarea
                placeholder="Description (optional)"
                className="typeBoxControl"
                id="catDescription"
                value={newCategoryDescription}
                onChange={(e) => setNewCategoryDescription(e.target.value)}
              ></textarea>
              <button
                onClick={handleAddNewCategory}
                className="loginBtn"
                id="saveCatBtn"
              >
                Add Category
              </button>
              <button
                onClick={closeModal}
                className="loginBtn"
                id="cancelCatBtn"
              >
                Close
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

export default AddCategory;
