// features/proshow/ProShowCard.jsx
import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { 
  Calendar, Clock, MapPin, Ticket, Sparkles, 
  Users, Award, Crown, Star, Heart, 
  Share2, Bookmark, Zap, Music, Mic,
  Headphones, Guitar, Theater, Eye
} from 'lucide-react';

const ProShowCard = ({ 
  event, 
  isMobile, 
  setSelectedEvent, 
  setHoveredCard, 
  isHovered
}) => {
  // Get category icon based on event category
  const getCategoryIcon = (category) => {
    const iconMap = {
      'concert': Music,
      'comedy': Mic,
      'dance': Sparkles,
      'dj': Headphones,
      'band': Guitar,
      'celebrity': Star,
      'performance': Theater,
      'default': Crown
    };
    return iconMap[category?.toLowerCase()] || iconMap.default;
  };

  const CategoryIcon = getCategoryIcon(event.category);
  const [isLiked, setIsLiked] = useState(false);
  const [isBookmarked, setIsBookmarked] = useState(false);

  // Premium color schemes
  const getPremiumColor = (category) => {
    const colors = {
      'concert': { gradient: 'from-purple-600 to-pink-600', bg: 'bg-purple-500/10', text: 'text-purple-400', border: 'border-purple-500/30' },
      'comedy': { gradient: 'from-amber-600 to-orange-600', bg: 'bg-amber-500/10', text: 'text-amber-400', border: 'border-amber-500/30' },
      'dance': { gradient: 'from-blue-600 to-cyan-600', bg: 'bg-blue-500/10', text: 'text-blue-400', border: 'border-blue-500/30' },
      'dj': { gradient: 'from-green-600 to-emerald-600', bg: 'bg-green-500/10', text: 'text-green-400', border: 'border-green-500/30' },
      'band': { gradient: 'from-red-600 to-rose-600', bg: 'bg-red-500/10', text: 'text-red-400', border: 'border-red-500/30' },
      'celebrity': { gradient: 'from-yellow-600 to-amber-600', bg: 'bg-yellow-500/10', text: 'text-yellow-400', border: 'border-yellow-500/30' },
      'performance': { gradient: 'from-indigo-600 to-purple-600', bg: 'bg-indigo-500/10', text: 'text-indigo-400', border: 'border-indigo-500/30' },
      'default': { gradient: 'from-amber-600 to-yellow-600', bg: 'bg-amber-500/10', text: 'text-amber-400', border: 'border-amber-500/30' }
    };
    return colors[category?.toLowerCase()] || colors.default;
  };

  const colors = getPremiumColor(event.category);

  // Animation variants
  const cardVariants = {
    hidden: { opacity: 0, y: 50, scale: 0.95 },
    visible: { 
      opacity: 1, 
      y: 0, 
      scale: 1,
      transition: { 
        type: "spring",
        stiffness: 100,
        damping: 15
      }
    },
    hover: { 
      y: isMobile ? 0 : -8,
      scale: isMobile ? 1 : 1.02,
      transition: { duration: 0.3 }
    },
    exit: { opacity: 0, scale: 0.9 }
  };

  // Handle card click to open modal
  const handleCardClick = () => {
    setSelectedEvent(event);
  };

  // Handle button clicks
  const handleButtonClick = (e, action) => {
    e.stopPropagation();
    switch(action) {
      case 'like':
        setIsLiked(!isLiked);
        break;
      case 'bookmark':
        setIsBookmarked(!isBookmarked);
        break;
      default:
        break;
    }
  };

  // Handle share
  const handleShare = (e) => {
    e.stopPropagation();
    if (navigator.share) {
      navigator.share({
        title: event.title,
        text: event.tagline,
        url: window.location.href,
      });
    } else {
      navigator.clipboard.writeText(`${event.title} - ${event.tagline}`);
      alert('Event link copied to clipboard!');
    }
  };

  return (
    <motion.div
      layout
      variants={cardVariants}
      initial="hidden"
      animate="visible"
      exit="exit"
      whileHover="hover"
      onMouseEnter={() => !isMobile && setHoveredCard(event.id)}
      onMouseLeave={() => !isMobile && setHoveredCard(null)}
      className="relative cursor-pointer group premium-card"
      onClick={handleCardClick}
    >
      {/* Main Card Container */}
      <div className="relative overflow-hidden rounded-xl md:rounded-2xl transition-all duration-500 will-change-transform h-full min-h-[380px] border border-amber-500/20">
        {/* Background with gradient or image */}
        <div className="absolute inset-0 z-0 overflow-hidden">
          {event.image ? (
            <motion.div
              className="absolute inset-0"
              style={{
                backgroundImage: `url(${event.image})`,
                backgroundSize: 'cover',
                backgroundPosition: 'center',
              }}
              animate={{
                scale: isHovered && !isMobile ? 1.1 : 1,
              }}
              transition={{ duration: 0.7 }}
            />
          ) : event.gradient ? (
            <div 
              className="absolute inset-0"
              style={{
                background: event.gradient,
              }}
            />
          ) : (
            <div 
              className={`absolute inset-0 bg-gradient-to-br ${colors.gradient} opacity-80`}
            />
          )}
          
          {/* Gradient Overlay */}
          <div className="absolute inset-0 bg-gradient-to-t from-black via-black/70 to-transparent" />
          <div className="absolute inset-0 bg-gradient-to-r from-black/30 via-transparent to-black/30" />
          
          {/* Gold Glitter Effect */}
          <div className="absolute inset-0 opacity-5">
            <div 
              className="absolute inset-0" 
              style={{
                backgroundImage: `radial-gradient(1px 1px at 10px 20px, rgba(255, 215, 0, 0.5), transparent),
                                  radial-gradient(1px 1px at 30px 40px, rgba(255, 215, 0, 0.5), transparent)`,
                backgroundSize: '50px 50px',
              }}
            />
          </div>
        </div>

        {/* Glassmorphism Overlay */}
        <div className="absolute inset-0 z-10 bg-gradient-to-b from-black/40 via-black/20 to-black/60 backdrop-blur-[1px]" />

        {/* Card Content */}
        <div className="relative z-20 h-full flex flex-col p-4 md:p-5">
          {/* Top Section */}
          <div className="flex justify-between items-start mb-3">
            {/* Day Badge */}
            <div className="px-3 py-1.5 bg-gradient-to-r from-black/80 to-black/60 backdrop-blur-sm rounded-full border border-amber-500/30 shadow-lg">
              <div className="flex items-center gap-2">
                <Calendar className="w-3 h-3 text-amber-300" />
                <span className="text-white text-xs font-bold">DAY {event.day}</span>
              </div>
            </div>

            {/* Right Side - Premium Badges */}
            <div className="flex items-center gap-1.5">
              {/* VIP Badge */}
              {event.ticketType === 'VIP' && (
                <div className="px-2 py-1 bg-gradient-to-r from-amber-600/90 to-yellow-600/90 backdrop-blur-sm rounded-full border border-amber-500/40 shadow-lg">
                  <div className="flex items-center gap-1">
                    <Crown className="w-3 h-3 text-white" />
                    <span className="text-white text-xs font-bold">VIP</span>
                  </div>
                </div>
              )}

              {/* Featured Badge */}
              {event.featured && (
                <div className="px-2 py-1 bg-gradient-to-r from-purple-600/90 to-pink-600/90 backdrop-blur-sm rounded-full border border-purple-500/40 shadow-lg">
                  <div className="flex items-center gap-1">
                    <Star className="w-3 h-3 text-white" />
                    <span className="text-white text-xs font-bold">FEATURED</span>
                  </div>
                </div>
              )}
            </div>
          </div>

          {/* Middle Section */}
          <div className="flex-1 flex flex-col justify-center mb-4">
            {/* Category */}
            <div className="mb-3">
              <div className="flex items-center gap-2 px-3 py-2 bg-black/50 backdrop-blur-sm rounded-lg border border-white/20 w-fit">
                <div className={`p-1.5 rounded-md ${colors.bg}`}>
                  <CategoryIcon className={`w-4 h-4 ${colors.text}`} />
                </div>
                <span className={`text-sm font-bold ${colors.text} uppercase tracking-wide`}>
                  {event.category}
                </span>
              </div>
            </div>

            {/* Title */}
            <h3 className="text-2xl md:text-3xl font-bold text-white mb-2 leading-tight line-clamp-2">
              {event.title}
            </h3>

            {/* Tagline */}
            <p className="text-amber-100/80 text-sm mb-3 font-medium line-clamp-2">
              {event.tagline}
            </p>

            {/* Divider */}
            <div className="w-16 h-0.5 bg-gradient-to-r from-amber-400 to-yellow-500 mb-3 shadow-lg" />

            {/* Quick Info Grid */}
            <div className="grid grid-cols-2 gap-2 mb-3">
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

              {/* Price */}
              <div className="flex items-center gap-2 p-2 bg-black/40 backdrop-blur-sm rounded-lg border border-white/10">
                <Ticket className="w-4 h-4 text-amber-300" />
                <div className="flex-1 min-w-0">
                  <div className="text-white text-xs font-medium">STARTING AT</div>
                  <div className="text-white text-sm font-bold truncate">{event.price}</div>
                </div>
              </div>
            </div>
          </div>

          {/* Bottom Section */}
          <div className="flex flex-col md:flex-row md:items-center justify-between gap-3">
            {/* Artist/Performer Info */}
            {event.artist && (
              <div className="flex items-center">
                <div className="text-white text-sm font-medium truncate">
                  Featuring: <span className="font-bold text-amber-300">{event.artist}</span>
                </div>
              </div>
            )}

            {/* Action Buttons */}
            <div className="flex items-center gap-2">
              {/* Book Now Button */}
              <button 
                onClick={(e) => e.stopPropagation()}
                className="px-4 py-2 bg-gradient-to-r from-amber-600 to-yellow-600 text-white font-bold rounded-lg shadow-lg active:scale-95 transition-transform flex items-center justify-center gap-2"
              >
                <Ticket className="w-4 h-4" />
                <span className="text-sm">Get VIP Pass</span>
              </button>

              {/* Desktop Only Actions */}
              {!isMobile && (
                <>
                  {/* Like Button */}
                  <button 
                    onClick={(e) => handleButtonClick(e, 'like')}
                    className={`p-2 rounded-lg border transition-all ${
                      isLiked 
                        ? 'bg-red-500/20 border-red-500/40 text-red-400' 
                        : 'bg-black/40 border-white/20 text-gray-400 hover:text-red-400'
                    }`}
                  >
                    <Heart className={`w-4 h-4 ${isLiked ? 'fill-current' : ''}`} />
                  </button>

                  {/* Bookmark Button */}
                  <button 
                    onClick={(e) => handleButtonClick(e, 'bookmark')}
                    className={`p-2 rounded-lg border transition-all ${
                      isBookmarked 
                        ? 'bg-amber-500/20 border-amber-500/40 text-amber-400' 
                        : 'bg-black/40 border-white/20 text-gray-400 hover:text-amber-400'
                    }`}
                  >
                    <Bookmark className={`w-4 h-4 ${isBookmarked ? 'fill-current' : ''}`} />
                  </button>
                </>
              )}
            </div>
          </div>
        </div>

        {/* Hover Effects */}
        {!isMobile && (
          <>
            {/* Hover Glow */}
            <div className="absolute inset-0 z-0 opacity-0 group-hover:opacity-100 transition-opacity duration-500 pointer-events-none">
              <div className="absolute inset-0 bg-gradient-to-r from-amber-500/5 via-transparent to-yellow-500/5" />
            </div>

            {/* Click Indicator */}
            <div className="absolute inset-0 z-20 opacity-0 group-hover:opacity-100 transition-opacity duration-300 pointer-events-none">
              <div className="absolute bottom-4 right-4 px-3 py-1 bg-black/80 backdrop-blur-sm rounded-full border border-amber-500/30">
                <div className="flex items-center gap-2">
                  <Eye className="w-3 h-3 text-amber-300" />
                  <span className="text-amber-300 text-xs">VIP Details</span>
                </div>
              </div>
            </div>
          </>
        )}

        {/* Gold Border Glow */}
        <div className="absolute inset-0 border-2 border-transparent group-hover:border-amber-500/30 transition-all duration-500 rounded-xl pointer-events-none" />
      </div>

      {/* Mobile Quick Actions */}
      {isMobile && (
        <div className="mt-2 flex items-center justify-between gap-2">
          <button 
            onClick={(e) => handleButtonClick(e, 'like')}
            className={`flex-1 py-2 rounded-lg border flex items-center justify-center gap-1.5 ${
              isLiked 
                ? 'bg-red-500/20 border-red-500/40 text-red-400' 
                : 'bg-black/40 border-white/20 text-gray-400'
            }`}
          >
            <Heart className={`w-4 h-4 ${isLiked ? 'fill-current' : ''}`} />
            <span className="text-xs">Like</span>
          </button>
          
          <button 
            onClick={(e) => handleButtonClick(e, 'bookmark')}
            className={`flex-1 py-2 rounded-lg border flex items-center justify-center gap-1.5 ${
              isBookmarked 
                ? 'bg-amber-500/20 border-amber-500/40 text-amber-400' 
                : 'bg-black/40 border-white/20 text-gray-400'
            }`}
          >
            <Bookmark className={`w-4 h-4 ${isBookmarked ? 'fill-current' : ''}`} />
            <span className="text-xs">Save</span>
          </button>
          
          <button 
            onClick={handleShare}
            className="flex-1 py-2 rounded-lg border border-white/20 bg-black/40 flex items-center justify-center gap-1.5 text-gray-400"
          >
            <Share2 className="w-4 h-4" />
            <span className="text-xs">Share</span>
          </button>
        </div>
      )}

      <style jsx>{`
        .line-clamp-2 {
          display: -webkit-box;
          -webkit-line-clamp: 2;
          -webkit-box-orient: vertical;
          overflow: hidden;
        }
      `}</style>
    </motion.div>
  );
};

export default ProShowCard;