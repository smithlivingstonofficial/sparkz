import React, { useState, useEffect } from 'react';
import { AnimatePresence } from 'framer-motion';

// Import the modular components (ActionButtons removed)
import Hero from '../features/hospitality/Hero';
import Tabs from '../features/hospitality/Tabs';
import InstructionsTab from '../features/hospitality/InstructionsTab';
import HowToReachTab from '../features/hospitality/HowToReachTab';
import AccommodationTab from '../features/hospitality/AccommodationTab';
import ContactsTab from '../features/hospitality/ContactsTab';
import FaqsTab from '../features/hospitality/FaqsTab';

const HospitalityPage = () => {
  const [activeTab, setActiveTab] = useState('instructions');
  const [isMobile, setIsMobile] = useState(false);

  useEffect(() => {
    const checkMobile = () => setIsMobile(window.innerWidth < 768);
    checkMobile();
    window.addEventListener('resize', checkMobile);
    return () => window.removeEventListener('resize', checkMobile);
  }, []);

  const renderTabContent = () => {
    switch (activeTab) {
      case 'instructions':
        return <InstructionsTab />;
      case 'how-to-reach':
        return <HowToReachTab />;
      case 'accommodation':
        return <AccommodationTab />;
      case 'contacts':
        return <ContactsTab />;
      case 'faqs':
        return <FaqsTab />;
      default:
        return null;
    }
  };

  return (
    <div className="min-h-screen pt-20 pb-24 relative bg-black overflow-hidden text-white">
      {/* Cool Animated Background Elements */}
      <div className="fixed inset-0 z-0 pointer-events-none">
        <div className="absolute top-[-10%] left-[-10%] w-[500px] h-[500px] bg-amber-600/10 rounded-full blur-[100px] animate-pulse" />
        <div className="absolute bottom-[-10%] right-[-10%] w-[500px] h-[500px] bg-red-600/10 rounded-full blur-[100px] animate-pulse" style={{ animationDelay: '1s' }} />
        <div className="absolute top-[40%] left-[50%] transform -translate-x-1/2 -translate-y-1/2 w-[800px] h-[800px] bg-gradient-to-b from-transparent to-black/80 z-10" />
      </div>

      <div className="relative z-10">
        <Hero />
        <Tabs activeTab={activeTab} setActiveTab={setActiveTab} isMobile={isMobile} />

        <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
          <AnimatePresence mode="wait">
            {renderTabContent()}
          </AnimatePresence>
        </main>
      </div>
    </div>
  );
};

export default HospitalityPage;