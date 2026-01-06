
import React, { useEffect, useRef, useState, useCallback, useMemo } from 'react';
import { Article } from '../types';

interface QuoteCardModalProps {
  quote: string;
  article: Article;
  onClose: () => void;
}

const THEME = {
  paper: '#F5F2ED', // 典藏米浆宣纸
  ink: '#1A1A1A',   // 浓墨
  seal: '#9D2928',  // 古法朱砂
  border: 'rgba(26, 26, 26, 0.08)',
};

export const QuoteCardModal: React.FC<QuoteCardModalProps> = ({ quote, article, onClose }) => {
  const [isRendering, setIsRendering] = useState(true);
  const [posterImage, setPosterImage] = useState<string | null>(null);
  const [serial] = useState(() => `YG-ARCHIVE-${Math.random().toString(36).substr(2, 4).toUpperCase()}`);

  // 1. 语义处理：提升文学意境
  const processedQuote = useMemo(() => {
    const text = quote.trim();
    if (!text) return "";
    const lastChar = text.slice(-1);
    const punctuations = ['。', '！', '？', '.', '!', '?', '”', '’', '…', '—', ';', '；'];
    return punctuations.includes(lastChar) ? text : text + ' ...';
  }, [quote]);

  // 2. 核心渲染引擎
  const drawCard = useCallback(async () => {
    const canvas = document.createElement('canvas');
    const ctx = canvas.getContext('2d', { alpha: false });
    if (!ctx) return;

    setIsRendering(true);
    const dpr = 2;
    const W = 1080;
    const H = 1440;
    canvas.width = W * dpr;
    canvas.height = H * dpr;
    ctx.scale(dpr, dpr);

    // --- A. 宣纸底层渲染 ---
    ctx.fillStyle = THEME.paper;
    ctx.fillRect(0, 0, W, H);
    
    // 渲染极细碎纸屑
    ctx.save();
    ctx.globalAlpha = 0.08;
    for (let i = 0; i < 30000; i++) {
      ctx.fillStyle = Math.random() > 0.6 ? '#ffffff' : '#444444';
      ctx.fillRect(Math.random() * W, Math.random() * H, 1.2, 1.2);
    }
    // 渲染长纤维纸筋
    ctx.strokeStyle = 'rgba(26, 26, 26, 0.03)';
    ctx.lineWidth = 0.4;
    for (let i = 0; i < 80; i++) {
      ctx.beginPath();
      const x = Math.random() * W;
      const y = Math.random() * H;
      const cp1x = x + (Math.random() - 0.5) * 50;
      const cp1y = y + (Math.random() - 0.5) * 50;
      const x2 = x + (Math.random() - 0.5) * 80;
      const y2 = y + (Math.random() - 0.5) * 20;
      ctx.moveTo(x, y);
      ctx.quadraticCurveTo(cp1x, cp1y, x2, y2);
      ctx.stroke();
    }
    ctx.restore();

    const MARGIN = 120;
    const FOOTER_ZONE_H = 380;

    // --- B. 纵向右起排版 ---
    ctx.save();
    const fontSize = processedQuote.length > 150 ? 36 : 48;
    ctx.font = `500 ${fontSize}px "Noto Sans SC"`; 
    ctx.fillStyle = THEME.ink;
    ctx.textBaseline = 'top';

    const charSpacing = fontSize * 0.16;
    const lineSpacing = fontSize * 1.95;
    const startX = W - MARGIN - 60;
    const startY = MARGIN + 40;

    let curX = startX;
    let curY = startY;

    const chars = processedQuote.split('');
    chars.forEach((char) => {
      // 触碰到页脚安全线则换列
      if (curY + fontSize > H - FOOTER_ZONE_H - 40) {
        curY = startY;
        curX -= lineSpacing;
      }

      const isPunc = /[，。！？、；：”’）]/.test(char);
      if (isPunc) {
        ctx.save();
        ctx.translate(curX + fontSize * 0.38, curY - fontSize * 0.1);
        ctx.fillText(char, 0, 0);
        ctx.restore();
      } else {
        ctx.fillText(char, curX, curY);
      }
      curY += fontSize + charSpacing;
    });
    ctx.restore();

    // --- C. 底部版权与出处 (左下布局，杜绝重叠) ---
    const separatorY = H - FOOTER_ZONE_H + 120;
    ctx.save();
    ctx.strokeStyle = THEME.border;
    ctx.lineWidth = 1;
    ctx.beginPath();
    ctx.moveTo(MARGIN, separatorY);
    ctx.lineTo(W - MARGIN, separatorY);
    ctx.stroke();

    // 计算标题最大宽度，确保不触碰右侧印章
    const infoX = MARGIN + 180; 
    const sealSafeWidth = 220; // 印章及其呼吸感空间
    const maxTextWidth = W - MARGIN - infoX - sealSafeWidth; 
    
    ctx.fillStyle = THEME.ink;
    ctx.font = 'italic 600 32px "Newsreader"';
    ctx.fillText(`《${article.title}》`, infoX, separatorY + 65, maxTextWidth);
    
    ctx.font = '700 12px "Inter"';
    ctx.fillStyle = 'rgba(0,0,0,0.35)';
    ctx.letterSpacing = '4px';
    ctx.fillText(`${article.author.toUpperCase()} / YG ARCHIVE COLLECTION`, infoX, separatorY + 120, maxTextWidth);
    ctx.restore();

    // --- D. 真实二维码 ---
    const qrSize = 130;
    const qrX = MARGIN;
    const qrY = H - MARGIN - qrSize;
    
    try {
      const qrUrl = `https://api.qrserver.com/v1/create-qr-code/?size=200x200&data=${encodeURIComponent(window.location.href)}&color=1a1a1a&bgcolor=f5f2ed`;
      const qrImg = new Image();
      qrImg.crossOrigin = "anonymous";
      qrImg.src = qrUrl;
      await new Promise((resolve) => {
        qrImg.onload = resolve;
        qrImg.onerror = resolve; 
      });
      if (qrImg.complete && qrImg.naturalWidth > 0) {
        ctx.drawImage(qrImg, qrX, qrY, qrSize, qrSize);
        ctx.strokeStyle = THEME.border;
        ctx.strokeRect(qrX - 6, qrY - 6, qrSize + 12, qrSize + 12);
        ctx.fillStyle = 'rgba(0,0,0,0.25)';
        ctx.font = 'bold 9px "Inter"';
        ctx.fillText('DIGITAL TRACE', qrX, qrY - 15);
      }
    } catch (e) { console.warn("QR Error"); }

    // --- E. 朱砂印章 13.0 (高保真篆刻仿真) ---
    ctx.save();
    const sealRadius = 62;
    const sealX = W - MARGIN - sealRadius;
    const sealY = H - MARGIN - sealRadius;
    ctx.translate(sealX, sealY);
    ctx.rotate(-0.04);

    // 1. 模拟印泥浸润与多重压力
    for (let i = 0; i < 6; i++) {
      ctx.save();
      // 第一层是实底，后续层模拟不规则的印泥渗出
      ctx.globalAlpha = i === 0 ? 0.98 : 0.08;
      ctx.fillStyle = THEME.seal;
      ctx.beginPath();
      const segments = 120;
      for (let s = 0; s <= segments; s++) {
        const angle = (s / segments) * Math.PI * 2;
        // 关键算法：叠加多频随机噪声产生真实的破碎边缘
        const noise = (Math.random() - 0.5) * (i === 0 ? 3.5 : 9) + 
                      Math.sin(angle * 8) * 1.5 + 
                      Math.cos(angle * 15) * 0.8;
        const r = sealRadius + noise;
        ctx.lineTo(Math.cos(angle) * r, Math.sin(angle) * r);
      }
      ctx.fill();
      ctx.restore();
    }

    // 2. 文字镂空
    ctx.fillStyle = THEME.paper;
    ctx.font = 'italic bold 52px "Newsreader"';
    ctx.textAlign = 'center';
    ctx.textBaseline = 'middle';
    
    // 模拟手工刻字的非对称与位移
    ctx.save();
    ctx.translate(-24, 6);
    ctx.rotate(-0.12);
    ctx.scale(0.98, 1.02);
    ctx.fillText('Y', 0, 0);
    ctx.restore();
    
    ctx.save();
    ctx.translate(26, -4);
    ctx.rotate(0.08);
    ctx.scale(1.05, 0.95);
    ctx.fillText('G', 0, 0);
    ctx.restore();

    // 3. 物理剥落与微裂纹仿真
    ctx.globalCompositeOperation = 'destination-out';
    
    // 裂缝/划痕仿真
    ctx.strokeStyle = '#000';
    ctx.lineWidth = 0.8;
    for (let j = 0; j < 12; j++) {
      ctx.beginPath();
      const lx = (Math.random() - 0.5) * sealRadius * 1.8;
      const ly = (Math.random() - 0.5) * sealRadius * 1.8;
      const len = 5 + Math.random() * 20;
      const ang = Math.random() * Math.PI * 2;
      ctx.moveTo(lx, ly);
      ctx.lineTo(lx + Math.cos(ang) * len, ly + Math.sin(ang) * len);
      ctx.stroke();
    }

    // 斑驳点阵：模拟纸张纹理导致的印泥未触及区
    for (let k = 0; k < 180; k++) {
      const a = Math.random() * Math.PI * 2;
      const d = Math.sqrt(Math.random()) * (sealRadius + 5);
      const pSize = 0.6 + Math.random() * 2.2;
      // 边缘处分布更多噪点
      if (d > sealRadius * 0.8 || Math.random() > 0.6) {
        ctx.fillRect(Math.cos(a) * d, Math.sin(a) * d, pSize, pSize);
      }
    }
    ctx.restore();

    setPosterImage(canvas.toDataURL('image/png', 1.0));
    setIsRendering(false);
  }, [processedQuote, article]);

  useEffect(() => {
    const timer = setTimeout(() => drawCard(), 300);
    return () => clearTimeout(timer);
  }, [drawCard]);

  const handleDownload = () => {
    if (!posterImage) return;
    const link = document.createElement('a');
    link.download = `YG_Poster_Archive_${serial}.png`;
    link.href = posterImage;
    link.click();
  };

  return (
    <div className="fixed inset-0 z-[100] flex items-center justify-center p-4 md:p-8 animate-fade-in">
      <div className="absolute inset-0 bg-[#D3CDC0]/45 backdrop-blur-[45px]" onClick={onClose} />
      
      <div className="relative w-full max-w-5xl bg-[#F5F2ED] shadow-[0_80px_160px_rgba(45,45,42,0.22)] overflow-hidden flex flex-col md:flex-row h-[90vh] md:h-auto rounded-[3.5rem] border border-white/70">
        
        {/* 海报区 */}
        <div className="flex-[5] bg-[#EAE7E0] p-6 md:p-14 flex items-center justify-center relative">
          <div className="relative w-full max-w-[380px] aspect-[3/4] shadow-[0_50px_100px_rgba(0,0,0,0.18)] bg-white overflow-hidden ring-1 ring-black/5">
             
             {/* 骨架屏加载过渡 */}
             {isRendering && (
               <div className="absolute inset-0 bg-white flex flex-col p-10 md:p-14">
                  <div className="flex-1 flex flex-row-reverse gap-8">
                    <div className="w-10 h-full bg-[#F5F2ED] animate-pulse rounded-full" />
                    <div className="w-10 h-4/5 bg-[#F5F2ED] animate-pulse rounded-full" />
                    <div className="w-10 h-2/3 bg-[#F5F2ED] animate-pulse rounded-full" />
                  </div>
                  <div className="h-[1.5px] bg-[#F5F2ED] w-full my-12" />
                  <div className="h-12 w-2/3 bg-[#F5F2ED] animate-pulse rounded-xl" />
                  <div className="h-4 w-1/3 bg-[#F5F2ED] animate-pulse mt-5 rounded-lg" />
                  <div className="absolute bottom-12 right-12 w-28 h-28 rounded-full bg-[#F5F2ED] animate-pulse" />
               </div>
             )}

             {posterImage && (
               <img 
                src={posterImage} 
                className={`w-full h-full object-contain transition-opacity duration-1000 ${isRendering ? 'opacity-0' : 'opacity-100'}`} 
                alt="Artisan Poster v13" 
               />
             )}
          </div>
          <div className="absolute bottom-6 right-8 text-[9px] font-bold text-black/15 tracking-[0.6em] select-none pointer-events-none uppercase">
            Artisan Traditional Archive v13.0
          </div>
        </div>

        {/* 面板区 */}
        <div className="flex-[3] bg-[#F5F2ED] p-8 md:p-12 flex flex-col border-l border-[#D3CDC0]/80">
          <div className="flex-grow">
            <header className="mb-10">
              <span className="text-[10px] uppercase tracking-[0.4em] font-bold text-slate-400 mb-3 block">Poster Collector</span>
              <h2 className="text-4xl font-serif italic text-[#2D2D2A] leading-tight">传统典藏金句卡</h2>
              <p className="text-[12px] text-slate-500 mt-5 leading-relaxed font-normal">
                已在页脚区域强制执行物理避让逻辑，确保标题与印章的视觉呼吸感。印章 v13.0 模拟了朱砂古法拓印产生的崩边与微裂纹质感。
              </p>
            </header>

            <div className="p-8 bg-black/5 rounded-[2.5rem] border border-black/5 space-y-5">
               <div className="flex justify-between items-center text-[10px] font-bold tracking-widest text-slate-500 uppercase">
                 <span>档案标识</span>
                 <span className="text-black font-mono">{serial}</span>
               </div>
               <div className="flex justify-between items-center text-[10px] font-bold tracking-widest text-slate-500 uppercase">
                 <span>排版规范</span>
                 <span className="text-black">纵向右起 (R-L Vertical)</span>
               </div>
               <div className="flex justify-between items-center text-[10px] font-bold tracking-widest text-slate-500 uppercase">
                 <span>工艺模拟</span>
                 <span className="text-black">金石篆刻 / 宣纸纸筋</span>
               </div>
            </div>
          </div>

          <div className="flex flex-col gap-4 mt-12">
            <button 
              onClick={handleDownload}
              disabled={isRendering || !posterImage}
              className="w-full bg-[#2D2D2A] text-[#F5F2ED] py-6 text-xs font-bold hover:bg-black transition-all flex items-center justify-center gap-4 shadow-2xl shadow-black/10 rounded-2xl active:scale-[0.98] disabled:opacity-30 group"
            >
              <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5"><path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4M7 10l5 5 5-5M12 15V3"/></svg>
              {isRendering ? '朱砂拓印中...' : '保存典藏海报'}
            </button>
            <button 
              onClick={onClose}
              className="w-full py-4 text-[10px] uppercase tracking-[0.4em] text-slate-400 hover:text-[#2D2D2A] transition-colors font-bold text-center"
            >
              放弃并返回
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};
