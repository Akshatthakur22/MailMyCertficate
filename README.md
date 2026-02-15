<p align="center">
  <img src="https://img.shields.io/badge/Next.js-16-black?style=for-the-badge&logo=next.js" alt="Next.js 16" />
  <img src="https://img.shields.io/badge/React-19-61DAFB?style=for-the-badge&logo=react" alt="React 19" />
  <img src="https://img.shields.io/badge/TypeScript-5-3178C6?style=for-the-badge&logo=typescript&logoColor=white" alt="TypeScript 5" />
  <img src="https://img.shields.io/badge/Tailwind_CSS-4-06B6D4?style=for-the-badge&logo=tailwindcss&logoColor=white" alt="Tailwind CSS 4" />
  <img src="https://img.shields.io/badge/License-MIT-green?style=for-the-badge" alt="MIT License" />
</p>

<h1 align="center">📜 MailMyCertificate</h1>

<p align="center">
  <strong>Generate and send professional certificates in minutes — entirely in your browser.</strong>
</p>

<p align="center">
  An open-source, privacy-first, local-first certificate automation tool.<br/>
  Upload a template → Add participants via CSV → Visually position text fields → Batch-generate PDFs → Download or email them.
</p>

<p align="center">
  <a href="#-features">Features</a> •
  <a href="#%EF%B8%8F-architecture">Architecture</a> •
  <a href="#-tech-stack">Tech Stack</a> •
  <a href="#-getting-started">Getting Started</a> •
  <a href="#-project-structure">Project Structure</a> •
  <a href="#-roadmap--whats-left">Roadmap</a> •
  <a href="#-contributing">Contributing</a>
</p>

---

## 🌟 Overview

**MailMyCertificate** is a browser-based certificate automation tool designed for hackathon organizers, educators, event managers, and anyone who needs to generate and distribute personalized certificates at scale.

The entire certificate generation pipeline — from template upload to PDF creation — runs **entirely client-side** using `pdf-lib`. No data is ever sent to a server during generation. The tool follows a 4-step wizard workflow that guides users through the complete process.

### Key Highlights

- 🔒 **Privacy-First** — Participant data never leaves the browser until you explicitly choose to send emails
- ⚡ **Lightning Fast** — Chunked, batched processing generates hundreds of certificates in seconds
- 🎨 **Visual Editor** — Drag-and-drop field placement with live preview, zoom controls, and property editing
- 📦 **Batch Export** — Download all certificates as a single ZIP archive
- 📧 **Email Integration** — Compose and send personalized emails with certificates attached (WIP)
- 🧠 **Persistent State** — Work-in-progress is automatically saved to `localStorage` via Zustand

---

## ✨ Features

### ✅ Currently Working

| Feature | Description |
|---------|-------------|
| **Template Upload** | Drag-and-drop or click-to-upload JPG/PNG certificate templates with automatic dimension detection |
| **CSV Upload & Parsing** | Upload participant lists (up to 400 rows) with automatic header detection, validation, and data preview table |
| **Visual Field Editor** | Interactive canvas editor with draggable text fields, zoom in/out, fit-to-screen, and a dot-grid workspace |
| **Field Properties Panel** | Real-time editing of font size (12–200px), text alignment (left/center/right), color presets + custom color picker |
| **PDF Generation** | Client-side batch PDF generation using `pdf-lib` with chunked processing (batches of 20) and progress tracking |
| **ZIP Download** | All generated certificates are bundled into a downloadable ZIP file using `JSZip` |
| **Step Wizard UI** | 4-step guided workflow with animated step indicators, breadcrumb navigation, and step validation |
| **State Persistence** | All input state (template, CSV data, fields, current step) is persisted to `localStorage` via Zustand middleware |
| **Responsive Design** | Mobile-friendly layout with responsive sidebar/panel layout on the editor page |
| **Landing Page** | Professional marketing landing page with hero section, feature highlights, how-it-works steps, trust badges, and CTA |

### 🚧 Work in Progress / Things Left to Build

| Feature | Status | Notes |
|---------|--------|-------|
| **Email Sending (Backend)** | 🟡 Frontend Ready | The email composer UI is fully built with subject/body editing, dynamic variable support (`{{ColumnName}}`), and recipient count display. Currently uses a **mock/simulated** API call. Needs a real backend (e.g., Next.js API route + Nodemailer/SendGrid/Resend) |
| **Email Authentication** | 🟡 Mock Only | Login form UI exists but uses mock validation — needs real OAuth or credential-based auth |
| **Custom Font Support** | 🔴 Not Started | Currently uses `StandardFonts.Helvetica` from `pdf-lib` regardless of `fontFamily` field setting. Need to embed custom fonts (Inter, Roboto, etc.) into the PDF |
| **PDF Preview** | 🔴 Not Started | No single-certificate preview before batch generation. Would be useful to render one sample certificate for visual confirmation |
| **Dark Mode** | 🟡 Scaffolded | CSS variables for dark mode are defined but commented out in `globals.css` |
| **Testing** | 🔴 Not Started | No unit tests, integration tests, or E2E tests currently exist |
| **Backend API** | 🔴 Not Started | No API routes exist. Needed for email sending, potential server-side rendering, and job queuing |
| **Error Boundary** | 🔴 Not Started | No React error boundaries for graceful failure handling |
| **Advanced CSV Validation** | 🟡 Basic | Only validates row count (max 400) and presence of headers. No column-type validation or duplicate detection |
| **Certificate Naming** | 🟡 Basic | Files are named `certificate_1.pdf`, `certificate_2.pdf`, etc. Could be personalized (e.g., `certificate_John_Doe.pdf`) |
| **Multi-page PDF Support** | 🔴 Not Started | Currently generates one page per certificate — no support for multi-page templates |
| **Undo/Redo** | 🔴 Not Started | No undo/redo history for field placement actions in the editor |
| **Field Snapping/Guides** | 🔴 Not Started | No alignment guides or snap-to-grid functionality in the visual editor |

---

## 🏗️ Architecture

### High-Level Architecture Diagram

```
┌─────────────────────────────────────────────────────────────────────┐
│                        BROWSER (Client-Side)                        │
│                                                                     │
│  ┌──────────┐    ┌──────────┐    ┌──────────┐    ┌──────────────┐  │
│  │  Upload   │───▶│  Upload  │───▶│  Adjust  │───▶│   Generate   │  │
│  │ Template  │    │   CSV    │    │ & Preview │    │ & Download   │  │
│  │ (Step 1)  │    │ (Step 2) │    │ (Step 3)  │    │  (Step 4)    │  │
│  └────┬─────┘    └────┬─────┘    └────┬──────┘    └──────┬───────┘  │
│       │               │               │                  │          │
│       ▼               ▼               ▼                  ▼          │
│  ┌─────────────────────────────────────────────────────────────┐    │
│  │                    ZUSTAND STORE                             │    │
│  │  ┌────────────┬──────────┬────────┬──────────────────────┐  │    │
│  │  │  template  │ csvData  │ fields │ generationProgress   │  │    │
│  │  │ dimensions │ headers  │        │ generatedBlobs       │  │    │
│  │  └────────────┴──────────┴────────┴──────────────────────┘  │    │
│  │              ↕ localStorage (persist middleware)             │    │
│  └─────────────────────────────────────────────────────────────┘    │
│                                                                     │
│  ┌──────────────── Service Layer ──────────────────────────────┐    │
│  │  templateService  │ csvService │ certificateService │ zip   │    │
│  │  (FileReader API) │ (PapaParse)│ (pdf-lib)          │(JSZip)│    │
│  └─────────────────────────────────────────────────────────────┘    │
│                                                                     │
│  ┌──────────────── Email Flow (WIP) ──────────────────────────┐    │
│  │  /email page → EmailView → emailService (mock) → Backend?  │    │
│  └─────────────────────────────────────────────────────────────┘    │
└─────────────────────────────────────────────────────────────────────┘
```

### Application Flow

```
Landing Page (/)
    │
    ▼
Tool Wizard (/tool)
    │
    ├── Step 1: Upload Template (JPG/PNG → Base64 + Dimensions)
    │       └─ templateService.ts → loadTemplate()
    │
    ├── Step 2: Upload CSV (.csv → parsed rows + headers)
    │       └─ csvService.ts → parseCSV() via PapaParse
    │
    ├── Step 3: Adjust & Preview (Visual canvas editor)
    │       ├─ DraggableField.tsx (drag-to-position text overlays)
    │       ├─ Properties Panel (font size, alignment, color)
    │       └─ Zoom controls (zoom in/out, fit-to-screen)
    │
    └── Step 4: Generate & Download
            ├─ certificateService/renderSingle.ts (pdf-lib)
            │   └─ Batch processing: 20 certificates per chunk
            ├─ JSZip → certificates.zip
            └─ Option: Navigate to /email for sending
                    └─ emailService.ts (currently simulated)
```

### Data Flow

1. **Template Image** → `FileReader` → Base64 data URI + `Image()` for width/height → stored in Zustand as `template` + `templateDimensions`
2. **CSV File** → `PapaParse` → `{ headers: string[], data: CSVRow[] }` → stored in Zustand as `csvData` + `csvHeaders`
3. **Field Placement** → User drags fields on the canvas → coordinates stored as absolute pixel positions in image-space → Zustand `fields[]` array
4. **PDF Rendering** → For each CSV row: `pdf-lib` creates a new PDF → embeds template image as background → draws text at field positions (with coordinate inversion for PDF's bottom-left origin) → returns `Uint8Array`
5. **ZIP Archive** → All `Uint8Array` PDFs → `JSZip` → `Blob` → `URL.createObjectURL` → download link

---

## 🛠 Tech Stack

| Category | Technology | Version | Purpose |
|----------|-----------|---------|---------|
| **Framework** | [Next.js](https://nextjs.org/) | 16.1.6 | App Router, SSR/SSG, file-based routing |
| **UI Library** | [React](https://react.dev/) | 19.2.3 | Component architecture with React Compiler enabled |
| **Language** | [TypeScript](https://www.typescriptlang.org/) | 5.x | Type safety across the entire codebase |
| **Styling** | [Tailwind CSS](https://tailwindcss.com/) | 4.x | Utility-first CSS with custom theme tokens |
| **State Management** | [Zustand](https://zustand-demo.pmnd.rs/) | 5.0.11 | Lightweight store with `persist` middleware for `localStorage` |
| **PDF Generation** | [pdf-lib](https://pdf-lib.js.org/) | 1.17.1 | Client-side PDF creation, image embedding, text rendering |
| **CSV Parsing** | [PapaParse](https://www.papaparse.com/) | 5.5.3 | Robust CSV parsing with header detection and error handling |
| **ZIP Creation** | [JSZip](https://stuk.github.io/jszip/) | 3.10.1 | Client-side ZIP archive generation |
| **Icons** | [Lucide React](https://lucide.dev/) | 0.564.0 | Beautiful, consistent icon library |
| **Utilities** | [clsx](https://github.com/lukeed/clsx) + [tailwind-merge](https://github.com/dcastil/tailwind-merge) | — | Conditional class merging without conflicts |
| **Fonts** | [Inter](https://fonts.google.com/specimen/Inter) (Google Fonts) | — | Primary UI font via `next/font` |

---

## 📁 Project Structure

```
MailMyCertificate/
├── public/                          # Static assets
│   └── platform-preview.png        # Landing page product screenshot
│
├── src/
│   ├── app/                         # Next.js App Router (pages)
│   │   ├── layout.tsx              # Root layout (Inter font, metadata, SEO)
│   │   ├── globals.css             # Design tokens, Tailwind config, custom utilities
│   │   ├── page.tsx                # Landing page route (/)
│   │   ├── tool/page.tsx           # Tool wizard route (/tool)
│   │   └── email/page.tsx          # Email composer route (/email)
│   │
│   ├── views/                       # Page-level view components
│   │   ├── landing/
│   │   │   └── LandingView.tsx     # Full landing page (hero, features, CTA, footer)
│   │   ├── tool/
│   │   │   └── ToolWizardView.tsx  # 4-step wizard container + step routing
│   │   └── email/
│   │       └── EmailView.tsx       # Email composer (auth gate + compose + success)
│   │
│   ├── components/
│   │   ├── ui/                      # Reusable UI primitives
│   │   │   ├── Button.tsx          # Button with variants (primary/secondary/outline/ghost) + sizes
│   │   │   ├── Breadcrumbs.tsx     # Accessible breadcrumb navigation
│   │   │   └── Progress.tsx        # Animated progress bar
│   │   │
│   │   └── wizard/                  # Wizard step components
│   │       ├── StepIndicator.tsx   # Visual step progress with line + circles
│   │       ├── UploadTemplate.tsx  # Step 1: Drag-and-drop image upload
│   │       ├── UploadCSV.tsx       # Step 2: CSV upload + data preview table
│   │       ├── AdjustPreview.tsx   # Step 3: Visual canvas editor (toolbar + sidebar + properties)
│   │       ├── DraggableField.tsx  # Draggable text field overlay for the canvas
│   │       └── GenerationView.tsx  # Step 4: Batch generation + progress + download/email
│   │
│   ├── services/                    # Business logic / data processing layer
│   │   ├── templateService.ts      # Load image file → Base64 + dimensions validation
│   │   ├── csvService.ts           # Parse CSV via PapaParse with validation (max 400 rows)
│   │   ├── certificateService/
│   │   │   └── renderSingle.ts     # Generate one PDF certificate using pdf-lib
│   │   ├── emailService.ts         # Email payload type + simulated send (mock)
│   │   └── zipService.ts           # Bundle files into ZIP archive via JSZip
│   │
│   ├── store/
│   │   └── useAppStore.ts          # Zustand store (state + actions + localStorage persist)
│   │
│   ├── types/                       # TypeScript type definitions
│   │   ├── field.ts                # Field interface (position, style, alignment)
│   │   ├── csv.ts                  # CSVRow type + ParsedCSV interface
│   │   └── template.ts            # TemplateDimensions + TemplateState
│   │
│   └── utils/
│       └── cn.ts                   # clsx + tailwind-merge utility
│
├── next.config.ts                   # Next.js config (React Compiler enabled)
├── tsconfig.json                    # TypeScript config (path aliases: @/* → ./src/*)
├── postcss.config.mjs              # PostCSS with Tailwind CSS 4 plugin
├── eslint.config.mjs               # ESLint configuration
├── package.json                     # Dependencies and scripts
└── .gitignore                       # Git ignore rules
```

---

## 🔧 Core Services (Detailed)

### `templateService.ts` — Template Loader

- Accepts image files (`image/jpeg`, `image/png`) via `FileReader.readAsDataURL()`
- Creates an `Image()` object to extract natural `width` and `height`
- Returns `{ base64, width, height }` for storage and rendering

### `csvService.ts` — CSV Parser

- Uses **PapaParse** for robust CSV parsing with `header: true` and `skipEmptyLines: true`
- Enforces a strict maximum of **400 rows**
- Validates presence of headers and non-empty data
- Returns `{ headers, data, totalRows }` as a `ParsedCSV` object

### `certificateService/renderSingle.ts` — PDF Renderer

- Creates a new PDF document per certificate using **pdf-lib**
- Embeds the template image (auto-detects PNG vs JPG from data URI prefix)
- Sets page dimensions to match the original image size (1:1 mapping)
- Renders each text field at the correct position:
  - **Coordinate inversion**: Converts DOM-style top-left origin (Y↓) to PDF bottom-left origin (Y↑)
  - **Alignment**: Adjusts X position based on `left`, `center`, or `right` alignment
  - **Color parsing**: Converts hex color strings to `rgb()` values
- Uses `StandardFonts.Helvetica` (custom font embedding is planned)

### `emailService.ts` — Email Dispatcher (Mock)

- Defines the `EmailPayload` interface: `recipients`, `subject`, `body`, `template`, `fields`, `csvData`
- Currently returns a simulated success response
- Contains commented-out `fetch()` call structure ready for backend integration

### `zipService.ts` — ZIP Generator

- Uses **JSZip** to bundle an array of `{ name, content: Uint8Array }` files
- Generates a `Blob` for download

---

## 🧠 State Management

The global store is powered by **Zustand** with a `persist` middleware that saves to `localStorage`.

### Persisted State (survives page refresh)

| Key | Type | Description |
|-----|------|-------------|
| `template` | `string \| null` | Base64 data URI of the certificate template image |
| `templateDimensions` | `{ width, height } \| null` | Natural pixel dimensions of the template |
| `csvData` | `CSVRow[]` | Array of parsed CSV rows (key-value objects) |
| `csvHeaders` | `string[]` | Column header names from the CSV |
| `fields` | `Field[]` | Placed text fields with position, style, and column mapping |
| `currentStep` | `number` | Current wizard step (1–4) |

### Transient State (not persisted)

| Key | Type | Description |
|-----|------|-------------|
| `generatedBlobs` | `string[]` | Generated certificate data (cleared on reload) |
| `isGenerating` | `boolean` | Whether batch generation is in progress |
| `generationProgress` | `number` | Percentage of generation complete (0–100) |
| `errorState` | `string \| null` | Current error message, if any |

---

## 🚀 Getting Started

### Prerequisites

- **Node.js** ≥ 18.x
- **npm** ≥ 9.x (or yarn/pnpm/bun)

### Installation

```bash
# Clone the repository
git clone https://github.com/akshatthakur22/MailMyCertficate.git

# Navigate to the project directory
cd MailMyCertficate

# Install dependencies
npm install
```

### Development

```bash
# Start the development server
npm run dev
```

Open [http://localhost:3000](http://localhost:3000) in your browser.

### Production Build

```bash
# Create an optimized production build
npm run build

# Start the production server
npm start
```

### Linting

```bash
# Run ESLint
npm run lint
```

---

## 📧 Email Feature (Detailed Status)

The email workflow is accessible from `/email` and consists of three states:

1. **Authentication Gate** — A login form requiring email + password (currently mock-validated)
2. **Email Composer** — Subject and body editor with:
   - Dynamic variable support (`{{ColumnName}}`) auto-populated from CSV headers
   - Real-time recipient count display
   - Clean, distraction-free compose interface
3. **Success State** — Confirmation screen showing the number of emails sent

**What's needed to make it production-ready:**

- [ ] A backend API route (e.g., `/api/send-email`) using Next.js Route Handlers
- [ ] An email provider integration (Resend, SendGrid, Nodemailer, AWS SES)
- [ ] Real authentication (NextAuth.js, Clerk, or custom JWT)
- [ ] Per-recipient certificate generation on the backend (or pass pre-generated PDFs)
- [ ] Rate limiting & queue management for large batches

---

## 🗺 Roadmap & What's Left

### Phase 1 — Core Polish (Next)
- [ ] Custom font embedding in PDFs (Inter, Roboto, etc.)
- [ ] Single certificate preview before batch generation
- [ ] Personalized file naming (`certificate_John_Doe.pdf`)
- [ ] Undo/redo for field placement in the editor
- [ ] Alignment guides / snap-to-grid in the visual editor

### Phase 2 — Backend & Email
- [ ] Next.js API routes for email sending
- [ ] Email provider integration (Resend/SendGrid)
- [ ] Real authentication system
- [ ] Job queuing for large-batch email sending
- [ ] Email template previews

### Phase 3 — Advanced Features
- [ ] PDF template support (accept PDF as input, not just images)
- [ ] Multi-page certificate support
- [ ] Certificate verification system (QR codes, unique IDs)
- [ ] Analytics dashboard (open rates, download counts)
- [ ] Dark mode theme
- [ ] Internationalization (i18n)

### Phase 4 — Quality & Scale
- [ ] Unit tests (Vitest / Jest)
- [ ] E2E tests (Playwright)
- [ ] React Error Boundaries
- [ ] Web Worker support for PDF generation (off main thread)
- [ ] PWA support for offline usage
- [ ] Accessibility audit (WCAG 2.1)

---

## 🤝 Contributing

Contributions are welcome! Here's how to get started:

1. **Fork** the repository
2. Create a **feature branch** (`git checkout -b feature/amazing-feature`)
3. **Commit** your changes (`git commit -m 'Add amazing feature'`)
4. **Push** to the branch (`git push origin feature/amazing-feature`)
5. Open a **Pull Request**

### Good First Issues

If you're new to the project, here are some beginner-friendly tasks:

- 🎨 Add dark mode support (CSS variables are already scaffolded)
- 🔤 Implement custom font embedding in `renderSingle.ts`
- 🧪 Add unit tests for `csvService.ts` and `templateService.ts`
- 📝 Personalize certificate file names using CSV data
- 🖼️ Add a single-certificate preview feature

---

## 📄 License

This project is licensed under the **MIT License** — see the [LICENSE](LICENSE) file for details.

---

## 🙏 Acknowledgements

- [pdf-lib](https://pdf-lib.js.org/) — Pure JavaScript PDF generation
- [PapaParse](https://www.papaparse.com/) — Powerful CSV parser
- [JSZip](https://stuk.github.io/jszip/) — Client-side ZIP file creation
- [Zustand](https://github.com/pmndrs/zustand) — Minimal, flexible state management
- [Lucide Icons](https://lucide.dev/) — Beautiful open-source icon set
- [Next.js](https://nextjs.org/) — The React framework for production

---

<p align="center">
  Built with ❤ by <a href="https://github.com/akshatthakur22">Akshat Thakur</a>
</p>
