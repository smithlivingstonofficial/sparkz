import React from 'react';
import { Link, useLocation } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  Home, Calendar, Coffee, Users, ShoppingCart, 
  Target, Spotlight, X, Clapperboard, Ticket, 
  ArrowRight, Instagram, Twitter, Youtube
} from 'lucide-react';

const menuItems = [
  { name: 'Home', icon: Home, path: '/' },
  { name: 'Events', icon: Calendar, path: '/events' },
  { name: 'Pro Shows', icon: Spotlight, path: '/proshow' },
  { name: 'Hospitality', icon: Coffee, path: '/hospitality' },
  { name: 'Sponsors', icon: Users, path: '/sponsors' },
  { name: 'Teams', icon: Target, path: '/teams' },
  { name: 'Cart', icon: ShoppingCart, path: '/cart' }
];

// Animation Variants
const sidebarVariants = {
  closed: { 
    x: "100%",
    transition: { type: "spring", stiffness: 300, damping: 30 }
  },
  open: { 
    x: 0,
    transition: { 
      type: "spring", stiffness: 300, damping: 30,
      staggerChildren: 0.07,
      delayChildren: 0.2
    }
  }
};

const itemVariants = {
  closed: { x: 50, opacity: 0 },
  open: { x: 0, opacity: 1, transition: { type: "spring", stiffness: 300, damping: 30 } }
};

const filmStripVariants = {
  animate: {
    y: [0, -20],
    transition: {
      y: { repeat: Infinity, duration: 2, ease: "linear" }
    }
  }
};

const Sidebar = ({ isOpen, onClose }) => {
  const location = useLocation();

  return (
    <AnimatePresence>
      {isOpen && (
        <>
          {/* 1. Backdrop Overlay */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={onClose}
            className="fixed inset-0 bg-black/60 backdrop-blur-sm z-[90]"
          />

          {/* 2. Sidebar Container */}
          <motion.aside
            initial="closed"
            animate="open"
            exit="closed"
            data-lenis-prevent
            variants={sidebarVariants}
            className="fixed top-0 right-0 h-full w-full md:w-[400px] bg-[#0a0a0a] text-white z-[100] shadow-2xl border-l border-white/10 overflow-hidden flex"
          >
            {/* --- CINEMATIC GRAIN OVERLAY --- */}
            <div className="absolute inset-0 pointer-events-none opacity-[0.03]" 
                 style={{ backgroundImage: `url("data:image/svg+xml,%3Csvg viewBox='0 0 200 200' xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='noiseFilter'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.65' numOctaves='3' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23noiseFilter)'/%3E%3C/svg%3E")` }} 
            />

            {/* --- LEFT: ANIMATED FILM STRIP DECORATION --- */}
            <div className="w-12 h-full border-r border-white/10 bg-[#050505] flex flex-col items-center relative overflow-hidden shrink-0">
              <motion.div variants={filmStripVariants} animate="animate" className="flex flex-col gap-4 py-4 w-full items-center">
                {[...Array(30)].map((_, i) => (
                  <div key={i} className="w-4 h-6 bg-white/10 rounded-[1px] shrink-0" />
                ))}
              </motion.div>
              {/* Vertical Text */}
              <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 -rotate-90 whitespace-nowrap text-[10px] font-mono tracking-[0.5em] text-white/20">
                SPARKZ 2K26 • DIRECTORS CUT
              </div>
            </div>

            {/* --- RIGHT: MAIN CONTENT --- */}
            <div className="flex-1 flex flex-col h-full relative">
              
              {/* Header */}
              <div className="p-8 pb-4 flex justify-between items-start border-b border-white/10">
                <div>
                  <motion.div 
                    initial={{ opacity: 0, y: -10 }} 
                    animate={{ opacity: 1, y: 0 }} 
                    transition={{ delay: 0.3 }}
                    className="flex items-center gap-2 text-amber-500 mb-1"
                  >
                    <Clapperboard size={18} />
                    <span className="text-xs font-black tracking-widest uppercase">Take 01</span>
                  </motion.div>
                  <h2 className="text-3xl font-black italic tracking-tighter uppercase text-white">
                    Navigation <span className="text-transparent bg-clip-text bg-gradient-to-r from-amber-500 to-red-600">Reel</span>
                  </h2>
                </div>
                <button 
                  onClick={onClose}
                  className="p-2 bg-white/5 rounded-full hover:bg-white/10 hover:rotate-90 transition-all text-gray-400 hover:text-white"
                >
                  <X size={24} />
                </button>
              </div>

              {/* Menu Items */}
              <div className="flex-1 overflow-y-auto py-8 px-8 space-y-6">
                {menuItems.map((item, index) => {
                  const isActive = location.pathname === item.path;
                  const Icon = item.icon;
                  
                  return (
                    <motion.div key={item.name} variants={itemVariants}>
                      <Link
                        to={item.path}
                        onClick={onClose}
                        className={`group relative flex items-center gap-5 p-2 transition-all duration-300 ${isActive ? 'opacity-100' : 'opacity-60 hover:opacity-100'}`}
                      >
                        {/* Hover Background Glow */}
                        <div className="absolute inset-0 bg-gradient-to-r from-amber-500/0 via-amber-500/0 to-amber-500/0 group-hover:from-white/5 group-hover:via-transparent group-hover:to-transparent transition-all duration-500 -skew-x-12 rounded-lg" />
                        
                        {/* Icon Container */}
                        <div className={`relative p-3 rounded-xl border transition-all duration-300 z-10
                          ${isActive 
                            ? 'bg-amber-500 text-black border-amber-500 shadow-[0_0_15px_rgba(245,158,11,0.4)]' 
                            : 'bg-white/5 text-gray-400 border-white/10 group-hover:border-amber-500/50 group-hover:text-amber-500'
                          }
                        `}>
                          <Icon size={20} strokeWidth={isActive ? 2.5 : 1.5} />
                        </div>

                        {/* Text */}
                        <div className="flex-1 z-10">
                          <span className={`block text-xl font-bold uppercase tracking-wide transition-all ${isActive ? 'text-white translate-x-1' : 'text-gray-300 group-hover:text-white group-hover:translate-x-1'}`}>
                            {item.name}
                          </span>
                          <span className="text-[10px] text-gray-600 font-mono group-hover:text-amber-500/80 transition-colors uppercase tracking-widest">
                            Scene 0{index + 1}
                          </span>
                        </div>

                        {/* Hover Arrow */}
                        <ArrowRight className="opacity-0 -translate-x-4 group-hover:opacity-100 group-hover:translate-x-0 transition-all duration-300 text-amber-500" size={18} />
                      </Link>
                    </motion.div>
                  );
                })}
              </div>

              {/* Footer */}
              <div className="p-8 border-t border-white/10 bg-[#080808] relative z-20">
                <motion.div variants={itemVariants}>
                  <Link
                    to="/auth"
                    onClick={onClose}
                    className="group relative w-full py-4 bg-white text-black font-black uppercase tracking-[0.2em] text-sm flex items-center justify-center gap-3 overflow-hidden rounded-sm hover:bg-amber-500 transition-colors duration-300"
                  >
                    <span className="relative z-10 flex items-center gap-2">
                       <Ticket size={18} /> Register Now
                    </span>
                    {/* Button Glitch Effect on Hover */}
                    <div className="absolute inset-0 bg-amber-400 translate-y-full group-hover:translate-y-0 transition-transform duration-300 z-0" />
                  </Link>

                  <div className="mt-6 flex justify-between items-center opacity-40">
                    <div className="flex gap-4">
                      <Instagram size={18} className="hover:text-white hover:opacity-100 transition-all cursor-pointer" />
                      <Twitter size={18} className="hover:text-white hover:opacity-100 transition-all cursor-pointer" />
                      <Youtube size={18} className="hover:text-white hover:opacity-100 transition-all cursor-pointer" />
                    </div>
                    <div className="text-[10px] font-mono text-right">
                      <p>COPYRIGHT © 2K26</p>
                      <p>ALL RIGHTS RESERVED</p>
                    </div>
                  </div>
                </motion.div>
              </div>

            </div>
          </motion.aside>
        </>
      )}
    </AnimatePresence>
  );
};

export default Sidebar;