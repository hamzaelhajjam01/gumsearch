/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState, useEffect, useMemo } from 'react';
import { Search, Filter, ChevronDown, Activity, DollarSign, Target, Zap, TrendingUp, Tag, ShoppingCart, Star, AlertCircle, RotateCcw, Bookmark, ArrowUpRight, Sparkles } from 'lucide-react';
import { motion } from 'framer-motion';
import { DataTable } from './components/DataTable';
import { ProductDrawer } from './components/ProductDrawer';
import { UserDropdown } from './components/UserDropdown';
import { ProfileModal } from './components/ProfileModal';
import { PreferencesModal } from './components/PreferencesModal';
import { LandingPage } from './components/LandingPage';
import { CategoryLandingPage, CATEGORIES_DATA } from './components/CategoryLandingPage';
import { LegalPage } from './components/LegalPage';
import { SharedNavbar } from './components/SharedNavbar';
import { BrowseDropdown } from './components/BrowseDropdown';
import { ClerkHeaderAuth } from './components/ClerkHeaderAuth';
import { HighConvertingFunnelModal } from './components/HighConvertingFunnelModal';
import { BlogPage } from './components/BlogPage';
import { useUser, useClerk } from '@clerk/clerk-react';
import { MOCK_PRODUCTS } from './data';
import { Product } from './types';
import { supabase } from './lib/supabase';

const WHOP_CHECKOUT_URL = "https://whop.com/checkout/plan_AoctiBy7JgMkV";

export default function App() {
  const [currentView, setCurrentView] = useState<'landing' | 'dashboard' | 'category-landing' | 'legal' | 'blog'>('landing');
  const [activeArticleSlug, setActiveArticleSlug] = useState<string | null>(null);
  const [legalPage, setLegalPage] = useState<'terms' | 'privacy'>('terms');
  const [activeCategorySlug, setActiveCategorySlug] = useState<string>('business-and-money');
  const [selectedProduct, setSelectedProduct] = useState<Product | null>(null);
  const [products, setProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState(true);
  const [isFunnelOpen, setIsFunnelOpen] = useState(false);
  const [isPostPaymentSuccess, setIsPostPaymentSuccess] = useState(false);

  // Clerk Auth state check for automatic /dashboard redirection
  let isClerkSignedIn = false;
  let hasPaidAccess = false;
  let clerk: any = null;
  try {
    const clerkUser = useUser();
    clerk = useClerk();
    isClerkSignedIn = !!clerkUser?.isSignedIn;
    hasPaidAccess = !!clerkUser?.user?.publicMetadata?.hasAccess;
  } catch {
    // Fallback if ClerkProvider is unmounted
  }

  // Detect post-payment return from Whop
  useEffect(() => {
    const searchParams = new URLSearchParams(window.location.search);
    if (searchParams.get('payment') === 'success' || searchParams.has('receipt_id') || searchParams.has('payment_intent')) {
      setIsPostPaymentSuccess(true);
      
      // If they are not signed in, prompt them to create an account
      if (!isClerkSignedIn && clerk) {
        // Wait a tiny bit for Clerk to fully initialize its modals
        setTimeout(() => {
          if (clerk.openSignUp) {
            clerk.openSignUp();
          }
        }, 500);
      }
      
      // Clean up the URL so it doesn't stay there on refresh
      const newUrl = window.location.pathname;
      window.history.replaceState({}, '', newUrl);
    }
  }, [isClerkSignedIn, clerk]);

  // Polling mechanism: If they just paid and signed in, their initial session token might 
  // not have the `hasAccess` metadata yet because the backend webhook takes 1-2 seconds.
  // We poll to refresh the token until they get access, so the redirect is seamless!
  useEffect(() => {
    let pollInterval: any;
    if (isPostPaymentSuccess && isClerkSignedIn && !hasPaidAccess && clerk) {
      pollInterval = setInterval(async () => {
        try {
          // Force Clerk to fetch the latest metadata from the server
          await clerk.session?.getToken({ skipCache: true });
          // Note: useUser() hook in App will automatically re-render once the token updates
        } catch (e) {
          console.error("Error polling session", e);
        }
      }, 2000);
    }
    return () => {
      if (pollInterval) clearInterval(pollInterval);
    };
  }, [isPostPaymentSuccess, isClerkSignedIn, hasPaidAccess, clerk]);

  // Redirect to Dashboard on Sign In (only if they have paid access), or Landing on Sign Out
  useEffect(() => {
    if (isClerkSignedIn) {
      if (hasPaidAccess) {
        if (currentView !== 'dashboard') {
          setCurrentView('dashboard');
        }
      } else {
        // User is signed in but hasn't paid. Keep them on landing and open the funnel.
        if (currentView === 'dashboard') {
          setCurrentView('landing');
          window.history.pushState({}, '', '/');
          setIsFunnelOpen(true);
        }
      }
    } else if (!isClerkSignedIn && currentView === 'dashboard') {
      setCurrentView('landing');
      window.history.pushState({}, '', '/');
    }
  }, [isClerkSignedIn, hasPaidAccess, currentView]);

  // Clean URL History Synchronization for /dashboard, /, and category pages
  useEffect(() => {
    if (currentView === 'dashboard') {
      window.history.pushState({}, '', '/dashboard');
    } else if (currentView === 'landing' && window.location.pathname === '/dashboard') {
      window.history.pushState({}, '', '/');
    }
  }, [currentView]);

  // URL Query Sync for SEO Category, Free Tool, and Blog pages
  useEffect(() => {
    const params = new URLSearchParams(window.location.search);
    const catParam = params.get('category');
    const pathname = window.location.pathname;

    if (pathname.startsWith('/blog')) {
      const parts = pathname.split('/');
      if (parts[2]) {
        setActiveArticleSlug(parts[2]);
      }
      setCurrentView('blog');
    } else if (pathname === '/creator-finder' || pathname === '/free-tool') {
      setCurrentView('dashboard');
    } else if (pathname === '/terms' || pathname === '/terms-of-service') {
      setLegalPage('terms');
      setCurrentView('legal');
    } else if (pathname === '/privacy' || pathname === '/privacy-policy') {
      setLegalPage('privacy');
      setCurrentView('legal');
    } else if (catParam && CATEGORIES_DATA[catParam]) {
      setActiveCategorySlug(catParam);
      setCurrentView('category-landing');
    }
  }, []);

  const handleNavigateCategory = (slug: string) => {
    if (slug === 'home' || slug === 'landing') {
      setCurrentView('landing');
      window.history.pushState({}, '', '/');
      window.scrollTo({ top: 0, behavior: 'smooth' });
    } else if (CATEGORIES_DATA[slug]) {
      setActiveCategorySlug(slug);
      setCurrentView('category-landing');
      window.history.pushState({}, '', `?category=${slug}`);
      window.scrollTo({ top: 0, behavior: 'smooth' });
    }
  };

  const handleLaunchDashboardWithCategory = (categoryName: string) => {
    if (!isClerkSignedIn || !hasPaidAccess) {
      setIsFunnelOpen(true);
      return;
    }
    const match = categoryName.split('&')[0].trim();
    setSelectedCategory(match);
    setCurrentView('dashboard');
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };
  
  // User Profile & Preferences states
  const [userName, setUserName] = useState("Alex Rivers");
  const [userEmail, setUserEmail] = useState("alex@gumsearch.io");
  const [isProfileOpen, setIsProfileOpen] = useState(false);
  const [isPreferencesOpen, setIsPreferencesOpen] = useState(false);
  const [density, setDensity] = useState<'Comfortable' | 'Compact'>('Comfortable');
  const [theme, setTheme] = useState<'dark' | 'light'>('dark');

  // Bookmarks / Saved Products State
  const [savedProductIds, setSavedProductIds] = useState<string[]>(() => {
    try {
      return JSON.parse(localStorage.getItem('gumsearch_saved_products') || '[]');
    } catch {
      return [];
    }
  });
  const [savedOnly, setSavedOnly] = useState(false);

  const handleToggleSaveProduct = (id: string) => {
    setSavedProductIds(prev => {
      const next = prev.includes(id) ? prev.filter(item => item !== id) : [...prev, id];
      try {
        localStorage.setItem('gumsearch_saved_products', JSON.stringify(next));
      } catch (e) {
        console.error("Failed saving to localStorage", e);
      }
      return next;
    });
  };

  // Filter states
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedCategory, setSelectedCategory] = useState("All");
  const [priceFilter, setPriceFilter] = useState("All");
  const [revenueFilter, setRevenueFilter] = useState("All");
  const [minSalesFilter, setMinSalesFilter] = useState("All");
  const [mixedReviewsOnly, setMixedReviewsOnly] = useState(false);
  const [minRatingFilter, setMinRatingFilter] = useState("All");
  const [opportunityOnly, setOpportunityOnly] = useState(false);
  const [sortBy, setSortBy] = useState("Highest Revenue");

  useEffect(() => {
    const fetchProducts = async () => {
      try {
        setLoading(true);
        const { data, error } = await supabase
          .from('products')
          .select('*')
          .limit(2000)
          .order('estimated_revenue', { ascending: false });
          
        if (error) {
          console.error("Supabase fetch error:", error);
          setProducts(MOCK_PRODUCTS);
        } else if (data && data.length > 0) {
          const mapped: Product[] = data.map((item: any) => ({
            id: String(item.id || item.product_url || item.product_name || Math.random()),
            name: item.product_name || item.name || item.title || 'Unknown Product',
            creator: item.creator_name || item.creator || item.author || 'Unknown Creator',
            category: item.category || 'Uncategorized',
            price: Number(item.price || 0),
            sales: Number(item.estimated_sales ?? item.sales ?? 0),
            revenue: Number(item.estimated_revenue ?? item.revenue ?? 0),
            rating: Number(item.avg_rating ?? item.rating ?? 0),
            reviewCount: Number(item.total_reviews ?? item.review_count ?? item.reviews ?? 0),
            reviewBreakdown: {
              stars5: Number(item.star_5_percent ?? item.stars5 ?? 80),
              stars4: Number(item.star_4_percent ?? item.stars4 ?? 15),
              stars3: Number(item.star_3_percent ?? item.stars3 ?? 3),
              stars2: Number(item.star_2_percent ?? item.stars2 ?? 1),
              stars1: Number(item.star_1_percent ?? item.stars1 ?? 1),
            },
            tags: Array.isArray(item.opportunity_tags) 
              ? item.opportunity_tags 
              : Array.isArray(item.tags) 
              ? item.tags 
              : typeof item.tags === 'string' 
              ? item.tags.split(',').map((t: string) => t.trim()) 
              : [],
            aiInsights: item.ai_gap_analysis || item.aiInsights || 'No AI gap analysis available.',
            productUrl: item.product_url || item.productUrl,
          }));
          setProducts(mapped);
        } else {
          setProducts(MOCK_PRODUCTS);
        }
      } catch (err) {
        console.error(err);
        setProducts(MOCK_PRODUCTS);
      } finally {
        setLoading(false);
      }
    };
    
    fetchProducts();
  }, []);

  const filteredAndSortedProducts = useMemo(() => {
    let result = [...products];

    // Search query filter
    if (searchQuery) {
      const q = searchQuery.toLowerCase();
      result = result.filter(p => 
        p.name.toLowerCase().includes(q) || 
        p.creator.toLowerCase().includes(q) ||
        p.category.toLowerCase().includes(q)
      );
    }

    // Category filter with fuzzy matching
    if (selectedCategory !== "All") {
      const catLower = selectedCategory.toLowerCase();
      const firstWord = catLower.split(' ')[0].split('&')[0].trim();
      result = result.filter(p => {
        const itemCat = p.category.toLowerCase();
        return itemCat.includes(catLower) || itemCat.includes(firstWord) || catLower.includes(itemCat);
      });
    }

    // Price range filter
    if (priceFilter === "Under $25") {
      result = result.filter(p => p.price < 25);
    } else if (priceFilter === "$25 - $100") {
      result = result.filter(p => p.price >= 25 && p.price <= 100);
    } else if (priceFilter === "$100+") {
      result = result.filter(p => p.price > 100);
    }

    // Est. Revenue filter
    if (revenueFilter === "$50k+") {
      result = result.filter(p => p.revenue >= 50000);
    } else if (revenueFilter === "$100k+") {
      result = result.filter(p => p.revenue >= 100000);
    } else if (revenueFilter === "$500k+") {
      result = result.filter(p => p.revenue >= 500000);
    }

    // Min Sales filter
    if (minSalesFilter === "500+") {
      result = result.filter(p => p.sales >= 500);
    } else if (minSalesFilter === "1k+") {
      result = result.filter(p => p.sales >= 1000);
    } else if (minSalesFilter === "5k+") {
      result = result.filter(p => p.sales >= 5000);
    }

    // Mixed reviews filter (Rating < 4.2 with high sales)
    if (mixedReviewsOnly) {
      result = result.filter(p => p.rating < 4.2 && p.sales > 500);
    }

    // Min rating filter
    if (minRatingFilter === "4.5+") {
      result = result.filter(p => p.rating >= 4.5);
    } else if (minRatingFilter === "4.0+") {
      result = result.filter(p => p.rating >= 4.0);
    } else if (minRatingFilter === "Under 4.0") {
      result = result.filter(p => p.rating < 4.0);
    }

    // Opportunity tag filter
    if (opportunityOnly) {
      result = result.filter(p => 
        p.tags.some(t => t.toLowerCase().includes('opportunity') || t.toLowerCase().includes('low rating')) ||
        (p.rating < 4.0 && p.sales > 500)
      );
    }

    // Saved / Bookmarked filter
    if (savedOnly) {
      result = result.filter(p => savedProductIds.includes(p.id));
    }

    // Sorting
    if (sortBy === 'Highest Revenue') {
      result.sort((a, b) => b.revenue - a.revenue);
    } else if (sortBy === 'Fastest Growing') {
      result.sort((a, b) => (b.sales / (b.reviewCount || 1)) - (a.sales / (a.reviewCount || 1)));
    } else if (sortBy === 'Lowest Rating (High Sales)') {
      result.sort((a, b) => {
        const scoreA = a.sales / (a.rating || 1);
        const scoreB = b.sales / (b.rating || 1);
        return scoreB - scoreA;
      });
    } else if (sortBy === 'Newest') {
      result.sort((a, b) => b.id.localeCompare(a.id));
    }

    return result;
  }, [products, searchQuery, selectedCategory, priceFilter, revenueFilter, minSalesFilter, mixedReviewsOnly, minRatingFilter, opportunityOnly, savedOnly, savedProductIds, sortBy]);

  // Compute metrics
  const totalTracked = products.length;
  const avgRevenue = products.length > 0 
    ? products.reduce((acc, p) => acc + p.revenue, 0) / products.length 
    : 0;
    
  const categoryCounts = products.reduce((acc, p) => {
    acc[p.category] = (acc[p.category] || 0) + 1;
    return acc;
  }, {} as Record<string, number>);
  const topCategory = Object.entries(categoryCounts).sort((a, b) => b[1] - a[1])[0]?.[0] || 'N/A';
  
  const highOpportunityCount = products.filter(p => 
    p.tags.some(t => t.toLowerCase().includes('opportunity') || t.toLowerCase().includes('low rating')) || 
    (p.rating < 4.0 && p.sales > 500)
  ).length;

  // (Removed bypassable post-payment URL detection here)

  if (currentView === 'legal') {
    return (
      <>
        <LegalPage
          page={legalPage}
          onNavigateHome={() => { setCurrentView('landing'); window.scrollTo({ top: 0, behavior: 'smooth' }); }}
          onNavigateFreeTool={() => setIsFunnelOpen(true)}
          onNavigateCategory={handleNavigateCategory}
          onLaunchDashboard={() => setCurrentView('dashboard')}
          onOpenFunnel={() => setIsFunnelOpen(true)}
          onSwitchLegalPage={(p) => { setLegalPage(p); window.scrollTo({ top: 0, behavior: 'smooth' }); }}
          theme={theme}
        />
        <HighConvertingFunnelModal 
          isOpen={isFunnelOpen} 
          onClose={() => setIsFunnelOpen(false)} 
          checkoutUrl={WHOP_CHECKOUT_URL} 
        />
      </>
    );
  }

  if (currentView === 'landing') {
    return (
      <>
        {isPostPaymentSuccess && !isClerkSignedIn && (
          <div className="bg-emerald-500/10 border-b border-emerald-500/20 text-emerald-600 px-4 py-3 text-center text-sm font-semibold flex items-center justify-center gap-2">
            <Sparkles className="w-4 h-4" />
            Payment Successful! Please create your account in the popup below to claim your Lifetime Access.
          </div>
        )}
        <LandingPage 
          onLaunchApp={() => {
            if (isClerkSignedIn && hasPaidAccess) {
              setCurrentView('dashboard');
            } else {
              setIsFunnelOpen(true);
            }
          }} 
          onLaunchFreeDashboard={() => {
            if (isClerkSignedIn && hasPaidAccess) {
              setCurrentView('dashboard');
              window.scrollTo({ top: 0, behavior: 'smooth' });
            } else {
              setIsFunnelOpen(true);
            }
          }}
          onNavigateCategory={handleNavigateCategory}
          onNavigateFreeTool={() => setIsFunnelOpen(true)}
          onNavigateBlog={() => {
            setCurrentView('blog');
            setActiveArticleSlug(null);
            window.scrollTo({ top: 0, behavior: 'smooth' });
          }}
          onNavigateLegal={(p) => {
            setLegalPage(p);
            setCurrentView('legal');
            window.scrollTo({ top: 0, behavior: 'smooth' });
          }}
          onOpenFunnel={() => setIsFunnelOpen(true)}
          theme={theme} 
        />
        <HighConvertingFunnelModal 
          isOpen={isFunnelOpen} 
          onClose={() => setIsFunnelOpen(false)} 
          checkoutUrl={WHOP_CHECKOUT_URL} 
        />
      </>
    );
  }

  if (currentView === 'blog') {
    return (
      <>
        <BlogPage
          theme={theme}
          initialArticleSlug={activeArticleSlug}
          onNavigateHome={() => { setCurrentView('landing'); window.scrollTo({ top: 0, behavior: 'smooth' }); }}
          onNavigateFreeTool={() => setIsFunnelOpen(true)}
          onNavigateCategory={handleNavigateCategory}
          onLaunchDashboard={() => setCurrentView('dashboard')}
          onOpenFunnel={() => setIsFunnelOpen(true)}
          onNavigateLegal={(p) => {
            setLegalPage(p);
            setCurrentView('legal');
            window.scrollTo({ top: 0, behavior: 'smooth' });
          }}
        />
        <HighConvertingFunnelModal 
          isOpen={isFunnelOpen} 
          onClose={() => setIsFunnelOpen(false)} 
          checkoutUrl={WHOP_CHECKOUT_URL} 
        />
      </>
    );
  }



  if (currentView === 'category-landing') {
    return (
      <div className={`min-h-screen ${theme === 'light' ? 'bg-zinc-100 text-zinc-900' : 'bg-zinc-950 text-zinc-50'}`}>
        <SharedNavbar
          theme={theme}
          onNavigateHome={() => { setCurrentView('landing'); window.scrollTo({ top: 0, behavior: 'smooth' }); }}
          onNavigateFreeTool={() => setIsFunnelOpen(true)}
          onNavigateCategory={handleNavigateCategory}
          onLaunchDashboard={() => setCurrentView('dashboard')}
          onOpenFunnel={() => setIsFunnelOpen(true)}
          activePage="category"
        />

        <CategoryLandingPage 
          categorySlug={activeCategorySlug}
          products={products}
          onSelectProduct={setSelectedProduct}
          onLaunchAppWithCategory={handleLaunchDashboardWithCategory}
          onNavigateCategory={handleNavigateCategory}
          onOpenFunnel={() => setIsFunnelOpen(true)}
          savedProductIds={savedProductIds}
          onToggleSaveProduct={handleToggleSaveProduct}
          theme={theme}
        />

        <ProductDrawer 
          product={selectedProduct} 
          isOpen={!!selectedProduct} 
          onClose={() => setSelectedProduct(null)} 
          savedProductIds={savedProductIds}
          onToggleSaveProduct={handleToggleSaveProduct}
          theme={theme}
        />

        <HighConvertingFunnelModal 
          isOpen={isFunnelOpen} 
          onClose={() => setIsFunnelOpen(false)} 
          checkoutUrl={WHOP_CHECKOUT_URL} 
        />
      </div>
    );
  }

  // CRITICAL SECURITY CHECK: Never render dashboard UI if they don't have access
  if (currentView === 'dashboard' && (!isClerkSignedIn || !hasPaidAccess)) {
    return (
      <div className={`min-h-screen flex items-center justify-center ${theme === 'light' ? 'bg-zinc-100' : 'bg-zinc-950'}`}>
        <div className="text-center p-8">
          <div className="w-12 h-12 border-4 border-purple-500/30 border-t-purple-500 rounded-full animate-spin mx-auto mb-4"></div>
          <p className="text-zinc-500 font-medium">Verifying access...</p>
        </div>
      </div>
    );
  }

  return (
    <div className={`min-h-screen font-sans selection:bg-purple-500/30 transition-colors duration-200 ${
      theme === 'light' ? 'bg-zinc-100 text-zinc-900' : 'bg-zinc-950 text-zinc-50'
    }`}>

      {/* Header */}
      <header className={`sticky top-0 z-30 border-b backdrop-blur-md transition-colors ${
        theme === 'light' ? 'border-zinc-200 bg-white/80' : 'border-zinc-800 bg-zinc-950/80'
      }`}>
        <div className="max-w-[1600px] mx-auto px-4 sm:px-6 h-16 flex items-center justify-between gap-3">
          <div className="flex items-center gap-4 sm:gap-6">
            <button 
              onClick={() => {
                if (isClerkSignedIn && hasPaidAccess) {
                  setCurrentView('dashboard');
                  window.scrollTo({ top: 0, behavior: 'smooth' });
                } else {
                  setCurrentView('landing');
                }
              }}
              className="flex items-center gap-2 text-purple-500 font-bold hover:opacity-80 transition-opacity cursor-pointer shrink-0"
            >
              <Activity className="w-5 h-5 sm:w-6 sm:h-6" />
              <span className={`text-lg sm:text-xl font-bold tracking-tight ${theme === 'light' ? 'text-zinc-900' : 'text-zinc-100'}`}>GumSearch</span>
            </button>
            
            <div className="hidden md:flex relative group">
              <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                <Search className={`w-4 h-4 ${theme === 'light' ? 'text-slate-400' : 'text-zinc-500'}`} />
              </div>
              <input
                type="text"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className={`w-64 lg:w-80 border text-sm rounded-lg focus:ring-1 focus:ring-purple-500 focus:border-purple-500 block pl-9 p-2 transition-all outline-none ${
                  theme === 'light' 
                    ? 'bg-slate-100/80 border-slate-200 text-slate-900 placeholder-slate-400 focus:bg-white' 
                    : 'bg-zinc-900 border-zinc-800 text-zinc-100 placeholder-zinc-500'
                }`}
                placeholder="Search products, creators..."
              />
            </div>
          </div>

          <div className="flex items-center gap-2 sm:gap-4">
            <div className="relative flex items-center">
              <select
                value={selectedCategory}
                onChange={(e) => setSelectedCategory(e.target.value)}
                className={`border text-xs sm:text-sm rounded-lg px-2.5 sm:px-3 py-1.5 focus:ring-1 focus:ring-purple-500 focus:border-purple-500 outline-none cursor-pointer ${
                  theme === 'light' 
                    ? 'bg-white border-slate-200 text-slate-800 font-medium' 
                    : 'bg-zinc-900 border-zinc-800 text-zinc-300'
                }`}
              >
                <option value="All">All Categories</option>
                <option value="Business">Business</option>
                <option value="Education">Education</option>
                <option value="Templates">Templates</option>
                <option value="Design Tools">Design Tools</option>
                <option value="Assets">Assets</option>
                <option value="AI Tools">AI Tools</option>
              </select>
            </div>
            <ClerkHeaderAuth 
              onOpenProfile={() => setIsProfileOpen(true)}
              onOpenPreferences={() => setIsPreferencesOpen(true)}
              onOpenFunnel={() => setIsFunnelOpen(true)}
              onLogout={() => {
                setCurrentView('landing');
                window.history.pushState({}, '', '/');
              }}
              theme={theme}
            />
          </div>
        </div>
      </header>

      <main className="max-w-[1600px] mx-auto px-4 sm:px-6 py-6 sm:py-8">
        {/* Filter Bar */}
            <div className="flex flex-col sm:flex-row items-center justify-between gap-4 mb-6">
              <div className="flex items-center gap-3 w-full sm:w-auto overflow-x-auto pb-2 sm:pb-0 scrollbar-hide">
                
                {/* Tracked Watchlist Filter Toggle */}
                <button
                  onClick={() => setSavedOnly(!savedOnly)}
                  className={`flex items-center gap-1.5 px-3 py-1.5 border rounded-lg text-sm transition-colors whitespace-nowrap font-medium cursor-pointer ${
                    savedOnly 
                      ? 'bg-purple-500/20 border-purple-500 text-purple-300 font-semibold' 
                      : theme === 'light'
                      ? 'bg-white border-slate-200 text-slate-800 hover:border-slate-300 shadow-xs'
                      : 'bg-zinc-900 border-zinc-800 text-zinc-300 hover:text-zinc-100 hover:border-zinc-700'
                  }`}
                >
                  <Target className={`w-4 h-4 ${savedOnly ? 'text-purple-400' : 'text-slate-400'}`} />
                  Tracked Watchlist ({savedProductIds.length})
                </button>

                {/* Price Filter */}
                <div className={`flex items-center gap-1.5 px-3 py-1.5 border rounded-lg text-sm transition-colors ${
                  theme === 'light' ? 'bg-white border-slate-200 text-slate-800 hover:border-slate-300 shadow-xs' : 'bg-zinc-900 border-zinc-800 text-zinc-300 hover:border-zinc-700'
                }`}>
                  <Tag className="w-4 h-4 text-purple-500" />
                  <select
                    value={priceFilter}
                    onChange={(e) => setPriceFilter(e.target.value)}
                    className={`bg-transparent outline-none cursor-pointer text-sm font-medium ${
                      theme === 'light' ? 'text-slate-800' : 'text-zinc-200'
                    }`}
                  >
                    <option value="All" className={theme === 'light' ? 'bg-white text-slate-900' : 'bg-zinc-900 text-zinc-100'}>Price: All</option>
                    <option value="Under $25" className={theme === 'light' ? 'bg-white text-slate-900' : 'bg-zinc-900 text-zinc-100'}>Under $25</option>
                    <option value="$25 - $100" className={theme === 'light' ? 'bg-white text-slate-900' : 'bg-zinc-900 text-zinc-100'}>$25 - $100</option>
                    <option value="$100+" className={theme === 'light' ? 'bg-white text-slate-900' : 'bg-zinc-900 text-zinc-100'}>$100+</option>
                  </select>
                </div>

                {/* Est Revenue Filter */}
                <div className={`flex items-center gap-1.5 px-3 py-1.5 border rounded-lg text-sm transition-colors ${
                  theme === 'light' ? 'bg-white border-slate-200 text-slate-800 hover:border-slate-300 shadow-xs' : 'bg-zinc-900 border-zinc-800 text-zinc-300 hover:border-zinc-700'
                }`}>
                  <TrendingUp className="w-4 h-4 text-emerald-500" />
                  <select
                    value={revenueFilter}
                    onChange={(e) => setRevenueFilter(e.target.value)}
                    className={`bg-transparent outline-none cursor-pointer text-sm font-medium ${
                      theme === 'light' ? 'text-slate-800' : 'text-zinc-200'
                    }`}
                  >
                    <option value="All" className={theme === 'light' ? 'bg-white text-slate-900' : 'bg-zinc-900 text-zinc-100'}>Revenue: All</option>
                    <option value="$50k+" className={theme === 'light' ? 'bg-white text-slate-900' : 'bg-zinc-900 text-zinc-100'}>$50k+</option>
                    <option value="$100k+" className={theme === 'light' ? 'bg-white text-slate-900' : 'bg-zinc-900 text-zinc-100'}>$100k+</option>
                    <option value="$500k+" className={theme === 'light' ? 'bg-white text-slate-900' : 'bg-zinc-900 text-zinc-100'}>$500k+</option>
                  </select>
                </div>

                {/* Min Sales Filter */}
                <div className={`flex items-center gap-1.5 px-3 py-1.5 border rounded-lg text-sm transition-colors ${
                  theme === 'light' ? 'bg-white border-slate-200 text-slate-800 hover:border-slate-300 shadow-xs' : 'bg-zinc-900 border-zinc-800 text-zinc-300 hover:border-zinc-700'
                }`}>
                  <ShoppingCart className="w-4 h-4 text-blue-500" />
                  <select
                    value={minSalesFilter}
                    onChange={(e) => setMinSalesFilter(e.target.value)}
                    className={`bg-transparent outline-none cursor-pointer text-sm font-medium ${
                      theme === 'light' ? 'text-slate-800' : 'text-zinc-200'
                    }`}
                  >
                    <option value="All" className={theme === 'light' ? 'bg-white text-slate-900' : 'bg-zinc-900 text-zinc-100'}>Sales: All</option>
                    <option value="500+" className={theme === 'light' ? 'bg-white text-slate-900' : 'bg-zinc-900 text-zinc-100'}>500+ Sales</option>
                    <option value="1k+" className={theme === 'light' ? 'bg-white text-slate-900' : 'bg-zinc-900 text-zinc-100'}>1,000+ Sales</option>
                    <option value="5k+" className={theme === 'light' ? 'bg-white text-slate-900' : 'bg-zinc-900 text-zinc-100'}>5,000+ Sales</option>
                  </select>
                </div>

            {/* Mixed Reviews Toggle */}
            <button
              onClick={() => setMixedReviewsOnly(!mixedReviewsOnly)}
              className={`flex items-center gap-2 px-3 py-1.5 border rounded-lg text-sm transition-colors whitespace-nowrap font-medium cursor-pointer ${
                mixedReviewsOnly 
                  ? 'bg-rose-500/20 border-rose-500 text-rose-700 font-semibold' 
                  : theme === 'light'
                  ? 'bg-white border-slate-200 text-slate-800 hover:border-slate-300 shadow-xs'
                  : 'bg-zinc-900 border-zinc-800 text-zinc-300 hover:text-zinc-100 hover:border-zinc-700'
              }`}
            >
              <AlertCircle className={`w-4 h-4 ${mixedReviewsOnly ? 'text-rose-500' : 'text-slate-400'}`} />
              Mixed Reviews
            </button>

            {/* Min Rating Filter */}
            <div className={`flex items-center gap-1.5 px-3 py-1.5 border rounded-lg text-sm transition-colors ${
              theme === 'light' ? 'bg-white border-slate-200 text-slate-800 hover:border-slate-300 shadow-xs' : 'bg-zinc-900 border-zinc-800 text-zinc-300 hover:border-zinc-700'
            }`}>
              <Star className="w-4 h-4 text-amber-500 fill-amber-400/20" />
              <select
                value={minRatingFilter}
                onChange={(e) => setMinRatingFilter(e.target.value)}
                className={`bg-transparent outline-none cursor-pointer text-sm font-medium ${
                  theme === 'light' ? 'text-slate-800' : 'text-zinc-200'
                }`}
              >
                <option value="All" className={theme === 'light' ? 'bg-white text-slate-900' : 'bg-zinc-900 text-zinc-100'}>Rating: All</option>
                <option value="4.5+" className={theme === 'light' ? 'bg-white text-slate-900' : 'bg-zinc-900 text-zinc-100'}>4.5★ & Above</option>
                <option value="4.0+" className={theme === 'light' ? 'bg-white text-slate-900' : 'bg-zinc-900 text-zinc-100'}>4.0★ & Above</option>
                <option value="Under 4.0" className={theme === 'light' ? 'bg-white text-slate-900' : 'bg-zinc-900 text-zinc-100'}>Under 4.0★</option>
              </select>
            </div>

            {/* Opportunity Toggle */}
            <button
              onClick={() => setOpportunityOnly(!opportunityOnly)}
              className={`flex items-center gap-2 px-3 py-1.5 border rounded-lg text-sm transition-colors whitespace-nowrap font-medium cursor-pointer ${
                opportunityOnly 
                  ? 'bg-amber-500/20 border-amber-500 text-amber-700 font-semibold' 
                  : theme === 'light'
                  ? 'bg-white border-slate-200 text-slate-800 hover:border-slate-300 shadow-xs'
                  : 'bg-zinc-900 border-zinc-800 text-zinc-300 hover:text-zinc-100 hover:border-zinc-700'
              }`}
            >
              <Zap className={`w-4 h-4 ${opportunityOnly ? 'text-amber-500' : 'text-slate-400'}`} />
              Opportunity Only
            </button>

            {/* Reset Filters */}
            {(selectedCategory !== "All" || priceFilter !== "All" || revenueFilter !== "All" || minSalesFilter !== "All" || mixedReviewsOnly || minRatingFilter !== "All" || opportunityOnly || savedOnly) && (
              <button
                onClick={() => {
                  setSelectedCategory("All");
                  setPriceFilter("All");
                  setRevenueFilter("All");
                  setMinSalesFilter("All");
                  setMixedReviewsOnly(false);
                  setMinRatingFilter("All");
                  setOpportunityOnly(false);
                  setSavedOnly(false);
                }}
                className="flex items-center gap-1.5 text-xs text-purple-600 hover:text-purple-700 font-semibold underline px-2 whitespace-nowrap transition-colors cursor-pointer"
              >
                <RotateCcw className="w-3.5 h-3.5" />
                Reset Filters
              </button>
            )}

          </div>
          
          <div className="flex items-center gap-2 w-full sm:w-auto">
            <span className={`text-sm font-medium whitespace-nowrap ${theme === 'light' ? 'text-slate-500' : 'text-zinc-500'}`}>Sort by:</span>
            <select 
              value={sortBy}
              onChange={(e) => setSortBy(e.target.value)}
              className={`border text-sm rounded-lg focus:ring-1 focus:ring-purple-500 focus:border-purple-500 block p-1.5 outline-none cursor-pointer font-medium ${
                theme === 'light' 
                  ? 'bg-white border-slate-200 text-slate-800' 
                  : 'bg-zinc-900 border-zinc-800 text-zinc-100'
              }`}
            >
              <option className={theme === 'light' ? 'bg-white text-slate-900' : 'bg-zinc-900 text-zinc-100'}>Highest Revenue</option>
              <option className={theme === 'light' ? 'bg-white text-slate-900' : 'bg-zinc-900 text-zinc-100'}>Fastest Growing</option>
              <option className={theme === 'light' ? 'bg-white text-slate-900' : 'bg-zinc-900 text-zinc-100'}>Lowest Rating (High Sales)</option>
              <option className={theme === 'light' ? 'bg-white text-slate-900' : 'bg-zinc-900 text-zinc-100'}>Newest</option>
            </select>
          </div>
        </div>

        {/* Data Table */}
        <div className="relative min-h-[400px]">
          {loading ? (
            <div className="absolute inset-0 flex items-center justify-center bg-zinc-950/50 backdrop-blur-sm z-10 rounded-xl">
              <div className="w-8 h-8 border-4 border-purple-500/30 border-t-purple-500 rounded-full animate-spin"></div>
            </div>
          ) : null}
          <DataTable 
            products={filteredAndSortedProducts} 
            onSelectProduct={setSelectedProduct} 
            savedProductIds={savedProductIds}
            onToggleSaveProduct={handleToggleSaveProduct}
            density={density} 
            theme={theme} 
          />
        </div>
      </main>

      <ProductDrawer 
        product={selectedProduct} 
        isOpen={!!selectedProduct} 
        onClose={() => setSelectedProduct(null)} 
        savedProductIds={savedProductIds}
        onToggleSaveProduct={handleToggleSaveProduct}
        theme={theme}
      />

      <ProfileModal
        isOpen={isProfileOpen}
        onClose={() => setIsProfileOpen(false)}
        userName={userName}
        userEmail={userEmail}
        plan="Pro Member"
        onSaveProfile={(name, email) => {
          setUserName(name);
          setUserEmail(email);
        }}
      />

      <PreferencesModal
        isOpen={isPreferencesOpen}
        onClose={() => setIsPreferencesOpen(false)}
        currentTheme={theme}
        onSavePreferences={(prefs) => {
          if (prefs.defaultSort) setSortBy(prefs.defaultSort);
          if (prefs.density) setDensity(prefs.density);
          if (prefs.theme) setTheme(prefs.theme);
        }}
      />

      <HighConvertingFunnelModal
        isOpen={isFunnelOpen}
        onClose={() => setIsFunnelOpen(false)}
        checkoutUrl={WHOP_CHECKOUT_URL}
      />
    </div>
  );
}

