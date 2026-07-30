import React, { useState } from 'react';
import { X, User, Mail, Shield, Sparkles, Check, Save } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import { useUser } from '@clerk/clerk-react';

interface ProfileModalProps {
  isOpen: boolean;
  onClose: () => void;
  userName: string;
  userEmail: string;
  plan: string;
  onSaveProfile: (name: string, email: string) => void;
}

export const ProfileModal: React.FC<ProfileModalProps> = ({
  isOpen,
  onClose,
  userName,
  userEmail,
  plan,
  onSaveProfile
}) => {
  const [name, setName] = useState(userName);
  const [email, setEmail] = useState(userEmail);
  const [savedSuccess, setSavedSuccess] = useState(false);

  let clerkUser = null;
  try {
    const res = useUser();
    clerkUser = res?.user || null;
  } catch {
    // Clerk fallback
  }

  if (!isOpen) return null;

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    // Sync directly with Clerk if active
    if (clerkUser) {
      try {
        const parts = name.split(' ');
        const firstName = parts[0] || name;
        const lastName = parts.slice(1).join(' ') || '';
        await clerkUser.update({ firstName, lastName });
      } catch (err) {
        console.error("Clerk user update error:", err);
      }
    }

    onSaveProfile(name, email);
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
          className="w-full max-w-md bg-zinc-900 border border-zinc-800 rounded-2xl shadow-2xl overflow-hidden"
        >
          {/* Header */}
          <div className="flex items-center justify-between p-5 border-b border-zinc-800">
            <div className="flex items-center gap-2 text-zinc-100 font-semibold">
              <User className="w-5 h-5 text-purple-400" />
              Account Profile
            </div>
            <button
              onClick={onClose}
              className="p-1 text-zinc-400 hover:text-zinc-200 hover:bg-zinc-800 rounded-lg transition-colors"
            >
              <X className="w-5 h-5" />
            </button>
          </div>

          {/* Form Content */}
          <form onSubmit={handleSubmit} className="p-6 space-y-4">
            {/* Avatar Section */}
            <div className="flex items-center gap-4 p-3 bg-zinc-950/60 border border-zinc-800/80 rounded-xl">
              <div className="w-14 h-14 rounded-full bg-gradient-to-tr from-purple-500 to-indigo-500 flex items-center justify-center text-white font-bold text-xl shadow-md">
                {name.charAt(0).toUpperCase()}
              </div>
              <div>
                <p className="text-sm font-semibold text-zinc-100">{name}</p>
                <div className="flex items-center gap-1.5 mt-0.5">
                  <Sparkles className="w-3.5 h-3.5 text-purple-400" />
                  <span className="text-xs text-purple-300 font-medium">{plan}</span>
                </div>
              </div>
            </div>

            {/* Name Input */}
            <div>
              <label className="block text-xs font-medium text-zinc-400 mb-1.5">Full Name</label>
              <div className="relative">
                <User className="w-4 h-4 text-zinc-500 absolute left-3 top-1/2 -translate-y-1/2" />
                <input
                  type="text"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  className="w-full bg-zinc-950 border border-zinc-800 rounded-lg pl-9 pr-3 py-2 text-sm text-zinc-100 focus:outline-none focus:ring-1 focus:ring-purple-500 focus:border-purple-500"
                  required
                />
              </div>
            </div>

            {/* Email Input */}
            <div>
              <label className="block text-xs font-medium text-zinc-400 mb-1.5">Email Address</label>
              <div className="relative">
                <Mail className="w-4 h-4 text-zinc-500 absolute left-3 top-1/2 -translate-y-1/2" />
                <input
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  className="w-full bg-zinc-950 border border-zinc-800 rounded-lg pl-9 pr-3 py-2 text-sm text-zinc-100 focus:outline-none focus:ring-1 focus:ring-purple-500 focus:border-purple-500"
                  required
                />
              </div>
            </div>

            {/* Plan Badge Details */}
            <div className="p-3 bg-purple-500/10 border border-purple-500/20 rounded-xl flex items-center justify-between">
              <div>
                <p className="text-xs font-medium text-purple-300">Subscription Status</p>
                <p className="text-xs text-zinc-400 mt-0.5">Unlimited market research access</p>
              </div>
              <span className="text-xs font-semibold text-purple-400 bg-purple-500/20 px-2.5 py-1 rounded-md">
                Active
              </span>
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
                    Save Changes
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
