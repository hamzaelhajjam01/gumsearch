import React, { useState, useEffect, useMemo } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { X, Sparkles, TrendingUp, CheckCircle, ArrowRight, ShieldCheck, Zap, Lock, Activity, Flame, Search, PlusCircle, Edit3 } from 'lucide-react';

interface HighConvertingFunnelModalProps {
  isOpen: boolean;
  onClose: () => void;
  checkoutUrl: string;
}

export const HighConvertingFunnelModal: React.FC<HighConvertingFunnelModalProps> = ({
  isOpen,
  onClose,
  checkoutUrl
}) => {
  const [step, setStep] = useState<1 | 2 | 3>(1);
  const [selectedGoal, setSelectedGoal] = useState<string>('Notion & Digital OS');
  const [customNiche, setCustomNiche] = useState<string>('');
  const [isOtherSelected, setIsOtherSelected] = useState(false);
  const [validationError, setValidationError] = useState<string>('');

  const [isScanning, setIsScanning] = useState(false);
  const [scanCount, setScanCount] = useState(0);
  const [secondsRemaining, setSecondsRemaining] = useState<number>(10);
  const [scanMessageIndex, setScanMessageIndex] = useState<number>(0);

  // Active target keyword
  const activeKeyword = useMemo(() => {
    return customNiche.trim() || selectedGoal;
  }, [customNiche, selectedGoal]);

  // Dynamic Revenue Generator based on keyword string hash
  const dynamicMetrics = useMemo(() => {
    const str = activeKeyword.toLowerCase();
    let hash = 0;
    for (let i = 0; i < str.length; i++) {
      hash = str.charCodeAt(i) + ((hash << 5) - hash);
    }
    const absHash = Math.abs(hash);
    
    const monthlyRev = 28500 + (absHash % 42000); // Between $28,500 and $70,500 / mo
    const oppCount = 210 + (absHash % 240); // Between 210 and 450 opportunities
    const complaintsCount = 840 + (absHash % 1200);

    return {
      monthlyRevFormatted: `$${monthlyRev.toLocaleString()}/mo`,
      oppCount,
      complaintsCount
    };
  }, [activeKeyword]);

  // Reset funnel state when opened
  useEffect(() => {
    if (isOpen) {
      setStep(1);
      setSelectedGoal('Notion & Digital OS');
      setCustomNiche('');
      setIsOtherSelected(false);
      setValidationError('');
      setIsScanning(false);
      setScanCount(0);
      setSecondsRemaining(10);
      setScanMessageIndex(0);
    }
  }, [isOpen]);

  // Step 2 10-Second Scanning Counter & Countdown Animation
  useEffect(() => {
    if (step === 2 && isScanning) {
      setSecondsRemaining(10);
      setScanCount(0);
      setScanMessageIndex(0);

      // 10-second countdown timer
      const countdownInterval = setInterval(() => {
        setSecondsRemaining(prev => {
          if (prev <= 1) {
            clearInterval(countdownInterval);
            return 0;
          }
          return prev - 1;
        });
      }, 1000);

      // Rotate research messages during scan
      const messageInterval = setInterval(() => {
        setScanMessageIndex(prev => (prev + 1) % 4);
      }, 2500);

      // Smooth count up to target count over 10 seconds
      const counterInterval = setInterval(() => {
        setScanCount(prev => {
          if (prev >= dynamicMetrics.oppCount) return dynamicMetrics.oppCount;
          return prev + Math.floor(Math.random() * 8) + 4;
        });
      }, 140);

      // Transition to Step 3 exactly after 10 seconds (10,000ms)
      const transitionTimeout = setTimeout(() => {
        clearInterval(counterInterval);
        clearInterval(countdownInterval);
        clearInterval(messageInterval);
        setScanCount(dynamicMetrics.oppCount);
        setIsScanning(false);
        setStep(3);
      }, 10000);

      return () => {
        clearInterval(counterInterval);
        clearInterval(countdownInterval);
        clearInterval(messageInterval);
        clearTimeout(transitionTimeout);
      };
    }
  }, [step, isScanning, dynamicMetrics.oppCount]);

  if (!isOpen) return null;

  const handleStartScan = (e: React.FormEvent) => {
    e.preventDefault();
    if (!activeKeyword.trim()) {
      setValidationError('Please type your niche or product keyword to continue.');
      return;
    }
    setValidationError('');
    setStep(2);
    setIsScanning(true);
  };

  const scanMessages = [
    `Extracting pricing models & revenue figures for "${activeKeyword}"...`,
    `Analyzing ${dynamicMetrics.complaintsCount.toLocaleString()}+ customer reviews for buyer dissatisfaction gaps...`,
    `Filtering low-rating products with high sales velocity in "${activeKeyword}"...`,
    `Generating high-curiosity teardown report & opportunity score...`
  ];

  return (
    <AnimatePresence>
      <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/85 backdrop-blur-md">
        <motion.div
          initial={{ opacity: 0, scale: 0.94, y: 15 }}
          animate={{ opacity: 1, scale: 1, y: 0 }}
          exit={{ opacity: 0, scale: 0.94, y: 15 }}
          transition={{ duration: 0.25, ease: "easeOut" }}
          className="relative w-full max-w-xl bg-[#0d0d12] border border-purple-500/30 rounded-3xl shadow-2xl shadow-purple-950/50 overflow-hidden text-zinc-100"
        >
          {/* Top Progress Bar */}
          <div className="w-full bg-zinc-900 h-1.5">
            <motion.div
              initial={{ width: '33%' }}
              animate={{ width: step === 1 ? '33%' : step === 2 ? '66%' : '100%' }}
              transition={{ duration: 0.4 }}
              className="h-full bg-gradient-to-r from-purple-500 via-indigo-500 to-emerald-400"
            />
          </div>

          {/* Close Button */}
          <button
            onClick={onClose}
            className="absolute top-4 right-4 p-2 text-zinc-400 hover:text-white bg-zinc-900/60 hover:bg-zinc-800 rounded-full transition-all cursor-pointer z-10"
          >
            <X className="w-5 h-5" />
          </button>

          <div className="p-5 sm:p-8 max-h-[90vh] overflow-y-auto">
            {/* STEP 1: CUSTOM INPUT & NICHE SELECTION */}
            {step === 1 && (
              <motion.div
                initial={{ opacity: 0, x: -10 }}
                animate={{ opacity: 1, x: 0 }}
                className="space-y-5"
              >
                <div className="text-center space-y-1.5">
                  <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-purple-500/10 border border-purple-500/20 text-purple-300 text-xs font-bold">
                    <Sparkles className="w-3.5 h-3.5 text-amber-400" />
                    Step 1 of 3: Custom Market Audit
                  </div>
                  <h3 className="text-2xl sm:text-3xl font-extrabold text-white tracking-tight">
                    What digital product or niche do you want to analyze?
                  </h3>
                  <p className="text-xs sm:text-sm text-zinc-400">
                    Type your specific keyword or choose a category below to generate your custom market teardown.
                  </p>
                </div>

                <form onSubmit={handleStartScan} className="space-y-4 pt-1">
                  {/* Required Custom Keyword Input */}
                  <div className="space-y-1.5">
                    <label className="block text-xs font-bold text-purple-300 uppercase tracking-wider">
                      Target Product or Niche Keyword <span className="text-rose-400">*</span>
                    </label>
                    <div className="relative">
                      <Search className="w-4 h-4 text-purple-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
                      <input
                        type="text"
                        value={customNiche}
                        onChange={(e) => {
                          setCustomNiche(e.target.value);
                          if (validationError) setValidationError('');
                        }}
                        placeholder="e.g. Notion OS, AI Finance Wrappers, Crypto Bots, UI Kits..."
                        className="w-full bg-zinc-950 border border-purple-500/40 rounded-xl pl-10 pr-4 py-3 text-sm text-white placeholder-zinc-500 focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-purple-400 shadow-inner"
                        required
                      />
                    </div>
                    {validationError && (
                      <p className="text-xs font-semibold text-rose-400">{validationError}</p>
                    )}
                  </div>

                  {/* Quick Preset Selector */}
                  <div className="space-y-1.5">
                    <span className="text-[11px] font-semibold text-zinc-400">Or click a preset niche:</span>
                    <div className="grid grid-cols-2 gap-2">
                      {[
                        { label: 'Notion & Digital OS', icon: TrendingUp },
                        { label: 'AI Tools & Prompt Kits', icon: Zap },
                        { label: 'Business & Micro-SaaS', icon: Activity },
                        { label: 'Figma UI Kits & Assets', icon: Flame },
                      ].map((preset) => (
                        <button
                          key={preset.label}
                          type="button"
                          onClick={() => {
                            setSelectedGoal(preset.label);
                            setCustomNiche(preset.label);
                            setIsOtherSelected(false);
                            if (validationError) setValidationError('');
                          }}
                          className={`p-2.5 text-left border rounded-xl transition-all cursor-pointer text-xs font-semibold flex items-center gap-2 ${
                            activeKeyword === preset.label
                              ? 'bg-purple-600/30 border-purple-400 text-white shadow-md'
                              : 'bg-zinc-900/80 border-zinc-800 text-zinc-300 hover:border-zinc-700 hover:text-white'
                          }`}
                        >
                          <preset.icon className="w-3.5 h-3.5 text-purple-400 shrink-0" />
                          <span className="truncate">{preset.label}</span>
                        </button>
                      ))}
                    </div>
                  </div>

                  {/* Start Scan Button */}
                  <motion.button
                    whileHover={{ scale: 1.02 }}
                    whileTap={{ scale: 0.98 }}
                    type="submit"
                    className="w-full py-4 px-5 sm:px-6 bg-gradient-to-r from-purple-600 via-indigo-600 to-purple-500 hover:from-purple-500 hover:to-indigo-500 text-white font-extrabold text-sm sm:text-base rounded-2xl transition-all shadow-xl shadow-purple-600/30 cursor-pointer flex items-center justify-center gap-2.5 group text-center leading-snug"
                  >
                    <span>Scan Market for "{activeKeyword.length > 24 ? activeKeyword.slice(0, 22) + '...' : (activeKeyword || 'Your Niche')}"</span>
                    <ArrowRight className="w-5 h-5 shrink-0 transition-transform group-hover:translate-x-1" />
                  </motion.button>
                </form>
              </motion.div>
            )}

            {/* STEP 2: HYPER-PERSONALIZED 10-SECOND RESEARCH ANIMATION */}
            {step === 2 && (
              <motion.div
                initial={{ opacity: 0, scale: 0.95 }}
                animate={{ opacity: 1, scale: 1 }}
                className="py-6 text-center space-y-6"
              >
                <div className="relative w-20 h-20 mx-auto flex items-center justify-center">
                  <div className="absolute inset-0 rounded-full border-4 border-purple-500/20 border-t-purple-500 animate-spin" />
                  <Search className="w-8 h-8 text-purple-400 animate-pulse" />
                </div>

                <div className="space-y-2">
                  <h3 className="text-2xl font-extrabold text-white">
                    Deep Researching Market for:
                  </h3>
                  <div className="inline-block px-4 py-1.5 rounded-xl bg-purple-500/20 border border-purple-500/40 text-purple-300 text-sm font-extrabold">
                    "{activeKeyword}"
                  </div>
                  
                  <div className="pt-2 min-h-[44px]">
                    <p className="text-xs font-semibold text-purple-400 flex items-center justify-center gap-1.5 transition-all">
                      <Sparkles className="w-3.5 h-3.5 animate-spin text-amber-300" />
                      {scanMessages[scanMessageIndex]}
                    </p>
                    <p className="text-[11px] text-zinc-500 mt-1 font-mono">
                      Time Remaining: {secondsRemaining}s
                    </p>
                  </div>
                </div>

                {/* Animated Stat Counter */}
                <div className="p-4 bg-zinc-900/90 border border-purple-500/30 rounded-2xl max-w-sm mx-auto shadow-inner">
                  <p className="text-xs font-semibold text-zinc-400 uppercase tracking-wider">High Opportunity Market Gaps Discovered</p>
                  <p className="text-4xl font-black text-purple-400 mt-1 font-mono">{scanCount}</p>
                  <p className="text-[11px] text-emerald-400 mt-1 font-medium flex items-center justify-center gap-1">
                    <CheckCircle className="w-3.5 h-3.5" /> High Demand / Unmet Buyer Needs Found
                  </p>
                </div>
              </motion.div>
            )}

            {/* STEP 3: HYPER-PERSONALIZED HIGH-CURIOSITY OFFER & CHECKOUT CTA */}
            {step === 3 && (
              <motion.div
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                className="space-y-5"
              >
                {/* Header */}
                <div className="text-center space-y-2">
                  <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-purple-500/10 border border-purple-500/20 text-purple-300 text-xs font-bold">
                    <Flame className="w-3.5 h-3.5 text-amber-400 animate-pulse" />
                    Market Audit Result: "{activeKeyword}"
                  </div>
                  <h3 className="text-2xl sm:text-3xl font-extrabold text-white tracking-tight leading-snug">
                    We Found {dynamicMetrics.oppCount} Underserved Markets Making Up To <span className="text-transparent bg-clip-text bg-gradient-to-r from-emerald-400 to-teal-300">{dynamicMetrics.monthlyRevFormatted}</span> in "{activeKeyword}"
                  </h3>
                  <p className="text-xs sm:text-sm text-zinc-400 max-w-lg mx-auto">
                    Top sellers are pulling massive revenue despite {dynamicMetrics.complaintsCount.toLocaleString()} dissatisfied buyers. Unlock their exact revenue metrics & competitor gaps below.
                  </p>
                </div>

                {/* Curiosity Teaser Product Card */}
                <div className="p-4 bg-gradient-to-b from-purple-950/40 via-zinc-900/90 to-zinc-900 border border-purple-500/30 rounded-2xl relative overflow-hidden shadow-2xl">
                  <div className="flex items-center justify-between border-b border-zinc-800/80 pb-2.5 mb-3">
                    <div className="flex items-center gap-2">
                      <span className="px-2 py-0.5 rounded text-[10px] font-bold bg-amber-500/20 text-amber-400 border border-amber-500/30">
                        🔥 #1 Market Teardown Teaser
                      </span>
                      <span className="text-xs font-bold text-zinc-300 truncate max-w-[150px]">{activeKeyword}</span>
                    </div>
                    <div className="flex items-center gap-1 text-[11px] font-semibold text-emerald-400">
                      <TrendingUp className="w-3.5 h-3.5" /> High Opportunity
                    </div>
                  </div>

                  <div className="space-y-2">
                    <div className="flex items-center justify-between">
                      <p className="text-sm font-extrabold text-white truncate max-w-[240px]">
                        The {activeKeyword} Master Suite & Ecosystem
                      </p>
                      <p className="text-sm font-black text-emerald-400 font-mono">{dynamicMetrics.monthlyRevFormatted}</p>
                    </div>

                    {/* Blurred Curiosity Insight Teaser */}
                    <div className="relative p-2.5 bg-zinc-950/80 border border-purple-500/20 rounded-xl overflow-hidden">
                      <div className="filter blur-[3.5px] select-none text-[11px] text-zinc-400 space-y-1 opacity-70">
                        <p>• High demand in "{activeKeyword}". 78% of buyers complain about missing automated API hooks and outdated documentation.</p>
                        <p>• {dynamicMetrics.complaintsCount} verified buyers left 1-star to 3-star reviews wanting a modular $29/mo starter alternative.</p>
                      </div>
                      <div className="absolute inset-0 flex items-center justify-center bg-black/40 backdrop-blur-[2px]">
                        <span className="px-3 py-1 bg-purple-600/90 text-white text-[11px] font-bold rounded-lg shadow-lg flex items-center gap-1.5 border border-purple-400/40">
                          <Lock className="w-3.5 h-3.5 text-amber-300" />
                          Unlock All {dynamicMetrics.oppCount} Teardowns in Pass
                        </span>
                      </div>
                    </div>
                  </div>
                </div>

                {/* Value Offer Stack */}
                <div className="p-4 bg-zinc-900/80 border border-zinc-800 rounded-2xl space-y-2.5">
                  <div className="flex items-center justify-between">
                    <span className="text-xs font-bold text-zinc-200">GumSearch Lifetime Access Pass ($99.99) Includes:</span>
                    <span className="text-xs text-zinc-500 line-through">$249</span>
                  </div>
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 text-xs text-zinc-300">
                    <div className="flex items-center gap-2">
                      <CheckCircle className="w-3.5 h-3.5 text-purple-400 shrink-0" />
                      <span>Real-Time Revenue & Unit Sales</span>
                    </div>
                    <div className="flex items-center gap-2">
                      <CheckCircle className="w-3.5 h-3.5 text-purple-400 shrink-0" />
                      <span>Mixed Reviews & Buyer Complaints</span>
                    </div>
                    <div className="flex items-center gap-2">
                      <CheckCircle className="w-3.5 h-3.5 text-purple-400 shrink-0" />
                      <span>Full Database Exports & Bookmarks</span>
                    </div>
                    <div className="flex items-center gap-2">
                      <CheckCircle className="w-3.5 h-3.5 text-purple-400 shrink-0" />
                      <span>Zero Recurring Subscription Fees</span>
                    </div>
                  </div>
                </div>

                {/* Action CTA Button */}
                <div className="space-y-2.5">
                  <a
                    href={checkoutUrl}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="w-full py-4 px-5 sm:px-6 bg-gradient-to-r from-purple-600 via-indigo-600 to-purple-500 hover:from-purple-500 hover:to-indigo-500 text-white font-extrabold text-sm sm:text-base rounded-2xl transition-all shadow-xl shadow-purple-600/30 cursor-pointer flex items-center justify-center gap-2.5 group text-center leading-snug"
                  >
                    <span>
                      Unlock All {dynamicMetrics.oppCount} Opportunities for "{activeKeyword.length > 24 ? activeKeyword.slice(0, 22) + '...' : activeKeyword}" <span className="text-purple-200">($99.99)</span>
                    </span>
                    <ArrowRight className="w-5 h-5 shrink-0 transition-transform group-hover:translate-x-1" />
                  </a>

                  <div className="flex items-center justify-center gap-4 text-[11px] text-zinc-400 pt-0.5">
                    <span className="flex items-center gap-1">
                      <ShieldCheck className="w-3.5 h-3.5 text-emerald-400 shrink-0" />
                      Instant Whop Pass Activation
                    </span>
                    <span className="flex items-center gap-1">
                      <Lock className="w-3.5 h-3.5 text-purple-400 shrink-0" />
                      256-Bit SSL Encrypted
                    </span>
                  </div>
                </div>
              </motion.div>
            )}
          </div>
        </motion.div>
      </div>
    </AnimatePresence>
  );
};
