import React, { useState, useEffect } from 'react';
import { Users, Phone, Mail, Copy, Camera, Film } from 'lucide-react';
import { motion } from 'framer-motion';

const TeamPage = () => {
  const [isMobile, setIsMobile] = useState(false);
  const [copiedContact, setCopiedContact] = useState(null);

  useEffect(() => {
    const checkMobile = () => setIsMobile(window.innerWidth < 768);
    checkMobile();
    window.addEventListener('resize', checkMobile);
    return () => window.removeEventListener('resize', checkMobile);
  }, []);

  // Top 3 team members for cards
  const teamMembers = [
    {
      id: 1,
      name: 'Dr. S P Balakannan',
      image: '/Teams/Balakannan.png', // Or use BalakannanImage if imported
      color: 'from-purple-600 to-pink-600',
      role: 'Director - Student Affairs',
      accentColor: 'border-purple-500',
    },
      {
      id: 2,
      name: 'Dr. P Priya',
      image: '/Teams/Priya.jpeg', // Or use PriyaImage if imported
      color: 'from-amber-600 to-yellow-600',
      role: 'Overall Coordinator',
      accentColor: 'border-amber-500',
    },
    {
      id: 3,
      name: 'Dr. C Sangeetha',
      image: '/Teams/Sangeetha.jpeg', // Or use SangeethaImage if imported
      color: 'from-blue-600 to-cyan-600',
      role: 'Overall Coordinator',
      accentColor: 'border-blue-500',
    }
  ];

  // Contact list data
  const contactList = [
    { id: 1, name: 'Jeyavel M', phone: '6382952819', club: 'FAC' },
    { id: 2, name: 'Sakthi', phone: '8015566148', club: 'FAC' },
    { id: 3, name: 'D. Bhuvanesh', phone: '8925597374', club: 'Nature Club' },
    { id: 4, name: 'G Deva Vinayagam', phone: '6379131320', club: 'Photography' },
    { id: 5, name: 'R Bharath Prasath', phone: '9344367178', club: 'Tamil Mandram' },
    { id: 6, name: 'Barathsuriya M', phone: '8248296749', club: 'Youth Red Cross' },
    { id: 7, name: 'Mukesh K M S', phone: '9360256245', club: 'National Service Scheme' },
    { id: 8, name: 'P. Chaitanya Reddy', phone: '9573457152', club: 'YUVA Tourism Club' },
    { id: 9, name: 'M Barnes Samuel', phone: '7901444653', club: 'Vishaka Club' },
    { id: 10, name: 'S Vijayan', phone: '6374724920', club: 'Green Army' },
  ];

  const handleCopyPhone = (phone, name) => {
    navigator.clipboard.writeText(phone);
    setCopiedContact(name);
    setTimeout(() => setCopiedContact(null), 2000);
  };

  const handleCall = (phone) => {
    window.open(`tel:${phone}`);
  };

  // Animation variants
  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.1,
        delayChildren: 0.2
      }
    }
  };

  const itemVariants = {
    hidden: { y: 20, opacity: 0 },
    visible: {
      y: 0,
      opacity: 1,
      transition: {
        type: "spring",
        stiffness: 100,
        damping: 12
      }
    }
  };

  const cardVariants = {
    hidden: { scale: 0.9, opacity: 0 },
    visible: {
      scale: 1,
      opacity: 1,
      transition: {
        type: "spring",
        stiffness: 100,
        damping: 15
      }
    }
  };

  return (
    <div className="min-h-screen pt-20 pb-24 px-4 bg-gradient-to-b from-black via-gray-900 to-black">
      {/* Animated Background */}
      <div className="fixed inset-0 z-0 overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-br from-black via-gray-900 to-black"></div>
        <div className="absolute top-1/4 -left-20 w-96 h-96 bg-amber-500/5 rounded-full blur-3xl"></div>
        <div className="absolute bottom-1/4 -right-20 w-96 h-96 bg-blue-500/5 rounded-full blur-3xl"></div>
        
        {/* Grid Pattern */}
        <div 
          className="absolute inset-0 opacity-5"
          style={{
            backgroundImage: `linear-gradient(rgba(245, 158, 11, 0.2) 1px, transparent 1px),
                            linear-gradient(90deg, rgba(245, 158, 11, 0.2) 1px, transparent 1px)`,
            backgroundSize: '40px 40px',
          }}
        />
      </div>

      <div className="relative z-10 max-w-6xl mx-auto">
        {/* Header - Updated for DIRECTOR'S CUT */}
        <motion.div
          initial={{ opacity: 0, y: -30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8 }}
          className="text-center mb-12 md:mb-16"
        >
          <div className="inline-block mb-6">
            <div className="p-4 bg-gradient-to-r from-amber-600/20 to-red-600/20 rounded-2xl border border-amber-500/30 backdrop-blur-sm">
              <Film className="w-12 h-12 text-amber-400 mx-auto" />
            </div>
          </div>
          
          <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold font-['Cinzel'] text-white mb-4">
            <span className="bg-gradient-to-r from-amber-400 via-yellow-400 to-amber-400 bg-clip-text text-transparent">
              DIRECTOR'S CUT
            </span>
          </h1>
          
          <p className="text-white/70 text-lg md:text-xl max-w-3xl mx-auto">
            The visionary minds behind SPARKZ'26
          </p>
        </motion.div>

        {/* 3 Cards Section - Updated Design */}
        <motion.div 
          variants={containerVariants}
          initial="hidden"
          animate="visible"
          className="grid grid-cols-1 md:grid-cols-3 gap-8 mb-16 px-4 md:px-0"
        >
          {teamMembers.map((member, index) => (
            <motion.div
              key={member.id}
              variants={cardVariants}
              custom={index}
              whileHover={{ y: -8, scale: 1.03 }}
              className="group relative"
            >
              <div className="relative bg-gradient-to-b from-gray-900/90 to-black/90 backdrop-blur-xl rounded-xl overflow-hidden border border-white/10 hover:border-amber-500/50 transition-all duration-500 shadow-2xl h-full">
                {/* Film Strip Effect on Top */}
                <div className="absolute top-0 left-0 right-0 h-4 bg-gradient-to-r from-black via-gray-800 to-black z-10 flex items-center px-2">
                  <div className="flex space-x-1">
                    {[...Array(5)].map((_, i) => (
                      <div key={i} className="w-2 h-2 rounded-full bg-amber-400/30"></div>
                    ))}
                  </div>
                </div>
                
                {/* Image Container */}
                <div className="relative h-72 md:h-80 overflow-hidden pt-4">
                  {/* Gradient Border Around Image */}
                  <div className="absolute inset-4 rounded-lg overflow-hidden">
                    {/* Actual Image */}
                    <img 
                      src={member.image} 
                      alt={member.name}
                      className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-110"
                      onError={(e) => {
                        // Fallback if image fails to load
                        e.target.style.display = 'none';
                        e.target.parentElement.innerHTML = `
                          <div class="w-full h-full flex items-center justify-center bg-gradient-to-br ${member.color}">
                            <Users class="w-24 h-24 text-white/90" />
                          </div>
                        `;
                      }}
                    />
                    
                    {/* Gradient Overlay */}
                    <div className="absolute inset-0 bg-gradient-to-t from-black/90 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500"></div>
                    
                    {/* Film Grain Effect */}
                    <div className="absolute inset-0 opacity-[0.02] group-hover:opacity-[0.03] transition-opacity duration-500"
                      style={{
                        backgroundImage: `url("data:image/svg+xml,%3Csvg viewBox='0 0 256 256' xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='noiseFilter'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.65' numOctaves='3' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23noiseFilter)'/%3E%3C/svg%3E")`,
                      }}
                    />
                  </div>
                  
                  {/* Camera Icon Badge */}
                  <div className="absolute top-8 right-8 p-2 bg-black/70 backdrop-blur-sm rounded-full border border-white/20">
                    <Camera className="w-5 h-5 text-amber-400" />
                  </div>
                </div>
                
                {/* Name Section - Split Design like in image */}
                <div className="p-6 text-center relative">
                  {/* Top Border */}
                  <div className="absolute top-0 left-4 right-4 h-px bg-gradient-to-r from-transparent via-amber-500/50 to-transparent"></div>
                  
                  {/* Name with different styling based on design */}
                  {index % 2 === 0 ? (
                    // For first and third cards (bold heading style)
                    <h3 className="text-2xl font-bold text-white mb-1 group-hover:text-amber-300 transition-colors duration-300">
                      {member.name}
                    </h3>
                  ) : (
                    // For second card (regular text style)
                    <div className="text-xl font-semibold text-white mb-1 group-hover:text-amber-200 transition-colors duration-300">
                      {member.name}
                    </div>
                  )}
                  
                  {/* Role Tag */}
                  <div className="px-3 py-1 bg-gradient-to-r from-amber-900/30 to-red-900/30 backdrop-blur-sm rounded-full border border-amber-500/30 inline-block mb-2">
                    <span className="text-amber-300 text-xs font-medium uppercase">
                      {member.role}
                    </span>
                  </div>
                  
                  {/* Bottom Border */}
                  <div className="absolute bottom-0 left-4 right-4 h-px bg-gradient-to-r from-transparent via-amber-500/30 to-transparent"></div>
                </div>
                
                {/* Corner Accents */}
                <div className={`absolute top-0 left-0 w-3 h-3 border-t border-l ${member.accentColor} opacity-50`}></div>
                <div className={`absolute top-0 right-0 w-3 h-3 border-t border-r ${member.accentColor} opacity-50`}></div>
                <div className={`absolute bottom-0 left-0 w-3 h-3 border-b border-l ${member.accentColor} opacity-50`}></div>
                <div className={`absolute bottom-0 right-0 w-3 h-3 border-b border-r ${member.accentColor} opacity-50`}></div>
              </div>
            </motion.div>
          ))}
        </motion.div>

        {/* Contact List Section */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.4 }}
          className="bg-gradient-to-br from-gray-900/60 to-black/60 backdrop-blur-xl rounded-xl border border-white/10 overflow-hidden shadow-2xl"
        >
          {/* Section Header */}
          <div className="bg-gradient-to-r from-amber-900/20 to-red-900/20 border-b border-white/10 p-6">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-3">
                <div className="p-2 bg-gradient-to-r from-amber-600/20 to-red-600/20 rounded-lg">
                  <Phone className="w-5 h-5 text-amber-400" />
                </div>
                <div>
                  <h2 className="text-2xl font-bold text-white">Club Coordinators</h2>
                  <p className="text-white/60 text-sm">Contact details for all club coordinators</p>
                </div>
              </div>
              <div className="hidden md:block">
                <span className="text-white/40 text-sm">{contactList.length} Contacts</span>
              </div>
            </div>
          </div>

          {/* Contact List */}
          <motion.div 
            variants={containerVariants}
            initial="hidden"
            animate="visible"
            className="p-4 md:p-6"
          >
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
              {contactList.map((contact) => (
                <motion.div
                  key={contact.id}
                  variants={itemVariants}
                  whileHover={{ x: 5 }}
                  className="group bg-white/5 hover:bg-white/10 rounded-lg border border-white/10 hover:border-amber-500/30 p-4 transition-all duration-300"
                >
                  <div className="flex items-center justify-between mb-3">
                    <div>
                      <h3 className="font-bold text-white text-lg">{contact.name}</h3>
                      <div className="flex items-center gap-2 mt-1">
                        <span className="px-2 py-1 bg-amber-900/30 text-amber-300 text-xs rounded border border-amber-500/30">
                          {contact.club}
                        </span>
                      </div>
                    </div>
                    <div className="flex items-center gap-2">
                      <button
                        onClick={() => handleCopyPhone(contact.phone, contact.name)}
                        className="p-2 hover:bg-white/10 rounded-lg transition-colors group relative"
                        title="Copy phone number"
                      >
                        <Copy className={`w-4 h-4 ${copiedContact === contact.name ? 'text-green-400' : 'text-white/60 group-hover:text-amber-400'}`} />
                        {copiedContact === contact.name && (
                          <span className="absolute -top-8 left-1/2 transform -translate-x-1/2 bg-green-600 text-white text-xs px-2 py-1 rounded whitespace-nowrap">
                            Copied!
                          </span>
                        )}
                      </button>
                      <button
                        onClick={() => handleCall(contact.phone)}
                        className="p-2 hover:bg-white/10 rounded-lg transition-colors"
                        title="Call"
                      >
                        <Phone className="w-4 h-4 text-white/60 hover:text-green-400" />
                      </button>
                    </div>
                  </div>
                  
                  <div className="flex items-center gap-2 mb-1 bg-black/30 p-2 rounded border border-white/5">
                    <span className="text-white/40 text-sm">Phone:</span>
                    <a 
                      href={`tel:${contact.phone}`}
                      className="text-amber-300 hover:text-amber-400 transition-colors font-medium"
                    >
                      +91 {contact.phone.replace(/(\d{3})(\d{3})(\d{4})/, '$1 $2 $3')}
                    </a>
                  </div>
                  
                  {/* Status Indicator */}
                  <div className="flex items-center gap-2 mt-3">
                    <div className="w-2 h-2 bg-green-500 rounded-full animate-pulse"></div>
                    <span className="text-green-400 text-xs font-medium">Available for Contact</span>
                  </div>
                </motion.div>
              ))}
            </div>
          </motion.div>

          {/* Footer Note */}
          <div className="border-t border-white/10 p-4 bg-black/20">
            <div className="flex flex-col md:flex-row items-center justify-between gap-4">
              <p className="text-white/50 text-sm text-center md:text-left">
                For immediate assistance, contact our 24/7 support desk
              </p>
            </div>
          </div>
        </motion.div>

        {/* Additional Info */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.6, delay: 0.8 }}
          className="mt-8 text-center"
        >
          <div className="inline-flex items-center gap-4 px-6 py-3 bg-white/5 backdrop-blur-sm rounded-full border border-white/10">
            <Mail className="w-5 h-5 text-amber-400" />
            <p className="text-white/70">
              For general enquiries: <a href="mailto:sparkz@kare.edu" className="text-amber-400 hover:text-amber-300 transition-colors font-medium">sparkz@klu.ac.in</a>
            </p>
          </div>
          <p className="text-white/30 text-xs mt-4">
            SPARKZ'26 Organizing Committee • All coordinators are available from 9 AM to 6 PM
          </p>
        </motion.div>
      </div>
    </div>
  );
};

export default TeamPage;