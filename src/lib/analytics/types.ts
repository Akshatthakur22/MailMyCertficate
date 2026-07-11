/**
 * Analytics event catalog — all events flow through dataLayer.
 * Application code must never call GA4 directly.
 */

export type UserPlan = 'free' | 'pro' | 'enterprise';

export type GenerationMethod = 'fresh' | 'resume';

export type ImportSource = 'csv' | 'google_sheets';

export type ContactChannel = 'github' | 'twitter' | 'linkedin' | 'email';

/** Base fields attached to every event. */
export interface AnalyticsBasePayload {
  event: string;
  /** Anonymous visitor ID — never an email or name. */
  visitor_id?: string;
  user_plan?: UserPlan;
  page_path?: string;
  page_title?: string;
}

// ——— Marketing funnel ———

export interface LandingPageViewedEvent extends AnalyticsBasePayload {
  event: 'landing_page_viewed';
}

export interface PricingViewedEvent extends AnalyticsBasePayload {
  event: 'pricing_viewed';
}

export interface ContactFormSubmittedEvent extends AnalyticsBasePayload {
  event: 'contact_form_submitted';
  contact_channel: ContactChannel;
}

export interface ContactPageViewedEvent extends AnalyticsBasePayload {
  event: 'contact_page_viewed';
}

// ——— Activation funnel ———

export interface SignUpStartedEvent extends AnalyticsBasePayload {
  event: 'sign_up_started';
  entry_point: string;
}

export interface SignUpCompletedEvent extends AnalyticsBasePayload {
  event: 'sign_up_completed';
  /** First meaningful product action (template upload). */
  activation_step: 'template_uploaded';
}

export interface LoginCompletedEvent extends AnalyticsBasePayload {
  event: 'login_completed';
  /** Gmail OAuth for certificate delivery — not a product account. */
  auth_provider: 'gmail';
}

export interface DashboardViewedEvent extends AnalyticsBasePayload {
  event: 'dashboard_viewed';
  is_returning: boolean;
}

// ——— Product usage funnel ———

export interface TemplateSelectedEvent extends AnalyticsBasePayload {
  event: 'template_selected';
  template_name: string;
  template_width: number;
  template_height: number;
  file_type: string;
}

export interface CsvUploadedEvent extends AnalyticsBasePayload {
  event: 'csv_uploaded';
  row_count: number;
  column_count: number;
  import_source: ImportSource;
}

export interface CertificateGenerationStartedEvent extends AnalyticsBasePayload {
  event: 'certificate_generation_started';
  certificates_count: number;
  generation_method: GenerationMethod;
}

export interface CertificateGenerationStartedEvent extends AnalyticsBasePayload {
  event: 'certificate_generation_started';
  certificates_count: number;
  generation_method: GenerationMethod;
}

export interface CertificateGeneratedEvent extends AnalyticsBasePayload {
  event: 'certificate_generated';
  certificates_count: number;
  failed_count: number;
  template_name: string;
  generation_method: GenerationMethod;
  user_plan: UserPlan;
}

export interface CertificateDownloadedEvent extends AnalyticsBasePayload {
  event: 'certificate_downloaded';
  certificates_count: number;
  user_plan: UserPlan;
}

export interface CertificateEmailedEvent extends AnalyticsBasePayload {
  event: 'certificate_emailed';
  certificates_count: number;
  sent_count: number;
  failed_count: number;
  user_plan: UserPlan;
}

// ——— Revenue funnel (future — no payment flow yet) ———

export interface CheckoutStartedEvent extends AnalyticsBasePayload {
  event: 'checkout_started';
  plan_name: string;
}

export interface PurchaseCompletedEvent extends AnalyticsBasePayload {
  event: 'purchase_completed';
  plan_name: string;
  amount: number;
  currency: string;
}

// ——— Retention ———

export interface ReturningDashboardVisitEvent extends AnalyticsBasePayload {
  event: 'returning_dashboard_visit';
  visit_count: number;
}

export interface RepeatCertificateGenerationEvent extends AnalyticsBasePayload {
  event: 'repeat_certificate_generation';
  generation_count: number;
  certificates_count: number;
}

// ——— GitHub appreciation ———

export type GitHubStarPromptTrigger = 'certificate_generated' | 'certificate_downloaded';

export type GitHubRepoClickSource = 'star_prompt';

export interface GitHubStarPromptShownEvent extends AnalyticsBasePayload {
  event: 'github_star_prompt_shown';
  trigger: GitHubStarPromptTrigger;
  certificates_count: number;
}

export interface GitHubRepoClickedEvent extends AnalyticsBasePayload {
  event: 'github_repo_clicked';
  source: GitHubRepoClickSource;
  trigger?: GitHubStarPromptTrigger;
}

export interface GitHubStarPromptDismissedEvent extends AnalyticsBasePayload {
  event: 'github_star_prompt_dismissed';
  trigger: GitHubStarPromptTrigger;
  certificates_count: number;
}

// ——— Page views (virtual pageviews for SPA navigation) ———

export interface VirtualPageViewEvent extends AnalyticsBasePayload {
  event: 'virtual_page_view';
  page_location: string;
  page_path: string;
  page_title: string;
}

export type AnalyticsEvent =
  | LandingPageViewedEvent
  | PricingViewedEvent
  | ContactFormSubmittedEvent
  | ContactPageViewedEvent
  | SignUpStartedEvent
  | SignUpCompletedEvent
  | LoginCompletedEvent
  | DashboardViewedEvent
  | TemplateSelectedEvent
  | CsvUploadedEvent
  | CertificateGenerationStartedEvent
  | CertificateGeneratedEvent
  | CertificateDownloadedEvent
  | CertificateEmailedEvent
  | CheckoutStartedEvent
  | PurchaseCompletedEvent
  | ReturningDashboardVisitEvent
  | RepeatCertificateGenerationEvent
  | GitHubStarPromptShownEvent
  | GitHubRepoClickedEvent
  | GitHubStarPromptDismissedEvent
  | VirtualPageViewEvent;
