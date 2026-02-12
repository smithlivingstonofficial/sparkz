import React, { useLayoutEffect, useRef, useState, useEffect } from "react";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { motion, AnimatePresence } from "framer-motion";
import { Play, ChevronDown, Ticket, Zap, Star } from "lucide-react";
import { Link } from "react-router-dom";

gsap.registerPlugin(ScrollTrigger);

const Hero = () => {
  const containerRef = useRef(null);
  const titleWrapperRef = useRef(null);
  const harryRef = useRef(null);
  const professorRef = useRef(null);
  
  const [isMobile, setIsMobile] = useState(false);
  const [mobileCharIndex, setMobileCharIndex] = useState(0);
  const [introComplete, setIntroComplete] = useState(false);

  // --- 1. SETUP ---
  useEffect(() => {
    const checkMobile = () => setIsMobile(window.innerWidth < 768);
    checkMobile();
    window.addEventListener('resize', checkMobile);

    const hasSeenIntro = sessionStorage.getItem('sparkz_intro_seen');
    if (hasSeenIntro) {
      setIntroComplete(true);
    } else {
      setTimeout(() => {
        setIntroComplete(true);
        sessionStorage.setItem('sparkz_intro_seen', 'true');
      }, 2200);
    }

    return () => window.removeEventListener('resize', checkMobile);
  }, []);

  // --- 2. MOBILE AUTO-SWITCH ---
  useEffect(() => {
    if (!isMobile) return;
    const interval = setInterval(() => {
      setMobileCharIndex(prev => (prev === 0 ? 1 : 0));
    }, 6000);
    return () => clearInterval(interval);
  }, [isMobile]);

  // --- 3. CINEMATIC ENTRANCE ---
  useLayoutEffect(() => {
    if (!introComplete) return;

    const ctx = gsap.context(() => {
      const tl = gsap.timeline();

      // Text Reveal
      tl.from(".hero-char", {
        y: 100,
        opacity: 0,
        rotateX: -90,
        filter: "blur(10px)",
        duration: 1.2,
        stagger: 0.04,
        ease: "power3.out"
      })
      .from(".hero-fade", {
        y: 20,
        opacity: 0,
        duration: 0.8,
        stagger: 0.1,
        ease: "power2.out"
      }, "-=0.6");

      // Character Reveal (Desktop)
      if (!isMobile) {
        tl.fromTo(harryRef.current, 
          { x: -50, opacity: 0, scale: 0.95 },
          { x: 0, opacity: 1, scale: 1, duration: 1.5, ease: "power3.out" },
          "-=1.2"
        )
        .fromTo(professorRef.current,
          { x: 50, opacity: 0, scale: 0.95 },
          { x: 0, opacity: 1, scale: 1, duration: 1.5, ease: "power3.out" },
          "-=1.3"
        );
      }
    }, containerRef);

    return () => ctx.revert();
  }, [introComplete, isMobile]);

  // --- 4. 3D PARALLAX (Desktop) ---
  const handleMouseMove = (e) => {
    if (isMobile) return;
    
    const x = (e.clientX / window.innerWidth - 0.5);
    const y = (e.clientY / window.innerHeight - 0.5);

    // Text Tilt
    gsap.to(titleWrapperRef.current, {
      rotateX: -y * 10,
      rotateY: x * 10,
      x: x * 20,
      y: y * 10,
      duration: 1,
      ease: "power2.out"
    });

    // Character Parallax (Opposite direction for depth)
    gsap.to(harryRef.current, { x: x * -40, y: y * -20, duration: 1.2 });
    gsap.to(professorRef.current, { x: x * -50, y: y * -25, duration: 1.2 });
  };

  return (
    <section 
      ref={containerRef}
      onMouseMove={handleMouseMove}
      className="relative h-[100dvh] w-full overflow-hidden bg-[#020101] flex flex-col items-center justify-center perspective-1000"
    >
      
      {/* --- INTRO OVERLAY --- */}
      <AnimatePresence>
        {!introComplete && (
          <motion.div 
            initial={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 1 }}
            className="fixed inset-0 z-[100] bg-black flex items-center justify-center"
          >
            <div className="flex flex-col items-center gap-4">
              <img src="/kare.png" alt="KARE" className="w-20 md:w-28 animate-pulse" />
              <div className="h-0.5 w-32 bg-gray-800 overflow-hidden rounded-full">
                <motion.div 
                  initial={{ x: "-100%" }} 
                  animate={{ x: "0%" }} 
                  transition={{ duration: 1.5, ease: "easeInOut" }} 
                  className="h-full w-full bg-amber-500"
                />
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* --- ATMOSPHERE & BACKGROUND --- */}
      <div className="absolute inset-0 z-0 pointer-events-none">
        {/* Dynamic Spotlights */}
        <div className="absolute top-[-20%] left-[-10%] w-[70vw] h-[70vw] bg-amber-600/10 blur-[150px] rounded-full mix-blend-screen animate-pulse duration-[4000ms]"></div>
        <div className="absolute bottom-[-20%] right-[-10%] w-[60vw] h-[60vw] bg-red-900/10 blur-[120px] rounded-full mix-blend-screen"></div>
        
        {/* Film Grain */}
        <div className="absolute inset-0 opacity-[0.05]" style={{ backgroundImage: `url("data:image/svg+xml,%3Csvg viewBox='0 0 200 200' xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='noiseFilter'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.8' numOctaves='3' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23noiseFilter)' opacity='1'/%3E%3C/svg%3E")` }}></div>

        {/* Fireflies / Particles */}
        {[...Array(25)].map((_, i) => (
          <motion.div
            key={i}
            className="absolute w-1 h-1 bg-amber-400/40 rounded-full blur-[1px]"
            initial={{ 
              x: Math.random() * window.innerWidth, 
              y: Math.random() * window.innerHeight 
            }}
            animate={{ 
              y: [null, Math.random() * -100], 
              opacity: [0, 0.8, 0],
              scale: [0, 1.5, 0]
            }}
            transition={{ 
              duration: Math.random() * 8 + 4, 
              repeat: Infinity, 
              ease: "linear",
              delay: Math.random() * 5
            }}
          />
        ))}
      </div>

      {/* =========================================
          CONTENT LAYER
      ========================================= */}
      <div className="relative w-full h-full max-w-[1800px] mx-auto z-10 grid grid-rows-[1fr_auto] md:block">

        {/* --- 1. TITLE & INFO (Centered) --- */}
        <div className="relative z-30 flex flex-col items-center justify-start md:justify-center w-full h-full pt-20 md:pt-0 pointer-events-none">
          
          <div ref={titleWrapperRef} className="flex flex-col items-center">
            
            {/* Top Badge */}
            <div className="hero-fade mb-6 md:mb-8 pointer-events-auto hover:scale-105 transition-transform duration-300">
              <div className="inline-flex items-center gap-2 px-4 py-1.5 bg-black/40 backdrop-blur-md border border-amber-500/30 rounded-full shadow-[0_0_20px_rgba(245,158,11,0.1)]">
                <Star className="w-3 h-3 text-red-500 fill-red-500 animate-[pulse_2s_infinite]" />
                <span className="text-amber-100/90 font-mono text-[10px] md:text-xs tracking-[0.25em] uppercase font-bold">
                  Director's Cut • 2026
                </span>
              </div>
            </div>

            {/* MAIN TITLE "SPARKZ" */}
            <h1 className="relative font-black tracking-tighter leading-[0.85] text-center drop-shadow-[0_10px_30px_rgba(0,0,0,0.9)] px-4">
              <div className="flex justify-center overflow-hidden py-4 perspective-500">
                {"SPARKZ".split("").map((char, i) => (
                  <span 
                    key={i} 
                    className="hero-char inline-block text-[20vw] md:text-[16vw] lg:text-[13rem] bg-gradient-to-b from-[#FFF5D1] via-[#FFD700] to-[#B45309] bg-clip-text text-transparent transform transition-all duration-300 pointer-events-auto hover:-translate-y-4 hover:brightness-125"
                    style={{ 
                      WebkitTextStroke: "1px rgba(255, 215, 0, 0.1)",
                      filter: "drop-shadow(0 0 15px rgba(234, 179, 8, 0.3))"
                    }}
                  >
                    {char}
                  </span>
                ))}
              </div>
            </h1>

            {/* Subtitle Information */}
            <div className="hero-fade mt-6 md:mt-10 flex flex-col items-center gap-5 text-center z-40">
              <div className="flex items-center gap-4 opacity-80">
                <div className="h-[1px] w-12 bg-gradient-to-r from-transparent to-amber-500"></div>
                <p className="text-amber-500 font-mono text-xs md:text-sm tracking-[0.4em] uppercase font-semibold glow-sm">
                  The Cultural Phenomenon
                </p>
                <div className="h-[1px] w-12 bg-gradient-to-l from-transparent to-amber-500"></div>
              </div>

              <div className="flex items-center gap-3 text-white/70 text-[10px] md:text-xs font-medium tracking-widest bg-black/60 px-6 py-2 rounded-full backdrop-blur-sm border border-white/5 shadow-xl hover:bg-black/80 transition-colors pointer-events-auto">
                <span className="text-gray-400">PRESENTS</span>
                <img src="/kare.png" alt="Logo" className="h-6 w-auto" />
                <span className="text-gray-200">KALASALINGAM UNIVERSITY</span>
              </div>
            </div>

            {/* CTA Buttons */}
            <div className="hero-fade mt-10 md:mt-14 pointer-events-auto z-50">
              <Link to="/events">
                <motion.button
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                  className="group relative px-10 py-4 bg-transparent overflow-hidden rounded-full shadow-[0_0_40px_rgba(234,88,12,0.3)]"
                >
                  <div className="absolute inset-0 bg-gradient-to-r from-amber-600 via-orange-600 to-red-700"></div>
                  <div className="absolute inset-0 bg-[url('https://www.transparenttextures.com/patterns/carbon-fibre.png')] opacity-30 mix-blend-overlay"></div>
                  
                  {/* Shimmer Effect */}
                  <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/20 to-transparent -translate-x-full group-hover:translate-x-full transition-transform duration-1000 ease-in-out"></div>
                  
                  <div className="relative flex items-center gap-3 text-white font-bold uppercase tracking-widest text-sm">
                    <Ticket className="w-5 h-5" />
                    <span>Explore Events</span>
                  </div>
                </motion.button>
              </Link>
            </div>
            
          </div>
        </div>

        {/* --- 2. CHARACTERS --- */}

        {/* MOBILE: Bottom Aligned with Fade */}
        {isMobile && (
          <div className="relative w-full h-[50vh] mt-auto overflow-hidden pointer-events-none">
             {/* Smooth fade from black to transparent at top */}
             <div className="absolute top-0 inset-x-0 h-32 bg-gradient-to-b from-[#020101] to-transparent z-20"></div>
             
             <AnimatePresence mode="wait">
               <motion.div
                 key={mobileCharIndex}
                 initial={{ opacity: 0, scale: 1.05, y: 10 }}
                 animate={{ opacity: 1, scale: 1, y: 0 }}
                 exit={{ opacity: 0 }}
                 transition={{ duration: 1 }}
                 className="absolute bottom-0 inset-x-0 flex justify-center items-end h-full"
               >
                 <img 
                   src={mobileCharIndex === 0 ? "/images/harry-potter.png" : "/images/Professor.png"}
                   alt="Character"
                   className="h-[105%] w-auto object-contain object-bottom drop-shadow-[0_-10px_30px_rgba(0,0,0,0.5)]"
                 />
               </motion.div>
             </AnimatePresence>

             {/* Bottom Vignette for seamless blend */}
             <div className="absolute bottom-0 inset-x-0 h-24 bg-gradient-to-t from-[#020101] to-transparent z-20"></div>
          </div>
        )}

        {/* DESKTOP: Side Aligned with Parallax */}
        {!isMobile && (
          <>
            <div ref={harryRef} className="absolute bottom-[-5%] left-[0%] w-[32vw] h-[110vh] z-20 pointer-events-none filter drop-shadow-[0_0_40px_rgba(0,0,0,0.5)]">
              <img src="/images/harry-potter.png" alt="Harry" className="w-full h-full object-contain object-bottom" />
            </div>
            <div ref={professorRef} className="absolute bottom-[-5%] right-[-2%] w-[35vw] h-[95vh] z-20 pointer-events-none filter drop-shadow-[0_0_40px_rgba(0,0,0,0.5)]">
              <img src="/images/Professor.png" alt="Professor" className="w-full h-full object-contain object-bottom" />
            </div>
          </>
        )}

      </div>

      {/* --- SCROLL HINT --- */}
      <motion.div 
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 3 }}
        className="absolute bottom-8 left-1/2 -translate-x-1/2 z-40 flex flex-col items-center gap-2 pointer-events-none"
      >
        <span className="text-[10px] text-amber-500/50 tracking-[0.3em] uppercase animate-pulse">Scroll to Begin</span>
        <ChevronDown className="w-5 h-5 text-amber-500/50 animate-bounce" />
      </motion.div>

      <style jsx>{`
        .glow-sm {
          text-shadow: 0 0 10px rgba(245, 158, 11, 0.3);
        }
        .perspective-1000 {
          perspective: 1000px;
        }
        .perspective-500 {
          perspective: 500px;
        }
      `}</style>
    </section>
  );
};

export default Hero;