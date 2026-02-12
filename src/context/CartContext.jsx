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

// Maximum events allowed in cart
const MAX_EVENTS = 3;

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
    // Check if event already exists in cart
    const exists = cart.some(item => item.id === event.id);
    if (exists) {
      toast.error('Event already in cart!', {
        icon: '⚠️',
        style: {
          background: '#f59e0b',
          color: '#000',
        }
      });
      return false;
    }

    // Check if cart is full
    if (cart.length >= MAX_EVENTS) {
      toast.error(`Maximum ${MAX_EVENTS} events allowed in cart!`, {
        icon: '❌',
        style: {
          background: '#dc2626',
          color: '#fff',
        }
      });
      return false;
    }

    // Add event to cart
    const updatedCart = [...cart, { ...event, addedAt: new Date().toISOString() }];
    setCart(updatedCart);
    
    // Show success toast
    toast.success('Event added to cart!', {
      icon: '✅',
      style: {
        background: '#10b981',
        color: '#fff',
      }
    });
    
    return true;
  }, [cart]);

  // Remove event from cart
  const removeFromCart = useCallback((eventId) => {
    const updatedCart = cart.filter(item => item.id !== eventId);
    setCart(updatedCart);
    
    toast.success('Event removed from cart!', {
      icon: '🗑️',
      style: {
        background: '#ef4444',
        color: '#fff',
      }
    });
    
    return true;
  }, [cart]);

  // Clear entire cart
  const clearCart = useCallback(() => {
    setCart([]);
    toast.success('Cart cleared!', {
      icon: '🛒',
      style: {
        background: '#6b7280',
        color: '#fff',
      }
    });
  }, []);

  // Check if event is in cart
  const isInCart = useCallback((eventId) => {
    return cart.some(item => item.id === eventId);
  }, [cart]);

  // Get cart total
  const getCartTotal = useCallback(() => {
    return cart.reduce((total, item) => {
      const price = item.price ? parseInt(item.price.replace(/[^0-9]/g, '')) : 0;
      return total + price;
    }, 0);
  }, [cart]);

  // Get remaining slots
  const getRemainingSlots = useCallback(() => {
    return MAX_EVENTS - cart.length;
  }, [cart]);

  // Checkout function (placeholder - you'll integrate with payment gateway)
  const checkout = useCallback(async () => {
    if (cart.length === 0) {
      toast.error('Cart is empty!', {
        icon: '🛒',
      });
      return;
    }

    setIsLoading(true);
    
    // Simulate API call
    setTimeout(() => {
      setIsLoading(false);
      setCartVisible(false);
      
      toast.success(
        <div>
          <p className="font-bold">Checkout Successful!</p>
          <p className="text-sm">Total: ₹{getCartTotal()}</p>
        </div>,
        {
          icon: '🎫',
          duration: 5000,
          style: {
            background: '#10b981',
            color: '#fff',
          }
        }
      );
      
      // In real app, you would redirect to payment gateway
      console.log('Proceeding to checkout with events:', cart);
      
      // Clear cart after checkout
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
    MAX_EVENTS,
  };

  return (
    <CartContext.Provider value={value}>
      {children}
      <Toaster
        position="top-right"
        toastOptions={{
          duration: 3000,
          style: {
            background: '#363636',
            color: '#fff',
            padding: '16px',
            borderRadius: '10px',
            fontSize: '14px',
          },
        }}
      />
    </CartContext.Provider>
  );
};

// Export CartContext as default
export default CartContext;