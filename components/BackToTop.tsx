
import React, { useState, useEffect } from 'react';

export const BackToTop: React.FC = () => {
  const [isVisible, setIsVisible] = useState(false);

  useEffect(() => {
    const toggleVisibility = () => {
      if (window.scrollY > 600) {
        setIsVisible(true);
      } else {
        setIsVisible(false);
      }
    };
    window.addEventListener('scroll', toggleVisibility, { passive: true });
    return () => window.removeEventListener('scroll', toggleVisibility);
  }, []);

  const scrollToTop = () => {
    window.scrollTo({
      top: 0,
      behavior: 'smooth'
    });
  };

  return (
    <div className={`fixed bottom-10 right-6 md:right-12 z-[100] transition-all duration-700 ease-[cubic-bezier(0.2,0.8,0.2,1)] ${
      isVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-12 pointer-events-none'
    }`}>
      <button
        onClick={scrollToTop}
        className="flex items-center gap-3 group"
        aria-label="Scroll to top"
      >
        <div className="hidden md:block text-[9px] uppercase tracking-[0.3em] font-bold text-[#2D2D2A] bg-[#ECE8DF]/95 backdrop-blur-md border border-[#D3CDC0] px-3 py-1.5 opacity-0 group-hover:opacity-100 transition-opacity duration-300">
          Scroll to Top
        </div>
        <div className="w-12 h-12 bg-[#2D2D2A] text-[#ECE8DF] flex items-center justify-center rounded-full shadow-2xl hover:scale-110 active:scale-95 transition-all duration-300 border border-white/10">
          <svg width="14" height="14" viewBox="0 0 12 12" fill="none" xmlns="http://www.w3.org/2000/svg">
            <path d="M6 10.5V1.5M6 1.5L1.5 6M6 1.5L10.5 6" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round"/>
          </svg>
        </div>
      </button>
    </div>
  );
};
