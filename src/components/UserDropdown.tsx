import React, { useState, useRef, useEffect } from 'react';
import { User, LogOut, Settings, Key, Shield, Sparkles, ChevronDown, Check } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';

interface UserDropdownProps {
  userName?: string;
  userEmail?: string;
  plan?: string;
  onOpenProfile?: () => void;
  onOpenPreferences?: () => void;
  onLogout?: () => void;
  theme?: 'dark' | 'light';
}

export const UserDropdown: React.FC<UserDropdownProps> = ({
  userName = "Alex Rivers",
  userEmail = "alex@gumsearch.io",
  plan = "Pro Member",
  onOpenProfile,
  onOpenPreferences,
  onLogout,
  theme = 'dark'
}) => {
  const [isOpen, setIsOpen] = useState(false);
  const dropdownRef = useRef<HTMLDivElement>(null);
  const isLight = theme === 'light';

  // Close on outside click
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
        setIsOpen(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  const handleLogoutClick = () => {
    setIsOpen(false);
    if (onLogout) {
      onLogout();
    } else {
      alert("Logged out successfully");
    }
  };

  return (
    <div className="relative" ref={dropdownRef}>
      {/* Trigger Button */}
      <button
        onClick={() => setIsOpen(!isOpen)}
        className={`flex items-center gap-2.5 p-1.5 pr-3 border rounded-full transition-all focus:outline-none focus:ring-2 focus:ring-purple-500/20 cursor-pointer ${
          isLight 
            ? 'bg-white border-slate-200 hover:border-purple-400 shadow-2xs text-slate-800' 
            : 'bg-zinc-900 border-zinc-800 hover:border-purple-500/50 text-zinc-200'
        }`}
      >
        <div className="w-7 h-7 rounded-full bg-gradient-to-tr from-purple-500 to-indigo-500 flex items-center justify-center text-white text-xs font-bold shadow-sm">
          {userName.charAt(0)}
        </div>
        <span className={`text-sm font-semibold hidden sm:inline-block ${isLight ? 'text-slate-800' : 'text-zinc-200'}`}>
          {userName}
        </span>
        <ChevronDown className={`w-3.5 h-3.5 transition-transform duration-200 ${isOpen ? 'rotate-180' : ''} ${isLight ? 'text-slate-500' : 'text-zinc-400'}`} />
      </button>

      {/* Dropdown Menu */}
      <AnimatePresence>
        {isOpen && (
          <motion.div
            initial={{ opacity: 0, y: 8, scale: 0.96 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: 8, scale: 0.96 }}
            transition={{ duration: 0.15, ease: "easeOut" }}
            className={`absolute right-0 mt-2 w-64 border rounded-xl shadow-2xl z-50 overflow-hidden ${
              isLight ? 'bg-white border-slate-200 text-slate-900' : 'bg-zinc-900 border-zinc-800 text-zinc-100'
            }`}
          >
            {/* User Profile Header */}
            <div className={`p-4 border-b ${isLight ? 'border-slate-200 bg-slate-50/80' : 'border-zinc-800/80 bg-zinc-900/50'}`}>
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-full bg-gradient-to-tr from-purple-500 to-indigo-500 flex items-center justify-center text-white font-bold text-sm shadow-md">
                  {userName.charAt(0)}
                </div>
                <div className="flex-1 min-w-0">
                  <p className={`text-sm font-semibold truncate ${isLight ? 'text-slate-900' : 'text-zinc-100'}`}>{userName}</p>
                  <p className={`text-xs truncate ${isLight ? 'text-slate-500 font-medium' : 'text-zinc-400'}`}>{userEmail}</p>
                </div>
              </div>

              {/* Plan Badge */}
              <div className={`mt-3 flex items-center justify-between px-2.5 py-1.5 border rounded-lg ${
                isLight ? 'bg-purple-50 border-purple-200' : 'bg-purple-500/10 border-purple-500/20'
              }`}>
                <div className={`flex items-center gap-1.5 text-xs font-semibold ${isLight ? 'text-purple-800' : 'text-purple-300'}`}>
                  <Sparkles className={`w-3.5 h-3.5 ${isLight ? 'text-purple-600' : 'text-purple-400'}`} />
                  {plan}
                </div>
                <span className={`text-[10px] uppercase tracking-wider font-semibold px-1.5 py-0.5 rounded ${
                  isLight ? 'text-emerald-700 bg-emerald-100' : 'text-emerald-400 bg-emerald-500/10'
                }`}>
                  Active
                </span>
              </div>
            </div>

            {/* Menu Links */}
            <div className="p-1.5">
              <button 
                onClick={() => {
                  setIsOpen(false);
                  if (onOpenProfile) onOpenProfile();
                }}
                className={`w-full flex items-center gap-2.5 px-3 py-2 text-xs rounded-lg transition-colors text-left cursor-pointer font-medium ${
                  isLight ? 'text-slate-700 hover:text-slate-900 hover:bg-slate-100' : 'text-zinc-300 hover:text-zinc-100 hover:bg-zinc-800/60'
                }`}
              >
                <User className={`w-4 h-4 ${isLight ? 'text-slate-500' : 'text-zinc-400'}`} />
                Account Profile
              </button>

              <button 
                onClick={() => {
                  setIsOpen(false);
                  if (onOpenPreferences) onOpenPreferences();
                }}
                className={`w-full flex items-center gap-2.5 px-3 py-2 text-xs rounded-lg transition-colors text-left cursor-pointer font-medium ${
                  isLight ? 'text-slate-700 hover:text-slate-900 hover:bg-slate-100' : 'text-zinc-300 hover:text-zinc-100 hover:bg-zinc-800/60'
                }`}
              >
                <Settings className={`w-4 h-4 ${isLight ? 'text-slate-500' : 'text-zinc-400'}`} />
                Preferences
              </button>
            </div>

            {/* Logout Footer */}
            <div className={`p-1.5 border-t ${isLight ? 'border-slate-200 bg-slate-50' : 'border-zinc-800/80 bg-zinc-950/40'}`}>
              <button
                onClick={handleLogoutClick}
                className={`w-full flex items-center gap-2.5 px-3 py-2 text-xs rounded-lg transition-colors text-left font-semibold cursor-pointer ${
                  isLight ? 'text-rose-600 hover:bg-rose-50' : 'text-rose-400 hover:text-rose-300 hover:bg-rose-500/10'
                }`}
              >
                <LogOut className="w-4 h-4 text-rose-500" />
                Sign Out
              </button>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};

