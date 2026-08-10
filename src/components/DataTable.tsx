import React from 'react';
import { Product } from '../types';
import { Star, TrendingUp, AlertCircle, Award, Eye, Bookmark, ExternalLink } from 'lucide-react';

interface DataTableProps {
  products: Product[];
  onSelectProduct: (product: Product) => void;
  savedProductIds?: string[];
  onToggleSaveProduct?: (productId: string) => void;
  density?: 'Comfortable' | 'Compact';
  theme?: 'dark' | 'light';
}

const formatCurrency = (amount: number) => {
  return new Intl.NumberFormat('en-US', {
    style: 'currency',
    currency: 'USD',
    maximumFractionDigits: 0,
  }).format(amount);
};

const formatNumber = (num: number) => {
  return new Intl.NumberFormat('en-US', { notation: 'compact', compactDisplay: 'short' }).format(num);
};

const getTagStyles = (tag: string, theme: 'dark' | 'light') => {
  if (theme === 'light') {
    if (tag.includes('Low Rating')) return 'bg-rose-100/80 text-rose-800 border-rose-300';
    if (tag.includes('Growing') || tag.includes('Revenue')) return 'bg-emerald-100/80 text-emerald-800 border-emerald-300';
    if (tag.includes('Leader')) return 'bg-amber-100/80 text-amber-800 border-amber-300';
    return 'bg-slate-200/80 text-slate-800 border-slate-300';
  }
  if (tag.includes('Low Rating')) return 'bg-rose-500/10 text-rose-400 border-rose-500/20';
  if (tag.includes('Growing') || tag.includes('Revenue')) return 'bg-emerald-500/10 text-emerald-400 border-emerald-500/20';
  if (tag.includes('Leader')) return 'bg-amber-500/10 text-amber-400 border-amber-500/20';
  return 'bg-zinc-800 text-zinc-300 border-zinc-700';
};

const getTagIcon = (tag: string) => {
  if (tag.includes('Low Rating')) return <AlertCircle className="w-3 h-3 mr-1 inline" />;
  if (tag.includes('Growing') || tag.includes('Revenue')) return <TrendingUp className="w-3 h-3 mr-1 inline" />;
  if (tag.includes('Leader')) return <Award className="w-3 h-3 mr-1 inline" />;
  return null;
};

export const DataTable: React.FC<DataTableProps> = ({ 
  products, 
  onSelectProduct, 
  savedProductIds = [], 
  onToggleSaveProduct, 
  density = 'Comfortable', 
  theme = 'dark' 
}) => {
  const cellPadding = density === 'Compact' ? 'px-4 py-2.5' : 'px-6 py-4';
  const headerPadding = density === 'Compact' ? 'px-4 py-2.5' : 'px-6 py-4';

  const isLight = theme === 'light';

  return (
    <div className="w-full space-y-4">
      {/* MOBILE CARDS VIEW (block md:hidden) */}
      <div className="block md:hidden space-y-3">
        {products.map((product) => {
          const isSaved = savedProductIds.includes(product.id);
          return (
            <div
              key={product.id}
              onClick={() => onSelectProduct(product)}
              className={`p-4 rounded-xl border transition-all cursor-pointer shadow-xs active:scale-[0.99] ${
                isLight ? 'bg-white border-slate-200 hover:border-purple-300' : 'bg-zinc-900/80 border-zinc-800 hover:border-purple-500/40'
              }`}
            >
              {/* Top row: Name & Category */}
              <div className="flex items-start justify-between gap-2 mb-2">
                <div>
                  <h4 className={`text-sm font-bold leading-snug ${isLight ? 'text-slate-900' : 'text-zinc-100'}`}>
                    {product.name}
                  </h4>
                  <p className={`text-xs ${isLight ? 'text-slate-500' : 'text-zinc-400'}`}>
                    by {product.creator}
                  </p>
                </div>
                <span className={`inline-flex items-center px-2 py-0.5 rounded text-[10px] font-semibold shrink-0 ${
                  isLight ? 'bg-slate-200/70 text-slate-800' : 'bg-zinc-800 text-zinc-300'
                }`}>
                  {product.category}
                </span>
              </div>

              {/* Metrics row: Revenue, Sales, Price, Rating */}
              <div className={`grid grid-cols-2 gap-2 py-2 border-y my-2 text-xs ${
                isLight ? 'border-slate-100' : 'border-zinc-800/60'
              }`}>
                <div>
                  <div className={`text-[10px] uppercase font-semibold ${isLight ? 'text-slate-400' : 'text-zinc-500'}`}>Est. Revenue</div>
                  <div className="font-extrabold text-emerald-500 text-sm">{formatCurrency(product.revenue)}</div>
                  <div className={`text-[10px] ${isLight ? 'text-slate-500' : 'text-zinc-400'}`}>{formatNumber(product.sales)} sales @ ${product.price}</div>
                </div>
                <div className="text-right">
                  <div className={`text-[10px] uppercase font-semibold ${isLight ? 'text-slate-400' : 'text-zinc-500'}`}>Rating</div>
                  <div className="flex items-center justify-end gap-1 font-bold text-amber-400">
                    {product.rating} <Star className="w-3.5 h-3.5 fill-amber-400 text-amber-500" />
                  </div>
                  <div className={`text-[10px] ${isLight ? 'text-slate-500' : 'text-zinc-400'}`}>({formatNumber(product.reviewCount)} reviews)</div>
                </div>
              </div>

              {/* Bottom Tags & Action */}
              <div className="flex items-center justify-between gap-2 mt-2 pt-1">
                <div className="flex gap-1.5 flex-wrap">
                  {product.tags.map(tag => (
                    <span 
                      key={tag} 
                      className={`inline-flex items-center px-2 py-0.5 rounded text-[10px] font-semibold border ${getTagStyles(tag, theme)}`}
                    >
                      {getTagIcon(tag)}
                      {tag}
                    </span>
                  ))}
                </div>

                <div className="flex items-center gap-1.5 shrink-0">
                  <button
                    onClick={(e) => {
                      e.stopPropagation();
                      onToggleSaveProduct?.(product.id);
                    }}
                    title={isSaved ? "Remove bookmark" : "Bookmark product"}
                    className={`p-1.5 rounded-lg border transition-all cursor-pointer ${
                      isSaved 
                        ? 'bg-purple-500/20 text-purple-400 border-purple-500/40' 
                        : isLight 
                        ? 'text-slate-400 border-slate-200 hover:text-purple-600' 
                        : 'text-zinc-400 border-zinc-800 hover:text-purple-400'
                    }`}
                  >
                    <Bookmark className={`w-3.5 h-3.5 ${isSaved ? 'fill-purple-400 text-purple-400' : ''}`} />
                  </button>
                  <span className="text-[11px] font-semibold text-purple-400 flex items-center gap-1">
                    Inspect <Eye className="w-3.5 h-3.5" />
                  </span>
                </div>
              </div>
            </div>
          );
        })}
      </div>

      {/* DESKTOP DATA TABLE (hidden md:block) */}
      <div className={`hidden md:block w-full overflow-x-auto rounded-xl border transition-colors shadow-sm ${
        isLight ? 'bg-white border-slate-200 shadow-slate-200/50' : 'bg-zinc-900/50 border-zinc-800'
      }`}>
        <table className="w-full text-left text-sm whitespace-nowrap">
          <thead className={isLight ? 'bg-slate-100/90 border-b border-slate-200 text-slate-700' : 'bg-zinc-900 border-b border-zinc-800 text-zinc-400'}>
            <tr>
              <th className={`${headerPadding} font-semibold`}>Product & Creator</th>
              <th className={`${headerPadding} font-semibold`}>Category</th>
              <th className={`${headerPadding} font-semibold`}>Price</th>
              <th className={`${headerPadding} font-semibold`}>Est. Volume / Rev</th>
              <th className={`${headerPadding} font-semibold`}>Rating</th>
              <th className={`${headerPadding} font-semibold`}>Opportunity Tag</th>
              <th className={`${headerPadding} font-semibold text-right`}>Actions</th>
            </tr>
          </thead>
          <tbody className={`divide-y ${isLight ? 'divide-slate-200/80' : 'divide-zinc-800/50'}`}>
            {products.map((product) => {
              const isSaved = savedProductIds.includes(product.id);
              return (
                <tr 
                  key={product.id} 
                  className={`transition-colors group cursor-pointer ${
                    isLight ? 'hover:bg-purple-50/50' : 'hover:bg-zinc-800/30'
                  }`}
                  onClick={() => onSelectProduct(product)}
                >
                  <td className={`${cellPadding} max-w-[200px] sm:max-w-[300px] lg:max-w-[400px]`}>
                    <div className={`font-medium truncate ${isLight ? 'text-slate-900 font-semibold' : 'text-zinc-100'}`} title={product.name}>{product.name}</div>
                    <div className={`text-xs mt-0.5 truncate ${isLight ? 'text-slate-500 font-medium' : 'text-zinc-500'}`} title={product.creator}>{product.creator}</div>
                  </td>
                  <td className={`${cellPadding} ${isLight ? 'text-slate-700' : 'text-zinc-300'}`}>
                    <span className={`inline-flex items-center px-2 py-1 rounded-md text-xs font-semibold ${
                      isLight ? 'bg-slate-200/70 text-slate-800' : 'bg-zinc-800/50 text-zinc-300'
                    }`}>
                      {product.category}
                    </span>
                  </td>
                  <td className={`${cellPadding} font-semibold ${isLight ? 'text-slate-900' : 'text-zinc-300'}`}>${product.price}</td>
                  <td className={cellPadding}>
                    <div className={`font-semibold ${isLight ? 'text-slate-900' : 'text-zinc-100'}`}>{formatCurrency(product.revenue)}</div>
                    <div className={`text-xs mt-0.5 ${isLight ? 'text-slate-500 font-medium' : 'text-zinc-500'}`}>{formatNumber(product.sales)} sales</div>
                  </td>
                  <td className={cellPadding}>
                    <div className={`flex items-center gap-1.5 font-semibold ${isLight ? 'text-slate-900' : 'text-zinc-100'}`}>
                      {product.rating}
                      <Star className="w-3.5 h-3.5 fill-amber-400 text-amber-500" />
                      <span className={`font-normal text-xs ml-1 ${isLight ? 'text-slate-500 font-medium' : 'text-zinc-500'}`}>({formatNumber(product.reviewCount)})</span>
                    </div>
                    {product.reviewBreakdown && (
                      <div className={`text-[10px] mt-1.5 flex gap-2 ${isLight ? 'text-slate-500 font-medium' : 'text-zinc-500'}`}>
                        <span title="4 Stars">4★ {product.reviewBreakdown.stars4}%</span>
                        <span title="3 Stars">3★ {product.reviewBreakdown.stars3}%</span>
                        <span title="2 Stars">2★ {product.reviewBreakdown.stars2}%</span>
                      </div>
                    )}
                  </td>
                  <td className={cellPadding}>
                    <div className="flex gap-2 flex-wrap">
                      {product.tags.map(tag => (
                        <span 
                          key={tag} 
                          className={`inline-flex items-center px-2 py-1 rounded-md border text-xs font-semibold ${getTagStyles(tag, theme)}`}
                        >
                          {getTagIcon(tag)}
                          {tag}
                        </span>
                      ))}
                    </div>
                  </td>
                  <td className={`${cellPadding} text-right`}>
                    <div className="flex justify-end gap-2">
                      <button 
                        className={`p-1.5 rounded-md transition-all cursor-pointer ${
                          isSaved 
                            ? 'text-purple-400 bg-purple-500/20 border border-purple-500/40 opacity-100' 
                            : isLight 
                            ? 'text-slate-400 hover:text-purple-600 hover:bg-purple-100/60 opacity-0 group-hover:opacity-100' 
                            : 'text-zinc-400 hover:text-purple-400 hover:bg-purple-500/10 opacity-0 group-hover:opacity-100'
                        }`}
                        title={isSaved ? "Remove bookmark" : "Save to list"}
                        onClick={(e) => {
                          e.stopPropagation();
                          onToggleSaveProduct?.(product.id);
                        }}
                      >
                        <Bookmark className={`w-4 h-4 ${isSaved ? 'fill-purple-400 text-purple-400' : ''}`} />
                      </button>
                      <a 
                        href={product.productUrl || `https://gumroad.com/discover?query=${encodeURIComponent(product.name)}`}
                        target="_blank"
                        rel="noopener noreferrer"
                        className={`p-1.5 rounded-md transition-colors opacity-0 group-hover:opacity-100 ${
                          isLight ? 'text-slate-400 hover:text-emerald-600 hover:bg-emerald-100/60' : 'text-zinc-400 hover:text-emerald-400 hover:bg-emerald-500/10'
                        }`}
                        title="View on Gumroad"
                        onClick={(e) => e.stopPropagation()}
                      >
                        <ExternalLink className="w-4 h-4" />
                      </a>
                      <button 
                        className={`p-1.5 rounded-md transition-colors opacity-0 group-hover:opacity-100 ${
                          isLight ? 'text-slate-400 hover:text-slate-900 hover:bg-slate-200/60' : 'text-zinc-400 hover:text-zinc-100 hover:bg-zinc-800'
                        }`}
                        title="View details"
                      >
                        <Eye className="w-4 h-4" />
                      </button>
                    </div>
                  </td>
                </tr>
              );
            })}
          </tbody>
        </table>
      </div>
    </div>
  );
};

