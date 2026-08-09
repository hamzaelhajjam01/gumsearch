import React from 'react';
import { SignedIn, SignedOut, SignInButton, SignUpButton, UserButton, useUser, useClerk } from '@clerk/clerk-react';
import { User, LogIn, Sparkles, ArrowUpRight } from 'lucide-react';
import { UserDropdown } from './UserDropdown';

interface ClerkHeaderAuthProps {
  onOpenProfile?: () => void;
  onOpenPreferences?: () => void;
  onLogout?: () => void;
  onLaunchDashboard?: () => void;
  onOpenFunnel?: () => void;
  theme?: 'dark' | 'light';
}

export const ClerkHeaderAuth: React.FC<ClerkHeaderAuthProps> = ({
  onOpenProfile,
  onOpenPreferences,
  onLogout,
  onLaunchDashboard,
  onOpenFunnel,
  theme = 'dark'
}) => {
  const isLight = theme === 'light';

  // Check if Clerk is loaded by trying hooks safely
  let user = null;
  let openUserProfile: (() => void) | null = null;
  let openSignUp: ((opts?: any) => void) | null = null;
  let signOut: (() => Promise<void>) | null = null;

  try {
    const clerkUser = useUser();
    const clerk = useClerk();
    user = clerkUser?.user || null;
    openUserProfile = clerk?.openUserProfile || null;
    openSignUp = clerk?.openSignUp || null;
    signOut = clerk?.signOut || null;
  } catch {
    // ClerkProvider not mounted or key missing fallback
  }

  const hasAccess = user?.publicMetadata?.hasAccess === true;

  const handleProfileClick = () => {
    if (openUserProfile) {
      openUserProfile();
    } else if (onOpenProfile) {
      onOpenProfile();
    }
  };

  const handleSignOutClick = async () => {
    try {
      if (signOut) {
        await signOut();
      }
    } catch (err) {
      console.error("Sign out error:", err);
    }
    if (onLogout) {
      onLogout();
    }
  };

  const handleGetAccessClick = (e: React.MouseEvent) => {
    if (onOpenFunnel) {
      e.preventDefault();
      onOpenFunnel();
    }
  };

  // Fallback if Clerk env key isn't added yet or user is signed out
  if (!user) {
    return (
      <div className="flex items-center gap-3">
        <SignedOut>
          <SignInButton mode="modal">
            <button className={`px-4 py-2 text-xs font-semibold rounded-xl border transition-all cursor-pointer ${
              isLight
                ? 'border-slate-300 bg-white text-slate-800 hover:bg-slate-50'
                : 'border-zinc-800 bg-zinc-900/90 text-zinc-200 hover:bg-zinc-800 hover:text-white'
            }`}>
              Sign In
            </button>
          </SignInButton>

          <a
            href="https://whop.com/checkout/plan_AoctiBy7JgMkV"
            target="_blank"
            rel="noopener noreferrer"
            onClick={handleGetAccessClick}
            className="group relative inline-flex items-center gap-1.5 px-4 py-2 bg-gradient-to-r from-purple-600 to-indigo-600 hover:from-purple-500 hover:to-indigo-500 text-white text-xs font-bold rounded-xl transition-all shadow-md shadow-purple-600/20 cursor-pointer"
          >
            Get Access
            <ArrowUpRight className="w-3.5 h-3.5 transition-transform group-hover:translate-x-0.5 group-hover:-translate-y-0.5" />
          </a>
        </SignedOut>

        <SignedIn>
          <UserButton 
            afterSignOutUrl="/"
            userProfileMode="modal"
            appearance={{
              elements: {
                avatarBox: "w-8 h-8 rounded-full border border-purple-500/40 shadow-md"
              }
            }}
          />
        </SignedIn>
      </div>
    );
  }

  const userName = user.fullName || user.primaryEmailAddress?.emailAddress?.split('@')[0] || "User";
  const userEmail = user.primaryEmailAddress?.emailAddress || "";

  return (
    <div className="flex items-center gap-3">
      {!hasAccess && (
        <a
          href="https://whop.com/checkout/plan_AoctiBy7JgMkV"
          target="_blank"
          rel="noopener noreferrer"
          onClick={handleGetAccessClick}
          className="group relative inline-flex items-center gap-1.5 px-4 py-2 bg-gradient-to-r from-purple-600 to-indigo-600 hover:from-purple-500 hover:to-indigo-500 text-white text-xs font-bold rounded-xl transition-all shadow-md shadow-purple-600/20 cursor-pointer"
        >
          <Sparkles className="w-3.5 h-3.5 text-amber-300" />
          Get Access
        </a>
      )}
      <UserDropdown
        userName={userName}
        userEmail={userEmail}
        plan={hasAccess ? "Lifetime Pass" : "Free Account"}
        onOpenProfile={handleProfileClick}
        onOpenPreferences={onOpenPreferences}
        onLogout={handleSignOutClick}
        theme={theme}
      />
      {hasAccess && onLaunchDashboard && (
        <button
          onClick={onLaunchDashboard}
          className="group relative inline-flex items-center gap-2 px-4 py-2 bg-gradient-to-r from-purple-600 to-indigo-600 hover:from-purple-500 hover:to-indigo-500 text-white text-xs font-bold rounded-xl transition-all shadow-md shadow-purple-600/20 cursor-pointer"
        >
          Launch Dashboard
          <ArrowUpRight className="w-3.5 h-3.5 transition-transform group-hover:translate-x-0.5 group-hover:-translate-y-0.5" />
        </button>
      )}
    </div>
  );
};
