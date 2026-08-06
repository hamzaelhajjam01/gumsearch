import React from 'react';
import { motion } from 'framer-motion';
import { 
  Sparkles, TrendingUp, Award, Zap, CheckCircle2, ArrowRight
} from 'lucide-react';
import { CreatorFinderTool } from './CreatorFinderTool';
import { SharedNavbar } from './SharedNavbar';

interface CreatorFinderLandingPageProps {
  onLaunchApp: () => void;
  onNavigateHome: () => void;
  onNavigateCategory?: (slug: string) => void;
  onNavigateBlog?: () => void;
  onOpenFunnel?: () => void;
  theme?: 'dark' | 'light';
}

export const CreatorFinderLandingPage: React.FC<CreatorFinderLandingPageProps> = ({
  onLaunchApp,
  onNavigateHome,
  onNavigateCategory,
  onNavigateBlog,
  onOpenFunnel,
  theme = 'dark'
}) => {
  const isLight = theme === 'light';

  return (
    <div className={`min-h-screen font-sans selection:bg-purple-500/30 transition-colors duration-300 relative ${
      isLight ? 'bg-slate-50 text-slate-900' : 'bg-[#09090b] text-zinc-100'
    }`}>
      {/* Background Grid Pattern Overlay */}
      <div className="absolute inset-0 bg-[linear-gradient(to_right,#80808012_1px,transparent_1px),linear-gradient(to_bottom,#80808012_1px,transparent_1px)] bg-[size:36px_36px] pointer-events-none" />

      <SharedNavbar
        theme={theme}
        onNavigateHome={onNavigateHome}
        onNavigateCategory={onNavigateCategory}
        onNavigateBlog={onNavigateBlog}
        onLaunchDashboard={onLaunchApp}
        onOpenFunnel={onOpenFunnel}
        activePage="free-tool"
      />

      {/* Hero Section dedicated to Free Creator Search */}
      <section className="relative pt-12 sm:pt-16 pb-12 overflow-hidden">
        {/* Glow Spheres */}
        <div className="absolute top-10 left-1/2 -translate-x-1/2 w-[700px] h-[350px] bg-gradient-to-tr from-pink-600/20 via-purple-500/20 to-transparent rounded-full blur-[140px] pointer-events-none" />

        <div className="max-w-7xl mx-auto px-4 sm:px-6 relative z-10 text-center">
          {/* Badge */}
          <motion.div 
            initial={{ opacity: 0, y: 15 }}
            animate={{ opacity: 1, y: 0 }}
            className={`inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full border text-xs font-semibold mb-6 backdrop-blur-md font-mono ${
              isLight
                ? 'border-pink-200 bg-pink-50 text-pink-700'
                : 'border-pink-500/30 bg-pink-500/10 text-pink-300'
            }`}
          >
            <Sparkles className="w-3.5 h-3.5 text-pink-500" />
            <span>#1 Free Gumroad Creator Search & Competitor Leaderboard</span>
          </motion.div>

          {/* Headline */}
          <h1 className={`font-serif-heading text-4xl sm:text-6xl lg:text-7xl font-normal tracking-tight max-w-4xl mx-auto leading-tight ${
            isLight ? 'text-slate-900' : 'text-white'
          }`}>
            Find & Rank Top Gumroad Creators <br />
            <span className="font-serif-italic bg-gradient-to-r from-pink-500 via-purple-500 to-amber-500 bg-clip-text text-transparent font-normal">
              by Verified Sales Power
            </span>
          </h1>

          {/* Subtitle */}
          <p className={`mt-4 text-xs sm:text-base max-w-2xl mx-auto leading-relaxed font-sans ${
            isLight ? 'text-slate-600' : 'text-zinc-300'
          }`}>
            Our free public discovery engine ranks high-converting Gumroad storefronts by customer review volume, product catalog size, and revenue indicators. Discover market leaders in any niche in real-time.
          </p>

          {/* Feature Badges */}
          <div className={`mt-6 mb-10 flex flex-wrap items-center justify-center gap-4 sm:gap-6 text-xs font-mono ${
            isLight ? 'text-slate-600' : 'text-zinc-400'
          }`}>
            <div className="flex items-center gap-1.5">
              <CheckCircle2 className="w-4 h-4 text-emerald-500" /> Real Live Gumroad Stores
            </div>
            <div className={`hidden sm:block w-1 h-1 rounded-full ${isLight ? 'bg-slate-300' : 'bg-zinc-700'}`} />
            <div className="flex items-center gap-1.5">
              <CheckCircle2 className="w-4 h-4 text-pink-500" /> Zero-CORS Instant Search
            </div>
            <div className={`hidden sm:block w-1 h-1 rounded-full ${isLight ? 'bg-slate-300' : 'bg-zinc-700'}`} />
            <div className="flex items-center gap-1.5">
              <CheckCircle2 className="w-4 h-4 text-amber-500" /> Ranked by Review Power
            </div>
          </div>

          {/* THE LIVE CREATOR FINDER TOOL */}
          <div className={`shadow-2xl rounded-3xl border text-left max-w-5xl mx-auto ${
            isLight
              ? 'shadow-pink-500/5 border-slate-200 bg-white/95 backdrop-blur-2xl'
              : 'shadow-pink-500/10 border-zinc-800/80 bg-[#0c0c0e]/95 backdrop-blur-2xl'
          }`}>
            <CreatorFinderTool theme={theme} isPublicLanding={true} onOpenFunnel={onOpenFunnel} />
          </div>

          {/* SEO & Organic Traffic Content Grid */}
          <div className="mt-16 max-w-5xl mx-auto grid grid-cols-1 md:grid-cols-3 gap-6 text-left">
            <div className={`p-6 rounded-2xl border space-y-2.5 ${
              isLight ? 'bg-white border-slate-200' : 'bg-zinc-900/50 border-zinc-800/80'
            }`}>
              <div className="w-8 h-8 rounded-xl bg-pink-500/10 border border-pink-500/20 flex items-center justify-center">
                <TrendingUp className="w-4 h-4 text-pink-500" />
              </div>
              <h3 className={`font-serif-heading text-lg font-normal ${isLight ? 'text-slate-900' : 'text-zinc-100'}`}>
                How to Find Top Sellers on Gumroad?
              </h3>
              <p className={`text-xs leading-relaxed font-sans ${isLight ? 'text-slate-600' : 'text-zinc-400'}`}>
                Gumroad&apos;s standard search engine only matches creator usernames. Our Free Creator Search engine queries live storefront catalogs and review volume to rank true market leaders across Notion, Blender, AI prompts, and coding niches.
              </p>
            </div>

            <div className={`p-6 rounded-2xl border space-y-2.5 ${
              isLight ? 'bg-white border-slate-200' : 'bg-zinc-900/50 border-zinc-800/80'
            }`}>
              <div className="w-8 h-8 rounded-xl bg-amber-500/10 border border-amber-500/20 flex items-center justify-center">
                <Award className="w-4 h-4 text-amber-500" />
              </div>
              <h3 className={`font-serif-heading text-lg font-normal ${isLight ? 'text-slate-900' : 'text-zinc-100'}`}>
                Why Gumroad Competitor Research Matters
              </h3>
              <p className={`text-xs leading-relaxed font-sans ${isLight ? 'text-slate-600' : 'text-zinc-400'}`}>
                Analyzing successful digital product creators allows you to reverse-engineer proven pricing tiers, offer positioning, and product bundles before launching your own digital product.
              </p>
            </div>

            <div className={`p-6 rounded-2xl border space-y-2.5 ${
              isLight ? 'bg-white border-slate-200' : 'bg-zinc-900/50 border-zinc-800/80'
            }`}>
              <div className="w-8 h-8 rounded-xl bg-emerald-500/10 border border-emerald-500/20 flex items-center justify-center">
                <Zap className="w-4 h-4 text-emerald-500" />
              </div>
              <h3 className={`font-serif-heading text-lg font-normal ${isLight ? 'text-slate-900' : 'text-zinc-100'}`}>
                Real-Time Storefront Discovery
              </h3>
              <p className={`text-xs leading-relaxed font-sans ${isLight ? 'text-slate-600' : 'text-zinc-400'}`}>
                Our client-side zero-CORS discovery engine fetches live store listings in real-time, displaying product offerings, total reviews, and direct store links for complete competitive intelligence.
              </p>
            </div>
          </div>

          {/* SaaS Conversion Teaser Banner */}
          <div className={`mt-16 max-w-5xl mx-auto p-8 sm:p-10 rounded-3xl border shadow-2xl flex flex-col sm:flex-row items-center justify-between gap-6 text-left ${
            isLight
              ? 'bg-gradient-to-r from-purple-100 via-indigo-50 to-pink-50 border-purple-200'
              : 'bg-gradient-to-r from-purple-900/40 via-indigo-900/30 to-zinc-900 border-purple-500/30'
          }`}>
            <div className="space-y-2 max-w-xl">
              <div className={`inline-flex items-center gap-2 px-3 py-1 rounded-full text-xs font-bold font-mono ${
                isLight ? 'bg-purple-200/80 text-purple-800' : 'bg-purple-500/20 text-purple-300'
              }`}>
                <Sparkles className="w-3.5 h-3.5 text-purple-500" /> GumSearch Pro Intelligence Suite
              </div>
              <h3 className={`font-serif-heading text-2xl sm:text-3xl font-normal leading-snug ${
                isLight ? 'text-slate-900' : 'text-white'
              }`}>
                Unlock 100,000+ Gumroad Products & Revenue Analytics
              </h3>
              <p className={`text-xs sm:text-sm ${isLight ? 'text-slate-600' : 'text-zinc-300'}`}>
                Want deeper competitor metrics? Upgrade to GumSearch Pro to filter 100k+ products by exact revenue estimates, AI complaint teardowns, and historical pricing charts.
              </p>
            </div>

            <motion.button
              whileHover={{ scale: 1.04 }}
              whileTap={{ scale: 0.96 }}
              onClick={() => { if (onOpenFunnel) onOpenFunnel(); else onLaunchApp(); }}
              className="px-6 py-3.5 bg-gradient-to-r from-purple-600 to-indigo-600 hover:from-purple-500 hover:to-indigo-500 text-white text-xs font-black rounded-xl transition-all shadow-xl shadow-purple-600/30 flex items-center gap-2 shrink-0 cursor-pointer"
            >
              <span>Explore GumSearch Pro</span>
              <ArrowRight className="w-4 h-4" />
            </motion.button>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className={`py-12 border-t max-w-7xl mx-auto px-6 text-xs flex flex-col sm:flex-row items-center justify-between gap-4 ${
        isLight ? 'border-slate-200 text-slate-500' : 'border-zinc-800/60 text-zinc-500'
      }`}>
        <div className={`flex items-center gap-2 font-bold cursor-pointer ${isLight ? 'text-slate-900' : 'text-zinc-300'}`} onClick={onNavigateHome}>
          <div className="w-5 h-5 rounded-lg bg-gradient-to-tr from-purple-600 to-indigo-600 flex items-center justify-center text-white text-[10px]">
            G
          </div>
          GumSearch Free Tool
        </div>
        <div className="flex items-center gap-6">
          <button onClick={onNavigateHome} className={`transition-colors cursor-pointer ${isLight ? 'hover:text-slate-900' : 'hover:text-zinc-300'}`}>Main Landing Page</button>
          <button onClick={onLaunchApp} className={`transition-colors cursor-pointer ${isLight ? 'hover:text-slate-900' : 'hover:text-zinc-300'}`}>Pro Dashboard</button>
        </div>
        <div>
          © {new Date().getFullYear()} GumSearch Intelligence Engine. Not affiliated with Gumroad, Inc.
        </div>
      </footer>
    </div>
  );
};
