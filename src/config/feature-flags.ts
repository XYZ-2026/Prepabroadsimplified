/**
 * feature-flags.ts
 *
 * Centralised feature-flag registry for Career Simplified.
 *
 * HOW TO RE-ENABLE CAREER ROADMAP:
 *   Set CAREER_ROADMAP_ENABLED = true
 *   (or set env var NEXT_PUBLIC_CAREER_ROADMAP_ENABLED=true)
 *
 * Rules:
 * - Flags consumed server-side (middleware, API routes) read from process.env.
 * - Flags consumed client-side (Sidebar, Dashboard) read from NEXT_PUBLIC_ env
 *   OR fall through to the hardcoded default below.
 */

// ─── Career Roadmap Studio ────────────────────────────────────────────────────
// Set to `false` to hide the feature from all student-facing UI and block
// direct URL access.  Backend code, data, and APIs are NOT deleted.
export const CAREER_ROADMAP_ENABLED =
  process.env.NEXT_PUBLIC_CAREER_ROADMAP_ENABLED === 'true'
    ? true
    : process.env.NEXT_PUBLIC_CAREER_ROADMAP_ENABLED === 'false'
    ? false
    : false; // ← DEFAULT: feature is DISABLED

// Optional: allow internal/admin access while keeping students blocked
// (not yet wired; reserved for future use)
export const CAREER_ROADMAP_INTERNAL_ACCESS =
  process.env.NEXT_PUBLIC_CAREER_ROADMAP_INTERNAL_ACCESS === 'true';
