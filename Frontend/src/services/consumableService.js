import axios from "axios";

const API_BASE_URL = "http://localhost:3001/api/consumables";

// Helper function to get auth token
const getAuthConfig = () => {
  const token = localStorage.getItem('token');
  return {
    headers: {
      Authorization: `Bearer ${token}`
    }
  };
};

export const getAllConsumables = async (page = 1, limit = 10) => {
  try {
    const response = await axios.get(`${API_BASE_URL}`, {
      params: { page, limit },
      ...getAuthConfig()
    });
    return response.data;
  } catch (error) {
    console.error('Error fetching consumables:', error);
    throw error;
  }
};

export const searchConsumables = async (query, page = 1, limit = 10) => {
  try {
    const response = await axios.get(`${API_BASE_URL}/search`, {
      params: { query, page, limit },
      ...getAuthConfig()
    });
    return response.data;
  } catch (error) {
    console.error('Error searching consumables:', error);
    throw error;
  }
};

export const createConsumable = async (consumableData) => {
  try {
    const response = await axios.post(API_BASE_URL, consumableData, getAuthConfig());
    return response.data;
  } catch (error) {
    console.error('Error creating consumable:', error);
    throw error;
  }
};

export const updateConsumable = async (id, consumableData) => {
  try {
    const response = await axios.put(`${API_BASE_URL}/${id}`, consumableData, getAuthConfig());
    return response.data;
  } catch (error) {
    console.error('Error updating consumable:', error);
    throw error;
  }
};

export const deleteConsumable = async (id) => {
  try {
    const response = await axios.delete(`${API_BASE_URL}/${id}`, getAuthConfig());
    return response.data;
  } catch (error) {
    console.error('Error deleting consumable:', error);
    throw error;
  }
};

export const updateQuantity = async (id, quantity, action) => {
  try {
    const response = await axios.patch(`${API_BASE_URL}/${id}/quantity`, {
      quantity,
      action
    }, getAuthConfig());
    return response.data;
  } catch (error) {
    console.error('Error updating quantity:', error);
    throw error;
  }
};

export const getLowStockItems = async () => {
  try {
    const response = await axios.get(`${API_BASE_URL}/low-stock`, getAuthConfig());
    return response.data;
  } catch (error) {
    console.error('Error fetching low stock items:', error);
    throw error;
  }
}; 