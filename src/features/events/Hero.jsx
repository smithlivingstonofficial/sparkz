import React from 'react';
import { motion } from 'framer-motion';
import { Film, Sparkles } from 'lucide-react';

const EventsHero = ({ isMobile }) => {
  return (
    <motion.div
      initial={{ opacity: 0, y: 30 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.8 }}
      className="text-center mb-10 md:mb-16 relative"
    >
      {/* Animated Background Glow */}
      <div className="absolute inset-0 -z-10">
        <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-full max-w-3xl h-64 bg-gradient-to-r from-amber-600/10 via-red-600/10 to-purple-600/10 blur-3xl rounded-full" />
      </div>

      {/* Cinema Header */}
      <div className="mb-6 md:mb-8">
        <motion.div
          initial={{ scale: 0.8, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          transition={{ delay: 0.2 }}
          className="inline-flex items-center gap-2 px-4 py-2 bg-gradient-to-r from-amber-600/20 to-red-600/20 border border-amber-500/30 rounded-full mb-4"
        >
          <Film className="text-amber-400" size={isMobile ? 18 : 24} />
          <span className="text-amber-300 font-bold tracking-widest text-sm md:text-base">
            SPARKZ CINEMA PREMIERES
          </span>
          <Sparkles size={isMobile ? 14 : 18} className="text-amber-400" />
        </motion.div>
      </div>

      {/* Main Title */}
      <motion.h1
        initial={{ y: 20, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        transition={{ delay: 0.3 }}
        className="text-4xl md:text-6xl lg:text-7xl font-bold font-['Cinzel'] text-white mb-4 leading-tight"
      >
        CINEMA <span className="text-amber-500">REEL</span>
      </motion.h1>

      {/* Subtitle */}
      <motion.p
        initial={{ y: 20, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        transition={{ delay: 0.4 }}
        className="text-base md:text-xl lg:text-2xl text-white/70 mb-6"
      >
        Hollywood-Style Event Premieres
      </motion.p>

      {/* Description */}
      <motion.p
        initial={{ y: 20, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        transition={{ delay: 0.5 }}
        className="text-sm md:text-lg text-white/50 max-w-3xl mx-auto px-4"
      >
        Experience SPARKZ 2026 through cinematic event premieres. 
        Each event is a blockbuster production waiting for your applause.
      </motion.p>

      {/* Decorative Elements */}
      <div className="flex items-center justify-center gap-4 mt-8">
        <div className="w-12 h-px bg-gradient-to-r from-transparent to-amber-500/50" />
        <div className="w-2 h-2 bg-amber-500 rounded-full animate-pulse" />
        <div className="w-12 h-px bg-gradient-to-r from-amber-500/50 to-transparent" />
      </div>
    </motion.div>
  );
};

export default EventsHero;