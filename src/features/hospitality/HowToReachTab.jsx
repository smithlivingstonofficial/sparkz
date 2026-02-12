import React from 'react';
import { motion } from 'framer-motion';
import { MapPin, Bus, Train, Plane, Navigation, ExternalLink } from 'lucide-react';

const HowToReachTab = () => {
  const googleMapsUrl = "https://www.google.com/maps/dir//Kalasalingam+Academy+of+Research+and+Education,+Krishnankoil,+Tamil+Nadu+626126";

  const travelModes = [
    {
      icon: <Bus className="w-8 h-8 text-amber-400" />,
      title: "By Bus",
      desc: "The college is situated at Krishnankoil, on the Madurai-Shencottah National Highway (NH 744). Buses between Madurai and Rajapalayam/Courtallam stop right in front of the campus entrance.",
      stops: ["Krishnankoil Bus Stop (0 km)", "Madurai Mattuthavani (65 km)"]
    },
    {
      icon: <Train className="w-8 h-8 text-amber-400" />,
      title: "By Train",
      desc: "The nearest railway station is Srivilliputtur (SVPR). However, Virudhunagar Junction (VPT) and Madurai Junction (MDU) are major hubs with better connectivity from all over India.",
      stops: ["Srivilliputtur Station (11 km)", "Virudhunagar Junction (25 km)"]
    },
    {
      icon: <Plane className="w-8 h-8 text-amber-400" />,
      title: "By Flight",
      desc: "The nearest airport is Madurai International Airport (IXM). You can hire a taxi or take a bus from Madurai to reach the campus (approx. 1.5 hours travel time).",
      stops: ["Madurai Airport (60 km)", "Trivandrum Airport (130 km)"]
    }
  ];

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: -20 }}
      transition={{ duration: 0.3 }}
      className="max-w-6xl mx-auto space-y-12"
    >
      {/* Introduction */}
      <div className="text-center max-w-2xl mx-auto">
        <h2 className="text-3xl font-bold text-white font-['Cinzel'] mb-4">Route Map</h2>
        <p className="text-white/60">
          Kalasalingam Academy of Research and Education is located in a scenic campus along the Western Ghats. Here is how you can reach us.
        </p>
      </div>

      {/* Map Section */}
      <div className="relative group rounded-3xl overflow-hidden border border-amber-500/20 shadow-2xl bg-[#0a0a0a]">
        
        {/* Map Header Overlay */}
        <div className="absolute top-0 left-0 right-0 bg-gradient-to-b from-black/90 to-transparent p-4 z-10 flex items-center justify-between pointer-events-none">
          {/* Label */}
          <div className="flex items-center gap-2">
            <div className="p-2 bg-amber-500/20 backdrop-blur-md rounded-full text-amber-400">
              <Navigation className="w-5 h-5" />
            </div>
            <span className="text-white/90 font-['Rajdhani'] font-bold tracking-wide text-sm hidden sm:inline">LIVE LOCATION</span>
          </div>

          {/* Get Directions Button (Pointer events enabled for button) */}
          <a 
            href={googleMapsUrl}
            target="_blank"
            rel="noopener noreferrer"
            className="pointer-events-auto flex items-center gap-2 px-4 py-2 bg-gradient-to-r from-amber-600 to-red-600 text-white font-bold text-sm rounded-full shadow-lg hover:shadow-amber-500/20 hover:scale-105 transition-all duration-300"
          >
            <span>Get Directions</span>
            <ExternalLink className="w-4 h-4" />
          </a>
        </div>

        {/* Google Map Iframe */}
        <div className="w-full h-[400px] md:h-[500px] bg-gray-900">
          <iframe 
            src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d7602.092654326299!2d77.6800524!3d9.5748596!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x3b06dbc06968e9eb%3A0x6cfd8f94e42f98c4!2sKalasalingam%20Academy%20of%20Research%20and%20Education!5e1!3m2!1sen!2sin!4v1770888102825!5m2!1sen!2sin"
            width="100%" 
            height="100%" 
            style={{ border: 0, filter: 'grayscale(0.2) contrast(1.1)' }} 
            allowFullScreen="" 
            loading="lazy" 
            referrerPolicy="no-referrer-when-downgrade"
            title="Kalasalingam Academy Location"
            className="w-full h-full"
          />
        </div>
      </div>

      {/* Travel Modes Grid */}
      <div className="grid md:grid-cols-3 gap-6">
        {travelModes.map((mode, index) => (
          <div 
            key={index} 
            className="bg-white/5 border border-white/10 p-6 rounded-2xl hover:bg-white/10 hover:border-amber-500/30 transition-all duration-300 group"
          >
            <div className="mb-4 p-3 bg-black/50 rounded-xl inline-block border border-white/10 group-hover:border-amber-500/50 group-hover:text-amber-400 transition-colors">
              {mode.icon}
            </div>
            
            <h3 className="text-xl font-bold text-white mb-3 font-['Rajdhani']">{mode.title}</h3>
            <p className="text-white/60 text-sm leading-relaxed mb-6 h-auto min-h-[5rem]">
              {mode.desc}
            </p>
            
            <div className="space-y-2 pt-4 border-t border-white/5">
              <div className="text-xs text-amber-500 font-bold uppercase tracking-wider mb-2">Nearest Stops</div>
              {mode.stops.map((stop, i) => (
                <div key={i} className="flex items-center gap-2 text-sm text-gray-300">
                  <MapPin className="w-3 h-3 text-white/40" />
                  <span>{stop}</span>
                </div>
              ))}
            </div>
          </div>
        ))}
      </div>

    </motion.div>
  );
};

export default HowToReachTab;