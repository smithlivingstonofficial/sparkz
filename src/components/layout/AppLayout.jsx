import React, { useState, useEffect, useRef, createContext } from 'react';
import { Link } from 'react-router-dom';
import Sidebar from './Sidebar';
import {
  Menu,
  X,
  Film,
  Volume2,
  VolumeX,
  Sparkles,
  User,
  Spotlight,
  LogIn,
  Play
} from 'lucide-react';
import { clsx } from 'clsx';
import SmoothScrollWrapper from './SmoothScrollWrapper';
import { useAuth } from '../../context/AuthContext';
import ProfileModal from '../profile/ProfileModal';

export const MusicContext = createContext({
  isMuted: false,
  toggleMute: () => { },
  analyser: null,
  isAudioPlaying: false,
  startAudio: () => { },
  handleExternalPlay: () => { }
});

const AppLayout = ({ children }) => {
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);
  const [isMuted, setIsMuted] = useState(false);
  const [currentTime, setCurrentTime] = useState('00:00:00');
  const [isScrolled, setIsScrolled] = useState(false);
  const [analyser, setAnalyser] = useState(null);
  const [isAudioPlaying, setIsAudioPlaying] = useState(false);
  const [showAudioPrompt, setShowAudioPrompt] = useState(false);
  const [isProfileOpen, setIsProfileOpen] = useState(false);
  const [isExternalPaused, setIsExternalPaused] = useState(false);
  
  const { user } = useAuth();

  const audioRef = useRef(null);
  const audioContextRef = useRef(null);
  const sourceRef = useRef(null);

  useEffect(() => {
    const audio = new Audio('/audio/sparkz.mpeg');
    audio.loop = true;
    audio.volume = 0.4;
    audioRef.current = audio;

    const setupAudioContext = () => {
      try {
        const AudioContext = window.AudioContext || window.webkitAudioContext;
        const audioCtx = new AudioContext();
        audioContextRef.current = audioCtx;
        const source = audioCtx.createMediaElementSource(audio);
        sourceRef.current = source;
        const analyser = audioCtx.createAnalyser();
        analyser.fftSize = 2048;
        source.connect(analyser);
        analyser.connect(audioCtx.destination);
        setAnalyser(analyser);
        return audioCtx;
      } catch (error) {
        return null;
      }
    };

    setupAudioContext();

    const promptTimer = setTimeout(() => {
      if (!isAudioPlaying) setShowAudioPrompt(true);
    }, 3000);

    return () => {
      clearTimeout(promptTimer);
      if (audioContextRef.current) audioContextRef.current.close();
      if (audioRef.current) {
        audioRef.current.pause();
        audioRef.current = null;
      }
    };
  }, []);

  useEffect(() => {
    if (!audioRef.current) return;
    if (isExternalPaused) {
      audioRef.current.pause();
    } else if (isAudioPlaying) {
      audioRef.current.play().catch(() => {});
    }
  }, [isExternalPaused, isAudioPlaying]);

  const startAudio = async () => {
    if (!audioRef.current || isAudioPlaying) return;
    try {
      await audioRef.current.play();
      setIsAudioPlaying(true);
      setShowAudioPrompt(false);
      if (audioContextRef.current?.state === 'suspended') await audioContextRef.current.resume();
    } catch (error) {}
  };

  const handleExternalPlay = (isPlaying) => setIsExternalPaused(isPlaying);

  useEffect(() => {
    const handleFirstInteraction = () => { if (!isAudioPlaying) startAudio(); };
    document.addEventListener('click', handleFirstInteraction, { once: true });
    return () => document.removeEventListener('click', handleFirstInteraction);
  }, [isAudioPlaying]);

  useEffect(() => {
    if (audioRef.current) {
      audioRef.current.muted = isMuted;
      audioRef.current.volume = isMuted ? 0 : 0.4;
    }
  }, [isMuted]);

  useEffect(() => {
    const interval = setInterval(() => {
      setCurrentTime(new Date().toLocaleTimeString('en-US', { hour12: false, hour: '2-digit', minute: '2-digit', second: '2-digit' }));
    }, 1000);
    const handleScroll = () => setIsScrolled(window.scrollY > 20);
    window.addEventListener('scroll', handleScroll);
    return () => { clearInterval(interval); window.removeEventListener('scroll', handleScroll); };
  }, []);

  const toggleSidebar = () => setIsSidebarOpen(!isSidebarOpen);
  const toggleMute = () => setIsMuted(!isMuted);

  return (
    <MusicContext.Provider value={{ isMuted, toggleMute, analyser, isAudioPlaying, startAudio, handleExternalPlay }}>
      <div className="relative w-full min-h-screen bg-[#050505] overflow-x-hidden selection:bg-amber-500 selection:text-black">

        <audio ref={audioRef} loop preload="auto">
          <source src="/audio/sparkz.mpeg" type="audio/mpeg" />
        </audio>

        {/* Audio Play Prompt */}
        {showAudioPrompt && !isAudioPlaying && (
          <div className="fixed bottom-24 right-6 z-[70] animate-bounce">
            <button onClick={startAudio} className="flex items-center gap-2 px-4 py-3 bg-gradient-to-r from-amber-600 to-red-600 text-white font-bold rounded-full shadow-2xl">
              <Play size={18} fill="currentColor" />
              <span className="text-xs uppercase tracking-widest">Enable Sound</span>
            </button>
          </div>
        )}

        <div className={clsx("transition-all duration-700 ease-in-out", isSidebarOpen ? "md:mr-[350px]" : "md:mr-0")}>
          
          {/* NAVIGATION BAR */}
          <nav className={clsx(
            "fixed top-0 left-0 z-[60] w-full flex items-center justify-between transition-all duration-300 px-4 md:px-10",
            isSidebarOpen ? "md:w-[calc(100%-350px)]" : "w-full",
            isScrolled ? "h-16 bg-black/80 backdrop-blur-xl border-b border-white/5 shadow-lg" : "h-20 bg-transparent"
          )}>
            {/* Logo Section */}
            <Link to="/" className="flex items-center gap-3 group">
              <img 
                src="https://www.kalasalingam.ac.in/wp-content/uploads/2022/02/Logo.png" 
                alt="Logo" 
                className="h-10 md:h-12 w-auto object-contain transition-transform group-hover:scale-105" 
              />
              <div className="hidden sm:flex flex-col border-l border-white/10 pl-3">
                <span className="font-mono text-[12px] text-amber-500 font-bold tracking-widest">REC</span>
                <span className="font-mono text-[11px] text-white/40">{currentTime}</span>
              </div>
            </Link>

            {/* Desktop Nav Links */}
            <div className="hidden lg:flex items-center gap-8 bg-white/5 backdrop-blur-md px-8 py-2.5 rounded-full border border-white/10">
              {['Home', 'Events', 'Pro Show', 'Cart', 'Sponsors', 'Hospitality'].map((item) => (
                <Link key={item} to={item === 'Home' ? '/' : `/${item.toLowerCase().replace(' ', '')}`} className="text-[14px] font-black uppercase tracking-[0.2em] text-white/60 hover:text-amber-500 transition-colors">
                  {item}
                </Link>
              ))}
            </div>

            {/* Action Buttons */}
            <div className="flex items-center gap-4">
              {user ? (
                <button onClick={() => setIsProfileOpen(true)} className="hidden md:flex items-center gap-2 px-5 py-2 bg-white text-black text-[14px] font-black uppercase tracking-widest rounded-full hover:bg-amber-500 transition-all">
                  <User size={14} /> Profile
                </button>
              ) : (
                <Link to="/auth" className="hidden md:flex items-center gap-2 px-5 py-2 bg-gradient-to-r from-amber-600 to-red-600 text-white text-[14px] font-black uppercase tracking-widest rounded-full shadow-lg">
                  <User size={14} /> Login
                </Link>
              )}

              {/* Music Bars Toggle */}
              {isAudioPlaying && !isExternalPaused && (
                <button onClick={toggleMute} className="flex items-end gap-[3px] h-5 px-3 bg-white/5 rounded-full border border-white/10 hover:bg-white/10 transition-colors">
                  {[1, 2, 3].map((i) => (
                    <span 
                      key={i} 
                      className={clsx(
                        "w-[3px] bg-amber-500 rounded-full transition-all",
                        isMuted ? "h-1" : `animate-music-bar-${i}`
                      )} 
                    />
                  ))}
                </button>
              )}

              {/* Menu Toggle */}
              <button onClick={toggleSidebar} className="p-2.5 bg-white/5 rounded-lg border border-white/10 text-white/80 hover:text-white transition-colors">
                <Menu size={20} />
              </button>
            </div>
          </nav>

          {/* MAIN CONTENT WRAPPER */}
          <main className="relative z-10 pt-20 md:pt-28 pb-24 md:pb-10 min-h-screen">
            <SmoothScrollWrapper>{children}</SmoothScrollWrapper>
          </main>
        </div>

        <Sidebar isOpen={isSidebarOpen} onClose={toggleSidebar} />

        {/* MOBILE BOTTOM NAVIGATION */}
        <nav className="fixed bottom-0 left-0 right-0 z-[100] md:hidden bg-black/90 backdrop-blur-2xl border-t border-white/10 px-4 pb-safe">
          <div className="flex items-center justify-around h-16">
            <Link to="/" className="flex flex-col items-center gap-1 text-white/40 hover:text-white">
              <Sparkles size={18} />
              <span className="text-[9px] font-bold uppercase tracking-tighter">Home</span>
            </Link>
            <Link to="/events" className="flex flex-col items-center gap-1 text-white/40 hover:text-white">
              <Film size={18} />
              <span className="text-[9px] font-bold uppercase tracking-tighter">Events</span>
            </Link>
            
            {/* Center Profile Button */}
            <div className="relative -top-5">
               {user ? (
                <button onClick={() => setIsProfileOpen(true)} className="flex items-center justify-center w-14 h-14 bg-gradient-to-tr from-amber-600 to-red-600 rounded-full border-[4px] border-[#050505] shadow-[0_0_20px_rgba(245,158,11,0.4)] text-white">
                  <User size={24} />
                </button>
              ) : (
                <Link to="/auth" className="flex items-center justify-center w-14 h-14 bg-gradient-to-tr from-amber-600 to-red-600 rounded-full border-[4px] border-[#050505] shadow-[0_0_20px_rgba(245,158,11,0.4)] text-white">
                  <LogIn size={24} />
                </Link>
              )}
            </div>

            <Link to="/proshow" className="flex flex-col items-center gap-1 text-white/40 hover:text-white">
              <Spotlight size={18} />
              <span className="text-[9px] font-bold uppercase tracking-tighter">Pro</span>
            </Link>
            <button onClick={toggleSidebar} className="flex flex-col items-center gap-1 text-white/40 hover:text-white">
              <Menu size={18} />
              <span className="text-[9px] font-bold uppercase tracking-tighter">Menu</span>
            </button>
          </div>
        </nav>
      </div>

      <ProfileModal isOpen={isProfileOpen} onClose={() => setIsProfileOpen(false)} />
      
      <style jsx>{`
        @keyframes music-bar {
          0%, 100% { height: 4px; }
          50% { height: 14px; }
        }
        .animate-music-bar-1 { animation: music-bar 1s ease-in-out infinite; }
        .animate-music-bar-2 { animation: music-bar 0.8s ease-in-out infinite 0.2s; }
        .animate-music-bar-3 { animation: music-bar 1.2s ease-in-out infinite 0.4s; }
        .pb-safe { padding-bottom: env(safe-area-inset-bottom); }
      `}</style>
    </MusicContext.Provider >
  );
};

export default AppLayout;