// src/api/authService.js
import axios from 'axios';

const AUTH_BASE_URL = 'http://54.227.34.249:3000/api/auth';

// Create a configured axios instance for auth requests
const authAxios = axios.create({
  baseURL: AUTH_BASE_URL,
  headers: {
    'Content-Type': 'application/json'
  },
  // Add this to help with CORS issues during development
  withCredentials: false
});

const authService = {
  login: async (email, password) => {
    try {
      const response = await authAxios.post(
        '/login',
        { email, password }
      );

      if (response.status === 200) {
        console.log('Login response:', response.data); // Add logging
        return response.data;
      } else {
        throw new Error(response.data?.message || 'Something went wrong. Try again.');
      }
    } catch (error) {
      console.error('Login error:', error.response || error); // Improved error logging
      throw new Error(
        error.response?.data?.message || 'Authentication failed. Please check your credentials.'
      );
    }
  },

  signup: async (name, email, password, phone, isBusiness) => {
    try {
      const response = await authAxios.post(
        '/register',  // Changed from '/signup' to '/register'
        { name, email, password, phone, isBusiness }
      );

      if (response.status === 200 || response.status === 201) {
        console.log('Signup response:', response.data); // Add logging
        return response.data;
      } else {
        throw new Error(response.data?.message || 'Something went wrong. Try again.');
      }
    } catch (error) {
      console.error('Signup error:', error.response || error); // Improved error logging
      throw new Error(
        error.response?.data?.message || 'Registration failed. Please try again.'
      );
    }
  },

  forgotPassword: async (email) => {
    try {
      const response = await authAxios.post(
        `${AUTH_BASE_URL}/forgot-password`,
        { email },
        { headers: { 'Content-Type': 'application/json' } }
      );

      return response.data;
    } catch (error) {
      throw new Error(
        error.response?.data?.message || 'Something went wrong. Try again.'
      );
    }
  },

  resetPassword: async (token, password) => {
    try {
      const response = await authAxios.post(
        `${AUTH_BASE_URL}/reset-password`,
        { token, password },
        { headers: { 'Content-Type': 'application/json' } }
      );

      return response.data;
    } catch (error) {
      throw new Error(
        error.response?.data?.message || 'Something went wrong. Try again.'
      );
    }
  }
};

export default authService;