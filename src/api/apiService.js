// src/api/apiService.js
import axios from 'axios';
import { getAuthToken } from '../utils/localStorage';

const API_BASE_URL = 'http://54.227.34.249:3000/api';

// Create axios instance with base URL
const api = axios.create({
  baseURL: API_BASE_URL,
  headers: {
    'Content-Type': 'application/json',
  },
});

// Add request interceptor to add auth token to requests
api.interceptors.request.use(
  (config) => {
    const token = getAuthToken();
    if (token) {
      config.headers['Authorization'] = `Bearer ${token}`;
    }
    return config;
  },
  (error) => Promise.reject(error)
);

const apiService = {
  // Products
  getProducts: async () => {
    try {
      const response = await api.get('/products');
      return response.data;
    } catch (error) {
      throw new Error(`Error fetching products: ${error.message}`);
    }
  },
  
  getProductsByCategory: async (categoryId) => {
    try {
      const response = await api.get(`/products/category/${categoryId}`);
      return response.data;
    } catch (error) {
      throw new Error(`Error fetching products: ${error.message}`);
    }
  },
  
  getProductDetails: async (productId) => {
    try {
      const response = await api.get(`/products/${productId}`);
      return response.data;
    } catch (error) {
      throw new Error(`Error fetching product details: ${error.message}`);
    }
  },
  
  // Categories
  getCategories: async () => {
    try {
      const response = await api.get('/categories');
      return response.data;
    } catch (error) {
      throw new Error(`Error fetching categories: ${error.message}`);
    }
  },
  
  // Cart
  getCartData: async () => {
    try {
      const response = await api.get('/cart');
      return response.data;
    } catch (error) {
      throw new Error(`Error fetching cart data: ${error.message}`);
    }
  },
  
  addToCart: async (productId, variationIndex, quantity) => {
    try {
      const response = await api.post('/cart/add', {
        productId,
        variationIndex,
        quantity
      });
      return response.data;
    } catch (error) {
      throw new Error(`Error adding item to cart: ${error.message}`);
    }
  },
  
  removeCartItem: async (itemId) => {
    if (!itemId) {
      console.error('Cannot remove item: itemId is undefined');
      throw new Error('Item ID is required');
    }
    
    console.log('API removing item with ID:', itemId);
    try {
      const response = await api.request(
        `/cart/item/${itemId}`,
        {
          method: 'DELETE',
          headers: {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${getAuthToken()}`
          }
        }
      );
      console.log('API remove response:', response);
      return response.data;
    } catch (error) {
      console.error('API Error:', error.response || error);
      throw new Error(`Error removing item: ${error.message}`);
    }
  },
  
  updateCartItemQuantity: async (itemId, quantity) => {
    try {
      const data = JSON.stringify({"itemId": itemId, "quantity": quantity});
      const response = await api.request(
        '/cart/update',
        {
          method: 'PUT',
          headers: {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${getAuthToken()}`
          },
          data: data
        }
      );
      return response.data;
    } catch (error) {
      throw new Error(`Error updating quantity: ${error.message}`);
    }
  },
  
  // User Addresses
  getAddresses: async () => {
    try {
      const response = await api.get('/auth/address');
      return response.data.addresses || [];
    } catch (error) {
      throw new Error(`Error fetching addresses: ${error.message}`);
    }
  },
  
  addAddress: async (address) => {
    try {
      const response = await api.post('/auth/address', address);
      return response.data;
    } catch (error) {
      throw new Error(`Error adding address: ${error.message}`);
    }
  },
  
  updateAddress: async (addressId, address) => {
    try {
      const response = await api.put(`/auth/address/${addressId}`, address);
      return response.data;
    } catch (error) {
      throw new Error(`Error updating address: ${error.message}`);
    }
  },
  
  deleteAddress: async (addressId) => {
    try {
      const response = await api.delete(`/user/addresses/${addressId}`);
      return response.data;
    } catch (error) {
      throw new Error(`Error deleting address: ${error.message}`);
    }
  },
  
  // Orders
  // This function should work as is for recurring orders
  placeOrder: async (orderData) => {
    try {
      console.log('API sending order data:', orderData);
      const response = await api.post('/orders/create', orderData);
      console.log('API order response:', response.data);
      return response.data;
    } catch (error) {
      console.error('API order error:', error.response || error);
      if (error.response) {
        // The request was made and the server responded with a status code
        // that falls out of the range of 2xx
        throw new Error(`Server error: ${error.response.status} - ${error.response.data.message || 'Unknown error'}`);
      } else if (error.request) {
        // The request was made but no response was received
        throw new Error('No response from server. Please check your connection.');
      } else {
        // Something happened in setting up the request that triggered an Error
        throw new Error(`Error placing order: ${error.message}`);
      }
    }
  },
  
  getOrders: async () => {
    try {
      const response = await api.get('/orders');
      return response.data;
    } catch (error) {
      throw new Error(`Error fetching orders: ${error.message}`);
    }
  },
  
  getOrderDetails: async (orderId) => {
    try {
      const response = await api.get(`/orders/${orderId}`);
      return response.data;
    } catch (error) {
      throw new Error(`Error fetching order details: ${error.message}`);
    }
  },
  
  // User Profile
  getUserProfile: async () => {
    try {
      const response = await api.get('/auth/profile');
      return response.data;
    } catch (error) {
      throw new Error(`Error fetching profile data: ${error.message}`);
    }
  },
  
  updateUserProfile: async (profileData) => {
    try {
      const response = await api.put('/auth/profile', profileData);
      return response.data;
    } catch (error) {
      throw new Error(`Error updating profile: ${error.message}`);
    }
  }
};

export { apiService };