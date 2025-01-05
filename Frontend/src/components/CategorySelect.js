// components/CategorySelect.js
import React from "react";
import useCategories from "../hooks/useCategories";
import "../components/CategorySelect.css";
import AddCategory from "./AddCategory";

const CategorySelect = ({ formData, setFormData }) => {
  const {
    categories,
    newCategory,
    setNewCategory,
    newCategoryDescription,
    setNewCategoryDescription,
    showModal,
    setShowModal,
    handleAddNewCategory,
  } = useCategories();

  const handleChange = (e) => {
    setFormData((prev) => ({ ...prev, Category: e.target.value }));
  };

  return (
    <div className="typeBox">
      {/* Category Select */}
      <select
        name="Category"
        value={formData.Category}
        onChange={handleChange}
        className="listViewModalInput2"
        id="catSelectCategory"
      >
        <option value="">Select Category</option>
        {categories.map((category) => (
          <option key={category._id} value={category._id}>
            {category.name}
          </option>
        ))}
      </select>

      {/* Add New Category Button */}
      <button
        type="button"
        onClick={() => setShowModal(true)}
        className="typeBoxControl"
        id="addCategoryBtn"
      >
        New
      </button>

      {/* Add New Category Modal */}
      <AddCategory showModal={showModal} setShowModal={setShowModal} />
    </div>
  );
};

export default CategorySelect;
