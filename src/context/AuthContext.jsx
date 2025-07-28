// src/context/AuthContext.jsx
import { createContext, useState, useEffect, useContext } from 'react';
import { getUser, saveUser, clearUser } from '../utils/localStorage';
import authService from '../api/authService';
import { apiService } from '../api/apiService';

export const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  
  useEffect(() => {
    const loadUser = async () => {
      const userData = getUser();
      if (userData) {
        setUser(userData);
      }
      setLoading(false);
    };
    
    loadUser();
  }, []);
  
  // In the login method of AuthContext.jsx
  const login = async (email, password) => {
    try {
      setError(null);
      setLoading(true);
      const data = await authService.login(email, password);
      saveUser(data.user, data.token);
      setUser(data.user);
      return data;
    } catch (error) {
      console.error('Login error in context:', error);
      setError(error.message || 'Failed to login');
      throw error;
    } finally {
      setLoading(false);
    }
  };
  
  // Similarly update the signup method
  const signup = async (name, email, password, phone, isBusiness) => {
    try {
      setError(null);
      setLoading(true);
      const data = await authService.signup(name, email, password, phone, isBusiness);
      saveUser(data.user, data.token);
      setUser(data.user);
      return data;
    } catch (error) {
      console.error('Signup error in context:', error);
      setError(error.message || 'Failed to create account');
      throw error;
    } finally {
      setLoading(false);
    }
  };
  
  const logout = () => {
    clearUser();
    setUser(null);
  };

  const updateProfile = async (profileData) => {
    try {
      setError(null);
      const data = await apiService.updateUserProfile(profileData);
      const updatedUser = { ...user, ...profileData };
      setUser(updatedUser);
      // Update local storage
      saveUser(updatedUser, user.token);
      return data;
    } catch (error) {
      setError(error.message);
      throw error;
    }
  };
  
  return (
    <AuthContext.Provider 
      value={{ 
        user, 
        loading, 
        error,
        login, 
        signup, 
        logout,
        updateProfile
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};

// Custom hook to use auth context
export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};