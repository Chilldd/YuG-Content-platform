
import React, { useEffect, useState } from 'react';
import { Article } from '../types';
import { BackToTop } from './BackToTop';
import { ArticleNavigation } from './ArticleNavigation';

interface ArticleDetailProps {
  article: Article;
  onBack: () => void;
}

type FontSize = 'sm' | 'base' | 'lg';

export const ArticleDetail: React.FC<ArticleDetailProps> = ({ article, onBack }) => {
  const [scrollProgress, setScrollProgress] = useState(0);
  const [imageError, setImageError] = useState(false);
  const [fontSize, setFontSize] = useState<FontSize>('base');

  useEffect(() => {
    const handleScroll = () => {
      const totalScroll = document.documentElement.scrollHeight - window.innerHeight;
      const currentScroll = window.scrollY;
      setScrollProgress(totalScroll > 0 ? (currentScroll / totalScroll) * 100 : 0);
    };
    window.addEventListener('scroll', handleScroll, { passive: true });
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const getProseClass = () => {
    switch (fontSize) {
      case 'sm': return 'prose-sm md:prose-base';
      case 'lg': return 'prose-lg md:prose-xl lg:prose-2xl';
      default: return 'prose-base md:prose-lg lg:prose-xl';
    }
  };

  return (
    <div className="pt-20 md:pt-28 pb-12 px-6 md:px-12 relative">
      <BackToTop />
      
      {/* Reading Progress Bar (Fixed Top) */}
      <div 
        className="fixed top-0 left-0 h-1 bg-[#2D2D2A] z-[70] transition-all duration-100 ease-out"
        style={{ width: `${scrollProgress}%` }}
      />

      <div className="max-w-[1400px] mx-auto grid grid-cols-1 lg:grid-cols-11 gap-8 lg:gap-16">
        {/* Sidebar Controls */}
        <aside className="lg:col-span-3 lg:sticky lg:top-28 self-start flex flex-col gap-8">
          <button 
            onClick={onBack}
            className="group flex items-center gap-2 text-[10px] uppercase tracking-[0.2em] font-bold text-[#2D2D2A] w-fit mb-4"
          >
            <span className="transition-transform duration-300 group-hover:-translate-x-1">←</span>
            <span className="border-b border-transparent group-hover:border-[#2D2D2A] transition-all duration-300">Back to Journal</span>
          </button>

          <div className="flex flex-col gap-4 p-5 border border-[#D3CDC0] bg-[#ECE8DF]/40 backdrop-blur-sm shadow-sm reveal-item">
            <div className="flex items-center justify-between">
              <span className="text-[9px] uppercase tracking-[0.3em] font-bold text-slate-500">Typography</span>
              <span className="text-[9px] uppercase font-bold text-[#2D2D2A] opacity-50">{fontSize === 'sm' ? 'Compact' : fontSize === 'base' ? 'Standard' : 'Magnified'}</span>
            </div>
            <div className="flex items-center gap-1">
              {(['sm', 'base', 'lg'] as const).map((size) => (
                <button 
                  key={size}
                  onClick={() => setFontSize(size)}
                  className={`flex-1 h-10 flex items-center justify-center border border-[#D3CDC0] transition-all duration-300 ${fontSize === size ? 'bg-[#2D2D2A] text-[#ECE8DF] border-[#2D2D2A]' : 'text-[#2D2D2A] hover:bg-[#D3CDC0]'}`}
                >
                  <span className={`font-bold ${size === 'sm' ? 'text-[10px]' : size === 'base' ? 'text-[15px]' : 'text-[22px]'}`}>A</span>
                </button>
              ))}
            </div>
          </div>

          <div className="flex flex-col gap-6">
            <div className="flex flex-col gap-1.5">
              <span className="text-[9px] uppercase tracking-[0.3em] font-bold text-slate-500">Category</span>
              <span className="font-medium text-[#2D2D2A] text-sm">{article.category}</span>
            </div>
            <div className="flex flex-col gap-1.5">
              <span className="text-[9px] uppercase tracking-[0.3em] font-bold text-slate-500">Written by</span>
              <span className="font-medium text-[#2D2D2A] text-sm">{article.author}</span>
            </div>
            <div className="flex flex-col gap-1.5">
              <span className="text-[9px] uppercase tracking-[0.3em] font-bold text-slate-500">Published</span>
              <span className="font-medium text-[#2D2D2A] text-sm">{article.date}</span>
            </div>
          </div>

          <div className="hidden lg:flex flex-col gap-3 mt-4 pt-6 border-t border-[#D3CDC0]">
            <span className="text-[9px] uppercase tracking-[0.3em] font-bold text-slate-500">Reading Progress</span>
            <div className="h-[150px] w-[1px] bg-[#D3CDC0] relative">
              <div 
                className="absolute top-0 left-0 w-[3px] -ml-[1px] bg-[#2D2D2A] transition-all duration-100"
                style={{ height: `${scrollProgress}%` }}
              />
            </div>
          </div>
        </aside>

        {/* Article Body */}
        <main className="lg:col-span-8">
          <header className="mb-8 md:mb-12">
            <h1 className="text-3xl md:text-5xl leading-[1.1] mb-5 tracking-tight font-serif text-[#2D2D2A] italic font-medium">
              {article.title}
            </h1>
            <p className="italic text-lg md:text-xl text-slate-600 border-l-2 border-[#2D2D2A] pl-5 md:pl-8 py-1.5" style={{ fontFamily: "'Newsreader', serif" }}>
              {article.subtitle}
            </p>
          </header>

          <div className="relative aspect-[16/8] overflow-hidden bg-[#E2DDD1] mb-10 md:mb-16">
            {!imageError ? (
              <img 
                src={article.coverImage} 
                alt={article.title}
                className="w-full h-full object-cover content-active-img"
                onError={() => setImageError(true)}
              />
            ) : (
              <div className="w-full h-full bg-[#D3CDC0] flex items-center justify-center">
                <span className="text-xs uppercase tracking-[0.4em] text-[#2D2D2A] opacity-30 font-bold">Image unavailable</span>
              </div>
            )}
          </div>

          <div className={`prose ${getProseClass()} selection:bg-[#2D2D2A] selection:text-[#ECE8DF] transition-all duration-500 ease-in-out mb-24`}>
            <div 
              className="font-light"
              dangerouslySetInnerHTML={{ __html: article.content }}
            />
          </div>

          <footer className="mt-16 pt-10 border-t border-[#D3CDC0] flex justify-between items-center mb-16">
             <div className="flex gap-3">
                <button className="text-[9px] uppercase font-bold tracking-widest border border-[#D3CDC0] px-4 py-2 hover:bg-[#2D2D2A] hover:text-[#ECE8DF] transition-all duration-300">Share Piece</button>
                <button className="text-[9px] uppercase font-bold tracking-widest border border-[#D3CDC0] px-4 py-2 hover:bg-[#2D2D2A] hover:text-[#ECE8DF] transition-all duration-300">Bookmark</button>
             </div>
             <span className="text-[10px] italic text-slate-500 uppercase tracking-widest" style={{ fontFamily: "'Newsreader', serif" }}>End of Curation</span>
          </footer>

          {/* Article Navigation */}
          <ArticleNavigation currentArticleId={article.id} />
        </main>
      </div>
    </div>
  );
};
