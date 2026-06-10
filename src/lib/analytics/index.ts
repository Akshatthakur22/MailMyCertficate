export { trackEvent, trackPageView } from './track';
export type { TrackOptions } from './track';
export { pushToDataLayer, ensureDataLayer } from './dataLayer';
export {
  getVisitorId,
  incrementToolVisitCount,
  getToolVisitCount,
  markActivated,
  hasActivated,
  incrementGenerationCount,
  getGenerationCount,
} from './visitor';
export type {
  AnalyticsEvent,
  UserPlan,
  GenerationMethod,
  ImportSource,
  ContactChannel,
  GitHubStarPromptTrigger,
  GitHubRepoClickSource,
} from './types';
