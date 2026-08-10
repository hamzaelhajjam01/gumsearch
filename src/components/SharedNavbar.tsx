import React from 'react';
import { CHROME_EXTENSION_URL } from '../constants';
import { Activity, Sparkles } from 'lucide-react';
import { BrowseDropdown } from './BrowseDropdown';
import { ClerkHeaderAuth } from './ClerkHeaderAuth';

interface SharedNavbarProps {
  theme?: 'dark' | 'light';
  onNavigateHome: () => void;
  onNavigateFreeTool?: () => void;
  onNavigateCategory?: (slug: string) => void;
  onNavigateBlog?: () => void;
  onLaunchDashboard: () => void;
  onOpenFunnel?: () => void;
  /** Which nav item is currently active */
  activePage?: 'home' | 'free-tool' | 'category' | 'blog';
}

export const SharedNavbar: React.FC<SharedNavbarProps> = ({
  theme = 'dark',
  onNavigateHome,
  onNavigateFreeTool,
  onNavigateCategory,
  onNavigateBlog,
  onLaunchDashboard,
  onOpenFunnel,
  activePage = 'home',
}) => {
  const isLight = theme === 'light';

  const handleNavAnchor = (hash: string) => {
    // If we're already on the main landing page, just scroll
    const el = document.getElementById(hash);
    if (el) {
      el.scrollIntoView({ behavior: 'smooth' });
    } else {
      // Navigate home first, then scroll after render
      onNavigateHome();
      setTimeout(() => {
        const target = document.getElementById(hash);
        if (target) {
          target.scrollIntoView({ behavior: 'smooth' });
        }
      }, 150);
    }
  };

  return (
    <header className={`sticky top-0 z-50 border-b backdrop-blur-xl transition-colors ${
      isLight ? 'bg-white/80 border-slate-200/80 shadow-xs' : 'bg-[#09090b]/80 border-zinc-800/80'
    }`}>
      <div className="max-w-7xl mx-auto px-6 h-16 flex items-center justify-between">
        {/* Logo */}
        <div className="flex items-center gap-3 cursor-pointer" onClick={onNavigateHome}>
          <div className="w-8 h-8 rounded-lg bg-gradient-to-tr from-purple-600 to-indigo-600 flex items-center justify-center text-white font-bold shadow-md shadow-purple-500/20">
            <Activity className="w-5 h-5" />
          </div>
          <span className="text-lg font-bold tracking-tight bg-gradient-to-r from-white via-zinc-200 to-zinc-400 bg-clip-text text-transparent">
            GumSearch
          </span>
          <span className="hidden sm:inline-block ml-2 px-2 py-0.5 rounded-full text-[10px] font-semibold bg-purple-500/10 text-purple-400 border border-purple-500/20">
            v2.0 Real-Time
          </span>
        </div>

        {/* Navigation Links */}
        <div className="hidden md:flex items-center gap-6 text-xs font-semibold uppercase tracking-wider text-zinc-400">
          <BrowseDropdown 
            onSelectCategory={(slug) => onNavigateCategory?.(slug)} 
            onOpenFunnel={onOpenFunnel}
            theme={theme} 
          />
          <a 
            href={CHROME_EXTENSION_URL}
            target="_blank"
            rel="noopener noreferrer"
            className="transition-colors flex items-center gap-1 cursor-pointer text-purple-400 hover:text-purple-300 font-bold"
          >
            <Sparkles className="w-3 h-3 text-purple-400" /> Chrome Extension
          </a>
          <button 
            onClick={onNavigateBlog}
            className={`transition-colors cursor-pointer ${
              activePage === 'blog'
                ? 'text-purple-400 font-bold'
                : 'hover:text-white'
            }`}
          >
            Blog
          </button>
          <button onClick={() => handleNavAnchor('bento')} className="hover:text-white transition-colors cursor-pointer">
            Features
          </button>
          <button onClick={() => handleNavAnchor('comparison')} className="hover:text-white transition-colors cursor-pointer">
            Comparison
          </button>
          <button onClick={() => handleNavAnchor('testimonials')} className="hover:text-white transition-colors cursor-pointer">
            Testimonials
          </button>
          <button onClick={() => handleNavAnchor('pricing')} className="hover:text-white transition-colors cursor-pointer">
            Pricing
          </button>
        </div>

        {/* Auth */}
        <div className="flex items-center gap-3">
          <ClerkHeaderAuth theme={theme} onLaunchDashboard={onLaunchDashboard} onOpenFunnel={onOpenFunnel} />
        </div>
      </div>
    </header>
  );
};
