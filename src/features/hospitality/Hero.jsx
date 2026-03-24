import React from 'react';
import { Clapperboard } from 'lucide-react';

const Hero = () => {
  return (
    <div className="relative text-center pt-8 pb-12 md:pt-12 md:pb-20 overflow-hidden">
      {/* Background elements */}
      <div className="absolute inset-0 bg-gradient-to-b from-black via-slate-900/50 to-transparent z-0"></div>
      <div className="absolute inset-x-0 top-0 h-40 bg-gradient-to-b from-amber-900/20 to-transparent blur-3xl"></div>

      {/* Content */}
      <div className="relative z-10">
        <div className="inline-flex items-center gap-2 px-4 py-2 bg-gradient-to-r from-amber-600/20 to-red-600/20 border border-amber-500/30 rounded-full mb-6">
          <Clapperboard className="text-amber-400" size={20} />
          <span className="text-amber-300 font-bold tracking-widest text-sm">HOSPITALITY SUITE</span>
        </div>
        <h1 className="text-4xl md:text-6xl font-bold font-['Cinzel'] text-white mb-4">
          Your Comfort, Our <span className="text-amber-400">Priority</span>
        </h1>
        <p className="text-lg md:text-xl text-white/70 max-w-3xl mx-auto px-4">
          Everything you need to know for a seamless and memorable stay at SPARKZ 2026.
        </p>
      </div>
    </div>
  );
};

export default Hero;