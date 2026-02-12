import React from 'react';
import { Download, Phone, User, Sparkles } from 'lucide-react';
import { motion, useMotionValue, useSpring, useTransform } from 'framer-motion';

const SponsorsPage = () => {
  // ========== CONFIGURATION ==========
  const sponsorshipDetails = {
    name: "MR.M.Bharath Kesaven",
    phone: "+91 95007 60669",
    brochureLink: "https://drive.google.com/file/d/1EA8bkm-52q_6_5uCLJe0T_fumTEv2qWo/view?usp=sharing"
  };
  // ===================================

  // --- 3D CARD ANIMATION HOOKS ---
  const x = useMotionValue(0);
  const y = useMotionValue(0);

  const mouseX = useSpring(x, { stiffness: 300, damping: 50, mass: 0.5 });
  const mouseY = useSpring(y, { stiffness: 300, damping: 50, mass: 0.5 });

  const rotateX = useTransform(mouseY, [-0.5, 0.5], ["12deg", "-12deg"]);
  const rotateY = useTransform(mouseX, [-0.5, 0.5], ["-12deg", "12deg"]);

  const handleMouseMove = (e) => {
    const rect = e.currentTarget.getBoundingClientRect();
    const width = rect.width;
    const height = rect.height;
    const mouseXPos = e.clientX - rect.left;
    const mouseYPos = e.clientY - rect.top;
    const xPct = mouseXPos / width - 0.5;
    const yPct = mouseYPos / height - 0.5;
    x.set(xPct);
    y.set(yPct);
  };

  const handleMouseLeave = () => {
    x.set(0);
    y.set(0);
  };

  // --- DOWNLOAD LINK HELPER ---
  const getDirectDownloadLink = (url) => {
    if (!url || !url.includes('drive.google.com')) return url;
    const idMatch = url.match(/\/d\/(.+?)\/|\?id=(.+)/);
    if (idMatch) {
      const fileId = idMatch[1] || idMatch[2];
      return `https://drive.google.com/uc?export=download&id=${fileId}`;
    }
    return url;
  };

  const downloadUrl = getDirectDownloadLink(sponsorshipDetails.brochureLink);

  // --- ANIMATION VARIANTS ---
  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: { staggerChildren: 0.2, delayChildren: 0.3 },
    },
  };

  const itemVariants = {
    hidden: { opacity: 0, y: 30 },
    visible: { opacity: 1, y: 0, transition: { type: 'spring', stiffness: 100 } },
  };

  return (
    <div className="min-h-screen bg-black pt-24 px-4 pb-12 relative overflow-hidden flex items-center justify-center">
      
      {/* --- ANIMATED BACKGROUND --- */}
      <div className="fixed inset-0 z-0 pointer-events-none">
        <div className="absolute inset-0 bg-gradient-to-br from-[#0a0a0a] to-black" />
        {/* Particle Field */}
        {[...Array(30)].map((_, i) => (
          <motion.div
            key={i}
            className="absolute w-1 h-1 bg-amber-500/20 rounded-full"
            initial={{ 
              x: Math.random() * window.innerWidth, 
              y: Math.random() * window.innerHeight,
              opacity: 0,
            }}
            animate={{ 
              y: [null, Math.random() * window.innerHeight * -1],
              opacity: [0, 1, 0]
            }}
            transition={{ 
              duration: Math.random() * 10 + 10, 
              repeat: Infinity, 
              ease: "linear",
              delay: Math.random() * 5
            }}
          />
        ))}
        {/* Gradient Glows */}
        <div className="absolute top-0 left-0 w-[50vw] h-[50vw] bg-amber-600/10 rounded-full blur-[150px] animate-pulse" />
        <div className="absolute bottom-0 right-0 w-[40vw] h-[40vw] bg-red-600/10 rounded-full blur-[120px]" />
      </div>

      {/* --- MAIN CONTENT CONTAINER --- */}
      <motion.div 
        variants={containerVariants}
        initial="hidden"
        animate="visible"
        className="relative z-10 flex flex-col items-center"
      >
        
        {/* --- HEADER --- */}
        <motion.div variants={itemVariants} className="text-center mb-12">
          <div className="mb-4 inline-flex items-center gap-2 px-4 py-2 bg-white/5 backdrop-blur-md rounded-full border border-white/10">
            <Sparkles className="w-4 h-4 text-amber-400" />
            <span className="text-amber-300 text-xs font-bold tracking-[0.2em] uppercase">Join The Legend</span>
          </div>
          <h1 className="text-5xl md:text-7xl font-black uppercase text-white tracking-tighter">
            Become a <span className="text-transparent bg-clip-text bg-gradient-to-r from-amber-400 to-red-500">Partner</span>
          </h1>
          <p className="max-w-xl mx-auto mt-4 text-lg text-gray-400 font-light">
            Align your brand with the most anticipated cultural event of the year.
          </p>
        </motion.div>

        {/* --- 3D INTERACTIVE CARD --- */}
        <motion.div
          variants={itemVariants}
          onMouseMove={handleMouseMove}
          onMouseLeave={handleMouseLeave}
          style={{
            rotateX,
            rotateY,
            transformStyle: "preserve-3d",
          }}
          className="relative w-full max-w-4xl rounded-[2rem] bg-white/5 backdrop-blur-xl border border-white/10 shadow-2xl p-8 md:p-12 perspective-800"
        >
          {/* Shimmer Effect */}
          <div className="absolute inset-0 rounded-[2rem] overflow-hidden pointer-events-none">
            <motion.div 
              style={{
                x: useTransform(mouseX, [-0.5, 0.5], ["-50%", "50%"]),
                y: useTransform(mouseY, [-0.5, 0.5], ["-50%", "50%"])
              }}
              className="absolute w-[800px] h-[800px] bg-[radial-gradient(circle,rgba(255,255,255,0.1)_0%,rgba(255,255,255,0)_60%)] -translate-x-1/2 -translate-y-1/2"
            />
          </div>

          <div style={{ transform: "translateZ(40px)" }} className="flex flex-col items-center gap-8">
            
            {/* Contact Cards Row */}
            <div className="flex flex-col md:flex-row gap-6 w-full justify-center">

              {/* Contact Person Card */}
              <motion.div 
                whileHover={{ scale: 1.05, y: -5, transition: { duration: 0.2 } }}
                className="flex items-center gap-4 bg-black/40 px-6 py-4 rounded-xl border border-white/10 w-full sm:w-auto shadow-lg"
              >
                <div className="p-3 bg-gradient-to-br from-amber-900 to-amber-700 rounded-lg text-amber-300">
                  <User className="w-5 h-5" />
                </div>
                <div className="text-left">
                  <p className="text-xs text-gray-400 uppercase tracking-widest font-semibold">CONTACT</p>
                  <p className="text-white font-bold text-base">{sponsorshipDetails.name}</p>
                </div>
              </motion.div>

              {/* Phone Card */}
              <motion.a
                whileHover={{ scale: 1.05, y: -5, transition: { duration: 0.2 } }}
                href={`tel:${sponsorshipDetails.phone.replace(/\s+/g, '')}`}
                className="flex items-center gap-4 bg-black/40 px-6 py-4 rounded-xl border border-white/10 w-full sm:w-auto shadow-lg"
              >
                <div className="p-3 bg-gradient-to-br from-red-900 to-red-700 rounded-lg text-red-300">
                  <Phone className="w-5 h-5" />
                </div>
                <div className="text-left leading-tight">
                  <p className="text-xs text-gray-400 uppercase tracking-widest font-semibold">CALL US</p>
                  <div className="text-white font-bold text-base tracking-wide">
                    {sponsorshipDetails.phone}
                  </div>
                </div>
              </motion.a>
            </div>
            
            {/* Divider */}
            <div className="h-px w-2/3 bg-gradient-to-r from-transparent via-white/20 to-transparent" />

            {/* Download Button */}
            <div className="text-center">
              <motion.a
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                href={downloadUrl}
                download
                className="group relative inline-flex items-center justify-center gap-3 px-10 py-5 bg-gradient-to-r from-orange-600 to-red-600 text-white font-bold text-sm uppercase tracking-widest rounded-full hover:shadow-[0_0_35px_rgba(234,88,12,0.5)] transition-all duration-300"
              >
                <Download className="w-5 h-5 transition-transform duration-300 group-hover:-rotate-12" />
                <span>Download Brochure</span>
              </motion.a>
              <p className="text-white/40 text-xs uppercase tracking-widest font-mono mt-3">
                Get The Full Proposal
              </p>
            </div>

          </div>
        </motion.div>
      </motion.div>
    </div>
  );
};

export default SponsorsPage;