// Centralized config for env vars

// Public variables (available on client & server)
export const API_URL = process.env.API_URL!;
export const OPENROUTER_MODEL = process.env.OPENROUTER_MODEL!;

// Server-only variables (only available on server side — API routes / server components)
export const OPENROUTER_API_KEY = process.env.OPENROUTER_API_KEY!;
