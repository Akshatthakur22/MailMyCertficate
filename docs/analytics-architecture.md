# MailMyCertificate — Analytics Architecture

## System Overview

MailMyCertificate uses a **GTM-first measurement stack**. Application code pushes structured events to `window.dataLayer`. Google Tag Manager routes those events to GA4, and future tools (Microsoft Clarity, Meta Pixel, LinkedIn Insight, etc.) without code changes.

```
┌─────────────────────────────────────────────────────────────────┐
│  React / Next.js App (client events + virtual pageviews)         │
│  src/lib/analytics/track.ts → window.dataLayer.push(...)         │
└───────────────────────────────┬─────────────────────────────────┘
                                │
                                ▼
┌─────────────────────────────────────────────────────────────────┐
│  Google Tag Manager (GTM-NC668PWC)                               │
│  Triggers: Custom Event (dataLayer `event` name)                 │
│  Tags: GA4, Clarity (future), Ads (future)                       │
└───────────────────────────────┬─────────────────────────────────┘
                                │
              ┌─────────────────┼─────────────────┐
              ▼                 ▼                 ▼
           GA4            Clarity (GTM)      Ad pixels (GTM)
```

### Design principles

1. **GTM is the single source of truth** for third-party tags.
2. **No direct GA4 calls** in application code (`gtag`, `@next/third-parties/google` GA4, etc.).
3. **All tracking uses dataLayer** via `trackEvent()`.
4. **No PII** — never send emails, names, CSV contents, or recipient data.
5. **SSR-safe** — tracking only runs in the browser; GTM loads `afterInteractive`.

### Product context (important)

MailMyCertificate is **privacy-first and accountless**. There is no traditional sign-up, login, dashboard, or pricing page today. Events are named for the **target SaaS funnel** but map to real product actions:

| Spec event | Actual product meaning |
|------------|------------------------|
| `sign_up_started` | User clicks "Open Tool" (intent to activate) |
| `sign_up_completed` | First template uploaded (activation) |
| `login_completed` | Gmail OAuth connected for email delivery |
| `dashboard_viewed` | `/tool` wizard opened |
| `contact_form_submitted` | Contact channel clicked (no HTML form exists) |
| `pricing_viewed` / `checkout_*` / `purchase_*` | Reserved for future monetization |

---

## Code Map

| File | Purpose |
|------|---------|
| `src/config/analytics.ts` | GTM ID, feature flags |
| `src/lib/analytics/types.ts` | Typed event catalog |
| `src/lib/analytics/track.ts` | `trackEvent()`, `trackPageView()` |
| `src/lib/analytics/dataLayer.ts` | dataLayer initialization |
| `src/lib/analytics/visitor.ts` | Anonymous `visitor_id`, retention counters |
| `src/components/analytics/GoogleTagManager.tsx` | GTM script (once) + noscript |
| `src/components/analytics/AnalyticsProvider.tsx` | SPA pageviews + route events |
| `src/components/analytics/TrackToolCta.tsx` | CTA click → `sign_up_started` |
| `src/components/analytics/ContactChannelLink.tsx` | Contact engagement tracking |
| `src/config/github.ts` | Repository URL, star-prompt thresholds |
| `src/lib/github/starPrompt.ts` | Eligibility + 30-day dismissal cooldown |
| `src/components/github/GitHubStarPrompt.tsx` | Post-success GitHub star appreciation UI |

---

## Data Flow

### Page views (client-side navigation)

1. User navigates via Next.js App Router.
2. `AnalyticsProvider` detects `pathname` change.
3. Fires `virtual_page_view` + route-specific events (e.g. `landing_page_viewed`).
4. GTM trigger **TR - Virtual Page View** → GA4 Configuration tag page_view.

### Business events

1. User completes an action (upload CSV, generate certificates, etc.).
2. Component calls `trackEvent({ event: '...', ...params })`.
3. `track.ts` enriches with `visitor_id`, `user_plan`, dedupes within 500ms.
4. GTM custom event trigger matches `event` name → GA4 event tag fires.

---

## Event Catalog

### Marketing funnel

| Event | When it fires | Parameters |
|-------|---------------|------------|
| `landing_page_viewed` | `/` route | `visitor_id`, `user_plan` |
| `pricing_viewed` | `/pricing` route (future) | `visitor_id`, `user_plan` |
| `contact_page_viewed` | `/contact` route | `visitor_id`, `user_plan` |
| `contact_form_submitted` | Contact channel link click | `contact_channel`: `github` \| `twitter` \| `linkedin` \| `email` |

### Activation funnel

| Event | When it fires | Parameters |
|-------|---------------|------------|
| `sign_up_started` | "Open Tool" CTA click | `entry_point`: e.g. `hero_cta`, `navbar` |
| `sign_up_completed` | First template upload | `activation_step`: `template_uploaded` |
| `login_completed` | Gmail OAuth success redirect | `auth_provider`: `gmail` |
| `dashboard_viewed` | `/tool` route | `is_returning`: boolean |

### Product usage funnel

| Event | When it fires | Parameters |
|-------|---------------|------------|
| `template_selected` | Template image uploaded | `template_name`, `template_width`, `template_height`, `file_type` |
| `csv_uploaded` | CSV or Google Sheets import | `row_count`, `column_count`, `import_source` |
| `certificate_generation_started` | PDF batch starts | `certificates_count`, `generation_method` |
| `certificate_generated` | Batch completes | `certificates_count`, `failed_count`, `template_name`, `generation_method`, `user_plan` |
| `certificate_downloaded` | ZIP download | `certificates_count`, `user_plan` |
| `certificate_emailed` | Email send batch completes | `certificates_count`, `sent_count`, `failed_count`, `user_plan` |

### Revenue funnel (future)

| Event | Status | Parameters |
|-------|--------|------------|
| `checkout_started` | Types defined, not instrumented | `plan_name` |
| `purchase_completed` | Types defined, not instrumented | `plan_name`, `amount`, `currency` |

### Retention

| Event | When it fires | Parameters |
|-------|---------------|------------|
| `returning_dashboard_visit` | `/tool` visit when `visit_count > 1` | `visit_count` |
| `repeat_certificate_generation` | 2nd+ successful generation | `generation_count`, `certificates_count` |

### GitHub appreciation

Shown only after a **successful** certificate batch (`GenerationView` completion) or ZIP download, and only when the user is a meaningful contributor:

- `certificates_count >= 20` in the current batch, **or**
- `mmc_generation_count > 1` in localStorage (2nd+ successful generation ever in this browser).

A **30-day cooldown** (`mmc_github_star_prompt_dismissed_at` in localStorage) applies after **Maybe Later**. The prompt is shown at most **once per browser tab session** (generate → download does not double-prompt).

| Event | When it fires | Parameters |
|-------|---------------|------------|
| `github_star_prompt_shown` | Eligible user sees the appreciation banner | `trigger`: `certificate_generated` \| `certificate_downloaded`, `certificates_count` |
| `github_repo_clicked` | User clicks **⭐ Star on GitHub** | `source`: `star_prompt`, `trigger` (optional) |
| `github_star_prompt_dismissed` | User clicks **Maybe Later** | `trigger`, `certificates_count` |

#### Interpreting GitHub support metrics

These events measure **goodwill and intent**, not confirmed GitHub stars. GA4 cannot verify that a user actually starred the repo after leaving the site.

| Metric | Formula / reading | Healthy signal |
|--------|-------------------|----------------|
| **Prompt reach** | `github_star_prompt_shown` users | Eligible power users seeing the ask |
| **Click-through rate** | `github_repo_clicked` ÷ `github_star_prompt_shown` | Strong message/CTA fit (benchmark: 5–15% is solid for non-blocking prompts) |
| **Dismiss rate** | `github_star_prompt_dismissed` ÷ `github_star_prompt_shown` | Most users dismiss — expected; watch for sudden spikes after copy/placement changes |
| **Trigger mix** | `trigger` on shown / click events | Compare `certificate_downloaded` vs `certificate_generated` to see when users are most receptive |
| **Repo stars (GitHub)** | GitHub repo insights | Lagging indicator — correlate weekly star growth with prompt volume, not 1:1 with clicks |

**Do not** treat `github_repo_clicked` as equal to new stars. **Do** use it as a leading indicator of advocacy among high-value users (large batches, repeat generators). Compare against `contact_form_submitted` where `contact_channel = github` to separate organic contact-page traffic from post-success appreciation.

### Navigation

| Event | When it fires | Parameters |
|-------|---------------|------------|
| `virtual_page_view` | Every route change | `page_path`, `page_title`, `page_location` |

---

## Parameters — Privacy Rules

### Always safe to send

- Counts (`row_count`, `certificates_count`, `sent_count`)
- Template dimensions (`template_width`, `template_height`)
- Anonymous `visitor_id` (UUID in localStorage)
- `user_plan` (currently always `free`)
- `import_source`, `generation_method`, `entry_point`

### Never send

- Email addresses (user or recipient)
- Names from CSV
- CSV cell values
- Gmail address after OAuth
- Session IDs tied to certificate content
- IP-derived identifiers from app code

---

## Developer Guidelines

### Adding a new event

1. Add the TypeScript interface in `src/lib/analytics/types.ts`.
2. Add to the `AnalyticsEvent` union.
3. Call `trackEvent()` at the business action site (not in a `useEffect` unless it's a page view).
4. Create GTM trigger **TR - Event Name** (Custom Event, event name = your event).
5. Create GA4 tag **GA4 - Event Name** mapped to that trigger.
6. Test in GTM Preview before publishing.

### Example

```typescript
import { trackEvent } from '@/lib/analytics';

trackEvent({
  event: 'certificate_generated',
  certificates_count: 150,
  failed_count: 0,
  template_name: 'custom_png_1920x1080',
  generation_method: 'fresh',
  user_plan: 'free',
});
```

### Deduping

`trackEvent` accepts `{ dedupeKey: 'unique-key' }` to prevent double-fires from React Strict Mode (500ms window).

### Environment

```bash
NEXT_PUBLIC_GTM_ID=GTM-NC668PWC
```

Set in Vercel production env. Disable locally by setting `NEXT_PUBLIC_GTM_ID=` (empty).

---

## Microsoft Clarity (via GTM — no code changes)

When ready to add Clarity:

1. In GTM, create folder **Clarity**.
2. Add tag **Clarity - Base** (Custom HTML or Clarity template) with your Clarity project ID.
3. Trigger: **All Pages** (or same as GA4 config).
4. Publish GTM container — Clarity loads without touching the codebase.

Optional: create a dataLayer trigger for `certificate_generated` to pass custom Clarity tags via GTM variables (still no app code change if using GTM Custom Event triggers + Clarity API in a GTM tag).

---

## Coexistence with Vercel Analytics

`@vercel/analytics` remains for Vercel-hosted operational metrics. It is independent of GTM/GA4 and does not replace product funnel measurement.

---

## Validation Checklist

- [ ] GTM initializes once (`window.__mmcGtmInitialized === true`)
- [ ] No hydration mismatches (GTM uses `next/script`, noscript is static iframe)
- [ ] Events fire once per action (dedupe keys in place)
- [ ] No duplicate page views on same path
- [ ] SSR pages render without `window` errors
- [ ] No PII in dataLayer (inspect in GTM Preview)
- [ ] Client-side navigation fires `virtual_page_view`
- [ ] `npm run build` succeeds with updated CSP
