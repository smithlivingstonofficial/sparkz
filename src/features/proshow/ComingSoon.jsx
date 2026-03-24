import React from 'react';
import { motion } from 'framer-motion';
import { Sparkles, Star, Lock } from 'lucide-react';

const ComingSoon = ({ isMobile, proShow = false }) => {
  return (
    <div className="relative overflow-hidden rounded-3xl border border-amber-500/30">
      {/* Background */}
      <div className="absolute inset-0 bg-gradient-to-br from-amber-900/20 via-purple-900/10 to-amber-900/20" />
      <div className="absolute inset-0 backdrop-blur-sm" />
      
      {/* Content */}
      <div className="relative z-10 p-8 md:p-12 text-center">
        <motion.div
          initial={{ scale: 0 }}
          animate={{ scale: 1 }}
          transition={{ delay: 0.2, type: "spring" }}
          className="inline-flex p-4 bg-gradient-to-r from-amber-600/30 to-yellow-600/30 rounded-2xl mb-6"
        >
          <Lock className="text-amber-400" size={isMobile ? 24 : 32} />
        </motion.div>
        
        <h3 className="text-2xl md:text-3xl font-bold font-['Cinzel'] text-white mb-3">
          MORE <span className="text-amber-400">PREMIUM</span> SHOWS COMING SOON
        </h3>
        
        <p className="text-amber-200/70 text-lg mb-6 max-w-2xl mx-auto">
          We're preparing more exclusive performances and surprise appearances.
          Stay tuned for announcements!
        </p>
        
        <div className="flex flex-wrap justify-center gap-3 mb-6">
          {['CELEBRITY GUESTS', 'SURPRISE PERFORMANCES', 'BACKSTAGE ACCESS'].map((item, idx) => (
            <div key={idx} className="flex items-center gap-2 px-4 py-2 bg-white/10 backdrop-blur-sm rounded-full">
              <Star size={14} className="text-amber-400" />
              <span className="text-white text-sm font-medium">{item}</span>
            </div>
          ))}
        </div>
        
        <motion.div
          initial={{ y: 20, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          transition={{ delay: 0.4 }}
          className="text-amber-300/50 text-sm"
        >
          <div className="flex items-center justify-center gap-2">
            <Sparkles size={14} className="animate-pulse" />
            <span>ANNOUNCEMENTS COMING SOON</span>
            <Sparkles size={14} className="animate-pulse" />
          </div>
        </motion.div>
      </div>
    </div>
  );
};

export default ComingSoon;