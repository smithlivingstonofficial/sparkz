import React, { useState, useCallback } from 'react';
import { motion } from 'framer-motion';
import { 
  Calendar, Clock, MapPin, Ticket, Sparkles, 
  Users, Award, Crown, Zap, Music, Palette, 
  Camera, Video, Theater, BookOpen, Film, Trophy, 
  UserCheck, Globe, ChevronRight, ShoppingCart, Check
} from 'lucide-react';
import { useCart } from '../../context/CartContext';

// Category icons
const categoryIcons = {
  music: Music,
  drama: Theater,
  arts: Palette,
  literary: BookOpen,
  photo: Camera,
  video: Video,
  film: Film,
  sports: Trophy,
  dance: Zap,
  gaming: Zap,
  default: Sparkles
};

const EventCard = ({ 
  event, 
  isMobile, 
  setSelectedEvent, 
  setHoveredCard, 
  isHovered
}) => {
  const CategoryIcon = categoryIcons[event.category?.toLowerCase()] || categoryIcons.default;
  const isFeatured = event.featured;
  const [showClickHint, setShowClickHint] = useState(false);
  
  const { addToCart, removeFromCart, isInCart } = useCart();
  const isEventInCart = isInCart(event.id);

  // Category colors – exactly as you had them
  const getCategoryColor = (category) => {
    const colors = {
      music: { gradient: 'from-purple-600 to-pink-600', bg: 'bg-purple-500/10', text: 'text-purple-400', border: 'border-purple-500/30' },
      drama: { gradient: 'from-red-600 to-rose-600', bg: 'bg-red-500/10', text: 'text-red-400', border: 'border-red-500/30' },
      arts: { gradient: 'from-green-600 to-emerald-600', bg: 'bg-green-500/10', text: 'text-green-400', border: 'border-green-500/30' },
      literary: { gradient: 'from-blue-600 to-cyan-600', bg: 'bg-blue-500/10', text: 'text-blue-400', border: 'border-blue-500/30' },
      photo: { gradient: 'from-cyan-600 to-teal-600', bg: 'bg-cyan-500/10', text: 'text-cyan-400', border: 'border-cyan-500/30' },
      video: { gradient: 'from-pink-600 to-rose-600', bg: 'bg-pink-500/10', text: 'text-pink-400', border: 'border-pink-500/30' },
      film: { gradient: 'from-amber-600 to-orange-600', bg: 'bg-amber-500/10', text: 'text-amber-400', border: 'border-amber-500/30' },
      sports: { gradient: 'from-orange-600 to-red-600', bg: 'bg-orange-500/10', text: 'text-orange-400', border: 'border-orange-500/30' },
      dance: { gradient: 'from-blue-600 via-purple-600 to-blue-900', bg: 'bg-blue-500/10', text: 'text-blue-400', border: 'border-blue-500/30' },
      default: { gradient: 'from-amber-600 to-red-600', bg: 'bg-amber-500/10', text: 'text-amber-400', border: 'border-amber-500/30' }
    };
    return colors[category?.toLowerCase()] || colors.default;
  };

  const colors = getCategoryColor(event.category);

  // Animation variants
  const cardVariants = {
    hidden: { opacity: 0, y: 50, scale: 0.95 },
    visible: { 
      opacity: 1, y: 0, scale: 1,
      transition: { type: "spring", stiffness: 100, damping: 15 }
    },
    hover: { 
      y: isMobile ? 0 : -8,
      scale: isMobile ? 1 : 1.02,
      transition: { duration: 0.3 }
    },
    exit: { opacity: 0, scale: 0.9 }
  };

  const contentVariants = {
    hidden: { opacity: 0 },
    visible: { 
      opacity: 1,
      transition: { staggerChildren: 0.1 }
    }
  };

  const itemVariants = {
    hidden: { opacity: 0, y: 20 },
    visible: { opacity: 1, y: 0 }
  };

  // Open modal on card click
  const handleCardClick = useCallback(() => {
    setSelectedEvent(event);
  }, [event, setSelectedEvent]);

  // ✅ FIXED: Add to cart – stops all event propagation so it NEVER triggers card click
  const handleAddToCart = useCallback((e) => {
    e.stopPropagation();
    e.preventDefault();                     // Extra safety
    e.nativeEvent?.stopImmediatePropagation?.(); // Stops other listeners on the same element
    if (isEventInCart) {
      removeFromCart(event.id);
    } else {
      addToCart(event);
    }
  }, [event, isEventInCart, addToCart, removeFromCart]);

  return (
    <motion.div
      layout
      variants={cardVariants}
      initial="hidden"
      animate="visible"
      exit="exit"
      whileHover="hover"
      onMouseEnter={() => {
        if (!isMobile) {
          setHoveredCard(event.id);
          setShowClickHint(true);
        }
      }}
      onMouseLeave={() => {
        if (!isMobile) {
          setHoveredCard(null);
          setShowClickHint(false);
        }
      }}
      className="relative w-full"
      onClick={handleCardClick}
      onTouchStart={() => setShowClickHint(true)}
      onTouchEnd={() => setShowClickHint(false)}
    >
      <div className="relative overflow-hidden rounded-xl md:rounded-2xl transition-all duration-500 will-change-transform h-full min-h-[380px] cursor-pointer group">
        {/* Background – exactly as you had */}
        <div className="absolute inset-0 z-0 overflow-hidden">
          {event.image ? (
            <motion.div
              className="absolute inset-0"
              style={{
                backgroundImage: `url(${event.image})`,
                backgroundSize: 'cover',
                backgroundPosition: 'center',
              }}
              animate={{ scale: isHovered && !isMobile ? 1.1 : 1 }}
              transition={{ duration: 0.7 }}
            />
          ) : event.gradient ? (
            <div className="absolute inset-0" style={{ background: event.gradient }} />
          ) : (
            <div className={`absolute inset-0 bg-gradient-to-br ${event.posterColor || colors.gradient} opacity-80`} />
          )}
          
          {/* Gradient overlays */}
          <div className="absolute inset-0 bg-gradient-to-t from-black via-black/70 to-transparent" />
          <div className="absolute inset-0 bg-gradient-to-r from-black/30 via-transparent to-black/30" />
          
          {/* Grid pattern */}
          <div className="absolute inset-0 opacity-5">
            <div 
              className="absolute inset-0" 
              style={{
                backgroundImage: `linear-gradient(rgba(255,255,255,0.1) 1px, transparent 1px),
                                  linear-gradient(90deg, rgba(255,255,255,0.1) 1px, transparent 1px)`,
                backgroundSize: '30px 30px',
              }}
            />
          </div>
        </div>

        {/* Glassmorphism overlay */}
        <div className="absolute inset-0 z-10 bg-gradient-to-b from-black/40 via-black/20 to-black/60 backdrop-blur-[1px] border border-white/10" />

        {/* Clickable overlay (whole card) */}
        <div className="absolute inset-0 z-30 cursor-pointer pointer-events-none" />


        {/* ===== CART BUTTON REMOVED FROM TOP RIGHT ===== */}

        {/* Card Content */}
        <motion.div 
          variants={contentVariants}
          initial="hidden"
          animate="visible"
          className="relative z-20 h-full flex flex-col p-4 md:p-5 pointer-events-none"
        >
          {/* Top Section */}
          <div className="flex justify-between items-start mb-3 pointer-events-auto">
            <motion.div
              variants={itemVariants}
              className="px-3 py-1.5 bg-gradient-to-r from-black/80 to-black/60 backdrop-blur-sm rounded-full border border-white/20 shadow-lg"
            >
              <div className="flex items-center gap-2">
                <Calendar className="w-3 h-3 text-amber-300" />
                <span className="text-white text-xs font-bold">{event.day}</span>
              </div>
            </motion.div>

            <div className="flex items-center gap-1.5">
              {isFeatured && (
                <motion.div
                  variants={itemVariants}
                  className="px-2 py-1 bg-gradient-to-r from-amber-600/90 to-red-600/90 backdrop-blur-sm rounded-full border border-amber-500/40 shadow-lg"
                >
                  <div className="flex items-center gap-1">
                    <Crown className="w-3 h-3 text-white" />
                    <span className="text-white text-xs font-bold">FEATURED</span>
                  </div>
                </motion.div>
              )}

              <motion.div
                variants={itemVariants}
                className={`px-2 py-1 ${
                  event.eventMode === 'Online' 
                    ? 'bg-gradient-to-r from-green-600 to-emerald-600' 
                    : 'bg-gradient-to-r from-blue-600 to-cyan-600'
                } backdrop-blur-sm rounded-full border border-white/20 shadow-lg`}
              >
                <div className="flex items-center gap-1">
                  <Globe className="w-3 h-3 text-white" />
                  <span className="text-white text-xs font-bold">{event.eventMode}</span>
                </div>
              </motion.div>
            </div>
          </div>

          {/* Middle Section */}
          <div className="flex-1 flex flex-col justify-center mb-4">
            <motion.div variants={itemVariants} className="mb-3">
              <div className="flex items-center gap-2 px-3 py-2 bg-black/50 backdrop-blur-sm rounded-lg border border-white/20 w-fit">
                <div className={`p-1.5 rounded-md ${colors.bg}`}>
                  <CategoryIcon className={`w-4 h-4 ${colors.text}`} />
                </div>
                <span className={`text-sm font-bold ${colors.text} uppercase tracking-wide`}>
                  {event.category}
                </span>
              </div>
            </motion.div>

            <motion.h3
              variants={itemVariants}
              className="text-2xl md:text-3xl font-bold text-white mb-2 leading-tight line-clamp-2"
            >
              {event.title}
            </motion.h3>

            <motion.p
              variants={itemVariants}
              className="text-amber-100/80 text-sm mb-3 font-medium line-clamp-2"
            >
              {event.tagline}
            </motion.p>

            <motion.div
              variants={itemVariants}
              className="w-16 h-0.5 bg-gradient-to-r from-amber-400 to-red-500 mb-3 shadow-lg"
            />

            <motion.div variants={itemVariants} className="grid grid-cols-2 gap-2 mb-3">
              {/* Date */}
              <div className="flex items-center gap-2 p-2 bg-black/40 backdrop-blur-sm rounded-lg border border-white/10">
                <Calendar className="w-4 h-4 text-amber-300" />
                <div className="flex-1 min-w-0">
                  <div className="text-white text-xs font-medium">DATE</div>
                  <div className="text-white text-sm font-bold truncate">{event.date}</div>
                </div>
              </div>
              {/* Time */}
              <div className="flex items-center gap-2 p-2 bg-black/40 backdrop-blur-sm rounded-lg border border-white/10">
                <Clock className="w-4 h-4 text-amber-300" />
                <div className="flex-1 min-w-0">
                  <div className="text-white text-xs font-medium">TIME</div>
                  <div className="text-white text-sm font-bold truncate">{event.time}</div>
                </div>
              </div>
              {/* Venue */}
              <div className="flex items-center gap-2 p-2 bg-black/40 backdrop-blur-sm rounded-lg border border-white/10">
                <MapPin className="w-4 h-4 text-amber-300" />
                <div className="flex-1 min-w-0">
                  <div className="text-white text-xs font-medium">VENUE</div>
                  <div className="text-white text-sm font-bold truncate">{event.venue}</div>
                </div>
              </div>
              {/* Club */}
              <div className="flex items-center gap-2 p-2 bg-black/40 backdrop-blur-sm rounded-lg border border-white/10">
                <Award className="w-4 h-4 text-amber-300" />
                <div className="flex-1 min-w-0">
                  <div className="text-white text-xs font-medium">CLUB</div>
                  <div className="text-white text-sm font-bold truncate">{event.club}</div>
                </div>
              </div>
              {/* Seats */}
              <div className="flex items-center gap-2 p-2 bg-black/40 backdrop-blur-sm rounded-lg border border-white/10">
                <Users className="w-4 h-4 text-amber-300" />
                <div className="flex-1 min-w-0">
                  <div className="text-white text-xs font-medium">SEATS</div>
                  <div className="text-white text-sm font-bold truncate">{event.seats}</div>
                </div>
              </div>
              {/* Participants */}
              <div className="flex items-center gap-2 p-2 bg-black/40 backdrop-blur-sm rounded-lg border border-white/10">
                <UserCheck className="w-4 h-4 text-amber-300" />
                <div className="flex-1 min-w-0">
                  <div className="text-white text-xs font-medium">PARTICIPANTS</div>
                  <div className="text-white text-sm font-bold truncate">{event.participants}</div>
                </div>
              </div>
            </motion.div>
          </div>

          {/* Bottom Section – Price (left) + Cart Button (right) */}
          <div className="flex flex-row items-center justify-between gap-3 pointer-events-auto">
            {/* Price */}
            <motion.div variants={itemVariants} className="flex items-center">
              {event.price && (
                <div className="px-3 py-1.5 bg-gradient-to-r from-amber-600 to-red-600 rounded-lg shadow-lg">
                  <div className="flex items-center gap-1.5">
                    <Ticket className="w-4 h-4 text-white" />
                    <span className="text-white text-sm font-bold">{event.price}</span>
                  </div>
                </div>
              )}
            </motion.div>

            {/* ✅ CART BUTTON – now at bottom right, with full click isolation */}
            <motion.div variants={itemVariants} className="flex items-center">
              <button
                onClick={handleAddToCart}
                className={`px-4 py-2 rounded-lg shadow-lg active:scale-95 transition-transform flex items-center justify-center gap-2 relative z-40 ${
                  isEventInCart
                    ? 'bg-gradient-to-r from-green-600 to-emerald-600 text-white'
                    : 'bg-gradient-to-r from-amber-600 to-red-600 text-white'
                }`}
              >
                {isEventInCart ? (
                  <>
                    <Check className="w-4 h-4" />
                    <span className="text-sm">Added</span>
                  </>
                ) : (
                  <>
                    <ShoppingCart className="w-4 h-4" />
                    <span className="text-sm">Add to Cart</span>
                  </>
                )}
              </button>
            </motion.div>
          </div>
        </motion.div>

        {/* Hover Effects */}
        {!isMobile && (
          <>
            {/* Hover Glow */}
            <div className="absolute inset-0 z-0 opacity-0 group-hover:opacity-100 transition-opacity duration-500 pointer-events-none">
              <div className="absolute inset-0 bg-gradient-to-r from-amber-500/5 via-transparent to-red-500/5" />
            </div>

            {/* ✅ CLICK HINT – moved to bottom‑left, never overlaps cart button */}
            <div className={`absolute bottom-4 left-4 z-30 transition-opacity duration-300 pointer-events-none ${
              showClickHint ? 'opacity-100' : 'opacity-0'
            }`}>
              <div className="px-3 py-2 bg-gradient-to-r from-black/90 to-black/80 backdrop-blur-sm rounded-lg border border-white/20 shadow-xl">
                <div className="flex items-center gap-2">
                  <ChevronRight className="w-4 h-4 text-amber-400 animate-pulse" />
                  <span className="text-white text-sm font-medium">Click for Details</span>
                </div>
              </div>
            </div>
          </>
        )}
      </div>
    </motion.div>
  );
};

export default EventCard;