import { createContext, useContext, useState, useEffect } from 'react';
import { useAuth } from './AuthContext';
import cartService from '../services/cartService';

const CartContext = createContext();

export const CartProvider = ({ children }) => {
  const [cart, setCart] = useState({ items: [], totalAmount: 0 });
  const [loading, setLoading] = useState(false);
  const { user, token } = useAuth();

  // Load cart from database when user logs in
  useEffect(() => {
    if (user && token) {
      loadCart();
    } else {
      // Clear cart when user logs out
      setCart({ items: [], totalAmount: 0 });
    }
  }, [user, token]);

  const loadCart = async () => {
    if (!user || !token) return;
    
    try {
      setLoading(true);
      const cartData = await cartService.getCart();
      setCart(cartData);
    } catch (error) {
      console.error('Error loading cart:', error);
      // If there's an error, start with empty cart
      setCart({ items: [], totalAmount: 0 });
    } finally {
      setLoading(false);
    }
  };

  const addToCart = async (product, quantity = 1) => {
    if (!user || !token) {
      // For non-authenticated users, show login prompt
      alert('Please log in to add items to cart');
      return;
    }

    try {
      setLoading(true);
      const updatedCart = await cartService.addToCart(product._id, quantity);
      setCart(updatedCart);
    } catch (error) {
      console.error('Error adding to cart:', error);
      alert(error.message || 'Failed to add item to cart');
    } finally {
      setLoading(false);
    }
  };

  const updateQuantity = async (productId, quantity) => {
    if (!user || !token) return;

    try {
      setLoading(true);
      const updatedCart = await cartService.updateCartItem(productId, quantity);
      setCart(updatedCart);
    } catch (error) {
      console.error('Error updating cart:', error);
      alert(error.message || 'Failed to update cart');
    } finally {
      setLoading(false);
    }
  };

  const removeFromCart = async (productId) => {
    if (!user || !token) return;

    try {
      setLoading(true);
      const updatedCart = await cartService.removeFromCart(productId);
      setCart(updatedCart);
    } catch (error) {
      console.error('Error removing from cart:', error);
      alert(error.message || 'Failed to remove item from cart');
    } finally {
      setLoading(false);
    }
  };

  const clearCart = async () => {
    if (!user || !token) return;

    try {
      setLoading(true);
      const updatedCart = await cartService.clearCart();
      setCart(updatedCart);
    } catch (error) {
      console.error('Error clearing cart:', error);
      alert(error.message || 'Failed to clear cart');
    } finally {
      setLoading(false);
    }
  };

  const getCartItemCount = () => {
    return cart.items.reduce((total, item) => total + item.quantity, 0);
  };

  const getCartTotal = () => {
    return cart.totalAmount;
  };

  return (
    <CartContext.Provider value={{ 
      cart, 
      loading,
      addToCart, 
      removeFromCart, 
      updateQuantity,
      clearCart,
      getCartItemCount,
      getCartTotal,
      loadCart
    }}>
      {children}
    </CartContext.Provider>
  );
};

export const useCart = () => useContext(CartContext);
