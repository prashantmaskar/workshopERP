import axios from 'axios';

// The URL where your Node.js backend is running
const API_URL = 'https://workshoperpbakend.onrender.com/api';

export const clientService = {
  // Create a new customer in the database
  createClient: async (clientData) => {
    try {
      const response = await axios.post(`${API_URL}/clients`, clientData);
      return response.data;
    } catch (error) {
      console.error("API Error during client creation:", error);
      throw error;
    }
  },

  // Fetch all customers for dropdowns in Quotation/PO modules
  getClients: async () => {
    try {
      const response = await axios.get(`${API_URL}/clients`);
      return response.data;
    } catch (error) {
      console.error("API Error fetching clients:", error);
      throw error;
    }
  }
};
