
import React from 'react';

export const SkeletonCard: React.FC = () => {
  return (
    <div className="flex flex-col gap-3 mb-4 opacity-60">
      {/* Image Placeholder */}
      <div className="relative aspect-[16/10] overflow-hidden bg-[#E2DDD1] shimmer" />
      
      {/* Text Placeholders */}
      <div className="flex flex-col gap-3 max-w-2xl pt-2">
        <div className="flex items-center gap-3">
          <div className="w-16 h-2 bg-[#D3CDC0] shimmer" />
          <div className="w-1 h-1 bg-slate-400 rounded-full"></div>
          <div className="w-12 h-2 bg-[#D3CDC0] shimmer" />
        </div>
        <div className="w-full h-6 bg-[#D3CDC0] shimmer mb-1" />
        <div className="space-y-2">
          <div className="w-full h-3 bg-[#D3CDC0] shimmer" />
          <div className="w-4/5 h-3 bg-[#D3CDC0] shimmer" />
        </div>
      </div>
    </div>
  );
};
