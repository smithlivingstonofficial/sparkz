import React, { createContext, useContext, useState, useEffect, useCallback } from 'react';
import { toast, Toaster } from 'react-hot-toast';

// Create Cart Context
const CartContext = createContext(null);

// Custom hook to use cart
export const useCart = () => {
  const context = useContext(CartContext);
  if (!context) {
    throw new Error('useCart must be used within CartProvider');
  }
  return context;
};

// Maximum total events allowed in cart
const MAX_TOTAL_EVENTS = 3;
// Maximum featured events allowed
const MAX_FEATURED_EVENTS = 1;

// Cart Provider Component
export const CartProvider = ({ children }) => {
  const [cart, setCart] = useState([]);
  const [cartVisible, setCartVisible] = useState(false);
  const [isLoading, setIsLoading] = useState(false);

  // Load cart from localStorage on initial render
  useEffect(() => {
    const savedCart = localStorage.getItem('sparkz_cart');
    if (savedCart) {
      try {
        setCart(JSON.parse(savedCart));
      } catch (error) {
        console.error('Error loading cart from localStorage:', error);
        setCart([]);
      }
    }
  }, []);

  // Save cart to localStorage whenever it changes
  useEffect(() => {
    localStorage.setItem('sparkz_cart', JSON.stringify(cart));
  }, [cart]);

  // Add event to cart
  const addToCart = useCallback((event) => {
    // 1. Check if event already exists in cart
    const exists = cart.some(item => item.id === event.id);
    if (exists) {
      toast.error('Event already in cart!', {
        icon: '⚠️',
        style: { background: '#f59e0b', color: '#000' }
      });
      return false;
    }

    // 2. FEATURED LOGIC: Check if user is trying to add a second featured event
    if (event.featured) {
      const hasFeatured = cart.some(item => item.featured === true);
      if (hasFeatured) {
        toast.error('Only 1 Featured event allowed per person!', {
          icon: '⭐',
          style: { background: '#8b5cf6', color: '#fff' }
        });
        return false;
      }
    }

    // 3. TOTAL LIMIT LOGIC: Check if total cart is full
    if (cart.length >= MAX_TOTAL_EVENTS) {
      toast.error(`Total limit of ${MAX_TOTAL_EVENTS} events reached!`, {
        icon: '❌',
        style: { background: '#dc2626', color: '#fff' }
      });
      return false;
    }

    // Add event to cart
    const updatedCart = [...cart, { ...event, addedAt: new Date().toISOString() }];
    setCart(updatedCart);
    
    // Show success toast
    toast.success(`${event.title} added to cart!`, {
      icon: '✅',
      style: { background: '#10b981', color: '#fff' }
    });
    
    return true;
  }, [cart]);

  // Remove event from cart
  const removeFromCart = useCallback((eventId) => {
    const updatedCart = cart.filter(item => item.id !== eventId);
    setCart(updatedCart);
    
    toast.success('Event removed from cart!', {
      icon: '🗑️',
      style: { background: '#ef4444', color: '#fff' }
    });
    
    return true;
  }, [cart]);

  // Clear entire cart
  const clearCart = useCallback(() => {
    setCart([]);
    toast.success('Cart cleared!', {
      icon: '🛒',
      style: { background: '#6b7280', color: '#fff' }
    });
  }, []);

  // Check if event is in cart
  const isInCart = useCallback((eventId) => {
    return cart.some(item => item.id === eventId);
  }, [cart]);

  // Get cart total (Cleaning price string like "₹500" to number)
  const getCartTotal = useCallback(() => {
    return cart.reduce((total, item) => {
      const priceStr = item.price ? String(item.price) : "0";
      const price = parseInt(priceStr.replace(/[^0-9]/g, '')) || 0;
      return total + price;
    }, 0);
  }, [cart]);

  // Get remaining slots
  const getRemainingSlots = useCallback(() => {
    return MAX_TOTAL_EVENTS - cart.length;
  }, [cart]);

  // Checkout function (placeholder)
  const checkout = useCallback(async () => {
    if (cart.length === 0) {
      toast.error('Cart is empty!', { icon: '🛒' });
      return;
    }

    setIsLoading(true);
    
    // Simulate Processing
    setTimeout(() => {
      setIsLoading(false);
      setCartVisible(false);
      
      toast.success(
        <div>
          <p className="font-bold">Booking Confirmed!</p>
          <p className="text-sm">Events: {cart.length} | Total: ₹{getCartTotal()}</p>
        </div>,
        { icon: '🎫', duration: 5000, style: { background: '#10b981', color: '#fff' } }
      );
      
      clearCart();
    }, 2000);
  }, [cart, getCartTotal, clearCart]);

  // Toggle cart visibility
  const toggleCart = useCallback(() => {
    setCartVisible(prev => !prev);
  }, []);

  // Context value
  const value = {
    cart,
    cartVisible,
    isLoading,
    addToCart,
    removeFromCart,
    clearCart,
    isInCart,
    getCartTotal,
    getRemainingSlots,
    toggleCart,
    checkout,
    MAX_TOTAL_EVENTS,
    hasFeatured: cart.some(item => item.featured === true), // Useful for UI icons
  };

  return (
    <CartContext.Provider value={value}>
      {children}
      <Toaster
        position="top-right"
        toastOptions={{
          duration: 3000,
          style: {
            background: '#1a1a1a',
            color: '#fff',
            padding: '16px',
            borderRadius: '12px',
            fontSize: '14px',
            border: '1px solid rgba(255,255,255,0.1)'
          },
        }}
      />
    </CartContext.Provider>
  );
};

export default CartContext;