import { createClient } from '@supabase/supabase-js'

export const supabaseConfig = {
  url: 'https://oxeeyspxenodeetxzwax.supabase.co',
  anonKey: 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Im94ZWV5c3B4ZW5vZGVldHh6d2F4Iiwicm9sZSI6ImFub24iLCJpYXQiOjE3NDMwMTQ3MTksImV4cCI6MjA1ODU5MDcxOX0.M82G1Q4O46z2UZbXRVKcPx10iu5IZJ0CaMR_p-Ait1Y',
  options: {
    auth: {
      persistSession: true,
      autoRefreshToken: true,
      detectSessionInUrl: true
    }
  }
}

export const supabase = createClient(supabaseConfig.url, supabaseConfig.anonKey, supabaseConfig.options)