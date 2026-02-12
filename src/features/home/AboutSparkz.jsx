import React, { useLayoutEffect, useRef, useState, useEffect, useContext } from 'react';
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import { motion, useScroll, useSpring } from 'framer-motion';
import { Link } from 'react-router-dom';
import { 
  Play, Calendar, MapPin, Ticket, 
  ArrowRight, Star, Film, Music, Mic, 
  Zap, Trophy, MonitorPlay, Users, Coins, Layers
} from 'lucide-react';
import { MusicContext } from '../../components/layout/AppLayout.jsx';

gsap.registerPlugin(ScrollTrigger);

const AboutSparkz = () => {
  const containerRef = useRef(null);
  const videoSectionRef = useRef(null);
  const heroRef = useRef(null);
  const statsRef = useRef(null);
  
  // State for YouTube Video
  const [isVideoPlaying, setIsVideoPlaying] = useState(false);
  const [mousePos, setMousePos] = useState({ x: 0, y: 0 });

  // Access MusicContext
  const { handleExternalPlay } = useContext(MusicContext);

  // REPLACE THIS WITH YOUR YOUTUBE VIDEO ID
  const YOUTUBE_VIDEO_ID = "GCgcYojrDAQ"; 

  // Handle Background Music Pause/Resume
  useEffect(() => {
    if (handleExternalPlay) {
      handleExternalPlay(isVideoPlaying);
    }
    return () => {
      if (handleExternalPlay) handleExternalPlay(false);
    };
  }, [isVideoPlaying, handleExternalPlay]);

  // Mouse Parallax Effect
  useEffect(() => {
    const handleMouseMove = (e) => {
      setMousePos({
        x: (e.clientX / window.innerWidth - 0.5) * 20,
        y: (e.clientY / window.innerHeight - 0.5) * 20
      });
    };
    window.addEventListener('mousemove', handleMouseMove);
    return () => window.removeEventListener('mousemove', handleMouseMove);
  }, []);

  useLayoutEffect(() => {
    const ctx = gsap.context(() => {
      
      // 1. Hero Animations Setup
      const tl = gsap.timeline();

      // University Logo Reveal
      tl.from(".uni-badge", {
        y: -30,
        opacity: 0,
        duration: 0.8,
        ease: "power3.out"
      });

      // Massive Sparkz Logo Reveal
      tl.from(".hero-logo-img", {
        scale: 0.8,
        opacity: 0,
        filter: "blur(10px)",
        duration: 1.2,
        ease: "elastic.out(1, 0.7)"
      }, "-=0.4");

      // Stats Counters Animation
      const stats = gsap.utils.toArray(".stat-number");
      stats.forEach((stat) => {
        const targetValue = stat.getAttribute("data-target");
        tl.to(stat, {
          innerText: targetValue,
          duration: 2,
          snap: { innerText: 1 },
          ease: "power2.out",
        }, "-=1");
      });

      // 2. Text Highlight Animation
      const splitText = gsap.utils.toArray(".highlight-text");
      splitText.forEach((text) => {
        gsap.to(text, {
          backgroundSize: "100% 100%",
          color: "#000000",
          scrollTrigger: {
            trigger: text,
            start: "top 85%",
            end: "bottom 65%",
            scrub: true,
          }
        });
      });

      // 3. Video Expand
      const videoTl = gsap.timeline({
        scrollTrigger: {
          trigger: videoSectionRef.current,
          start: "top 80%",
          end: "center center",
          scrub: 1,
        }
      });
      
      videoTl.to(".video-container", {
        width: "100%",
        borderRadius: "0px",
        scale: 1,
        ease: "power2.inOut"
      });

      // 4. Horizontal Film Strip
      const strip = document.querySelector(".film-strip-inner");
      if (strip) {
        gsap.to(strip, {
          x: () => -(strip.scrollWidth - window.innerWidth),
          ease: "none",
          scrollTrigger: {
            trigger: ".film-strip-wrapper",
            start: "top top",
            end: () => `+=${strip.scrollWidth}`,
            scrub: 1,
            pin: true,
            anticipatePin: 1
          }
        });
      }

    }, containerRef);

    return () => ctx.revert();
  }, []);

  const { scrollYProgress } = useScroll();
  const scaleX = useSpring(scrollYProgress, { stiffness: 100, damping: 30 });

  return (
    <div ref={containerRef} className="relative w-full bg-black text-white overflow-x-hidden font-sans selection:bg-amber-500 selection:text-black">
      
      {/* --- GLOBAL FX --- */}
      <div className="fixed inset-0 opacity-[0.06] pointer-events-none z-50 mix-blend-overlay" 
           style={{ backgroundImage: `url("data:image/svg+xml,%3Csvg viewBox='0 0 200 200' xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='noiseFilter'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.8' numOctaves='3' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23noiseFilter)' opacity='1'/%3E%3C/svg%3E")` }}>
      </div>
      <motion.div className="fixed top-0 left-0 right-0 h-1 md:h-2 bg-gradient-to-r from-amber-600 via-yellow-500 to-amber-600 origin-left z-[100]" style={{ scaleX }} />

      {/* --- SECTION 1: HERO RE-DESIGNED --- */}
      <section ref={heroRef} className="relative min-h-screen pt-20 flex flex-col items-center justify-center px-4 overflow-hidden">
        
        {/* Ambient Spotlights */}
        <div className="absolute top-0 left-1/2 -translate-x-1/2 w-[80vw] h-[50vh] bg-amber-600/10 blur-[120px] pointer-events-none"></div>
        <div className="absolute bottom-0 right-0 w-[40vw] h-[40vw] bg-red-900/10 blur-[100px] pointer-events-none"></div>

        <div className="relative z-10 flex flex-col items-center w-full max-w-7xl">
          
          {/* 1. KARE LOGO (Professional & Minimal) */}
          <div className="uni-badge mb-8 flex flex-col items-center gap-2">
            <span className="text-[10px] md:text-xs font-bold tracking-[0.4em] text-amber-500/80 uppercase">
              Presents
            </span>
            <div className="bg-white/5 backdrop-blur-md border border-white/10 px-6 py-3 rounded-full hover:border-amber-500/30 transition-colors duration-300">
              <img 
                src="https://www.kalasalingam.ac.in/wp-content/uploads/2022/02/Logo.png"
                alt="Kalasalingam University"
                className="h-10 md:h-14 w-auto object-contain brightness-110 drop-shadow-lg"
              />
            </div>
          </div>

          {/* 2. SPARKZ LOGO (Massive & Central) */}
          <div 
            className="hero-logo relative w-full flex justify-center mb-12 md:mb-16"
            style={{ transform: `translate(${mousePos.x * 0.5}px, ${mousePos.y * 0.5}px)` }}
          >
            {/* Glow Behind */}
            <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[60%] aspect-square bg-amber-500/20 rounded-full blur-[80px] animate-pulse"></div>
            
            {/* Main Image */}
            <img 
              src="/sparkz.png" 
              alt="Sparkz Logo" 
              className="hero-logo-img relative z-10 w-[85vw] max-w-[600px] md:max-w-[750px] object-contain drop-shadow-[0_0_50px_rgba(245,158,11,0.4)]"
            />
          </div>

          {/* 3. STATS GRID (Integrated into Hero) */}
          <div ref={statsRef} className="w-full max-w-5xl mx-auto">
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4 md:gap-8 px-2">
              
              {[
                { label: "Colleges", value: "50", suffix: "+", icon: <MapPin size={18} /> },
                { label: "Participants", value: "8000", suffix: "+", icon: <Users size={18} /> },
                { label: "Events", value: "52", suffix: "+", icon: <Layers size={18} /> },
                { label: "Prize Pool", value: "2", suffix: "Lakhs+", icon: <Coins size={18} /> },
              ].map((item, idx) => (
                <div key={idx} className="flex flex-col items-center justify-center p-4 bg-white/5 backdrop-blur-sm border border-white/5 rounded-2xl hover:bg-white/10 hover:border-amber-500/30 transition-all duration-300 group">
                  <div className="mb-2 p-2 bg-amber-500/10 rounded-full text-amber-500 group-hover:scale-110 transition-transform">
                    {item.icon}
                  </div>
                  <div className="text-3xl md:text-4xl font-black text-white font-sans flex items-baseline">
                    <span className="stat-number" data-target={item.value}>0</span>
                    <span className="text-amber-500 text-xl md:text-2xl ml-1">{item.suffix}</span>
                  </div>
                  <div className="text-xs md:text-sm font-medium text-gray-400 uppercase tracking-widest mt-1">
                    {item.label}
                  </div>
                </div>
              ))}

            </div>
          </div>

          {/* 4. Date Tag (Floating Bottom) */}
          <div className="mt-12 flex items-center gap-4 text-sm font-medium text-gray-400">
            <div className="h-px w-12 bg-gradient-to-r from-transparent to-gray-600"></div>
            <span className="uppercase tracking-[0.2em]">Feb 27 & 28 • 2026</span>
            <div className="h-px w-12 bg-gradient-to-l from-transparent to-gray-600"></div>
          </div>

        </div>
      </section>

      {/* --- SECTION 2: THE MANIFESTO --- */}
      <section className="relative py-20 md:py-32 px-4 md:px-8 bg-black">
        <div className="max-w-6xl mx-auto">
          <h2 className="text-amber-500 font-bold tracking-[0.3em] mb-10 text-sm md:text-xl uppercase flex items-center gap-3">
            <span className="w-8 h-[2px] bg-amber-500"></span>
            The Cinematic Experience
          </h2>
          
          <div className="text-3xl md:text-6xl lg:text-7xl font-black leading-[1.2] uppercase text-white space-y-2 md:space-y-4">
            <p>
              Welcome to the
            </p>
            <p>
              <span className="highlight-text inline-block px-1 md:px-3 bg-gradient-to-r from-amber-500 to-amber-500 bg-[length:0%_100%] bg-no-repeat transition-all">Blockbuster</span> of the year.
            </p>
            <p className="text-gray-500">
              Where 48 hours feels like
            </p>
            <p>
              <span className="highlight-text inline-block px-1 md:px-3 bg-gradient-to-r from-white to-white bg-[length:0%_100%] bg-no-repeat transition-all">A Lifetime.</span>
            </p>
          </div>
        </div>
      </section>

      {/* --- SECTION 3: YOUTUBE VIDEO SECTION --- */}
      <section ref={videoSectionRef} className="relative py-10 md:py-20 flex flex-col items-center">
        <div className="mb-8 md:mb-12 flex items-center gap-2 uppercase tracking-widest text-sm font-bold text-gray-400">
          <MonitorPlay size={16} className="text-red-500" />
          <span>Official Teaser</span>
        </div>

        <div className="video-container relative w-[90%] md:w-[70%] aspect-video bg-gray-900 rounded-3xl overflow-hidden shadow-[0_0_50px_rgba(0,0,0,0.5)] border border-white/10 group">
          {!isVideoPlaying ? (
            <div className="relative w-full h-full cursor-pointer" onClick={() => setIsVideoPlaying(true)}>
              <div className="absolute inset-0 bg-cover bg-center transition-transform duration-700 group-hover:scale-105"
                   style={{ backgroundImage: "url('https://images.unsplash.com/photo-1478720568477-152d9b164e63?auto=format&fit=crop&q=80')" }}>
              </div>
              <div className="absolute inset-0 bg-black/40 group-hover:bg-black/20 transition-colors duration-500"></div>
              <div className="absolute inset-0 flex flex-col items-center justify-center z-20">
                 <div className="w-20 h-20 md:w-24 md:h-24 bg-white/10 backdrop-blur-md rounded-full flex items-center justify-center border border-white/30 text-white group-hover:bg-amber-500 group-hover:border-amber-500 group-hover:scale-110 transition-all duration-300 shadow-[0_0_30px_rgba(0,0,0,0.5)]">
                    <Play className="fill-current ml-2 w-8 h-8 md:w-10 md:h-10" />
                 </div>
                 <h3 className="mt-6 text-xl md:text-3xl font-black uppercase text-white tracking-widest drop-shadow-lg">
                   Watch Trailer
                 </h3>
              </div>
            </div>
          ) : (
            <div className="w-full h-full bg-black">
              <iframe 
                src={`https://www.youtube.com/embed/${YOUTUBE_VIDEO_ID}?autoplay=1&rel=0&modestbranding=1&showinfo=0`}
                title="Sparkz Official Teaser"
                className="w-full h-full"
                allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture" 
                allowFullScreen
              ></iframe>
            </div>
          )}
        </div>
      </section>

      {/* --- MARQUEE --- */}
      <div className="py-8 md:py-16 bg-amber-500 text-black overflow-hidden whitespace-nowrap border-y-4 border-white">
        <div className="inline-flex animate-marquee">
          {[...Array(6)].map((_, i) => (
             <span key={i} className="text-4xl md:text-7xl font-black uppercase tracking-tighter mx-4 md:mx-8 italic">
               Sparkz 2K26 • Cinematic Universe •
             </span>
          ))}
        </div>
      </div>

      {/* --- SECTION 4: TIMELINE --- */}
      <section className="film-strip-wrapper relative h-[100vh] bg-[#050505] overflow-hidden flex flex-col justify-center">
        
        <div className="absolute top-4 left-4 md:top-10 md:left-10 z-10 px-4">
          <div className="text-amber-500 font-bold tracking-widest text-xs md:text-sm mb-2">PRODUCTION SCHEDULE</div>
          <h3 className="text-4xl md:text-8xl font-black text-white/20 select-none">TIMELINE</h3>
        </div>

        {/* Film Holes */}
        <div className="absolute top-[18%] left-0 w-full h-4 md:h-8 bg-[url('data:image/svg+xml;base64,PHN2ZyB4bWxucz0iaHR0cDovL3d3dy53My5vcmcvMjAwMC9zdmciIHdpZHRoPSI2MCIgaGVpZ2h0PSIzMCI+PHJlY3Qgd2lkdGg9IjMwIiBoZWlnaHQ9IjIwIiB4PSIxNSIgeT0iNSIgZmlsbD0iIzIyMiIvPjwvc3ZnPg==')] z-20"></div>

        <div className="film-strip-inner flex items-center gap-0 pl-[5vw] w-max">
           {[
             { time: "DAY 1", title: "HAND HOLDING NATURE", subtitle: "Together for a Greener Tomorrow", icon: <Star />, color: "bg-amber-500", img: "https://images.unsplash.com/photo-1492684223066-81342ee5ff30?auto=format&fit=crop&q=80" },
             { time: "DAY 1", title: "FIRELESS COOKING ", subtitle: "Creativity Without Flames", icon: <Zap />, color: "bg-red-600", img: "https://images.unsplash.com/photo-1547153760-18fc86324498?auto=format&fit=crop&q=80" },
             { time: "DAY 1", title: "DEBATE", subtitle: "Clash of Perspectives", icon: <Music />, color: "bg-purple-600", img: "https://images.unsplash.com/photo-1470225620780-dba8ba36b745?auto=format&fit=crop&q=80" },
             { time: "DAY 1", title: "GROUP DANCE", subtitle: "Rhythm in Unity", icon: <Mic />, color: "bg-blue-600", img: "https://images.unsplash.com/photo-1516450360452-9312f5e86fc7?auto=format&fit=crop&q=80" },
             { time: "DAY 2", title: "SHORT DRAMA / SKIT", subtitle: "Stage Stories Live", icon: <Film />, color: "bg-green-600", img: "https://images.unsplash.com/photo-1485846234645-a62644f84728?auto=format&fit=crop&q=80" },
             { time: "DAY 2", title: "Battle of Bands", subtitle: "Rock the Stage", icon: <Trophy />, color: "bg-yellow-500", img: "https://images.unsplash.com/photo-1565793298595-6a879b1d9492?auto=format&fit=crop&q=80" },
           ].map((item, idx) => (
             <div key={idx} className="relative w-[85vw] md:w-[35vw] h-[55vh] flex-shrink-0 border-r border-white/10 bg-gray-900 group overflow-hidden">
               <div className="absolute inset-0 bg-cover bg-center opacity-20 group-hover:opacity-50 transition-all duration-500 scale-110 group-hover:scale-100 grayscale group-hover:grayscale-0"
                    style={{ backgroundImage: `url(${item.img})` }}></div>
               
               <div className="relative z-10 flex flex-col justify-between h-full p-6 md:p-10">
                 <div className="flex justify-between items-start">
                   <span className="text-sm md:text-base font-mono text-white bg-black/50 px-2 py-1 rounded backdrop-blur-sm border-l-2 border-amber-500">
                     {item.time}
                   </span>
                   <div className={`p-3 md:p-4 rounded-full ${item.color} text-white shadow-lg transform group-hover:rotate-12 transition-transform duration-500`}>
                     {React.cloneElement(item.icon, { size: 24 })}
                   </div>
                 </div>
                 
                 <div>
                   <h4 className="text-sm md:text-lg text-amber-500 font-bold mb-1 uppercase tracking-wider">{item.subtitle}</h4>
                   <h3 className="text-4xl md:text-6xl font-black uppercase leading-[0.9] text-white mix-blend-difference">
                     {item.title}
                   </h3>
                 </div>
               </div>
             </div>
           ))}
           
           <div className="w-[85vw] md:w-[30vw] h-[55vh] flex-shrink-0 bg-amber-500 flex flex-col items-center justify-center p-8 text-black text-center relative overflow-hidden">
              <div className="absolute inset-0 bg-[url('data:image/svg+xml;base64,PHN2ZyB4bWxucz0iaHR0cDovL3d3dy53My5vcmcvMjAwMC9zdmciIHdpZHRoPSI0MCIgaGVpZ2h0PSI0MCIgb3BhY2l0eT0iMC4xIj48cGF0aCBkPSJNMCAwaDQwdjQwSDB6IiBmaWxsPSIjMDAwIi8+PC9zdmc+')]"></div>
              <h4 className="text-4xl md:text-5xl font-black mb-4 relative z-10">THE END?</h4>
              <p className="text-lg md:text-xl font-bold mb-6 relative z-10">NO, JUST THE BEGINNING.</p>
              <Link to="/auth" className="bg-black text-white px-8 py-3 font-bold rounded-full hover:scale-105 transition-transform relative z-10 flex items-center gap-2">
                Register Now <ArrowRight size={18} />
              </Link>
           </div>
        </div>

        <div className="absolute bottom-[18%] left-0 w-full h-4 md:h-8 bg-[url('data:image/svg+xml;base64,PHN2ZyB4bWxucz0iaHR0cDovL3d3dy53My5vcmcvMjAwMC9zdmciIHdpZHRoPSI2MCIgaGVpZ2h0PSIzMCI+PHJlY3Qgd2lkdGg9IjMwIiBoZWlnaHQ9IjIwIiB4PSIxNSIgeT0iNSIgZmlsbD0iIzIyMiIvPjwvc3ZnPg==')] z-20"></div>
      </section>

      {/* --- SECTION 5: FOOTER --- */}
      <section className="relative py-24 md:py-32 px-4 flex flex-col items-center justify-center text-center bg-black border-t border-white/10">
        <div className="max-w-5xl mx-auto relative group">
          <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[140%] h-[140%] bg-gradient-to-r from-amber-600/20 via-red-600/20 to-amber-600/20 blur-[80px] rounded-full opacity-50 group-hover:opacity-80 transition-opacity duration-700"></div>
          
          <h2 className="text-4xl md:text-8xl font-black uppercase text-white mb-8 relative z-10 leading-none">
            CLAIM YOUR <br/> 
            <span className="text-transparent stroke-white stroke-2" style={{ WebkitTextStroke: '1px white' }}>TICKET</span>
          </h2>
          
          <div className="relative z-20 mt-8 md:mt-12 flex flex-col items-center gap-6">
            <Link to="/auth" className="group relative bg-white text-black px-10 py-5 md:px-14 md:py-6 text-xl md:text-2xl font-black uppercase tracking-widest hover:bg-amber-500 transition-all duration-300 hover:scale-105 shadow-[0_0_50px_rgba(255,255,255,0.2)] flex items-center gap-4 overflow-hidden">
              <span className="relative z-10 flex items-center gap-3">
                <Ticket size={28} /> Register Now
              </span>
              <div className="absolute inset-0 bg-amber-500 transform scale-x-0 group-hover:scale-x-100 transition-transform duration-300 origin-left"></div>
            </Link>
          </div>
        </div>
      </section>

      <style jsx>{`
        .animate-marquee {
          animation: marquee 20s linear infinite;
        }
        @keyframes marquee {
          0% { transform: translateX(0); }
          100% { transform: translateX(-50%); }
        }
        .stroke-white { -webkit-text-stroke: 1px white; }
        .stroke-2 { -webkit-text-stroke-width: 1px; }
        @media (min-width: 768px) {
          .stroke-2 { -webkit-text-stroke-width: 2px; }
        }
      `}</style>

    </div>
  );
};

export default AboutSparkz;