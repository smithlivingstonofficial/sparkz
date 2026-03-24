import React, { useLayoutEffect, useRef, useState } from 'react';
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import { motion } from 'framer-motion';
import { Search, Filter, X, Maximize2, Pin } from 'lucide-react';

const EventsPinboard = () => {
  const containerRef = useRef(null);
  const pinboardRef = useRef(null);
  const [selectedEvent, setSelectedEvent] = useState(null);
  const [filter, setFilter] = useState('all');
  const [searchQuery, setSearchQuery] = useState('');

  const events = [
    { 
      id: 1, 
      title: 'Rock Symphony', 
      category: 'music', 
      date: 'OCT 15', 
      status: 'upcoming',
      image: '/events/rock.jpg',
      description: 'Battle of the bands with legendary performances',
      tags: ['Live Music', 'Competition', 'Night Event']
    },
    { 
      id: 2, 
      title: 'Fashion Extravaganza', 
      category: 'fashion', 
      date: 'OCT 16', 
      status: 'active',
      image: '/events/fashion.jpg',
      description: 'Runway show featuring top designers',
      tags: ['Runway', 'Design', 'Showcase']
    },
    // Add more events...
  ];

  useLayoutEffect(() => {
    const ctx = gsap.context(() => {
      // Pinboard tilt effect on mouse move
      const pinboard = pinboardRef.current;
      
      const handleMouseMove = (e) => {
        const { left, top, width, height } = pinboard.getBoundingClientRect();
        const x = (e.clientX - left) / width;
        const y = (e.clientY - top) / height;
        
        gsap.to(pinboard, {
          rotationY: (x - 0.5) * 2,
          rotationX: -(y - 0.5) * 2,
          transformPerspective: 1000,
          ease: 'power2.out',
          duration: 0.5
        });
      };

      pinboard.addEventListener('mousemove', handleMouseMove);
      
      return () => {
        pinboard.removeEventListener('mousemove', handleMouseMove);
      };
    }, containerRef);

    return () => ctx.revert();
  }, []);

  return (
    <section ref={containerRef} className="relative w-full min-h-screen bg-gradient-to-b from-[#0a0a0a] to-[#1a1a1a] py-20 overflow-hidden">
      
      {/* Evidence Board Background */}
      <div className="absolute inset-0 bg-[url('/images/wood-texture.jpg')] opacity-10"></div>
      
      {/* Animated String Lines */}
      <div className="absolute inset-0">
        {[...Array(8)].map((_, i) => (
          <div
            key={i}
            className="absolute w-[1px] h-full bg-gradient-to-b from-transparent via-amber-300/20 to-transparent"
            style={{ left: `${(i + 1) * 12.5}%` }}
          ></div>
        ))}
      </div>

      <div className="relative max-w-7xl mx-auto px-6">
        
        {/* Header */}
        <div className="text-center mb-16">
          <div className="inline-flex items-center gap-3 mb-4">
            <Pin className="w-6 h-6 text-red-500 animate-pulse" />
            <h2 className="font-['Cinzel'] text-4xl md:text-6xl text-white uppercase tracking-tight">
              Evidence <span className="text-amber-400">Pinboard</span>
            </h2>
          </div>
          <p className="text-white/60 font-mono text-sm tracking-widest">
            INVESTIGATE EVENTS • CONNECT CLUES • UNCOVER STORIES
          </p>
        </div>

        {/* Filters & Search */}
        <div className="sticky top-6 z-30 mb-12 p-6 bg-black/50 backdrop-blur-sm border border-white/10 rounded-2xl">
          <div className="flex flex-col md:flex-row gap-4 items-center justify-between">
            <div className="flex items-center gap-2 flex-wrap">
              <button
                onClick={() => setFilter('all')}
                className={`px-4 py-2 rounded-full text-sm font-medium transition-all ${
                  filter === 'all'
                    ? 'bg-amber-500 text-black'
                    : 'bg-white/5 text-white/70 hover:bg-white/10'
                }`}
              >
                All Events
              </button>
              {['music', 'fashion', 'art', 'tech', 'sports'].map(cat => (
                <button
                  key={cat}
                  onClick={() => setFilter(cat)}
                  className={`px-4 py-2 rounded-full text-sm font-medium capitalize transition-all ${
                    filter === cat
                      ? 'bg-red-500 text-white'
                      : 'bg-white/5 text-white/70 hover:bg-white/10'
                  }`}
                >
                  {cat}
                </button>
              ))}
            </div>
            
            <div className="relative w-full md:w-auto">
              <Search className="absolute left-4 top-1/2 transform -translate-y-1/2 w-5 h-5 text-white/40" />
              <input
                type="text"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                placeholder="Search evidence..."
                className="w-full md:w-64 pl-12 pr-4 py-3 bg-black/30 border border-white/10 rounded-full text-white placeholder-white/40 focus:outline-none focus:border-amber-500/50"
              />
            </div>
          </div>
        </div>

        {/* Pinboard Grid */}
        <div 
          ref={pinboardRef}
          className="relative bg-gradient-to-br from-amber-950/20 via-black/30 to-red-950/20 border border-amber-900/30 rounded-3xl p-8 backdrop-blur-sm min-h-[800px]"
        >
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {events.map(event => (
              <motion.div
                key={event.id}
                initial={{ opacity: 0, scale: 0.8 }}
                whileInView={{ opacity: 1, scale: 1 }}
                viewport={{ once: true }}
                whileHover={{ y: -10 }}
                className="group cursor-pointer"
                onClick={() => setSelectedEvent(event)}
              >
                <div className="relative bg-gradient-to-br from-black/80 to-gray-900/80 border border-amber-900/30 rounded-2xl overflow-hidden hover:border-amber-500/50 transition-all duration-300">
                  
                  {/* Polaroid-like styling */}
                  <div className="p-4 bg-white/5">
                    <div className="aspect-video rounded-lg overflow-hidden mb-4 relative">
                      <img 
                        src={event.image} 
                        alt={event.title}
                        className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500"
                      />
                      <div className="absolute inset-0 bg-gradient-to-t from-black/50 via-transparent to-transparent"></div>
                      
                      {/* Status Badge */}
                      <div className={`absolute top-3 right-3 px-3 py-1 rounded-full text-xs font-bold ${
                        event.status === 'active' 
                          ? 'bg-green-500/20 text-green-300 border border-green-500/30'
                          : 'bg-amber-500/20 text-amber-300 border border-amber-500/30'
                      }`}>
                        {event.status === 'active' ? 'LIVE' : 'UPCOMING'}
                      </div>
                    </div>
                    
                    <div className="p-4">
                      <div className="flex items-center justify-between mb-2">
                        <h3 className="font-['Cinzel'] text-xl text-white">{event.title}</h3>
                        <span className="font-mono text-sm text-amber-400 bg-amber-400/10 px-3 py-1 rounded-full">
                          {event.date}
                        </span>
                      </div>
                      
                      <p className="text-white/60 text-sm mb-4 line-clamp-2">
                        {event.description}
                      </p>
                      
                      <div className="flex flex-wrap gap-2">
                        {event.tags.map(tag => (
                          <span 
                            key={tag}
                            className="px-2 py-1 text-xs bg-white/5 text-white/60 rounded-md"
                          >
                            {tag}
                          </span>
                        ))}
                      </div>
                    </div>
                  </div>
                  
                  {/* Pin at the top */}
                  <div className="absolute -top-2 left-1/2 transform -translate-x-1/2">
                    <div className="w-4 h-4 bg-gradient-to-br from-amber-400 to-amber-600 rounded-full shadow-lg"></div>
                    <div className="absolute top-1/2 left-1/2 w-2 h-2 bg-amber-200 rounded-full"></div>
                  </div>
                </div>
              </motion.div>
            ))}
          </div>
          
          {/* Red String Connections */}
          <div className="absolute inset-0 pointer-events-none">
            <svg className="w-full h-full">
              {/* Add SVG paths for string connections between events */}
              <path 
                d="M100,100 Q250,150 400,100" 
                stroke="rgba(220,38,38,0.3)" 
                strokeWidth="1" 
                fill="none"
                strokeDasharray="5,5"
              />
            </svg>
          </div>
        </div>
      </div>

      {/* Event Modal */}
      {selectedEvent && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-6 bg-black/80 backdrop-blur-sm">
          <motion.div
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            className="relative max-w-4xl w-full bg-gradient-to-br from-gray-900 to-black border border-amber-500/30 rounded-3xl overflow-hidden"
          >
            <button
              onClick={() => setSelectedEvent(null)}
              className="absolute top-4 right-4 z-10 p-2 bg-black/50 rounded-full hover:bg-black/80 transition-colors"
            >
              <X className="w-5 h-5 text-white" />
            </button>
            
            <div className="p-8">
              {/* Modal content */}
              <div className="aspect-video rounded-xl overflow-hidden mb-6">
                <img 
                  src={selectedEvent.image} 
                  alt={selectedEvent.title}
                  className="w-full h-full object-cover"
                />
              </div>
              
              <h3 className="font-['Cinzel'] text-3xl text-white mb-4">
                {selectedEvent.title}
              </h3>
              
              <p className="text-white/80 mb-6">
                {selectedEvent.description}
              </p>
              
              <div className="flex gap-4">
                <button className="px-6 py-3 bg-gradient-to-r from-amber-600 to-red-600 text-white rounded-full font-bold hover:shadow-lg hover:shadow-red-500/30 transition-all">
                  Register Now
                </button>
                <button className="px-6 py-3 border border-white/20 text-white rounded-full hover:bg-white/10 transition-colors">
                  Add to Calendar
                </button>
              </div>
            </div>
          </motion.div>
        </div>
      )}
    </section>
  );
};

export default EventsPinboard;