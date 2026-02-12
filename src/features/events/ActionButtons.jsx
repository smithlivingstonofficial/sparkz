import React from 'react';
import { motion } from 'framer-motion';
import { ChevronRight } from 'lucide-react';

const ActionButtons = ({ isMobile }) => {
  return (
    <>
      {/* Quick Actions - Mobile */}
      {isMobile && (
        <div className="fixed bottom-25 right-4 z-40 flex flex-col gap-3">
          <motion.button
            whileTap={{ scale: 0.9 }}
            className="w-14 h-14 bg-gradient-to-br from-amber-600 to-red-600 text-white rounded-full shadow-2xl shadow-red-500/30 flex items-center justify-center"
            onClick={() => window.scrollTo({ top: 0, behavior: 'smooth' })}
          >
            <ChevronRight className="rotate-270" size={24} />
          </motion.button>
        </div>
      )}

      {/* Quick Actions - Desktop */}
      {!isMobile && (
        <div className="fixed bottom-8 right-8 z-40 flex flex-col gap-4">
          <motion.button
            whileHover={{ scale: 1.1 }}
            whileTap={{ scale: 0.9 }}
            className="w-16 h-16 bg-gradient-to-br from-amber-600 to-red-600 text-white rounded-full shadow-2xl shadow-red-500/30 hover:shadow-amber-500/40 transition-all duration-300 flex items-center justify-center"
            onClick={() => window.scrollTo({ top: 0, behavior: 'smooth' })}
          >
            <ChevronRight className="rotate-270" size={28} />
          </motion.button>
        </div>
      )}
    </>
  );
};

export default ActionButtons;