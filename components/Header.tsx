
import React, { useState, useEffect } from 'react';

interface HeaderProps {
  onGoHome: () => void;
  currentView?: string;
}

export const Header: React.FC<HeaderProps> = ({ onGoHome, currentView }) => {
  const [isScrolled, setIsScrolled] = useState(false);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 30);
    };
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const navItems = [
    { name: 'Archive', id: 'archive' },
    { name: 'About', id: 'about' },
    { name: 'Contact', id: 'contact' }
  ];

  const handleNavigate = (e: React.MouseEvent, id: string) => {
    e.preventDefault();
    setIsMobileMenuOpen(false);
    window.location.hash = id;
  };

  return (
    <header className={`fixed top-0 left-0 right-0 z-50 transition-all duration-700 ease-in-out px-6 md:px-12 h-16 md:h-20 flex items-center justify-between ${
      isScrolled || isMobileMenuOpen ? 'bg-[#ECE8DF]/95 backdrop-blur-md border-b border-[#D3CDC0]' : 'bg-transparent'
    }`}>
      <div 
        className="flex items-center gap-3 cursor-pointer group h-full z-50"
        onClick={(e) => {
          e.preventDefault();
          setIsMobileMenuOpen(false);
          onGoHome();
        }}
      >
        <div className="w-8 h-8 bg-[#2D2D2A] flex-shrink-0 flex items-center justify-center text-[#ECE8DF] font-bold text-xs transition-transform duration-500 group-hover:scale-105">
          YG
        </div>
        
        <div className="flex items-center h-full">
          <div className="font-serif text-lg md:text-xl font-semibold tracking-tight text-[#2D2D2A] flex items-center whitespace-nowrap leading-none">
            <span>Yu</span>
            <span 
              className={`inline-block transition-all duration-1000 ease-[cubic-bezier(0.2,0.8,0.2,1)] overflow-hidden ${
                isScrolled 
                  ? 'max-w-0 opacity-0' 
                  : 'max-w-[300px] opacity-100 mx-1.5'
              }`}
            >
              Content Platform
            </span>
            <span>G</span>
          </div>
        </div>
      </div>

      {/* Desktop Nav */}
      <nav className="hidden md:flex items-center gap-10">
        {navItems.map((item) => (
          <a
            key={item.name}
            href={`#${item.id}`}
            onClick={(e) => handleNavigate(e, item.id)}
            className={`text-[10px] uppercase tracking-[0.3em] font-bold transition-all duration-300 relative group ${
              currentView === item.id ? 'text-[#2D2D2A]' : 'text-slate-500 hover:text-[#2D2D2A]'
            }`}
          >
            {item.name}
            <span className={`absolute -bottom-1 left-0 h-[1.5px] bg-[#2D2D2A] transition-all duration-500 ${
              currentView === item.id ? 'w-full' : 'w-0 group-hover:w-full'
            }`} />
          </a>
        ))}
      </nav>

      {/* Mobile Menu Toggle */}
      <button 
        className="md:hidden z-50 p-2"
        onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
        aria-label="Toggle Menu"
      >
        <div className="w-6 h-4 flex flex-col justify-between items-end">
          <span className={`h-[1.5px] bg-[#2D2D2A] transition-all duration-300 ${isMobileMenuOpen ? 'w-6 translate-y-[7.5px] rotate-45' : 'w-6'}`} />
          <span className={`h-[1.5px] bg-[#2D2D2A] transition-all duration-300 ${isMobileMenuOpen ? 'opacity-0' : 'w-4'}`} />
          <span className={`h-[1.5px] bg-[#2D2D2A] transition-all duration-300 ${isMobileMenuOpen ? 'w-6 -translate-y-[7.5px] -rotate-45' : 'w-5'}`} />
        </div>
      </button>

      {/* Mobile Menu Overlay */}
      <div className={`fixed inset-0 bg-[#ECE8DF] transition-all duration-700 ease-[cubic-bezier(0.2,0.8,0.2,1)] flex flex-col items-center justify-center gap-12 md:hidden ${
        isMobileMenuOpen ? 'opacity-100 pointer-events-auto translate-y-0' : 'opacity-0 pointer-events-none -translate-y-4'
      }`}>
        {navItems.map((item, idx) => (
          <a
            key={item.name}
            href={`#${item.id}`}
            onClick={(e) => handleNavigate(e, item.id)}
            className="text-2xl font-serif italic tracking-tight text-[#2D2D2A]"
            style={{ transitionDelay: `${idx * 100}ms` }}
          >
            {item.name}
          </a>
        ))}
        <div className="absolute bottom-12 text-[9px] uppercase tracking-[0.4em] text-slate-400 font-bold">
          © 2024 Yu Platform G
        </div>
      </div>
    </header>
  );
};
