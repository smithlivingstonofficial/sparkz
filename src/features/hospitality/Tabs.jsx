import React, { useRef, useEffect } from 'react';
import { motion } from 'framer-motion';
import { Shield, MapPin, Bed, Phone, HelpCircle } from 'lucide-react';

const Tabs = ({ activeTab, setActiveTab }) => {
  const scrollRef = useRef(null);

  const tabs = [
    { id: 'instructions', label: 'Instructions', icon: <Shield className="w-4 h-4 md:w-5 md:h-5" /> },
    { id: 'how-to-reach', label: 'How to Reach', icon: <MapPin className="w-4 h-4 md:w-5 md:h-5" /> },
    { id: 'accommodation', label: 'Accommodation', icon: <Bed className="w-4 h-4 md:w-5 md:h-5" /> },
    { id: 'contacts', label: 'Contacts', icon: <Phone className="w-4 h-4 md:w-5 md:h-5" /> },
    { id: 'faqs', label: 'FAQ\'s', icon: <HelpCircle className="w-4 h-4 md:w-5 md:h-5" /> },
  ];

  // Auto-scroll the active tab into view on mobile
  useEffect(() => {
    if (scrollRef.current) {
      const activeElement = scrollRef.current.querySelector(`[data-active="true"]`);
      if (activeElement) {
        activeElement.scrollIntoView({
          behavior: 'smooth',
          block: 'nearest',
          inline: 'center'
        });
      }
    }
  }, [activeTab]);

  return (
    // Sticky container so tabs are always accessible while reading content
    <div className="sticky top-20 z-30 w-full bg-black/80 backdrop-blur-md border-b border-white/10 shadow-lg">
      <div className="max-w-7xl mx-auto">
        {/* Scrollable Container */}
        <div 
          ref={scrollRef}
          className="flex overflow-x-auto no-scrollbar py-3 px-4 md:justify-center md:px-0 scroll-smooth"
          style={{ 
            scrollbarWidth: 'none',  /* Firefox */
            msOverflowStyle: 'none'  /* IE/Edge */
          }}
        >
          {/* Flex Container with gap */}
          <div className="flex gap-2 md:gap-4 min-w-max">
            {tabs.map((tab) => {
              const isActive = activeTab === tab.id;
              
              return (
                <button
                  key={tab.id}
                  data-active={isActive}
                  onClick={() => setActiveTab(tab.id)}
                  className={`
                    relative flex items-center gap-2 px-4 py-2.5 rounded-full transition-all duration-300 flex-shrink-0
                    ${isActive ? 'text-black font-bold' : 'text-white/60 hover:text-white font-medium'}
                  `}
                >
                  {/* Active Background Animation */}
                  {isActive && (
                    <motion.div
                      layoutId="activeTab"
                      className="absolute inset-0 bg-gradient-to-r from-amber-400 to-orange-500 rounded-full"
                      transition={{ type: "spring", bounce: 0.2, duration: 0.6 }}
                    />
                  )}

                  {/* Icon & Label (z-10 to sit on top of background) */}
                  <span className="relative z-10 flex-shrink-0">
                    {tab.icon}
                  </span>
                  
                  {/* whitespace-nowrap prevents "Accommodation" from breaking lines */}
                  <span className="relative z-10 text-sm md:text-base whitespace-nowrap">
                    {tab.label}
                  </span>
                </button>
              );
            })}
          </div>
        </div>
      </div>
      
      {/* Hide scrollbar for Chrome/Safari/Webkit */}
      <style jsx>{`
        .no-scrollbar::-webkit-scrollbar {
          display: none;
        }
      `}</style>
    </div>
  );
};

export default Tabs;