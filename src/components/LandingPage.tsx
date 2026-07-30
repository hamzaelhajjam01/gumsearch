import React, { useState } from 'react';
import { 
  ArrowRight, CheckCircle2, DollarSign, Sparkles, 
  TrendingUp, Zap, Star, ChevronRight, Play, Cpu, Database, 
  Award
} from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import { SharedNavbar } from './SharedNavbar';
import { CreatorFinderTool } from './CreatorFinderTool';

interface LandingPageProps {
  onLaunchApp: () => void;
  onLaunchFreeDashboard?: () => void;
  onNavigateCategory?: (categorySlug: string) => void;
  onNavigateFreeTool?: () => void;
  onNavigateBlog?: () => void;
  onNavigateLegal?: (page: 'terms' | 'privacy') => void;
  onOpenFunnel?: () => void;
  theme?: 'dark' | 'light';
}

// Sample live demo data for the interactive hero preview
const DEMO_PRODUCTS = [
  {
    id: 1,
    name: "Small Bets - Lifetime Membership",
    creator: "Daniel Vassallo",
    category: "Business",
    price: 450,
    revenue: 3326400,
    sales: 7392,
    rating: 4.9,
    reviews: 189,
    tag: "High Opportunity",
    tagColor: "bg-purple-500/10 text-purple-400 border-purple-500/30",
    insight: "High upfront price creates friction. Opportunity for budget-friendly $29/mo recurring sub-communities with structured accountability."
  },
  {
    id: 2,
    name: "Ultimate Notion Life OS",
    creator: "ProductivityPro",
    category: "Templates",
    price: 49,
    revenue: 610050,
    sales: 12450,
    rating: 4.8,
    reviews: 1420,
    tag: "Fast Growing",
    tagColor: "bg-emerald-500/10 text-emerald-400 border-emerald-500/30",
    insight: "Strong demand for modular Notion setups. High potential for automated sync tools and verticalized niche variants."
  },
  {
    id: 3,
    name: "1000+ ChatGPT Prompts",
    creator: "AI Whisperer",
    category: "AI Tools",
    price: 15,
    revenue: 277500,
    sales: 18500,
    rating: 3.9,
    reviews: 2100,
    tag: "Mixed Reviews",
    tagColor: "bg-amber-500/10 text-amber-400 border-amber-500/30",
    insight: "Mixed rating (3.9/5) indicates buyers want interactive web apps/APIs rather than static copy-paste text files."
  },
  {
    id: 4,
    name: "Mastering Next.js 15",
    creator: "CodeGuru",
    category: "Education",
    price: 79,
    revenue: 165900,
    sales: 2100,
    rating: 4.7,
    reviews: 890,
    tag: "Consistent",
    tagColor: "bg-indigo-500/10 text-indigo-400 border-indigo-500/30",
    insight: "High satisfaction. Expansion opportunity: offer matching Figma design system & Next.js starter boilerplate."
  }
];

export const LandingPage: React.FC<LandingPageProps> = ({ 
  onLaunchApp, 
  onLaunchFreeDashboard, 
  onNavigateCategory, 
  onNavigateFreeTool,
  onNavigateBlog,
  onNavigateLegal,
  onOpenFunnel, 
  theme = 'dark' 
}) => {
  const isLight = theme === 'light';
  const [activeTab, setActiveTab] = useState<'All' | 'High Opportunity' | 'Low Rating'>('All');
  const [selectedDemoProduct, setSelectedDemoProduct] = useState(DEMO_PRODUCTS[0]);
  const [billingCycle, setBillingCycle] = useState<'monthly' | 'annual'>('annual');

  const filteredDemoProducts = DEMO_PRODUCTS.filter(p => {
    if (activeTab === 'High Opportunity') return p.tag.includes('Opportunity') || p.revenue > 500000;
    if (activeTab === 'Low Rating') return p.rating < 4.0;
    return true;
  });

  return (
    <div className={`min-h-screen font-sans selection:bg-purple-500/30 transition-colors duration-300 relative ${
      isLight ? 'bg-slate-50 text-slate-900' : 'bg-[#09090b] text-zinc-100'
    }`}>
      
      {/* Background Grid Pattern Overlay */}
      <div className="absolute inset-0 bg-[linear-gradient(to_right,#80808012_1px,transparent_1px),linear-gradient(to_bottom,#80808012_1px,transparent_1px)] bg-[size:36px_36px] pointer-events-none" />

      <SharedNavbar
        theme={theme}
        onNavigateHome={() => window.scrollTo({ top: 0, behavior: 'smooth' })}
        onNavigateFreeTool={onNavigateFreeTool}
        onNavigateCategory={onNavigateCategory}
        onNavigateBlog={onNavigateBlog}
        onLaunchDashboard={onLaunchApp}
        onOpenFunnel={onOpenFunnel}
        activePage="home"
      />

      {/* ORIGINAL HERO SECTION */}
      <section className="relative pt-24 pb-20 overflow-hidden">
        {/* Animated Glow Spheres */}
        <motion.div 
          animate={{ 
            scale: [1, 1.08, 1],
            opacity: [0.35, 0.55, 0.35]
          }}
          transition={{
            duration: 8,
            repeat: Infinity,
            ease: "easeInOut"
          }}
          className="absolute top-10 left-1/2 -translate-x-1/2 w-[700px] h-[350px] bg-gradient-to-tr from-purple-600/25 via-indigo-500/20 to-transparent rounded-full blur-[140px] pointer-events-none" 
        />

        <div className="max-w-7xl mx-auto px-6 relative z-10 text-center">
          {/* Announcement Badge */}
          <motion.div 
            initial={{ opacity: 0, y: 15 }}
            animate={{ opacity: 1, y: 0 }}
            whileHover={{ scale: 1.03 }}
            transition={{ duration: 0.5 }}
            onClick={() => { if (onOpenFunnel) onOpenFunnel(); else onLaunchApp(); }}
            className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full border border-purple-500/30 bg-purple-500/10 text-purple-300 text-xs font-semibold mb-8 backdrop-blur-md shadow-inner cursor-pointer"
          >
            <Sparkles className="w-3.5 h-3.5 text-purple-400" />
            <span>AI-Powered Digital Product Intelligence for Gumroad</span>
            <ChevronRight className="w-3.5 h-3.5 text-purple-400" />
          </motion.div>

          {/* Hero Headline */}
          <motion.h1 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.1 }}
            className="font-serif-heading text-4xl sm:text-7xl lg:text-[96px] font-normal tracking-tight max-w-5xl mx-auto leading-[1.05] sm:leading-[1.02] text-[#0f172a] dark:text-zinc-100"
          >
            Discover Winning Digital Products{' '}
            <span className="bg-gradient-to-r from-purple-400 via-indigo-300 to-amber-300 bg-clip-text text-transparent font-serif-italic font-normal">
              Before Anyone Else
            </span>
          </motion.h1>

          {/* Hero Subtitle */}
          <motion.p 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.2 }}
            className={`mt-4 sm:mt-6 text-base sm:text-xl max-w-2xl mx-auto leading-relaxed font-normal ${
              isLight ? 'text-slate-600' : 'text-zinc-400'
            }`}
          >
            GumSearch continuously ingests thousands of digital products, computes ground-truth sales revenue, and uses AI to uncover buyer complaints & market gaps.
          </motion.p>

          {/* Hero CTAs */}
          <motion.div 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.3 }}
            className="mt-8 sm:mt-10 flex flex-col sm:flex-row items-center justify-center gap-4"
          >
            <motion.button
              whileHover={{ scale: 1.04, y: -2 }}
              whileTap={{ scale: 0.96 }}
              onClick={() => { if (onOpenFunnel) onOpenFunnel(); else onLaunchApp(); }}
              className="w-full sm:w-auto px-8 py-4 bg-gradient-to-r from-purple-600 to-indigo-600 hover:from-purple-500 hover:to-indigo-500 text-white font-bold text-sm rounded-xl transition-all shadow-xl shadow-purple-600/30 flex items-center justify-center gap-3 cursor-pointer"
            >
              <Play className="w-4 h-4 fill-white" />
              Explore Live Database
            </motion.button>

            <motion.button
              whileHover={{ scale: 1.03, y: -1 }}
              whileTap={{ scale: 0.97 }}
              onClick={onNavigateFreeTool}
              className="w-full sm:w-auto px-8 py-4 bg-pink-500/10 border border-pink-500/30 text-pink-300 font-bold text-sm rounded-xl transition-all flex items-center justify-center gap-2 cursor-pointer hover:bg-pink-500/20"
            >
              <Sparkles className="w-4 h-4 text-pink-400" />
              Try Free Creator Finder
            </motion.button>
          </motion.div>

          {/* Social Proof Line */}
          <motion.div 
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.8, delay: 0.4 }}
            className="mt-10 sm:mt-12 flex flex-wrap items-center justify-center gap-3 sm:gap-6 text-xs text-zinc-500 font-medium"
          >
            <div className="flex items-center gap-1.5">
              <CheckCircle2 className="w-4 h-4 text-emerald-400" /> 100% Ground-Truth Data
            </div>
            <div className="hidden sm:block w-1 h-1 rounded-full bg-zinc-700" />
            <div className="flex items-center gap-1.5">
              <CheckCircle2 className="w-4 h-4 text-purple-400" /> AI Gap Analysis
            </div>
            <div className="hidden sm:block w-1 h-1 rounded-full bg-zinc-700" />
            <div className="flex items-center gap-1.5">
              <CheckCircle2 className="w-4 h-4 text-amber-400" /> 1,500+ Scraped Daily
            </div>
          </motion.div>
        </div>
      </section>

      {/* INTERACTIVE HERO PREVIEW WIDGET */}
      <section id="demo" className="py-8 sm:py-12 max-w-6xl mx-auto px-4 sm:px-6 relative z-20">
        <div className={`rounded-2xl border shadow-2xl overflow-hidden transition-all backdrop-blur-2xl ${
          isLight ? 'bg-white/90 border-slate-200 shadow-slate-200' : 'bg-zinc-900/80 border-zinc-800 shadow-purple-950/20'
        }`}>
          {/* Top Widget Bar */}
          <div className={`px-4 sm:px-6 py-3.5 sm:py-4 border-b flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3 sm:gap-4 ${
            isLight ? 'bg-slate-100/80 border-slate-200' : 'bg-zinc-950/80 border-zinc-800/80'
          }`}>
            <div className="flex items-center gap-2.5">
              <div className="w-2.5 h-2.5 rounded-full bg-rose-500/80" />
              <div className="w-2.5 h-2.5 rounded-full bg-amber-500/80" />
              <div className="w-2.5 h-2.5 rounded-full bg-emerald-500/80" />
              <span className="ml-1 text-[11px] sm:text-xs font-mono text-zinc-400">GumSearch Intelligence Engine</span>
            </div>

            {/* Filter Pills inside demo */}
            <div className="flex items-center gap-1.5 bg-zinc-900/90 p-1 rounded-xl border border-zinc-800 w-full sm:w-auto justify-between sm:justify-start">
              {(['All', 'High Opportunity', 'Low Rating'] as const).map(tab => (
                <button
                  key={tab}
                  onClick={() => setActiveTab(tab)}
                  className={`px-3 py-1 rounded-lg text-xs transition-all cursor-pointer ${
                    activeTab === tab ? 'bg-purple-600 text-white font-semibold shadow-sm' : 'text-zinc-400 hover:text-zinc-200'
                  }`}
                >
                  {tab}
                </button>
              ))}
            </div>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-12 gap-0 min-h-[440px]">
            {/* Left Column: Product List */}
            <div className={`lg:col-span-5 border-b lg:border-b-0 lg:border-r p-3 sm:p-4 space-y-2.5 ${
              isLight ? 'bg-slate-50/50 border-slate-200' : 'bg-zinc-950/40 border-zinc-800/80'
            }`}>
              <div className="text-[11px] font-bold uppercase tracking-wider text-zinc-500 px-2 mb-2 flex items-center justify-between">
                <span>Trending Products</span>
                <span>{filteredDemoProducts.length} results</span>
              </div>
              {filteredDemoProducts.map(p => (
                <motion.div
                  key={p.id}
                  whileHover={{ scale: 1.01 }}
                  onClick={() => setSelectedDemoProduct(p)}
                  className={`p-3.5 rounded-xl border transition-all cursor-pointer text-left ${
                    selectedDemoProduct.id === p.id 
                      ? 'bg-purple-600/15 border-purple-500 shadow-md shadow-purple-500/5' 
                      : isLight 
                        ? 'bg-white hover:bg-slate-100 border-slate-200' 
                        : 'bg-zinc-900/60 hover:bg-zinc-900 border-zinc-800/80'
                  }`}
                >
                  <div className="flex items-start justify-between gap-2 mb-1">
                    <span className="font-bold text-xs sm:text-sm text-zinc-100 line-clamp-1">{p.name}</span>
                    <span className={`px-2 py-0.5 rounded text-[10px] font-bold border shrink-0 ${p.tagColor}`}>
                      {p.tag}
                    </span>
                  </div>
                  <div className="flex items-center justify-between text-xs text-zinc-400">
                    <span>by {p.creator}</span>
                    <span className="font-bold text-zinc-200">${p.price}</span>
                  </div>
                  <div className="mt-2.5 flex items-center gap-3 text-[11px] font-mono text-zinc-400 pt-2 border-t border-zinc-800/40">
                    <span className="flex items-center gap-1 text-emerald-400 font-bold">
                      <DollarSign className="w-3 h-3" />
                      {(p.revenue / 1000).toFixed(0)}k est. rev
                    </span>
                    <span>•</span>
                    <span className="flex items-center gap-1 text-amber-400 font-medium">
                      <Star className="w-3 h-3 fill-amber-400" />
                      {p.rating} ({p.reviews})
                    </span>
                  </div>
                </motion.div>
              ))}
            </div>

            {/* Right Column: Deep Dive Intelligence Panel */}
            <div className={`lg:col-span-7 p-6 sm:p-8 flex flex-col justify-between text-left ${
              isLight ? 'bg-white' : 'bg-zinc-900/30'
            }`}>
              <div>
                <div className="flex items-center justify-between mb-4">
                  <span className="px-2.5 py-1 rounded-full text-xs font-bold bg-purple-500/10 text-purple-400 border border-purple-500/20">
                    {selectedDemoProduct.category}
                  </span>
                  <div className="flex items-center gap-1 text-xs text-emerald-400 font-bold font-mono">
                    <TrendingUp className="w-3.5 h-3.5" />
                    Top 1% in Niche
                  </div>
                </div>

                <h3 className="text-xl sm:text-2xl font-black text-zinc-100 tracking-tight mb-2">
                  {selectedDemoProduct.name}
                </h3>
                <p className="text-xs sm:text-sm text-zinc-400 mb-6">
                  Created by <strong className="text-zinc-200">{selectedDemoProduct.creator}</strong> • Active Offer: <strong className="text-zinc-200">${selectedDemoProduct.price}</strong>
                </p>

                {/* Key Metrics Grid */}
                <div className="grid grid-cols-3 gap-3 mb-6 font-mono">
                  <div className="p-3 rounded-xl bg-zinc-900/80 border border-zinc-800/80">
                    <span className="text-[10px] text-zinc-500 uppercase block font-sans font-bold">Est. Revenue</span>
                    <span className="text-base sm:text-lg font-black text-emerald-400">
                      ${(selectedDemoProduct.revenue / 1000).toFixed(1)}k
                    </span>
                  </div>
                  <div className="p-3 rounded-xl bg-zinc-900/80 border border-zinc-800/80">
                    <span className="text-[10px] text-zinc-500 uppercase block font-sans font-bold">Total Sales</span>
                    <span className="text-base sm:text-lg font-black text-zinc-200">
                      {selectedDemoProduct.sales.toLocaleString()}
                    </span>
                  </div>
                  <div className="p-3 rounded-xl bg-zinc-900/80 border border-zinc-800/80">
                    <span className="text-[10px] text-zinc-500 uppercase block font-sans font-bold">Rating Score</span>
                    <span className="text-base sm:text-lg font-black text-amber-400 flex items-center gap-1">
                      {selectedDemoProduct.rating} ★
                    </span>
                  </div>
                </div>

                {/* AI Gap Insight Card */}
                <div className="p-4 rounded-xl bg-gradient-to-r from-purple-500/10 via-indigo-500/10 to-transparent border border-purple-500/30">
                  <div className="flex items-center gap-2 text-xs font-bold text-purple-300 mb-1.5">
                    <Sparkles className="w-3.5 h-3.5 text-purple-400" />
                    AI Opportunity & Gap Teardown
                  </div>
                  <p className="text-xs sm:text-sm text-zinc-300 leading-relaxed font-sans">
                    {selectedDemoProduct.insight}
                  </p>
                </div>
              </div>

              <div className="mt-8 pt-4 border-t border-zinc-800/60 flex flex-col sm:flex-row items-stretch sm:items-center justify-between gap-3">
                <span className="text-xs text-zinc-500 text-center sm:text-left font-sans">
                  Want to inspect 100,000+ more Gumroad products?
                </span>
                <motion.button
                  whileHover={{ scale: 1.04 }}
                  whileTap={{ scale: 0.96 }}
                  onClick={() => { if (onOpenFunnel) onOpenFunnel(); else onLaunchApp(); }}
                  className="px-5 py-2.5 bg-gradient-to-r from-pink-500 to-purple-600 hover:from-pink-400 hover:to-purple-500 text-white text-xs font-black rounded-xl transition-all shadow-lg shadow-pink-500/20 cursor-pointer flex items-center justify-center gap-1.5"
                >
                  <span>Unlock Full Competitor Database</span>
                  <ArrowRight className="w-3.5 h-3.5" />
                </motion.button>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* PUBLIC SEO TOOL & CREATOR SEARCH LEADERBOARD SECTION */}
      <section id="free-tool" aria-labelledby="seo-tool-heading" className="py-16 sm:py-20 max-w-6xl mx-auto px-4 sm:px-6 relative z-20">
        <div className="text-center space-y-4 mb-8">
          <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full bg-gradient-to-r from-pink-500/10 to-purple-500/10 border border-pink-500/20 text-pink-400 text-xs font-bold font-mono">
            <Sparkles className="w-3.5 h-3.5 text-pink-400" />
            <span>Free Instant Competitor Research Tool</span>
          </div>
          <h2 id="seo-tool-heading" className="text-3xl sm:text-4xl md:text-5xl font-black tracking-tight bg-gradient-to-r from-white via-zinc-100 to-zinc-400 bg-clip-text text-transparent font-sans">
            Rank & Spy on Top Gumroad Creators by Niche
          </h2>
          <p className="text-sm sm:text-base text-zinc-400 max-w-2xl mx-auto font-sans leading-relaxed">
            Our free public analytics engine ranks the highest-converting Gumroad storefronts by verified customer review volume, active product count, and revenue indicators. Discover who dominates your market in real-time.
          </p>
        </div>

        {/* Embedded CreatorFinderTool */}
        <div className="shadow-2xl shadow-pink-500/10 rounded-3xl border border-zinc-800/80 bg-[#0c0c0e]/90 backdrop-blur-xl">
          <CreatorFinderTool theme={theme} isPublicLanding={true} onOpenFunnel={onOpenFunnel} />
        </div>
      </section>

      {/* BENTO BOX FEATURES GRID */}
      <section id="bento" className="py-16 sm:py-24 max-w-7xl mx-auto px-4 sm:px-6">
        <div className="text-center max-w-2xl mx-auto mb-12 sm:mb-16">
          <span className="text-xs font-bold uppercase tracking-widest text-purple-400">Architected for Creators</span>
          <h2 className="font-serif-heading text-3xl sm:text-5xl lg:text-6xl font-normal tracking-tight mt-2">Built Differently for Market Teardowns</h2>
          <p className="mt-3 text-sm sm:text-base text-zinc-400 font-normal">
            Every component designed from the ground up to give indie hackers, digital creators, and SaaS founders an unfair research advantage.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {/* Card 1: Ground-Truth Revenue Engine */}
          <motion.div 
            whileHover={{ y: -4 }}
            className={`md:col-span-2 p-8 sm:p-10 rounded-3xl border relative overflow-hidden flex flex-col justify-between ${
              isLight ? 'bg-white border-slate-200 shadow-xl shadow-slate-100' : 'bg-gradient-to-br from-zinc-900/90 to-zinc-900/40 border-zinc-800/80 shadow-2xl'
            }`}
          >
            <div className="max-w-md z-10">
              <div className="w-10 h-10 rounded-2xl bg-emerald-500/10 border border-emerald-500/20 flex items-center justify-center mb-6">
                <Database className="w-5 h-5 text-emerald-400" />
              </div>
              <h3 className="font-serif-heading text-2xl sm:text-3xl font-normal text-zinc-100">
                Ground-Truth Revenue Valuation
              </h3>
              <p className="mt-3 text-sm text-zinc-400 leading-relaxed font-normal">
                No guessing or inflated social media claims. Our ingestion engine correlates real-time sales velocity, review volume multipliers, and verified pricing tiers to calculate exact product gross revenue.
              </p>
            </div>

            {/* Visual Mockup inside Card 1 */}
            <div className="mt-8 pt-6 border-t border-zinc-800/60 grid grid-cols-3 gap-3 sm:gap-4 text-left font-mono">
              <div className="p-3.5 rounded-2xl bg-zinc-950/60 border border-zinc-800/80">
                <span className="text-[10px] text-zinc-500 uppercase block">Est. Monthly Vol</span>
                <span className="text-base sm:text-lg font-bold text-emerald-400">$48,200.00</span>
              </div>
              <div className="p-3.5 rounded-2xl bg-zinc-950/60 border border-zinc-800/80">
                <span className="text-[10px] text-zinc-500 uppercase block">Verified Reviews</span>
                <span className="text-base sm:text-lg font-bold text-purple-400">1,429 avg</span>
              </div>
              <div className="p-3.5 rounded-2xl bg-zinc-950/60 border border-zinc-800/80">
                <span className="text-[10px] text-zinc-500 uppercase block">Conversion Rate</span>
                <span className="text-base sm:text-lg font-bold text-amber-400">4.82%</span>
              </div>
            </div>
          </motion.div>

          {/* Card 2: AI Market Gap Detection */}
          <motion.div 
            whileHover={{ y: -4 }}
            className={`p-8 sm:p-10 rounded-3xl border relative overflow-hidden flex flex-col justify-between ${
              isLight ? 'bg-white border-slate-200 shadow-xl shadow-slate-100' : 'bg-gradient-to-br from-zinc-900/90 to-zinc-900/40 border-zinc-800/80 shadow-2xl'
            }`}
          >
            <div>
              <div className="w-10 h-10 rounded-2xl bg-purple-500/10 border border-purple-500/20 flex items-center justify-center mb-6">
                <Cpu className="w-5 h-5 text-purple-400" />
              </div>
              <h3 className="font-serif-heading text-2xl sm:text-3xl font-normal text-zinc-100">
                AI Gap & Opportunity Synthesis
              </h3>
              <p className="mt-3 text-sm text-zinc-400 leading-relaxed font-normal">
                We feed 10,000+ buyer reviews and product descriptions into LLMs to extract exact customer friction points, missing features, and unserved sub-niches.
              </p>
            </div>

            <div className="mt-6 p-4 rounded-2xl bg-purple-500/5 border border-purple-500/20 text-xs text-purple-300 font-mono space-y-1.5">
              <div className="flex items-center gap-1.5 font-bold text-purple-400">
                <Sparkles className="w-3.5 h-3.5" /> High Opportunity Detected
              </div>
              <div className="text-zinc-400 text-[11px] font-sans">
                &ldquo;Buyers of Notion CRM templates constantly request automated Stripe invoicing sync...&rdquo;
              </div>
            </div>
          </motion.div>

          {/* Card 3: 0ms Search & Filtering */}
          <motion.div 
            whileHover={{ y: -4 }}
            className={`p-8 sm:p-10 rounded-3xl border relative overflow-hidden flex flex-col justify-between ${
              isLight ? 'bg-white border-slate-200 shadow-xl shadow-slate-100' : 'bg-gradient-to-br from-zinc-900/90 to-zinc-900/40 border-zinc-800/80 shadow-2xl'
            }`}
          >
            <div>
              <div className="w-10 h-10 rounded-2xl bg-amber-500/10 border border-amber-500/20 flex items-center justify-center mb-6">
                <Zap className="w-5 h-5 text-amber-400" />
              </div>
              <h3 className="font-serif-heading text-2xl sm:text-3xl font-normal text-zinc-100">
                Sub-Millisecond Filtering
              </h3>
              <p className="mt-3 text-sm text-zinc-400 leading-relaxed font-normal">
                Slice through 100,000+ products by revenue bracket, rating threshold, publication date, and creator portfolio size instantly.
              </p>
            </div>

            <div className="mt-6 flex flex-wrap gap-2 pt-4 border-t border-zinc-800/60">
              <span className="px-3 py-1 rounded-full text-xs font-mono bg-zinc-800 text-zinc-300 border border-zinc-700">Rev &gt; $10k/mo</span>
              <span className="px-3 py-1 rounded-full text-xs font-mono bg-zinc-800 text-zinc-300 border border-zinc-700">Rating &lt; 4.2</span>
              <span className="px-3 py-1 rounded-full text-xs font-mono bg-zinc-800 text-zinc-300 border border-zinc-700">Notion CRM</span>
            </div>
          </motion.div>

          {/* Card 4: Historical Price Tracking */}
          <motion.div 
            whileHover={{ y: -4 }}
            className={`md:col-span-2 p-8 sm:p-10 rounded-3xl border relative overflow-hidden flex flex-col justify-between ${
              isLight ? 'bg-white border-slate-200 shadow-xl shadow-slate-100' : 'bg-gradient-to-br from-zinc-900/90 to-zinc-900/40 border-zinc-800/80 shadow-2xl'
            }`}
          >
            <div className="max-w-md z-10">
              <div className="w-10 h-10 rounded-2xl bg-rose-500/10 border border-rose-500/20 flex items-center justify-center mb-6">
                <TrendingUp className="w-5 h-5 text-rose-400" />
              </div>
              <h3 className="font-serif-heading text-2xl sm:text-3xl font-normal text-zinc-100">
                Historical Pricing & Offer Evolution
              </h3>
              <p className="mt-3 text-sm text-zinc-400 leading-relaxed font-normal">
                Track how top creators tweak their pricing over time. See exact dates when creators switch from one-time purchases to recurring memberships or launch limited-time bundle discounts.
              </p>
            </div>

            <div className="mt-8 pt-6 border-t border-zinc-800/60 flex items-center justify-between text-xs font-mono text-zinc-400">
              <div className="flex items-center gap-2">
                <span className="w-2 h-2 rounded-full bg-emerald-400 animate-ping" />
                <span>24/7 Storefront Monitoring Active</span>
              </div>
              <span className="text-zinc-500">Updated 2m ago</span>
            </div>
          </motion.div>
        </div>
      </section>

      {/* FEATURE COMPARISON TABLE */}
      <section id="comparison" className="py-16 sm:py-24 max-w-5xl mx-auto px-4 sm:px-6 relative z-20">
        <div className="text-center max-w-2xl mx-auto mb-12 sm:mb-16">
          <span className="text-xs font-bold uppercase tracking-widest text-pink-400">Why Switch to GumSearch</span>
          <h2 className="font-serif-heading text-3xl sm:text-5xl lg:text-6xl font-normal tracking-tight mt-2">The Unfair Research Advantage</h2>
          <p className="mt-3 text-sm sm:text-base text-zinc-400 font-normal">
            See how GumSearch compares against traditional manual research and generic scraper tools.
          </p>
        </div>

        <div className={`rounded-3xl border shadow-2xl overflow-hidden transition-all backdrop-blur-xl ${
          isLight ? 'bg-white/95 border-slate-200 shadow-slate-200' : 'bg-zinc-900/80 border-zinc-800 shadow-purple-950/20'
        }`}>
          <div className="overflow-x-auto">
            <table className="w-full text-left border-collapse">
              <thead>
                <tr className={`border-b ${isLight ? 'border-slate-200 bg-slate-50' : 'border-zinc-800 bg-zinc-950/50'}`}>
                  <th className="py-5 px-6 text-xs font-bold uppercase tracking-wider text-zinc-400">Capability / Feature</th>
                  <th className="py-5 px-6 text-xs font-bold uppercase tracking-wider text-zinc-500">Manual Research</th>
                  <th className="py-5 px-6 text-xs font-bold uppercase tracking-wider text-zinc-500">Generic Scrapers</th>
                  <th className="py-5 px-6 text-xs font-bold uppercase tracking-wider text-purple-400 bg-purple-500/5 border-x border-purple-500/20">
                    <div className="flex items-center gap-1.5">
                      <Sparkles className="w-3.5 h-3.5 text-purple-400" />
                      <span>GumSearch Pro</span>
                    </div>
                  </th>
                </tr>
              </thead>
              <tbody className="divide-y divide-zinc-800/60 text-xs sm:text-sm font-sans">
                <tr>
                  <td className="py-4 px-6 font-semibold text-zinc-200">Revenue Estimation Accuracy</td>
                  <td className="py-4 px-6 text-zinc-500">Wild guesses</td>
                  <td className="py-4 px-6 text-zinc-500">Inaccurate raw counts</td>
                  <td className="py-4 px-6 font-bold text-emerald-400 bg-purple-500/5 border-x border-purple-500/20 flex items-center gap-1.5">
                    <CheckCircle2 className="w-4 h-4 text-emerald-400 shrink-0" /> Ground-Truth Multipliers
                  </td>
                </tr>
                <tr>
                  <td className="py-4 px-6 font-semibold text-zinc-200">AI Buyer Complaint & Gap Teardowns</td>
                  <td className="py-4 px-6 text-rose-400/80">❌ None</td>
                  <td className="py-4 px-6 text-rose-400/80">❌ None</td>
                  <td className="py-4 px-6 font-bold text-purple-300 bg-purple-500/5 border-x border-purple-500/20">
                    ⚡ Instant LLM Analysis
                  </td>
                </tr>
                <tr>
                  <td className="py-4 px-6 font-semibold text-zinc-200">Search & Filtering Speed</td>
                  <td className="py-4 px-6 text-zinc-500">Hours of scrolling</td>
                  <td className="py-4 px-6 text-zinc-500">Slow page loads (5-10s)</td>
                  <td className="py-4 px-6 font-bold text-amber-300 bg-purple-500/5 border-x border-purple-500/20">
                    🚀 0ms In-Memory Engine
                  </td>
                </tr>
                <tr>
                  <td className="py-4 px-6 font-semibold text-zinc-200">Historical Price & Offer Tracking</td>
                  <td className="py-4 px-6 text-rose-400/80">❌ Impossible</td>
                  <td className="py-4 px-6 text-rose-400/80">❌ None</td>
                  <td className="py-4 px-6 font-bold text-zinc-200 bg-purple-500/5 border-x border-purple-500/20">
                    📈 Daily Snapshot Archives
                  </td>
                </tr>
                <tr>
                  <td className="py-4 px-6 font-semibold text-zinc-200">Niche Leaderboards & Tagging</td>
                  <td className="py-4 px-6 text-rose-400/80">❌ None</td>
                  <td className="py-4 px-6 text-zinc-500">Basic keywords only</td>
                  <td className="py-4 px-6 font-bold text-indigo-300 bg-purple-500/5 border-x border-purple-500/20">
                    🏷️ 30+ Automated Niche Tags
                  </td>
                </tr>
              </tbody>
            </table>
          </div>
        </div>
      </section>

      {/* USER TESTIMONIALS */}
      <section id="testimonials" className="py-16 sm:py-24 max-w-7xl mx-auto px-4 sm:px-6 relative z-20">
        <div className="text-center max-w-2xl mx-auto mb-12 sm:mb-16">
          <span className="text-xs font-bold uppercase tracking-widest text-amber-400">Loved by 2,500+ Founders</span>
          <h2 className="font-serif-heading text-3xl sm:text-5xl lg:text-6xl font-normal tracking-tight mt-2">What Top Creators Say</h2>
          <p className="mt-3 text-sm sm:text-base text-zinc-400 font-normal">
            See how entrepreneurs use GumSearch to find profitable product ideas and dominate their niches.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <motion.div whileHover={{ y: -4 }} className="p-6 sm:p-8 rounded-3xl bg-zinc-900/60 border border-zinc-800/80 flex flex-col justify-between shadow-xl">
            <div className="space-y-4">
              <div className="flex items-center gap-1 text-amber-400">
                {[...Array(5)].map((_, i) => <Star key={i} className="w-4 h-4 fill-amber-400" />)}
              </div>
              <p className="text-sm text-zinc-300 leading-relaxed font-normal">
                &ldquo;Before GumSearch, I spent 15 hours a week manually checking Gumroad category pages. Now I just filter by &apos;High Opportunity&apos; and get validated product ideas with verified revenue in 5 seconds.&rdquo;
              </p>
            </div>
            <div className="mt-6 pt-6 border-t border-zinc-800/60 flex items-center gap-3">
              <div className="w-10 h-10 rounded-full bg-purple-500/20 border border-purple-500/40 flex items-center justify-center font-bold text-purple-300 text-sm">
                AL
              </div>
              <div>
                <h4 className="text-sm font-bold text-zinc-200">Alex Rivera</h4>
                <p className="text-xs text-zinc-500">Notion Creator ($140k+ rev)</p>
              </div>
            </div>
          </motion.div>

          <motion.div whileHover={{ y: -4 }} className="p-6 sm:p-8 rounded-3xl bg-zinc-900/60 border border-zinc-800/80 flex flex-col justify-between shadow-xl">
            <div className="space-y-4">
              <div className="flex items-center gap-1 text-amber-400">
                {[...Array(5)].map((_, i) => <Star key={i} className="w-4 h-4 fill-amber-400" />)}
              </div>
              <p className="text-sm text-zinc-300 leading-relaxed font-normal">
                &ldquo;The AI Gap Analysis feature is sheer cheat-code level. It showed me that buyers of 3D Blender assets hated poor file documentation. I launched a well-documented asset pack and hit $8,500 in 30 days.&rdquo;
              </p>
            </div>
            <div className="mt-6 pt-6 border-t border-zinc-800/60 flex items-center gap-3">
              <div className="w-10 h-10 rounded-full bg-emerald-500/20 border border-emerald-500/40 flex items-center justify-center font-bold text-emerald-300 text-sm">
                MK
              </div>
              <div>
                <h4 className="text-sm font-bold text-zinc-200">Marcus Klein</h4>
                <p className="text-xs text-zinc-500">3D Studio Founder</p>
              </div>
            </div>
          </motion.div>

          <motion.div whileHover={{ y: -4 }} className="p-6 sm:p-8 rounded-3xl bg-zinc-900/60 border border-zinc-800/80 flex flex-col justify-between shadow-xl">
            <div className="space-y-4">
              <div className="flex items-center gap-1 text-amber-400">
                {[...Array(5)].map((_, i) => <Star key={i} className="w-4 h-4 fill-amber-400" />)}
              </div>
              <p className="text-sm text-zinc-300 leading-relaxed font-normal">
                &ldquo;We use GumSearch Pro across our entire agency to spy on competitor pricing strategies. The ability to see exact review multipliers and revenue estimates lets us price our client launches at the top.&rdquo;
              </p>
            </div>
            <div className="mt-6 pt-6 border-t border-zinc-800/60 flex items-center gap-3">
              <div className="w-10 h-10 rounded-full bg-amber-500/20 border border-amber-500/40 flex items-center justify-center font-bold text-amber-300 text-sm">
                SR
              </div>
              <div>
                <h4 className="text-sm font-bold text-zinc-200">Sarah Jenkins</h4>
                <p className="text-xs text-zinc-500">Digital Marketing Agency CEO</p>
              </div>
            </div>
          </motion.div>
        </div>
      </section>

      {/* PRICING SECTION */}
      <section id="pricing" className="py-16 sm:py-24 max-w-5xl mx-auto px-4 sm:px-6 relative z-20">
        <div className="text-center max-w-2xl mx-auto mb-12">
          <span className="text-xs font-bold uppercase tracking-widest text-indigo-400">Transparent Pricing</span>
          <h2 className="font-serif-heading text-3xl sm:text-5xl lg:text-6xl font-normal tracking-tight mt-2">Invest in Unfair Market Intelligence</h2>
          <p className="mt-3 text-sm sm:text-base text-zinc-400 font-normal">
            Cancel anytime. One winning product idea pays for 5 years of GumSearch Pro.
          </p>

          {/* Monthly / Annual Toggle */}
          <div className="mt-8 inline-flex items-center gap-2 p-1.5 rounded-full bg-zinc-900 border border-zinc-800">
            <button
              onClick={() => setBillingCycle('monthly')}
              className={`px-5 py-2 rounded-full text-xs font-bold transition-all cursor-pointer ${
                billingCycle === 'monthly' ? 'bg-purple-600 text-white shadow-md' : 'text-zinc-400 hover:text-white'
              }`}
            >
              Monthly Billing
            </button>
            <button
              onClick={() => setBillingCycle('annual')}
              className={`px-5 py-2 rounded-full text-xs font-bold transition-all flex items-center gap-1.5 cursor-pointer ${
                billingCycle === 'annual' ? 'bg-purple-600 text-white shadow-md' : 'text-zinc-400 hover:text-white'
              }`}
            >
              Annual Billing
              <span className="px-2 py-0.5 rounded-full bg-emerald-500/20 text-emerald-400 text-[10px] uppercase tracking-wider font-extrabold border border-emerald-500/30">
                Save 25%
              </span>
            </button>
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-8 items-stretch max-w-4xl mx-auto">
          {/* Free Starter Plan */}
          <div className={`p-8 sm:p-10 rounded-3xl border flex flex-col justify-between ${
            isLight ? 'bg-white border-slate-200 shadow-xl' : 'bg-zinc-900/40 border-zinc-800/80 shadow-xl'
          }`}>
            <div>
              <div className="inline-block px-3 py-1 rounded-full text-xs font-bold bg-zinc-800 text-zinc-300 mb-4">
                Starter Explorer
              </div>
              <h3 className="text-2xl font-bold text-zinc-100">Free Forever</h3>
              <p className="mt-2 text-xs text-zinc-400">Perfect for exploring the live Gumroad database & checking basic metrics.</p>

              <div className="mt-6 flex items-baseline gap-1">
                <span className="text-4xl font-black text-zinc-100">$0</span>
                <span className="text-xs text-zinc-500">/ forever</span>
              </div>

              <ul className="mt-8 space-y-3 text-xs text-zinc-300">
                <li className="flex items-center gap-2.5">
                  <CheckCircle2 className="w-4 h-4 text-emerald-400 shrink-0" />
                  Access 1,000+ top Gumroad products
                </li>
                <li className="flex items-center gap-2.5">
                  <CheckCircle2 className="w-4 h-4 text-emerald-400 shrink-0" />
                  Basic category & price filtering
                </li>
                <li className="flex items-center gap-2.5 text-zinc-500">
                  <span className="w-4 h-4 flex items-center justify-center font-bold text-rose-500">✕</span>
                  AI Gap & Opportunity Teardowns
                </li>
                <li className="flex items-center gap-2.5 text-zinc-500">
                  <span className="w-4 h-4 flex items-center justify-center font-bold text-rose-500">✕</span>
                  Ground-Truth Revenue Multipliers
                </li>
                <li className="flex items-center gap-2.5 text-zinc-500">
                  <span className="w-4 h-4 flex items-center justify-center font-bold text-rose-500">✕</span>
                  Export product data to CSV / Notion
                </li>
              </ul>
            </div>

            <button
              onClick={() => onNavigateFreeTool?.()}
              className="mt-8 w-full py-3.5 rounded-xl border border-zinc-700 hover:bg-zinc-800 text-zinc-200 text-xs font-bold transition-all cursor-pointer"
            >
              Start Free Dashboard
            </button>
          </div>

          {/* Pro Unlimited Plan */}
          <div className="p-8 sm:p-10 rounded-3xl bg-gradient-to-br from-purple-900/40 via-indigo-900/30 to-zinc-900/80 border-2 border-purple-500/60 shadow-2xl shadow-purple-500/10 flex flex-col justify-between relative overflow-hidden">
            <div className="absolute top-0 right-0 px-4 py-1.5 bg-gradient-to-r from-purple-600 to-indigo-600 text-white font-bold text-[10px] uppercase tracking-widest rounded-bl-2xl shadow-md">
              Most Popular
            </div>

            <div>
              <div className="inline-block px-3 py-1 rounded-full text-xs font-bold bg-purple-500/20 text-purple-300 border border-purple-500/40 mb-4">
                GumSearch Pro
              </div>
              <h3 className="text-2xl font-bold text-white">Full Intelligence Suite</h3>
              <p className="mt-2 text-xs text-zinc-300">Unlock the complete 100,000+ product archive & AI opportunity engine.</p>

              <div className="mt-6 flex items-baseline gap-1">
                <span className="text-4xl font-black text-white">
                  {billingCycle === 'annual' ? '$29' : '$39'}
                </span>
                <span className="text-xs text-zinc-400">/ month, billed {billingCycle}</span>
              </div>

              <ul className="mt-8 space-y-3 text-xs text-zinc-200">
                <li className="flex items-center gap-2.5">
                  <CheckCircle2 className="w-4 h-4 text-purple-400 shrink-0" />
                  <strong>Unlimited</strong> access to 100,000+ products
                </li>
                <li className="flex items-center gap-2.5">
                  <CheckCircle2 className="w-4 h-4 text-purple-400 shrink-0" />
                  <strong>Instant LLM AI Gap Teardowns</strong> on any product
                </li>
                <li className="flex items-center gap-2.5">
                  <CheckCircle2 className="w-4 h-4 text-purple-400 shrink-0" />
                  Exact ground-truth revenue valuation
                </li>
                <li className="flex items-center gap-2.5">
                  <CheckCircle2 className="w-4 h-4 text-purple-400 shrink-0" />
                  Historical price change & discount tracking
                </li>
                <li className="flex items-center gap-2.5">
                  <CheckCircle2 className="w-4 h-4 text-purple-400 shrink-0" />
                  1-Click Export to CSV / JSON / Notion
                </li>
              </ul>
            </div>

            <motion.button
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
              onClick={() => { if (onOpenFunnel) onOpenFunnel(); else onLaunchApp(); }}
              className="mt-8 w-full py-4 rounded-xl bg-gradient-to-r from-purple-500 to-indigo-600 hover:from-purple-400 hover:to-indigo-500 text-white text-xs font-black transition-all shadow-xl shadow-purple-600/30 flex items-center justify-center gap-2 cursor-pointer"
            >
              <span>Unlock GumSearch Pro Now</span>
              <ArrowRight className="w-4 h-4" />
            </motion.button>
          </div>
        </div>
      </section>

      {/* FINAL CONVERSION CTA */}
      <section className="py-16 sm:py-24 max-w-5xl mx-auto px-4 sm:px-6 relative z-20 text-center">
        <div className="p-10 sm:p-16 rounded-3xl bg-gradient-to-r from-purple-900/50 via-indigo-900/40 to-zinc-900 border border-purple-500/30 shadow-2xl shadow-purple-500/10 relative overflow-hidden">
          <div className="max-w-2xl mx-auto relative z-10">
            <h2 className="font-serif-heading text-3xl sm:text-5xl font-normal text-white tracking-tight">
              Ready to Discover Your Next $10k/mo Product Idea?
            </h2>
            <p className="mt-4 text-sm sm:text-base text-zinc-300">
              Join 2,500+ digital creators and SaaS founders who use GumSearch to dominate Gumroad.
            </p>
            <div className="mt-8 flex flex-col sm:flex-row items-center justify-center gap-4">
              <motion.button
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                onClick={() => { if (onOpenFunnel) onOpenFunnel(); else onLaunchApp(); }}
                className="w-full sm:w-auto px-8 py-4 bg-white hover:bg-zinc-100 text-slate-900 font-bold text-sm rounded-xl transition-all shadow-xl flex items-center justify-center gap-2 cursor-pointer"
              >
                Get Started in 30 Seconds — Free
                <ArrowRight className="w-4 h-4" />
              </motion.button>
            </div>
            <p className="mt-4 text-[11px] text-zinc-400">No credit card required for Starter access • Instant setup</p>
          </div>
        </div>
      </section>

      {/* FOOTER */}
      <footer className="py-12 border-t border-zinc-800/60 max-w-7xl mx-auto px-6 text-xs text-zinc-500 flex flex-col sm:flex-row items-center justify-between gap-4">
        <div className="flex items-center gap-2 font-bold text-zinc-300">
          <div className="w-5 h-5 rounded-lg bg-gradient-to-tr from-purple-600 to-indigo-600 flex items-center justify-center text-white text-[10px]">
            G
          </div>
          GumSearch
        </div>
        <div className="flex items-center gap-6">
          <button onClick={onNavigateFreeTool} className="hover:text-zinc-300 transition-colors cursor-pointer">Free Creator Finder</button>
          <a href="#bento" className="hover:text-zinc-300 transition-colors">Features</a>
          <a href="#pricing" className="hover:text-zinc-300 transition-colors">Pricing</a>
          <button onClick={() => onNavigateLegal?.('terms')} className="hover:text-zinc-300 transition-colors cursor-pointer">Terms of Service</button>
          <button onClick={() => onNavigateLegal?.('privacy')} className="hover:text-zinc-300 transition-colors cursor-pointer">Privacy Policy</button>
        </div>
        <div>
          © {new Date().getFullYear()} GumSearch Intelligence. All rights reserved. Not affiliated with Gumroad, Inc.
        </div>
      </footer>
    </div>
  );
};
