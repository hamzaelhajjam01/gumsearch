import React, { useState, useEffect, useMemo } from 'react';
import { CHROME_EXTENSION_URL } from '../constants';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  Search, 
  Calendar, 
  Clock, 
  User, 
  ArrowLeft, 
  ArrowRight, 
  Sparkles, 
  Share2, 
  BookOpen, 
  TrendingUp, 
  Tag, 
  CheckCircle2, 
  ChevronRight,
  Flame,
  FileText,
  HelpCircle,
  ChevronDown
} from 'lucide-react';
import { BLOG_POSTS, BlogPost } from '../data/blogPosts';
import { SharedNavbar } from './SharedNavbar';

// Top High-Volume Google "People Also Ask" Search Queries
const FAQ_DATA = [
  {
    question: "How to find top selling Gumroad products?",
    answer: "You can use the free GumSearch Creator Finder to filter 100,000+ Gumroad storefronts by verified customer review volume, active product count, and sales velocity proxies across categories like Notion, AI Prompts, UI Kits, and Software."
  },
  {
    question: "How much do top Gumroad creators make?",
    answer: "Top 1% Gumroad creators generate between $25,000 and $120,000 per month. The highest-grossing categories are B2B Notion Operating Systems ($48k/mo avg top revenue), Next.js SaaS boilerplates ($50k/mo avg), and Figma design systems ($35k/mo avg)."
  },
  {
    question: "What digital products sell best on Gumroad in 2026?",
    answer: "B2B digital products with high workflow utility have the highest sales volume and lowest price resistance. Top categories include B2B Notion OS templates (Client Portals, Agency CRMs), Next.js/Supabase SaaS starter kits, curated AI prompt databases, and developer UI component kits."
  },
  {
    question: "How to spot high-opportunity digital product gaps?",
    answer: "Filter top-selling Gumroad products ($15,000+/mo revenue) that have sub-4.0 average customer ratings. Read negative 1-star to 3-star reviews to identify buyer dissatisfaction clusters (such as outdated code, missing video guides, or poor support), then launch a polished alternative fixing those exact pain points."
  },
  {
    question: "Gumroad vs Whop vs Lemon Squeezy: which platform is best?",
    answer: "Gumroad is best for organic search discovery (40% of sales come from Gumroad Discover and Google SERPs). Whop offers lower fees (3%) for SaaS passes & Discord communities. Lemon Squeezy acts as a Merchant of Record (MoR) handling international EU VAT automatically."
  },
  {
    question: "Is GumSearch free to use?",
    answer: "Yes, GumSearch offers a 100% free public Creator Finder tool. For advanced competitor analytics, customer complaint teardowns, and full database exports, creators can upgrade to the GumSearch Pro Lifetime Pass for $99.99."
  }
];

interface BlogPageProps {
  theme?: 'dark' | 'light';
  initialArticleSlug?: string | null;
  onNavigateHome: () => void;
  onNavigateFreeTool: () => void;
  onNavigateCategory: (slug: string) => void;
  onLaunchDashboard: () => void;
  onOpenFunnel: () => void;
  onNavigateLegal?: (page: 'terms' | 'privacy') => void;
}

export const BlogPage: React.FC<BlogPageProps> = ({
  theme = 'dark',
  initialArticleSlug = null,
  onNavigateHome,
  onNavigateFreeTool,
  onNavigateCategory,
  onLaunchDashboard,
  onOpenFunnel,
  onNavigateLegal,
}) => {
  const [selectedSlug, setSelectedSlug] = useState<string | null>(initialArticleSlug);
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCategory, setSelectedCategory] = useState<string>('All');
  const [copiedLink, setCopiedLink] = useState(false);
  const [openFaqIndex, setOpenFaqIndex] = useState<number | null>(0);

  const isLight = theme === 'light';

  // Find active article if slug is set
  const activeArticle = useMemo(() => {
    if (!selectedSlug) return null;
    return BLOG_POSTS.find(p => p.slug === selectedSlug) || null;
  }, [selectedSlug]);

  // Dynamic Word Count Calculation for SEO Strategy & E-E-A-T
  const activeArticleWordCount = useMemo(() => {
    if (!activeArticle) return 0;
    const cleanText = activeArticle.content.replace(/<[^>]*>/g, ' ').replace(/\s+/g, ' ').trim();
    return cleanText.split(' ').length;
  }, [activeArticle]);

  // Sync Document Title & SEO Meta Tags + BlogPosting Schema
  useEffect(() => {
    if (activeArticle) {
      document.title = `${activeArticle.title} | GumSearch Intelligence Blog`;
      const metaDesc = document.querySelector('meta[name="description"]');
      if (metaDesc) {
        metaDesc.setAttribute('content', activeArticle.metaDescription);
      }
      window.history.pushState({}, '', `/blog/${activeArticle.slug}`);

      // Inject BlogPosting JSON-LD Schema
      const schemaScript = document.createElement('script');
      schemaScript.id = 'blog-post-schema';
      schemaScript.type = 'application/ld+json';
      schemaScript.text = JSON.stringify({
        "@context": "https://schema.org",
        "@type": "BlogPosting",
        "headline": activeArticle.title,
        "description": activeArticle.metaDescription,
        "image": activeArticle.coverImage,
        "datePublished": activeArticle.publishedAt,
        "author": {
          "@type": "Person",
          "name": activeArticle.author.name
        },
        "publisher": {
          "@type": "Organization",
          "name": "GumSearch Intelligence",
          "url": "https://gumsearch.com"
        },
        "mainEntityOfPage": {
          "@type": "WebPage",
          "@id": `https://gumsearch.com/blog/${activeArticle.slug}`
        }
      });
      document.head.appendChild(schemaScript);

      return () => {
        const oldSchema = document.getElementById('blog-post-schema');
        if (oldSchema) oldSchema.remove();
      };
    } else {
      document.title = `GumSearch Blog — Competitor Intelligence & Gumroad Market Teardowns`;
      window.history.pushState({}, '', '/blog');
    }
  }, [activeArticle]);

  // Filter articles by search query & category
  const filteredArticles = useMemo(() => {
    return BLOG_POSTS.filter(post => {
      const matchesSearch = 
        post.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
        post.description.toLowerCase().includes(searchQuery.toLowerCase()) ||
        post.tags.some(t => t.toLowerCase().includes(searchQuery.toLowerCase()));
      
      const matchesCategory = selectedCategory === 'All' || post.category === selectedCategory;
      return matchesSearch && matchesCategory;
    });
  }, [searchQuery, selectedCategory]);

  const featuredArticle = useMemo(() => {
    return BLOG_POSTS.find(p => p.featured) || BLOG_POSTS[0];
  }, []);

  const categories = ['All', 'Teardowns', 'Notion & Templates', 'Market Trends', 'Case Studies'];

  const handleCopyLink = () => {
    navigator.clipboard.writeText(window.location.href);
    setCopiedLink(true);
    setTimeout(() => setCopiedLink(false), 2000);
  };

  return (
    <div className={`min-h-screen ${isLight ? 'bg-slate-50 text-slate-900' : 'bg-[#09090b] text-zinc-100'}`}>
      {/* Top Header Navigation */}
      <SharedNavbar
        theme={theme}
        onNavigateHome={onNavigateHome}
        onNavigateFreeTool={onNavigateFreeTool}
        onNavigateCategory={onNavigateCategory}
        onNavigateBlog={() => {
          setSelectedSlug(null);
          window.scrollTo({ top: 0, behavior: 'smooth' });
        }}
        onLaunchDashboard={onLaunchDashboard}
        onOpenFunnel={onOpenFunnel}
        activePage="blog"
      />

      <main className="max-w-7xl mx-auto px-4 sm:px-6 py-8 sm:py-12">
        {/* ARTICLE READER VIEW */}
        {activeArticle ? (
          <motion.div
            initial={{ opacity: 0, y: 15 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: 15 }}
            className="max-w-4xl mx-auto space-y-8"
          >
            {/* Breadcrumb Navigation */}
            <div className="flex items-center gap-2 text-xs font-semibold text-zinc-400">
              <button 
                onClick={() => setSelectedSlug(null)}
                className="hover:text-purple-400 transition-colors flex items-center gap-1 cursor-pointer"
              >
                <ArrowLeft className="w-3.5 h-3.5" /> Back to Blog
              </button>
              <span>/</span>
              <span className="text-purple-400 font-bold">{activeArticle.category}</span>
            </div>

            {/* Header */}
            <div className="space-y-4">
              <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-purple-500/10 border border-purple-500/20 text-purple-300 text-xs font-bold font-mono">
                <Tag className="w-3.5 h-3.5 text-purple-400" /> {activeArticle.category}
              </div>

              <h1 className="font-serif-heading text-3xl sm:text-5xl lg:text-6xl font-normal tracking-tight text-white leading-tight">
                {activeArticle.title}
              </h1>

              <p className="text-base sm:text-xl text-zinc-300 leading-relaxed font-sans">
                {activeArticle.description}
              </p>

              {/* Author & Metadata Bar */}
              <div className="pt-4 border-y border-zinc-800/80 py-4 flex flex-wrap items-center justify-between gap-4">
                <div className="flex items-center gap-3">
                  <img 
                    src={activeArticle.author.avatar} 
                    alt={activeArticle.author.name}
                    className="w-11 h-11 rounded-full object-cover border-2 border-purple-500/30 shadow-md"
                  />
                  <div>
                    <h4 className="text-sm font-bold text-white">{activeArticle.author.name}</h4>
                    <p className="text-xs text-zinc-400">{activeArticle.author.role}</p>
                  </div>
                </div>

                <div className="flex items-center gap-4 text-xs font-mono text-zinc-400">
                  <span className="flex items-center gap-1.5">
                    <FileText className="w-3.5 h-3.5 text-purple-400" /> {activeArticleWordCount.toLocaleString()} words
                  </span>
                  <span className="flex items-center gap-1.5">
                    <Calendar className="w-3.5 h-3.5 text-purple-400" /> {activeArticle.publishedAt}
                  </span>
                  <span className="flex items-center gap-1.5">
                    <Clock className="w-3.5 h-3.5 text-purple-400" /> {activeArticle.readTime}
                  </span>
                  <button 
                    onClick={handleCopyLink}
                    className="px-3 py-1 bg-zinc-900 hover:bg-zinc-800 text-zinc-200 rounded-lg border border-zinc-800 transition-colors flex items-center gap-1.5 cursor-pointer"
                  >
                    <Share2 className="w-3.5 h-3.5" />
                    {copiedLink ? 'Copied Link!' : 'Share'}
                  </button>
                </div>
              </div>
            </div>

            {/* Cover Image */}
            <div className="rounded-3xl overflow-hidden border border-zinc-800 shadow-2xl relative aspect-[16/9]">
              <img 
                src={activeArticle.coverImage} 
                alt={activeArticle.title} 
                className="w-full h-full object-cover"
              />
            </div>

            {/* Article Content */}
            <div 
              className="article-body"
              dangerouslySetInnerHTML={{ __html: activeArticle.content }}
            />

            {/* In-Article Conversion Callout */}
            <div className="my-10 p-6 sm:p-8 rounded-3xl bg-gradient-to-r from-purple-900/40 via-indigo-900/30 to-zinc-900 border border-purple-500/40 shadow-2xl text-center space-y-4">
              <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-purple-500/20 text-purple-300 text-xs font-bold">
                <Flame className="w-3.5 h-3.5 text-amber-400" /> GumSearch Market Intelligence Engine
              </div>
              <h3 className="text-2xl sm:text-3xl font-extrabold text-white">
                Want to analyze over 100,000+ Gumroad products in real-time?
              </h3>
              <p className="text-xs sm:text-sm text-zinc-300 max-w-xl mx-auto">
                Filter high-revenue products by verified review count, buyer complaint teardowns, and pricing gaps.
              </p>
              <div className="pt-2 flex flex-col sm:flex-row items-center justify-center gap-3">
                <button
                  onClick={onOpenFunnel}
                  className="px-6 py-3.5 bg-gradient-to-r from-purple-600 to-indigo-600 hover:from-purple-500 hover:to-indigo-500 text-white text-xs font-extrabold rounded-xl shadow-xl transition-all hover:scale-105 active:scale-95 cursor-pointer flex items-center gap-2"
                >
                  <span>Unlock GumSearch Pro Pass ($99.99)</span>
                  <ArrowRight className="w-4 h-4" />
                </button>
                <a
                  href={CHROME_EXTENSION_URL}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="px-6 py-3.5 bg-zinc-900 hover:bg-zinc-800 text-zinc-200 text-xs font-bold rounded-xl border border-zinc-700 transition-colors cursor-pointer inline-flex items-center justify-center"
                >
                  Get Chrome Extension
                </a>
              </div>
            </div>

            {/* Related Articles Footer */}
            <div className="pt-10 border-t border-zinc-800/80 space-y-6">
              <h3 className="text-xl font-extrabold text-white">Read Next</h3>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
                {BLOG_POSTS.filter(p => p.slug !== activeArticle.slug).slice(0, 2).map(post => (
                  <div
                    key={post.id}
                    onClick={() => {
                      setSelectedSlug(post.slug);
                      window.scrollTo({ top: 0, behavior: 'smooth' });
                    }}
                    className="p-5 bg-zinc-900/60 border border-zinc-800 hover:border-purple-500/40 rounded-2xl transition-all cursor-pointer group space-y-3"
                  >
                    <span className="text-[11px] font-bold text-purple-400 uppercase tracking-wider">{post.category}</span>
                    <h4 className="text-base font-bold text-white group-hover:text-purple-300 transition-colors line-clamp-2">
                      {post.title}
                    </h4>
                    <p className="text-xs text-zinc-400 line-clamp-2">{post.description}</p>
                  </div>
                ))}
              </div>
            </div>
          </motion.div>
        ) : (
          /* BLOG LISTING VIEW */
          <div className="space-y-12">
            {/* Blog Header & Hero */}
            <div className="text-center max-w-3xl mx-auto space-y-4">
              <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full border border-purple-500/30 bg-purple-500/10 text-purple-300 text-xs font-semibold backdrop-blur-md shadow-inner">
                <BookOpen className="w-3.5 h-3.5 text-purple-400" />
                <span>GumSearch Intelligence Blog</span>
              </div>

              <h1 className="font-serif-heading text-4xl sm:text-6xl font-normal tracking-tight text-white leading-tight">
                Gumroad Market Teardowns & Growth Guides
              </h1>

              <p className="text-sm sm:text-base text-zinc-400 font-sans leading-relaxed">
                Empirical data analysis, competitor revenue breakdowns, and actionable guides to help digital creators spot high-converting product opportunities.
              </p>

              {/* Search & Category Filter */}
              <div className="pt-4 space-y-4 max-w-xl mx-auto">
                <div className="relative">
                  <Search className="w-4 h-4 text-zinc-500 absolute left-4 top-1/2 -translate-y-1/2" />
                  <input
                    type="text"
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    placeholder="Search articles by keyword or tag (e.g. Notion, Teardowns)..."
                    className="w-full bg-zinc-900 border border-zinc-800 rounded-2xl pl-11 pr-4 py-3 text-sm text-white placeholder-zinc-500 focus:outline-none focus:ring-2 focus:ring-purple-500/50 shadow-inner"
                  />
                </div>

                {/* Categories Pills */}
                <div className="flex items-center justify-center gap-2 flex-wrap">
                  {categories.map(cat => (
                    <button
                      key={cat}
                      onClick={() => setSelectedCategory(cat)}
                      className={`px-3.5 py-1.5 rounded-xl text-xs font-semibold transition-all cursor-pointer ${
                        selectedCategory === cat
                          ? 'bg-purple-600 text-white shadow-lg shadow-purple-600/30'
                          : 'bg-zinc-900 text-zinc-400 hover:text-white border border-zinc-800'
                      }`}
                    >
                      {cat}
                    </button>
                  ))}
                </div>
              </div>
            </div>

            {/* Featured Article Card */}
            {featuredArticle && !searchQuery && selectedCategory === 'All' && (
              <motion.div
                initial={{ opacity: 0, y: 15 }}
                animate={{ opacity: 1, y: 0 }}
                onClick={() => {
                  setSelectedSlug(featuredArticle.slug);
                  window.scrollTo({ top: 0, behavior: 'smooth' });
                }}
                className="p-6 sm:p-8 rounded-3xl bg-gradient-to-r from-purple-950/40 via-zinc-900 to-zinc-900 border border-purple-500/30 hover:border-purple-500/60 shadow-2xl transition-all cursor-pointer group grid grid-cols-1 lg:grid-cols-12 gap-8 items-center"
              >
                <div className="lg:col-span-7 space-y-4">
                  <div className="flex items-center gap-2">
                    <span className="px-2.5 py-1 rounded-full text-[10px] font-black uppercase tracking-wider bg-amber-500/20 text-amber-400 border border-amber-500/30 flex items-center gap-1">
                      <Sparkles className="w-3 h-3" /> Featured Analysis
                    </span>
                    <span className="text-xs font-mono text-purple-400 font-bold">{featuredArticle.category}</span>
                  </div>

                  <h2 className="text-2xl sm:text-4xl font-extrabold text-white group-hover:text-purple-300 transition-colors leading-tight">
                    {featuredArticle.title}
                  </h2>

                  <p className="text-xs sm:text-sm text-zinc-400 line-clamp-3 leading-relaxed">
                    {featuredArticle.description}
                  </p>

                  <div className="flex items-center gap-4 text-xs text-zinc-400 pt-2">
                    <div className="flex items-center gap-2">
                      <img src={featuredArticle.author.avatar} alt={featuredArticle.author.name} className="w-6 h-6 rounded-full object-cover" />
                      <span className="font-bold text-zinc-200">{featuredArticle.author.name}</span>
                    </div>
                    <span>•</span>
                    <span>{featuredArticle.readTime}</span>
                  </div>
                </div>

                <div className="lg:col-span-5 relative aspect-[16/10] rounded-2xl overflow-hidden border border-zinc-800">
                  <img src={featuredArticle.coverImage} alt={featuredArticle.title} className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500" />
                </div>
              </motion.div>
            )}

            {/* Articles Grid */}
            <div className="space-y-6">
              <div className="flex items-center justify-between border-b border-zinc-800 pb-3">
                <h3 className="text-lg font-bold text-white flex items-center gap-2">
                  <TrendingUp className="w-4 h-4 text-purple-400" />
                  Latest Articles ({filteredArticles.length})
                </h3>
              </div>

              {filteredArticles.length === 0 ? (
                <div className="text-center py-16 space-y-2 bg-zinc-900/40 rounded-3xl border border-zinc-800">
                  <p className="text-base font-bold text-white">No articles found matching "{searchQuery}"</p>
                  <p className="text-xs text-zinc-400">Try searching for a different keyword or click "All" categories.</p>
                </div>
              ) : (
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                  {filteredArticles.map(article => (
                    <motion.div
                      key={article.id}
                      whileHover={{ y: -4 }}
                      onClick={() => {
                        setSelectedSlug(article.slug);
                        window.scrollTo({ top: 0, behavior: 'smooth' });
                      }}
                      className="p-5 bg-zinc-900/70 hover:bg-zinc-900 border border-zinc-800 hover:border-purple-500/40 rounded-3xl transition-all cursor-pointer group flex flex-col justify-between space-y-4 shadow-xl"
                    >
                      <div className="space-y-3">
                        <div className="aspect-[16/9] rounded-2xl overflow-hidden border border-zinc-800 relative">
                          <img src={article.coverImage} alt={article.title} className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500" />
                          <span className="absolute top-3 left-3 px-2.5 py-1 rounded-lg bg-black/70 backdrop-blur-md text-[10px] font-bold text-purple-300 border border-purple-500/30">
                            {article.category}
                          </span>
                        </div>

                        <h3 className="text-lg font-bold text-white group-hover:text-purple-300 transition-colors line-clamp-2 leading-snug">
                          {article.title}
                        </h3>

                        <p className="text-xs text-zinc-400 line-clamp-3 leading-relaxed">
                          {article.description}
                        </p>
                      </div>

                      <div className="pt-3 border-t border-zinc-800/80 flex items-center justify-between text-[11px] text-zinc-400 font-mono">
                        <div className="flex items-center gap-1.5">
                          <User className="w-3 h-3 text-purple-400" />
                          <span>{article.author.name.split(' ')[0]}</span>
                        </div>
                        <span>{article.readTime}</span>
                      </div>
                    </motion.div>
                  ))}
                </div>
              )}
            </div>

            {/* GOOGLE PAA (PEOPLE ALSO ASK) FAQ ACCORDION SECTION */}
            <div className="pt-12 border-t border-zinc-800/80 space-y-6">
              <div className="text-center max-w-xl mx-auto space-y-2">
                <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-purple-500/10 text-purple-300 text-xs font-bold font-mono">
                  <HelpCircle className="w-3.5 h-3.5 text-purple-400" /> Frequently Searched Creator Questions
                </div>
                <h3 className="text-2xl sm:text-3xl font-extrabold text-white">
                  Gumroad Competitor Research & Sales FAQs
                </h3>
                <p className="text-xs sm:text-sm text-zinc-400">
                  Answers to the most searched queries about digital product revenues, Gumroad seller rankings, and market gaps.
                </p>
              </div>

              <div className="max-w-3xl mx-auto space-y-3">
                {FAQ_DATA.map((faq, index) => (
                  <div
                    key={index}
                    className="border border-zinc-800 bg-zinc-900/60 rounded-2xl overflow-hidden transition-all"
                  >
                    <button
                      onClick={() => setOpenFaqIndex(openFaqIndex === index ? null : index)}
                      className="w-full p-4 sm:p-5 text-left font-bold text-sm sm:text-base text-white flex items-center justify-between gap-4 cursor-pointer hover:bg-zinc-800/50 transition-colors"
                    >
                      <span className="flex items-center gap-2">
                        <span className="text-purple-400 font-mono text-xs">Q:</span>
                        {faq.question}
                      </span>
                      <ChevronDown className={`w-4 h-4 text-purple-400 shrink-0 transition-transform ${openFaqIndex === index ? 'rotate-180' : ''}`} />
                    </button>

                    <AnimatePresence>
                      {openFaqIndex === index && (
                        <motion.div
                          initial={{ opacity: 0, height: 0 }}
                          animate={{ opacity: 1, height: 'auto' }}
                          exit={{ opacity: 0, height: 0 }}
                          className="px-5 pb-5 text-xs sm:text-sm text-zinc-300 leading-relaxed border-t border-zinc-800/60 pt-3"
                        >
                          {faq.answer}
                        </motion.div>
                      )}
                    </AnimatePresence>
                  </div>
                ))}
              </div>
            </div>
          </div>
        )}
      </main>

      {/* FOOTER */}
      <footer className="py-12 border-t border-zinc-800/60 max-w-7xl mx-auto px-6 text-xs text-zinc-500 flex flex-col sm:flex-row items-center justify-between gap-4 mt-16">
        <div className="flex items-center gap-2 font-bold text-zinc-300">
          <div className="w-5 h-5 rounded-lg bg-gradient-to-tr from-purple-600 to-indigo-600 flex items-center justify-center text-white text-[10px]">
            G
          </div>
          GumSearch
        </div>
        <div className="flex items-center gap-6">
          <a href={CHROME_EXTENSION_URL} target="_blank" rel="noopener noreferrer" className="hover:text-zinc-300 transition-colors cursor-pointer">Chrome Extension</a>
          <button onClick={() => {
            setSelectedSlug(null);
            window.scrollTo({ top: 0, behavior: 'smooth' });
          }} className="hover:text-zinc-300 transition-colors cursor-pointer">Blog</button>
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
