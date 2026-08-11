import { createClient } from '@supabase/supabase-js';

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL || 'https://placeholder-supabase-url.supabase.co';
const supabaseServiceKey = process.env.SUPABASE_SERVICE_ROLE_KEY;

if (!supabaseServiceKey) {
  console.warn('WARNING: SUPABASE_SERVICE_ROLE_KEY is not defined. Admin operations will fail.');
}

// This client bypasses Row Level Security (RLS) entirely.
// NEVER use this on the client side. ONLY use in secure backend API routes (like webhooks).
export const supabaseAdmin = createClient(supabaseUrl, supabaseServiceKey || 'placeholder-key', {
  auth: {
    autoRefreshToken: false,
    persistSession: false
  }
});
