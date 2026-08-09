import type { VercelRequest, VercelResponse } from '@vercel/node';
import { Webhook } from 'svix';
import { createClient } from '@supabase/supabase-js';
import { createClerkClient } from '@clerk/backend';

const CLERK_WEBHOOK_SECRET = process.env.CLERK_WEBHOOK_SECRET;
const CLERK_SECRET_KEY = process.env.CLERK_SECRET_KEY;
const SUPABASE_URL = process.env.VITE_SUPABASE_URL || 'https://gefzuacjuekhdlkfaned.supabase.co';
const SUPABASE_SERVICE_ROLE_KEY = process.env.SUPABASE_SERVICE_ROLE_KEY;

const clerkClient = createClerkClient({ secretKey: CLERK_SECRET_KEY });
const supabase = createClient(SUPABASE_URL, SUPABASE_SERVICE_ROLE_KEY || '');

export default async function handler(req: VercelRequest, res: VercelResponse) {
  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method Not Allowed' });
  }

  const payload = req.body;
  const headers = req.headers as Record<string, string>;

  // Verify the webhook signature from Clerk using svix
  if (CLERK_WEBHOOK_SECRET) {
    const wh = new Webhook(CLERK_WEBHOOK_SECRET);
    try {
      // Svix requires the raw string body for verification
      const rawBody = typeof req.body === 'string' ? req.body : JSON.stringify(req.body);
      wh.verify(rawBody, headers);
    } catch (err) {
      console.error('Error verifying Clerk webhook:', err);
      return res.status(400).json({ error: 'Invalid Signature' });
    }
  }

  const evt = payload as { type: string; data: any };
  
  if (evt.type === 'user.created') {
    // Get the primary email of the new user
    const emailData = evt.data.email_addresses?.find(
      (e: any) => e.id === evt.data.primary_email_address_id
    );
    const email = emailData?.email_address;
    const userId = evt.data.id;

    if (email && SUPABASE_SERVICE_ROLE_KEY) {
      // Check if this email exists in our whop_purchases table
      const { data: purchase, error } = await supabase
        .from('whop_purchases')
        .select('*')
        .eq('email', email.toLowerCase())
        .single();
        
      if (!error && purchase) {
        // The user has paid before signing up! Grant them access.
        try {
          await clerkClient.users.updateUserMetadata(userId, {
            publicMetadata: {
              hasAccess: true
            }
          });
          console.log(`Granted access to new user: ${email}`);
        } catch (err) {
          console.error('Failed to update Clerk metadata:', err);
        }
      }
    }
  }

  return res.status(200).json({ success: true });
}
