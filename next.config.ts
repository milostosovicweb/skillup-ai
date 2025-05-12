import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  // matcher: ['/dashboard/:path*'],
  env: {
    SUPABASE_ANON_KEY: process.env.SUPABASE_ANON_KEY,
    SUPABASE_SERVICE_ROLE_KEY: process.env.SUPABASE_SERVICE_ROLE_KEY,
    OPENROUTER_API_KEY: process.env.OPENROUTER_API_KEY,
    SUPABASE_URL: process.env.SUPABASE_URL,
    OPENROUTER_API_URL: process.env.OPENROUTER_API_URL,
    API_URL: process.env.API_URL
  },
};

export default nextConfig;
