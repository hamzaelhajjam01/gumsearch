import React, { useState } from 'react';
import { X, Settings, Moon, Sun, Bell, LayoutGrid, Check, Save } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';

interface PreferencesModalProps {
  isOpen: boolean;
  onClose: () => void;
  currentTheme?: 'dark' | 'light';
  onSavePreferences?: (prefs: { defaultSort?: string; density?: 'Comfortable' | 'Compact'; theme?: 'dark' | 'light'; emailAlerts?: boolean }) => void;
}

export const PreferencesModal: React.FC<PreferencesModalProps> = ({
  isOpen,
  onClose,
  currentTheme = 'dark',
  onSavePreferences
}) => {
  const [theme, setTheme] = useState<'dark' | 'light'>(currentTheme);
  const [defaultSort, setDefaultSort] = useState("Highest Revenue");
  const [density, setDensity] = useState<'Comfortable' | 'Compact'>("Comfortable");
  const [emailAlerts, setEmailAlerts] = useState(true);
  const [savedSuccess, setSavedSuccess] = useState(false);

  if (!isOpen) return null;

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (onSavePreferences) {
      onSavePreferences({ defaultSort, density, theme, emailAlerts });
    }
    setSavedSuccess(true);
    setTimeout(() => {
      setSavedSuccess(false);
      onClose();
    }, 1200);
  };

  return (
    <AnimatePresence>
      <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/70 backdrop-blur-sm">
        <motion.div
          initial={{ opacity: 0, scale: 0.95 }}
          animate={{ opacity: 1, scale: 1 }}
          exit={{ opacity: 0, scale: 0.95 }}
          className="w-full max-w-md bg-zinc-900 border border-zinc-800 rounded-2xl shadow-2xl overflow-hidden text-zinc-100"
        >
          {/* Header */}
          <div className="flex items-center justify-between p-5 border-b border-zinc-800">
            <div className="flex items-center gap-2 text-zinc-100 font-semibold">
              <Settings className="w-5 h-5 text-purple-400" />
              Preferences & Settings
            </div>
            <button
              onClick={onClose}
              className="p-1 text-zinc-400 hover:text-zinc-200 hover:bg-zinc-800 rounded-lg transition-colors cursor-pointer"
            >
              <X className="w-5 h-5" />
            </button>
          </div>

          {/* Settings Form */}
          <form onSubmit={handleSubmit} className="p-6 space-y-5">
            {/* Theme Preference */}
            <div>
              <label className="block text-xs font-medium text-zinc-400 mb-2 flex items-center gap-1.5">
                {theme === 'dark' ? <Moon className="w-4 h-4 text-purple-400" /> : <Sun className="w-4 h-4 text-amber-400" />}
                Appearance Theme
              </label>
              <div className="grid grid-cols-2 gap-2 p-1 bg-zinc-950 border border-zinc-800 rounded-xl">
                <button
                  type="button"
                  onClick={() => setTheme("dark")}
                  className={`py-1.5 px-3 text-xs font-medium rounded-lg transition-colors flex items-center justify-center gap-1.5 cursor-pointer ${
                    theme === "dark"
                      ? "bg-purple-500/20 border border-purple-500/50 text-purple-300 font-semibold"
                      : "text-zinc-400 hover:text-zinc-200"
                  }`}
                >
                  <Moon className="w-3.5 h-3.5 text-purple-400" />
                  Dark Mode
                </button>
                <button
                  type="button"
                  onClick={() => setTheme("light")}
                  className={`py-1.5 px-3 text-xs font-medium rounded-lg transition-colors flex items-center justify-center gap-1.5 cursor-pointer ${
                    theme === "light"
                      ? "bg-amber-500/20 border border-amber-500/50 text-amber-300 font-semibold"
                      : "text-zinc-400 hover:text-zinc-200"
                  }`}
                >
                  <Sun className="w-3.5 h-3.5 text-amber-400" />
                  Light Mode
                </button>
              </div>
            </div>

            {/* Default Sort Order */}
            <div>
              <label className="block text-xs font-medium text-zinc-400 mb-1.5">Default Dashboard Sorting</label>
              <select
                value={defaultSort}
                onChange={(e) => setDefaultSort(e.target.value)}
                className="w-full bg-zinc-950 border border-zinc-800 rounded-lg px-3 py-2 text-sm text-zinc-100 focus:outline-none focus:ring-1 focus:ring-purple-500 focus:border-purple-500"
              >
                <option value="Highest Revenue">Highest Revenue</option>
                <option value="Fastest Growing">Fastest Growing</option>
                <option value="Lowest Rating (High Sales)">Lowest Rating (High Sales)</option>
              </select>
            </div>

            {/* Data Density */}
            <div>
              <label className="block text-xs font-medium text-zinc-400 mb-2 flex items-center gap-1.5">
                <LayoutGrid className="w-4 h-4 text-purple-400" />
                Table View Density
              </label>
              <div className="grid grid-cols-2 gap-2">
                <button
                  type="button"
                  onClick={() => setDensity("Comfortable")}
                  className={`py-2 px-3 text-xs font-medium rounded-lg border transition-colors ${
                    density === "Comfortable"
                      ? "bg-purple-500/20 border-purple-500 text-purple-300"
                      : "bg-zinc-950 border-zinc-800 text-zinc-400 hover:text-zinc-200"
                  }`}
                >
                  Comfortable
                </button>
                <button
                  type="button"
                  onClick={() => setDensity("Compact")}
                  className={`py-2 px-3 text-xs font-medium rounded-lg border transition-colors ${
                    density === "Compact"
                      ? "bg-purple-500/20 border-purple-500 text-purple-300"
                      : "bg-zinc-950 border-zinc-800 text-zinc-400 hover:text-zinc-200"
                  }`}
                >
                  Compact
                </button>
              </div>
            </div>

            {/* Email Notifications */}
            <div className="p-3 bg-zinc-950 border border-zinc-800 rounded-xl flex items-center justify-between">
              <div className="flex items-center gap-2.5">
                <Bell className="w-4 h-4 text-purple-400" />
                <div>
                  <p className="text-xs font-medium text-zinc-200">Daily Opportunity Digest</p>
                  <p className="text-[11px] text-zinc-500">Email updates on newly tracked high-revenue products</p>
                </div>
              </div>
              <input
                type="checkbox"
                checked={emailAlerts}
                onChange={(e) => setEmailAlerts(e.target.checked)}
                className="w-4 h-4 accent-purple-500 rounded cursor-pointer"
              />
            </div>

            {/* Actions */}
            <div className="pt-3 flex items-center justify-end gap-3 border-t border-zinc-800">
              <button
                type="button"
                onClick={onClose}
                className="px-4 py-2 text-xs font-medium text-zinc-400 hover:text-zinc-200 transition-colors"
              >
                Cancel
              </button>
              <button
                type="submit"
                className="flex items-center gap-1.5 px-4 py-2 bg-purple-500 hover:bg-purple-400 text-white text-xs font-medium rounded-lg transition-colors shadow-lg shadow-purple-500/20"
              >
                {savedSuccess ? (
                  <>
                    <Check className="w-4 h-4 text-white" />
                    Saved!
                  </>
                ) : (
                  <>
                    <Save className="w-4 h-4" />
                    Save Preferences
                  </>
                )}
              </button>
            </div>
          </form>
        </motion.div>
      </div>
    </AnimatePresence>
  );
};
