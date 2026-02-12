import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Plus, Minus, HelpCircle } from 'lucide-react';

const FaqsTab = () => {
  const [activeIndex, setActiveIndex] = useState(null);

  const faqs = [
    { 
      q: 'What is included in the accommodation package?', 
      a: 'The package includes comfortable lodging, meals, 24/7 security surveillance, and access to basic amenities like restrooms and Wi-Fi.' 
    },
    { 
      q: 'How do I book accommodation?', 
      a: 'You can book accommodation directly at the registration desk situated near the main entrance gate upon your arrival.' 
    },
    { 
      q: 'What are the check-in/check-out timings?', 
      a: 'Check-in begins at 2:00 PM on day one, and check-out must be completed by 11:00 AM on the final day of the event.' 
    },
    { 
      q: 'Is transportation provided from stations/airport?', 
      a: 'No, transport will not be provided by the organizers. Participants are requested to arrange their own travel to the campus.' 
    },
  ];

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      className="max-w-3xl mx-auto"
    >
      <div className="text-center mb-10">
        <div className="inline-flex items-center justify-center p-3 bg-amber-500/10 rounded-full mb-4">
            <HelpCircle className="w-8 h-8 text-amber-400" />
        </div>
        <h2 className="text-3xl font-bold text-white font-['Cinzel']">Frequently Asked Questions</h2>
      </div>

      <div className="space-y-4">
        {faqs.map((faq, index) => (
          <div 
            key={index}
            className={`border rounded-xl transition-all duration-300 overflow-hidden ${
              activeIndex === index 
                ? 'bg-white/10 border-amber-500/40 shadow-[0_0_15px_rgba(245,158,11,0.1)]' 
                : 'bg-white/5 border-white/10 hover:border-white/20'
            }`}
          >
            <button
              onClick={() => setActiveIndex(activeIndex === index ? null : index)}
              className="w-full flex items-center justify-between p-5 text-left"
            >
              <span className={`font-medium text-lg font-['Rajdhani'] ${
                activeIndex === index ? 'text-amber-400' : 'text-white'
              }`}>
                {faq.q}
              </span>
              <span className={`p-1 rounded-full border transition-colors ${
                activeIndex === index 
                  ? 'bg-amber-500 border-amber-500 text-black' 
                  : 'border-white/20 text-white/50'
              }`}>
                {activeIndex === index ? <Minus className="w-4 h-4" /> : <Plus className="w-4 h-4" />}
              </span>
            </button>

            <AnimatePresence>
              {activeIndex === index && (
                <motion.div
                  initial={{ height: 0, opacity: 0 }}
                  animate={{ height: 'auto', opacity: 1 }}
                  exit={{ height: 0, opacity: 0 }}
                  transition={{ duration: 0.3, ease: "easeInOut" }}
                >
                  <div className="px-5 pb-5 pt-0">
                    <p className="text-gray-300 leading-relaxed text-sm md:text-base border-t border-white/10 pt-4">
                      {faq.a}
                    </p>
                  </div>
                </motion.div>
              )}
            </AnimatePresence>
          </div>
        ))}
      </div>
    </motion.div>
  );
};

export default FaqsTab;