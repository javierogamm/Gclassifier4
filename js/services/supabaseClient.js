import { createClient } from 'https://esm.sh/@supabase/supabase-js@2';

export function createSupabaseClient({ supabaseUrl, supabaseAnonKey }) {
  return createClient(supabaseUrl, supabaseAnonKey, {
    auth: {
      persistSession: false,
    },
  });
}
