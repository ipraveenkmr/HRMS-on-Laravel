import axios from 'axios';

const baseURL = process.env.REACT_APP_API_URL || 'http://localhost:8000/api/';

const travelExpenseService = {
  // Get all travel expenses
  getTravelExpenses: async () => {
    try {
      const response = await axios.get(`${baseURL}travel-expenses`);
      return response.data;
    } catch (error) {
      throw error.response?.data || error.message;
    }
  },

  // Get travel expense by ID
  getTravelExpenseById: async (expenseId) => {
    try {
      const response = await axios.get(`${baseURL}travel-expenses/${expenseId}`);
      return response.data;
    } catch (error) {
      throw error.response?.data || error.message;
    }
  },

  // Get travel expenses by employee username
  getEmployeeTravelExpenses: async (username) => {
    try {
      const response = await axios.get(`${baseURL}travel-expenses/employee/${username}`);
      return response.data;
    } catch (error) {
      throw error.response?.data || error.message;
    }
  },

  // Get travel expenses by employee ID
  getTravelExpensesByEmployeeId: async (employeeId) => {
    try {
      const response = await axios.get(`${baseURL}travel-expenses/employee-id/${employeeId}`);
      return response.data;
    } catch (error) {
      throw error.response?.data || error.message;
    }
  },

  // Get travel expenses by manager employee ID
  getTravelExpensesByDepartment: async (employeeId) => {
    try {
      const response = await axios.get(`${baseURL}travel-expenses/manager/${employeeId}`);
      return response.data;
    } catch (error) {
      throw error.response?.data || error.message;
    }
  },

  // Get travel expenses by status
  getTravelExpensesByStatus: async (status) => {
    try {
      const response = await axios.get(`${baseURL}travel-expenses/status/${status}`);
      return response.data;
    } catch (error) {
      throw error.response?.data || error.message;
    }
  },

  // Create a new travel expense
  createTravelExpense: async (expenseData) => {
    try {
      const response = await axios.post(`${baseURL}travel-expenses`, expenseData);
      return response.data;
    } catch (error) {
      throw error.response?.data || error.message;
    }
  },

  // Update a travel expense
  updateTravelExpense: async (expenseId, expenseData) => {
    try {
      const response = await axios.put(`${baseURL}travel-expenses/${expenseId}`, expenseData);
      return response.data;
    } catch (error) {
      throw error.response?.data || error.message;
    }
  },

  // Update expense status (approve/reject)
  updateExpenseStatus: async (expenseId, status, approvedBy = null, remarks = null) => {
    try {
      const params = new URLSearchParams();
      params.append('status', status);
      if (approvedBy) params.append('approved_by', approvedBy);
      if (remarks) params.append('remarks', remarks);

      const response = await axios.patch(`${baseURL}travel-expenses/${expenseId}/status?${params}`);
      return response.data;
    } catch (error) {
      throw error.response?.data || error.message;
    }
  },

  // Delete a travel expense
  deleteTravelExpense: async (expenseId) => {
    try {
      const response = await axios.delete(`${baseURL}travel-expenses/${expenseId}`);
      return response.data;
    } catch (error) {
      throw error.response?.data || error.message;
    }
  },

  // Get expense summary statistics
  getExpenseSummary: async () => {
    try {
      const response = await axios.get(`${baseURL}travel-expenses/stats/summary`);
      return response.data;
    } catch (error) {
      throw error.response?.data || error.message;
    }
  },

  // Get expense types (predefined list)
  getExpenseTypes: () => {
    return [
      'Transportation',
      'Accommodation',
      'Meals',
      'Fuel',
      'Parking',
      'Tolls',
      'Local Transport',
      'Client Meeting',
      'Conference',
      'Training',
      'Other'
    ];
  },

  // Get expense status options
  getStatusOptions: () => {
    return ['Pending', 'Approved', 'Rejected'];
  },

  // Get currency options
  getCurrencyOptions: () => {
    return [
      { value: 'INR', label: '₹ INR' },
      { value: 'USD', label: '$ USD' },
      { value: 'EUR', label: '€ EUR' },
      { value: 'GBP', label: '£ GBP' }
    ];
  }
};

export default travelExpenseService;