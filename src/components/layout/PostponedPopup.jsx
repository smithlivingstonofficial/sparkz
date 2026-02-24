import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { X, CalendarClock, Info } from 'lucide-react';

const PostponedPopup = () => {
  const [isOpen, setIsOpen] = useState(true);
  const constraintsRef = React.useRef(null);

  // Auto-open on first visit could be implemented with localStorage if needed, 
  // but the requirement says "When the site is loaded pop-up informing..." 
  // implying every time or at least initially.
  // The user didn't ask for "only once", so I'll leave it as default open on load.

  return (
    <>
      <div ref={constraintsRef} className="fixed inset-0 pointer-events-none z-90" />
      <AnimatePresence>
        {isOpen && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-100 flex items-center justify-center bg-black/80 backdrop-blur-sm p-4"
          >
            <motion.div
              initial={{ scale: 0.9, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.9, opacity: 0 }}
              className="relative w-full max-w-lg overflow-hidden rounded-2xl border border-red-500/30 bg-neutral-900 shadow-2xl"
            >
              {/* Decorative top bar */}
              <div className="absolute top-0 left-0 right-0 h-1 bg-linear-to-r from-red-600 via-orange-500 to-red-600" />
              
              <div className="p-6 md:p-8">
                <div className="flex items-start justify-between">
                  <div className="flex items-center gap-3 text-red-500">
                    <Info className="h-6 w-6" />
                    <h2 className="text-xl font-bold font-orbitron tracking-wider">IMPORTANT NOTICE</h2>
                  </div>
                  <button
                    onClick={() => setIsOpen(false)}
                    className="rounded-full p-1 text-gray-400 transition-colors hover:bg-white/10 hover:text-white"
                  >
                    <X className="h-5 w-5" />
                  </button>
                </div>

                <div className="mt-6 space-y-4">
                  <p className="text-lg font-medium leading-relaxed text-gray-200">
                    Due to the sudden demise of our Hon’ble Chancellor, <span className="font-bold text-red-400">Dr. K. Sridharan</span>, SPARKZ 2K26 has been postponed as a mark of respect.
                  </p>
                  
                  <p className="leading-relaxed text-gray-300">
                    We offer our heartfelt prayers during this time of grief. The revised dates will be announced shortly.
                  </p>
                </div>

                <div className="mt-8 flex justify-end">
                  <button
                    onClick={() => setIsOpen(false)}
                    className="rounded-lg bg-red-600 px-6 py-2.5 text-sm font-semibold text-white transition-all hover:bg-red-700 hover:shadow-lg hover:shadow-red-900/40 active:scale-95"
                  >
                    Acknowledge
                  </button>
                </div>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>

      <AnimatePresence>
        {!isOpen && (
          <motion.div
            drag
            dragConstraints={constraintsRef}
            dragElastic={0.1}
            whileHover={{ scale: 1.1 }}
            whileTap={{ scale: 0.95 }}
            dragMomentum={false}
            initial={{ scale: 0, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            exit={{ scale: 0, opacity: 0 }}
            className="fixed bottom-8 right-8 z-90 cursor-grab active:cursor-grabbing"
            style={{ touchAction: "none" }} // Important for dragging on touch devices
          >
            <button
              onClick={() => setIsOpen(true)}
              className="relative flex h-14 w-14 items-center justify-center rounded-full bg-red-600 text-white shadow-lg shadow-red-900/50 hover:bg-red-700"
            >
              {/* Pulsing effect */}
              <span className="absolute inset-0 -z-10 animate-ping rounded-full bg-red-600 opacity-75"></span>
              <CalendarClock className="h-7 w-7" />
            </button>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
};

export default PostponedPopup;
