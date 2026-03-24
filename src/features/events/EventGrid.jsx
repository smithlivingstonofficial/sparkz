import React from 'react';
import EventCard from './EventCard';
import { Film, X } from 'lucide-react';

const EventGrid = ({ 
  filteredEvents, 
  hoveredCard, 
  setHoveredCard, 
  setSelectedEvent, 
  isMobile,
  searchQuery,
  clearSearch 
}) => {
  return (
    <>
      {/* Header with counter and search info */}
      <div className="sticky top-0 z-20 mb-6 md:mb-8 bg-black/80 backdrop-blur-xl border-b border-white/10 p-4 md:p-0 md:bg-transparent md:backdrop-blur-none md:border-none">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-3 md:gap-0">
          {/* Events Counter */}
          <div className="flex items-center gap-3">
            <div className="px-4 py-2 bg-gradient-to-r from-amber-600/20 to-red-600/20 backdrop-blur-sm rounded-xl border border-white/10">
              <div className="flex items-center gap-2">
                <span className="text-white/70 text-sm md:text-base">
                  Total Events:
                </span>
                <span className="text-white font-bold text-lg md:text-xl">
                  {filteredEvents.length}
                </span>
              </div>
            </div>
            
            {filteredEvents.length > 0 && (
              <div className="hidden md:block">
                <span className="text-white/50 text-sm">
                  {filteredEvents.length} {filteredEvents.length === 1 ? 'event' : 'events'} found
                </span>
              </div>
            )}
          </div>

          {/* Search Status */}
          {searchQuery && (
            <div className="flex items-center justify-between md:justify-end gap-3">
              <div className="flex items-center gap-2 px-4 py-2 bg-white/10 backdrop-blur-sm rounded-xl border border-white/20">
                <span className="text-white/70 text-sm">Search:</span>
                <span className="text-white font-bold text-sm max-w-[150px] truncate">
                  "{searchQuery}"
                </span>
              </div>
              <button
                onClick={clearSearch}
                className="px-4 py-2 bg-gradient-to-r from-amber-600/20 to-red-600/20 backdrop-blur-sm text-amber-400 hover:text-amber-300 rounded-xl border border-white/10 hover:border-amber-500/50 transition-all duration-300 flex items-center gap-2"
              >
                <X size={16} />
                <span className="text-sm">Clear</span>
              </button>
            </div>
          )}
        </div>
      </div>

      {/* Events Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 md:gap-6 lg:gap-8">
        {filteredEvents.map((event) => (
          <EventCard
            key={event.id}
            event={event}
            isMobile={isMobile}
            setSelectedEvent={setSelectedEvent}
            setHoveredCard={setHoveredCard}
            isHovered={hoveredCard === event.id}
          />
        ))}
      </div>

      {/* No Events Message */}
      {filteredEvents.length === 0 && (
        <div className="text-center py-16 md:py-24">
          <div className="relative inline-block mb-6">
            <Film className="mx-auto text-white/20 mb-4" size={isMobile ? 48 : 64} />
            <div className="absolute inset-0 bg-gradient-to-r from-transparent via-amber-500/10 to-transparent animate-pulse rounded-full blur-xl" />
          </div>
          
          <h3 className="text-2xl md:text-3xl font-bold text-white/70 mb-3">
            No Events Found
          </h3>
          
          <p className="text-white/50 text-base md:text-lg mb-6 max-w-md mx-auto">
            {searchQuery 
              ? 'No events match your search. Try different keywords or categories.'
              : 'No events available in this category. Try selecting a different one.'
            }
          </p>
          
          {searchQuery && (
            <button
              onClick={clearSearch}
              className="px-8 py-3 bg-gradient-to-r from-amber-600 to-red-600 text-white font-bold rounded-xl hover:from-amber-700 hover:to-red-700 transition-all duration-300 shadow-lg hover:shadow-xl"
            >
              Clear Search & Show All Events
            </button>
          )}
          
          {!searchQuery && (
            <div className="mt-8 p-6 bg-white/5 backdrop-blur-sm rounded-2xl border border-white/10 max-w-md mx-auto">
              <p className="text-white/60 text-sm mb-3">
                Looking for something specific?
              </p>
              <div className="flex items-center justify-center gap-3 text-sm text-white/50">
                <div className="px-3 py-1.5 bg-white/10 rounded-lg">
                  Dance
                </div>
                <div className="px-3 py-1.5 bg-white/10 rounded-lg">
                  Music
                </div>
                <div className="px-3 py-1.5 bg-white/10 rounded-lg">
                  Arts
                </div>
                <div className="px-3 py-1.5 bg-white/10 rounded-lg">
                  Sports
                </div>
              </div>
            </div>
          )}
        </div>
      )}

      {/* Footer Stats */}
      {filteredEvents.length > 0 && (
        <div className="mt-12 pt-8 border-t border-white/10">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            <div className="text-center p-4 bg-white/5 backdrop-blur-sm rounded-xl border border-white/10">
              <div className="text-2xl md:text-3xl font-bold text-white mb-1">
                {filteredEvents.length}
              </div>
              <div className="text-white/60 text-sm">Total Events</div>
            </div>
            <div className="text-center p-4 bg-white/5 backdrop-blur-sm rounded-xl border border-white/10">
              <div className="text-2xl md:text-3xl font-bold text-amber-400 mb-1">
                {filteredEvents.filter(e => e.featured).length}
              </div>
              <div className="text-white/60 text-sm">Featured</div>
            </div>
            <div className="text-center p-4 bg-white/5 backdrop-blur-sm rounded-xl border border-white/10">
              <div className="text-2xl md:text-3xl font-bold text-emerald-400 mb-1">
                {filteredEvents.filter(e => e.eventMode === 'Online').length}
              </div>
              <div className="text-white/60 text-sm">Online</div>
            </div>
            <div className="text-center p-4 bg-white/5 backdrop-blur-sm rounded-xl border border-white/10">
              <div className="text-2xl md:text-3xl font-bold text-blue-400 mb-1">
                {filteredEvents.filter(e => e.eventMode === 'Offline').length}
              </div>
              <div className="text-white/60 text-sm">Offline</div>
            </div>
          </div>
        </div>
      )}
    </>
  );
};

export default EventGrid;