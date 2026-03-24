import React, { useRef, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { ChevronUp, ShoppingBag, X, Trash2, Calendar, Ticket, ArrowRight } from 'lucide-react';
import { useCart } from '../../context/CartContext'; // Adjust path
import { useNavigate } from 'react-router-dom'; // 1. Import useNavigate

const ActionButtons = ({ isMobile }) => {
  const navigate = useNavigate(); // 2. Initialize hook
  const { 
    cart, 
    cartVisible, 
    toggleCart, 
    removeFromCart, 
    getCartTotal 
  } = useCart();

  // Scroll to Top Logic
  const handleScrollTop = () => {
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  // 3. New Handler: Close drawer and navigate to Cart Page
  const handleProceedToRegister = () => {
    toggleCart(); // Close the side drawer
    navigate('/cart'); // Navigate to your Cart/Checkout Route
  };

  return (
    <>
      {/* --- FLOATING ACTION BUTTONS --- */}
      <div className={`fixed z-50 flex flex-col items-end gap-4 ${isMobile ? 'bottom-20 right-4' : 'bottom-8 right-8'}`}>
        
        {/* Scroll To Top */}
        <motion.button
          initial={{ opacity: 0, scale: 0 }}
          animate={{ opacity: 1, scale: 1 }}
          whileHover={{ scale: 1.1 }}
          whileTap={{ scale: 0.9 }}
          onClick={handleScrollTop}
          className="w-10 h-10 md:w-12 md:h-12 bg-white/10 backdrop-blur-md border border-white/20 text-white rounded-full flex items-center justify-center shadow-lg hover:bg-white/20 transition-all"
        >
          <ChevronUp size={isMobile ? 20 : 24} />
        </motion.button>

        {/* Cart Trigger */}
        <motion.button
          whileHover={{ scale: 1.05 }}
          whileTap={{ scale: 0.95 }}
          onClick={toggleCart}
          className="relative w-14 h-14 md:w-16 md:h-16 bg-gradient-to-r from-amber-500 to-orange-600 text-black rounded-2xl shadow-xl shadow-orange-500/20 flex items-center justify-center border border-white/10"
        >
          <ShoppingBag size={isMobile ? 24 : 28} strokeWidth={2.5} />
          
          <AnimatePresence>
            {cart.length > 0 && (
              <motion.span
                initial={{ scale: 0 }}
                animate={{ scale: 1 }}
                exit={{ scale: 0 }}
                className="absolute -top-2 -right-2 w-6 h-6 bg-red-600 text-white text-xs font-bold flex items-center justify-center rounded-full border-2 border-[#121212]"
              >
                {cart.length}
              </motion.span>
            )}
          </AnimatePresence>
        </motion.button>
      </div>

      {/* --- CART DRAWER --- */}
      <CartDrawer 
        isOpen={cartVisible} 
        onClose={toggleCart} 
        cart={cart} 
        onRemove={removeFromCart} 
        total={getCartTotal()} 
        onProceed={handleProceedToRegister} // 4. Pass the navigation handler
        isMobile={isMobile}
      />
    </>
  );
};

// --- SUB-COMPONENT: CART DRAWER UI ---
const CartDrawer = ({ isOpen, onClose, cart, onRemove, total, onProceed, isMobile }) => {
  
  useEffect(() => {
    if (isOpen) document.body.style.overflow = 'hidden';
    else document.body.style.overflow = 'unset';
    return () => { document.body.style.overflow = 'unset'; };
  }, [isOpen]);

  return (
    <AnimatePresence>
      {isOpen && (
        <>
          {/* Backdrop */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={onClose}
            className="fixed inset-0 z-[60] bg-black/60 backdrop-blur-sm"
          />

          {/* Drawer Content */}
          <motion.div
            initial={{ x: "100%" }}
            animate={{ x: 0 }}
            exit={{ x: "100%" }}
            transition={{ type: "spring", stiffness: 300, damping: 30 }}
            className={`fixed top-0 right-0 z-[70] h-full bg-[#0a0a0a] border-l border-white/10 shadow-2xl flex flex-col
              ${isMobile ? 'w-full max-w-none' : 'w-[450px] max-w-full'}
            `}
          >
            {/* Header */}
            <div className="flex items-center justify-between p-6 border-b border-white/10 bg-[#121212]">
              <div className="flex items-center gap-3">
                <ShoppingBag className="text-amber-500" />
                <h2 className="text-xl font-bold text-white">Your Selections</h2>
                <span className="bg-white/10 text-xs px-2 py-1 rounded-full text-gray-400">{cart.length} items</span>
              </div>
              <button onClick={onClose} className="p-2 hover:bg-white/10 rounded-full text-gray-400 transition-colors">
                <X size={20} />
              </button>
            </div>

            {/* Cart Items List */}
            <div className="flex-1 overflow-y-auto p-6 space-y-4">
              {cart.length === 0 ? (
                <div className="h-full flex flex-col items-center justify-center text-center space-y-4 opacity-50">
                  <Ticket size={64} className="text-gray-600" />
                  <p className="text-gray-400 font-medium">Your cart is empty</p>
                  <button onClick={onClose} className="text-amber-500 text-sm hover:underline">Browse Events</button>
                </div>
              ) : (
                cart.map((item, index) => (
                  <motion.div 
                    layout
                    key={item.id}
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, x: -100 }}
                    transition={{ delay: index * 0.05 }}
                    className="group relative bg-[#181818] border border-white/5 rounded-2xl p-4 flex gap-4 hover:border-amber-500/30 transition-colors"
                  >
                    <div className="w-20 h-20 rounded-xl overflow-hidden bg-gray-800 shrink-0">
                      <img src={item.image} alt={item.title} className="w-full h-full object-cover opacity-80 group-hover:opacity-100 transition-opacity" />
                    </div>

                    <div className="flex-1 flex flex-col justify-between">
                      <div>
                        <div className="flex justify-between items-start">
                          <h3 className="font-bold text-white text-sm line-clamp-1 pr-2">{item.title}</h3>
                          <button 
                            onClick={() => onRemove(item.id)}
                            className="text-gray-500 hover:text-red-500 transition-colors p-1"
                          >
                            <Trash2 size={16} />
                          </button>
                        </div>
                        <div className="flex items-center gap-2 text-xs text-gray-400 mt-1">
                          <span className="bg-white/5 px-2 py-0.5 rounded capitalize">{item.category}</span>
                          {item.eventMode && <span className="bg-blue-500/10 text-blue-400 px-2 py-0.5 rounded capitalize">{item.eventMode}</span>}
                        </div>
                      </div>
                      
                      <div className="flex justify-between items-end mt-2">
                        <div className="flex items-center gap-1.5 text-xs text-gray-500">
                          <Calendar size={12} />
                          <span>{item.date || 'TBA'}</span>
                        </div>
                        <span className="font-bold text-amber-500">
                          {item.price === 0 || item.price === "0" ? "Free" : `₹${item.price}`}
                        </span>
                      </div>
                    </div>
                  </motion.div>
                ))
              )}
            </div>

            {/* Footer / Checkout Button */}
            <div className="p-6 bg-[#121212] border-t border-white/10 space-y-4">
              <div className="flex justify-between items-center text-sm">
                <span className="text-gray-400">Total Amount</span>
                <span className="text-2xl font-bold text-white">₹{total}</span>
              </div>
              
              <button
                onClick={onProceed} // 5. Triggers Navigation
                disabled={cart.length === 0}
                className={`w-full py-4 rounded-xl font-bold text-black flex items-center justify-center gap-2 transition-all
                  ${cart.length === 0 
                    ? 'bg-gray-800 text-gray-500 cursor-not-allowed' 
                    : 'bg-gradient-to-r from-amber-500 to-orange-600 hover:from-amber-400 hover:to-orange-500 shadow-lg shadow-orange-500/20 active:scale-[0.98]'
                  }
                `}
              >
                Proceed to Registration <ArrowRight size={18} />
              </button>
              <p className="text-center text-[10px] text-gray-600">
                Complete your registration on the next page.
              </p>
            </div>
          </motion.div>
        </>
      )}
    </AnimatePresence>
  );
};

export default ActionButtons;