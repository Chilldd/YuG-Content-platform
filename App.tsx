
import React, { useState, useEffect, useRef, useLayoutEffect } from 'react';
import { Header } from './components/Header';
import { Footer } from './components/Footer';
import { ArticleCard } from './components/ArticleCard';
import { ArticleDetail } from './components/ArticleDetail';
import { SkeletonCard } from './components/SkeletonCard';
import { articles } from './data/articles/index';
import { Article, ViewState } from './types';

const INITIAL_LOAD_COUNT = 6;
const LOAD_MORE_COUNT = 3;
const categories = ['All', 'Design', 'Technology', 'Architecture', 'Culture'];

const getCategoryAccent = (category: string) => {
  switch (category.toLowerCase()) {
    case 'design': return '#4A5D5E';
    case 'technology': return '#5D4E63';
    case 'architecture': return '#635B4E';
    case 'culture': return '#704E4E';
    default: return '#2D2D2A';
  }
};

const App: React.FC = () => {
  // Navigation State
  const [currentView, setCurrentView] = useState<ViewState>('list');
  const [selectedId, setSelectedId] = useState<string | null>(null);
  
  // Transition State
  const [isPageVisible, setIsPageVisible] = useState(false);
  const [viewOpacity, setViewOpacity] = useState(1);
  
  // Content State
  const [activeCategory, setActiveCategory] = useState('All');
  const [visibleCount, setVisibleCount] = useState(INITIAL_LOAD_COUNT);
  const [isFiltering, setIsFiltering] = useState(false);
  
  const loaderRef = useRef<HTMLDivElement>(null);
  const navRef = useRef<HTMLElement>(null);
  const [underlineStyle, setUnderlineStyle] = useState({ width: 0, left: 0 });

  // Compute articles
  const filteredArticles = articles.filter(article => 
    activeCategory === 'All' ? true : article.category === activeCategory
  );
  const displayedArticles = filteredArticles.slice(0, visibleCount);
  const hasMore = visibleCount < filteredArticles.length;
  const latestDate = articles.length > 0 ? [...articles].sort((a, b) => b.date.localeCompare(a.date))[0].date : '2026.01.06';

  // Routing Logic
  useEffect(() => {
    const handleHashChange = () => {
      const hash = window.location.hash.replace(/^#\/?/, '').split('?')[0];
      
      let targetView: ViewState = 'list';
      let targetId: string | null = null;

      if (['archive', 'about', 'contact'].includes(hash)) {
        targetView = hash as ViewState;
      } else if (hash) {
        const foundArticle = articles.find(a => a.id === hash);
        if (foundArticle) {
          targetId = foundArticle.id;
          targetView = 'detail';
        }
      }

      if (targetView === currentView && targetId === selectedId) {
        setViewOpacity(1);
        return;
      }

      setViewOpacity(0);
      
      setTimeout(() => {
        setSelectedId(targetId);
        setCurrentView(targetView);
        window.scrollTo({ top: 0, behavior: 'auto' });
        
        requestAnimationFrame(() => {
          setViewOpacity(1);
        });
      }, 400); 
    };

    window.addEventListener('hashchange', handleHashChange);
    handleHashChange();
    
    const mountTimer = setTimeout(() => setIsPageVisible(true), 100);

    return () => {
      window.removeEventListener('hashchange', handleHashChange);
      clearTimeout(mountTimer);
    };
  }, [currentView, selectedId]);

  // Underline UI
  const updateUnderline = () => {
    if (currentView !== 'list' || !navRef.current) return;
    const activeBtn = navRef.current.querySelector(`[data-category="${activeCategory}"]`) as HTMLButtonElement;
    if (activeBtn) {
      setUnderlineStyle({ 
        width: activeBtn.offsetWidth, 
        left: activeBtn.offsetLeft 
      });
    }
  };

  useLayoutEffect(() => {
    updateUnderline();
  }, [activeCategory, currentView]);

  useEffect(() => {
    if (viewOpacity === 1) {
      const timer = setTimeout(updateUnderline, 50);
      return () => clearTimeout(timer);
    }
  }, [viewOpacity]);

  // Infinite Scroll
  useEffect(() => {
    if (currentView !== 'list' || !hasMore || isFiltering) return;

    const currentLoader = loaderRef.current;
    if (!currentLoader) return;

    const observer = new IntersectionObserver((entries) => {
      if (entries[0].isIntersecting) {
        setVisibleCount(prev => prev + LOAD_MORE_COUNT);
      }
    }, { 
      rootMargin: '400px', 
      threshold: 0.1 
    });

    observer.observe(currentLoader);
    return () => observer.disconnect();
  }, [currentView, hasMore, isFiltering, activeCategory]);

  const handleCategoryChange = (category: string) => {
    if (category === activeCategory) return;
    setIsFiltering(true);
    setTimeout(() => {
      setActiveCategory(category);
      setVisibleCount(INITIAL_LOAD_COUNT);
      setTimeout(() => {
        requestAnimationFrame(() => setIsFiltering(false));
      }, 300);
    }, 400);
  };

  const handleGoHome = () => { 
    if (window.location.hash === '' || window.location.hash === '#') {
      window.scrollTo({ top: 0, behavior: 'smooth' });
    } else {
      window.location.hash = ''; 
    }
  };

  const currentArticle = articles.find(a => a.id === selectedId);

  const mainStyle = {
    opacity: viewOpacity,
    transform: viewOpacity === 1 ? 'none' : 'translateY(1.5rem)',
    transition: 'all 600ms cubic-bezier(0.2, 0.8, 0.2, 1)'
  };

  return (
    <div className={`min-h-screen flex flex-col selection:bg-[#2D2D2A] selection:text-[#ECE8DF] transition-opacity duration-1000 ${isPageVisible ? 'opacity-100' : 'opacity-0'}`}>
      <Header onGoHome={handleGoHome} currentView={currentView} />

      <main style={mainStyle} className="flex-grow">
        {currentView === 'list' && (
          <div className="pt-24 md:pt-36 pb-12 px-6 md:px-12 max-w-[1400px] mx-auto">
            <header className="mb-12 md:mb-16 flex flex-col md:flex-row md:items-end justify-between gap-6">
              <div className="max-w-2xl">
                <h1 className="italic text-4xl md:text-6xl font-medium tracking-tight mb-6" style={{ fontFamily: "'Newsreader', serif" }}>
                  Curation of depth
                </h1>
                <p className="text-slate-600 font-light leading-relaxed text-[20px]">
                  探索设计与技术的交集，通过极简主义视角审视新时代的数字文明。
                </p>
              </div>
              <div className="flex flex-col items-start md:items-end gap-1 text-[10px] uppercase tracking-[0.3em] font-bold text-slate-500 pb-2">
                <span>Last Updated</span>
                <span>{latestDate}</span>
              </div>
            </header>

            <nav ref={navRef} className="mb-12 md:mb-16 flex flex-wrap gap-x-8 gap-y-4 border-b border-[#D3CDC0] pb-4 relative">
              {categories.map((cat) => (
                <button
                  key={cat}
                  data-category={cat}
                  onClick={() => handleCategoryChange(cat)}
                  className={`text-[11px] uppercase tracking-[0.25em] font-bold transition-all duration-500 relative pb-2 whitespace-nowrap z-10 flex items-center gap-2 ${activeCategory === cat ? 'text-[#2D2D2A]' : 'text-slate-500 hover:text-slate-700'}`}
                >
                  <span className={`w-1.5 h-1.5 rounded-full transition-all duration-500 ${activeCategory === cat ? 'opacity-100 scale-100' : 'opacity-0 scale-50'}`} style={{ backgroundColor: getCategoryAccent(cat) }} />
                  {cat}
                </button>
              ))}
              <div 
                className="absolute bottom-[-1px] h-[2px] transition-all duration-500 ease-[cubic-bezier(0.2,0.8,0.2,1)] z-20"
                style={{ 
                  width: `${underlineStyle.width}px`, 
                  transform: `translateX(${underlineStyle.left}px)`,
                  backgroundColor: getCategoryAccent(activeCategory)
                }}
              />
            </nav>

            <div className="relative min-h-[500px]">
              <div className={`absolute inset-0 grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-x-10 gap-y-12 transition-opacity duration-300 ${isFiltering ? 'opacity-100 pointer-events-auto' : 'opacity-0 pointer-events-none'}`}>
                {[...Array(6)].map((_, i) => <SkeletonCard key={`skeleton-${i}`} />)}
              </div>

              <div className={`transition-all duration-500 ${isFiltering ? 'opacity-0 translate-y-2' : 'opacity-100 translate-y-0'}`}>
                {filteredArticles.length > 0 ? (
                  <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-x-10 gap-y-12">
                    {displayedArticles.map((article, index) => (
                      <ArticleCard key={`${article.id}-${index}`} article={article} onClick={() => window.location.hash = article.id} />
                    ))}
                  </div>
                ) : (
                  <div className="flex flex-col items-center justify-center py-32 md:py-48 text-center animate-fade-in">
                    <div className="w-12 h-[1px] bg-[#D3CDC0] mb-8"></div>
                    <h3 className="font-serif italic text-2xl text-slate-400 mb-3">Quiet reflection.</h3>
                    <p className="text-[11px] uppercase tracking-[0.3em] font-bold text-slate-400">
                      There are currently no curated pieces in <span className="text-slate-500">{activeCategory}</span>.
                    </p>
                    <button onClick={() => handleCategoryChange('All')} className="mt-10 text-[10px] uppercase tracking-[0.2em] font-bold text-[#2D2D2A] border-b border-[#2D2D2A]/30 hover:border-[#2D2D2A] transition-all pb-1">Return to Archive</button>
                  </div>
                )}
              </div>
            </div>

            <div ref={loaderRef} className="min-h-[150px] flex items-center justify-center mt-12">
              {hasMore && <div className="flex gap-1.5 py-8"><div className="w-1.5 h-1.5 bg-[#2D2D2A] rounded-full animate-bounce"></div><div className="w-1.5 h-1.5 bg-[#2D2D2A] rounded-full animate-bounce [animation-delay:-0.15s]"></div><div className="w-1.5 h-1.5 bg-[#2D2D2A] rounded-full animate-bounce [animation-delay:-0.3s]"></div></div>}
            </div>
          </div>
        )}

        {currentView === 'detail' && currentArticle && <ArticleDetail article={currentArticle} onBack={handleGoHome} />}

        {currentView === 'archive' && (
          <div className="pt-32 pb-24 px-6 md:px-12 max-w-4xl mx-auto reveal-item">
            <h1 className="font-serif italic text-4xl md:text-6xl mb-12 border-b border-[#D3CDC0] pb-8">The Archive</h1>
            <div className="flex flex-col gap-12">
              {[...articles].sort((a, b) => b.date.localeCompare(a.date)).map((article) => (
                <div key={article.id} className="group cursor-pointer flex justify-between items-baseline gap-8" onClick={(e) => { e.preventDefault(); window.location.hash = article.id; }}>
                  <div className="flex flex-col">
                    <span className="text-[10px] uppercase tracking-[0.3em] font-bold text-slate-400 mb-1">{article.date}</span>
                    <h2 className="text-xl md:text-2xl font-medium group-hover:text-slate-500 transition-colors">{article.title}</h2>
                  </div>
                  <span className="text-[10px] uppercase tracking-[0.2em] font-bold text-slate-500 whitespace-nowrap">{article.category}</span>
                </div>
              ))}
            </div>
          </div>
        )}

        {currentView === 'about' && (
          <div className="pt-32 pb-24 px-6 md:px-12 max-w-3xl mx-auto reveal-item">
            <h1 className="font-serif italic text-4xl md:text-6xl mb-12">Manifesto</h1>
            <div className="prose prose-lg">
              <p className="dropcap">Yu Content Platform G (YG) 并非为了填补空隙，而是为了创造空隙。在众声喧哗、信息如流沙般坍塌的当下，我们试图打捞那些被速度稀释的真实。</p>
              <p>这里没有算法的讨好，只有主观的、严苛的策展。我们关注造物之美、逻辑之魅，以及在技术冷峻的外壳下，那颗始终滚烫的人文内核。我们相信，真正改变世界的思想，从不诞生于15秒的碎片，而源于长久的凝视与反复的推敲。</p>
              <blockquote>“于万物静默处，听惊雷。”</blockquote>
              <p>YG 是一家致力于“观念策展”的独立平台。我们的设计遵循非对称极简主义，文字在这里不只是信息的载体，它是感官的延伸，是人类在技术丛林中为自己保留的一块“非工业化”呼吸区。</p>
              <p>这不仅是一个阅读界面，更是一场关于“如何夺回注意力”的无声革命。感谢你选择在此虚度时光。</p>
            </div>
          </div>
        )}

        {currentView === 'contact' && (
          <div className="pt-32 pb-24 px-6 md:px-12 max-w-3xl mx-auto reveal-item">
            <h1 className="font-serif italic text-4xl md:text-6xl mb-12">Connect</h1>
            <p className="text-xl text-slate-600 mb-16 leading-relaxed">如果有深度内容合作、策展建议，或仅仅想打个招呼，欢迎通过以下方式联系我们。</p>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-12 border-t border-[#D3CDC0] pt-12">
              <div className="flex flex-col gap-2">
                <span className="text-[10px] uppercase tracking-[0.3em] font-bold text-slate-400">Editorial Inquiry</span>
                <a href="mailto:1093137020@qq.com" className="text-xl font-medium border-b border-transparent hover:border-[#2D2D2A] w-fit transition-all">1093137020@qq.com</a>
              </div>
              <div className="flex flex-col gap-2">
                <span className="text-[10px] uppercase tracking-[0.3em] font-bold text-slate-400">Digital Presence</span>
                <div className="flex gap-6">
                  <a href="#" className="text-xl font-medium hover:text-slate-500 transition-colors">Instagram</a>
                  <a href="#" className="text-xl font-medium hover:text-slate-500 transition-colors">Twitter</a>
                </div>
              </div>
            </div>
          </div>
        )}
      </main>

      <Footer />
    </div>
  );
};

export default App;
