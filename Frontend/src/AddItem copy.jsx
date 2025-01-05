import { useState } from "react";
import { useNavigate } from "react-router-dom";
import "./AddItem.css";
import axios from "axios";

function AddItem(onRefresh) {
  const navigate = useNavigate();

  const handleCancelClick = () => {
    navigate("/inventory");
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
              <input
                type="text"
                placeholder=" Equipment category"
                value={formData.Category}
                onChange={handleChange}
                autoComplete="on"
                name="Category"
                className="typeBoxControl"
              />
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
            type="submit"
            className="loginBtn"
            onClick={handleCancelClick}
          >
            <b>Cancel</b>
          </button>
        </div>
      </div>
    </div>
  );
}

export default AddItem;
