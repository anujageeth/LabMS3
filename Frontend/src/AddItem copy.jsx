import { useState, useEffect } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import axios from "axios";
import "./AddItem.css";
import SidePopup from "./components/SidePopup"
import AddConsumableItems from "./components/consumables/AddConsumableItems";

function AddItem({ onRefresh }) {
  const navigate = useNavigate();
  const location = useLocation();
  const [isSuccessPopupOpen, setIsSuccessPopupOpen] = useState(false);
  const [isErrorPopupOpen, setIsErrorPopupOpen] = useState(false);
  const [isConsumableView, setIsConsumableView] = useState(
    // Check if we were navigated here with a request to show the consumable form
    location.state?.showConsumableForm || false
  );
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

  const [uniqueValues, setUniqueValues] = useState({
    names: [],
    categories: [],
    brands: []
  });

  // Fetch existing equipment for dropdown selections
  // useEffect(() => {
  //   const fetchEquipment = async () => {
  //     try {
  //       const response = await axios.get("http://10.50.227.93:3001/api/equipmentImage");
  //       setEquipment(response.data);
  //     } catch (error) {
  //       console.error("Error fetching equipment:", error);
  //     }
  //   };
  //   fetchEquipment();
  // }, []);

  useEffect(() => {
    const fetchUniqueValues = async () => {
      try {
        const token = localStorage.getItem("token");
        const response = await axios.get("http://10.50.227.93:3001/api/equipmentImage/unique-values", {
          headers: { Authorization: `Bearer ${token}` }
        });
        setUniqueValues(response.data.data);
      } catch (error) {
        console.error("Error fetching unique values:", error);
        if (error.response?.status === 403) {
        
        }
      }
    };

    fetchUniqueValues();
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
        "http://10.50.227.93:3001/api/equipmentImage",
        formDataToSend,
        {
          headers: {
            Authorization: `Bearer ${token}`,
            "Content-Type": "multipart/form-data",
          },
        }
      );

      //handleCancelClick();
      onRefresh && onRefresh();
      setFormData({
        Name: "",
        Lab: "",
        Category: "",
        Brand: "",
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
    // If we came from the consumables page, go back there
    if (location.state?.fromConsumables) {
      navigate("/consumables");
    } else {
      navigate("/table2");
    }
  };

  const handleConsumableSuccess = () => {
    setSuccessMessage("Added new consumable item");
    setIsSuccessPopupOpen(true);
    onRefresh && onRefresh();
    
    // Reset form after successful addition
    setTimeout(() => {
      if (location.state?.fromConsumables) {
        navigate("/consumables");
      }
    }, 1500); // Wait for popup to be seen
  };

  return (
    <div className="loginPage">
      <div className="fullBox">
        <div className="overlay"></div>
        <div className="loginBox" id="addUserBox">
          <h2 className="loginTitle">
              {isConsumableView ? "Add Consumable Item" : "Add Equipment"}
          </h2>

          {isConsumableView ? (
            <AddConsumableItems onRefresh={handleConsumableSuccess} />
          ) : (
            <form onSubmit={handleSubmit}>
              
              {/* Name Selection */}
              <select name="Name" value={formData.Name} onChange={handleChange} className="typeBoxControl">
                <option value="">Select Existing Name</option>
                {uniqueValues.names.map(name => (
                  <option key={name} value={name}>{name}</option>
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
              <select name="Category" value={formData.Category} onChange={handleChange} className="typeBoxControl">
                <option value="">Select Existing Category</option>
                {uniqueValues.categories.map(category => (
                  <option key={category} value={category}>{category}</option>
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
              <select name="Brand" value={formData.Brand} onChange={handleChange} className="typeBoxControl">
                <option value="">Select Existing Brand</option>
                {uniqueValues.brands.map(brand => (
                  <option key={brand} value={brand}>{brand}</option>
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
              <br />

              {/* Image Upload */}
              {/* <div className="addItemImageBox">
                <input
                  className="addImageBtn"
                  type="file"
                  name="image"
                  onChange={handleFileChange}
                  accept="image/*"
                />
              </div> */}

              {/* Submit Button */}
              <button type="submit" className="loginBtn" id="saveUserBtn"><b>SAVE</b></button>
            </form>
          )}

          <button
            type="button" 
            className="loginBtn"
            onClick={() => setIsConsumableView(!isConsumableView)}
          >
            <b>Switch to {isConsumableView ? "Equipment" : "Consumable"}</b>
          </button>

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
