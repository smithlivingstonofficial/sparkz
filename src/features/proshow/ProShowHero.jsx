import React from 'react';
import { motion } from 'framer-motion';
import { Crown, Star, Sparkles, Ticket } from 'lucide-react';

const ProShowHero = ({ isMobile }) => {
  return (
    <motion.div
      initial={{ opacity: 0, y: 30 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.8 }}
      className="text-center mb-10 md:mb-16 relative"
    >
      {/* Animated Gold Background */}
      <div className="absolute inset-0 -z-10">
        <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-full max-w-3xl h-80 bg-gradient-to-r from-amber-600/20 via-yellow-600/20 to-amber-600/20 blur-3xl rounded-full" />
        <div className="absolute top-1/3 left-1/4 w-64 h-64 bg-purple-600/10 rounded-full blur-3xl" />
        <div className="absolute bottom-1/3 right-1/4 w-64 h-64 bg-rose-600/10 rounded-full blur-3xl" />
      </div>

      {/* Premium Header */}
      <div className="mb-6 md:mb-8">
        <motion.div
          initial={{ scale: 0.8, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          transition={{ delay: 0.2 }}
          className="inline-flex items-center gap-3 px-6 py-3 bg-gradient-to-r from-amber-600/30 to-yellow-600/30 border border-amber-500/50 rounded-2xl mb-4 backdrop-blur-sm"
        >
          <Crown className="text-amber-300" size={isMobile ? 20 : 24} />
          <span className="text-amber-200 font-bold tracking-widest text-sm md:text-base">
            SPARKZ PREMIUM PRO SHOW
          </span>
          <Sparkles size={isMobile ? 16 : 20} className="text-amber-300" />
        </motion.div>
      </div>

      {/* Main Title */}
      <motion.h1
        initial={{ y: 20, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        transition={{ delay: 0.3 }}
        className="text-5xl md:text-7xl lg:text-8xl font-bold font-['Cinzel'] text-white mb-4 leading-tight"
      >
        <span className="bg-gradient-to-r from-amber-400 via-yellow-300 to-amber-400 bg-clip-text text-transparent gold-shimmer" 
              style={{backgroundSize: '200% 100%'}}>
          PREMIUM
        </span>
        <br />
        <span className="text-white text-4xl md:text-6xl">EXPERIENCE</span>
      </motion.h1>

      {/* Subtitle */}
      <motion.p
        initial={{ y: 20, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        transition={{ delay: 0.4 }}
        className="text-xl md:text-2xl lg:text-3xl text-amber-100/90 mb-6 font-light"
      >
        Exclusive Shows & Star Performances
      </motion.p>

      {/* Description */}
      <motion.p
        initial={{ y: 20, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        transition={{ delay: 0.5 }}
        className="text-base md:text-lg text-amber-200/70 max-w-3xl mx-auto px-4 mb-8"
      >
        Experience the pinnacle of entertainment with our premium Pro Shows. 
        Featuring renowned artists, spectacular performances, and unforgettable moments.
      </motion.p>

      {/* VIP Badge */}
      <motion.div
        initial={{ scale: 0 }}
        animate={{ scale: 1 }}
        transition={{ delay: 0.6, type: "spring" }}
        className="inline-flex items-center gap-2 px-6 py-2 bg-gradient-to-r from-amber-600 to-yellow-600 rounded-full mb-8"
      >
        <Ticket className="text-white" size={18} />
        <span className="text-white font-bold tracking-wider">VIP ACCESS REQUIRED</span>
      </motion.div>

      {/* Decorative Elements */}
      <div className="flex items-center justify-center gap-6 mt-10">
        <div className="w-16 h-px bg-gradient-to-r from-transparent to-amber-500/60" />
        <div className="flex items-center gap-2">
          <div className="w-3 h-3 bg-amber-400 rounded-full animate-pulse" />
          <Star className="text-amber-400" size={20} />
          <div className="w-3 h-3 bg-amber-400 rounded-full animate-pulse" />
        </div>
        <div className="w-16 h-px bg-gradient-to-r from-amber-500/60 to-transparent" />
      </div>
    </motion.div>
  );
};

export default ProShowHero;