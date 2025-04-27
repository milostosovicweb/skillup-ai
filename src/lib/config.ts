// Centralized config for env vars

// Public variables (available on client & server)
export const NEXT_PUBLIC_API_URL = process.env.NEXT_PUBLIC_API_URL!;
export const NEXT_PUBLIC_OPENROUTER_MODEL = process.env.NEXT_PUBLIC_OPENROUTER_MODEL!;

// Server-only variables (only available on server side — API routes / server components)
export const OPENROUTER_API_KEY = process.env.OPENROUTER_API_KEY!;
