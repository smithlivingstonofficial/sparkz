import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { MessageCircle, Phone, Mail, X } from 'lucide-react';

const ActionButtons = () => {
  const [isOpen, setIsOpen] = useState(false);

  const toggleOpen = () => setIsOpen(!isOpen);

  // General helpline number - update if needed
  const phoneNumber = "+919994574058"; 
  const emailAddress = "sparkz@klu.ac.in";

  const containerVariants = {
    hidden: { opacity: 0 },
    show: {
      opacity: 1,
      transition: {
        staggerChildren: 0.1,
        delayChildren: 0.1,
      },
    },
  };

  const itemVariants = {
    hidden: { opacity: 0, y: 10, scale: 0.8 },
    show: { opacity: 1, y: 0, scale: 1 },
  };

  return (
    <div className="fixed bottom-6 right-6 z-50 flex flex-col items-end gap-4">
      <AnimatePresence>
        {isOpen && (
          <motion.div
            variants={containerVariants}
            initial="hidden"
            animate="show"
            exit={{ opacity: 0, transition: { duration: 0.2 } }}
            className="flex flex-col gap-3 items-end mb-2"
          >
            {/* Email Button */}
            <motion.a
              href={`mailto:${emailAddress}`}
              variants={itemVariants}
              whileHover={{ scale: 1.1 }}
              whileTap={{ scale: 0.95 }}
              className="flex items-center gap-3 group"
            >
              {/* Tooltip Label (Desktop only) */}
              <span className="bg-black/80 backdrop-blur-md text-white text-xs px-3 py-1.5 rounded-lg border border-white/10 opacity-0 group-hover:opacity-100 transition-opacity whitespace-nowrap hidden md:block shadow-xl">
                Email Support
              </span>
              
              <div className="w-12 h-12 bg-gradient-to-br from-amber-600 to-orange-600 rounded-full flex items-center justify-center text-white shadow-lg shadow-orange-500/30 border border-white/20">
                <Mail className="w-5 h-5" />
              </div>
            </motion.a>

            {/* Phone Button */}
            <motion.a
              href={`tel:${phoneNumber}`}
              variants={itemVariants}
              whileHover={{ scale: 1.1 }}
              whileTap={{ scale: 0.95 }}
              className="flex items-center gap-3 group"
            >
              {/* Tooltip Label (Desktop only) */}
              <span className="bg-black/80 backdrop-blur-md text-white text-xs px-3 py-1.5 rounded-lg border border-white/10 opacity-0 group-hover:opacity-100 transition-opacity whitespace-nowrap hidden md:block shadow-xl">
                Call Helpline
              </span>
              
              <div className="w-12 h-12 bg-gradient-to-br from-red-600 to-pink-600 rounded-full flex items-center justify-center text-white shadow-lg shadow-red-500/30 border border-white/20">
                <Phone className="w-5 h-5" />
              </div>
            </motion.a>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Main Toggle Button */}
      <motion.button
        onClick={toggleOpen}
        whileHover={{ scale: 1.05 }}
        whileTap={{ scale: 0.95 }}
        className={`
          w-14 h-14 rounded-full flex items-center justify-center text-white shadow-2xl transition-all duration-300 relative z-50 border border-white/10
          ${isOpen 
            ? 'bg-gray-800 text-gray-300 rotate-90' 
            : 'bg-gradient-to-r from-amber-500 to-red-600'
          }
        `}
      >
        <AnimatePresence mode="wait">
            {isOpen ? (
                <motion.div
                    key="close"
                    initial={{ rotate: -90, opacity: 0 }}
                    animate={{ rotate: 0, opacity: 1 }}
                    exit={{ rotate: 90, opacity: 0 }}
                >
                    <X className="w-6 h-6" />
                </motion.div>
            ) : (
                <motion.div
                    key="open"
                    initial={{ scale: 0 }}
                    animate={{ scale: 1 }}
                    exit={{ scale: 0 }}
                >
                    <MessageCircle className="w-7 h-7" />
                </motion.div>
            )}
        </AnimatePresence>
        
        {/* Ripple/Pulse effect when closed to draw attention */}
        {!isOpen && (
          <span className="absolute inset-0 rounded-full bg-red-500 opacity-20 animate-ping pointer-events-none"></span>
        )}
      </motion.button>
    </div>
  );
};

export default ActionButtons;