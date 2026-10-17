// Supabase browser configuration.
// Use your project's Project URL and publishable key (or legacy anon key).
// NEVER put a secret/service_role key in browser code.
import { createClient } from "https://cdn.jsdelivr.net/npm/@supabase/supabase-js@2/+esm";

export const SUPABASE_URL = "https://aqxwgswdbykzsasrwsdo.supabase.co";
export const SUPABASE_PUBLISHABLE_KEY = "sb_publishable_c4Ne6rQmx0g1WxInoZp9cA_2s0NC24I";
export const PRODUCT_IMAGE_BUCKET = "product-images";

export const isSupabaseConfigured = Boolean(
  SUPABASE_URL &&
  SUPABASE_PUBLISHABLE_KEY &&
  !SUPABASE_URL.includes("YOUR_PROJECT_REF") &&
  !SUPABASE_PUBLISHABLE_KEY.startsWith("YOUR_")
);

export const supabase = isSupabaseConfigured
  ? createClient(SUPABASE_URL, SUPABASE_PUBLISHABLE_KEY, {
      auth: {
        persistSession: true,
        autoRefreshToken: true,
        detectSessionInUrl: true
      }
    })
  : null;
