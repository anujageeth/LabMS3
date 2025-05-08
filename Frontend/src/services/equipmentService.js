// services/equipmentService.js
import axios from "axios";

export const getAllEquipment = async () => {
  const response = await axios.get("http://10.50.227.93:3001/api/equipmentImage");
  return response.data;
};
