// services/checkinCheckoutService.js
import axios from "axios";

export const getCheckinCheckoutRecords = async () => {
  const response = await axios.get(
    "http://localhost:3001/api/checkin-checkout"
  );
  return response.data;
};

export const addCheckinCheckoutRecord = async (data) => {
  const response = await axios.post(
    "http://localhost:3001/api/checkin-checkout",
    data
  );
  return response.data;
};
