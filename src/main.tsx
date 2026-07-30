import { StrictMode } from 'react';
import { createRoot } from 'react-dom/client';
import { ClerkProvider } from '@clerk/clerk-react';
import App from './App.tsx';
import './index.css';

const PUBLISHABLE_KEY = import.meta.env.VITE_CLERK_PUBLISHABLE_KEY || '';

createRoot(document.getElementById('root')!).render(
  <StrictMode>
    {PUBLISHABLE_KEY ? (
      <ClerkProvider 
        publishableKey={PUBLISHABLE_KEY} 
        afterSignOutUrl="/"
        signUpUrl="https://whop.com/checkout/plan_AoctiBy7JgMkV"
        appearance={{
          elements: {
            footerAction: "hidden",
            footerActionLink: "hidden",
            footerActionText: "hidden"
          }
        }}
      >
        <App />
      </ClerkProvider>
    ) : (
      <App />
    )}
  </StrictMode>,
);
