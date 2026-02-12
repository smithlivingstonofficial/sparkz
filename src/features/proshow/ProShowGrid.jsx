// features/proshow/ProShowGrid.jsx
import React from 'react';
import { Film, X } from 'lucide-react';
import ProShowCard from './ProShowCard';

const ProShowGrid = ({ 
  proShows, 
  hoveredCard, 
  setHoveredCard, 
  setSelectedEvent, 
  isMobile,
  searchQuery,
  clearSearch 
}) => {
  return (
    <>
      {/* Header with counter */}
      <div className="sticky top-0 z-20 mb-6 md:mb-8 bg-black/80 backdrop-blur-xl border-b border-amber-500/20 p-4 md:p-0 md:bg-transparent md:backdrop-blur-none md:border-none">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-3 md:gap-0">
          {/* Premium Counter */}
          <div className="flex items-center gap-3">
            <div className="px-4 py-2 bg-gradient-to-r from-amber-600/20 to-yellow-600/20 backdrop-blur-sm rounded-xl border border-amber-500/30">
              <div className="flex items-center gap-2">
                <span className="text-white/70 text-sm md:text-base">
                  Premium Shows:
                </span>
                <span className="text-white font-bold text-lg md:text-xl">
                  {proShows.length}
                </span>
              </div>
            </div>
            
            {proShows.length > 0 && (
              <div className="hidden md:block">
                <span className="text-amber-300/50 text-sm">
                  {proShows.length} {proShows.length === 1 ? 'premium show' : 'premium shows'}
                </span>
              </div>
            )}
          </div>

          {/* Search Status */}
          {searchQuery && (
            <div className="flex items-center justify-between md:justify-end gap-3">
              <div className="flex items-center gap-2 px-4 py-2 bg-white/10 backdrop-blur-sm rounded-xl border border-amber-500/20">
                <span className="text-white/70 text-sm">Search:</span>
                <span className="text-white font-bold text-sm max-w-[150px] truncate">
                  "{searchQuery}"
                </span>
              </div>
              <button
                onClick={clearSearch}
                className="px-4 py-2 bg-gradient-to-r from-amber-600/20 to-yellow-600/20 backdrop-blur-sm text-amber-400 hover:text-amber-300 rounded-xl border border-amber-500/30 hover:border-amber-500/50 transition-all duration-300 flex items-center gap-2"
              >
                <X size={16} />
                <span className="text-sm">Clear</span>
              </button>
            </div>
          )}
        </div>
      </div>

      {/* Premium Shows Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 md:gap-6 lg:gap-8">
        {proShows.map((show) => (
          <ProShowCard
            key={show.id}
            event={show}
            isMobile={isMobile}
            setSelectedEvent={setSelectedEvent}
            setHoveredCard={setHoveredCard}
            isHovered={hoveredCard === show.id}
          />
        ))}
      </div>

      {/* No Shows Message */}
      {proShows.length === 0 && (
        <div className="text-center py-16 md:py-24">
          <div className="relative inline-block mb-6">
            <Film className="mx-auto text-amber-400/20 mb-4" size={isMobile ? 48 : 64} />
            <div className="absolute inset-0 bg-gradient-to-r from-transparent via-amber-500/10 to-transparent animate-pulse rounded-full blur-xl" />
          </div>
          
          <h3 className="text-2xl md:text-3xl font-bold text-white/70 mb-3">
            No Premium Shows Found
          </h3>
          
          <p className="text-white/50 text-base md:text-lg mb-6 max-w-md mx-auto">
            {searchQuery 
              ? 'No premium shows match your search. Try different keywords.'
              : 'No premium shows available at the moment.'
            }
          </p>
          
          {searchQuery && (
            <button
              onClick={clearSearch}
              className="px-8 py-3 bg-gradient-to-r from-amber-600 to-yellow-600 text-white font-bold rounded-xl hover:from-amber-700 hover:to-yellow-700 transition-all duration-300 shadow-lg hover:shadow-xl"
            >
              Clear Search & Show All
            </button>
          )}
        </div>
      )}

      {/* Footer Stats */}
      {proShows.length > 0 && (
        <div className="mt-12 pt-8 border-t border-amber-500/20">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            <div className="text-center p-4 bg-white/5 backdrop-blur-sm rounded-xl border border-amber-500/20">
              <div className="text-2xl md:text-3xl font-bold text-amber-400 mb-1">
                {proShows.length}
              </div>
              <div className="text-white/60 text-sm">Total Shows</div>
            </div>
            <div className="text-center p-4 bg-white/5 backdrop-blur-sm rounded-xl border border-amber-500/20">
              <div className="text-2xl md:text-3xl font-bold text-purple-400 mb-1">
                {proShows.filter(e => e.featured).length}
              </div>
              <div className="text-white/60 text-sm">Featured</div>
            </div>
            <div className="text-center p-4 bg-white/5 backdrop-blur-sm rounded-xl border border-amber-500/20">
              <div className="text-2xl md:text-3xl font-bold text-yellow-400 mb-1">
                {proShows.filter(e => e.ticketType === 'VIP').length}
              </div>
              <div className="text-white/60 text-sm">VIP Events</div>
            </div>
            <div className="text-center p-4 bg-white/5 backdrop-blur-sm rounded-xl border border-amber-500/20">
              <div className="text-2xl md:text-3xl font-bold text-blue-400 mb-1">
                {new Set(proShows.map(e => e.artist || e.performer)).size}
              </div>
              <div className="text-white/60 text-sm">Artists</div>
            </div>
          </div>
        </div>
      )}
    </>
  );
};

export default ProShowGrid;