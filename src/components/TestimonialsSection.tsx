import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  Star, Quote, CheckCircle2, TrendingUp, Sparkles, ArrowRight, 
  ShieldCheck, DollarSign, Zap, ExternalLink, ThumbsUp, Flame, 
  Award, X, ChevronRight, MessageSquare
} from 'lucide-react';

export interface Testimonial {
  id: string;
  name: string;
  role: string;
  handle: string;
  avatar: string;
  category: 'Indie Hackers' | 'Notion & Templates' | 'AI & Prompt Engineers' | 'Course & eBook Authors';
  rating: number;
  metric: string;
  metricLabel: string;
  badge: string;
  headline: string;
  quote: string;
  fullStory?: string;
  productBuilt?: {
    name: string;
    revenue: string;
    gapFound: string;
  };
  verified: boolean;
  likes: number;
  featured?: boolean;
}

const TESTIMONIALS: Testimonial[] = [
  {
    id: '1',
    name: 'Marcus Vance',
    role: 'Indie Hacker & SaaS Founder',
    handle: '@marcusvance_dev',
    avatar: 'https://images.unsplash.com/photo-1539571696357-5a69c17a67c6?w=150&auto=format&fit=crop&q=80',
    category: 'Indie Hackers',
    rating: 5,
    metric: '+$34,200',
    metricLabel: 'First Month Revenue',
    badge: '🚀 Top Creator',
    headline: 'Found a $50k/mo digital product with 3-star reviews and built a better alternative.',
    quote: 'GumSearch’s "Mixed Reviews" filter is an absolute cheat code. I filtered for products with high revenue but sub-4.0 ratings. Found a Notion UI kit generating $40k/mo with terrible support. Launched a polished React version and hit $34.2k in 30 days.',
    fullStory: 'Before GumSearch, I wasted 3 months building products nobody wanted. Using the ground-truth revenue payload parser, I spotted a huge demand spike in developer templates that had poor rating reviews. The AI opportunity teardown pinpointed exact customer pain points: lack of TypeScript support and missing Figma files. I addressed both in my product, leading to 450+ sales in week one.',
    productBuilt: {
      name: 'Next.js Ultimate Boilerplate',
      revenue: '$34,200 / mo',
      gapFound: 'Previous leader lacked TypeScript and updated Tailwind v4 support.'
    },
    verified: true,
    likes: 142,
    featured: true
  },
  {
    id: '2',
    name: 'Elena Rostova',
    role: 'Notion Systems Creator',
    handle: '@elena_notion',
    avatar: 'https://images.unsplash.com/photo-1517841905240-472988babdf9?w=150&auto=format&fit=crop&q=80',
    category: 'Notion & Templates',
    rating: 5,
    metric: '10x Faster',
    metricLabel: 'Market Validation',
    badge: '⚡ Verified Creator',
    headline: 'Validated 3 template ideas before writing a single line of content.',
    quote: 'Instead of guessing what Notion templates people buy, I sorted Gumroad categories by verified sales volume. GumSearch showed me that client onboarding OS templates were outperforming basic planners by 800%.',
    fullStory: 'GumSearch completely changed my workflow. The real-time daily ingestion allowed me to see micro-trends before they hit Twitter. I noticed a sudden surge in Freelance CRM templates. The AI market gap analysis noted that existing templates were too complicated for solo designers. I created a minimal 3-page workspace that grossed $12,800 in its first launch.',
    productBuilt: {
      name: 'Solo Creator CRM & OS',
      revenue: '$12,800 / launch',
      gapFound: 'Existing top sellers had overwhelming 50+ database schemas.'
    },
    verified: true,
    likes: 98
  },
  {
    id: '3',
    name: 'Devon Keith',
    role: 'AI Prompt & Automation Engineer',
    handle: '@devon_ai',
    avatar: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=150&auto=format&fit=crop&q=80',
    category: 'AI & Prompt Engineers',
    rating: 5,
    metric: '$18,500',
    metricLabel: 'Quarterly Sales',
    badge: '🔥 Fast Growing',
    headline: 'Discovered prompt packs with outdated model references making $20k+.',
    quote: 'The AI market teardown flagged that top-selling ChatGPT prompt packs hadn’t been updated for GPT-4o. I launched a fine-tuned Claude 3.5 & GPT-4o bundle and captured 1,200 buyers in two weeks.',
    fullStory: 'Market research on Gumroad used to take me 20+ hours a week scanning individual creator pages. With GumSearch, I can filter 1,500+ items by rating, price, and category in seconds. The AI gap summaries immediately reveal customer complaints like missing API examples or outdated prompts.',
    productBuilt: {
      name: 'Claude 3.5 Sonnet Prompt Vault',
      revenue: '$18,500 / qtr',
      gapFound: 'Top competitors were still selling outdated 2023 GPT-3.5 prompts.'
    },
    verified: true,
    likes: 116
  },
  {
    id: '4',
    name: 'Sarah Chen',
    role: 'Ebook Author & Educator',
    handle: '@sarahchen_writes',
    avatar: 'https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?w=150&auto=format&fit=crop&q=80',
    category: 'Course & eBook Authors',
    rating: 5,
    metric: '4.9 / 5',
    metricLabel: 'Buyer Rating Achieved',
    badge: '📚 Best Seller',
    headline: 'GumSearch helped me price my tech guide at $79 instead of $19.',
    quote: 'I assumed my niche couldn’t support prices above $20. GumSearch ground-truth revenue data proved that comprehensive technical guides in my niche were pulling $60k+ at $79–$99 price points.',
    fullStory: 'Pricing strategy is usually pure guesswork. Looking at actual verified sales counts and total revenue numbers gave me the confidence to position my guide as a premium resource. I included bonus video walkthroughs based on AI gap recommendations.',
    productBuilt: {
      name: 'System Design for Senior Engineers',
      revenue: '$54,000 / total',
      gapFound: 'Buyers wanted real incident teardowns instead of theoretical diagrams.'
    },
    verified: true,
    likes: 87
  },
  {
    id: '5',
    name: 'Liam O’Connor',
    role: 'Design System Architect',
    handle: '@liam_ui',
    avatar: 'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=150&auto=format&fit=crop&q=80',
    category: 'Indie Hackers',
    rating: 5,
    metric: '+$21,400',
    metricLabel: 'MRR Added',
    badge: '💎 Niche Leader',
    headline: 'Found an unserved niche of Figma to Tailwind UI kit buyers.',
    quote: 'The payload parser revealed that a simple icon library was earning $150k+. I realized creators were hungry for clean UI assets. We built a micro-UI kit and crossed $20k MRR.',
    fullStory: 'GumSearch gives you raw data, not vague trend reports. Being able to inspect exact review distributions and payload metadata gave our design agency an undeniable market edge.',
    productBuilt: {
      name: 'Figma to Tailwind v4 Component Kit',
      revenue: '$21,400 / mo',
      gapFound: 'Existing kits were bloated and poorly documented.'
    },
    verified: true,
    likes: 74
  },
  {
    id: '6',
    name: 'Aisha Patel',
    role: 'SaaS Founder & Micro-Acquirer',
    handle: '@aisha_builds',
    avatar: 'https://images.unsplash.com/photo-1580489944761-15a19d654956?w=150&auto=format&fit=crop&q=80',
    category: 'Indie Hackers',
    rating: 5,
    metric: '4 Market Gaps',
    metricLabel: 'Identified in 1 Day',
    badge: '🎯 Serial Creator',
    headline: 'Uncovered 4 high-opportunity gaps in 24 hours of research.',
    quote: 'I use GumSearch every Monday to spot emerging digital product trends. It’s like having a full-time product analyst scanning the entire Gumroad ecosystem for you 24/7.',
    fullStory: 'GumSearch is essential for any indie hacker looking to build micro-SaaS or info products with built-in demand.',
    productBuilt: {
      name: 'Micro-SaaS Analytics Suite',
      revenue: '$16,200 / mo',
      gapFound: 'Missing automated webhooks integration.'
    },
    verified: true,
    likes: 129
  }
];

const TICKER_ITEMS = [
  { text: "GumSearch is like an unfair cheat code for Gumroad research 🚀", author: "@marcusvance_dev" },
  { text: "Found a $40k/mo opportunity in my first 15 minutes of filtering!", author: "@elena_notion" },
  { text: "Ground-truth sales revenue numbers > estimates & guesswork 💯", author: "@devon_ai" },
  { text: "The Mixed Reviews filter is pure gold for finding flawed bestsellers.", author: "@aisha_builds" },
  { text: "Priced my guide at $79 after seeing verified payload revenue data.", author: "@sarahchen_writes" },
  { text: "1,500+ scraped products daily keeps our team ahead of micro-trends.", author: "@liam_ui" }
];

export const TestimonialsSection: React.FC<{ isLight?: boolean; onLaunchApp?: () => void; onOpenFunnel?: () => void }> = ({ 
  isLight = false,
  onLaunchApp,
  onOpenFunnel
}) => {
  const [selectedCategory, setSelectedCategory] = useState<string>('All');
  const [selectedStory, setSelectedStory] = useState<Testimonial | null>(null);
  const [likeCounts, setLikeCounts] = useState<{ [key: string]: number }>(
    TESTIMONIALS.reduce((acc, t) => ({ ...acc, [t.id]: t.likes }), {})
  );
  const [likedIds, setLikedIds] = useState<{ [key: string]: boolean }>({});

  const categories = ['All', 'Indie Hackers', 'Notion & Templates', 'AI & Prompt Engineers', 'Course & eBook Authors'];

  const filteredTestimonials = selectedCategory === 'All' 
    ? TESTIMONIALS 
    : TESTIMONIALS.filter(t => t.category === selectedCategory);

  const featuredTestimonial = TESTIMONIALS.find(t => t.featured) || TESTIMONIALS[0];

  const handleLike = (id: string, e: React.MouseEvent) => {
    e.stopPropagation();
    if (likedIds[id]) {
      setLikeCounts(prev => ({ ...prev, [id]: prev[id] - 1 }));
      setLikedIds(prev => ({ ...prev, [id]: false }));
    } else {
      setLikeCounts(prev => ({ ...prev, [id]: prev[id] + 1 }));
      setLikedIds(prev => ({ ...prev, [id]: true }));
    }
  };

  return (
    <section id="testimonials" className="py-24 relative overflow-hidden">
      {/* Dynamic Ambient Background Glows */}
      <div className="absolute top-1/3 left-1/2 -translate-x-1/2 w-[800px] h-[400px] bg-gradient-to-r from-purple-600/10 via-indigo-600/10 to-amber-500/5 rounded-full blur-[140px] pointer-events-none" />

      <div className="max-w-7xl mx-auto px-6 relative z-10">
        
        {/* SECTION HEADER */}
        <div className="text-center max-w-3xl mx-auto mb-16">
          <motion.div 
            initial={{ opacity: 0, y: 15 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.5 }}
            className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full border border-purple-500/30 bg-purple-500/10 text-purple-300 text-xs font-semibold mb-4 backdrop-blur-md"
          >
            <Sparkles className="w-3.5 h-3.5 text-purple-400" />
            <span>REAL CREATOR STORIES & PROOF</span>
          </motion.div>

          <motion.h2 
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6, delay: 0.1 }}
            className="font-serif-heading text-4xl sm:text-6xl font-normal tracking-tight leading-[1.08] text-white"
          >
            Trusted by Creators Building{' '}
            <span className="bg-gradient-to-r from-purple-400 via-indigo-300 to-amber-300 bg-clip-text text-transparent font-serif-italic">
              $10k+/Month Digital Products
            </span>
          </motion.h2>

          <motion.p 
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6, delay: 0.2 }}
            className={`mt-4 text-base sm:text-lg leading-relaxed font-normal ${
              isLight ? 'text-slate-600' : 'text-zinc-400'
            }`}
          >
            Discover how indie hackers, Notion creators, and prompt engineers use GumSearch’s ground-truth revenue data and AI teardowns to launch winning products.
          </motion.p>

          {/* Social Proof Stats Ribbon */}
          <motion.div 
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6, delay: 0.3 }}
            className="mt-8 grid grid-cols-2 md:grid-cols-4 gap-4 p-4 rounded-2xl border border-zinc-800/80 bg-zinc-900/60 backdrop-blur-xl"
          >
            <div className="text-center p-2 border-r border-zinc-800/60 last:border-r-0">
              <div className="text-2xl font-extrabold text-white flex items-center justify-center gap-1">
                4.9 <Star className="w-4 h-4 fill-amber-400 text-amber-400" />
              </div>
              <div className="text-[11px] text-zinc-400 mt-0.5">Average Rating</div>
            </div>
            <div className="text-center p-2 border-r border-zinc-800/60 last:border-r-0">
              <div className="text-2xl font-extrabold text-emerald-400">$14.2M+</div>
              <div className="text-[11px] text-zinc-400 mt-0.5">Revenue Uncovered</div>
            </div>
            <div className="text-center p-2 border-r border-zinc-800/60 last:border-r-0">
              <div className="text-2xl font-extrabold text-purple-400">1,500+</div>
              <div className="text-[11px] text-zinc-400 mt-0.5">Scraped Daily</div>
            </div>
            <div className="text-center p-2">
              <div className="text-2xl font-extrabold text-indigo-400">98.4%</div>
              <div className="text-[11px] text-zinc-400 mt-0.5">Creator Satisfaction</div>
            </div>
          </motion.div>
        </div>

        {/* FEATURED HERO TESTIMONIAL SPOTLIGHT */}
        <motion.div 
          initial={{ opacity: 0, scale: 0.98 }}
          whileInView={{ opacity: 1, scale: 1 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6 }}
          className="mb-16 p-8 md:p-10 rounded-3xl border border-purple-500/40 bg-gradient-to-br from-purple-950/40 via-zinc-900 to-zinc-950 shadow-2xl relative overflow-hidden group cursor-pointer"
          onClick={() => setSelectedStory(featuredTestimonial)}
        >
          {/* Decorative Corner Glow */}
          <div className="absolute top-0 right-0 w-80 h-80 bg-purple-600/10 rounded-full blur-3xl pointer-events-none group-hover:bg-purple-600/20 transition-all" />

          <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-center relative z-10">
            {/* Left Column: Quote & Story */}
            <div className="lg:col-span-8 space-y-6">
              <div className="flex flex-wrap items-center gap-3">
                <span className="px-3 py-1 rounded-full bg-purple-500/20 text-purple-300 text-xs font-semibold border border-purple-500/30 flex items-center gap-1.5">
                  <Flame className="w-3.5 h-3.5 text-amber-400" />
                  SPOTLIGHT CASE STUDY
                </span>
                <span className="px-3 py-1 rounded-full bg-emerald-500/10 text-emerald-400 text-xs font-bold border border-emerald-500/20">
                  {featuredTestimonial.metric} {featuredTestimonial.metricLabel}
                </span>
              </div>

              <h3 className="font-serif-heading text-2xl sm:text-3xl font-normal text-white leading-snug">
                "{featuredTestimonial.headline}"
              </h3>

              <p className="text-sm text-zinc-300 leading-relaxed font-normal">
                "{featuredTestimonial.quote}"
              </p>

              {/* Creator Info */}
              <div className="flex items-center gap-4 pt-4 border-t border-zinc-800/80">
                <img 
                  src={featuredTestimonial.avatar} 
                  alt={featuredTestimonial.name}
                  className="w-12 h-12 rounded-full object-cover border-2 border-purple-500/40 shadow-md" 
                />
                <div>
                  <div className="flex items-center gap-2">
                    <h4 className="text-sm font-bold text-white">{featuredTestimonial.name}</h4>
                    <ShieldCheck className="w-4 h-4 text-purple-400" />
                    <span className="text-xs text-purple-400 font-mono">{featuredTestimonial.handle}</span>
                  </div>
                  <p className="text-xs text-zinc-400">{featuredTestimonial.role}</p>
                </div>
              </div>
            </div>

            {/* Right Column: Key Takeaway Box */}
            <div className="lg:col-span-4 bg-zinc-950/80 rounded-2xl border border-zinc-800 p-6 space-y-4 shadow-xl">
              <div className="text-xs font-bold uppercase tracking-wider text-purple-400 flex items-center gap-1.5">
                <Zap className="w-3.5 h-3.5 text-amber-400" />
                Product Launched
              </div>

              <div>
                <div className="text-base font-bold text-white mb-1">
                  {featuredTestimonial.productBuilt?.name}
                </div>
                <div className="text-xs text-emerald-400 font-extrabold">
                  Revenue: {featuredTestimonial.productBuilt?.revenue}
                </div>
              </div>

              <div className="p-3.5 rounded-xl bg-purple-500/10 border border-purple-500/20 text-xs text-purple-200 leading-relaxed">
                <div className="font-semibold text-purple-300 mb-1">💡 Opportunity Gap Spotting:</div>
                <p>{featuredTestimonial.productBuilt?.gapFound}</p>
              </div>

              <motion.button 
                whileHover={{ scale: 1.03 }}
                whileTap={{ scale: 0.97 }}
                className="w-full py-2.5 rounded-xl bg-purple-600 hover:bg-purple-500 text-white text-xs font-bold transition-all shadow-md shadow-purple-600/20 flex items-center justify-center gap-2 cursor-pointer"
                onClick={(e) => {
                  e.stopPropagation();
                  setSelectedStory(featuredTestimonial);
                }}
              >
                Read Full Case Study
                <ArrowRight className="w-3.5 h-3.5" />
              </motion.button>
            </div>
          </div>
        </motion.div>

        {/* CATEGORY FILTER TABS */}
        <div className="flex flex-wrap items-center justify-center gap-2 mb-12">
          {categories.map((cat) => (
            <motion.button
              key={cat}
              whileHover={{ scale: 1.04 }}
              whileTap={{ scale: 0.96 }}
              onClick={() => setSelectedCategory(cat)}
              className={`px-4 py-2 rounded-xl text-xs font-semibold transition-all cursor-pointer border ${
                selectedCategory === cat
                  ? 'bg-purple-600 text-white border-purple-500 shadow-md shadow-purple-600/20'
                  : 'bg-zinc-900/80 text-zinc-400 border-zinc-800 hover:text-white hover:bg-zinc-800'
              }`}
            >
              {cat}
            </motion.button>
          ))}
        </div>

        {/* TESTIMONIALS GRID */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          <AnimatePresence mode="popLayout">
            {filteredTestimonials.map((t, idx) => (
              <motion.div
                key={t.id}
                layout
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, scale: 0.95 }}
                whileHover={{ y: -6, transition: { duration: 0.2 } }}
                transition={{ duration: 0.4, delay: idx * 0.04 }}
                className="p-6 rounded-2xl border border-zinc-800 bg-zinc-900/70 hover:border-purple-500/40 transition-all hover:shadow-xl hover:shadow-purple-950/20 flex flex-col justify-between group cursor-pointer relative backdrop-blur-xl"
                onClick={() => setSelectedStory(t)}
              >
                {/* Top Row: Rating & Metric Pill */}
                <div>
                  <div className="flex items-center justify-between gap-2 mb-4">
                    <div className="flex items-center gap-1">
                      {[...Array(t.rating)].map((_, i) => (
                        <Star key={i} className="w-3.5 h-3.5 fill-amber-400 text-amber-400" />
                      ))}
                    </div>
                    <span className="px-2.5 py-0.5 rounded-full text-[10px] font-extrabold bg-emerald-500/10 text-emerald-400 border border-emerald-500/20">
                      {t.metric}
                    </span>
                  </div>

                  {/* Headline */}
                  <h4 className="text-sm font-bold text-white mb-2 group-hover:text-purple-300 transition-colors">
                    "{t.headline}"
                  </h4>

                  {/* Quote Snippet */}
                  <p className="text-xs text-zinc-400 leading-relaxed line-clamp-4">
                    "{t.quote}"
                  </p>
                </div>

                {/* Bottom Row: User Info & Like Counter */}
                <div className="mt-6 pt-4 border-t border-zinc-800/80 flex items-center justify-between">
                  <div className="flex items-center gap-3">
                    <img 
                      src={t.avatar} 
                      alt={t.name}
                      className="w-9 h-9 rounded-full object-cover border border-purple-500/30" 
                    />
                    <div>
                      <div className="flex items-center gap-1 text-xs font-bold text-white">
                        <span>{t.name}</span>
                        {t.verified && <CheckCircle2 className="w-3.5 h-3.5 text-purple-400" />}
                      </div>
                      <div className="text-[10px] text-zinc-500">{t.role}</div>
                    </div>
                  </div>

                  <button
                    onClick={(e) => handleLike(t.id, e)}
                    className={`flex items-center gap-1.5 px-2.5 py-1 rounded-lg text-[11px] font-medium border transition-all ${
                      likedIds[t.id]
                        ? 'bg-purple-500/20 text-purple-300 border-purple-500/40'
                        : 'bg-zinc-950 text-zinc-400 border-zinc-800 hover:text-zinc-200'
                    }`}
                  >
                    <ThumbsUp className={`w-3 h-3 ${likedIds[t.id] ? 'fill-purple-400 text-purple-400' : ''}`} />
                    <span>{likeCounts[t.id]}</span>
                  </button>
                </div>
              </motion.div>
            ))}
          </AnimatePresence>
        </div>

        {/* INFINITE MARQUEE TICKER */}
        <div className="mt-20 overflow-hidden relative">
          <div className="text-center text-xs font-bold uppercase tracking-widest text-zinc-500 mb-6 flex items-center justify-center gap-2">
            <MessageSquare className="w-3.5 h-3.5 text-purple-400" />
            <span>COMMUNITY BUZZ & REACTION TICKER</span>
          </div>

          <div className="flex space-x-6 animate-marquee whitespace-nowrap">
            {[...TICKER_ITEMS, ...TICKER_ITEMS].map((item, idx) => (
              <div 
                key={idx}
                className="inline-flex items-center gap-3 px-4 py-2.5 rounded-xl bg-zinc-900/80 border border-zinc-800 text-xs text-zinc-300 shadow-md backdrop-blur-md shrink-0"
              >
                <Quote className="w-3.5 h-3.5 text-purple-400 shrink-0" />
                <span>"{item.text}"</span>
                <span className="text-[10px] font-mono text-purple-400 font-semibold">{item.author}</span>
              </div>
            ))}
          </div>
        </div>

        {/* CTA BOTTOM BANNER INSIDE TESTIMONIALS */}
        <div className="mt-16 text-center">
          <p className="text-xs text-zinc-400 mb-3">Ready to find your next winning digital product?</p>
          <button
            onClick={() => {
              if (onOpenFunnel) {
                onOpenFunnel();
              } else if (onLaunchApp) {
                onLaunchApp();
              }
            }}
            className="inline-flex items-center gap-2 px-6 py-3 rounded-xl bg-gradient-to-r from-purple-600 to-indigo-600 hover:from-purple-500 hover:to-indigo-500 text-white text-xs font-bold shadow-lg shadow-purple-600/30 transition-all cursor-pointer"
          >
            Explore 1,500+ Scraped Products
            <ChevronRight className="w-4 h-4 text-white" />
          </button>
        </div>

      </div>

      {/* DETAILED CASE STUDY POPUP MODAL */}
      <AnimatePresence>
        {selectedStory && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-md">
            <motion.div
              initial={{ opacity: 0, scale: 0.95, y: 10 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.95, y: 10 }}
              className="bg-zinc-900 border border-zinc-800 rounded-3xl max-w-2xl w-full p-8 shadow-2xl relative overflow-hidden max-h-[90vh] overflow-y-auto"
            >
              {/* Close Button */}
              <button
                onClick={() => setSelectedStory(null)}
                className="absolute top-6 right-6 p-2 rounded-full bg-zinc-800 hover:bg-zinc-700 text-zinc-400 hover:text-white transition-colors cursor-pointer"
              >
                <X className="w-4 h-4" />
              </button>

              {/* Creator Header */}
              <div className="flex items-center gap-4 mb-6">
                <img 
                  src={selectedStory.avatar} 
                  alt={selectedStory.name}
                  className="w-14 h-14 rounded-full object-cover border-2 border-purple-500/40" 
                />
                <div>
                  <div className="flex items-center gap-2">
                    <h3 className="text-lg font-bold text-white">{selectedStory.name}</h3>
                    <CheckCircle2 className="w-4 h-4 text-purple-400" />
                    <span className="text-xs text-purple-400 font-mono">{selectedStory.handle}</span>
                  </div>
                  <p className="text-xs text-zinc-400">{selectedStory.role}</p>
                </div>
              </div>

              {/* Metric Highlight */}
              <div className="p-4 rounded-xl bg-purple-500/10 border border-purple-500/20 mb-6 flex items-center justify-between">
                <div>
                  <div className="text-[10px] uppercase font-bold text-purple-400">Key Outcome</div>
                  <div className="text-xl font-extrabold text-white">{selectedStory.metric}</div>
                </div>
                <div className="text-right">
                  <div className="text-[10px] uppercase font-bold text-zinc-400">Metric Type</div>
                  <div className="text-xs font-semibold text-emerald-400">{selectedStory.metricLabel}</div>
                </div>
              </div>

              {/* Story Content */}
              <div className="space-y-4 text-xs text-zinc-300 leading-relaxed mb-6">
                <h4 className="text-sm font-bold text-white font-serif-heading">"{selectedStory.headline}"</h4>
                <p>{selectedStory.fullStory || selectedStory.quote}</p>
              </div>

              {/* Product Built Teardown */}
              {selectedStory.productBuilt && (
                <div className="p-5 rounded-2xl bg-zinc-950 border border-zinc-800 space-y-3 mb-6">
                  <div className="text-xs font-bold text-purple-400 uppercase tracking-wider flex items-center gap-1.5">
                    <Sparkles className="w-3.5 h-3.5 text-amber-400" />
                    Validated Product Result
                  </div>
                  <div className="flex items-center justify-between">
                    <span className="text-sm font-bold text-white">{selectedStory.productBuilt.name}</span>
                    <span className="text-xs font-extrabold text-emerald-400">{selectedStory.productBuilt.revenue}</span>
                  </div>
                  <div className="text-xs text-zinc-400">
                    <strong className="text-zinc-200">Market Gap Addressed:</strong> {selectedStory.productBuilt.gapFound}
                  </div>
                </div>
              )}

              {/* Modal Actions */}
              <div className="flex items-center justify-between pt-4 border-t border-zinc-800">
                <button
                  onClick={() => setSelectedStory(null)}
                  className="px-5 py-2.5 rounded-xl border border-zinc-700 bg-zinc-800 hover:bg-zinc-700 text-white text-xs font-semibold transition-all cursor-pointer"
                >
                  Close Case Study
                </button>
                <button
                  onClick={() => {
                    setSelectedStory(null);
                    if (onOpenFunnel) {
                      onOpenFunnel();
                    } else if (onLaunchApp) {
                      onLaunchApp();
                    }
                  }}
                  className="px-5 py-2.5 rounded-xl bg-purple-600 hover:bg-purple-500 text-white text-xs font-bold transition-all shadow-md shadow-purple-600/20 cursor-pointer flex items-center gap-1.5"
                >
                  Start Finding Products
                  <ArrowRight className="w-3.5 h-3.5" />
                </button>
              </div>

            </motion.div>
          </div>
        )}
      </AnimatePresence>
    </section>
  );
};
