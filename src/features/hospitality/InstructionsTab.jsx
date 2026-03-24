import React from 'react';
import { motion } from 'framer-motion';
import { CheckCircle, Clock, Shield, Home } from 'lucide-react';

const instructions = [
    { title: 'Registration Process', description: 'Complete online registration before arrival. Bring your college ID and confirmation email.', icon: <CheckCircle className="text-green-500" size={24} />, color: 'from-green-500/10 to-emerald-500/10' },
    { title: 'Check-in Procedure', description: 'Check-in at the hospitality desk between 9 AM - 8 PM. Late arrivals must inform in advance.', icon: <Clock className="text-amber-500" size={24} />, color: 'from-amber-500/10 to-orange-500/10' },
    { title: 'Security Guidelines', description: 'Carry your SPARKZ ID card at all times. Follow campus rules and curfew timings.', icon: <Shield className="text-blue-500" size={24} />, color: 'from-blue-500/10 to-cyan-500/10' },
    { title: 'Accommodation Rules', description: 'Respect roommates. Maintain cleanliness. No smoking/drinking. Lights out at 11 PM.', icon: <Home className="text-purple-500" size={24} />, color: 'from-purple-500/10 to-pink-500/10' },
];

const InstructionsTab = () => {
  return (
    <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -20 }}>
      <div className="text-center mb-12">
        <h2 className="text-3xl md:text-4xl font-bold font-['Cinzel'] text-white">Guidelines & Instructions</h2>
        <p className="text-white/70 max-w-2xl mx-auto mt-4">Essential information for a smooth and memorable experience.</p>
      </div>
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {instructions.map((item, index) => (
          <motion.div
            key={index}
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: index * 0.1 }}
            className={`bg-gradient-to-br ${item.color} border border-white/10 rounded-2xl p-6 hover:border-white/20 transition-all group`}
          >
            <div className="flex items-center justify-between mb-4">{item.icon}<span className="text-xs font-mono text-white/30">#{index + 1}</span></div>
            <h3 className="text-xl font-bold text-white mb-3">{item.title}</h3>
            <p className="text-white/70">{item.description}</p>
          </motion.div>
        ))}
      </div>
    </motion.div>
  );
};

export default InstructionsTab;