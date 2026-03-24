import React from 'react';
import Hero from '../features/home/Hero';
import AboutSparkz from '../features/home/AboutSparkz';
import Leaders from '../features/home/LeadersSlider'; // Add this import

const HomePage = () => {
  return (
    <>
      {/* The Global Grain Overlay */}
      <div className="film-grain"></div>

      {/* Section 1: The Cinematic Intro */}
      <Hero />
      
      {/* Section 2: About SPARKZ */}
      <AboutSparkz />
      
      {/* Section 3: Visionary Leaders */}
      <Leaders /> {/* Add this line */}

      {/* Footer */}
      <footer className="w-full bg-black text-center p-10 text-xs text-white/20 font-mono border-t border-white/10">
        SPARKZ 2026 // END OF REEL // KALASALINGAM ACADEMY OF RESEARCH AND EDUCATION
      </footer>
    </>
  );
};

export default HomePage;