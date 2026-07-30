import React from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { Product } from '../types';
import { X, ExternalLink, Star, TrendingUp, BarChart3, Sparkles, Bookmark } from 'lucide-react';

interface ProductDrawerProps {
  product: Product | null;
  isOpen: boolean;
  onClose: () => void;
  savedProductIds?: string[];
  onToggleSaveProduct?: (productId: string) => void;
  theme?: 'dark' | 'light';
}

const formatCurrency = (amount: number) => {
  return new Intl.NumberFormat('en-US', {
    style: 'currency',
    currency: 'USD',
    maximumFractionDigits: 0,
  }).format(amount);
};

export const ProductDrawer: React.FC<ProductDrawerProps> = ({ 
  product, 
  isOpen, 
  onClose, 
  savedProductIds = [], 
  onToggleSaveProduct, 
  theme = 'dark' 
}) => {
  const isLight = theme === 'light';
  const isSaved = product ? savedProductIds.includes(product.id) : false;

  return (
    <AnimatePresence>
      {isOpen && product && (
        <>
          {/* Backdrop */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={onClose}
            className="fixed inset-0 bg-black/50 backdrop-blur-sm z-40"
          />
          
          {/* Drawer */}
          <motion.div
            initial={{ x: '100%' }}
            animate={{ x: 0 }}
            exit={{ x: '100%' }}
            transition={{ type: 'spring', damping: 25, stiffness: 200 }}
            className={`fixed right-0 top-0 bottom-0 w-full max-w-md border-l shadow-2xl z-50 overflow-y-auto flex flex-col transition-colors ${
              isLight ? 'bg-white border-slate-200 text-slate-900' : 'bg-zinc-900 border-zinc-800 text-zinc-100'
            }`}
          >
            {/* Header */}
            <div className={`flex items-start justify-between p-6 border-b sticky top-0 backdrop-blur-md z-10 ${
              isLight ? 'bg-white/90 border-slate-200' : 'bg-zinc-900/90 border-zinc-800/50'
            }`}>
              <div>
                <h2 className={`text-xl font-semibold ${isLight ? 'text-slate-900' : 'text-zinc-100'}`}>{product.name}</h2>
                <p className={`text-sm mt-1 ${isLight ? 'text-slate-500 font-medium' : 'text-zinc-400'}`}>by {product.creator}</p>
              </div>

              <div className="flex items-center gap-2">
                <button
                  onClick={() => onToggleSaveProduct?.(product.id)}
                  title={isSaved ? "Remove bookmark" : "Bookmark product"}
                  className={`p-2 rounded-lg transition-all cursor-pointer border ${
                    isSaved 
                      ? 'bg-purple-500/20 text-purple-400 border-purple-500/40 shadow-sm' 
                      : isLight 
                      ? 'text-slate-400 hover:text-purple-600 hover:bg-purple-50 border-slate-200' 
                      : 'text-zinc-400 hover:text-purple-400 hover:bg-zinc-800 border-zinc-800'
                  }`}
                >
                  <Bookmark className={`w-5 h-5 ${isSaved ? 'fill-purple-400 text-purple-400' : ''}`} />
                </button>
                <button 
                  onClick={onClose}
                  className={`p-2 rounded-lg transition-colors cursor-pointer ${
                    isLight ? 'text-slate-400 hover:text-slate-900 hover:bg-slate-100' : 'text-zinc-400 hover:text-zinc-100 hover:bg-zinc-800'
                  }`}
                >
                  <X className="w-5 h-5" />
                </button>
              </div>
            </div>

            {/* Content */}
            <div className="p-6 space-y-8 flex-1">
              
              {/* Core Stats */}
              <div className="grid grid-cols-2 gap-4">
                <div className={`rounded-xl p-4 border transition-colors ${
                  isLight ? 'bg-slate-50 border-slate-200 shadow-2xs' : 'bg-zinc-950 border-zinc-800/50'
                }`}>
                  <div className={`text-xs font-semibold uppercase tracking-wider ${isLight ? 'text-slate-500' : 'text-zinc-500'}`}>Est. Revenue</div>
                  <div className={`text-2xl font-bold mt-1 ${isLight ? 'text-slate-900' : 'text-zinc-100'}`}>{formatCurrency(product.revenue)}</div>
                  <div className="flex items-center gap-1 text-emerald-600 text-xs font-semibold mt-2">
                    <TrendingUp className="w-3 h-3" /> +12.5% this mo
                  </div>
                </div>
                <div className={`rounded-xl p-4 border transition-colors ${
                  isLight ? 'bg-slate-50 border-slate-200 shadow-2xs' : 'bg-zinc-950 border-zinc-800/50'
                }`}>
                  <div className={`text-xs font-semibold uppercase tracking-wider ${isLight ? 'text-slate-500' : 'text-zinc-500'}`}>Est. Sales</div>
                  <div className={`text-2xl font-bold mt-1 ${isLight ? 'text-slate-900' : 'text-zinc-100'}`}>{product.sales.toLocaleString()}</div>
                  <div className={`text-xs mt-2 ${isLight ? 'text-slate-500 font-medium' : 'text-zinc-500'}`}>At ${product.price}/unit</div>
                </div>
              </div>

              {/* AI Gap Analysis */}
              <div className={`relative overflow-hidden rounded-xl border p-5 transition-colors ${
                isLight 
                  ? 'bg-gradient-to-br from-purple-100/90 via-purple-50/60 to-white border-purple-200/90 shadow-sm' 
                  : 'bg-gradient-to-br from-purple-500/10 via-fuchsia-500/5 to-zinc-900 border-purple-500/20'
              }`}>
                <div className="flex items-center gap-2 mb-3">
                  <Sparkles className={`w-4 h-4 ${isLight ? 'text-purple-600' : 'text-purple-400'}`} />
                  <h3 className={`text-sm font-bold ${isLight ? 'text-purple-900' : 'text-purple-200'}`}>AI Gap Analysis</h3>
                </div>
                <p className={`text-sm leading-relaxed ${isLight ? 'text-slate-800 font-medium' : 'text-zinc-300'}`}>
                  {product.aiInsights}
                </p>
              </div>

              {/* Revenue History Chart */}
              <div>
                <div className="flex items-center justify-between mb-4">
                  <h3 className={`text-sm font-semibold flex items-center gap-2 ${isLight ? 'text-slate-900' : 'text-zinc-100'}`}>
                    <BarChart3 className={`w-4 h-4 ${isLight ? 'text-slate-500' : 'text-zinc-400'}`} />
                    Revenue History (6mo)
                  </h3>
                </div>
                <div className="h-32 flex items-end justify-between gap-1.5 px-2">
                  {[45, 60, 40, 80, 55, 95, 75, 110, 85, 100, 130, 115].map((h, i) => {
                    const monthlySnapshot = Math.round((product.revenue / 12) * (h / 85));
                    return (
                      <div 
                        key={i} 
                        className={`rounded-t-sm w-full transition-colors cursor-crosshair group relative ${
                          isLight ? 'bg-purple-500 hover:bg-purple-600' : 'bg-zinc-800 hover:bg-purple-500/80'
                        }`} 
                        style={{ height: `${Math.max(10, h * 0.7)}%` }}
                      >
                        <div className={`opacity-0 group-hover:opacity-100 absolute -top-8 left-1/2 -translate-x-1/2 text-[10px] py-1 px-2 rounded pointer-events-none whitespace-nowrap shadow-xl border ${
                          isLight ? 'bg-slate-900 text-white border-slate-800' : 'bg-zinc-800 text-zinc-100 border-zinc-700'
                        }`}>
                          {formatCurrency(monthlySnapshot)}
                        </div>
                      </div>
                    );
                  })}
                </div>
                <div className={`flex justify-between text-xs mt-2 border-t pt-2 px-2 ${
                  isLight ? 'text-slate-500 border-slate-200 font-medium' : 'text-zinc-500 border-zinc-800/50'
                }`}>
                  <span>Jan</span>
                  <span>Jun</span>
                </div>
              </div>

              {/* Review Breakdown */}
              <div>
                <h3 className={`text-sm font-semibold flex items-center gap-2 mb-4 ${isLight ? 'text-slate-900' : 'text-zinc-100'}`}>
                  <Star className={`w-4 h-4 ${isLight ? 'text-amber-500' : 'text-zinc-400'}`} />
                  Review Breakdown
                </h3>
                <div className="space-y-2">
                  {(() => {
                    const s4 = product.reviewBreakdown?.stars4 ?? 0;
                    const s3 = product.reviewBreakdown?.stars3 ?? 0;
                    const s2 = product.reviewBreakdown?.stars2 ?? 0;
                    const s1 = product.reviewBreakdown?.stars1 ?? 0;
                    const s5 = product.reviewBreakdown?.stars5 ?? Math.max(0, 100 - (s4 + s3 + s2 + s1));
                    return [
                      { stars: 5, pct: s5 },
                      { stars: 4, pct: s4 },
                      { stars: 3, pct: s3 },
                      { stars: 2, pct: s2 },
                      { stars: 1, pct: s1 },
                    ].map((row) => (
                      <div key={row.stars} className="flex items-center gap-3 text-sm">
                        <div className={`w-12 text-right text-xs font-semibold ${isLight ? 'text-slate-600' : 'text-zinc-400'}`}>{row.stars} stars</div>
                        <div className={`flex-1 h-2 rounded-full overflow-hidden border ${
                          isLight ? 'bg-slate-200 border-slate-300/60' : 'bg-zinc-950 border-zinc-800/50'
                        }`}>
                          <div 
                            className="h-full bg-amber-400 rounded-full" 
                            style={{ width: `${Math.min(100, Math.max(0, row.pct))}%` }} 
                          />
                        </div>
                        <div className={`w-8 text-xs font-semibold ${isLight ? 'text-slate-600' : 'text-zinc-500'}`}>{row.pct}%</div>
                      </div>
                    ));
                  })()}
                </div>
              </div>

            </div>

            {/* Footer */}
            <div className={`p-6 border-t mt-auto ${isLight ? 'bg-slate-50 border-slate-200' : 'bg-zinc-900 border-zinc-800/50'}`}>
              <a 
                href={product.productUrl || `https://gumroad.com/discover?query=${encodeURIComponent(product.name)}`}
                target="_blank"
                rel="noopener noreferrer"
                className="w-full py-2.5 px-4 bg-purple-600 hover:bg-purple-500 text-white rounded-lg font-semibold transition-colors flex items-center justify-center gap-2 shadow-sm"
              >
                Open in Source
                <ExternalLink className="w-4 h-4" />
              </a>
            </div>
          </motion.div>
        </>
      )}
    </AnimatePresence>
  );
};
