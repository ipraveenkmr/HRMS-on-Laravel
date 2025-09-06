import axios from 'axios';

const baseURL = process.env.REACT_APP_API_URL || 'http://localhost:8000/api/';

const userService = {
  // Create a new user
  createUser: async (userData) => {
    try {
      // Only send fields that the backend can handle
      const basicUserData = {
        username: userData.username,
        password: userData.password,
        is_active: userData.is_active !== undefined ? userData.is_active : true
      };
      
      const response = await axios.post(`${baseURL}auth/signup`, basicUserData);
      return response.data;
    } catch (error) {
      throw error.response?.data || error.message;
    }
  },

  // Get all users
  getUsers: async () => {
    try {
      const response = await axios.get(`${baseURL}auth/users`);
      return response.data;
    } catch (error) {
      throw error.response?.data || error.message;
    }
  },

  // Update a user
  updateUser: async (userId, userData) => {
    try {
      // Only send fields that the backend can handle
      const basicUserData = {
        username: userData.username,
        is_active: userData.is_active
      };
      
      // Only include password if it's provided
      if (userData.password) {
        basicUserData.password = userData.password;
      }
      
      const response = await axios.put(`${baseURL}auth/users/${userId}`, basicUserData);
      return response.data;
    } catch (error) {
      throw error.response?.data || error.message;
    }
  },

  // Reset user password
  resetPassword: async (userId, newPassword) => {
    try {
      const response = await axios.post(`${baseURL}auth/users/${userId}/reset-password`, {
        user_id: userId,
        new_password: newPassword
      });
      return response.data;
    } catch (error) {
      throw error.response?.data || error.message;
    }
  },

  // Delete a user
  deleteUser: async (userId) => {
    try {
      const response = await axios.delete(`${baseURL}auth/users/${userId}`);
      return response.data;
    } catch (error) {
      throw error.response?.data || error.message;
    }
  }
};

export default userService;