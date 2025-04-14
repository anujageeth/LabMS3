import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import "./AddItem.css";
import SidePopup from "./components/SidePopup"
import AddConsumableItems from "./components/consumables/AddConsumableItems";

function AddItem({ onRefresh }) {
  const navigate = useNavigate();
  const [isSuccessPopupOpen, setIsSuccessPopupOpen] = useState(false);
  const [isErrorPopupOpen, setIsErrorPopupOpen] = useState(false);
  const [isConsumableView, setIsConsumableView] = useState(false);
  const [successMessage, setSuccessMessage] = useState("Added new equipment");

  const [equipment, setEquipment] = useState([]);
  const [formData, setFormData] = useState({
    Name: "",
    Lab: "",
    Category: "",
    Brand: "",
    Serial: "",
    Availability: true,
    image: null,
  });

  // Fetch existing equipment for dropdown selections
  useEffect(() => {
    const fetchEquipment = async () => {
      try {
        const response = await axios.get("http://localhost:3001/api/equipmentImage");
        setEquipment(response.data);
      } catch (error) {
        console.error("Error fetching equipment:", error);
      }
    };
    fetchEquipment();
  }, []);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleFileChange = (e) => {
    setFormData((prev) => ({
      ...prev,
      image: e.target.files[0],
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    if (!formData.Serial) {
      alert("Serial number is required.");
      return;
    }

    const formDataToSend = new FormData();
    Object.entries(formData).forEach(([key, value]) => {
      formDataToSend.append(key, value);
    });

    setSuccessMessage("Added new equipment");
    setIsSuccessPopupOpen(true);

    try {
      const token = localStorage.getItem("token");
      if (!token) {
        navigate("/login"); // Redirect if no token found
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

      //handleCancelClick();
      onRefresh();
      setFormData({
        
        Serial: "",
        Availability: true,
        image: null,
      });
    } catch (error) {
      if (error.response?.status === 403) {
        alert("Session expired. Please log in again.");
       // localStorage.removeItem("token");
        navigate("/login");
      } else {
        setIsErrorPopupOpen(true);
        console.error("Error adding equipment:", error);
      }
    }
  };

  const handleCancelClick = () => {
    navigate("/table2");
  };

  const handleConsumableSuccess = () => {
    setSuccessMessage("Added new consumable item");
    setIsSuccessPopupOpen(true);
    onRefresh && onRefresh();
  };

  return (
    <div className="loginPage">
      <div className="fullBox">
        <div className="overlay"></div>
        <div className="loginBox" id="addUserBox">
          <div className="form-toggle-header">
            <h2 className="loginTitle">
              {isConsumableView ? "Add Consumable Item" : "Add Equipment"}
            </h2>
            <button 
              type="button" 
              className="toggle-view-btn"
              onClick={() => setIsConsumableView(!isConsumableView)}
            >
              Switch to {isConsumableView ? "Equipment" : "Consumable"}
            </button>
          </div>

          {isConsumableView ? (
            <AddConsumableItems onRefresh={handleConsumableSuccess} />
          ) : (
            <form onSubmit={handleSubmit}>
              
              {/* Name Selection */}
              <select name="Name" value={formData.Name} onChange={handleChange} className="typeBoxControl" id="addAvailabilityBtn">
                <option value="">Select Existing Name or Enter New</option>
                {[...new Set(equipment.map((item) => item.Name))].map((n) => (
                  <option key={n} value={n}>{n}</option>
                ))}
              </select>
              <input
                type="text"
                placeholder="Or Enter New Name"
                name="Name"
                value={formData.Name}
                onChange={handleChange}
                className="typeBoxControl"
              />

              {/* Category Selection */}
              <select name="Category" value={formData.Category} onChange={handleChange} className="typeBoxControl" id="addAvailabilityBtn">
                <option value="">Select Existing Category or Enter New</option>
                {[...new Set(equipment.map((item) => item.Category))].map((c) => (
                  <option key={c} value={c}>{c}</option>
                ))}
              </select>
              <input
                type="text"
                placeholder="Or Enter New Category"
                name="Category"
                value={formData.Category}
                onChange={handleChange}
                className="typeBoxControl"
              />

              {/* Brand Selection */}
              <select name="Brand" value={formData.Brand} onChange={handleChange} className="typeBoxControl" id="addAvailabilityBtn">
                <option value="">Select Existing Brand or Enter New</option>
                {[...new Set(equipment.map((item) => item.Brand))].map((b) => (
                  <option key={b} value={b}>{b}</option>
                ))}
              </select>
              <input
                type="text"
                placeholder="Or Enter New Brand"
                name="Brand"
                value={formData.Brand}
                onChange={handleChange}
                className="typeBoxControl"
              />

              {/* Serial Number */}
              <div className="typeBox">
                <input
                  type="text"
                  placeholder="Serial Code"
                  name="Serial"
                  value={formData.Serial}
                  onChange={handleChange}
                  required
                  className="typeBoxControl"
                />
              </div>

              {/* Lab Selection */}
              <label>
                <select className="typeBoxControl" id="addAvailabilityBtn" name="Lab" value={formData.Lab} onChange={handleChange}>
                  <option value="" disabled>Select Lab</option>
                  <option value="Electrical Machines Lab">Electrical Machines Lab</option>
                  <option value="Communication Lab">Communication Lab</option>
                  <option value="Measurements Lab">Measurements Lab</option>
                  <option value="High Voltage Lab">High Voltage Lab</option>
                </select>
              </label>

              <br/>

              {/* Availability Checkbox */}
              <label>
                <input
                  type="checkbox"
                  name="Availability"
                  checked={formData.Availability}
                  onChange={() => setFormData((prev) => ({ ...prev, Availability: !prev.Availability }))}
                /> Available
              </label>

              {/* Image Upload */}
              <div className="addItemImageBox">
                <input
                  className="addImageBtn"
                  type="file"
                  name="image"
                  onChange={handleFileChange}
                  accept="image/*"
                />
              </div>

              {/* Submit Button */}
              <button type="submit" className="loginBtn"><b>SAVE</b></button>
            </form>
          )}

          {/* Cancel Button - Always shown regardless of form type */}
          <button type="button" className="loginBtn" onClick={handleCancelClick}><b>Cancel</b></button>
        </div>
      </div>

      <SidePopup
        type="success"
        title="Successful"
        message={successMessage}
        isOpen={isSuccessPopupOpen}
        onClose={() => setIsSuccessPopupOpen(false)}
        duration={3000} // Optional: customize duration in milliseconds
      />

      <SidePopup
        type="error"
        title="Error"
        message="Couldn't add new item"
        isOpen={isErrorPopupOpen}
        onClose={() => setIsErrorPopupOpen(false)}
        duration={3000} // Optional: customize duration in milliseconds
      />
    </div>
  );
}

export default AddItem;
