# Mail My Certificate — Launch Readiness Report

**Date:** 2026-06-01  
**Canonical production domain:** `https://mailmycertificate.tech`  
**Scope:** Tier-1 launch blockers only (no feature additions)

---

## Executive summary

| Area | Status |
|------|--------|
| Domain standardization | ✅ Fixed |
| OAuth configuration | ✅ Code aligned — **verify Google Console + Vercel env** |
| CORS | ✅ Fixed |
| PWA / icons | ✅ Fixed |
| Sitemap | ✅ Fixed |
| Metadata | ✅ Fixed |
| Automated tests | ⚠️ Not added (out of scope) |
| Live OAuth smoke test | ⚠️ Requires your production credentials |

**Verdict:** Ready for **public beta** after you set Vercel environment variables and run one manual OAuth + send test on production.

---

## 1. Domain audit

### Single source of truth

| Layer | File | Variable / constant |
|-------|------|---------------------|
| Next.js | `src/config/site.ts` | `NEXT_PUBLIC_APP_URL`, fallback `PRODUCTION_APP_URL` |
| Flask API | `api/site_config.py` | `APP_URL`, `NEXT_PUBLIC_APP_URL`, fallback `PRODUCTION_APP_URL` |

### Files changed (old → new)

| File | Old value | New value |
|------|-----------|-----------|
| `api/index.py` | `mailmycertificate.tech`, `mailcertficate.vercel.app`, hardcoded CORS | `site_config.get_allowed_origins()` |
| `api/index.py` | `REDIRECT_URI` = first JSON URI or `mailcertficate.vercel.app` | `get_oauth_redirect_uri()` → `{APP_URL}/api/auth/callback` |
| `api/index.py` | `get_frontend_url()` → vercel.app heuristic | `get_app_url()` |
| `src/app/layout.tsx` | `metadataBase: https://mailmycertificate.tech` (hardcoded) | `getRootMetadataBase()` from env |
| `src/app/sitemap.ts` | hardcoded `baseUrl` | `getAppUrl()` |
| `src/app/robots.ts` | hardcoded sitemap URL | `absoluteUrl('/sitemap.xml')` |
| `src/views/landing/LandingView.tsx` | hardcoded JSON-LD URL | `absoluteUrl('/')` |
| `src/views/landing/LandingView.tsx` | `mailmycertificate.tech/tool` text | `{publicAppHost}/tool` from env |
| `.env.example` | mixed `.tech` / typo domains | `https://mailmycertificate.tech` |

### Vercel production env (required)

```bash
NEXT_PUBLIC_APP_URL=https://mailmycertificate.tech
APP_URL=https://mailmycertificate.tech
FLASK_SECRET_KEY=<stable-random-secret>
GOOGLE_CREDENTIALS_JSON=<your-json>
```

Optional preview deploys:

```bash
ALLOWED_ORIGINS=https://mailmycertificate.tech,http://localhost:3000
```

---

## 2. OAuth audit

### Flow (unchanged architecture)

```
Email page → GET /api/auth/login
          → Google consent
          → GET /api/auth/callback
          → Flask session cookie + CSRF in session
          → Redirect to {APP_URL}/email?auth_success=true&csrf_token=...
          → POST /api/send-email (X-CSRF-Token + session cookie)
```

### Redirect URIs (must match exactly in Google Cloud Console)

| Environment | Redirect URI |
|-------------|--------------|
| Local dev | `http://localhost:3000/api/auth/callback` |
| Production | `https://mailmycertificate.tech/api/auth/callback` |

Override: `OAUTH_REDIRECT_URI` env var.

### Google Cloud Console checklist

1. **OAuth 2.0 Client** (Web application)
2. **Authorized JavaScript origins:** `https://mailmycertificate.tech`, `http://localhost:3000`
3. **Authorized redirect URIs:** table above
4. **Gmail API** enabled
5. **OAuth consent screen** — add `gmail.send` scope; submit for verification if going beyond test users
6. `GOOGLE_CREDENTIALS_JSON.redirect_uris` must list the same callback URLs

### Code fixes

- `flow.redirect_uri` uses `REDIRECT_URI = get_oauth_redirect_uri()` (not first JSON entry blindly)
- CSRF enforced in production via `is_production()` (not `vercel.app` host sniffing)
- Frontend `fetch(..., { credentials: 'include' })` on all `/api/auth/*` and `/api/send-email` calls

---

## 3. CORS audit

### Final configuration (`api/site_config.py` + Flask-CORS)

| Setting | Value |
|---------|--------|
| **Origins** | `http://localhost:3000` + `APP_URL` + `ALLOWED_ORIGINS` + `https://{VERCEL_URL}` (preview) |
| **supports_credentials** | `True` |
| **SESSION_COOKIE_SECURE** | `True` when `VERCEL=1` or `NODE_ENV=production` |
| **SESSION_COOKIE_HTTPONLY** | `True` |
| **SESSION_COOKIE_SAMESITE** | `Lax` |
| **SESSION_COOKIE_DOMAIN** | `None` (host-only, correct for same-site `/api` on Vercel) |

### Removed obsolete origins

- `https://mailmycertificate.tech`
- `https://mailmycertficate-git-dev-akshatthakur22s-projects.vercel.app` (unless re-added via `ALLOWED_ORIGINS`)

### Security notes

- API and frontend must be served from the **same registrable domain** in production (`mailmycertificate.tech`) so session cookies work on `/api/*` routes.
- Do not set `FLASK_SECRET_KEY` to a random value per cold start in production — use a fixed secret in Vercel.

---

## 4. Asset audit

### Missing assets (before)

| Asset | Referenced in | Status |
|-------|---------------|--------|
| `/icon-192.png` | `layout.tsx`, `manifest.json` | Was missing |
| `/icon-512.png` | `manifest.json` | Was missing |
| `app/icon` | Next.js metadata | Was missing |

### Repaired

| Asset | Action |
|-------|--------|
| `public/icon-192.png` | Copied from `public/logo.png` |
| `public/icon-512.png` | Copied from `public/logo.png` |
| `src/app/icon.png` | Copied from `public/logo.png` (Next.js app icon) |
| `/og-image.png` | Already present ✅ |

### Still valid

- `public/logo.png`
- `public/manifest.json` (updated with `purpose: "any"`)

**Note:** Using one image for all icon sizes is acceptable for beta; replace with properly sized 192/512 assets before a polished PWA launch.

---

## 5. Sitemap audit

### Removed (404 / non-existent)

- `/cookies`
- `/disclaimer`
- `/settings` (app UI, not marketing — also `noindex`)

### Added

- `/guide` (priority 0.9)

### Final sitemap URLs

| URL | In robots allow | In sitemap |
|-----|-----------------|------------|
| `/` | ✅ | ✅ |
| `/guide` | ✅ | ✅ |
| `/about` | ✅ | ✅ |
| `/contact` | ✅ | ✅ |
| `/privacy-policy` | ✅ | ✅ |
| `/terms-of-service` | ✅ | ✅ |
| `/tool` | ❌ disallow | ❌ |
| `/email` | ❌ disallow | ❌ |
| `/settings` | ❌ disallow | ❌ |
| `/api/*` | ❌ disallow | ❌ |

`robots.ts` sitemap URL uses `absoluteUrl('/sitemap.xml')` from `getAppUrl()`.

---

## 6. Metadata audit

### Helper

`src/lib/metadata.ts` → `createPageMetadata({ title, description, path, noIndex? })`

Sets: title, description, canonical, OpenGraph, Twitter.

### Coverage

| Page | Unique title | Unique description | Canonical | OG/Twitter | robots |
|------|-------------|-------------------|-----------|------------|--------|
| `/` (root layout) | ✅ | ✅ | ✅ | ✅ | index |
| `/guide` | ✅ | ✅ | ✅ | ✅ | index |
| `/about` | ✅ | ✅ | ✅ | ✅ | index |
| `/contact` | ✅ | ✅ | ✅ | ✅ | index |
| `/privacy-policy` | ✅ | ✅ | ✅ | ✅ | index |
| `/terms-of-service` | ✅ | ✅ | ✅ | ✅ | index |
| `/tool` | ✅ | ✅ | ✅ | ✅ | **noindex** |
| `/email` | ✅ | ✅ | ✅ | ✅ | **noindex** |
| `/settings` | ✅ | ✅ | ✅ | ✅ | **noindex** |

**Marketing pages with full metadata: 6/6 (100%)**  
**App pages with metadata + noindex: 3/3 (100%)**

---

## 7. Smoke test results

Automated checks run in this pass:

| Step | Check | Result |
|------|-------|--------|
| Build | `npm run build` | ✅ Pass |
| TypeScript | via build | ✅ Pass |
| Static routes | 15 routes generated | ✅ Pass |

**Manual production checks (you must run on deployed site):**

| Step | Expected | Result |
|------|----------|--------|
| 1. Upload template | Success | ⬜ Not run (needs browser + deploy) |
| 2. Upload CSV | Parsed rows | ⬜ Not run |
| 3. Generate certificates | PDFs in IDB | ⬜ Not run |
| 4. Download ZIP | Valid ZIP | ⬜ Not run |
| 5. Gmail OAuth | Callback to `/email` | ⬜ Not run (needs Google creds on Vercel) |
| 6. Send test emails | API 200 | ⬜ Not run |
| 7. Inbox delivery | PDF attached | ⬜ Not run |
| 8. Refresh app | Recovery / no crash | ⬜ Not run |

---

## 8. Remaining risks (non-blocking)

| Risk | Severity | Mitigation |
|------|----------|------------|
| No automated E2E tests | Medium | Manual checklist before each release |
| README still mentions mock email in places | Low | Update README separately |
| Email send state in-memory (refresh mid-send) | Medium | Documented in guide |
| Gmail API quotas / consent screen verification | Medium | Start with test users; monitor quotas |
| Icon files are logo copies (not optimized sizes) | Low | Replace with proper 192/512 PNGs later |
| `FLASK_SECRET_KEY` unset → random per instance | **High if unset** | Set in Vercel |
| Preview deploys need `ALLOWED_ORIGINS` if domain differs | Low | Use env var |

---

## 9. New / modified files (this pass)

**Created**

- `src/config/site.ts`
- `src/lib/metadata.ts`
- `api/site_config.py`
- `src/app/guide/layout.tsx`
- `src/app/about/layout.tsx`
- `src/app/tool/layout.tsx`
- `src/app/email/layout.tsx`
- `src/app/settings/layout.tsx`
- `public/icon-192.png`, `public/icon-512.png`, `src/app/icon.png`
- `docs/LAUNCH_READINESS_REPORT.md`

**Modified**

- `api/index.py`
- `.env.example`
- `src/app/layout.tsx`, `sitemap.ts`, `robots.ts`
- `src/app/contact/page.tsx`, `privacy-policy/page.tsx`, `terms-of-service/page.tsx`
- `public/manifest.json`
- `src/services/emailService.ts`, `googleSheetsService.ts`
- `src/views/landing/LandingView.tsx`

---

## 10. Pre-launch checklist (5 minutes)

- [ ] Set `NEXT_PUBLIC_APP_URL` and `APP_URL` on Vercel to `https://mailmycertificate.tech`
- [ ] Set stable `FLASK_SECRET_KEY`
- [ ] Set `GOOGLE_CREDENTIALS_JSON` with correct redirect URIs
- [ ] Google Console redirect URI = `https://mailmycertificate.tech/api/auth/callback`
- [ ] Deploy → open `/tool` → full wizard smoke test
- [ ] Connect Gmail → send 2 test emails
- [ ] Submit sitemap in Google Search Console
