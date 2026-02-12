// components/layout/AuthLayout.jsx
import React, { useState, useEffect } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { Sparkles, Film, Volume2, VolumeX, ArrowLeft } from 'lucide-react';
import { clsx } from 'clsx';

const AuthLayout = ({ children }) => {
  const [isMuted, setIsMuted] = useState(false);
  const [currentTime, setCurrentTime] = useState('00:00:00');
  const [showBackButton, setShowBackButton] = useState(false);
  const location = useLocation();

  useEffect(() => {
    // Update cinematic timestamp
    const interval = setInterval(() => {
      const now = new Date();
      const timeString = now.toLocaleTimeString('en-US', { 
        hour12: false,
        hour: '2-digit',
        minute: '2-digit',
        second: '2-digit'
      });
      setCurrentTime(timeString);
    }, 1000);

    // Check if we need to show back button (not on main auth page)
    const isOnMainAuthPage = location.pathname === '/auth';
    setShowBackButton(!isOnMainAuthPage);

    return () => clearInterval(interval);
  }, [location]);

  return (
    <div className="relative min-h-screen bg-gradient-to-br from-[#0a0a0a] via-[#1a1a1a] to-[#0a0a0a] overflow-hidden">
      {/* Film Grain Overlay */}
      <div className="film-grain fixed inset-0 z-0"></div>
      
      {/* Animated Background Particles */}
      <div className="fixed inset-0 overflow-hidden">
        {[...Array(15)].map((_, i) => (
          <div
            key={i}
            className="absolute w-1 h-1 bg-amber-400/10 rounded-full animate-float"
            style={{
              left: `${Math.random() * 100}%`,
              top: `${Math.random() * 100}%`,
              animationDelay: `${i * 0.5}s`,
              animationDuration: `${Math.random() * 15 + 15}s`
            }}
          ></div>
        ))}
      </div>

      {/* Control Bar (Top) */}
      <div className="fixed top-0 left-0 right-0 z-50 flex items-center justify-between px-6 py-3 bg-black/50 backdrop-blur-md border-b border-white/10">
        <div className="flex items-center gap-4">
          <Link to="/" className="group flex items-center gap-3">
            <div className="relative">
              <div className="w-8 h-8 bg-gradient-to-br from-amber-500 to-red-600 rounded-lg flex items-center justify-center">
                <Sparkles className="text-white" size={18} />
              </div>
              <div className="absolute -inset-1 bg-gradient-to-r from-amber-500 to-red-600 rounded-lg blur opacity-30 group-hover:opacity-50 transition-opacity"></div>
            </div>
            <div className="flex flex-col">
              <span className="font-['Cinzel'] text-lg font-bold tracking-tight leading-none text-white">
                SPARKZ<span className="text-amber-500">'26</span>
              </span>
              <span className="font-mono text-[10px] text-white/60 mt-0.5">AUTH PORTAL</span>
            </div>
          </Link>
          
          <div className="hidden md:flex items-center gap-2 pl-4 border-l border-white/20">
            <Film className="w-4 h-4 text-amber-400 animate-pulse" />
            <span className="font-mono text-xs text-white/60">REEL: {currentTime}</span>
          </div>
        </div>
        
        <div className="flex items-center gap-4">
          {/* Back Button for non-main auth pages */}
          {showBackButton && (
            <Link
              to="/auth"
              className="flex items-center gap-2 px-4 py-2 bg-white/5 border border-white/10 rounded-lg text-white/70 hover:text-white hover:border-white/20 transition-all duration-300"
            >
              <ArrowLeft size={16} />
              <span className="text-sm">Back</span>
            </Link>
          )}
          
          {/* Home Button */}
          <Link
            to="/"
            className="hidden md:flex items-center gap-2 px-4 py-2 bg-gradient-to-r from-amber-600 to-red-600 text-white text-sm font-semibold rounded-lg hover:from-amber-700 hover:to-red-700 transition-all duration-300"
          >
            Back to Home
          </Link>
          
          <button
            onClick={() => setIsMuted(!isMuted)}
            className="p-2 hover:bg-white/5 rounded-lg transition-colors group"
            title={isMuted ? "Unmute" : "Mute"}
          >
            {isMuted ? (
              <VolumeX className="w-5 h-5 text-white/60 group-hover:text-amber-400 transition-colors" />
            ) : (
              <Volume2 className="w-5 h-5 text-amber-400 group-hover:text-amber-300 transition-colors" />
            )}
          </button>
        </div>
      </div>

      {/* Decorative Side Elements */}
      <div className="hidden lg:block fixed left-0 top-0 bottom-0 w-20 z-10">
        <div className="h-full w-full flex flex-col items-center justify-center gap-8">
          <div className="h-32 w-px bg-gradient-to-b from-transparent via-amber-500 to-transparent"></div>
          <div className="font-mono text-xs text-white/30 rotate-90 whitespace-nowrap">SPARKZ 2026</div>
          <div className="h-32 w-px bg-gradient-to-b from-transparent via-red-500 to-transparent"></div>
        </div>
      </div>

      <div className="hidden lg:block fixed right-0 top-0 bottom-0 w-20 z-10">
        <div className="h-full w-full flex flex-col items-center justify-center gap-8">
          <div className="h-32 w-px bg-gradient-to-b from-transparent via-red-500 to-transparent"></div>
          <div className="font-mono text-xs text-white/30 -rotate-90 whitespace-nowrap">KARE CULTURAL FEST</div>
          <div className="h-32 w-px bg-gradient-to-b from-transparent via-amber-500 to-transparent"></div>
        </div>
      </div>

      {/* Main Content */}
      <div className="relative z-20 min-h-screen flex items-center justify-center px-4 py-20">
        {/* Animated Border Effect */}
        <div className="absolute inset-0 overflow-hidden">
          <div className="absolute -top-40 -right-40 w-80 h-80 bg-amber-500/5 rounded-full blur-3xl"></div>
          <div className="absolute -bottom-40 -left-40 w-80 h-80 bg-red-500/5 rounded-full blur-3xl"></div>
        </div>

        <div className="w-full max-w-6xl">
          {children}
        </div>
      </div>

      {/* Bottom Bar */}
      <div className="fixed bottom-0 left-0 right-0 z-50 flex items-center justify-between px-6 py-3 bg-black/30 backdrop-blur-sm border-t border-white/10">
        <div className="font-mono text-xs text-white/40">
          <span className="hidden md:inline">KALASALINGAM ACADEMY OF RESEARCH & EDUCATION</span>
          <span className="md:hidden">KARE - SPARKZ 2026</span>
        </div>
        
        <div className="flex items-center gap-4">
          <div className="flex items-center gap-2">
            <div className="w-2 h-2 bg-green-500 rounded-full animate-pulse"></div>
            <span className="text-xs text-white/60">SECURE CONNECTION</span>
          </div>
          
          <div className="hidden md:block font-mono text-xs text-white/40">
            v2.0.26 • CINEMATIC EDITION
          </div>
        </div>
      </div>

      {/* Mobile Back Button */}
      {showBackButton && (
        <Link
          to="/auth"
          className="md:hidden fixed bottom-20 right-6 z-50 flex items-center justify-center w-12 h-12 bg-gradient-to-br from-amber-600 to-red-600 text-white rounded-full shadow-lg hover:shadow-amber-500/20 transition-all duration-300"
        >
          <ArrowLeft size={20} />
        </Link>
      )}

      {/* Mobile Home Button */}
      <Link
        to="/"
        className="md:hidden fixed bottom-6 right-6 z-50 flex items-center justify-center w-12 h-12 bg-gradient-to-br from-amber-600 to-red-600 text-white rounded-full shadow-lg hover:shadow-amber-500/20 transition-all duration-300"
      >
        <Sparkles size={20} />
      </Link>
    </div>
  );
};

export default AuthLayout;