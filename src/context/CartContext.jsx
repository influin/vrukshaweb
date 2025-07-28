// src/context/CartContext.jsx
import { createContext, useState, useEffect, useContext } from 'react';
import { useNavigate } from 'react-router-dom';
import { apiService } from '../api/apiService';
import { useAuth } from './AuthContext';
import { savePendingCartItem, getPendingCartItems, clearPendingCartItems } from '../utils/localStorage';

export const CartContext = createContext();

export const CartProvider = ({ children }) => {
  const [cart, setCart] = useState({ items: [], total: 0 });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const { user } = useAuth();
  const navigate = useNavigate();

  // Fetch cart data when user is logged in
  useEffect(() => {
    if (user) {
      fetchCart();
      // Process any pending cart items
      processPendingCartItems();
    } else {
      // Reset cart when user logs out
      setCart({ items: [], total: 0 });
    }
  }, [user]);

  const fetchCart = async () => {
    if (!user) return;
    
    try {
      setLoading(true);
      setError(null);
      const data = await apiService.getCartData();
      setCart(data);
    } catch (error) {
      setError('Failed to fetch cart data');
      console.error(error);
    } finally {
      setLoading(false);
    }
  };

  const processPendingCartItems = async () => {
    const pendingItems = getPendingCartItems();
    if (pendingItems.length === 0) return;

    try {
      setLoading(true);
      for (const item of pendingItems) {
        await apiService.addToCart(
          item.productId,
          item.variationIndex,
          item.quantity
        );
      }
      // Clear pending items after processing
      clearPendingCartItems();
      // Refresh cart
      await fetchCart();
    } catch (error) {
      setError('Failed to process pending cart items');
      console.error(error);
    } finally {
      setLoading(false);
    }
  };

  const addToCart = async (productId, variationIndex, quantity) => {
    try {
      setLoading(true);
      setError(null);

      if (!user) {
        // Save item to pending cart items if user is not logged in
        savePendingCartItem({ productId, variationIndex, quantity });
        navigate('/login');
        return;
      }

      await apiService.addToCart(productId, variationIndex, quantity);
      await fetchCart();
    } catch (error) {
      setError('Failed to add item to cart');
      console.error(error);
    } finally {
      setLoading(false);
    }
  };

  const updateQuantity = async (itemId, quantity) => {
    try {
      setLoading(true);
      setError(null);
      
      // Update the cart optimistically
      const updatedItems = cart.items.map(item => 
        item._id === itemId ? {...item, quantity} : item
      );
      
      setCart({
        ...cart,
        items: updatedItems,
        total: calculateTotal(updatedItems)
      });
      
      await apiService.updateCartItemQuantity(itemId, quantity);
      await fetchCart(); // Refresh to get server state
    } catch (error) {
      setError('Failed to update quantity');
      console.error(error);
      await fetchCart(); // Revert to server state on error
    } finally {
      setLoading(false);
    }
  };

  const removeItem = async (itemId) => {
    try {
      setLoading(true);
      setError(null);
      
      // Remove item optimistically
      const updatedItems = cart.items.filter(item => item._id !== itemId);
      setCart({
        ...cart,
        items: updatedItems,
        total: calculateTotal(updatedItems)
      });
      
      await apiService.removeCartItem(itemId);
      await fetchCart(); // Refresh to get server state
    } catch (error) {
      setError('Failed to remove item');
      console.error(error);
      await fetchCart(); // Revert to server state on error
    } finally {
      setLoading(false);
    }
  };
  
  // Helper function to calculate total
  const calculateTotal = (items) => {
    return items.reduce((sum, item) => sum + (item.variation.price * item.quantity), 0);
  };

  return (
    <CartContext.Provider
      value={{
        cart,
        loading,
        error,
        addToCart,
        updateQuantity,
        removeItem,
        fetchCart
      }}
    >
      {children}
    </CartContext.Provider>
  );
};

// Custom hook to use cart context
export const useCart = () => {
  const context = useContext(CartContext);
  if (!context) {
    throw new Error('useCart must be used within a CartProvider');
  }
  return context;
};