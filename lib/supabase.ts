import { createClient } from "@supabase/supabase-js"

// Create a single supabase client for interacting with your database
const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL
const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY

// Check if the required environment variables are available
const isSupabaseConfigured = supabaseUrl && supabaseAnonKey

// Create the client only if properly configured
export const supabase = isSupabaseConfigured
  ? createClient(supabaseUrl, supabaseAnonKey)
  : {
      from: () => ({
        select: () => ({ data: null, error: new Error("Supabase is not configured") }),
        insert: () => ({ data: null, error: new Error("Supabase is not configured") }),
        upsert: () => ({ data: null, error: new Error("Supabase is not configured") }),
        update: () => ({ data: null, error: new Error("Supabase is not configured") }),
        delete: () => ({ data: null, error: new Error("Supabase is not configured") }),
        eq: () => ({ data: null, error: new Error("Supabase is not configured"), single: () => ({ data: null }) }),
      }),
    }
