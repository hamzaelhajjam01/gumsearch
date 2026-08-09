import type { VercelRequest, VercelResponse } from '@vercel/node';
import { createClient } from '@supabase/supabase-js';
import { createClerkClient } from '@clerk/backend';

// Note: You must set these variables in Vercel and .env.local
const WHOP_WEBHOOK_SECRET = process.env.WHOP_WEBHOOK_SECRET;
const SUPABASE_URL = process.env.VITE_SUPABASE_URL || 'https://gefzuacjuekhdlkfaned.supabase.co';
const SUPABASE_SERVICE_ROLE_KEY = process.env.SUPABASE_SERVICE_ROLE_KEY;
const CLERK_SECRET_KEY = process.env.CLERK_SECRET_KEY;

// Initialize Clerk
const clerkClient = createClerkClient({ secretKey: CLERK_SECRET_KEY });

// Initialize Supabase with the service role key to bypass RLS
const supabase = createClient(SUPABASE_URL, SUPABASE_SERVICE_ROLE_KEY || '');

export default async function handler(req: VercelRequest, res: VercelResponse) {
  // Only accept POST requests
  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method Not Allowed' });
  }

  // TODO: In a production app, verify the Whop webhook signature here using WHOP_WEBHOOK_SECRET.
  // The exact method depends on Whop's documentation, often checking `x-whop-signature` header.

  try {
    const payload = req.body;
    
    // Check if the event is a valid payment event 
    // Whop API might send dots or underscores depending on version
    const eventType = payload.action || payload.type; 
    
    const validEvents = [
      'membership.went_valid', 'membership_activated', 
      'payment.succeeded', 'payment_succeeded'
    ];

    if (!validEvents.includes(eventType)) {
      return res.status(200).json({ message: 'Event ignored' });
    }

    // Extract the email. Whop payloads usually have user.email or customer.email
    const email = payload.data?.user?.email || payload.data?.customer?.email || payload.user?.email;

    if (!email) {
      return res.status(400).json({ error: 'No email found in payload' });
    }

    // 1. Insert into Supabase so we have a permanent record
    // This covers users who haven't signed up on Clerk yet.
    if (SUPABASE_SERVICE_ROLE_KEY) {
      const { error: dbError } = await supabase
        .from('whop_purchases')
        .upsert({ email: email.toLowerCase() }, { onConflict: 'email' });
        
      if (dbError) {
        console.error('Supabase Error:', dbError);
        // We continue even if DB fails, as we might still update Clerk directly
      }
    }

    // 2. Update Clerk user metadata if they already exist
    try {
      // @clerk/backend might be slightly different in newer versions.
      // We'll use the v5 syntax correctly.
      const { data: users } = await clerkClient.users.getUserList({ emailAddress: [email] });
      if (users && users.length > 0) {
        const userId = users[0].id;
        
        await clerkClient.users.updateUserMetadata(userId, {
          publicMetadata: {
            hasAccess: true
          }
        });
        console.log(`Updated Clerk metadata for existing user: ${email}`);
      }
    } catch (clerkErr) {
      console.error('Clerk API Error:', clerkErr);
    }

    return res.status(200).json({ success: true });
  } catch (err: any) {
    console.error('Webhook Error:', err);
    return res.status(500).json({ error: 'Internal Server Error' });
  }
}
