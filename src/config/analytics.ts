/**
 * Analytics configuration.
 * GTM is the primary integration point.
 * GA4 Measurement ID is used both in GTM config and as a direct fallback.
 */
export const GTM_ID = process.env.NEXT_PUBLIC_GTM_ID ?? 'GTM-NC668PWC';

/** GA4 Measurement ID — configure in GTM as the primary path, direct gtag as fallback */
export const GA4_MEASUREMENT_ID = process.env.NEXT_PUBLIC_GA4_ID ?? 'G-Z9M1R745VG';

/** Whether GTM should load (disabled when ID is explicitly empty). */
export const GTM_ENABLED = Boolean(GTM_ID);

/** Whether direct GA4 gtag should load alongside GTM */
export const GA4_DIRECT_ENABLED = Boolean(GA4_MEASUREMENT_ID);

/** Current product tier — update when paid plans launch. */
export const USER_PLAN = 'free' as const;
