// src/utils/localStorage.js

// User storage functions
export const saveUser = (user, token) => {
  localStorage.setItem('token', token);
  localStorage.setItem('user', JSON.stringify(user)); // Store the entire user object
};

export const getUser = () => {
  const token = localStorage.getItem('token');
  if (!token) return null;
  
  try {
    const user = JSON.parse(localStorage.getItem('user')) || {};
    return {
      ...user,
      token
    };
  } catch (error) {
    console.error('Error parsing user data from localStorage', error);
    return {
      token,
      name: localStorage.getItem('name'),
      email: localStorage.getItem('email'),
      phone: localStorage.getItem('phone')
    };
  }
};

export const clearUser = () => {
  localStorage.removeItem('token');
  localStorage.removeItem('user');
  // Keep these for backward compatibility
  localStorage.removeItem('name');
  localStorage.removeItem('email');
  localStorage.removeItem('phone');
};

// Other functions remain the same
export const getAuthToken = () => {
  return localStorage.getItem('token');
};

// Cart storage functions
export const savePendingCartItem = (item) => {
  const pendingItems = getPendingCartItems();
  pendingItems.push(item);
  localStorage.setItem('pendingCartItems', JSON.stringify(pendingItems));
};

export const getPendingCartItems = () => {
  const items = localStorage.getItem('pendingCartItems');
  return items ? JSON.parse(items) : [];
};

export const clearPendingCartItems = () => {
  localStorage.removeItem('pendingCartItems');
};