import React from 'react';
import { Link } from 'react-router-dom';
import { Home, Calendar, Coffee, Users, Film, Target, Spotlight, X } from 'lucide-react';
import { clsx } from 'clsx';

const menuItems = [
  { name: 'Home', icon: Home, path: '/' },
  { name: 'Events', icon: Calendar, path: '/events' },
  { name: 'Pro Show', icon: Spotlight, path: '/proshow' },
  { name: 'Hospitality', icon: Coffee, path: '/hospitality' },
  { name: 'Sponsors', icon: Users, path: '/sponsors' },
  { name: 'Teams', icon: Target, path: '/teams' },
  { name: 'Cart', icon: Film, path: '/cart' }
];

const Sidebar = ({ isOpen, onClose }) => {
  return (
    <>
      {/* Overlay - Only for mobile view */}
      {isOpen && (
        <div
          className="fixed inset-0 bg-black/50 z-40 backdrop-blur-sm md:hidden"
          onClick={onClose}
        />
      )}

      <aside
        className={clsx(
          "fixed top-0 right-0 h-full w-[80%] max-w-[350px] bg-[#1A1A1A] text-[#ECE5D5] z-50",
          "transition-transform duration-700 ease-[cubic-bezier(0.76,0,0.24,1)] shadow-2xl",
          isOpen ? "translate-x-0" : "translate-x-full"
        )}
      >
        {/* DECORATIVE: Film Strip Edge (Left Side) */}
        <div className="absolute left-0 top-0 bottom-0 w-4 border-r border-dashed border-[#ECE5D5]/20 flex flex-col justify-between py-2 overflow-hidden">
          {[...Array(20)].map((_, i) => (
            <div key={i} className="w-2 h-3 bg-[#333] mb-4 mx-auto rounded-[1px]"></div>
          ))}
        </div>

        {/* Added padding-bottom for mobile to avoid overlap with bottom nav */}
        <div className="h-full flex flex-col p-10 pl-14 relative pb-24 md:pb-10">
          {/* Header */}
          <div className="mb-12 pt-10 border-b border-[#ECE5D5]/20 pb-4">
            <h3 className="font-serif text-3xl italic text-[#ECE5D5]">Directors Cut</h3>
            <p className="font-mono text-xs text-[#ECE5D5]/50 mt-1 uppercase tracking-widest">Navigation Reel</p>
          </div>

          {/* Navigation Links */}
          <nav className="flex-1 space-y-6">
            {menuItems.map((item, index) => {
              const Icon = item.icon;
              return (
                <Link
                  key={item.name}
                  to={item.path}
                  onClick={onClose}
                  className="group flex items-center gap-4 text-lg font-mono uppercase tracking-wide opacity-60 hover:opacity-100 transition-all duration-300"
                  style={{ transitionDelay: `${index * 50}ms` }}
                >
                  <span className="p-2 border border-[#ECE5D5]/20 rounded-sm group-hover:bg-[#ECE5D5] group-hover:text-[#1A1A1A] transition-colors">
                    <Icon size={18} strokeWidth={1.5} />
                  </span>
                  <span className="relative">
                    {item.name}
                    <span className="absolute left-0 -bottom-1 w-0 h-[1px] bg-[#ECE5D5] transition-all duration-300 group-hover:w-full"></span>
                  </span>
                </Link>
              );
            })}
          </nav>

          {/* Footer / Credits */}
          <div className="border-t border-[#ECE5D5]/20 pt-6">
            <div className="flex items-center gap-3 opacity-40 mb-4">
              <Film size={32} />
              <div className="text-[10px] font-mono leading-tight">
                <p>PROD. NO. 2406</p>
                <p>SCENE 01 - TAKE 04</p>
              </div>
            </div>
            <Link
              to="/auth"
              onClick={onClose}
              className="block w-full py-3 bg-[#a83232] text-white font-bold uppercase tracking-widest hover:bg-[#8a2525] transition-colors text-sm text-center"
            >
              Register Now
            </Link>
          </div>
        </div>
      </aside>
    </>
  );
};

export default Sidebar;