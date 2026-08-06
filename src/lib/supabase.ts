import { createClient } from '@supabase/supabase-js';

const supabaseUrl = import.meta.env.VITE_SUPABASE_URL || 'https://gefzuacjuekhdlkfaned.supabase.co';
const supabaseKey = import.meta.env.VITE_SUPABASE_ANON_KEY || 'sb_publishable_ISBbJtRBhQphzDMrzmbCmw_Lb2Ek2Zy';

export const supabase = createClient(supabaseUrl, supabaseKey);
