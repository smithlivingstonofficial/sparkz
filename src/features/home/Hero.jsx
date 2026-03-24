import React, { useLayoutEffect, useRef, useState, useEffect } from "react";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { motion, useSpring, useMotionValue } from "framer-motion";
import { Ticket, Sparkles } from "lucide-react";
import { Link } from "react-router-dom";

gsap.registerPlugin(ScrollTrigger);

const Hero = () => {
  const containerRef = useRef(null);
  const titleRef = useRef(null);
  const harryRef = useRef(null);
  const professorRef = useRef(null);
  
  const [isMobile, setIsMobile] = useState(false);
  const [introFinished, setIntroFinished] = useState(false);
  
  // --- 1. MOUSE / SPOTLIGHT LOGIC ---
  const mouseX = useMotionValue(0);
  const mouseY = useMotionValue(0);
  // Smoother spring physics for the spotlight
  const springX = useSpring(mouseX, { stiffness: 40, damping: 25 });
  const springY = useSpring(mouseY, { stiffness: 40, damping: 25 });

  // --- 2. RESPONSIVE CHECKS ---
  useEffect(() => {
    const handleResize = () => {
      const mobile = window.innerWidth < 1024; // Treat tablets as mobile-like for layout safety
      setIsMobile(mobile);
      if (!mobile) {
        mouseX.set(window.innerWidth / 2);
        mouseY.set(window.innerHeight / 2);
      }
    };
    
    handleResize();
    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, [mouseX, mouseY]);

  const handleMouseMove = (e) => {
    if (isMobile) return; 
    
    const { clientX, clientY } = e;
    mouseX.set(clientX);
    mouseY.set(clientY);

    if (introFinished) {
      // Parallax Logic
      const xFactor = (clientX / window.innerWidth - 0.5) * 2;
      const yFactor = (clientY / window.innerHeight - 0.5) * 2;

      // Subtle Text 3D Tilt
      gsap.to(titleRef.current, {
        rotateX: -yFactor * 5,
        rotateY: xFactor * 5,
        duration: 1,
        ease: "power2.out"
      });

      // Character Parallax (Move opposite to mouse for depth)
      gsap.to(harryRef.current, { x: -xFactor * 30, duration: 1.5 });
      gsap.to(professorRef.current, { x: -xFactor * 40, duration: 1.5 });
    }
  };

  // --- 3. CINEMATIC ENTRANCE ANIMATION ---
  useLayoutEffect(() => {
    const ctx = gsap.context(() => {
      const tl = gsap.timeline({
        onComplete: () => setIntroFinished(true)
      });

      // Initial States
      tl.set(".hero-element", { opacity: 0 })
        .set(".char-img", { scale: 1.1, opacity: 0, filter: "blur(10px)" })
        .set(".title-char", { y: 100, opacity: 0, rotateX: 90 });

      // 1. Loading Line
      tl.to(".loader-line", { width: "100%", duration: 1.2, ease: "power4.inOut" })
        .to(".loader-wrapper", { opacity: 0, duration: 0.5, pointerEvents: "none" });

      // 2. Title Explosion (Zoom Out)
      tl.fromTo(".title-wrapper", 
        { scale: 2.5, opacity: 0, filter: "blur(20px)" },
        { scale: 1, opacity: 1, filter: "blur(0px)", duration: 1.4, ease: "expo.out" },
        "-=0.2"
      );

      // 3. Characters Fade In (Staggered)
      tl.to(".char-img", {
        scale: 1,
        opacity: isMobile ? 0.7 : 1, // Lower opacity on mobile
        filter: "blur(0px)",
        duration: 1.5,
        stagger: 0.2,
        ease: "power2.out"
      }, "-=1.0");

      // 4. UI Elements (Badge, Button) Slide Up
      tl.to(".hero-ui", {
        y: 0,
        opacity: 1,
        duration: 0.8,
        stagger: 0.1,
        ease: "back.out(1.7)"
      }, "-=1.0");

    }, containerRef);

    return () => ctx.revert();
  }, [isMobile]);

  return (
    <section 
      ref={containerRef}
      onMouseMove={handleMouseMove}
      className="relative h-[100dvh] w-full overflow-hidden bg-[#050505] flex flex-col perspective-1000"
    >
      
      {/* ==================== 1. ATMOSPHERE ==================== */}
      
      {/* Dynamic Spotlight */}
      {isMobile ? (
        // Mobile: Auto-pulsing light in center
        <div className="absolute top-[30%] left-1/2 -translate-x-1/2 w-[80vw] h-[80vw] bg-amber-500/15 rounded-full blur-[60px] animate-pulse z-0 mix-blend-screen pointer-events-none"></div>
      ) : (
        // Desktop: Mouse-following spotlight
        <motion.div 
          style={{ x: springX, y: springY }}
          className="absolute top-0 left-0 w-[60vw] h-[60vw] max-w-[800px] max-h-[800px] bg-gradient-to-r from-amber-500/10 to-purple-500/5 rounded-full blur-[100px] mix-blend-screen pointer-events-none -translate-x-1/2 -translate-y-1/2 z-0"
        />
      )}

      {/* Fog Animation */}
      <div className="absolute inset-0 z-0 opacity-40 pointer-events-none">
        <div className="absolute inset-0 bg-[url('https://raw.githubusercontent.com/firewatch-ltd/assets/master/fog.png')] bg-cover animate-fog-flow"></div>
      </div>
      
      {/* Floating Embers */}
      <div className="absolute inset-0 z-1 pointer-events-none overflow-hidden">
        {[...Array(15)].map((_, i) => (
          <motion.div
            key={i}
            className="absolute w-1 h-1 bg-amber-400/80 rounded-full box-shadow-ember"
            initial={{ x: Math.random() * 100 + "vw", y: Math.random() * 100 + "vh", opacity: 0 }}
            animate={{ 
              y: [null, Math.random() * -100 - 50],
              opacity: [0, 1, 0],
            }}
            transition={{ duration: Math.random() * 5 + 5, repeat: Infinity, delay: Math.random() * 5 }}
          />
        ))}
      </div>

      {/* Film Noise Grain */}
      <div className="absolute inset-0 opacity-[0.06] z-[5] pointer-events-none mix-blend-overlay" style={{ backgroundImage: `url("data:image/svg+xml,%3Csvg viewBox='0 0 200 200' xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='noiseFilter'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.65' numOctaves='3' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23noiseFilter)' opacity='1'/%3E%3C/svg%3E")` }}></div>


      {/* ==================== 2. LOADER ==================== */}
      <div className="loader-wrapper absolute inset-0 z-[100] flex items-center justify-center bg-black">
        <div className="relative w-48 md:w-64 h-[2px] bg-gray-900 rounded-full overflow-hidden">
          <div className="loader-line absolute top-0 left-0 h-full w-0 bg-amber-500 shadow-[0_0_20px_rgba(245,158,11,0.8)]"></div>
        </div>
      </div>


      {/* ==================== 3. MAIN CONTENT LAYER ==================== */}
      
      {/* 
         LAYOUT LOGIC:
         Mobile: justify-start + pt-28 -> Pushes text to top 1/3 of screen.
         Desktop: justify-center -> Centers text vertically.
      */}
      <div className="relative w-full h-full max-w-[1920px] mx-auto z-20 flex flex-col items-center justify-start pt-28 lg:pt-0 lg:justify-center">

        {/* --- TITLE & TEXT GROUP --- */}
        <div ref={titleRef} className="title-wrapper relative z-50 flex flex-col items-center w-full px-4 transform-style-3d">
            
            {/* Badge */}
            <div className="hero-ui opacity-0 translate-y-4 mb-4 lg:mb-6 pointer-events-auto">
              <div className="flex items-center gap-2 px-3 py-1.5 border border-amber-500/20 bg-black/40 backdrop-blur-md rounded-full shadow-[0_0_15px_rgba(245,158,11,0.15)]">
                <Sparkles className="w-3 h-3 text-amber-400 animate-pulse" />
                <span className="text-amber-100/90 text-[10px] md:text-xs tracking-[0.2em] font-bold font-mono uppercase">
                  Director's Cut • 2026
                </span>
              </div>
            </div>

            {/* MAIN TITLE */}
            <h1 className="relative font-black tracking-tighter leading-none text-center select-none w-full perspective-500">
                {/* Glow Layer */}
                <span className="absolute inset-0 text-[18vw] lg:text-[14rem] text-amber-600/30 blur-[25px] animate-pulse">SPARKZ</span>
                
                {/* Actual Text */}
                <div className="flex justify-center flex-nowrap py-2 lg:py-4">
                  {"SPARKZ".split("").map((char, i) => (
                    <motion.span 
                      key={i}
                      whileHover={{ scale: 1.1, y: -10, color: "#FFFFFF" }}
                      className="hero-char inline-block text-[18vw] lg:text-[13rem] cursor-default pointer-events-auto transition-all duration-300"
                      style={{
                        background: "linear-gradient(180deg, #ffffff 0%, #fbbf24 45%, #b45309 100%)",
                        WebkitBackgroundClip: "text",
                        WebkitTextFillColor: "transparent",
                        filter: "drop-shadow(0 4px 8px rgba(0,0,0,0.8))" // Shadow for readability
                      }}
                    >
                      {char}
                    </motion.span>
                  ))}
                </div>
            </h1>

            {/* Subtitle & Button */}
            <div className="hero-ui opacity-0 translate-y-4 mt-4 lg:mt-8 flex flex-col items-center gap-6 z-50 pointer-events-auto">
              <p className="max-w-[85%] md:max-w-xl text-center text-amber-100/70 text-sm md:text-base font-medium tracking-wide leading-relaxed drop-shadow-md">
                <span className="block md:inline">The Cultural Phenomenon Returns. </span>
                <span className="block md:inline text-amber-500/90">Magic meets Technology.</span>
              </p>

              <Link to="/events" className="group relative z-50">
                <motion.button
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                  className="relative px-8 py-3.5 bg-transparent overflow-hidden border border-amber-600/40 rounded-sm"
                >
                  <div className="absolute inset-0 bg-black/80"></div>
                  {/* Hover Fill */}
                  <div className="absolute inset-0 bg-amber-600/20 translate-y-[100%] group-hover:translate-y-0 transition-transform duration-300 ease-in-out"></div>
                  {/* Bottom Glow Line */}
                  <div className="absolute bottom-0 left-0 w-full h-[2px] bg-gradient-to-r from-transparent via-amber-500 to-transparent shadow-[0_0_15px_#f59e0b]"></div>
                  
                  <div className="relative flex items-center gap-3 text-white font-bold uppercase tracking-[0.2em] text-xs md:text-sm">
                    <Ticket className="w-4 h-4 text-amber-400 group-hover:rotate-12 transition-transform" />
                    <span>Register now </span>
                  </div>
                </motion.button>
              </Link>
            </div>
            
        </div>

        {/* --- CHARACTERS (Optimized for Mobile Framing) --- */}
        
        {/* HARRY */}
        <div 
          ref={harryRef} 
          className="char-img absolute 
            bottom-[-15%] left-[-20%] w-[75vw] opacity-60
            lg:bottom-[-2%] lg:left-[0%] lg:w-[32vw] lg:opacity-100
            z-30 pointer-events-none transition-all duration-700 ease-out"
        >
          <img 
            src="/images/harry-potter.png" 
            alt="Harry" 
            className="w-full h-auto object-contain drop-shadow-[0_0_30px_rgba(234,179,8,0.15)] mask-gradient-bottom"
          />
        </div>

        {/* PROFESSOR */}
        <div 
          ref={professorRef} 
          className="char-img absolute 
            bottom-[-10%] right-[-25%] w-[80vw] opacity-60
            lg:bottom-[-25] lg:right-[-2%] lg:w-[35vw] lg:opacity-100
            z-30 pointer-events-none transition-all duration-700 ease-out"
        >
          <img 
            src="/images/Professor.png" 
            alt="Professor" 
            className="w-full h-auto object-contain drop-shadow-[0_0_30px_rgba(168,85,247,0.15)] mask-gradient-bottom"
          />
        </div>

      </div>

      {/* --- SCROLL HINT --- */}
      <motion.div 
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 3, duration: 1 }}
        className="hero-ui absolute bottom-4 left-1/2 -translate-x-1/2 z-40 flex flex-col items-center gap-2 pointer-events-none"
      >
        <span className="text-[10px] text-amber-500/50 tracking-[0.3em] uppercase animate-pulse">Explore</span>
        <div className="w-[1px] h-8 lg:h-12 bg-gradient-to-b from-amber-500/0 via-amber-500/50 to-amber-500/0"></div>
      </motion.div>

      {/* --- CSS UTILS --- */}
      <style jsx>{`
        .perspective-1000 { perspective: 1000px; }
        .perspective-500 { perspective: 500px; }
        .transform-style-3d { transform-style: preserve-3d; }
        
        .box-shadow-ember {
          box-shadow: 0 0 8px 1px rgba(251, 191, 36, 0.6);
        }

        /* Smooth fade at bottom of characters so they blend into black */
        .mask-gradient-bottom {
          mask-image: linear-gradient(to bottom, black 70%, transparent 100%);
          -webkit-mask-image: linear-gradient(to bottom, black 70%, transparent 100%);
        }

        @keyframes fog-flow {
          0% { background-position: 0 0; }
          100% { background-position: 100% 0; }
        }
        .animate-fog-flow {
          animation: fog-flow 80s linear infinite;
        }
      `}</style>
    </section>
  );
};

export default Hero;