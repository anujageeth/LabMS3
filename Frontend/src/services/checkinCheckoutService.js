// services/checkinCheckoutService.js
import axios from "axios";

export const getCheckinCheckoutRecords = async () => {
  const response = await axios.get(
    "http://10.50.227.93:3001/api/checkin-checkout"
  );
  return response.data;
};

export const addCheckinCheckoutRecord = async (data) => {
  const response = await axios.post(
    "http://10.50.227.93:3001/api/checkin-checkout",
    data
  );
  return response.data;
};
