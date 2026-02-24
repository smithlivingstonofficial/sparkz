import React, { useRef, useEffect, useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  X, Calendar, Clock, MapPin, Users, Trophy, 
  Download, MessageCircle, Phone, CheckCircle, 
  Share2, ShoppingBag, ArrowRight, Shield, 
  Music, Gamepad2, ChefHat, Globe, Film, 
  Camera, BookOpen, Palette, Theater, Zap, Star
} from 'lucide-react';
import { useCart } from '../../context/CartContext'; // Ensure this path matches your file structure

// --- ICONS MAPPING ---
const categoryIcons = {
  'music': Music,
  'dance': Music, // You can import a specific Dance icon if available
  'gaming': Gamepad2,
  'cooking': ChefHat,
  'tourism': Globe,
  'film': Film,
  'photography': Camera,
  'literary': BookOpen,
  'arts': Palette,
  'drama': Theater,
  'sports': Trophy,
  'technical': Zap,
  'default': Star
};

const WhatsAppIcon = ({ className }) => (
  <svg viewBox="0 0 24 24" fill="currentColor" className={className}>
    <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.008-.57-.008-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413z"/>
  </svg>
);

const EventModal = ({ event, onClose }) => {
  if (!event) return null;

  // --- HOOKS & STATE ---
  const { addToCart, isInCart } = useCart();
  const [activeTab, setActiveTab] = useState('about'); // 'about', 'rules', 'contact'
  const [isMobile, setIsMobile] = useState(false);
  const modalRef = useRef(null);

  // --- HELPERS ---
  const CategoryIcon = categoryIcons[event.category?.toLowerCase()] || categoryIcons.default;
  const isAdded = isInCart(event.id);
  const eventPrice = typeof event.price === 'number' ? `₹${event.price}` : event.price === 'Free' ? 'Free' : event.price;

  // --- EFFECTS ---
  useEffect(() => {
    const checkMobile = () => setIsMobile(window.innerWidth < 768);
    checkMobile();
    window.addEventListener('resize', checkMobile);
    document.body.style.overflow = 'hidden'; // Lock Scroll
    return () => {
      window.removeEventListener('resize', checkMobile);
      document.body.style.overflow = 'unset';
    };
  }, []);

  // --- HANDLERS ---
  const handleAddToCart = () => {
    addToCart(event);
  };

  const handleDownload = (url, name) => {
    const link = document.createElement('a');
    link.href = url;
    link.download = name;
    link.target = "_blank";
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  const handleShare = () => {
    if (navigator.share) {
      navigator.share({
        title: event.title,
        text: `Check out ${event.title} at Sparkz 2K26!`,
        url: window.location.href,
      });
    }
  };

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      data-lenis-prevent
      className="fixed inset-0 z-[100] flex items-center justify-center sm:p-4 backdrop-blur-xl bg-black/60"
      onClick={onClose}
    >
      <motion.div
        ref={modalRef}
        initial={{ scale: 0.95, y: 20, opacity: 0 }}
        animate={{ scale: 1, y: 0, opacity: 1 }}
        exit={{ scale: 0.95, y: 20, opacity: 0 }}
        transition={{ type: "spring", damping: 25, stiffness: 300 }}
        className="relative w-full h-full sm:h-[90vh] sm:max-w-6xl bg-[#0a0a0a] sm:rounded-3xl shadow-2xl overflow-hidden border border-white/10 flex flex-col"
        onClick={(e) => e.stopPropagation()}
      >
        
        {/* =========================================
            HEADER & HERO SECTION (Fixed Top)
           ========================================= */}
        <div className="relative h-64 sm:h-80 shrink-0 group">
          {/* Background Image */}
          <div className="absolute inset-0">
            <img 
              src={event.image || "/api/placeholder/1200/600"} 
              alt={event.title} 
              className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-105"
            />
            {/* Gradient Overlay */}
            <div className="absolute inset-0 bg-gradient-to-t from-[#0a0a0a] via-[#0a0a0a]/60 to-transparent" />
          </div>

          {/* Close Button */}
          <button 
            onClick={onClose}
            className="absolute top-4 right-4 z-20 p-2 bg-black/40 backdrop-blur-md border border-white/10 rounded-full text-white hover:bg-white/10 hover:scale-110 transition-all"
          >
            <X size={24} />
          </button>

          {/* Hero Content */}
          <div className="absolute bottom-0 left-0 right-0 p-6 sm:p-8 z-10">
            <div className="flex flex-wrap items-center gap-3 mb-3">
              <span className="px-3 py-1 bg-amber-500 text-black text-xs font-bold rounded-full uppercase flex items-center gap-1.5">
                <CategoryIcon size={14} /> {event.category}
              </span>
              {event.featured && (
                <span className="px-3 py-1 bg-gradient-to-r from-red-600 to-pink-600 text-white text-xs font-bold rounded-full flex items-center gap-1">
                  <Star size={12} fill="currentColor" /> Featured
                </span>
              )}
            </div>
            
            <h1 className="text-3xl sm:text-5xl font-black text-white mb-2 leading-tight tracking-tight">
              {event.title}
            </h1>
            <p className="text-lg text-gray-300 font-medium line-clamp-1">{event.tagline}</p>
          </div>
        </div>

        {/* =========================================
            MAIN SCROLLABLE CONTENT
           ========================================= */}
        <div className="flex-1 overflow-y-auto no-scrollbar">
          <div className="flex flex-col lg:flex-row gap-8 p-6 sm:p-8 max-w-7xl mx-auto">
            
            {/* --- LEFT COLUMN: DETAILS --- */}
            <div className="flex-1 space-y-8">
              
              {/* Quick Stats Grid */}
              <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                <StatsCard icon={Calendar} label="Date" value={event.date} />
                <StatsCard icon={Clock} label="Time" value={event.time} />
                <StatsCard icon={MapPin} label="Venue" value={event.venue} />
                <StatsCard 
  icon={Trophy}
  label="Prize"
  value={event.featured ? (
    <>1st Prize - 3000 <br /> 2nd Prize - 1500</>
  ) : (
    <>1st Prize - 750 <br /> 2nd Prize - 500</>
  )}
  highlight
/>
              </div>

              {/* Tabs Navigation */}
              <div className="flex items-center gap-6 border-b border-white/10">
                {['about', 'rules', 'contact'].map((tab) => (
                  <button
                    key={tab}
                    onClick={() => setActiveTab(tab)}
                    className={`pb-3 text-sm font-bold uppercase tracking-wider transition-all relative ${
                      activeTab === tab ? 'text-amber-500' : 'text-gray-500 hover:text-white'
                    }`}
                  >
                    {tab}
                    {activeTab === tab && (
                      <motion.div 
                        layoutId="activeTab"
                        className="absolute bottom-0 left-0 right-0 h-0.5 bg-amber-500"
                      />
                    )}
                  </button>
                ))}
              </div>

              {/* Tabs Content */}
              <div className="min-h-[200px]">
                <AnimatePresence mode="wait">
                  {activeTab === 'about' && (
                    <motion.div 
                      key="about"
                      initial={{ opacity: 0, y: 10 }}
                      animate={{ opacity: 1, y: 0 }}
                      exit={{ opacity: 0, y: -10 }}
                      className="space-y-6"
                    >
                      <p className="text-gray-300 leading-relaxed text-lg">
                        {event.description || "Join us for an electrifying experience! This event brings together the best talent to compete, showcase, and win."}
                      </p>
                      
                      <div className="flex flex-wrap gap-4">
                        <InfoBadge icon={Users} label="Team Size" value={event.participants || "Individual"} />
                        <InfoBadge icon={Shield} label="Club" value={event.club} />
                        <InfoBadge icon={Globe} label="Mode" value={event.eventMode} />
                      </div>
                    </motion.div>
                  )}

                  {activeTab === 'rules' && (
                    <motion.div 
                      key="rules"
                      initial={{ opacity: 0, y: 10 }}
                      animate={{ opacity: 1, y: 0 }}
                      exit={{ opacity: 0, y: -10 }}
                      className="space-y-4"
                    >
                      {event.rules?.length > 0 ? (
                        event.rules.map((rule, idx) => (
                          <div key={idx} className="flex gap-4 p-4 rounded-xl bg-white/5 border border-white/5 hover:bg-white/10 transition-colors">
                            <span className="flex-shrink-0 w-6 h-6 rounded-full bg-amber-500/20 text-amber-500 flex items-center justify-center text-xs font-bold">
                              {idx + 1}
                            </span>
                            <p className="text-gray-300 text-sm leading-relaxed">{rule}</p>
                          </div>
                        ))
                      ) : (
                        <div className="text-center py-10 text-gray-500">
                          <CheckCircle size={40} className="mx-auto mb-2 opacity-50" />
                          <p>Standard event rules apply. Check brochure.</p>
                        </div>
                      )}
                    </motion.div>
                  )}

                  {activeTab === 'contact' && (
                    <motion.div 
                      key="contact"
                      initial={{ opacity: 0, y: 10 }}
                      animate={{ opacity: 1, y: 0 }}
                      exit={{ opacity: 0, y: -10 }}
                      className="grid grid-cols-1 sm:grid-cols-2 gap-4"
                    >
                      {event.eventCoordinators?.map((coord, idx) => {
                        const [name, num] = coord.split(' - ');
                        return (
                          <div key={idx} className="flex items-center gap-4 p-4 rounded-xl bg-white/5 border border-white/5">
                            <div className="w-12 h-12 rounded-full bg-gradient-to-br from-gray-800 to-black flex items-center justify-center border border-white/10">
                              <Phone size={20} className="text-amber-500" />
                            </div>
                            <div>
                              <h4 className="text-white font-bold">{name}</h4>
                              {num && (
                                <a href={`tel:${num}`} className="text-sm text-gray-400 hover:text-amber-500 transition-colors">
                                  {num}
                                </a>
                              )}
                            </div>
                          </div>
                        );
                      })}
                    </motion.div>
                  )}
                </AnimatePresence>
              </div>

            </div>

            {/* --- RIGHT COLUMN: SIDEBAR (Sticky on Desktop) --- */}
            <div className="lg:w-96 shrink-0 space-y-6 pb-24 lg:pb-0">
              
              {/* Registration Card */}
              <div className="p-6 rounded-3xl bg-gradient-to-br from-[#151515] to-black border border-white/10 shadow-xl relative overflow-hidden group">
                <div className="absolute top-0 right-0 p-32 bg-amber-500/5 rounded-full blur-3xl -translate-y-1/2 translate-x-1/2 group-hover:bg-amber-500/10 transition-all duration-500" />
                
                <div className="relative z-10">
                  <h3 className="text-gray-400 text-xs font-bold uppercase tracking-widest mb-1">Registration Fee</h3>
                  <div className="text-4xl font-black text-white mb-6 flex items-baseline gap-1">
                    {eventPrice} <span className="text-sm font-normal text-gray-500">/ team</span>
                  </div>

                  <button
                    onClick={handleAddToCart}
                    disabled={isAdded}
                    className={`w-full py-4 rounded-xl font-bold text-lg flex items-center justify-center gap-2 transition-all duration-300 transform active:scale-95 shadow-lg
                      ${isAdded 
                        ? 'bg-green-600 text-white cursor-default' 
                        : 'bg-gradient-to-r from-amber-500 to-orange-600 hover:from-amber-400 hover:to-orange-500 text-black shadow-orange-500/20'
                      }
                    `}
                  >
                    {isAdded ? (
                      <> <CheckCircle size={20} /> Added to Cart </>
                    ) : (
                      <> <ShoppingBag size={20} /> Register Now </>
                    )}
                  </button>

                  <div className="mt-4 flex items-center justify-center gap-2 text-xs text-gray-500">
                    <Shield size={12} /> Secure Checkout
                  </div>
                </div>
              </div>

              {/* Downloads & Socials */}
              <div className="grid grid-cols-1 gap-3">
                {event.whatsapp && (
                  <a 
                    href={event.whatsapp} 
                    target="_blank" 
                    rel="noreferrer"
                    className="flex items-center gap-3 p-4 rounded-xl bg-[#25D366]/10 border border-[#25D366]/20 text-[#25D366] hover:bg-[#25D366]/20 transition-all group"
                  >
                    <WhatsAppIcon className="w-6 h-6" />
                    <span className="font-bold flex-1">Join WhatsApp Group</span>
                    <ArrowRight size={18} className="group-hover:translate-x-1 transition-transform" />
                  </a>
                )}
                
                <button 
                   onClick={() => handleDownload("#", "brochure")} // Replace # with real link
                   className="flex items-center gap-3 p-4 rounded-xl bg-white/5 border border-white/10 text-gray-300 hover:bg-white/10 hover:text-white transition-all"
                >
                  <Download size={20} />
                  <span className="font-medium flex-1 text-left">Download Brochure</span>
                </button>

                <button 
                   onClick={handleShare}
                   className="flex items-center gap-3 p-4 rounded-xl bg-white/5 border border-white/10 text-gray-300 hover:bg-white/10 hover:text-white transition-all"
                >
                  <Share2 size={20} />
                  <span className="font-medium flex-1 text-left">Share Event</span>
                </button>
              </div>

            </div>

          </div>
        </div>

        {/* =========================================
            MOBILE STICKY ACTION BAR
           ========================================= */}
        {isMobile && (
          <div className="p-4 bg-[#0a0a0a]/80 backdrop-blur-xl border-t border-white/10 flex items-center gap-4 z-50">
            <div className="flex-1">
              <p className="text-xs text-gray-400 uppercase">Total Fee</p>
              <p className="text-xl font-bold text-white">{eventPrice}</p>
            </div>
            <button
              onClick={handleAddToCart}
              disabled={isAdded}
              className={`px-8 py-3 rounded-xl font-bold text-sm shadow-lg flex items-center gap-2
                ${isAdded 
                  ? 'bg-green-600 text-white' 
                  : 'bg-gradient-to-r from-amber-500 to-orange-600 text-black'
                }
              `}
            >
              {isAdded ? 'Added' : 'Register Now'}
            </button>
          </div>
        )}

      </motion.div>
    </motion.div>
  );
};

// --- SUB-COMPONENTS ---

const StatsCard = ({ icon: Icon, label, value, highlight }) => (
  <div className={`p-3 rounded-2xl border flex flex-col items-center justify-center text-center gap-1 transition-all
    ${highlight 
      ? 'bg-amber-500/10 border-amber-500/30' 
      : 'bg-white/5 border-white/5 hover:border-white/10'
    }
  `}>
    <Icon size={18} className={highlight ? 'text-amber-500' : 'text-gray-400'} />
    <span className="text-[10px] uppercase font-bold text-gray-500 tracking-wider">{label}</span>
    <span className={`text-sm font-bold ${highlight ? 'text-amber-400' : 'text-white'}`}>{value}</span>
  </div>
);

const InfoBadge = ({ icon: Icon, label, value }) => (
  <div className="flex items-center gap-2 px-3 py-1.5 rounded-lg bg-white/5 border border-white/5">
    <Icon size={14} className="text-gray-400" />
    <span className="text-xs text-gray-400">{label}:</span>
    <span className="text-xs text-white font-medium">{value}</span>
  </div>
);

export default EventModal;