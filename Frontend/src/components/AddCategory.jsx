import React from "react";
import { useState, useEffect } from "react";
import axios from "axios";
import "./CategorySelect.css";

function AddCategory({ showModal, setShowModal }) {
  const [newCategory, setNewCategory] = useState("");
  const [newCategoryDescription, setNewCategoryDescription] = useState("");

  // Close the modal
  const closeModal = () => {
    setShowModal(false);
  };

  const handleAddNewCategory = async () => {
    try {
      const response = await axios.post("http://10.50.227.93:3001/api/category", {
        name: newCategory,
        description: newCategoryDescription,
      });

      // Successfully added category, close modal and reset form
      setShowModal(false);
      setNewCategory("");
      setNewCategoryDescription("");
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
