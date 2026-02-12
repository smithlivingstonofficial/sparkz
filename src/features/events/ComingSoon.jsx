import React from 'react';
import { Film, Bookmark } from 'lucide-react';

const ComingSoon = ({ isMobile }) => {
  const upcomingEvents = [
    { title: 'STAR WARS', date: 'DEC 2026', color: 'from-blue-600/20 to-purple-600/20' },
    { title: 'MARVEL UNIVERSE', date: 'JAN 2027', color: 'from-red-600/20 to-amber-600/20' },
    { title: 'DC LEGENDS', date: 'FEB 2027', color: 'from-gray-600/20 to-slate-600/20' },
    { title: 'ANIME FEST', date: 'MAR 2027', color: 'from-pink-600/20 to-rose-600/20' },
  ];

  return (
    <div className="mt-12 md:mt-20">
      <div className="flex items-center gap-4 mb-6 md:mb-8">
        <div className="h-px flex-1 bg-gradient-to-r from-transparent via-amber-500/50 to-transparent"></div>
        <h2 className="text-xl md:text-2xl lg:text-3xl font-bold font-['Cinzel'] text-white text-center">
          COMING SOON
        </h2>
        <div className="h-px flex-1 bg-gradient-to-r from-transparent via-red-500/50 to-transparent"></div>
      </div>

      <div className="grid grid-cols-2 md:grid-cols-4 gap-3 md:gap-6">
        {upcomingEvents.map((upcoming, idx) => (
          <div key={idx} className="bg-white/5 backdrop-blur-sm border border-white/10 rounded-lg md:rounded-xl p-3 md:p-4 lg:p-6 hover:border-amber-500/30 transition-all duration-300">
            <div className={`w-8 h-8 md:w-10 md:h-10 lg:w-12 lg:h-12 rounded-lg bg-gradient-to-br ${upcoming.color} flex items-center justify-center mb-2 md:mb-4`}>
              <Film className="text-white/60" size={isMobile ? 16 : 20} />
            </div>
            <h4 className="text-sm md:text-base lg:text-lg font-bold text-white mb-1">{upcoming.title}</h4>
            <p className="text-white/60 text-xs md:text-sm">Releases {upcoming.date}</p>
            <div className="mt-2 md:mt-4 flex items-center gap-1 text-amber-400 text-xs md:text-sm">
              <Bookmark size={12} />
              <span>Add to Watchlist</span>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default ComingSoon;