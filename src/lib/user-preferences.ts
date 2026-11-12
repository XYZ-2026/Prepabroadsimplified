// Notification / consent preferences stored on users/{uid}.preferences
export const PREFERENCE_DEFAULTS = {
  emailReportReady: true,
  emailCounsellorUpdates: true,
  emailTipsOffers: false, // marketing consent — opt-in only
  whatsappConsent: false,
} as const;

export type PreferenceKey = keyof typeof PREFERENCE_DEFAULTS;
export type Preferences = Record<PreferenceKey, boolean>;

export const PREFERENCE_KEYS = Object.keys(PREFERENCE_DEFAULTS) as PreferenceKey[];

export function resolvePreferences(stored: unknown): Preferences {
  const src = stored && typeof stored === 'object' ? (stored as Record<string, unknown>) : {};
  const out = { ...PREFERENCE_DEFAULTS } as Preferences;
  for (const key of PREFERENCE_KEYS) {
    if (typeof src[key] === 'boolean') out[key] = src[key] as boolean;
  }
  return out;
}
