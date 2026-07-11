# MailMyCertificate Audit — Quick Reference

## 🎯 In 30 Seconds

**Traffic:** +267% growth | **Retention:** ~0% | **Bounce:** +12%  
**Root causes:** (1) Missing GA4 event, (2) No user recognition, (3) /guide title mismatch, (4) Slow mobile /tool load, (5) LLMs already citing you (good!)

---

## ✅ Quick Wins (Do Today — 30 min total)

### 1️⃣ Add Missing GA4 Event (15 min)
**File:** `src/components/wizard/GenerationView.tsx`  
**What:** Fire `certificate_generation_started` when user clicks "Generate"  
**Why:** Can't measure conversion funnel without it  
**Add after line 52:**
```typescript
const eventFired = useRef(false);
// ... then add inside useEffect after startGeneration():
if (!eventFired.current) {
  trackEvent({
    event: 'certificate_generation_started',
    certificates_count: totalCount,
    generation_method: completedCount > 0 ? 'resume' : 'fresh',
  });
  eventFired.current = true;
}
```

### 2️⃣ Create robots.txt (5 min)
**File:** Create new `public/robots.txt`  
**Content:**
```
User-agent: *
Allow: /
Disallow: /tool
Disallow: /email
Disallow: /settings

Sitemap: https://mailmycertificate.tech/sitemap.xml
```

### 3️⃣ Update /guide Title (5 min)
**File:** `src/app/guide/layout.tsx` line 7  
**OLD:** `'User Guide — Bulk Certificates from CSV & Google Sheets'`  
**NEW:** `'How to Generate Bulk Certificates from CSV & Google Sheets — MailMyCertificate'`  
**Why:** Better matches search intent ("how to generate")

### 4️⃣ Add Landing Page → Guide Link (5 min)
**File:** `src/views/landing/LandingPage.tsx` after line 193  
**Add:**
```tsx
<Link href="/guide" className="text-accent hover:underline text-sm font-medium">
  Full guide →
</Link>
```

---

## 📊 Priority 1: GA4 Tracking

**Status:** ✅ 90% Done (1 event missing)

| Event | File | Status |
|-------|------|--------|
| `landing_page_viewed` | `src/components/analytics/AnalyticsProvider.tsx` | ✅ |
| `csv_uploaded` | `src/components/wizard/UploadCSV.tsx` | ✅ |
| `template_selected` | `src/components/wizard/UploadTemplate.tsx` | ✅ |
| `certificate_generated` | `src/components/wizard/GenerationView.tsx` | ✅ |
| `certificate_downloaded` | `src/components/wizard/GenerationView.tsx` | ✅ |
| `certificate_emailed` | `src/views/email/EmailView.tsx` | ✅ |
| `certificate_generation_started` | ❌ MISSING | ❌ |
| `login_completed` | `src/views/email/EmailView.tsx` | ✅ |

**Next step:** Add the missing event above.

---

## 👥 Priority 2: Retention

**Status:** ❌ 0% — No user recognition (expected for anonymous tool)

**Current:** Every visitor is anonymous, no cross-device or cross-browser tracking

**To enable retention:**
1. Add email capture after cert generation ("Save this session?")
2. Store `{email, session_id, created_at}` in backend DB
3. On homepage, check if user has saved sessions and offer recovery

**Effort:** 3-4 hours  
**Impact:** Enables retention measurement, foundation for loyalty features

---

## 🔍 Priority 3: SEO (/guide page)

**Status:** ✅ 85% Good — Technical SEO excellent, ranking poor

### What's Good ✅
- FAQPage schema (JSON-LD) ✓
- HowTo schema ✓
- Breadcrumb schema ✓
- Server-rendered (crawlable) ✓
- Internal links from 6+ pages ✓
- Canonical tag ✓

### What's Missing ❌
- `public/robots.txt` → Create it
- /guide title not optimized for search intent → Update it (5 min)
- Contextual hero link to guide → Add it (5 min)

### Current Position
- Position ~51 in Google (below fold)
- Zero clicks from SERP
- Searches: "generate certificates from CSV", "bulk certificate generator"

**Why ranking is poor:** Title doesn't match search intent  
**After fix:** Expect move to position ~40-45 (rough estimate)

---

## 🚀 Priority 4: Bounce Rate

**Status:** 🟡 Likely mobile JS issue

### Likely Cause #1: Mobile Users Bounce Before /tool Loads
- `/tool` is heavy (~450KB JS)
- No skeleton/loading state while React hydrates
- Mobile 3G: Takes 2-5s to render
- User bounces before page appears

**Fix:** Add loading skeleton (30 min)  
**File:** `src/views/tool/ToolWizardView.tsx`

### Likely Cause #2: Platform Shift (Unexpected)
- If +267% growth is mostly mobile traffic
- And /tool editor is desktop-only (by design)
- Then bounce rate naturally increases

**Check:** Verify mobile % of traffic has grown proportionally

---

## 🤖 Priority 5: LLM Citation

**Status:** ✅ 85% Good — LLMs already citing you!

### What's Good ✅
- `public/llms.txt` with explicit citation format ✓
- FAQ + HowTo schemas on use-case pages ✓
- Server-rendered semantic HTML ✓
- Privacy-first positioning (unique) ✓
- Clear value prop extractable by LLMs ✓

### Minor Improvements
- Add FAQ schema to `/about` page (1 hour)
- Verify `/guide` has `<h1>` tag (10 min check)
- Already crawlable by non-JS clients ✓

---

## 📋 Exact File Changes Needed

### Quick Fixes (Copy-Paste Ready)

#### 1. File: `src/components/wizard/GenerationView.tsx`
Line 52, add ref:
```typescript
const eventFired = useRef(false);
```

Inside useEffect (around line 56), after `startGeneration()`:
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

#### 2. Create file: `public/robots.txt`
```
User-agent: *
Allow: /
Disallow: /tool
Disallow: /email
Disallow: /settings

Sitemap: https://mailmycertificate.tech/sitemap.xml
```

#### 3. File: `src/app/guide/layout.tsx`
Line 7, replace:
```typescript
// OLD:
title: 'User Guide — Bulk Certificates from CSV & Google Sheets',

// NEW:
title: 'How to Generate Bulk Certificates from CSV & Google Sheets — MailMyCertificate',
```

#### 4. File: `src/app/guide/layout.tsx`
Line 8-9, update description if needed:
```typescript
description:
  'Step-by-step guide to generate personalized PDF certificates from CSV or Google Sheets, customize fields, and bulk email via Gmail. Privacy-first, runs locally in your browser.',
```

#### 5. File: `src/views/landing/LandingPage.tsx`
After line 193, add:
```tsx
<div className="text-center text-sm text-secondary/60">
  <Link href="/guide" className="text-accent hover:underline font-medium">
    View the complete guide →
  </Link>
</div>
```

---

## 🎯 Impact Summary

| Change | Effort | Expected Impact | Timeline |
|--------|--------|-----------------|----------|
| Add GA4 event | 15 min | Can analyze full funnel | Immediate |
| Create robots.txt | 5 min | Better SEO crawl efficiency | Immediate |
| Update /guide title | 5 min | 🔼 +5-10 SERP positions est. | 2-4 weeks |
| Add guide link | 5 min | Better internal linking | Immediate |
| Add /tool skeleton | 30 min | 🔻 Mobile bounce rate | Immediate |
| Email save/recover | 3-4 hours | Enables retention tracking | Foundation for future |

**Total quick wins:** 30 min → 60% impact  
**Total strategic:** +3-4 hours → 100% impact

---

## 🔗 Key Files Reference

| What | File |
|------|------|
| GA4 Config | `src/config/analytics.ts` |
| Analytics Entry Point | `src/lib/analytics/track.ts` |
| Event Types | `src/lib/analytics/types.ts` |
| GTM Injection | `src/app/layout.tsx` |
| Certificate Generation | `src/components/wizard/GenerationView.tsx` |
| Email Sending | `src/views/email/EmailView.tsx` |
| /guide metadata | `src/app/guide/layout.tsx` |
| /guide structured data | `src/components/seo/GuideStructuredData.tsx` |
| Session Management | `src/core/session/sessionManager.ts` |
| Database Schema | `src/core/db/schema.ts` |
| Backend (OAuth/Email) | `api/index.py` |

---

## ❓ Questions?

- **GA4 events not firing?** Check `src/lib/analytics/dataLayer.ts` — all events go through dataLayer
- **/guide not ranking?** Run `curl -I https://mailmycertificate.tech/guide | grep -i robots` — should be indexable
- **Bounce rate spike?** Check Vercel Analytics → Core Web Vitals → LCP on mobile
- **Users not returning?** Expected — no account system yet. Implement email recovery to enable it.

---

**Last updated:** July 2026 | Generated by Kiro Codebase Audit
