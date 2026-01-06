
import React, { useMemo } from 'react';
import { Article } from '../types';
import { articles } from '../data/articles/index';

interface ArticleNavigationProps {
  currentArticleId: string;
}

export const ArticleNavigation: React.FC<ArticleNavigationProps> = ({ currentArticleId }) => {
  const navigation = useMemo(() => {
    const currentIndex = articles.findIndex(a => a.id === currentArticleId);
    if (currentIndex === -1) return null;
    
    const prevIndex = (currentIndex - 1 + articles.length) % articles.length;
    const nextIndex = (currentIndex + 1) % articles.length;
    
    return {
      prev: articles[prevIndex],
      next: articles[nextIndex],
    };
  }, [currentArticleId]);

  if (!navigation) return null;

  const handleNavigate = (id: string) => {
    window.location.hash = id;
  };

  return (
    <section className="grid grid-cols-1 md:grid-cols-2 gap-px bg-[#D3CDC0] border border-[#D3CDC0] reveal-item overflow-hidden mt-16">
      {/* Previous Article */}
      <div 
        className="group relative min-h-[280px] flex flex-col justify-end p-8 md:p-12 transition-all duration-700 overflow-hidden cursor-pointer"
        onClick={() => handleNavigate(navigation.prev.id)}
      >
        <div className="absolute inset-0 z-0">
          <img 
            src={navigation.prev.coverImage} 
            className="w-full h-full object-cover grayscale-[0.9] group-hover:grayscale-0 group-hover:scale-105 transition-all duration-1000 ease-out" 
            alt="" 
          />
          <div className="absolute inset-0 bg-gradient-to-t from-[#ECE8DF] via-[#ECE8DF]/95 to-transparent opacity-90 group-hover:opacity-100 transition-opacity duration-500" />
        </div>
        
        <div className="relative z-10">
          <span className="text-xs font-bold text-[#2D2D2A]/60 block mb-6 transition-transform duration-500 group-hover:-translate-x-1">← 上一篇</span>
          <div className="flex flex-col gap-2">
            <span className="text-[10px] uppercase tracking-[0.2em] font-bold text-[#2D2D2A]/40">{navigation.prev.category}</span>
            <h3 className="text-xl md:text-2xl font-serif italic text-[#2D2D2A] leading-tight group-hover:text-black transition-colors duration-300">{navigation.prev.title}</h3>
          </div>
        </div>
      </div>

      {/* Next Article */}
      <div 
        className="group relative min-h-[280px] flex flex-col justify-end p-8 md:p-12 transition-all duration-700 text-right overflow-hidden cursor-pointer border-t md:border-t-0 border-[#D3CDC0]"
        onClick={() => handleNavigate(navigation.next.id)}
      >
        <div className="absolute inset-0 z-0">
          <img 
            src={navigation.next.coverImage} 
            className="w-full h-full object-cover grayscale-[0.9] group-hover:grayscale-0 group-hover:scale-105 transition-all duration-1000 ease-out" 
            alt="" 
          />
          <div className="absolute inset-0 bg-gradient-to-t from-[#ECE8DF] via-[#ECE8DF]/95 to-transparent opacity-90 group-hover:opacity-100 transition-opacity duration-500" />
        </div>
        
        <div className="relative z-10">
          <span className="text-xs font-bold text-[#2D2D2A]/60 block mb-6 transition-transform duration-500 group-hover:translate-x-1">下一篇 →</span>
          <div className="flex flex-col gap-2">
            <span className="text-[10px] uppercase tracking-[0.2em] font-bold text-[#2D2D2A]/40">{navigation.next.category}</span>
            <h3 className="text-xl md:text-2xl font-serif italic text-[#2D2D2A] leading-tight group-hover:text-black transition-colors duration-300">{navigation.next.title}</h3>
          </div>
        </div>
      </div>
    </section>
  );
};
