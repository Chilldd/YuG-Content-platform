
import React, { useState } from 'react';
import { Article } from '../types';

interface ArticleCardProps {
  article: Article;
  onClick: () => void;
}

const getCategoryColor = (category: string) => {
  switch (category.toLowerCase()) {
    case 'design':
      return 'bg-[#4A5D5E]'; // Muted Teal
    case 'technology':
      return 'bg-[#5D4E63]'; // Muted Plum
    case 'architecture':
      return 'bg-[#635B4E]'; // Muted Earth
    case 'culture':
      return 'bg-[#704E4E]'; // Muted Terracotta
    default:
      return 'bg-[#2D2D2A]'; // Dark Charcoal
  }
};

export const ArticleCard: React.FC<ArticleCardProps> = ({ article, onClick }) => {
  const [imageError, setImageError] = useState(false);
  const categoryBg = getCategoryColor(article.category);

  return (
    <div 
      className="group cursor-pointer flex flex-col gap-4 mb-4 reveal-item"
      onClick={onClick}
    >
      <div className="relative aspect-[16/10] overflow-hidden bg-[#E2DDD1]">
        {!imageError ? (
          <img 
            src={article.coverImage} 
            alt={article.title}
            className="curated-img w-full h-full object-cover group-hover:scale-105 group-hover:grayscale-0 group-hover:contrast-100"
            loading="lazy"
            onError={() => setImageError(true)}
          />
        ) : (
          <div className="w-full h-full bg-[#D3CDC0] flex items-center justify-center">
            <span className="text-[10px] uppercase tracking-widest text-[#2D2D2A] opacity-30 font-bold">Image unavailable</span>
          </div>
        )}
        
        {/* Category Tag - Added z-index to stay above scaling image */}
        <div className={`absolute top-0 left-0 ${categoryBg} px-3 py-1.5 text-[10px] uppercase tracking-[0.25em] font-bold text-[#ECE8DF] shadow-sm flex items-center gap-2 z-10`}>
          <span className="w-1 h-1 bg-white/40 rounded-full"></span>
          {article.category}
        </div>
      </div>
      
      <div className="flex flex-col gap-2 max-w-2xl px-1">
        <div className="text-[9px] uppercase tracking-[0.2em] text-slate-500 font-bold">
          <span>{article.date}</span>
        </div>
        <h2 className="text-xl md:text-2xl leading-[1.2] group-hover:text-slate-600 transition-colors duration-500 font-medium">
          {article.title}
        </h2>
        <p className="text-[15px] text-[#374151] line-clamp-2 leading-[1.8] font-normal tracking-normal">
          {article.excerpt}
        </p>
      </div>
    </div>
  );
};
