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
  ShoppingCart,
  User,
  Spotlight,
  LogIn,
  Target,
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
        analyser.smoothingTimeConstant = 0.8;

        source.connect(analyser);
        analyser.connect(audioCtx.destination);

        setAnalyser(analyser);
        return audioCtx;
      } catch (error) {
        console.error("Error setting up audio context:", error);
        return null;
      }
    };

    setupAudioContext();

    const promptTimer = setTimeout(() => {
      if (!isAudioPlaying) {
        setShowAudioPrompt(true);
      }
    }, 3000);

    return () => {
      clearTimeout(promptTimer);
      if (audioContextRef.current) {
        audioContextRef.current.close();
      }
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
      audioRef.current.play().catch(e => console.error("Resume failed", e));
    }
  }, [isExternalPaused, isAudioPlaying]);

  const startAudio = async () => {
    if (!audioRef.current || isAudioPlaying) return;
    try {
      await audioRef.current.play();
      setIsAudioPlaying(true);
      setShowAudioPrompt(false);
      if (audioContextRef.current && audioContextRef.current.state === 'suspended') {
        await audioContextRef.current.resume();
      }
    } catch (error) {
      console.error("Failed to play audio:", error);
      setShowAudioPrompt(true);
    }
  };

  const handleExternalPlay = (isPlaying) => {
    setIsExternalPaused(isPlaying);
  };

  useEffect(() => {
    const handleFirstInteraction = () => {
      if (!isAudioPlaying) {
        startAudio();
      }
    };
    document.addEventListener('click', handleFirstInteraction, { once: true });
    return () => {
      document.removeEventListener('click', handleFirstInteraction);
    };
  }, [isAudioPlaying]);

  useEffect(() => {
    if (audioRef.current) {
      audioRef.current.muted = isMuted;
      if (!isMuted && !isExternalPaused) {
        audioRef.current.volume = 0.4;
      }
    }
  }, [isMuted, isExternalPaused]);

  useEffect(() => {
    const interval = setInterval(() => {
      const now = new Date();
      const timeString = now.toLocaleTimeString('en-US', {
        hour12: false, hour: '2-digit', minute: '2-digit', second: '2-digit'
      });
      setCurrentTime(timeString);
    }, 1000);

    const handleScroll = () => setIsScrolled(window.scrollY > 50);
    window.addEventListener('scroll', handleScroll);

    return () => {
      clearInterval(interval);
      window.removeEventListener('scroll', handleScroll);
    };
  }, []);

  const toggleSidebar = () => {
    setIsSidebarOpen(!isSidebarOpen);
  };

  const toggleMute = () => {
    setIsMuted(!isMuted);
  };

  return (
    <MusicContext.Provider value={{ isMuted, toggleMute, analyser, isAudioPlaying, startAudio, handleExternalPlay }}>
      <div className="relative w-full min-h-screen bg-[#0a0a0a] overflow-x-hidden selection:bg-amber-500 selection:text-black">

        <audio ref={audioRef} loop preload="auto">
          <source src="/audio/sparkz.mpeg" type="audio/mpeg" />
        </audio>

        {showAudioPrompt && !isAudioPlaying && (
          <div className="fixed bottom-24 right-6 z-50 animate-pulse">
            <button
              onClick={startAudio}
              className="flex items-center gap-2 px-4 py-3 bg-gradient-to-r from-amber-600 to-red-600 text-white font-semibold rounded-full shadow-lg hover:from-amber-700 hover:to-red-700 transition-all duration-300 group"
            >
              <Play size={18} className="group-hover:scale-110 transition-transform" />
              <span>Play Background Music</span>
            </button>
          </div>
        )}

        <div
          className={clsx(
            "transition-all duration-700 ease-[cubic-bezier(0.76,0,0.24,1)]",
            isSidebarOpen ? "md:mr-[350px]" : "md:mr-0"
          )}
        >
          {/* 
              FIXED HEADER: 
              - Removed excess height
              - Added glassmorphism only when scrolled to keep hero clean
          */}
          <div className={clsx(
            "fixed top-0 left-0 z-40 flex items-center justify-between px-4 md:px-8 py-4 transition-all duration-500",
            isSidebarOpen ? "md:w-[calc(100%-350px)]" : "w-full",
            isScrolled
              ? "bg-black/80 backdrop-blur-xl border-b border-white/5 py-3 shadow-2xl"
              : "bg-transparent py-6"
          )}>
            {/* LOGO AREA */}
            <Link to="/" className="flex items-center gap-4 group">
              <div className="relative h-10 w-auto">
                <img 
                  src="https://www.kalasalingam.ac.in/wp-content/uploads/2022/02/Logo.png" 
                  alt="SPARKZ Logo" 
                  className="h-full w-auto object-contain drop-shadow-[0_0_10px_rgba(251,191,36,0.3)] transition-transform group-hover:scale-105"
                />
              </div>
              <div className="hidden md:flex flex-col border-l border-white/20 pl-4">
                <span className="font-mono text-[10px] text-amber-500 tracking-widest font-bold">REC</span>
                <span className="font-mono text-[10px] text-white/60">{currentTime}</span>
              </div>
            </Link>

            {/* DESKTOP NAV */}
            <div className="flex items-center gap-6">
              <div className="hidden md:flex items-center gap-8 bg-black/40 backdrop-blur-md px-6 py-2 rounded-full border border-white/5">
                <Link to="/" className="text-white/70 hover:text-white hover:text-amber-400 transition-colors text-xs font-bold uppercase tracking-widest">Home</Link>
                <Link to="/events" className="text-white/70 hover:text-white hover:text-amber-400 transition-colors text-xs font-bold uppercase tracking-widest">Events</Link>
                <Link to="/cart" className="text-white/70 hover:text-white hover:text-amber-400 transition-colors text-xs font-bold uppercase tracking-widest">Cart</Link>
                <Link to="/proshow" className="text-white/70 hover:text-white hover:text-amber-400 transition-colors text-xs font-bold uppercase tracking-widest">Pro Show</Link>
                <Link to="/sponsors" className="text-white/70 hover:text-white hover:text-amber-400 transition-colors text-xs font-bold uppercase tracking-widest">Sponsors</Link>
              </div>

              <div className="flex items-center gap-3">
                {user ? (
                  <button
                    onClick={() => setIsProfileOpen(true)}
                    className="hidden md:flex items-center gap-2 px-5 py-2.5 bg-gradient-to-r from-amber-600 to-red-600 text-white text-xs font-bold uppercase tracking-widest rounded-full hover:shadow-[0_0_20px_rgba(245,158,11,0.4)] transition-all duration-300"
                  >
                    <User size={14} />
                    <span>Profile</span>
                  </button>
                ) : (
                  <Link 
                    to="/auth" 
                    className="hidden md:flex items-center gap-2 px-5 py-2.5 bg-gradient-to-r from-amber-600 to-red-600 text-white text-xs font-bold uppercase tracking-widest rounded-full hover:shadow-[0_0_20px_rgba(245,158,11,0.4)] transition-all duration-300"
                  >
                    <User size={14} />
                    <span>Login</span>
                  </Link>
                )}

                {isAudioPlaying && !isExternalPaused && (
                  <button
                    onClick={toggleMute}
                    className="p-2.5 bg-white/5 hover:bg-white/10 border border-white/10 rounded-full transition-all group"
                  >
                    {isMuted ? (
                      <VolumeX className="w-4 h-4 text-white/50 group-hover:text-red-400" />
                    ) : (
                      <div className="flex items-center gap-0.5">
                        <span className="w-0.5 h-2 bg-amber-500 animate-[music_1s_ease-in-out_infinite]"></span>
                        <span className="w-0.5 h-3 bg-amber-500 animate-[music_1.2s_ease-in-out_infinite]"></span>
                        <span className="w-0.5 h-1.5 bg-amber-500 animate-[music_0.8s_ease-in-out_infinite]"></span>
                      </div>
                    )}
                  </button>
                )}

                {/* Desktop Sidebar Toggle */}
                <button
                  onClick={toggleSidebar}
                  className="hidden md:flex items-center gap-2 px-4 py-2.5 bg-white/5 hover:bg-white/10 border border-white/10 rounded-full transition-all group"
                >
                  <Menu size={16} className="text-white/80 group-hover:text-amber-400" />
                  <span className="text-[10px] font-bold uppercase tracking-widest text-white/80 group-hover:text-white">Menu</span>
                </button>
              </div>
            </div>
          </div>

          {/* 
             MAIN CONTENT:
             - Changed pt-20 to pt-0 so background images go to the top
             - Added pb-20 for mobile nav spacing
          */}
          <div className="main-content pt-0 pb-20 md:pb-0 min-h-screen">
            <SmoothScrollWrapper>{children}</SmoothScrollWrapper>
          </div>
        </div>

        <Sidebar isOpen={isSidebarOpen} onClose={toggleSidebar} />

        {/* Mobile Bottom Navigation */}
        <div className="fixed bottom-0 left-0 right-0 z-50 md:hidden bg-black/80 backdrop-blur-xl border-t border-white/10 pb-safe">
          <div className="flex items-center justify-around p-2">
            <Link to="/" className="flex flex-col items-center p-2 text-white/50 hover:text-amber-500 transition-colors">
              <Sparkles size={20} />
              <span className="text-[10px] font-bold uppercase tracking-widest mt-1">Home</span>
            </Link>
            <Link to="/events" className="flex flex-col items-center p-2 text-white/50 hover:text-amber-500 transition-colors">
              <Film size={20} />
              <span className="text-[10px] font-bold uppercase tracking-widest mt-1">Events</span>
            </Link>
            <Link to="/proshow" className="flex flex-col items-center p-2 text-white/50 hover:text-amber-500 transition-colors">
              <Spotlight size={20} />
              <span className="text-[10px] font-bold uppercase tracking-widest mt-1">Pro</span>
            </Link>
            <div className="relative -top-6">
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
            <Link to="/cart" className="flex flex-col items-center p-2 text-white/50 hover:text-amber-500 transition-colors">
              <ShoppingCart size={20} />
              <span className="text-[10px] font-bold uppercase tracking-widest mt-1">Cart</span>
            </Link>
            <Link to="/teams" className="flex flex-col items-center p-2 text-white/50 hover:text-amber-500 transition-colors">
              <Target size={20} />
              <span className="text-[10px] font-bold uppercase tracking-widest mt-1">Team</span>
            </Link>
            <button onClick={toggleSidebar} className="flex flex-col items-center p-2 text-white/50 hover:text-amber-500 transition-colors">
              <Menu size={20} />
              <span className="text-[10px] font-bold uppercase tracking-widest mt-1">Menu</span>
            </button>
          </div>
        </div>
      </div>

      <ProfileModal isOpen={isProfileOpen} onClose={() => setIsProfileOpen(false)} />
      
      <style jsx>{`
        @keyframes music {
          0%, 100% { height: 4px; }
          50% { height: 12px; }
        }
        .pb-safe {
          padding-bottom: env(safe-area-inset-bottom);
        }
      `}</style>
    </MusicContext.Provider >
  );
};

export default AppLayout;