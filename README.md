<p align="center">
  <img src="https://img.shields.io/badge/Next.js-16-black?style=for-the-badge&logo=next.js" alt="Next.js 16" />
  <img src="https://img.shields.io/badge/React-19-61DAFB?style=for-the-badge&logo=react" alt="React 19" />
  <img src="https://img.shields.io/badge/Flask-Python-000000?style=for-the-badge&logo=python&logoColor=white" alt="Flask API" />
  <img src="https://img.shields.io/badge/TypeScript-5-3178C6?style=for-the-badge&logo=typescript&logoColor=white" alt="TypeScript 5" />
  <img src="https://img.shields.io/badge/Tailwind_CSS-4-06B6D4?style=for-the-badge&logo=tailwindcss&logoColor=white" alt="Tailwind CSS 4" />
</p>

<h1 align="center">📜 MailMyCertificate</h1>

<p align="center">
  <strong>Generate and send professional certificates in minutes — mostly in your browser.</strong>
</p>

<p align="center">
  Open-source, privacy-first certificate automation for hackathons, educators, and event organizers.<br/>
  Upload a template → Add participants (CSV or Google Sheets) → Place fields → Generate PDFs → Download ZIP or send via Gmail.
</p>

<p align="center">
  <a href="https://mailmycertificate.tech">Live site</a> •
  <a href="#-features">Features</a> •
  <a href="#-architecture">Architecture</a> •
  <a href="#-getting-started">Getting Started</a> •
  <a href="#-deployment">Deployment</a> •
  <a href="#-roadmap">Roadmap</a>
</p>

---

## 🌟 Overview

**MailMyCertificate** is a full certificate workflow: design on a visual canvas, batch-generate PDFs client-side, then optionally send them through **your own Gmail account** via Google OAuth.

| Layer | What runs where |
|--------|------------------|
| **PDF generation** | 100% in the browser (Web Worker + `pdf-lib`) |
| **Participant data** | Stored in **IndexedDB** (Dexie) on your device |
| **Gmail send + OAuth** | **Flask API** on Vercel (`/api/*`) — only when you choose to email |

Production: **[mailmycertificate.tech](https://mailmycertificate.tech)**

---

## Built by Akshat Thakur

**Created by [Akshat Thakur](https://github.com/akshatthakur22)**, a software developer building web applications and tools that solve real problems.

If you like MailMyCertificate, you might also find these useful:

- **[SafeExam](https://safexam.in)** — Online examination platform
- **[Calcuzy](https://calcuzy.app)** — Productivity and calculation tool
- **[Priya Sarv Utthan](https://priyasarvutthan.org)** — Platform for a non-profit organization

Connect on [GitHub](https://github.com/akshatthakur22) • [LinkedIn](https://www.linkedin.com/in/akshatthakur22/) • [Twitter/X](https://twitter.com/akshatt66612958)

---

## ✨ Features

### Certificate wizard (`/tool`)

| Feature | Description |
|---------|-------------|
| **Template upload** | JPG/PNG templates with dimension detection |
| **CSV import** | Up to 400 rows, header detection, preview table |
| **Google Sheets import** | Paste a public sheet URL and sync participant data |
| **Visual field editor** | Drag-and-drop fields, zoom, properties panel (size, alignment, color) |
| **Undo / redo** | Field placement history via `zundo` (Ctrl+Z / Ctrl+Y) |
| **Single-certificate preview** | Preview modal before batch generation |
| **Batch PDF generation** | Web Worker + chunked processing; resume after refresh |
| **ZIP download** | All completed PDFs in one archive |
| **Session recovery** | Restore in-progress batches from IndexedDB |

### Email delivery (`/email`)

| Feature | Description |
|---------|-------------|
| **Gmail OAuth** | Connect your Google account (Gmail API `gmail.send`) |
| **Personalized compose** | Subject/body with `{{column}}` variables from CSV |
| **Attachments** | Sends generated PDF per recipient |
| **Send tracker** | Live progress, failures list, retry-friendly queue |
| **Refresh guard** | Warns before leaving during an active send |

### Site & privacy

| Page | Purpose |
|------|---------|
| `/` | Landing + marketing |
| `/guide` | How-to, FAQs, OAuth walkthrough |
| `/about` | Project story |
| `/contact` | Contact |
| `/settings` | Local data management (view / delete sessions) |
| `/privacy-policy`, `/terms-of-service` | Legal pages |

Also: SEO metadata, JSON-LD, sitemap, PWA manifest, service worker (static assets), Vercel Analytics.

---

## 🏗 Architecture

```
┌──────────────────────────────────────────────────────────────────────────┐
│                         Browser (Next.js 16)                              │
│  /tool  → Wizard (Zustand + Dexie IDB) → Web Worker → pdf-lib → ZIP      │
│  /email → Gmail composer → fetch('/api/...', credentials: 'include')       │
└───────────────────────────────┬──────────────────────────────────────────┘
                                │  /api/*  (Vercel Services)
                                ▼
┌──────────────────────────────────────────────────────────────────────────┐
│                    Flask backend (api/index.py)                           │
│  GET  /api/auth/login      → Google OAuth URL                             │
│  GET  /api/auth/callback   → Exchange code, session + CSRF                  │
│  GET  /api/auth/status     → Connected Gmail + csrf_token sync              │
│  POST /api/send-email      → Gmail API send (PDF attachment)                │
│  POST /api/sheets/import   → Google Sheets CSV fetch                        │
└──────────────────────────────────────────────────────────────────────────┘
```

**Vercel routing** (`vercel.json`): Next.js at `/`, Flask at `/api` via `experimentalServices`.

**Local dev**: `next.config.ts` rewrites `/api/*` → `http://localhost:8000` when `NODE_ENV=development`.

---

## 🛠 Tech Stack

| Category | Technology | Purpose |
|----------|------------|---------|
| Frontend | Next.js 16, React 19, TypeScript 5 | App Router, UI |
| Styling | Tailwind CSS 4 | Design system |
| State | Zustand + `zundo` + persist | Wizard state, undo/redo |
| Storage | Dexie (IndexedDB) | Sessions, templates, PDFs, email queue |
| PDF | pdf-lib + Web Worker | Client-side generation |
| ZIP | JSZip | Batch download |
| CSV | PapaParse | File parsing |
| Backend | Flask, google-auth-oauthlib, Gmail API | OAuth + send + Sheets proxy |
| Deploy | Vercel (Next + Python services) | Production hosting |
| Analytics | @vercel/analytics | Usage metrics |

---

## 📁 Project Structure

```
MailMyCertificate/
├── api/
│   ├── index.py              # Flask app (OAuth, send-email, sheets)
│   └── site_config.py        # APP_URL, CORS, redirect URI helpers
├── public/
│   ├── logo.png              # Brand asset
│   ├── icon-192.png, icon-512.png, favicon-48.png
│   ├── manifest.json         # PWA
│   └── sw.js                 # Service worker (static cache; skips /api)
├── src/
│   ├── app/                  # Routes (/, /tool, /email, /guide, …)
│   ├── views/                # Page-level views
│   ├── components/           # UI, wizard, email, session, seo, guide
│   ├── core/
│   │   ├── db/schema.ts      # Dexie tables
│   │   ├── session/          # Session manager + recovery
│   │   ├── queue/            # Email queue
│   │   └── worker/           # PDF generation worker
│   ├── services/             # template, csv, email, sheets, zip, pdf
│   ├── store/useAppStore.ts  # Zustand + temporal + persist
│   ├── config/site.ts        # Public URL helpers (frontend)
│   └── lib/                  # metadata, SEO, structured data
├── vercel.json               # Next + Flask services
├── requirements.txt          # Python dependencies
├── next.config.ts
└── .env.example
```

---

## 🚀 Getting Started

### Prerequisites

- **Node.js** ≥ 18
- **Python** ≥ 3.10 (for local Gmail API)
- **Google Cloud** OAuth client (Web) with Gmail API enabled

### 1. Clone & install

```bash
git clone https://github.com/akshatthakur22/MailMyCertficate.git
cd MailMyCertficate
npm install
pip install -r requirements.txt
```

### 2. Environment variables

Copy `.env.example` → `.env.local` and fill in:

```bash
NEXT_PUBLIC_APP_URL=http://localhost:3000
APP_URL=http://localhost:3000
FLASK_SECRET_KEY=<random-hex>
GOOGLE_CREDENTIALS_JSON={"web":{...,"redirect_uris":["http://localhost:3000/api/auth/callback"]}}
```

In **Google Cloud Console** → OAuth client → add:

- **Authorized JavaScript origins:** `http://localhost:3000`
- **Authorized redirect URIs:** `http://localhost:3000/api/auth/callback`

For production, also add `https://mailmycertificate.tech` and  
`https://mailmycertificate.tech/api/auth/callback`.

### 3. Run locally (two terminals)

**Terminal A — Flask API (port 8000):**

```bash
python api/index.py
```

**Terminal B — Next.js:**

```bash
npm run dev
```

Open [http://localhost:3000](http://localhost:3000). Gmail connect and send only work when both are running.

Alternatively, with the [Vercel CLI](https://vercel.com/docs/cli): `vercel dev -L` runs frontend + backend together.

### Scripts

| Command | Description |
|---------|-------------|
| `npm run dev` | Next.js dev server |
| `npm run build` | Production build |
| `npm run start` | Start production Next server |
| `npm run lint` | ESLint |
| `python api/index.py` | Flask API on `:8000` (local) |

---

## 🚢 Deployment (Vercel)

1. Import the GitHub repo on Vercel.
2. Set **Production** environment variables:

| Variable | Example |
|----------|---------|
| `APP_URL` | `https://mailmycertificate.tech` |
| `NEXT_PUBLIC_APP_URL` | `https://mailmycertificate.tech` |
| `FLASK_SECRET_KEY` | long random string |
| `GOOGLE_CREDENTIALS_JSON` | full OAuth client JSON (single line) |

3. Ensure `vercel.json` uses `experimentalServices` (already in repo).
4. Redeploy after env changes.

**Checklist after deploy**

- `GET /api/auth/login` returns JSON with `authorization_url` (not HTML 500).
- `redirect_uri` in that URL matches Google Console exactly.
- Connect Gmail on `/email`, then send a test message.

---

## 📧 How email works

1. User clicks **Connect Gmail** → `/api/auth/login` → Google OAuth.
2. Callback → `/api/auth/callback` stores tokens in an **encrypted Flask session cookie**.
3. Frontend syncs **CSRF token** from redirect URL + `/api/auth/status`.
4. Each send: `POST /api/send-email` with `credentials: 'include'`, `X-CSRF-Token`, and PDF attachment (multipart).

Tokens stay on the server session; certificate bytes are read from IndexedDB and only sent when you hit Send.

---

## 🗺 Roadmap

### Done recently
- Gmail OAuth + send via Flask on Vercel
- IndexedDB sessions + recovery
- Google Sheets import
- Undo/redo, preview modal, email send UI
- SEO, PWA, settings / legal pages

### Next
- [ ] Custom font embedding in PDFs (beyond Helvetica)
- [ ] Personalized ZIP filenames from CSV columns
- [ ] Stronger CSV validation (duplicates, email column hints)
- [ ] Dark mode
- [ ] Automated tests (unit + E2E)
- [ ] Rate-limit UX for large Gmail batches

---

## 🤝 Contributing

1. Fork the repo
2. Create a branch (`git checkout -b feature/your-feature`)
3. Commit and push
4. Open a Pull Request

Issues and PRs are welcome.

---

## 📄 License

MIT License — see [LICENSE](LICENSE) if present in the repo root.

---

## 🙏 Acknowledgements

Built with dedication by Akshat Thakur using:

- [pdf-lib](https://pdf-lib.js.org/) · [PapaParse](https://www.papaparse.com/) · [JSZip](https://stuk.github.io/jszip/)
- [Zustand](https://github.com/pmndrs/zustand) · [Dexie](https://dexie.org/) · [Next.js](https://nextjs.org/) · [Flask](https://flask.palletsprojects.com/)
- [Tailwind CSS](https://tailwindcss.com/) · [TypeScript](https://www.typescriptlang.org/) · [React](https://react.dev/)

Thanks to the open-source community for tools that make this possible.

---

<p align="center">
  Built with ❤ by <a href="https://github.com/akshatthakur22">Akshat Thakur</a>
</p>

---
## 👨‍💻 For Developers
If you're looking to **fork, customize, or contribute** to MailMyCertificate:
- Check out the [/for-developers](#) page (coming soon) for architecture deep-dive and customization guide
- Read [CONTRIBUTING.md](CONTRIBUTING.md) for development workflow, code style, and PR process
- Review [GitHub Issues](https://github.com/akshatthakur22/MailMyCertficate/issues) for bugs and feature requests
- Join the discussion on [Discussions](https://github.com/akshatthakur22/MailMyCertficate/discussions) or email via GitHub profile

**Why fork MailMyCertificate?**
- You don't need to build certificate generation + Gmail integration from scratch
- The entire workflow is open and transparent — no black box
- Deploy to your own infrastructure (Vercel, self-hosted, Docker)
- Customize fields, styling, or logic to fit your specific workflow
