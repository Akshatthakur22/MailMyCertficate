# GTM Operating Manual — MailMyCertificate

Container: **GTM-NC668PWC**  
Site: **https://mailmycertificate.tech**

---

## Folder Strategy

| Folder | Contents |
|--------|----------|
| **GA4** | All Google Analytics 4 tags and related triggers |
| **Clarity** | Microsoft Clarity (add when ready) |
| **Advertising** | Meta Pixel, Google Ads, LinkedIn (future) |
| **Experiments** | A/B test tags, Optimize successors |

Keep vendor-specific tags in their folder. Never mix GA4 event tags with ad pixels in the same folder.

---

## Naming Conventions

### Tags

```
GA4 - {Event Name}
```

Examples:
- `GA4 - Configuration` (base GA4 config)
- `GA4 - Certificate Generated`
- `GA4 - Purchase Completed`
- `Clarity - Base`

### Triggers

```
TR - {Event Name}
```

Examples:
- `TR - Certificate Generated` → Custom Event, Event name = `certificate_generated`
- `TR - Virtual Page View` → Custom Event, Event name = `virtual_page_view`
- `TR - All Pages` → Initialization / Page View (for config tag only)

### Variables

```
VAR - {Variable Name}
```

Examples:
- `VAR - Certificates Count` → Data Layer Variable, key = `certificates_count`
- `VAR - User Plan` → Data Layer Variable, key = `user_plan`
- `VAR - Visitor ID` → Data Layer Variable, key = `visitor_id`

---

## Initial GTM Setup (v1.0)

### Step 1 — GA4 Configuration tag

1. Tag: **GA4 - Configuration**
2. Type: Google Analytics: GA4 Configuration
3. Measurement ID: your GA4 property ID
4. Trigger: **TR - All Pages** (Initialization - All Pages)
5. Send page views: **Off** (we send `virtual_page_view` from the app)

### Step 2 — Virtual pageview tag

1. Tag: **GA4 - Virtual Page View**
2. Type: GA4 Event
3. Event name: `page_view`
4. Parameters:
   - `page_location` → `{{VAR - Page Location}}`
   - `page_path` → `{{VAR - Page Path}}`
   - `page_title` → `{{VAR - Page Title}}`
5. Trigger: **TR - Virtual Page View**

### Step 3 — Product event tags (v1.1)

For each dataLayer event, create:

| Trigger (Custom Event) | GA4 Tag | Event name |
|------------------------|---------|------------|
| `certificate_generated` | GA4 - Certificate Generated | `certificate_generated` |
| `csv_uploaded` | GA4 - CSV Uploaded | `csv_uploaded` |
| `certificate_downloaded` | GA4 - Certificate Downloaded | `certificate_downloaded` |
| `certificate_emailed` | GA4 - Certificate Emailed | `certificate_emailed` |
| `sign_up_started` | GA4 - Sign Up Started | `sign_up_started` |
| `sign_up_completed` | GA4 - Sign Up Completed | `sign_up_completed` |
| `login_completed` | GA4 - Login Completed | `login_completed` |
| `dashboard_viewed` | GA4 - Dashboard Viewed | `dashboard_viewed` |
| `landing_page_viewed` | GA4 - Landing Page Viewed | `landing_page_viewed` |

Map event parameters using Data Layer Variables (see `analytics-architecture.md`).

### Step 4 — Version and publish

Version name: **v1.0 Initial Setup**  
After product events: **v1.1 Added Product Events**  
After Stripe/revenue: **v1.2 Added Revenue Tracking**

---

## Preview Workflow

1. Open GTM → **Preview**.
2. Enter `https://mailmycertificate.tech` (or `http://localhost:3000` for local).
3. GTM debug panel opens connected to your site.
4. Walk the funnel:
   - Land on `/` → `landing_page_viewed`, `virtual_page_view`
   - Click Open Tool → `sign_up_started`
   - Upload template → `template_selected`, `sign_up_completed`
   - Upload CSV → `csv_uploaded`
   - Generate → `certificate_generation_started`, `certificate_generated`
   - Download ZIP → `certificate_downloaded`
   - Send email → `login_completed`, `certificate_emailed`
5. In Preview **Tags Fired** tab, confirm correct GA4 tags fire once.
6. In **Data Layer** tab, confirm no email/name fields appear.

---

## Testing Process

### Pre-publish checklist

- [ ] GA4 Configuration tag fires on first load only
- [ ] Each custom event tag fires once per user action
- [ ] `virtual_page_view` fires on client navigation between `/`, `/tool`, `/email`
- [ ] No tags in "Tags Not Fired" due to wrong trigger event name (case-sensitive)
- [ ] GA4 DebugView (in GA4 admin) shows events in real time
- [ ] Cross-check: `visitor_id` present, no PII

### Local testing

```bash
npm run dev
# Set NEXT_PUBLIC_GTM_ID=GTM-NC668PWC in .env.local
```

Use GTM Preview against `localhost:3000`. Add `localhost` to GA4 data stream if needed.

### Production smoke test

After publish, use GA4 **Realtime** report while performing one full funnel on production.

---

## Publishing Process

1. Complete Preview testing on staging or production URL.
2. GTM → **Submit** (top right).
3. Version name: descriptive (e.g. `v1.1 Added Product Events`).
4. Version description: list tags/triggers added or changed.
5. **Publish**.
6. Document version in this file or team changelog.

---

## Rollback Process

1. GTM → **Admin** → **Container** → **Versions**.
2. Find last known-good version.
3. Click **⋯** → **Publish** (or **Restore** then publish).
4. Verify in Preview that rolled-back tags behave correctly.
5. Never delete old versions — GTM keeps full history.

If a bad tag causes client errors (rare with GA4 tags), rollback immediately and fix in a new workspace version.

---

## GA4 Custom Dimensions (recommended)

Create in GA4 Admin → Custom definitions:

| Dimension | Event parameter | Scope |
|-----------|-----------------|-------|
| User Plan | `user_plan` | Event |
| Import Source | `import_source` | Event |
| Generation Method | `generation_method` | Event |
| Entry Point | `entry_point` | Event |
| Template Name | `template_name` | Event |
| Contact Channel | `contact_channel` | Event |

Do **not** register `visitor_id` as a user-scoped dimension if it could be conflated with PII policy — use event scope only.

---

## Weekly Monitoring (founders)

### Funnels to watch

1. **Acquisition**: `landing_page_viewed` → `sign_up_started` → `dashboard_viewed`
2. **Activation**: `dashboard_viewed` → `template_selected` → `csv_uploaded`
3. **Core value**: `csv_uploaded` → `certificate_generated`
4. **Distribution**: `certificate_generated` → `certificate_downloaded` / `certificate_emailed`
5. **Retention**: `returning_dashboard_visit`, `repeat_certificate_generation`

### Dashboards to build in GA4

- **Acquisition**: Users by source/medium, landing page engagement
- **Activation**: Sign-up completion rate (started → template uploaded)
- **Product**: Certificates generated per week, avg batch size
- **Email**: Gmail connect rate, email send success rate
- **Retention**: % returning tool visitors, repeat generators

### Metrics that matter most

| Metric | Why |
|--------|-----|
| Activation rate | % visitors who upload a template |
| CSV upload rate | Data import = serious intent |
| Certificates generated | Core value delivered |
| Download vs email split | How users distribute |
| Gmail connect rate | Email feature adoption |
| Repeat generation rate | Retention / multi-event organizers |

---

## Adding Clarity Later

1. Create **Clarity** folder.
2. New tag: **Clarity - Base** with Clarity snippet / template.
3. Trigger: **TR - All Pages** (same as GA4 config).
4. Publish as **v1.x Added Clarity**.
5. No application deploy required.

---

## Security & CSP

Production CSP (`next.config.ts`) allows:
- `script-src`: `googletagmanager.com`, `google-analytics.com`
- `connect-src`: GTM and GA4 endpoints
- `frame-src`: `googletagmanager.com` (noscript iframe)

When adding new vendors via GTM, update CSP allowlist in `next.config.ts` before publishing those tags.
