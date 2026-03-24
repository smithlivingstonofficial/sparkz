import React, { useState, useEffect, useRef } from 'react';
import { 
  ChevronRight, Quote, Sparkles, User, 
  Target, Award 
} from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';

const LeadersSlider = () => {
  const [activeIndex, setActiveIndex] = useState(0);
  const [isAutoPlaying, setIsAutoPlaying] = useState(true);
  const autoPlayRef = useRef(null);

  const leaders = [
    {
      id: 1,
      name: 'Thiru T. Kalasalingam',
      honorific: '"Kalvivallal"',
      role: 'Founder Chairman',
      image: 'https://www.kalasalingam.ac.in/wp-content/uploads/2021/04/Chairman-Sir-Photo-modified-1.png',
      quote: "Education is the most powerful weapon which you can use to change the world.",
      tags: ['Visionary', 'Pioneer']
    },
    {
      id: 2,
      name: 'Dr. K. Sridharan',
      honorific: '"Illayavallal"',
      role: 'Chancellor',
      image: 'https://www.kalasalingam.ac.in/wp-content/uploads/2021/04/leader-2-modified.png',
      quote: "We strive to create leaders who will shape the future of our nation.",
      tags: ['Leadership', 'Innovation']
    },
    {
      id: 3,
      name: 'Dr. S. Arivalagi',
      honorific: '',
      role: 'Pro Chancellor',
      image: 'https://www.kalasalingam.ac.in/wp-content/uploads/2021/10/Dr.-Arivalagi-modified.png',
      quote: "Excellence in administration leads to excellence in education.",
      tags: ['Strategy', 'Growth']
    },
    {
      id: 4,
      name: 'Dr. S. Shasi Anand',
      honorific: '',
      role: 'Vice President',
      image: 'https://www.kalasalingam.ac.in/wp-content/uploads/2022/06/VP.png',
      quote: "Innovation in curriculum is key to staying relevant in the modern world.",
      tags: ['Academic', 'Research']
    },
    {
      id: 5,
      name: 'Mr. S. Arjun Kalasalingam',
      honorific: '',
      role: 'Vice President',
      image: 'https://www.kalasalingam.ac.in/wp-content/uploads/2021/04/Arjun-Sir-1-modified-1.png',
      quote: "Building world-class infrastructure for world-class minds.",
      tags: ['Operations', 'Infrastructure']
    },
    {
      id: 6,
      name: 'Dr. S. Narayanan',
      honorific: '',
      role: 'Vice-Chancellor',
      image: 'https://www.kalasalingam.ac.in/wp-content/uploads/2023/01/VC-Dr-S-Narayanan-Photo.png',
      quote: "Research and collaboration are the pillars of a great university.",
      tags: ['Research', 'Global Ties']
    },
    {
      id: 7,
      name: 'Dr. V. Vasudevan',
      honorific: '',
      role: 'Registrar',
      image: 'https://www.kalasalingam.ac.in/wp-content/uploads/2024/04/drvv.png',
      quote: "Ensuring smooth governance for a thriving academic environment.",
      tags: ['Governance', 'Policy']
    }
  ];

  // Auto-play logic
  useEffect(() => {
    if (isAutoPlaying) {
      autoPlayRef.current = setInterval(() => {
        setActiveIndex((prev) => (prev + 1) % leaders.length);
      }, 5000);
    }
    return () => clearInterval(autoPlayRef.current);
  }, [isAutoPlaying, leaders.length]);

  const handleManualChange = (index) => {
    setIsAutoPlaying(false);
    setActiveIndex(index);
  };

  return (
    <section className="relative min-h-[90vh] bg-[#050505] text-white overflow-hidden py-12 md:py-20 flex items-center">
      
      {/* --- BACKGROUND FX --- */}
      <div className="absolute inset-0 z-0 overflow-hidden pointer-events-none">
        {/* Animated Orbs */}
        <div className="absolute top-[-10%] right-[-10%] w-[50vw] h-[50vw] bg-amber-600/10 rounded-full blur-[100px] animate-pulse"></div>
        <div className="absolute bottom-[-10%] left-[-10%] w-[40vw] h-[40vw] bg-red-900/10 rounded-full blur-[120px]"></div>
        
        {/* Grid Texture */}
        <div className="absolute inset-0 opacity-[0.05]" 
             style={{ backgroundImage: 'radial-gradient(circle at 1px 1px, rgba(255,255,255,0.15) 1px, transparent 0)', backgroundSize: '40px 40px' }}>
        </div>
      </div>

      <div className="relative z-10 max-w-7xl mx-auto px-4 w-full h-full">
        
        {/* HEADER */}
        <div className="flex flex-col md:flex-row items-start md:items-end justify-between mb-12 md:mb-20">
          <div>
            <div className="flex items-center gap-2 text-amber-500 font-bold tracking-[0.2em] text-xs md:text-sm uppercase mb-3">
              <Award size={16} />
              <span>The Visionaries</span>
            </div>
            <h2 className="text-4xl md:text-7xl font-black uppercase leading-none tracking-tighter">
              Leadership <span className="text-transparent stroke-white" style={{ WebkitTextStroke: '1px white' }}>Council</span>
            </h2>
          </div>
          
          {/* Progress Indicator */}
          <div className="hidden md:flex flex-col items-end gap-2">
            <span className="text-xs font-mono text-gray-400">LEADER_ID: 0{activeIndex + 1}</span>
            <div className="flex gap-1">
              {leaders.map((_, i) => (
                <div 
                  key={i} 
                  className={`h-1 rounded-full transition-all duration-500 ${i === activeIndex ? 'w-8 bg-amber-500' : 'w-2 bg-gray-800'}`} 
                />
              ))}
            </div>
          </div>
        </div>

        {/* MAIN CONTENT GRID */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-center">
          
          {/* LEFT: INTERACTIVE LIST */}
          <div className="lg:col-span-4 order-2 lg:order-1 flex flex-col gap-3 max-h-[500px] overflow-y-auto custom-scrollbar pr-2">
            {leaders.map((leader, index) => (
              <button
                key={leader.id}
                onClick={() => handleManualChange(index)}
                className={`group relative w-full text-left p-4 rounded-xl transition-all duration-300 border-l-2 ${
                  activeIndex === index 
                    ? 'bg-gradient-to-r from-amber-500/10 to-transparent border-amber-500' 
                    : 'bg-transparent border-gray-800 hover:bg-white/5 hover:border-gray-600'
                }`}
              >
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-4">
                    <div className={`w-10 h-10 rounded-full overflow-hidden border-2 ${activeIndex === index ? 'border-amber-500' : 'border-gray-700 grayscale group-hover:grayscale-0'}`}>
                      <img src={leader.image} alt={leader.name} className="w-full h-full object-cover" />
                    </div>
                    <div>
                      <p className={`text-[10px] font-bold uppercase tracking-wider mb-0.5 ${
                        activeIndex === index ? 'text-amber-500' : 'text-gray-500'
                      }`}>
                        {leader.role}
                      </p>
                      <h3 className={`text-sm md:text-base font-bold transition-colors ${
                        activeIndex === index ? 'text-white' : 'text-gray-400 group-hover:text-white'
                      }`}>
                        {leader.name}
                      </h3>
                    </div>
                  </div>
                  {activeIndex === index && (
                    <Sparkles className="text-amber-500 w-4 h-4" />
                  )}
                </div>
              </button>
            ))}
          </div>

          {/* RIGHT: CIRCULAR ORBIT SHOWCASE */}
          <div className="lg:col-span-8 order-1 lg:order-2 min-h-[500px] flex items-center justify-center relative">
            
            <AnimatePresence mode='wait'>
              <motion.div 
                key={activeIndex}
                initial={{ opacity: 0, scale: 0.9 }}
                animate={{ opacity: 1, scale: 1 }}
                exit={{ opacity: 0, scale: 1.1 }}
                transition={{ duration: 0.5, ease: "circOut" }}
                className="relative w-full flex flex-col items-center justify-center text-center"
              >
                
                {/* --- ORBITAL SYSTEM --- */}
                <div className="relative w-[280px] h-[280px] md:w-[400px] md:h-[400px] mb-8 flex items-center justify-center">
                  
                  {/* Rotating Dashed Ring */}
                  <div className="absolute inset-[-20px] rounded-full border border-dashed border-gray-700 w-full h-full animate-[spin_20s_linear_infinite] opacity-50 scale-110"></div>
                  
                  {/* Glowing Static Ring */}
                  <div className="absolute inset-[-4px] rounded-full border-2 border-amber-500/30 w-full h-full shadow-[0_0_50px_rgba(245,158,11,0.2)]"></div>

                  {/* The Circular Image */}
                  <div className="relative w-full h-full rounded-full overflow-hidden border-4 border-black bg-gray-900 shadow-2xl z-10 group">
                    <div className="absolute inset-0 bg-gradient-to-tr from-amber-500/20 to-transparent z-20 mix-blend-overlay"></div>
                    <img 
                      src={leaders[activeIndex].image} 
                      alt={leaders[activeIndex].name}
                      className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-110"
                    />
                  </div>

                  {/* Decorative Satellite Dots */}
                  <div className="absolute top-0 left-1/2 -translate-x-1/2 -translate-y-[24px] w-3 h-3 bg-amber-500 rounded-full shadow-[0_0_15px_rgba(245,158,11,1)] z-20"></div>
                  <div className="absolute bottom-0 left-1/2 -translate-x-1/2 translate-y-[24px] w-2 h-2 bg-red-500 rounded-full z-20"></div>

                </div>

                {/* --- CONTENT INFO --- */}
                <div className="relative z-30 max-w-2xl">
                  {/* Honorific */}
                  {leaders[activeIndex].honorific && (
                    <motion.div 
                      initial={{ opacity: 0, y: 10 }}
                      animate={{ opacity: 1, y: 0 }}
                      className="text-amber-500 font-serif italic text-lg md:text-xl mb-2"
                    >
                      {leaders[activeIndex].honorific}
                    </motion.div>
                  )}

                  {/* Name */}
                  <motion.h2 
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.1 }}
                    className="text-3xl md:text-5xl font-black uppercase text-white mb-2 tracking-tight"
                  >
                    {leaders[activeIndex].name}
                  </motion.h2>

                  {/* Role Tag */}
                  <motion.div 
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    transition={{ delay: 0.2 }}
                    className="inline-block px-4 py-1.5 rounded-full bg-white/10 border border-white/10 text-xs md:text-sm font-bold uppercase tracking-widest text-gray-300 mb-6 backdrop-blur-md"
                  >
                    {leaders[activeIndex].role}
                  </motion.div>

                  {/* Quote Box */}
                  <motion.div 
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.3 }}
                    className="relative bg-gradient-to-b from-gray-900 to-black border border-gray-800 p-6 md:p-8 rounded-2xl shadow-xl mx-4 md:mx-0"
                  >
                    <Quote className="absolute -top-4 -left-2 text-amber-500 bg-black p-1 rounded-full border border-gray-800" size={32} />
                    <p className="text-gray-300 font-light text-base md:text-lg leading-relaxed italic">
                      "{leaders[activeIndex].quote}"
                    </p>
                    
                    {/* Tags */}
                    <div className="flex justify-center gap-3 mt-4 pt-4 border-t border-gray-800">
                       {leaders[activeIndex].tags.map((tag, i) => (
                         <div key={i} className="flex items-center gap-1 text-xs text-gray-500 uppercase font-bold">
                           <Target size={12} className="text-amber-500" /> {tag}
                         </div>
                       ))}
                    </div>
                  </motion.div>

                </div>

              </motion.div>
            </AnimatePresence>
            
          </div>
        </div>

        {/* MOBILE CONTROLS */}
        <div className="flex md:hidden justify-center items-center gap-6 mt-8">
            <button 
                onClick={() => handleManualChange((activeIndex - 1 + leaders.length) % leaders.length)}
                className="w-12 h-12 flex items-center justify-center rounded-full bg-white/10 border border-white/10 active:bg-amber-500 active:text-black transition-all"
            >
                <ChevronRight className="rotate-180" />
            </button>
            <span className="text-sm font-mono text-amber-500 font-bold">
                {activeIndex + 1} / {leaders.length}
            </span>
            <button 
                onClick={() => handleManualChange((activeIndex + 1) % leaders.length)}
                className="w-12 h-12 flex items-center justify-center rounded-full bg-white/10 border border-white/10 active:bg-amber-500 active:text-black transition-all"
            >
                <ChevronRight />
            </button>
        </div>

      </div>

      <style jsx>{`
        .stroke-white { -webkit-text-stroke: 1px white; }
        .custom-scrollbar::-webkit-scrollbar {
            width: 4px;
        }
        .custom-scrollbar::-webkit-scrollbar-track {
            background: rgba(0, 0, 0, 0.2);
        }
        .custom-scrollbar::-webkit-scrollbar-thumb {
            background: rgba(245, 158, 11, 0.3);
            border-radius: 4px;
        }
      `}</style>
    </section>
  );
};

export default LeadersSlider;