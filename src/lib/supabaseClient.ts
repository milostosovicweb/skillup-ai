import { createClient } from '@supabase/supabase-js';

// const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL!;
// const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!;
const supabaseUrl = 'https://hhhtkdjmjyfjlnycjkyl.supabase.co'
const supabaseAnonKey = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImhoaHRrZGptanlmamxueWNqa3lsIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NDU1MzU4NDYsImV4cCI6MjA2MTExMTg0Nn0.HsFlHFnxnywpLTDuoPGHlzewuJJm8wPqbic2Io_UVck';

export const supabase = createClient(supabaseUrl, supabaseAnonKey);
