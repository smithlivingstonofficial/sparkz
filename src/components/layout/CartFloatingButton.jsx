import React from 'react';
import { ShoppingCart, X, AlertCircle } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import { useCart } from '../context/CartContext';
import { Link } from 'react-router-dom';

const CartFloatingButton = () => {
  const { cart, getRemainingSlots, getCartTotal, toggleCart, cartVisible } = useCart();
  const remainingSlots = getRemainingSlots();

  return (
    <>
      {/* Floating Cart Button */}
      <motion.button
        initial={{ scale: 0, opacity: 0 }}
        animate={{ scale: 1, opacity: 1 }}
        whileHover={{ scale: 1.1 }}
        whileTap={{ scale: 0.95 }}
        onClick={toggleCart}
        className="fixed bottom-6 right-6 z-50 p-4 bg-gradient-to-r from-amber-600 to-red-600 text-white rounded-full shadow-2xl hover:shadow-amber-500/30 transition-all duration-300 group"
      >
        <div className="relative">
          <ShoppingCart className="w-6 h-6" />
          {cart.length > 0 && (
            <motion.span
              initial={{ scale: 0 }}
              animate={{ scale: 1 }}
              className="absolute -top-2 -right-2 bg-red-500 text-white text-xs font-bold rounded-full w-5 h-5 flex items-center justify-center"
            >
              {cart.length}
            </motion.span>
          )}
        </div>
      </motion.button>

      {/* Cart Sidebar */}
      <AnimatePresence>
        {cartVisible && (
          <>
            {/* Backdrop */}
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={toggleCart}
              className="fixed inset-0 bg-black/50 backdrop-blur-sm z-40"
            />
            
            {/* Cart Sidebar */}
            <motion.div
              initial={{ x: '100%' }}
              animate={{ x: 0 }}
              exit={{ x: '100%' }}
              transition={{ type: 'spring', damping: 25 }}
              className="fixed top-0 right-0 h-full w-full md:w-96 bg-gradient-to-b from-black to-gray-900 z-50 shadow-2xl border-l border-amber-500/30 overflow-hidden"
            >
              {/* Header */}
              <div className="p-6 border-b border-amber-500/30 bg-gradient-to-r from-amber-900/20 to-red-900/20">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-3">
                    <ShoppingCart className="w-6 h-6 text-amber-400" />
                    <h2 className="text-xl font-bold text-white">Your Cart</h2>
                  </div>
                  <button
                    onClick={toggleCart}
                    className="p-2 hover:bg-white/10 rounded-lg transition-colors"
                  >
                    <X className="w-5 h-5 text-white" />
                  </button>
                </div>
                
                {/* Cart Summary */}
                <div className="mt-4 flex items-center justify-between">
                  <div className="text-amber-300 text-sm">
                    {cart.length} event{cart.length !== 1 ? 's' : ''} selected
                  </div>
                  <div className="text-white font-bold">
                    Total: ₹{getCartTotal()}
                  </div>
                </div>
              </div>

              {/* Remaining Slots Warning */}
              {remainingSlots > 0 && remainingSlots <= 2 && (
                <div className="p-4 bg-amber-900/20 border-y border-amber-500/30">
                  <div className="flex items-center gap-2 text-amber-300">
                    <AlertCircle className="w-4 h-4" />
                    <span className="text-sm">
                      {remainingSlots} slot{remainingSlots !== 1 ? 's' : ''} remaining
                    </span>
                  </div>
                </div>
              )}

              {/* Cart Items */}
              <div className="flex-1 overflow-y-auto p-6 space-y-4 max-h-[60vh]">
                {cart.length === 0 ? (
                  <div className="text-center py-12">
                    <ShoppingCart className="w-16 h-16 text-gray-600 mx-auto mb-4" />
                    <p className="text-gray-400">Your cart is empty</p>
                    <p className="text-gray-500 text-sm mt-2">Add up to 3 events to proceed</p>
                  </div>
                ) : (
                  cart.map((item, index) => (
                    <CartItem key={item.id} item={item} index={index} />
                  ))
                )}
              </div>

              {/* Footer */}
              <div className="p-6 border-t border-amber-500/30 bg-gradient-to-r from-black/80 to-gray-900/80">
                <div className="space-y-4">
                  {/* Total */}
                  <div className="flex justify-between items-center">
                    <span className="text-gray-300">Total Amount</span>
                    <span className="text-2xl font-bold text-amber-400">₹{getCartTotal()}</span>
                  </div>

                  {/* Action Buttons */}
                  <div className="space-y-3">
                    <Link
                      to="/cart"
                      onClick={toggleCart}
                      className="block w-full py-3 bg-gradient-to-r from-amber-600 to-red-600 text-white font-bold rounded-lg text-center hover:opacity-90 transition-opacity"
                    >
                      View Full Cart
                    </Link>
                    
                    {cart.length > 0 && (
                      <button className="block w-full py-3 bg-gradient-to-r from-green-600 to-emerald-600 text-white font-bold rounded-lg hover:opacity-90 transition-opacity">
                        Proceed to Checkout
                      </button>
                    )}
                  </div>

                  {/* Cart Limit Info */}
                  <div className="text-center text-xs text-gray-500 pt-4">
                    Maximum {cart.length}/3 events in cart
                  </div>
                </div>
              </div>
            </motion.div>
          </>
        )}
      </AnimatePresence>
    </>
  );
};

// Cart Item Component
const CartItem = ({ item, index }) => {
  const { removeFromCart } = useCart();

  return (
    <div className="flex items-start gap-3 p-4 bg-gradient-to-r from-black/40 to-gray-900/40 rounded-lg border border-amber-500/20">
      {/* Index */}
      <div className="flex-shrink-0 w-8 h-8 bg-gradient-to-r from-amber-600 to-red-600 rounded-full flex items-center justify-center">
        <span className="text-white text-sm font-bold">{index + 1}</span>
      </div>
      
      {/* Content */}
      <div className="flex-1 min-w-0">
        <h4 className="font-bold text-white truncate">{item.title}</h4>
        <p className="text-amber-300 text-sm truncate">{item.tagline}</p>
        <div className="flex items-center justify-between mt-2">
          <span className="text-green-400 font-bold">{item.price || 'Free'}</span>
          <button
            onClick={() => removeFromCart(item.id)}
            className="text-red-400 hover:text-red-300 text-sm font-medium"
          >
            Remove
          </button>
        </div>
      </div>
    </div>
  );
};

export default CartFloatingButton;