// services/equipmentService.js
import axios from "axios";

export const getAllEquipment = async () => {
  const response = await axios.get("http://localhost:3001/api/equipmentImage");
  return response.data;
};
