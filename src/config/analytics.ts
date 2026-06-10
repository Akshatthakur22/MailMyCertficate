/**
 * Analytics configuration.
 * GTM is the single integration point — never add GA4 IDs here.
 */
export const GTM_ID = process.env.NEXT_PUBLIC_GTM_ID ?? 'GTM-NC668PWC';

/** Whether GTM should load (disabled when ID is explicitly empty). */
export const GTM_ENABLED = Boolean(GTM_ID);

/** Current product tier — update when paid plans launch. */
export const USER_PLAN = 'free' as const;
