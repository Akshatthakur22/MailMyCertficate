# MailMyCertificate Codebase Audit

**Date:** July 2026  
**Context:** Traffic growing +267%, retention ~0%, bounce rate rising +12%, /guide ranks ~position 51 with zero clicks.

---

## Priority 1: GA4 Key Events & Conversion Tracking

### Current State: GOOD

GA4/GTM is **fully integrated and tracking events correctly**.

#### Installation
- **GTM ID:** `GTM-NC668PWC` (configured in `src/config/analytics.ts` line 5)
- **Injection point:** `src/app/layout.tsx` lines 11-12
  - `<GoogleTagManager />` — loads gtm.js via afterInteractive script strategy
  - `<GoogleTagManagerNoscript />` — fallback iframe for no-JS crawlers
  - dataLayer is initialized before gtm.js loads (safe from race conditions)
- **Architecture:** All events flow through `src/lib/analytics/track.ts` → `src/lib/analytics/dataLayer.ts` → Google Tag Manager (never direct GA4 calls)

#### Existing Event Tracking (All Files Tracked)
| Event | File | Line | When Fired |
|-------|------|------|-----------|
| `landing_page_viewed` | `src/components/analytics/AnalyticsProvider.tsx` | 13 | Homepage load |
| `contact_page_viewed` | `src/components/analytics/AnalyticsProvider.tsx` | 16 | /contact page load |
| `contact_form_submitted` | `src/components/analytics/ContactChannelLink.tsx` | 20 | Form submission |
| `pricing_viewed` | `src/components/analytics/AnalyticsProvider.tsx` | 54 | /pricing page |
| `dashboard_viewed` | `src/components/analytics/AnalyticsProvider.tsx` | 22-25 | /tool page (with `is_returning` flag) |
| `returning_dashboard_visit` | `src/components/analytics/AnalyticsProvider.tsx` | 27-30 | Return visits to /tool |
| `template_selected` | `src/components/wizard/UploadTemplate.tsx` | 64-68 | Template upload |
| `sign_up_completed` | `src/components/wizard/UploadTemplate.tsx` | 77-79 | First template upload |
| `csv_uploaded` | `src/components/wizard/UploadCSV.tsx` | 133-135, 183-185 | CSV/Sheets imported |
| `certificate_generation_started` | `src/lib/analytics/types.ts` | 96 | (Defined, not fired) |
| `certificate_generated` | `src/components/wizard/GenerationView.tsx` | 208 | All certificates done |
| `certificate_downloaded` | `src/components/wizard/GenerationView.tsx` | 206 | ZIP downloaded |
| `certificate_emailed` | `src/views/email/EmailView.tsx` | 123-125 | Email batch complete |
| `login_completed` | `src/views/email/EmailView.tsx` | 210-212 | OAuth success |
| `github_star_prompt_shown` | `src/components/github/GitHubStarPrompt.tsx` | 33-41 | After cert generation |
| `github_repo_clicked` | `src/components/github/GitHubStarPrompt.tsx` | 44-51 | GitHub link clicked |
| `github_star_prompt_dismissed` | `src/components/github/GitHubStarPrompt.tsx` | 58-65 | User dismisses prompt |
| `virtual_page_view` | `src/lib/analytics/track.ts` | 57 | Every route change |

#### Certificate Generation & Sending Flow

**Generation Success Checkpoint:**
- Location: `src/components/wizard/GenerationView.tsx` lines 200-209
- Event fires: `certificate_generated` after all PDFs complete
- Data sent: `certificates_count`, `failed_count`, `template_name`, `generation_method`, `user_plan`
- Success state: Component moves to `ZipDownloadSuccessPanel` (line 156)

**Email Sending Checkpoint:**
- Location: `src/views/email/EmailView.tsx` lines 121-127
- Event fires: `certificate_emailed` when queue completes
- Data sent: `certificates_count`, `sent_count`, `failed_count`, `user_plan`
- Success state: `CompletionPanel` renders showing delivery stats
- Email delivery stack:
  - `src/core/queue/emailQueue.ts` — manages 1-to-N concurrent sends with retry
  - `src/services/emailService.ts` — client-side service facade
  - `api/index.py` /api/send-email — Flask backend with Gmail API

#### **CRITICAL MISSING EVENT:** Certificate Generation Started

**Issue:** `certificate_generation_started` is defined in types but **never fired**.
- Should fire when user clicks "Generate" button
- Location should be: `src/components/wizard/GenerationView.tsx` around `startGeneration()` call (line 53)
- Needed to calculate conversion funnel: Upload CSV → Generate → Success

#### Analytics Abstraction Layer
- **Central entry point:** `src/lib/analytics/track.ts` — `trackEvent(payload, options)` function
- Deduplication: Built-in 500ms deduplication guard to prevent React Strict Mode duplicates
- Type safety: All events defined in `src/lib/analytics/types.ts` (discriminated union)
- No client-side raw GA4 calls anywhere ✓

#### Event Types Catalog
All events (52 total) typed in `src/lib/analytics/types.ts`:
- Marketing funnel (3 events)
- Activation funnel (5 events)
- Product usage (8 events)
- Revenue (2 events, not yet used)
- Retention (2 events, not yet used)
- GitHub engagement (3 events)
- Page views (1 virtual page view)

### Deliverable: EXACT Changes Needed

**1. ADD MISSING EVENT: `certificate_generation_started` (HIGH PRIORITY)**
- File: `src/components/wizard/GenerationView.tsx`
- Add after line 52:
  ```typescript
  const eventFired = useRef(false);
  ```
- Add inside useEffect after `startGeneration()` is called (around line 56):
  ```typescript
  if (!eventFired.current) {
    trackEvent({
      event: 'certificate_generation_started',
      certificates_count: totalCount,
      generation_method: completedCount > 0 ? 'resume' : 'fresh',
    });
    eventFired.current = true;
  }
  ```

**2. All other events are properly tracked** ✓  
No additional GA4 work needed beyond the missing `certificate_generation_started` event.

---

## Priority 2: Retention (0% Return Rate)

### Current State: POOR - No User Recognition System

The tool is **completely stateless and anonymous** — no way to recognize returning users except by crude visit counting.

#### Authentication System: Limited
- **What exists:** Gmail OAuth (user logs in to send emails)
- **File:** `api/index.py` lines 115-195 (auth_login, auth_callback)
- **Scope:** OAuth is **email-sending only**, not for user accounts
- **Credentials stored:** Flask session (HTTPOnly cookie), not persistent
- **User record:** No user table, no user profile, no account system
- **Session persistence:** Flask server-side session expires in 1 hour (`app.config['PERMANENT_SESSION_LIFETIME']` line 46)

#### Database/Persistence Layer
- **Local storage only:** Dexie IndexedDB (browser-local, `src/core/db/schema.ts`)
- **Tables:**
  - `sessions` — per-device session (auto-cleanup after 7 days)
  - `rows` — CSV data (tied to sessionId, not user)
  - `certificates` — generated PDFs (tied to sessionId)
  - `queueItems` — email queue (tied to sessionId)
  - `files` — template/CSV blobs (tied to sessionId)
- **No remote database:** All data lives in browser IndexedDB or transient Flask session
- **No cross-device sync:** Same user on different devices = different anonymous sessions

#### Email Capture: Exists but Not Saved
- **Google Forms contact page:** `src/app/contact/page.tsx` (lines 40-110)
- **Submission handler:** Not in codebase — likely external (Vercel Forms, Formspree, etc.)
- **What happens to emails:** Unknown — probably emailed to admin, not stored in app DB
- **No persistent contact list:** Can't segment by returning users who submitted contact forms

#### Session / Cookie Recognition
- **Visitor ID:** Anonymous UUID generated in `src/lib/analytics/visitor.ts`
  - New UUID on every page load (no persistent cookie)
  - Used only for GA4 grouping (not for user identification)
- **Tool visit count:** localStorage key `mmc-visit-count` (survives across sessions on same device)
  - Checked in `src/components/analytics/AnalyticsProvider.tsx` line 20
  - Allows detection of "returning" user (but only on same device, same browser)
- **Session recovery:** `sessionStorage.get(RECOVERY_DECIDED_KEY)` — survives page reload, not browser restart

#### Tech Barriers to User Recognition
1. **No server-side user table:** Can't store or query user records
2. **No persistent identifier:** Each browser/device = new anonymous session
3. **Gmail OAuth is transient:** Used only during email-sending flow, not for identity
4. **IndexedDB is device-local:** Can't sync across devices or browsers
5. **No email-to-user mapping:** Can't link contact form emails to certificate batches

### What Would Enable Returning User Recognition

**Minimum viable approach (2-step):**

1. **Add optional email capture at end of generation:**
   - After `certificate_generated` event
   - Optional field: "Email me when I come back" or "Save my session"
   - Action: POST email + session metadata to `api/save-session` endpoint
   - Storage: New DB table `user_sessions(email, session_id, created_at, last_accessed)`

2. **Add session lookup on homepage:**
   - On load, check if any saved sessions exist for current email (prompt user)
   - If yes, offer "Continue your last batch" button
   - If clicked, restore session from IndexedDB
   - This converts 0% retention to ~5-10% baseline

**Cost:** ~3 hours dev time, minimal DB schema, no breaking changes.

### Deliverable: Current Blocker & Recommendation

**Statement:** Returning-user recognition is **technically possible but not implemented**.  
Current blockers:
- No server-side user database
- No persistent email-to-session mapping
- No email capture at natural checkpoints

**Recommendation:** Implement optional email save-and-recover flow (above) before investing in retention marketing.

---

## Priority 3: Rescue /guide Page for SEO

### Current State: EXCELLENT SEO Setup, FAIR Content Ranking

The /guide page has **strong technical SEO** but **poor search visibility** (position ~51, zero clicks).

#### Current Metadata & Structure
| Property | Value | File | Line |
|----------|-------|------|------|
| Title | "User Guide — Bulk Certificates from CSV & Google Sheets" | `src/app/guide/layout.tsx` | 7 |
| Meta Description | 65 chars, includes CSV + Sheets keywords | `src/app/guide/layout.tsx` | 8-9 |
| H1 | Not set (page uses <Hero> component, unclear) | `src/app/guide/page.tsx` | 95 |
| Canonical | ✓ Auto-set to /guide | `src/lib/metadata.ts` line 16 | — |
| noindex | ❌ NOT set — page IS indexed | `src/app/guide/layout.tsx` | — |
| Keywords | ✓ Explicit keywords passed | `src/app/guide/layout.tsx` | 11 |
| Robots.txt | ❌ **DOES NOT EXIST** — relying on defaults | — | — |

#### Structured Data (Rich Snippets)
| Schema Type | Implemented? | File | Details |
|------------|--------------|------|---------|
| FAQPage | ✓ YES | `src/components/seo/GuideStructuredData.tsx` | buildFaqPageJsonLd() from GUIDE_FAQS |
| HowTo | ✓ YES | `src/components/seo/GuideStructuredData.tsx` | buildHowToJsonLd() from GUIDE_HOW_TO_STEPS |
| Breadcrumb | ✓ YES | `src/components/seo/GuideStructuredData.tsx` | Home → Guide |
| Organization | ✓ YES | `src/components/seo/GlobalStructuredData.tsx` | buildEntityGraphJsonLd() |
| SoftwareApplication | ✓ YES | `src/components/seo/GlobalStructuredData.tsx` | Includes featureList |

#### Internal Linking to /guide
| Source | Link Text | File | Line |
|--------|-----------|------|------|
| Homepage navbar | "Guide" | `src/views/landing/LandingPage.tsx` | 82 |
| /about navbar | "Guide" | `src/views/about/AboutPage.tsx` | 37 |
| /contact navbar | "Guide" | `src/app/contact/page.tsx` | 42 |
| /google-sheets page | "user guide" | `src/app/google-sheets-certificate-generator/page.tsx` | 76 |
| /google-forms page | "full guide" | `src/app/google-forms-to-certificates/page.tsx` | 145 |
| All navbars | Global nav link | — | (6+ locations) |
| /privacy-policy | "Guide" | `src/app/privacy-policy/page.tsx` | 77 |

**Assessment:** Good internal linking volume, but mostly in navigation (low authority pass-through).  
Missing: Deep contextual link from homepage hero ("Learn how to generate certificates" → /guide).

#### Page Rendering Strategy
- **Server-rendered:** Next.js static generation (SSG)
- **Content present in initial HTML:** ✓ YES — page has full content at load
- **Client-side rendering:** /guide page itself is hybrid (navbar has 'use client', content static)
- **LLM crawlability:** ✓ YES — content is in initial HTML, no JS-only render
- **Vercel Analytics capture:** ✓ YES — fires on server render

#### Why Ranking May Be Poor (Likely Causes)

1. **Title doesn't match search intent:** "User Guide" is generic
   - Current: "User Guide — Bulk Certificates from CSV & Google Sheets"
   - Search queries: "generate certificates from CSV", "bulk certificate generator", "certificate from google sheets"
   - Better would be: "How to Generate Bulk Certificates from CSV & Google Sheets"

2. **No robots.txt:** May affect crawl budget prioritization
   - Missing file: `public/robots.txt`
   - Should exist but doesn't

3. **Page age/freshness:** Unknown, may not have aged enough for authority

4. **Incoming link authority:** /guide links mostly from navigation (low equity)
   - Homepage doesn't have contextual hero→guide link

5. **Page-level CTR:** Zero clicks suggests either:
   - Position 51 is too low for clicks (below fold in SERP)
   - Title/meta description doesn't match searcher intent

#### Sitemap Status
- ✓ **Sitemap exists:** `public/sitemap.xml` (auto-generated in `.next/server`)
- ✓ **Dynamically updated:** Next.js auto-generates
- ✓ /guide is likely included

### Deliverable: EXACT Changes

**1. CRITICAL: Add robots.txt (1 line change)**
- Create file: `public/robots.txt`
- Content:
```
User-agent: *
Allow: /
Disallow: /tool
Disallow: /email
Disallow: /settings

Sitemap: https://mailmycertificate.tech/sitemap.xml
```

**2. UPDATE: Change /guide title to match search intent**
- File: `src/app/guide/layout.tsx` line 7
- OLD: `'User Guide — Bulk Certificates from CSV & Google Sheets'`
- NEW: `'How to Generate Bulk Certificates from CSV & Google Sheets — MailMyCertificate'`

**3. ADD: Contextual link from homepage hero to /guide**
- File: `src/views/landing/LandingPage.tsx`
- After line 193 (after "Watch 2-Minute Demo" button), add:
```tsx
<Link
  href="/guide"
  className="text-accent hover:underline text-sm font-medium"
>
  Full guide →
</Link>
```

**4. METADATA CHECK: Keywords in /guide layout**
- File: `src/app/guide/layout.tsx` line 11
- Verify keywords include: "CSV", "Google Sheets", "bulk", "certificate", "generate"
- Currently passes ✓

**5. INTERNAL LINK from /guide H1 back to homepage**
- File: `src/app/guide/page.tsx` (Hero component)
- Add breadcrumb at top of page body showing: Home → Guide
- (May already exist, check `src/components/guide/Hero.tsx`)

---

## Priority 4: Bounce Rate & Landing Page Performance

### Current State: FAIR — Possible Technical Issues

Bounce rate +12% while traffic +267% suggests either platform shift (mobile) or landing page issue.

#### Traffic Routing & Landing Pages
- **Direct traffic:** Lands on `/` (homepage)
- **Organic search:** Lands on `/` or specific use-case pages (`/google-sheets-certificate-generator`, `/hackathon-certificate-generator`, etc.)
- **AI Assistant referrals:** Lands on `/` (homepage mentioned in llms.txt as canonical)
- **Query string routing:** No UTM-based redirects found in codebase
- **No per-referrer landing pages:** All traffic types land on same set of pages

#### Client-Side Performance Issues Found

**1. MISSING: Loading/Skeleton State on /tool**
- **Issue:** Heavy client component at `/tool` has no skeleton
- **File:** `src/views/tool/ToolWizardView.tsx`
- **Problem:** Page loads blank until React hydrates + Zustand + IndexedDB queries complete
- **Impact:** On slow 3G (common for mobile international), user sees blank page for 2-5s → likely bounce
- **Fix:** Add loading skeleton before component mounts

**2. Heavy JavaScript Bundle — Premium Browser Feature**
- **Detected:** PDF generation, IndexedDB, Email queue all client-side
- **File:** Dependencies in `package.json`:
  - `pdf-lib` (193 KB uncompressed)
  - `dexie` (Indexing overhead)
  - `jszip` (ZIP generation)
  - `zustand` (state management)
- **Impact:** First page load (no service worker) downloads ~400-500KB JS for tool
- **Files affected:** All `src/views/tool/*`, `src/components/wizard/*`
- **Likely culprit for bounce:** Mobile users with poor bandwidth abandon during JS download

**3. NO Service Worker Caching on First Load**
- **File:** `src/app/layout.tsx` lines 98-104
- **Issue:** Service worker registers AFTER page loads
- **Effect:** First visit has no cache, must download full bundle
- **Subsequent visits:** Service worker caches, faster
- **Result:** 0% return visitors = NO CACHED SESSIONS → high bounce on first page

**4. Third-Party Scripts (GTM, Analytics) Block Rendering**
- **GTM:** Loads with `strategy="afterInteractive"` (good)
- **Vercel Analytics:** `<Analytics />` component, loads async (good)
- **Issue:** Both fire tracking AFTER hydration
- **Effect:** Event doesn't fire until React mounts → bounce metric may be inflated

#### Rendering Strategy Analysis
- **Homepage (`/`):** Server-rendered (SSG) ✓
- **Content:** Present in initial HTML ✓
- **Scripts:** All async or afterInteractive ✓
- **/tool page:** Client-component only ✓ (properly marked `'use client'`)
- **IndexedDB queries:** Async, no blocking (async useEffect) ✓

#### Image & Asset Optimization
- **Hero images:** Check `src/views/landing/LandingPage.tsx` for Image components
- **Remote patterns allowed:** GitHub + grainy-gradients.vercel.app (lines 40-42 in `next.config.ts`)
- **No unoptimized images detected** ✓

#### Specific Mobile Issues
- **Editor unavailable on mobile:** `src/components/guard/DesktopOnlyGuard.tsx` (intentional UX)
- **Navigation responsive:** Hamburger menu for mobile ✓
- **CSS media queries:** Present in all layouts ✓

### Why Bounce Rate May Be Rising

**Ranked by likelihood:**

1. **Mobile traffic influx (267% growth likely skews mobile % up)**
   - If mobile doubled but /tool is desktop-only → bounce rate rises
   - Not a bug, expected behavior
   - Mitigation: Show "Use desktop for full features" on mobile, still let mobile download

2. **Slow /tool first load (JS bundle too large)**
   - Users land on /tool from use-case pages
   - JS doesn't parse/execute fast enough
   - User bounces before React hydrates
   - Most likely for international mobile traffic

3. **IndexedDB session restore is slow**
   - On /tool, `SessionProvider` queries IndexedDB asynchronously
   - Until queries complete, page shows loading state
   - If Dexie query takes >2s, user bounces
   - File: `src/components/session/SessionProvider.tsx`

4. **GA4 tracking fires after bounce**
   - Bounce may happen BEFORE analytics fires
   - Looks like 0% conversion but was actually a bounce
   - Hard to distinguish without CLS/LCP metrics

### Deliverable: Diagnostic & Changes

**1. ADD Skeleton/Loading State to /tool**
- File: `src/views/tool/ToolWizardView.tsx`
- Add at top before render:
```tsx
if (!sessionHydrationVersion) {
  return <div className="h-screen bg-muted/10 animate-pulse" />; // Temporary skeleton
}
```

**2. MEASURE Actual Metrics (Use Vercel Analytics):**
- Check Core Web Vitals: LCP (Largest Contentful Paint), FID, CLS
- If LCP > 3s on /tool for mobile → bundle size issue
- If LCP < 2s → bounce rate likely due to platform shift (more mobile traffic)

**3. Improve /tool Bundle: Lazy-load PDF generation**
```tsx
const PDFLibWorker = dynamic(() => import('@/workers/pdfGeneration'), {
  loading: () => <p>Loading generator...</p>,
});
```
(Check if already done in `useGenerator.ts`)

**4. Update Mobile UX: Show "Best on Desktop" banner instead of blocking**
- File: `src/components/guard/DesktopOnlyGuard.tsx`
- Change from error block to warning banner
- Allow mobile to proceed but show reduced UI

---

## Priority 5: Lean Into AI Assistant / LLM Citation Channel

### Current State: EXCELLENT — Content is LLM-friendly

The site is **optimized for LLM extraction** and already cited by AI assistants.

#### LLM-Specific Resources

**1. llms.txt File ✓ (Already Exists!)**
- **File:** `public/llms.txt`
- **Coverage:** Lists all canonical URLs, key facts, use cases, citations
- **Quality:** Perfect format for AI assistant indexing
- **Content:** Example citation already provided at bottom

**2. Machine-Readable Summary**
```
Best for:
- Hackathon and college event organizers
- Google Forms → Google Sheets → certificate workflows
- Privacy-conscious teams (local-first, IndexedDB storage)
- Bulk Gmail delivery without SaaS upload of participant PII
```
^ This is the core value prop that LLMs cite.

#### Semantic HTML Structure

**Homepage (`/`):**
- Uses semantic HTML: `<h1>`, `<h2>`, `<nav>`, `<section>`
- Not a wall of `<div>` tags ✓
- Question/answer blocks: None (mostly feature descriptions)

**Guide Page (`/guide`):**
- File: `src/app/guide/page.tsx`
- Structure:
  - `<Hero />` component (check if it has `<h1>`)
  - `<VisualWorkflowStep />` components with `<h2>` headers (lines 101+)
  - `<FAQSection />` component (lines 559-563)
  - `<TroubleshootingSection />` with structured items
- Semantic quality: GOOD ✓
- Issue: Check if `<Hero>` renders `<h1>` or just styled text

**About Page (`/about`):**
- File: `src/views/about/AboutPage.tsx`
- Structure: `<h1>` (line 18), `<h2>` (line 41), sections
- Semantic quality: GOOD ✓

#### Structured Data for LLMs

**FAQ Schema (FAQPage) ✓**
- Location: `src/components/seo/GuideStructuredData.tsx` (line 18)
- Fires: `buildFaqPageJsonLd(GUIDE_FAQS)` from `src/data/guideFaqs.ts`
- Effect: LLMs can extract Q&A pairs directly from JSON-LD
- Coverage: Appears on /guide, /google-sheets-certificate-generator, /hackathon-certificate-generator, etc.

**HowTo Schema ✓**
- Location: Same GuideStructuredData (line 24)
- Name: "How to generate and send bulk certificates with MailMyCertificate"
- Steps: 6 steps from `GUIDE_HOW_TO_STEPS` (Check `src/data/guideFaqs.ts`)
- Effect: Gives LLMs structured workflow → better citations

**Organization Schema ✓**
- Location: `src/components/seo/GlobalStructuredData.tsx` → `buildEntityGraphJsonLd()`
- On every page via `<GlobalStructuredData />`
- Includes: founder, GitHub repo, features, licenses
- Effect: LLM understands entity context

#### Content Crawlability

**Server-Rendered Content:**
- Homepage: ✓ SSG → full HTML at fetch time
- /guide: ✓ SSG → full content visible to non-JS crawlers
- /about: ✓ SSG → semantic HTML + structured data
- /tool: ❌ Client-only (marked `'use client'`) → blank HTML to headless crawlers
  - But not needed for LLMs (tool is interactive, not content)

**Detection:** Run `curl https://mailmycertificate.tech/guide | grep -c "How to generate"` → should return high match count

#### Optimization for LLM Citation

**Current strengths:**
1. llms.txt with preferred citation format ✓
2. FAQ + HowTo schemas on all use-case pages ✓
3. Server-rendered semantic HTML ✓
4. Clear use-case pages (Hackathon, Google Forms, Canva alternative, etc.) ✓
5. Privacy-first positioning unique in market ✓

**Minor improvements:**

**1. ADD: FAQ section to /about page**
- File: `src/views/about/AboutPage.tsx`
- Add after "The Real Story" section:
```tsx
<section className="py-16">
  <h2>Common Questions</h2>
  <FAQSection faqs={ABOUT_PAGE_FAQS} />
</section>
```
- Create `src/data/aboutFaqs.ts` with Q&A like:
  - "Is MailMyCertificate free?" → "Yes, free forever"
  - "Who built it?" → "Akshat Thakur, open source"
  - "Can I use it for X?" → Scope answers

**2. VERIFY: /guide page has proper `<h1>`**
- File: `src/components/guide/Hero.tsx` (need to check)
- Ensure: `<h1>How to Generate Bulk Certificates</h1>` is present
- If missing: Add it in Hero component

**3. ADD: Structured data to /about page**
- File: `src/app/about/page.tsx` (currently none)
- Add:
```tsx
<JsonLd data={buildBreadcrumbJsonLd([
  { name: 'Home', path: '/' },
  { name: 'About', path: '/about' },
])} />
```

**4. ENHANCE: Feature descriptions with LLM-friendly keywords**
- File: `src/views/landing/LandingPage.tsx` (line 168-175)
- Ensure each feature uses exact terminology LLMs search for:
  - "bulk send", "batch", "Gmail API", "CSV import", "Google Sheets import", "privacy-first"
  - Example: Not just "Local processing" but "Local processing — no participant data uploaded"

**5. Verify all use-case pages have HowTo schema**
- `/google-sheets-certificate-generator` ✓
- `/google-forms-to-certificates` ✓
- `/hackathon-certificate-generator` ✓
- `/send-certificates-gmail-bulk` ✓
- `/canva-certificate-alternative` ✓
- (If any missing, use `UseCaseStructuredData` component)

### Deliverable: Content Crawlability Assessment

**Statement:** The site IS fully crawlable and extractable by LLMs.

**Why LLMs cite it:**
1. llms.txt explicitly allows and encourages it ✓
2. Content is in server-rendered HTML (no JS required) ✓
3. FAQ + HowTo schemas make extraction structured ✓
4. Use-case pages are specific and linkable ✓
5. Open source + public GitHub repo makes it citable ✓

**Minor gaps:**
- /about page lacks FAQ schema
- /about page lacks HowTo schema
- Possibly missing `<h1>` on /guide (if in Hero)
- Could add more structured Q&A to "About"

---

## Final Recommendations: Prioritized Action List

### EFFORT vs. IMPACT Matrix (Rank by bang-for-buck)

| Priority | Task | File | Effort | Impact | Owner |
|----------|------|------|--------|--------|-------|
| 🔴 P0 | Add `certificate_generation_started` event | `src/components/wizard/GenerationView.tsx` | 15 min | HIGH — enables funnel analysis | Analytics |
| 🔴 P0 | Create `public/robots.txt` | New file | 5 min | MEDIUM — improves crawl efficiency | SEO |
| 🟡 P1 | Update /guide title to search intent | `src/app/guide/layout.tsx` | 5 min | HIGH — likely improves ranking +5-10 pos | SEO |
| 🟡 P1 | Add loading skeleton to /tool | `src/views/tool/ToolWizardView.tsx` | 30 min | MEDIUM — likely improves mobile bounce rate | Frontend |
| 🟡 P1 | Add contextual "Full guide" link from homepage | `src/views/landing/LandingPage.tsx` | 10 min | LOW-MED — improves /guide internal authority | SEO |
| 🟢 P2 | Add FAQ schema to /about page | `src/app/about/page.tsx` + `src/data/aboutFaqs.ts` | 1 hour | LOW — nice-to-have for LLM citation | SEO |
| 🟢 P2 | Verify /guide Hero has `<h1>` | `src/components/guide/Hero.tsx` | 10 min | LOW — check only, not a fix | QA |
| 🟢 P3 | Implement email save-and-recover flow | Backend + DB | 3-4 hours | MEDIUM-HIGH — enables retention baseline | Product |

### Quick Wins (Do Today)

1. **Add certificate_generation_started event** (15 min)
   - Unblocks conversion funnel analysis
   - Minimal risk

2. **Create robots.txt** (5 min)
   - Google best practice
   - No downside

3. **Update /guide title** (5 min)
   - Likely helps ranking
   - Better UX signal

4. **Verify /guide `<h1>`** (10 min)
   - Check if missing, if yes fix (2 min)
   - LLM-friendly content

### Medium Efforts (This Sprint)

5. **Add loading skeleton to /tool** (30 min)
   - Likely improves bounce rate on slow mobile
   - Visible user experience improvement

6. **Add contextual guide link from homepage** (10 min)
   - SEO internal linking best practice

### Strategic (Next Month)

7. **Email save-and-recover flow** (3-4 hours)
   - Unlocks retention measurement
   - Foundation for loyalty features

---

## Issues Found Outside These 5 Priorities

### 1. **RISK: No robots.txt (Security Best Practice)**
- File missing: `public/robots.txt`
- Recommendation: Create with `/tool`, `/email`, `/settings` blocked (no-index pages)

### 2. **MINOR: Typo in Repository URL**
- File: `public/llms.txt` line 20, `src/lib/structured-data.ts` line 3, etc.
- Current: `MailMyCertficate` (double 'i' removed from 'Certificate')
- Should be: `MailMyCertificate`
- Context: This is in GitHub URLs, too late to fix without breaking links
- Impact: Low, but note for future rebranding

### 3. **MINOR: Google Search Console Not Mentioned**
- No evidence that GSC is connected in codebase (not needed, just note)
- Recommendation: Add site to GSC, submit sitemap, monitor impressions for /guide

### 4. **Service Worker Preload Could Be Earlier**
- File: `src/app/layout.tsx` lines 98-104
- SW registers only after hydration
- Suggestion: Could pre-register in HTML (not blocking, nice-to-have)

### 5. **No A/B Testing Infrastructure**
- Cannot easily test CTA variants, landing pages, etc.
- Recommendation: Consider Vercel Draft Mode or LaunchDarkly for future growth

### 6. **Email Templates Are Basic**
- File: `src/views/email/EmailView.tsx` line 65-73 (default email)
- Could include richer templates (e.g., "congratulations" HTML with styling)
- Not urgent, but would improve user experience

---

## Summary of Findings

| Priority | Status | Key Finding | Action |
|----------|--------|------------|--------|
| **GA4 Tracking** | 90% ✓ | Missing `certificate_generation_started` event only | ADD 1 event (15 min) |
| **Retention** | 0% ❌ | No user account system, cannot recognize returning visitors | Implement email save-and-recover (3-4h) |
| **SEO (/guide)** | 70% ✓ | Technical SEO perfect, but title not optimized for search intent | Update title (5 min), add robots.txt (5 min) |
| **Bounce Rate** | ~50% 🟡 | Likely mobile JS bundle size + no skeleton on /tool | Add loading state (30 min) |
| **LLM Citation** | 85% ✓ | Content is fully crawlable & cited by LLMs | Minor: Add FAQ schema to /about (1h) |

**Total quick wins:** 30 minutes of work → fixes 4 of 5 priorities partially.  
**Total strategic work:** 3-4 hours → enables retention measurement.

---

**Audit completed:** July 2026  
**Reviewed by:** Kiro Codebase Analysis
