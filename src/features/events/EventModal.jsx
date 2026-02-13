import React, { useRef, useEffect, useState } from 'react';
import { motion } from 'framer-motion';
import { 
  X, Ticket, Bookmark, Calendar, Clock, 
  MapPin, Users, Sparkles, Award, Phone,
  Shield, CheckCircle, MapPin as Location,
  ExternalLink, Share2, Download, ChevronDown,
  Smartphone, Globe, CreditCard, UserCheck,
  MessageCircle, FileText, Users as UsersIcon,
  Mail, MessageSquare, Music, Palette, Theater,
  Camera, Video, Film, Trophy, Zap, BookOpen
} from 'lucide-react';

// Import icons for different categories
const categoryIcons = {
  'music': Music,
  'drama': Theater,
  'arts': Palette,
  'literary': BookOpen,
  'photo': Camera,
  'video': Video,
  'film': Film,
  'sports': Trophy,
  'dance': Zap,
  'gaming': Zap,
  'default': Sparkles
};

// WhatsApp icon component
const WhatsAppIcon = ({ className = "w-6 h-6" }) => (
  <svg 
    className={className}
    fill="currentColor"
    viewBox="0 0 24 24"
    xmlns="http://www.w3.org/2000/svg"
  >
    <path d="M17.507 14.307l-.009.075c-.405-2.202-1.889-4.099-4.445-4.099-2.996 0-5.435 2.471-5.435 5.505 0 1.157.345 2.23.937 3.126l.001.002a8.86 8.86 0 01-.396.579c-.097.134-.2.265-.307.392-1.012 1.208-2.247 2.165-3.55 2.937l.035-.021c.163.097.338.172.518.225.489.143 1.019.2 1.548.154 1.182-.101 2.292-.536 3.2-1.229.093-.07.184-.145.273-.224.165-.146.324-.3.476-.46.022-.022.044-.042.065-.064.197-.206.382-.424.553-.651.002-.002.004-.006.006-.008l-.002.002c.766-1.073 1.217-2.405 1.217-3.844 0-1.939-.987-3.646-2.489-4.65 1.583-.123 3.069.544 4.116 1.788 1.046 1.244 1.386 2.869.956 4.376zM12 22a9.959 9.959 0 01-5.033-1.356l-.361-.214-3.757.982.998-3.675-.236-.375a9.93 9.93 0 01-1.51-5.261C1.25 6.45 5.665 2 11 2s9.75 4.45 9.75 9.929S16.335 21.857 11 21.857c-.34 0-.678-.019-1.014-.057.34.039.678.058 1.014.058z"/>
  </svg>
);

const EventModal = ({ event, onClose }) => {
  if (!event) return null;
  
  // Get category icon
  const CategoryIcon = categoryIcons[event.category?.toLowerCase()] || categoryIcons.default;
  const modalRef = useRef(null);
  const contentRef = useRef(null);
  const [isScrolled, setIsScrolled] = useState(false);
  const [isMobile, setIsMobile] = useState(false);
  
  // Download links (these can be moved to event data if different per event)
  const brochureLink = "https://drive.google.com/file/d/1cHpO4dIxOPr079D_OzchG97O7wvHlQMn/view?usp=drivesdk";
  const ruleBookLink = "https://drive.google.com/file/d/1L0wOlq7aWcIrR1YJ87byyVQsufHFswwv/view?usp=drivesdk";
  
  useEffect(() => {
    const checkMobile = () => {
      setIsMobile(window.innerWidth < 768);
    };
    
    checkMobile();
    window.addEventListener('resize', checkMobile);
    
    return () => window.removeEventListener('resize', checkMobile);
  }, []);
  
  useEffect(() => {
    document.body.style.overflow = 'hidden';
    return () => {
      document.body.style.overflow = 'auto';
    };
  }, []);

  const handleContentScroll = () => {
    if (contentRef.current) {
      const scrollTop = contentRef.current.scrollTop;
      setIsScrolled(scrollTop > 20);
    }
  };

  // Handle WhatsApp join
  const handleJoinWhatsApp = () => {
    if (event.whatsapp) {
      window.open(event.whatsapp, '_blank', 'noopener,noreferrer');
    } else {
      alert('WhatsApp group link not available for this event');
    }
  };

  // Handle download
  const handleDownload = (type, url) => {
    const link = document.createElement('a');
    link.href = url;
    link.download = `${event.title}_${type}.pdf`;
    link.target = '_blank';
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  // Handle share
  const handleShare = () => {
    if (navigator.share) {
      navigator.share({
        title: event.title,
        text: event.tagline,
        url: window.location.href,
      });
    } else {
      navigator.clipboard.writeText(`${event.title} - ${event.tagline}\n${window.location.href}`);
      alert('Event link copied to clipboard!');
    }
  };

  // Get price from event or default
  const eventPrice = event.price;

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      data-lenis-prevent
      className="fixed inset-0 z-50 flex items-center justify-center p-2 sm:p-4"
      onClick={onClose}
    >
      <div className="absolute inset-0 bg-gradient-to-br from-black/98 via-purple-900/40 to-black/98 backdrop-blur-3xl" />
      <div className="absolute inset-0 bg-gradient-to-br from-amber-500/15 via-transparent to-red-500/15" />
      
      <motion.div
        ref={modalRef}
        initial={{ scale: 0.95, opacity: 0, y: 10 }}
        animate={{ scale: 1, opacity: 1, y: 0 }}
        exit={{ scale: 0.95, opacity: 0, y: 10 }}
        className="relative w-full h-full md:max-w-5xl md:h-[90vh] md:mx-auto rounded-2xl md:rounded-3xl overflow-hidden border border-white/20 shadow-2xl shadow-black/50"
        onClick={e => e.stopPropagation()}
        style={{ 
          background: event.image 
            ? `linear-gradient(rgba(15, 15, 15, 0.97), rgba(8, 8, 8, 0.99)), url(${event.image})`
            : (event.gradient || 'linear-gradient(135deg, rgba(30, 64, 175, 0.95), rgba(147, 51, 234, 0.85), rgba(30, 64, 175, 0.95))'),
          backgroundSize: 'cover',
          backgroundPosition: 'center'
        }}
      >
        <div className="absolute inset-0 bg-gradient-to-br from-black/90 via-black/80 to-black/90 backdrop-blur-2xl" />
        
        {/* Mobile Header */}
        {isMobile && (
          <div className="absolute top-4 left-4 right-4 z-30 flex items-center justify-between">
            <div className="flex items-center gap-2 px-3 py-1.5 bg-black/80 backdrop-blur-xl rounded-full border border-white/20">
              <CategoryIcon className="text-amber-300" size={14} />
              <span className="text-white text-xs font-bold uppercase">
                {event.category}
              </span>
            </div>
            
            <button
              onClick={onClose}
              className="p-2 bg-black/80 backdrop-blur-xl rounded-full text-white hover:bg-black/95 transition-all duration-300 border border-white/20"
            >
              <X size={20} />
            </button>
          </div>
        )}
        
        {/* Desktop Close Button */}
        {!isMobile && (
          <button
            onClick={onClose}
            className="absolute top-6 right-6 z-30 p-3 bg-black/80 backdrop-blur-xl rounded-full text-white hover:bg-black/95 transition-all duration-300 hover:scale-110 border border-white/20 shadow-lg group"
          >
            <X size={24} className="group-hover:rotate-90 transition-transform duration-300" />
          </button>
        )}
        
        {/* Scroll Indicator */}
        <motion.div 
          animate={{ opacity: isScrolled ? 0 : 1 }}
          className="absolute top-6 left-1/2 transform -translate-x-1/2 z-30 hidden md:block"
        >
          <div className="flex items-center gap-2 px-4 py-2 bg-black/80 backdrop-blur-md rounded-full border border-white/20 shadow-lg">
            <ChevronDown size={16} className="text-white/60 animate-bounce" />
            <span className="text-white/80 text-sm font-medium">Scroll for details</span>
          </div>
        </motion.div>

        {/* Scrollable Content */}
        <div 
          ref={contentRef}
          onScroll={handleContentScroll}
          className="relative z-10 h-full overflow-y-auto"
          style={{ WebkitOverflowScrolling: 'touch' }}
        >
          <div className="p-4 sm:p-6 md:p-10 pt-14 sm:pt-6">
            {/* Mobile Title Section */}
            {isMobile && (
              <div className="mb-6">
                <div className="flex flex-wrap items-center gap-2 mb-4">
                  <div className="px-3 py-1 bg-gradient-to-r from-amber-600/90 to-red-600/90 backdrop-blur-sm rounded-full">
                    <span className="text-white text-xs font-bold">DAY {event.day}</span>
                  </div>
                  
                  {event.featured && (
                    <div className="px-3 py-1 bg-gradient-to-r from-amber-600 to-red-600 rounded-full backdrop-blur-sm flex items-center gap-1">
                      <Sparkles size={10} className="text-white" />
                      <span className="text-white text-xs font-bold">FEATURED</span>
                    </div>
                  )}
                  
                  <div className="px-3 py-1 bg-black/80 backdrop-blur-sm rounded-full border border-white/20">
                    <span className="text-white text-xs font-medium">{event.eventMode}</span>
                  </div>
                </div>
                
                <h2 className="text-3xl font-bold font-['Cinzel'] text-white mb-2 leading-tight">
                  {event.title}
                </h2>
                
                <p className="text-lg text-amber-100 mb-6 font-medium">{event.tagline}</p>
              </div>
            )}

            {/* Desktop Header */}
            {!isMobile && (
              <div className="flex flex-col lg:flex-row gap-8 mb-8 md:mb-12">
                <div className="flex-1">
                  <div className="flex flex-wrap items-center gap-3 mb-6">
                    <div className="flex items-center gap-2 px-4 py-2 bg-black/80 backdrop-blur-xl rounded-full border border-white/20">
                      <CategoryIcon className="text-amber-300" size={18} />
                      <span className="text-white text-sm font-bold uppercase tracking-wider">
                        {event.category}
                      </span>
                    </div>
                    
                    <div className="px-4 py-2 bg-gradient-to-r from-amber-600/90 to-red-600/90 backdrop-blur-xl rounded-full">
                      <span className="text-white text-sm font-bold tracking-wider">{event.day}</span>
                    </div>
                    
                    {event.featured && (
                      <div className="px-4 py-2 bg-gradient-to-r from-amber-600 to-red-600 rounded-full backdrop-blur-xl flex items-center gap-2">
                        <Sparkles size={14} className="text-white" />
                        <span className="text-white text-sm font-bold">FEATURED</span>
                      </div>
                    )}
                    
                    <div className="px-4 py-2 bg-black/80 backdrop-blur-xl rounded-full border border-white/20">
                      <span className="text-white text-sm font-medium">{event.eventMode}</span>
                    </div>
                  </div>
                  
                  <h2 className="text-4xl md:text-5xl lg:text-6xl font-bold font-['Cinzel'] text-white mb-3 md:mb-4 leading-tight tracking-tight">
                    {event.title}
                  </h2>
                  
                  <p className="text-xl md:text-2xl text-amber-100 mb-6 md:mb-8 font-medium font-['Playfair_Display'] italic">
                    {event.tagline}
                  </p>
                </div>
              </div>
            )}

            {/* Main Content Layout */}
            <div className="flex flex-col lg:flex-row gap-6 md:gap-8">
              {/* Left Column - Main Content */}
              <div className="flex-1">
                {/* Price & Registration - Mobile version placed at top */}
                {isMobile && (
                  <div className="mb-6 bg-gradient-to-br from-amber-600/40 to-red-600/40 backdrop-blur-2xl p-5 rounded-2xl border border-amber-500/30 shadow-lg">
                    <div className="flex items-center justify-between mb-3">
                      <div>
                        <div className="text-white/80 text-sm mb-1 font-medium">REGISTRATION FEE</div>
                        <div className="text-white text-2xl font-bold">{eventPrice}</div>
                      </div>
                      <div className="flex items-center gap-2 px-3 py-1.5 bg-black/60 backdrop-blur-sm rounded-full">
                        <CreditCard size={16} className="text-amber-300" />
                        <span className="text-white text-xs">Online Payment</span>
                      </div>
                    </div>
                    
                    <button className="w-full py-3 bg-gradient-to-r from-amber-600 to-red-600 text-white font-bold rounded-xl hover:from-amber-700 hover:to-red-700 transition-all duration-300 flex items-center justify-center gap-2 mb-3 shadow-lg">
                      <Ticket size={18} />
                      REGISTER NOW
                    </button>
                    
                    <div className="flex items-center justify-center gap-4 text-xs text-white/60">
                      <div className="flex items-center gap-1">
                        <UserCheck size={12} />
                        <span>{event.seats || 'Limited'} seats</span>
                      </div>
                      <div className="flex items-center gap-1">
                        <Clock size={12} />
                        <span>Closes 24h before</span>
                      </div>
                    </div>
                  </div>
                )}

                {/* Quick Info Grid */}
                <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-3 gap-3 mb-6">
                  {[
                    { icon: Calendar, label: 'DATE', value: event.date, color: 'text-amber-300' },
                    { icon: Clock, label: 'TIME', value: event.time, color: 'text-amber-300' },
                    { icon: MapPin, label: 'VENUE', value: event.venue, color: 'text-amber-300' },
                    { icon: Shield, label: 'CLUB', value: event.club, color: 'text-amber-300' },
                    { icon: Users, label: 'SEATS', value: event.seats || 'Limited', color: 'text-amber-300' },
                    { icon: Award, label: 'TEAMS', value: event.participants || '50+ Teams', color: 'text-amber-300' },
                    { icon: Globe, label: 'MODE', value: event.eventMode, color: 'text-amber-300' },
                    ...(event.prizePool ? [{ icon: Award, label: 'PRIZE POOL', value: event.prizePool, color: 'text-amber-300' }] : [])
                  ].filter(Boolean).map((item, index) => (
                    <div 
                      key={index} 
                      className="bg-white/10 backdrop-blur-lg p-4 rounded-xl border border-white/15 hover:border-amber-500/30 transition-colors"
                    >
                      <div className="flex items-center gap-2 mb-2">
                        <item.icon className={`${item.color} size-4 sm:size-5`} />
                        <div className="text-white/70 text-xs sm:text-sm font-medium truncate">{item.label}</div>
                      </div>
                      <div className="text-white font-bold text-sm sm:text-base md:text-lg truncate">
                        {item.value}
                      </div>
                    </div>
                  ))}
                </div>

                {/* Event Description */}
                <div className="bg-black/60 backdrop-blur-xl p-6 rounded-2xl border border-white/15 mb-6">
                  <div className="flex items-center gap-3 mb-4">
                    <div className="w-3 h-8 bg-gradient-to-b from-amber-400 to-red-500 rounded-full"></div>
                    <h3 className="font-bold text-white text-xl">
                      EVENT DESCRIPTION
                    </h3>
                  </div>
                  <p className="text-white/85 leading-relaxed text-base md:text-lg">
                    {event.description || 'No description available.'}
                  </p>
                </div>

                {/* Event Coordinators */}
                <div className="bg-black/60 backdrop-blur-xl p-6 rounded-2xl border border-white/15 mb-6">
                  <div className="flex items-center gap-3 mb-4">
                    <div className="w-3 h-8 bg-gradient-to-b from-amber-400 to-red-500 rounded-full"></div>
                    <h3 className="font-bold text-white text-xl">
                      EVENT COORDINATORS
                    </h3>
                  </div>
                  <div className="space-y-4">
                    {event.eventCoordinators && event.eventCoordinators.length > 0 ? (
                      event.eventCoordinators.map((coordinator, idx) => {
                        const [name, phone] = coordinator.split(' - ');
                        return (
                          <div key={idx} className="flex items-center gap-4 bg-white/10 p-4 rounded-xl border border-white/10 hover:border-amber-500/30 transition-colors">
                            <div className="p-3 bg-amber-900/40 rounded-lg backdrop-blur-sm">
                              <Phone size={20} className="text-amber-300" />
                            </div>
                            <div className="flex-1 min-w-0">
                              <div className="text-white font-semibold text-lg truncate">
                                {name || coordinator}
                              </div>
                              {phone && (
                                <div className="text-amber-300 text-base font-mono mt-1 truncate">
                                  {phone}
                                </div>
                              )}
                            </div>
                            {phone && (
                              <button 
                                onClick={() => window.open(`tel:${phone}`, '_self')}
                                className="p-2 bg-white/10 hover:bg-white/20 rounded-lg transition-colors"
                              >
                                <Phone size={16} className="text-white" />
                              </button>
                            )}
                          </div>
                        );
                      })
                    ) : (
                      <p className="text-white/70 text-center py-4">No coordinators listed.</p>
                    )}
                  </div>
                </div>

                {/* Rules Section */}
                <div className="bg-black/60 backdrop-blur-xl p-6 rounded-2xl border border-white/15 mb-6">
                  <div className="flex items-center gap-3 mb-4">
                    <div className="w-3 h-8 bg-gradient-to-b from-amber-400 to-red-500 rounded-full"></div>
                    <h3 className="font-bold text-white text-xl">
                      EVENT RULES & GUIDELINES
                    </h3>
                  </div>
                  <div className="space-y-4">
                    {event.rules && event.rules.length > 0 ? (
                      event.rules.map((rule, idx) => (
                        <div key={idx} className="flex items-start gap-4 bg-white/5 p-4 rounded-xl border border-white/5">
                          <CheckCircle size={22} className="text-green-400 flex-shrink-0 mt-0.5" />
                          <p className="text-white/85 text-base">{rule}</p>
                        </div>
                      ))
                    ) : (
                      <p className="text-white/70 text-center py-4">No rules listed.</p>
                    )}
                  </div>
                </div>

                {/* Downloads Section - Mobile only (desktop version in sidebar) */}
                {isMobile && (
                  <>
                    {/* WhatsApp Group Join */}
                    {event.whatsapp && (
                      <div className="bg-gradient-to-r from-green-900/50 to-emerald-900/50 backdrop-blur-2xl p-6 rounded-2xl border border-green-500/40 mb-6">
                        <div className="flex items-center gap-3 mb-6">
                          <div className="p-2 bg-green-600/30 rounded-lg">
                            <MessageCircle className="text-green-300" size={24} />
                          </div>
                          <h3 className="font-bold text-white text-xl">
                            JOIN WHATSAPP GROUP
                          </h3>
                        </div>
                        <p className="text-white/80 mb-4">
                          Connect with other participants, get updates, and clarify doubts in our official WhatsApp group.
                        </p>
                        <button 
                          onClick={handleJoinWhatsApp}
                          className="w-full py-4 bg-gradient-to-r from-green-600 to-emerald-600 text-white font-bold rounded-xl hover:from-green-700 hover:to-emerald-700 transition-all duration-300 flex items-center justify-center gap-3 shadow-lg"
                        >
                          <MessageCircle className="w-6 h-6 text-white" />
                          <span>Join WhatsApp Group</span>
                        </button>
                      </div>
                    )}

                    {/* Download Materials */}
                    <div className="bg-gradient-to-r from-blue-900/50 to-purple-900/50 backdrop-blur-2xl p-6 rounded-2xl border border-blue-500/40 mb-6">
                      <div className="flex items-center gap-3 mb-6">
                        <div className="p-2 bg-blue-600/30 rounded-lg">
                          <Download className="text-blue-300" size={24} />
                        </div>
                        <h3 className="font-bold text-white text-xl">
                          DOWNLOAD MATERIALS
                        </h3>
                      </div>
                      <div className="space-y-4">
                        <button 
                          onClick={() => handleDownload('Brochure', brochureLink)}
                          className="w-full py-4 bg-gradient-to-r from-blue-600/40 to-blue-800/40 backdrop-blur-lg border border-blue-500/30 text-white rounded-xl hover:from-blue-700/40 hover:to-blue-900/40 transition-all duration-300 flex items-center justify-center gap-3"
                        >
                          <FileText className="text-blue-300" size={20} />
                          <span>Download Event Brochure</span>
                          <Download className="text-blue-300" size={16} />
                        </button>
                        <button 
                          onClick={() => handleDownload('RuleBook', ruleBookLink)}
                          className="w-full py-4 bg-gradient-to-r from-purple-600/40 to-purple-800/40 backdrop-blur-lg border border-purple-500/30 text-white rounded-xl hover:from-purple-700/40 hover:to-purple-900/40 transition-all duration-300 flex items-center justify-center gap-3"
                        >
                          <FileText className="text-purple-300" size={20} />
                          <span>Download Rule Book</span>
                          <Download className="text-purple-300" size={16} />
                        </button>
                      </div>
                    </div>
                  </>
                )}

                {/* Venue Details */}
                <div className="bg-gradient-to-r from-amber-900/50 to-red-900/50 backdrop-blur-2xl p-6 rounded-2xl border border-amber-500/40 mb-6">
                  <div className="flex items-center gap-3 mb-6">
                    <Location className="text-amber-300" size={24} />
                    <h3 className="font-bold text-white text-xl">
                      VENUE DETAILS
                    </h3>
                  </div>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div>
                      <div className="text-white/60 text-sm mb-2 uppercase tracking-wider">LOCATION</div>
                      <div className="text-white font-bold text-xl">
                        {event.venue || 'To be announced'}
                      </div>
                    </div>
                    <div>
                      <div className="text-white/60 text-sm mb-2 uppercase tracking-wider">ARRIVAL TIME</div>
                      <div className="text-white font-bold text-xl">
                        30 minutes before event starts
                      </div>
                    </div>
                  </div>
                  {event.venueInstructions && (
                    <div className="mt-6 pt-6 border-t border-amber-500/20">
                      <div className="text-white/60 text-sm mb-2 uppercase tracking-wider">SPECIAL INSTRUCTIONS</div>
                      <div className="text-white/90 text-base">
                        {event.venueInstructions}
                      </div>
                    </div>
                  )}
                </div>
              </div>

              {/* Right Column - Desktop Sidebar */}
              {!isMobile && (
                <div className="lg:w-80 space-y-6">
                  {/* Registration Card */}
                  <div className="bg-gradient-to-br from-amber-600/40 to-red-600/40 backdrop-blur-2xl p-8 rounded-3xl border border-amber-500/30 shadow-2xl">
                    <div className="flex items-center justify-between mb-4">
                      <div>
                        <div className="text-white/80 text-sm mb-2 font-medium uppercase tracking-wider">REGISTRATION FEE</div>
                        <div className="text-white text-4xl font-bold mb-2">{eventPrice}</div>
                      </div>
                      <div className="flex items-center gap-2 px-4 py-2 bg-black/60 backdrop-blur-sm rounded-full">
                        <CreditCard size={18} className="text-amber-300" />
                        <span className="text-white text-sm">Online Payment</span>
                      </div>
                    </div>
                    
                    <button className="w-full py-4 bg-gradient-to-r from-amber-600 to-red-600 text-white font-bold text-lg rounded-xl hover:from-amber-700 hover:to-red-700 transition-all duration-300 flex items-center justify-center gap-3 mb-4 shadow-lg">
                      <Ticket size={20} />
                      REGISTER NOW
                    </button>
                    
                    <div className="space-y-2 text-sm text-white/70">
                      <div className="flex items-center justify-between">
                        <span>Available Seats:</span>
                        <span className="font-bold text-white">{event.seats || 'Limited'}</span>
                      </div>
                      <div className="flex items-center justify-between">
                        <span>Registration Closes:</span>
                        <span className="font-bold text-white">24h before event</span>
                      </div>
                    </div>
                  </div>
                  
                  {/* WhatsApp Group Join */}
                  {event.whatsapp && (
                    <div className="bg-gradient-to-r from-green-900/50 to-emerald-900/50 backdrop-blur-2xl p-6 rounded-2xl border border-green-500/40 shadow-lg">
                      <div className="flex items-center gap-3 mb-4">
                        <div className="p-2 bg-green-600/30 rounded-lg">
                          <MessageCircle className="text-green-300" size={20} />
                        </div>
                        <h3 className="font-bold text-white text-lg">
                          WHATSAPP GROUP
                        </h3>
                      </div>
                      <p className="text-white/80 text-sm mb-4">
                        Join the official group for updates, discussions, and queries.
                      </p>
                      <button 
                        onClick={handleJoinWhatsApp}
                        className="w-full py-3 bg-gradient-to-r from-green-600 to-emerald-600 text-white font-bold rounded-xl hover:from-green-700 hover:to-emerald-700 transition-all duration-300 flex items-center justify-center gap-3 mb-2 shadow-lg"
                      >
                        <MessageCircle className="w-5 h-5 text-white" />
                        <span>Join Group</span>
                      </button>
                      <div className="flex items-center gap-2 text-xs text-white/60 mt-3">
                        <UsersIcon size={12} />
                        <span>Active participants: 50+</span>
                      </div>
                    </div>
                  )}
                  
                  {/* Download Materials */}
                  <div className="bg-gradient-to-r from-blue-900/50 to-purple-900/50 backdrop-blur-2xl p-6 rounded-2xl border border-blue-500/40 shadow-lg">
                    <div className="flex items-center gap-3 mb-4">
                      <div className="p-2 bg-blue-600/30 rounded-lg">
                        <Download className="text-blue-300" size={20} />
                      </div>
                      <h3 className="font-bold text-white text-lg">
                        DOWNLOAD
                      </h3>
                    </div>
                    <div className="space-y-3">
                      <button 
                        onClick={() => handleDownload('Brochure', brochureLink)}
                        className="w-full py-3 bg-gradient-to-r from-blue-600/40 to-blue-800/40 backdrop-blur-lg border border-blue-500/30 text-white rounded-xl hover:from-blue-700/40 hover:to-blue-900/40 transition-all duration-300 flex items-center justify-center gap-3"
                      >
                        <FileText className="text-blue-300" size={18} />
                        <span>Event Brochure</span>
                        <Download className="text-blue-300" size={14} />
                      </button>
                      <button 
                        onClick={() => handleDownload('RuleBook', ruleBookLink)}
                        className="w-full py-3 bg-gradient-to-r from-purple-600/40 to-purple-800/40 backdrop-blur-lg border border-purple-500/30 text-white rounded-xl hover:from-purple-700/40 hover:to-purple-900/40 transition-all duration-300 flex items-center justify-center gap-3"
                      >
                        <FileText className="text-purple-300" size={18} />
                        <span>Rule Book</span>
                        <Download className="text-purple-300" size={14} />
                      </button>
                    </div>
                  </div>
                  
                  {/* Additional Info Card */}
                  <div className="bg-black/60 backdrop-blur-lg p-6 rounded-2xl border border-white/15">
                    <div className="text-white/80 text-sm mb-4 font-medium uppercase tracking-wider">ADDITIONAL INFO</div>
                    <div className="space-y-3">
                      <div className="flex items-center justify-between">
                        <span className="text-white/70">Event Status:</span>
                        <span className="text-green-400 font-bold">Open</span>
                      </div>
                      <div className="flex items-center justify-between">
                        <span className="text-white/70">Category:</span>
                        <span className="text-white font-bold capitalize">{event.category}</span>
                      </div>
                      <div className="flex items-center justify-between">
                        <span className="text-white/70">Featured:</span>
                        <span className={`font-bold ${event.featured ? 'text-green-400' : 'text-gray-400'}`}>
                          {event.featured ? 'Yes' : 'No'}
                        </span>
                      </div>
                    </div>
                  </div>
                </div>
              )}

              
            </div>

            {/* Bottom Action Buttons */}
            <div className="mt-8 pt-8 border-t border-white/20">
              <div className="flex flex-col sm:flex-row gap-4 md:gap-6">
                <button className="flex-1 py-4 bg-gradient-to-r from-amber-600 to-red-600 text-white font-bold rounded-xl hover:from-amber-700 hover:to-red-700 transition-all duration-300 flex items-center justify-center gap-3 shadow-lg">
                  <Ticket size={22} />
                  <span className="text-lg md:text-xl">REGISTER NOW</span>
                </button>
                <button className="flex-1 py-4 bg-white/15 backdrop-blur-xl text-white font-bold rounded-xl hover:bg-white/25 transition-all duration-300 flex items-center justify-center gap-3 border border-white/20">
                  <Bookmark size={22} />
                  <span className="text-lg md:text-xl">ADD TO SCHEDULE</span>
                </button>
              </div>
            </div>

            {/* Footer Note */}
            <div className="mt-6 pb-8 text-center">
              <p className="text-white/50 text-sm italic">
                By registering, you agree to abide by all event rules and guidelines.
              </p>
            </div>
          </div>
        </div>
      </motion.div>
    </motion.div>
  );
};

export default EventModal;