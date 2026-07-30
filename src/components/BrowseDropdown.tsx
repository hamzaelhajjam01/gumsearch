import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { CATEGORIES_DATA } from './CategoryLandingPage';
import { 
  ChevronDown, 
  Sparkles, 
  Briefcase, 
  Code, 
  Layers, 
  Palette, 
  GraduationCap, 
  HeartPulse, 
  BookOpen, 
  Music,
  ArrowRight,
  TrendingUp
} from 'lucide-react';

interface BrowseDropdownProps {
  onSelectCategory: (categorySlug: string) => void;
  onOpenFunnel?: () => void;
  theme?: 'dark' | 'light';
}

const getCategoryIcon = (iconName: string) => {
  switch (iconName) {
    case 'Briefcase': return <Briefcase className="w-4 h-4 text-purple-400" />;
    case 'Code': return <Code className="w-4 h-4 text-purple-400" />;
    case 'Layers': return <Layers className="w-4 h-4 text-purple-400" />;
    case 'Palette': return <Palette className="w-4 h-4 text-purple-400" />;
    case 'GraduationCap': return <GraduationCap className="w-4 h-4 text-purple-400" />;
    case 'HeartPulse': return <HeartPulse className="w-4 h-4 text-purple-400" />;
    case 'BookOpen': return <BookOpen className="w-4 h-4 text-purple-400" />;
    case 'Music': return <Music className="w-4 h-4 text-purple-400" />;
    default: return <Sparkles className="w-4 h-4 text-purple-400" />;
  }
};

export const BrowseDropdown: React.FC<BrowseDropdownProps> = ({ onSelectCategory, onOpenFunnel, theme = 'dark' }) => {
  const [isOpen, setIsOpen] = useState(false);
  const isLight = theme === 'light';

  return (
    <div 
      className="relative"
      onMouseEnter={() => setIsOpen(true)}
      onMouseLeave={() => setIsOpen(false)}
    >
      {/* Trigger Button */}
      <button
        onClick={() => setIsOpen(!isOpen)}
        className={`flex items-center gap-1.5 text-sm font-bold transition-colors cursor-pointer py-2 px-3 rounded-lg ${
          isOpen
            ? 'text-purple-400 bg-purple-500/10'
            : isLight
            ? 'text-slate-800 hover:text-purple-600 hover:bg-slate-100'
            : 'text-zinc-300 hover:text-white hover:bg-zinc-900/80'
        }`}
      >
        <span>Browse</span>
        <ChevronDown className={`w-4 h-4 transition-transform duration-200 ${isOpen ? 'rotate-180 text-purple-400' : 'text-zinc-500'}`} />
      </button>

      {/* Mega Menu Dropdown */}
      <AnimatePresence>
        {isOpen && (
          <motion.div
            initial={{ opacity: 0, y: 10, scale: 0.98 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: 8, scale: 0.98 }}
            transition={{ duration: 0.18, ease: 'easeOut' }}
            className={`absolute left-0 top-full mt-1 w-[340px] sm:w-[580px] p-4 sm:p-6 rounded-2xl border shadow-2xl z-50 backdrop-blur-2xl ${
              isLight 
                ? 'bg-white/95 border-slate-200 text-slate-900 shadow-purple-900/10' 
                : 'bg-zinc-950/95 border-zinc-800 text-zinc-100 shadow-purple-950/40'
            }`}
          >
            {/* Top Bar Callout */}
            <div className="flex items-center justify-between pb-3 mb-4 border-b border-zinc-800/80 text-xs">
              <div className="flex items-center gap-2 text-purple-400 font-bold uppercase tracking-wider">
                <Sparkles className="w-3.5 h-3.5 text-amber-400" />
                <span>Product Category Hubs</span>
              </div>
              <span className="text-zinc-500 hidden sm:inline">Updated Daily</span>
            </div>

            {/* 2-Column Grid of Categories */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
              {Object.values(CATEGORIES_DATA).map((cat) => (
                <div
                  key={cat.slug}
                  onClick={() => {
                    onSelectCategory(cat.slug);
                    setIsOpen(false);
                  }}
                  className={`p-3 rounded-xl border transition-all cursor-pointer group flex items-start gap-3 ${
                    isLight
                      ? 'bg-slate-50/80 border-slate-200 hover:border-purple-300 hover:bg-purple-50/50'
                      : 'bg-zinc-900/60 border-zinc-800/80 hover:border-purple-500/40 hover:bg-zinc-900/90'
                  }`}
                >
                  <div className="p-2 rounded-lg bg-purple-500/10 border border-purple-500/20 shrink-0 group-hover:scale-105 transition-transform">
                    {getCategoryIcon(cat.iconName)}
                  </div>
                  <div className="min-w-0">
                    <div className="flex items-center justify-between gap-1">
                      <span className="text-xs font-bold text-white group-hover:text-purple-300 transition-colors truncate">
                        {cat.name}
                      </span>
                      <span className="text-[10px] font-extrabold text-purple-400 bg-purple-500/10 px-1.5 py-0.5 rounded shrink-0">
                        View Insights
                      </span>
                    </div>
                    <p className="text-[11px] text-zinc-400 truncate mt-0.5">
                      {cat.tagline}
                    </p>
                  </div>
                </div>
              ))}
            </div>

            {/* Footer banner */}
            <div 
              onClick={() => {
                if (onOpenFunnel) {
                  onOpenFunnel();
                  setIsOpen(false);
                }
              }}
              className={`mt-4 pt-3 border-t flex items-center justify-between text-xs cursor-pointer group ${
                isLight ? 'border-slate-100 text-slate-600 hover:text-purple-600' : 'border-zinc-800/80 text-zinc-400 hover:text-white'
              }`}
            >
              <span className="flex items-center gap-1">
                <TrendingUp className="w-3.5 h-3.5 text-emerald-400" />
                <span>Track pricing, market gaps & organic search trends</span>
              </span>
              <span className="text-purple-400 font-bold flex items-center gap-1 group-hover:translate-x-1 transition-transform">
                Explore All <ArrowRight className="w-3 h-3" />
              </span>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};
