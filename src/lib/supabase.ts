import { createClient } from '@supabase/supabase-js';

const supabaseUrl =
  import.meta.env.VITE_SUPABASE_URL ||
  'https://ldxkazlhfsqthdfvvwky.supabase.co';

const supabaseAnonKey =
  import.meta.env.VITE_SUPABASE_ANON_KEY ||
  'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImxkeGthemxoZnNxdGhkZnZ2d2t5Iiwicm9sZSI6ImFub24iLCJpYXQiOjE3ODk5OTIyMjMsImV4cCI6MjEwNTU2ODIyM30.fvBIvhUEDcLR8GLCnkZVOMP1ari8DV-B4IEmhh8ERvc';

if (!supabaseUrl || !supabaseAnonKey) {
  console.error('Supabase URL or Anon Key is missing. Please check your environment variables.');
}

export const supabase = createClient(supabaseUrl, supabaseAnonKey, {
  auth: {
    persistSession: true,
    autoRefreshToken: true,
    detectSessionInUrl: true,
  },
});