import React from 'react';
import { motion } from 'framer-motion';
import { ShieldCheck, FileText, ArrowLeft } from 'lucide-react';
import { SharedNavbar } from './SharedNavbar';

interface LegalPageProps {
  page: 'terms' | 'privacy';
  onNavigateHome: () => void;
  onNavigateFreeTool?: () => void;
  onNavigateCategory?: (slug: string) => void;
  onLaunchDashboard: () => void;
  onOpenFunnel?: () => void;
  onSwitchLegalPage: (page: 'terms' | 'privacy') => void;
  theme?: 'dark' | 'light';
}

const EFFECTIVE_DATE = 'July 27, 2025';

export const LegalPage: React.FC<LegalPageProps> = ({
  page,
  onNavigateHome,
  onNavigateFreeTool,
  onNavigateCategory,
  onLaunchDashboard,
  onOpenFunnel,
  onSwitchLegalPage,
  theme = 'dark'
}) => {
  const isLight = theme === 'light';

  return (
    <div className={`min-h-screen font-sans selection:bg-purple-500/30 transition-colors duration-300 relative ${
      isLight ? 'bg-slate-50 text-slate-900' : 'bg-[#09090b] text-zinc-100'
    }`}>
      {/* Background Grid */}
      <div className="absolute inset-0 bg-[linear-gradient(to_right,#80808012_1px,transparent_1px),linear-gradient(to_bottom,#80808012_1px,transparent_1px)] bg-[size:36px_36px] pointer-events-none" />

      <SharedNavbar
        theme={theme}
        onNavigateHome={onNavigateHome}
        onNavigateFreeTool={onNavigateFreeTool}
        onNavigateCategory={onNavigateCategory}
        onLaunchDashboard={onLaunchDashboard}
        onOpenFunnel={onOpenFunnel}
      />

      <div className="relative z-10 max-w-4xl mx-auto px-4 sm:px-6 py-12 sm:py-16">
        {/* Back Button */}
        <button 
          onClick={onNavigateHome}
          className="flex items-center gap-2 text-xs text-zinc-400 hover:text-white transition-colors mb-8 cursor-pointer"
        >
          <ArrowLeft className="w-3.5 h-3.5" />
          Back to Home
        </button>

        {/* Page Tabs */}
        <div className="flex items-center gap-2 mb-8">
          <button
            onClick={() => onSwitchLegalPage('terms')}
            className={`px-4 py-2 rounded-xl text-xs font-bold transition-all cursor-pointer flex items-center gap-2 ${
              page === 'terms'
                ? 'bg-purple-600 text-white shadow-md shadow-purple-600/20'
                : 'bg-zinc-900 text-zinc-400 border border-zinc-800 hover:text-white'
            }`}
          >
            <FileText className="w-3.5 h-3.5" /> Terms of Service
          </button>
          <button
            onClick={() => onSwitchLegalPage('privacy')}
            className={`px-4 py-2 rounded-xl text-xs font-bold transition-all cursor-pointer flex items-center gap-2 ${
              page === 'privacy'
                ? 'bg-purple-600 text-white shadow-md shadow-purple-600/20'
                : 'bg-zinc-900 text-zinc-400 border border-zinc-800 hover:text-white'
            }`}
          >
            <ShieldCheck className="w-3.5 h-3.5" /> Privacy Policy
          </button>
        </div>

        {/* Content Card */}
        <motion.div
          key={page}
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.3 }}
          className={`rounded-3xl border p-8 sm:p-12 backdrop-blur-xl ${
            isLight ? 'bg-white/90 border-slate-200 shadow-xl' : 'bg-zinc-900/70 border-zinc-800/80 shadow-2xl'
          }`}
        >
          {page === 'terms' ? <TermsContent /> : <PrivacyContent />}
        </motion.div>

        {/* Footer Cross-Link */}
        <div className="mt-8 text-center text-xs text-zinc-500">
          {page === 'terms' ? (
            <span>
              See also our{' '}
              <button onClick={() => onSwitchLegalPage('privacy')} className="text-purple-400 hover:text-purple-300 underline cursor-pointer">
                Privacy Policy
              </button>
            </span>
          ) : (
            <span>
              See also our{' '}
              <button onClick={() => onSwitchLegalPage('terms')} className="text-purple-400 hover:text-purple-300 underline cursor-pointer">
                Terms of Service
              </button>
            </span>
          )}
        </div>
      </div>

      {/* Footer */}
      <footer className="py-12 border-t border-zinc-800/60 max-w-7xl mx-auto px-6 text-xs text-zinc-500 flex flex-col sm:flex-row items-center justify-between gap-4 relative z-10">
        <div className="flex items-center gap-2 font-bold text-zinc-300 cursor-pointer" onClick={onNavigateHome}>
          <div className="w-5 h-5 rounded-lg bg-gradient-to-tr from-purple-600 to-indigo-600 flex items-center justify-center text-white text-[10px]">
            G
          </div>
          GumSearch
        </div>
        <div className="flex items-center gap-6">
          <button onClick={() => onSwitchLegalPage('terms')} className={`hover:text-zinc-300 transition-colors cursor-pointer ${page === 'terms' ? 'text-zinc-200' : ''}`}>Terms of Service</button>
          <button onClick={() => onSwitchLegalPage('privacy')} className={`hover:text-zinc-300 transition-colors cursor-pointer ${page === 'privacy' ? 'text-zinc-200' : ''}`}>Privacy Policy</button>
          <button onClick={onNavigateHome} className="hover:text-zinc-300 transition-colors cursor-pointer">Home</button>
        </div>
        <div>
          © {new Date().getFullYear()} GumSearch Intelligence. All rights reserved.
        </div>
      </footer>
    </div>
  );
};

/* ────────────────────────────────────────────────────────────
   TERMS OF SERVICE CONTENT
   ──────────────────────────────────────────────────────────── */
const TermsContent: React.FC = () => (
  <article className="legal-content space-y-8">
    <header>
      <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-purple-500/10 border border-purple-500/20 text-purple-400 text-xs font-bold mb-4">
        <FileText className="w-3.5 h-3.5" /> Legal
      </div>
      <h1 className="font-serif-heading text-3xl sm:text-4xl font-normal text-white tracking-tight">
        Terms of Service
      </h1>
      <p className="text-xs text-zinc-500 mt-2">Effective Date: {EFFECTIVE_DATE}</p>
    </header>

    <Section title="1. Acceptance of Terms">
      <p>
        By accessing or using GumSearch (&ldquo;the Service&rdquo;), operated by GumSearch Intelligence (&ldquo;we&rdquo;, &ldquo;us&rdquo;, or &ldquo;our&rdquo;), you agree to be bound by these Terms of Service. If you do not agree to these terms, you must not use the Service.
      </p>
    </Section>

    <Section title="2. Description of Service">
      <p>
        GumSearch is a market intelligence and competitor research platform for Gumroad digital products. The Service provides:
      </p>
      <ul>
        <li>A searchable database of publicly available Gumroad product listings</li>
        <li>Estimated revenue calculations based on publicly available data points</li>
        <li>AI-powered market gap analysis and opportunity insights</li>
        <li>A free public Creator Finder tool for searching Gumroad storefronts</li>
        <li>Historical pricing and offer tracking</li>
      </ul>
      <p>
        GumSearch is <strong>not affiliated with, endorsed by, or officially connected to Gumroad, Inc.</strong> All product data is gathered from publicly accessible sources.
      </p>
    </Section>

    <Section title="3. Accounts & Access">
      <p>
        Certain features of the Service require you to create an account via our authentication provider (Clerk). You are responsible for:
      </p>
      <ul>
        <li>Maintaining the confidentiality of your account credentials</li>
        <li>All activities that occur under your account</li>
        <li>Notifying us immediately of any unauthorized use of your account</li>
      </ul>
      <p>
        We reserve the right to suspend or terminate accounts that violate these Terms.
      </p>
    </Section>

    <Section title="4. Subscription Plans & Payments">
      <p>
        GumSearch offers both free and paid subscription tiers:
      </p>
      <ul>
        <li><strong>Starter (Free)</strong>: Limited access to the product database and basic filtering</li>
        <li><strong>GumSearch Pro</strong>: Full access to 100,000+ product records, AI gap analysis, revenue estimates, historical tracking, and data export features</li>
      </ul>
      <p>
        Paid subscriptions are billed through our payment provider (Whop). By subscribing, you agree to Whop&apos;s payment terms. Subscription fees are billed in advance on a monthly or annual basis depending on the plan selected.
      </p>
    </Section>

    <Section title="5. Refund Policy">
      <p>
        We offer a <strong>7-day money-back guarantee</strong> on all new GumSearch Pro subscriptions. If you are unsatisfied with the Service, contact us within 7 days of your initial purchase for a full refund. After the 7-day window, refunds are not available for the current billing period, though you may cancel your subscription at any time to prevent future charges.
      </p>
    </Section>

    <Section title="6. Data Accuracy & Disclaimer">
      <p>
        Revenue estimates, sales figures, and market insights provided by GumSearch are <strong>estimates based on publicly available data</strong> and proprietary algorithms. While we strive for accuracy, we do not guarantee that any data point is 100% precise. Users should not make business decisions based solely on GumSearch data without independent verification.
      </p>
      <p>
        The AI-generated gap analysis and opportunity insights are generated by large language models and may contain inaccuracies, biases, or outdated information. These should be treated as informational suggestions, not professional business advice.
      </p>
    </Section>

    <Section title="7. Acceptable Use">
      <p>You agree not to:</p>
      <ul>
        <li>Use automated bots, scrapers, or crawlers to extract data from the Service beyond normal usage</li>
        <li>Resell, redistribute, or commercially republish GumSearch data without written permission</li>
        <li>Attempt to reverse-engineer, decompile, or access the source code of the Service</li>
        <li>Use the Service to harass, defame, or harm any Gumroad creator or third party</li>
        <li>Circumvent any access restrictions, rate limits, or security measures</li>
        <li>Share your account credentials with third parties or operate multiple free accounts</li>
      </ul>
    </Section>

    <Section title="8. Intellectual Property">
      <p>
        All content, branding, design, and code of the GumSearch platform are the intellectual property of GumSearch Intelligence. Product listings, creator names, and storefront data displayed on the Service are the property of their respective owners and are presented for informational research purposes only.
      </p>
    </Section>

    <Section title="9. Limitation of Liability">
      <p>
        To the maximum extent permitted by applicable law, GumSearch Intelligence shall not be liable for any indirect, incidental, special, consequential, or punitive damages arising from your use of the Service. Our total liability for any claims arising from your use of the Service is limited to the amount you paid us in the 12 months preceding the claim.
      </p>
    </Section>

    <Section title="10. Service Modifications">
      <p>
        We reserve the right to modify, suspend, or discontinue any part of the Service at any time, with or without notice. We will make reasonable efforts to notify paid subscribers of material changes to features included in their subscription.
      </p>
    </Section>

    <Section title="11. Changes to These Terms">
      <p>
        We may update these Terms from time to time. When we do, we will revise the &ldquo;Effective Date&rdquo; at the top of this page. Continued use of the Service after changes constitutes acceptance of the revised Terms. Material changes will be communicated via email to registered users.
      </p>
    </Section>

    <Section title="12. Contact Us">
      <p>
        If you have any questions about these Terms, please contact us at:
      </p>
      <p className="!mt-2">
        <strong>Email</strong>: support@gumsearch.io<br />
        <strong>Website</strong>: gumsearch.io
      </p>
    </Section>
  </article>
);

/* ────────────────────────────────────────────────────────────
   PRIVACY POLICY CONTENT
   ──────────────────────────────────────────────────────────── */
const PrivacyContent: React.FC = () => (
  <article className="legal-content space-y-8">
    <header>
      <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-emerald-500/10 border border-emerald-500/20 text-emerald-400 text-xs font-bold mb-4">
        <ShieldCheck className="w-3.5 h-3.5" /> Privacy
      </div>
      <h1 className="font-serif-heading text-3xl sm:text-4xl font-normal text-white tracking-tight">
        Privacy Policy
      </h1>
      <p className="text-xs text-zinc-500 mt-2">Effective Date: {EFFECTIVE_DATE}</p>
    </header>

    <Section title="1. Introduction">
      <p>
        GumSearch Intelligence (&ldquo;we&rdquo;, &ldquo;us&rdquo;, or &ldquo;our&rdquo;) is committed to protecting your privacy. This Privacy Policy explains how we collect, use, store, and protect your personal information when you use our website and services at gumsearch.io (the &ldquo;Service&rdquo;).
      </p>
    </Section>

    <Section title="2. Information We Collect">
      <h4>2.1 Information You Provide</h4>
      <ul>
        <li><strong>Account Information</strong>: When you sign up, we collect your name, email address, and profile information via our authentication provider (Clerk)</li>
        <li><strong>Payment Information</strong>: When you subscribe to GumSearch Pro, payment is processed by Whop. We do not store your credit card numbers or full payment details on our servers</li>
        <li><strong>Support Communications</strong>: If you contact us, we retain the content of your messages</li>
      </ul>

      <h4>2.2 Information Collected Automatically</h4>
      <ul>
        <li><strong>Usage Data</strong>: Pages visited, searches performed, features used, timestamps, and session duration</li>
        <li><strong>Device Information</strong>: Browser type, operating system, screen resolution, and device identifiers</li>
        <li><strong>IP Address</strong>: Collected for security, fraud prevention, and approximate geolocation</li>
        <li><strong>Cookies & Local Storage</strong>: Used for authentication persistence, user preferences (theme, density), and analytics</li>
      </ul>

      <h4>2.3 Third-Party Data</h4>
      <p>
        The product data displayed on GumSearch (Gumroad product listings, creator profiles, review counts, pricing) is collected from publicly accessible sources. We do not collect private or non-public information from Gumroad users.
      </p>
    </Section>

    <Section title="3. How We Use Your Information">
      <p>We use the information we collect to:</p>
      <ul>
        <li>Provide, maintain, and improve the Service</li>
        <li>Process payments and manage your subscription</li>
        <li>Authenticate your identity and secure your account</li>
        <li>Send transactional emails (account confirmations, billing receipts, password resets)</li>
        <li>Analyze usage patterns to improve features and user experience</li>
        <li>Prevent fraud, abuse, and unauthorized access</li>
        <li>Comply with legal obligations</li>
      </ul>
      <p>
        We <strong>do not</strong> sell, rent, or trade your personal information to third parties for marketing purposes.
      </p>
    </Section>

    <Section title="4. Third-Party Services">
      <p>We use the following third-party services that may process your data:</p>
      <ul>
        <li><strong>Clerk</strong> — Authentication and user management</li>
        <li><strong>Whop</strong> — Payment processing and subscription management</li>
        <li><strong>Supabase</strong> — Database hosting and backend infrastructure</li>
        <li><strong>Vercel</strong> — Website hosting and deployment</li>
      </ul>
      <p>
        Each third-party service has its own privacy policy governing how they handle your data. We encourage you to review their policies.
      </p>
    </Section>

    <Section title="5. Data Retention">
      <p>
        We retain your personal information for as long as your account is active or as needed to provide the Service. If you delete your account, we will delete or anonymize your personal data within 30 days, except where we are required to retain it for legal or compliance purposes.
      </p>
      <p>
        Anonymized usage analytics may be retained indefinitely for product improvement purposes.
      </p>
    </Section>

    <Section title="6. Data Security">
      <p>
        We implement industry-standard security measures to protect your data, including:
      </p>
      <ul>
        <li>HTTPS encryption for all data in transit</li>
        <li>Encrypted database storage via Supabase with row-level security</li>
        <li>OAuth 2.0 authentication via Clerk (no raw passwords stored)</li>
        <li>Regular security audits and dependency updates</li>
      </ul>
      <p>
        While we strive to protect your information, no method of transmission over the Internet is 100% secure. We cannot guarantee absolute security.
      </p>
    </Section>

    <Section title="7. Your Rights (GDPR & CCPA)">
      <p>
        Depending on your location, you may have the following rights regarding your personal data:
      </p>
      <ul>
        <li><strong>Right to Access</strong>: Request a copy of the personal data we hold about you</li>
        <li><strong>Right to Rectification</strong>: Request correction of inaccurate or incomplete data</li>
        <li><strong>Right to Erasure</strong>: Request deletion of your personal data (&ldquo;right to be forgotten&rdquo;)</li>
        <li><strong>Right to Data Portability</strong>: Request your data in a structured, machine-readable format</li>
        <li><strong>Right to Object</strong>: Object to processing of your data for certain purposes</li>
        <li><strong>Right to Withdraw Consent</strong>: Where processing is based on consent, you may withdraw it at any time</li>
      </ul>
      <p>
        To exercise any of these rights, contact us at <strong>privacy@gumsearch.io</strong>. We will respond within 30 days.
      </p>
    </Section>

    <Section title="8. Cookies">
      <p>
        GumSearch uses essential cookies for:
      </p>
      <ul>
        <li><strong>Authentication</strong>: Keeping you signed in across sessions</li>
        <li><strong>Preferences</strong>: Remembering your theme (dark/light) and display density settings</li>
      </ul>
      <p>
        We do not use third-party advertising or tracking cookies. Our analytics are privacy-focused and do not use invasive tracking.
      </p>
    </Section>

    <Section title="9. Children's Privacy">
      <p>
        GumSearch is not directed at individuals under the age of 16. We do not knowingly collect personal information from children. If we become aware that a child under 16 has provided us with personal data, we will take steps to delete that information.
      </p>
    </Section>

    <Section title="10. International Data Transfers">
      <p>
        Your data may be processed and stored in countries outside your country of residence, including the United States and European Union. By using the Service, you consent to the transfer of your data to these jurisdictions. We ensure appropriate safeguards are in place for international transfers.
      </p>
    </Section>

    <Section title="11. Changes to This Policy">
      <p>
        We may update this Privacy Policy from time to time. When we do, we will revise the &ldquo;Effective Date&rdquo; at the top of this page and, for material changes, notify registered users by email. Continued use of the Service constitutes acceptance of the revised policy.
      </p>
    </Section>

    <Section title="12. Contact Us">
      <p>
        If you have any questions or concerns about this Privacy Policy or our data practices, please contact us at:
      </p>
      <p className="!mt-2">
        <strong>Email</strong>: privacy@gumsearch.io<br />
        <strong>Website</strong>: gumsearch.io
      </p>
    </Section>
  </article>
);

/* ────────────────────────────────────────────────────────────
   SHARED SECTION COMPONENT
   ──────────────────────────────────────────────────────────── */
const Section: React.FC<{ title: string; children: React.ReactNode }> = ({ title, children }) => (
  <section className="space-y-3">
    <h2 className="text-lg font-bold text-zinc-100 tracking-tight">{title}</h2>
    <div className="text-sm text-zinc-300 leading-relaxed space-y-3 [&_ul]:list-disc [&_ul]:pl-5 [&_ul]:space-y-1.5 [&_ul]:text-zinc-400 [&_li]:leading-relaxed [&_h4]:text-sm [&_h4]:font-bold [&_h4]:text-zinc-200 [&_h4]:mt-4 [&_h4]:mb-1.5 [&_strong]:text-zinc-100">
      {children}
    </div>
  </section>
);
