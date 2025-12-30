
import React from 'react';

export const Footer: React.FC = () => {
  const handleFooterNav = (e: React.MouseEvent, id: string) => {
    e.preventDefault();
    window.location.hash = id;
  };

  return (
    <footer className="py-12 px-6 md:px-12 border-t border-[#D3CDC0] text-[10px] uppercase tracking-widest text-slate-500 bg-[#ECE8DF]">
      <div className="max-w-[1400px] mx-auto flex flex-col md:flex-row justify-between gap-4">
        <p>&copy; 2024 Yu Content Platform G. Designed for permanence.</p>
        <div className="flex gap-6">
          <a href="#archive" onClick={(e) => handleFooterNav(e, 'archive')} className="hover:text-[#2D2D2A] transition-colors">Archive</a>
          <a href="#about" onClick={(e) => handleFooterNav(e, 'about')} className="hover:text-[#2D2D2A] transition-colors">About</a>
          <a href="#contact" onClick={(e) => handleFooterNav(e, 'contact')} className="hover:text-[#2D2D2A] transition-colors">Contact</a>
        </div>
      </div>
    </footer>
  );
};
