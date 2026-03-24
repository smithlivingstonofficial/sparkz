import React from 'react';
import { motion } from 'framer-motion';
import { Bed, Calendar, CheckCircle2, Shield, Wifi, Coffee } from 'lucide-react';

const AccommodationTab = () => {
  const amenities = [
    { icon: <Shield className="w-5 h-5" />, text: "24/7 Security" },
    { icon: <Wifi className="w-5 h-5" />, text: "Free Wi-Fi" },
    { icon: <Bed className="w-5 h-5" />, text: "Comfortable Bedding" },
    { icon: <Coffee className="w-5 h-5" />, text: "Basic Amenities" },
  ];

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: -20 }}
      transition={{ duration: 0.3 }}
      className="max-w-4xl mx-auto"
    >
      <div className="bg-gradient-to-br from-gray-900 to-black border border-amber-500/30 rounded-3xl overflow-hidden shadow-2xl">
        <div className="p-8 md:p-10">
          <div className="text-center mb-10">
            <h2 className="text-3xl font-bold text-white font-['Cinzel'] mb-4">Official Accommodation</h2>
            <p className="text-white/60">
              Experience comfortable stay within the KLU campus during SPARKZ 2026.
            </p>
          </div>

          {/* Pricing Grid */}
          <div className="grid grid-cols-2 gap-6 mb-10">
            {/* Price Box */}
            <div className="relative group overflow-hidden bg-white/5 border border-white/10 rounded-2xl p-6 text-center hover:border-amber-500/50 transition-all duration-300">
              <div className="absolute inset-0 bg-amber-500/10 opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
              <div className="relative z-10">
                <div className="text-4xl md:text-5xl font-bold text-amber-400 mb-2">₹400</div>
                <div className="text-white/70 font-medium tracking-wide uppercase text-sm">Per Night</div>
              </div>
            </div>

            {/* Duration Box */}
            <div className="relative group overflow-hidden bg-white/5 border border-white/10 rounded-2xl p-6 text-center hover:border-amber-500/50 transition-all duration-300">
              <div className="absolute inset-0 bg-amber-500/10 opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
              <div className="relative z-10">
                <div className="text-4xl md:text-5xl font-bold text-white mb-2">2</div>
                <div className="text-white/70 font-medium tracking-wide uppercase text-sm">Days Package</div>
              </div>
            </div>
          </div>

          {/* Amenities Grid */}
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-8">
            {amenities.map((item, index) => (
              <div key={index} className="flex flex-col items-center justify-center p-4 bg-white/5 rounded-xl border border-white/5">
                <div className="text-amber-400 mb-2">{item.icon}</div>
                <span className="text-xs text-white/80 font-medium">{item.text}</span>
              </div>
            ))}
          </div>

          {/* Note */}
          <div className="bg-amber-900/20 border border-amber-500/20 rounded-xl p-4 flex items-start gap-3">
            <CheckCircle2 className="w-5 h-5 text-amber-400 flex-shrink-0 mt-0.5" />
            <p className="text-sm text-amber-200/80">
              <span className="font-bold text-amber-400">Note:</span> Accommodation is provided on a first-come, first-served basis. Please carry a valid ID proof during check-in.
            </p>
          </div>
        </div>.
        
      </div>
    </motion.div>
  );
};

export default AccommodationTab;

