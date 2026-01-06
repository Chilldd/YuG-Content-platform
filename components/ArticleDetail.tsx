
import React, { useEffect, useState, useRef, useMemo } from 'react';
import { Article } from '../types';
import { BackToTop } from './BackToTop';
import { ArticleNavigation } from './ArticleNavigation';
import { QuoteCardModal } from './QuoteCardModal';

interface ArticleDetailProps {
  article: Article;
  onBack: () => void;
}

type FontSize = 'sm' | 'base' | 'lg';

export const ArticleDetail: React.FC<ArticleDetailProps> = ({ article, onBack }) => {
  const [scrollProgress, setScrollProgress] = useState(0);
  const [imageError, setImageError] = useState(false);
  const [fontSize, setFontSize] = useState<FontSize>('base');
  
  // Selection States
  const [selectedText, setSelectedText] = useState('');
  const [toolbarPos, setToolbarPos] = useState({ top: 0, left: 0, visible: false });
  const [showQuoteModal, setShowQuoteModal] = useState(false);
  const contentRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const handleScroll = () => {
      const totalScroll = document.documentElement.scrollHeight - window.innerHeight;
      const currentScroll = window.scrollY;
      setScrollProgress(totalScroll > 0 ? (currentScroll / totalScroll) * 100 : 0);
      setToolbarPos(prev => prev.visible ? { ...prev, visible: false } : prev);
    };
    window.addEventListener('scroll', handleScroll, { passive: true });
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  useEffect(() => {
    const handleSelectionUpdate = () => {
      requestAnimationFrame(() => {
        const selection = window.getSelection();
        const text = selection?.toString().trim();

        if (text && text.length > 2 && contentRef.current?.contains(selection?.anchorNode || null)) {
          const range = selection?.getRangeAt(0);
          const rect = range?.getBoundingClientRect();
          
          if (rect) {
            const isTooCloseToTop = rect.top < 80;
            setSelectedText(text);
            setToolbarPos({
              top: isTooCloseToTop ? rect.bottom + 10 : rect.top - 55,
              left: rect.left + rect.width / 2,
              visible: true
            });
          }
        } else {
          setToolbarPos(prev => prev.visible ? { ...prev, visible: false } : prev);
        }
      });
    };

    document.addEventListener('mouseup', handleSelectionUpdate);
    document.addEventListener('touchend', handleSelectionUpdate);
    return () => {
      document.removeEventListener('mouseup', handleSelectionUpdate);
      document.removeEventListener('touchend', handleSelectionUpdate);
    };
  }, []);

  const getProseClass = () => {
    switch (fontSize) {
      case 'sm': return 'prose-sm md:prose-base';
      case 'lg': return 'prose-lg md:prose-xl lg:prose-2xl';
      default: return 'prose-base md:prose-lg lg:prose-xl';
    }
  };

  const articleBody = useMemo(() => (
    <div 
      ref={contentRef}
      className={`prose ${getProseClass()} selection:bg-[#2D2D2A] selection:text-[#ECE8DF] transition-all duration-500 ease-in-out mb-24`}
    >
      <div 
        className="font-light"
        dangerouslySetInnerHTML={{ __html: article.content }}
      />
    </div>
  ), [article.content, fontSize]);

  return (
    <div className="pt-20 md:pt-28 pb-12 px-6 md:px-12 relative">
      <BackToTop />
      
      {/* 划选工具栏：中文化 */}
      {toolbarPos.visible && (
        <div 
          className="fixed z-[90] -translate-x-1/2 flex items-center bg-[#2D2D2A] shadow-[0_10px_30px_rgba(0,0,0,0.3)] rounded-full overflow-hidden transition-all duration-300 animate-fade-in border border-white/10"
          style={{ top: toolbarPos.top, left: toolbarPos.left }}
          onMouseDown={(e) => e.preventDefault()} 
        >
          <button 
            onClick={() => {
              setShowQuoteModal(true);
              setToolbarPos(prev => ({ ...prev, visible: false }));
            }}
            className="flex items-center gap-2 px-5 py-2.5 text-xs font-bold text-[#ECE8DF] hover:bg-black transition-colors"
          >
            <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5"><path d="M21 11.5a8.38 8.38 0 0 1-.9 3.8 8.5 8.5 0 0 1-7.6 4.7 8.38 8.38 0 0 1-3.8-.9L3 21l1.9-5.7a8.38 8.38 0 0 1-.9-3.8 8.5 8.5 0 0 1 4.7-7.6 8.38 8.38 0 0 1 3.8-.9h.5a8.48 8.48 0 0 1 8 8v.5z"/></svg>
            生成金句卡片
          </button>
        </div>
      )}

      {showQuoteModal && (
        <QuoteCardModal 
          quote={selectedText} 
          article={article} 
          onClose={() => setShowQuoteModal(false)} 
        />
      )}

      {/* 阅读进度条 */}
      <div 
        className="fixed top-0 left-0 h-1 bg-[#2D2D2A] z-[70] transition-all duration-100 ease-out"
        style={{ width: `${scrollProgress}%` }}
      />

      <div className="max-w-[1400px] mx-auto grid grid-cols-1 lg:grid-cols-11 gap-8 lg:gap-16">
        <aside className="lg:col-span-3 lg:sticky lg:top-28 self-start flex flex-col gap-8">
          <button 
            onClick={onBack}
            className="group flex items-center gap-2 text-xs font-bold text-[#2D2D2A] w-fit mb-4"
          >
            <span className="transition-transform duration-300 group-hover:-translate-x-1">←</span>
            <span className="border-b border-transparent group-hover:border-[#2D2D2A] transition-all duration-300">返回作品列表</span>
          </button>

          <div className="flex flex-col gap-4 p-5 border border-[#D3CDC0] bg-[#ECE8DF]/40 backdrop-blur-sm shadow-sm reveal-item">
            <div className="flex items-center justify-between">
              <span className="text-[10px] uppercase tracking-[0.2em] font-bold text-slate-500">排版设置</span>
              <span className="text-[9px] font-bold text-[#2D2D2A] opacity-50">{fontSize === 'sm' ? '紧凑' : fontSize === 'base' ? '标准' : '放大'}</span>
            </div>
            <div className="flex items-center gap-1">
              {(['sm', 'base', 'lg'] as const).map((size) => (
                <button 
                  key={size}
                  onClick={() => setFontSize(size)}
                  className={`flex-1 h-10 flex items-center justify-center border border-[#D3CDC0] transition-all duration-300 ${fontSize === size ? 'bg-[#2D2D2A] text-[#ECE8DF] border-[#2D2D2A]' : 'text-[#2D2D2A] hover:bg-[#D3CDC0]'}`}
                >
                  <span className={`font-bold ${size === 'sm' ? 'text-xs' : size === 'base' ? 'text-base' : 'text-xl'}`}>A</span>
                </button>
              ))}
            </div>
          </div>

          <div className="flex flex-col gap-6">
            <div className="flex flex-col gap-1.5">
              <span className="text-[10px] uppercase tracking-[0.2em] font-bold text-slate-500">内容栏目</span>
              <span className="font-medium text-[#2D2D2A] text-sm">{article.category}</span>
            </div>
            <div className="flex flex-col gap-1.5">
              <span className="text-[10px] uppercase tracking-[0.2em] font-bold text-slate-500">作者</span>
              <span className="font-medium text-[#2D2D2A] text-sm">{article.author}</span>
            </div>
            <div className="flex flex-col gap-1.5">
              <span className="text-[10px] uppercase tracking-[0.2em] font-bold text-slate-500">发布日期</span>
              <span className="font-medium text-[#2D2D2A] text-sm">{article.date}</span>
            </div>
          </div>

          <div className="hidden lg:flex flex-col gap-3 mt-4 pt-6 border-t border-[#D3CDC0]">
            <span className="text-[10px] uppercase tracking-[0.2em] font-bold text-slate-500">阅读进度</span>
            <div className="h-[150px] w-[1px] bg-[#D3CDC0] relative">
              <div 
                className="absolute top-0 left-0 w-[3px] -ml-[1px] bg-[#2D2D2A] transition-all duration-100"
                style={{ height: `${scrollProgress}%` }}
              />
            </div>
          </div>
        </aside>

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
                <span className="text-[10px] uppercase tracking-[0.4em] text-[#2D2D2A] opacity-30 font-bold">Image unavailable</span>
              </div>
            )}
          </div>

          {articleBody}

          <footer className="mt-16 pt-10 border-t border-[#D3CDC0] flex justify-between items-center mb-16">
             <div className="flex gap-3">
                <button className="text-[10px] font-bold border border-[#D3CDC0] px-5 py-2 hover:bg-[#2D2D2A] hover:text-[#ECE8DF] transition-all duration-300">分享文章</button>
                <button className="text-[10px] font-bold border border-[#D3CDC0] px-5 py-2 hover:bg-[#2D2D2A] hover:text-[#ECE8DF] transition-all duration-300">收藏</button>
             </div>
             <span className="text-[11px] italic text-slate-400" style={{ fontFamily: "'Newsreader', serif" }}>End of Curation. 全文完</span>
          </footer>

          <ArticleNavigation currentArticleId={article.id} />
        </main>
      </div>
    </div>
  );
};
