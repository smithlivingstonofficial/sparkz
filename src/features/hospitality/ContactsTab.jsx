import React from 'react';
import { motion } from 'framer-motion';
import { Phone, Mail, ShieldCheck, Bus, FileText, User } from 'lucide-react';

const ContactsTab = () => {
  const contacts = [
    { 
      role: 'Accommodation', // This will be the Heading
      name: 'Dr. T. Rajpradeesh', 
      phone: '+91 77087 50112', 
      email: 'sparkz@klu.ac.in',
      icon: <ShieldCheck className="w-8 h-8" />
    },
    { 
      role: 'Transport', // This will be the Heading
      name: 'Dr. G. Satheeswaren', 
      phone: '+91 73395 27514', 
      email: 'sparkz@klu.ac.in',
      icon: <Bus className="w-8 h-8" />
    },
    { 
      role: 'Registration', // This will be the Heading
      name: 'Dr. G. Kalusuraman', 
      phone: '+91 99945 74058', 
      email: 'sparkz@klu.ac.in',
      icon: <FileText className="w-8 h-8" />
    },
  ];

  return (
    <motion.div
      initial={{ opacity: 0, scale: 0.95 }}
      animate={{ opacity: 1, scale: 1 }}
      exit={{ opacity: 0, scale: 0.95 }}
      transition={{ duration: 0.3 }}
      className="max-w-6xl mx-auto"
    >
      <div className="text-center mb-12">
        <h2 className="text-4xl font-bold text-white font-['Cinzel'] text-transparent bg-clip-text bg-gradient-to-r from-amber-200 to-amber-500">
          Contact Support
        </h2>
        <p className="text-white/60 mt-3 font-['Rajdhani'] text-lg">
          Reach out to our coordinators for assistance
        </p>
      </div>

      <div className="grid md:grid-cols-3 gap-8">
        {contacts.map((contact, index) => (
          <div 
            key={index} 
            className="group relative bg-[#0a0a0a] border border-white/10 rounded-2xl overflow-hidden hover:border-amber-500/50 hover:shadow-[0_0_30px_rgba(245,158,11,0.15)] transition-all duration-300 flex flex-col"
          >
            {/* Top Colored Bar */}
            <div className="h-1 w-full bg-gradient-to-r from-amber-600 via-orange-500 to-red-600" />

            <div className="p-8 flex flex-col items-center text-center flex-1">
              
              {/* HEADING: ROLE */}
              <h3 className="text-xl font-bold font-['Cinzel'] tracking-widest text-transparent bg-clip-text bg-gradient-to-r from-amber-400 to-orange-400 mb-6 uppercase">
                {contact.role}
              </h3>

              {/* Icon Container with Glow */}
              <div className="relative mb-6">
                <div className="absolute inset-0 bg-amber-500/20 blur-xl rounded-full scale-0 group-hover:scale-150 transition-transform duration-500" />
                <div className="relative w-20 h-20 rounded-full bg-[#151515] border border-white/10 flex items-center justify-center text-white group-hover:text-amber-400 group-hover:border-amber-500/50 transition-all duration-300">
                  {contact.icon}
                </div>
              </div>

              {/* Name */}
              <h4 className="text-xl font-bold text-white font-['Rajdhani'] mb-8">
                {contact.name}
              </h4>

              {/* Action Buttons */}
              <div className="w-full space-y-3 mt-auto">
                <a 
                  href={`tel:${contact.phone.replace(/\s+/g, '')}`} 
                  className="flex items-center justify-center gap-3 w-full py-3 bg-white/5 hover:bg-gradient-to-r hover:from-amber-600 hover:to-orange-600 rounded-xl border border-white/10 hover:border-transparent transition-all duration-300 text-sm font-medium text-gray-300 hover:text-white group/btn"
                >
                  <Phone className="w-4 h-4" />
                  <span>{contact.phone}</span>
                </a>
                
                <a 
                  href={`mailto:${contact.email}`} 
                  className="flex items-center justify-center gap-3 w-full py-3 bg-transparent hover:bg-white/5 rounded-xl border border-white/10 hover:border-white/30 transition-all duration-300 text-sm font-medium text-gray-400 hover:text-white"
                >
                  <Mail className="w-4 h-4" />
                  <span>Email Support</span>
                </a>
              </div>
            </div>
          </div>
        ))}
      </div>
    </motion.div>
  );
};

export default ContactsTab;