// hooks/useCategories.js
import { useState, useEffect } from "react";
import axios from "axios";

const useCategories = () => {
  const [categories, setCategories] = useState([]);
  const [newCategory, setNewCategory] = useState("");
  const [newCategoryDescription, setNewCategoryDescription] = useState("");
  const [showModal, setShowModal] = useState(false);

  // Fetch categories
  useEffect(() => {
    const fetchCategories = async () => {
      try {
        const response = await axios.get(
          "http://10.50.227.93:3001/api/categories"
        );
        setCategories(response.data);
      } catch (error) {
        console.error("Error fetching categories:", error);
      }
    };

    fetchCategories();
  }, []);

  // Add new category
  const handleAddNewCategory = async () => {
    try {
      const response = await axios.post("http://10.50.227.93:3001/api/category", {
        name: newCategory,
        description: newCategoryDescription,
      });

      setCategories((prev) => [...prev, response.data.category]);
      setNewCategory(""); // Clear input fields
      setNewCategoryDescription("");
      setShowModal(false); // Close modal after adding category
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

  return {
    categories,
    newCategory,
    setNewCategory,
    newCategoryDescription,
    setNewCategoryDescription,
    showModal,
    setShowModal,
    handleAddNewCategory,
  };
};

export default useCategories;
