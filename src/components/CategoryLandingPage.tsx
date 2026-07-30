import React, { useEffect } from 'react';
import { motion } from 'framer-motion';
import { Product } from '../types';
import { 
  TrendingUp, 
  DollarSign, 
  Target, 
  Zap, 
  Star, 
  ArrowRight, 
  Sparkles, 
  ChevronRight, 
  CheckCircle2, 
  AlertCircle,
  Briefcase,
  Code,
  Layers,
  Palette,
  GraduationCap,
  HeartPulse,
  BookOpen,
  Music,
  ExternalLink,
  Eye,
  Bookmark
} from 'lucide-react';

export interface CategoryInfo {
  slug: string;
  name: string;
  tagline: string;
  description: string;
  iconName: string;
  totalRevenue: string;
  productCount: number;
  avgPrice: string;
  opportunityScore: string;
  marketGaps: string[];
  aiSummary: string;
  metaDescription: string;
}

export const CATEGORIES_DATA: Record<string, CategoryInfo> = {
  'business-and-money': {
    slug: 'business-and-money',
    name: 'Business & Money',
    tagline: 'Sales, Marketing, Finance & Solopreneur Growth Systems',
    description: 'Explore verified revenue data, pricing trends, and untapped market gaps for business templates, sales playbooks, and financial operating systems.',
    iconName: 'Briefcase',
    totalRevenue: '$1,240,500',
    productCount: 142,
    avgPrice: '$89',
    opportunityScore: '94/100',
    marketGaps: [
      'High demand for post-sale onboarding workflows alongside static templates',
      'Gap for automated CRM integrations for solopreneur financial trackers',
      'Need for video walkthroughs justifying $100+ price tags'
    ],
    aiSummary: 'Business & Money is the highest-revenue category on digital marketplaces. Products offering actionable systems rather than passive PDFs command 3x higher price points. The biggest opportunity lies in bundling automated Notion/Airtable dashboards with video coaching.',
    metaDescription: 'Discover the most profitable Business & Money digital products, templates, and courses. Real revenue data, pricing insights, and AI gap analyses on GumSearch.'
  },
  'software-ai': {
    slug: 'software-ai',
    name: 'Software & AI Tools',
    tagline: 'SaaS Starters, AI Prompts, Scripts & Dev Boilerplates',
    description: 'Analyze revenue metrics and opportunity gaps across AI prompt libraries, Next.js SaaS boilerplates, browser extensions, and developer scripts.',
    iconName: 'Code',
    totalRevenue: '$2,180,000',
    productCount: 198,
    avgPrice: '$129',
    opportunityScore: '98/100',
    marketGaps: [
      'Lack of ongoing prompt updates for rapidly evolving LLM APIs',
      'High refund rates on basic boilerplates lacking zero-to-deploy tutorials',
      'Massive gap for vertical-specific AI agent workflows (e.g. Legal AI, Real Estate AI)'
    ],
    aiSummary: 'Software & AI Tools experience the fastest sales velocity. Buyers pay premium prices ($99-$299) for dev toolkits that save 20+ hours of coding time. Micro-SaaS starters with built-in Stripe & Supabase integration are currently outperforming simple code snippets.',
    metaDescription: 'Explore top revenue AI tools, dev boilerplates, and software scripts. Discover underserved market gaps in AI & Software digital products.'
  },
  'templates-notion': {
    slug: 'templates-notion',
    name: 'Templates & Notion',
    tagline: 'Productivity Systems, Second Brains & Workspaces',
    description: 'Deep dive into top Notion operating systems, life planners, agency dashboards, and digital organization kits.',
    iconName: 'Layers',
    totalRevenue: '$890,400',
    productCount: 264,
    avgPrice: '$49',
    opportunityScore: '91/100',
    marketGaps: [
      'Over-saturated basic life trackers; massive void for industry-vertical workspaces',
      'High buyers complaint about complex, hard-to-navigate databases',
      'Opportunity for mobile-optimized Notion layouts with native mobile widgets'
    ],
    aiSummary: 'Notion templates have high purchase volume but face price competition. Creators winning this space focus on specialized niches (e.g., "Notion OS for Freelance Videographers") rather than general productivity systems.',
    metaDescription: 'Inspect top Notion templates and digital productivity systems. Revenue stats, customer reviews, and market opportunity breakdowns.'
  },
  'design-3d': {
    slug: 'design-3d',
    name: 'Design & 3D Assets',
    tagline: 'UI Kits, 3D Models, Icons & Graphic Asset Packs',
    description: 'Uncover high-margin opportunities in Figma UI design systems, Blender 3D asset packs, icon sets, and vector illustrations.',
    iconName: 'Palette',
    totalRevenue: '$640,000',
    productCount: 115,
    avgPrice: '$59',
    opportunityScore: '88/100',
    marketGaps: [
      'Static asset packs lack editable source files in multiple formats (.blend, .fig, .svg)',
      'Need for animated 3D icons for modern SaaS landing page headers',
      'Opportunity for Framer component libraries bundled with Figma design kits'
    ],
    aiSummary: 'Designers pay recurring or one-time premium rates for assets that accelerate project delivery. 3D assets and interactive Framer components command 2.5x higher margins than basic 2D PNG icon sets.',
    metaDescription: 'Browse Figma UI kits, 3D models, and design assets. See market revenue data, top selling designers, and design niche opportunities.'
  },
  'education': {
    slug: 'education',
    name: 'Education & Courses',
    tagline: 'Masterclasses, Guides, Playbooks & Skill Bootcamps',
    description: 'Analyze course sales volume, pricing sweet spots, and student feedback across technical tutorials and skill playbooks.',
    iconName: 'GraduationCap',
    totalRevenue: '$1,450,000',
    productCount: 178,
    avgPrice: '$119',
    opportunityScore: '93/100',
    marketGaps: [
      'Passive video courses suffer low completion; demand for community-backed cohorts',
      'Gap for bite-sized, 60-minute tactical skill teardowns under $49',
      'Need for downloadable cheat sheets and code repositories alongside video lessons'
    ],
    aiSummary: 'Educational products show strong long-tail sales. Practical, outcome-focused cohorts and actionable playbooks sell significantly better than long theory-heavy lectures.',
    metaDescription: 'Discover top educational courses, ebooks, and bootcamps. Revenue metrics, price analysis, and market gap teardowns for online educators.'
  },
  'fitness-health': {
    slug: 'fitness-health',
    name: 'Fitness & Health',
    tagline: 'Workout Programs, Meal Plans & Habit Trackers',
    description: 'Discover revenue benchmarks and market demand for fitness coaching programs, meal guides, and biohacking protocols.',
    iconName: 'HeartPulse',
    totalRevenue: '$410,000',
    productCount: 84,
    avgPrice: '$39',
    opportunityScore: '86/100',
    marketGaps: [
      'Generic workout PDFs lack progress tracking apps/spreadsheets',
      'High conversion for niche dietary protocols (Keto, Carnivore, Hypertrophy for Busy Founders)',
      'Opportunity for weekly accountability email check-in sequences'
    ],
    aiSummary: 'Health & Fitness digital products convert strongly via social proof. Products combining daily progress logs with clear transformation roadmaps achieve high customer retention.',
    metaDescription: 'Explore digital fitness programs, meal plans, and wellness trackers. Real market revenue numbers and opportunity gap insights.'
  },
  'writing-publishing': {
    slug: 'writing-publishing',
    name: 'Writing & Content',
    tagline: 'Copywriting Frameworks, Ebooks & Social Hooks',
    description: 'Explore top performing copywriting guides, viral post templates, newsletter systems, and publishing playbooks.',
    iconName: 'BookOpen',
    totalRevenue: '$580,200',
    productCount: 130,
    avgPrice: '$45',
    opportunityScore: '89/100',
    marketGaps: [
      'Over-reliance on generic AI copywriting prompts; need for human-edited hook banks',
      'Opportunity for platform-specific ghostwriting SOPs (LinkedIn vs X/Twitter vs Substack)',
      'Gap for newsletter monetization blueprints backed by real case studies'
    ],
    aiSummary: 'Content creators actively seek high-converting hooks and distribution frameworks. Products with fill-in-the-blank copywriting formulas sell consistently.',
    metaDescription: 'Inspect copywriting frameworks, newsletter playbooks, and content creation guides. Verified revenue metrics and writing niche gap analysis.'
  },
  'audio-music': {
    slug: 'audio-music',
    name: 'Audio & Music',
    tagline: 'Sample Packs, VST Plugins, Sound Effects & Beats',
    description: 'Track revenue trends for music production sample packs, sound design libraries, synth presets, and DAW templates.',
    iconName: 'Music',
    totalRevenue: '$390,000',
    productCount: 92,
    avgPrice: '$35',
    opportunityScore: '85/100',
    marketGaps: [
      'Sample packs without royalty-free commercial licensing clarity lose buyers',
      'Need for genre-specific MIDI chord packs for rapid beat construction',
      'Opportunity for Ableton/Logic DAW templates with pre-mixed master chains'
    ],
    aiSummary: 'Music producers and content creators buy royalty-free sound effects and preset packs frequently. High-quality audio previews and royalty-free clear licensing are key sales drivers.',
    metaDescription: 'Browse audio sample packs, VST presets, and sound design libraries. Market revenue stats and niche sound design opportunity breakdowns.'
  }
};

interface CategoryLandingPageProps {
  categorySlug: string;
  products: Product[];
  onSelectProduct: (product: Product) => void;
  onLaunchAppWithCategory: (categoryName: string) => void;
  onNavigateCategory: (categorySlug: string) => void;
  onOpenFunnel?: () => void;
  savedProductIds?: string[];
  onToggleSaveProduct?: (productId: string) => void;
  theme?: 'dark' | 'light';
}

const getCategoryIcon = (iconName: string) => {
  switch (iconName) {
    case 'Briefcase': return <Briefcase className="w-6 h-6 text-purple-400" />;
    case 'Code': return <Code className="w-6 h-6 text-purple-400" />;
    case 'Layers': return <Layers className="w-6 h-6 text-purple-400" />;
    case 'Palette': return <Palette className="w-6 h-6 text-purple-400" />;
    case 'GraduationCap': return <GraduationCap className="w-6 h-6 text-purple-400" />;
    case 'HeartPulse': return <HeartPulse className="w-6 h-6 text-purple-400" />;
    case 'BookOpen': return <BookOpen className="w-6 h-6 text-purple-400" />;
    case 'Music': return <Music className="w-6 h-6 text-purple-400" />;
    default: return <Sparkles className="w-6 h-6 text-purple-400" />;
  }
};

const formatCurrency = (amount: number) => {
  return new Intl.NumberFormat('en-US', {
    style: 'currency',
    currency: 'USD',
    maximumFractionDigits: 0,
  }).format(amount);
};

export const CategoryLandingPage: React.FC<CategoryLandingPageProps> = ({
  categorySlug,
  products,
  onSelectProduct,
  onLaunchAppWithCategory,
  onNavigateCategory,
  onOpenFunnel,
  savedProductIds = [],
  onToggleSaveProduct,
  theme = 'dark'
}) => {
  const category = CATEGORIES_DATA[categorySlug] || CATEGORIES_DATA['business-and-money'];

  // Filter products for this category (matching by category name substring)
  const categoryProducts = products.filter(p => 
    p.category.toLowerCase().includes(category.name.split('&')[0].trim().toLowerCase()) ||
    category.name.toLowerCase().includes(p.category.toLowerCase()) ||
    p.tags.some(t => t.toLowerCase().includes(category.name.toLowerCase()))
  );

  // Fallback to all products if specific count is low so user always sees data
  const displayProducts = categoryProducts.length >= 2 ? categoryProducts : products;

  // SEO Update for Organic Google Search Traffic
  useEffect(() => {
    document.title = `How much have ${category.name} products made on Gumroad? | GumSearch`;
    const metaDesc = document.querySelector('meta[name="description"]');
    if (metaDesc) {
      metaDesc.setAttribute('content', `Find out how much ${category.name} products have made on Gumroad. Real market revenue data, average prices, top sellers, and AI gap opportunities.`);
    }
  }, [category]);

  const isLight = theme === 'light';

  return (
    <div className={`min-h-screen font-sans selection:bg-purple-500/30 ${
      isLight ? 'bg-zinc-100 text-zinc-900' : 'bg-zinc-950 text-zinc-50'
    }`}>
      
      {/* CATEGORY BREADCRUMB & HEADER HUB */}
      <section className="relative pt-12 pb-16 px-4 sm:px-6 max-w-[1400px] mx-auto overflow-hidden">
        
        {/* Ambient Glow Sphere */}
        <div className="absolute top-10 left-1/2 -translate-x-1/2 w-[600px] h-[300px] bg-purple-600/15 blur-[120px] rounded-full pointer-events-none" />

        {/* Breadcrumb */}
        <div className="flex items-center gap-2 text-xs font-semibold text-zinc-400 mb-6">
          <button 
            onClick={() => onNavigateCategory('home')}
            className="hover:text-purple-400 transition-colors cursor-pointer"
          >
            GumSearch
          </button>
          <ChevronRight className="w-3.5 h-3.5 text-zinc-600" />
          <span className="text-zinc-500">Categories</span>
          <ChevronRight className="w-3.5 h-3.5 text-zinc-600" />
          <span className="text-purple-400 font-bold">{category.name}</span>
        </div>

        {/* Hero Title & SEO Heading */}
        <div className="max-w-4xl space-y-4">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-purple-500/10 border border-purple-500/20 text-purple-400 text-xs font-bold uppercase tracking-wider">
            {getCategoryIcon(category.iconName)}
            <span>Market Intelligence & Revenue Report</span>
          </div>

          <h1 className="font-serif-heading text-3xl sm:text-5xl lg:text-6xl font-normal tracking-tight text-white leading-tight">
            How much have <span className="font-serif-italic text-transparent bg-clip-text bg-gradient-to-r from-purple-400 via-pink-400 to-amber-300 font-normal">{category.name}</span> products made on Gumroad?
          </h1>

          <p className="text-base sm:text-lg text-zinc-300 leading-relaxed font-normal">
            Tracked <span className="text-white font-semibold">{category.name}</span> products have generated over <span className="text-emerald-400 font-extrabold">{category.totalRevenue}</span> in total estimated revenue on Gumroad, with an average price point of <span className="text-amber-400 font-bold">{category.avgPrice}</span>. {category.description}
          </p>
        </div>

        {/* KEY CATEGORY METRICS GRID */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mt-10">
          <div className="p-5 rounded-2xl border border-zinc-800 bg-zinc-900/60 backdrop-blur-xl shadow-lg">
            <div className="text-xs font-semibold text-zinc-500 uppercase tracking-wider flex items-center justify-between">
              Total Category Revenue
              <DollarSign className="w-4 h-4 text-emerald-400" />
            </div>
            <div className="text-2xl sm:text-3xl font-extrabold text-white mt-2">
              {category.totalRevenue}
            </div>
            <div className="text-xs text-emerald-400 font-semibold mt-1 flex items-center gap-1">
              <TrendingUp className="w-3 h-3" /> Monthly Market Tracked
            </div>
          </div>

          <div className="p-5 rounded-2xl border border-zinc-800 bg-zinc-900/60 backdrop-blur-xl shadow-lg">
            <div className="text-xs font-semibold text-zinc-500 uppercase tracking-wider flex items-center justify-between">
              Average Price Point
              <DollarSign className="w-4 h-4 text-amber-400" />
            </div>
            <div className="text-2xl sm:text-3xl font-extrabold text-white mt-2">
              {category.avgPrice}
            </div>
            <div className="text-xs text-amber-400 font-medium mt-1">
              Optimal conversion range
            </div>
          </div>

          <div className="p-5 rounded-2xl border border-purple-500/30 bg-purple-500/10 backdrop-blur-xl shadow-lg">
            <div className="text-xs font-semibold text-purple-300 uppercase tracking-wider flex items-center justify-between">
              Opportunity Score
              <Zap className="w-4 h-4 text-amber-400" />
            </div>
            <div className="text-2xl sm:text-3xl font-extrabold text-white mt-2">
              {category.opportunityScore}
            </div>
            <div className="text-xs text-purple-300 font-semibold mt-1">
              High Market Demand / Low Saturation
            </div>
          </div>
        </div>
      </section>

      {/* AI MARKET OPPORTUNITY TEARDOWN BOX */}
      <section className="px-4 sm:px-6 max-w-[1400px] mx-auto mb-16">
        <div className="p-6 sm:p-8 rounded-3xl border border-purple-500/30 bg-gradient-to-br from-purple-950/40 via-zinc-900/80 to-zinc-950 shadow-2xl relative overflow-hidden">
          
          <div className="flex items-center gap-2 text-purple-400 font-bold text-xs uppercase tracking-wider mb-4">
            <Sparkles className="w-4 h-4 text-amber-400" />
            AI Niche Analysis & Underserved Gaps
          </div>

          <h2 className="font-serif-heading text-2xl sm:text-3xl font-normal text-white mb-4">
            Where is the money in <span className="font-serif-italic text-purple-300 font-normal">{category.name}</span> right now?
          </h2>

          <p className="text-sm text-zinc-300 leading-relaxed mb-6">
            {category.aiSummary}
          </p>

          <div className="space-y-3 pt-4 border-t border-zinc-800">
            <div className="text-xs font-bold text-white uppercase tracking-wider mb-2">
              💡 Top 3 Market Gaps Spotting:
            </div>
            {category.marketGaps.map((gap, i) => (
              <div key={i} className="flex items-start gap-2.5 text-xs text-zinc-300">
                <CheckCircle2 className="w-4 h-4 text-emerald-400 shrink-0 mt-0.5" />
                <span>{gap}</span>
              </div>
            ))}
          </div>

          <div className="mt-8 flex flex-col sm:flex-row items-center gap-4">
            <button
              onClick={() => {
                if (onOpenFunnel) {
                  onOpenFunnel();
                } else {
                  onLaunchAppWithCategory(category.name);
                }
              }}
              className="w-full sm:w-auto px-6 py-3 rounded-xl bg-purple-600 hover:bg-purple-500 text-white font-bold text-sm transition-all shadow-lg shadow-purple-600/30 flex items-center justify-center gap-2 cursor-pointer"
            >
              Filter {category.name} Market Intelligence
              <ArrowRight className="w-4 h-4" />
            </button>

            <span className="text-xs text-zinc-400">
              Access raw database filters, revenue sort & AI gap teardowns
            </span>
          </div>
        </div>
      </section>

      {/* QUICK CATEGORY SWITCHER HUB FOR GOOGLE SEO INTERNAL LINKING */}
      <section className="px-4 sm:px-6 max-w-[1400px] mx-auto mb-20 border-t border-zinc-800/80 pt-12">
        <h3 className="text-sm font-bold uppercase tracking-wider text-zinc-400 mb-6 text-center">
          Browse Market Insights for Other Digital Product Categories
        </h3>

        <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
          {Object.values(CATEGORIES_DATA).map((cat) => (
            <button
              key={cat.slug}
              onClick={() => onNavigateCategory(cat.slug)}
              className={`p-3.5 rounded-xl border text-left transition-all cursor-pointer flex items-center justify-between group ${
                cat.slug === category.slug 
                  ? 'bg-purple-600/20 border-purple-500 text-white font-bold' 
                  : 'bg-zinc-900/60 border-zinc-800 text-zinc-300 hover:border-purple-500/40 hover:bg-zinc-800/80'
              }`}
            >
              <div className="flex items-center gap-2.5 truncate">
                {getCategoryIcon(cat.iconName)}
                <span className="text-xs font-semibold truncate">{cat.name}</span>
              </div>
              <ChevronRight className="w-3.5 h-3.5 text-zinc-600 group-hover:text-purple-400 transition-colors shrink-0" />
            </button>
          ))}
        </div>
      </section>

      {/* FOOTER */}
      <footer className="border-t border-zinc-800 py-10 px-6 text-center text-xs text-zinc-500">
        <p>© 2026 GumSearch. Digital Product Intelligence & Market Opportunity Analytics.</p>
      </footer>
    </div>
  );
};
