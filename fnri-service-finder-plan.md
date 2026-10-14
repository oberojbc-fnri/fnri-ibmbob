# Citizen Charter Service Finder — Full Platform Plan

## Top-Level Overview

This plan covers **two phases** of the platform:

**Phase A — FNRI Service Finder MVP**
A mobile-first web app built with Ionic + Angular that helps citizens find the right FNRI service by
describing their need in plain language. Deployed to GitHub Pages as a static Angular build. No backend
required — search runs entirely in the browser using Fuse.js over a local `services.json` data file.

**Phase B — Multi-Agency PDF Onboarding**
Extends the platform so that any Philippine government agency can upload their Citizen Charter PDF
through a simple web page, have watsonx.ai extract all services automatically, review and approve the
result, and go live — without any technical knowledge or developer involvement.

All Philippine Citizen Charters follow the same ARTA-mandated table structure (Republic Act 11032),
which means one AI extraction prompt works for all agencies.

**Three entry points** serve different citizen types (both phases):
1. **Instant Search** — free-text, results appear as they type
2. **Browse by Category** — visual category cards per agency using Ionic cards and grid
3. **Guided Wizard** — 3-question quiz using Ionic slides/stepper for citizens who do not know what they need

**Chatbot is a non-goal for MVP.** The architecture keeps a clean data layer so it can be added later.

---

## Current Status — October 2026

*Assessed against live codebase in `fnri-charter-finder/`. Last updated after Bob-a-thon development sprint.*

| Sub-Task | Title | Status |
|---|---|---|
| ST-1 | Project Scaffold | ✅ Complete |
| ST-2 | Services Data File | ✅ Complete |
| ST-3 | Core Layout & Navigation Shell | ✅ Complete |
| ST-4 | Instant Search Page | ✅ Complete |
| ST-5 | Browse by Category Page | ✅ Complete |
| ST-6 | Guided Wizard Page | ✅ Complete |
| ST-7 | Polish, Accessibility & Mobile QA | ⚠️ In progress |
| ST-8 | GitHub Pages Deployment | ⚠️ Pending deploy |
| ST-9 | White-Label Agency Config | ✅ Complete |
| ST-10 | Multi-Agency Landing Page | ⚠️ Gaps present |
| ST-11 | watsonx.ai PDF Extraction Engine | ❓ Needs verification |
| ST-12 | Agency PDF Upload and Review UI | ✅ UI complete |

**Overall: 9 of 12 sub-tasks fully complete. 102 services live across FNRI (38), PNRI (52), SEI (12).**

### Open Items (priority order)

1. **[CRITICAL] ST-10 — Per-agency routing not wired.** `goToAgency()` always navigates to FNRI's Search page. `DataService` and `SearchService` load only FNRI root data. PNRI and SEI are invisible to the tabbed pages.
2. **[CRITICAL] ST-10 — DataService/SearchService must be agency-aware.** Pass `agencyId` via route params so tabs load the correct agency's `services.json`, `categories.json`, and `wizard.json`.
3. **[HIGH] ST-11 — Verify backend server.** Confirm `server/index.js`, `extractServices.js`, `normalizeServices.js` exist and run. Upload flow is blocked until the backend is confirmed live.
4. **[HIGH] ST-8 — Run GitHub Pages deployment.** Build is clean. Run `npm run deploy` and confirm the public URL is live.
5. **[MEDIUM] ST-7 — Bundle size 1.06 MB (57 kB over 1 MB budget).** Trim with lazy loading and deferred Material imports.
6. **[MEDIUM] ST-7 — WCAG AA contrast check, favicon, hardware back button** not yet done.

### Significant deviations from original plan

- **UI framework:** Switched from pure Ionic to **Ionic (mobile) + Angular Material (desktop)**. Desktop uses a Material sidenav shell rendered by `AppComponent` via `BreakpointObserver`; mobile uses `ion-tabs` with bottom tab bar.
- **Routing architecture:** Desktop pages served via top-level `/search`, `/browse`, `/wizard` routes (bypasses `TabsPage`). Mobile uses `/tabs/search` etc. through `ion-router-outlet`.
- **No shared components folder:** `ServiceCard`, `ServiceDetail`, `CategoryCard`, `WizardStep` were implemented inline in each page rather than as separate `components/` — functional but not reusable across agencies.
- **App name:** Rebranded from "FNRI Service Finder" to **"CitizenCharter PH — Service Finder"** to reflect the multi-agency generic platform intent.

---

## Decisions & Constraints

- **Framework:** Ionic 7 + Angular 17 (standalone components)
- **UI Components:** Ionic component library — IonCard, IonSearchbar, IonTabs, IonModal, IonSlides
- **Styling:** Ionic CSS variables + SCSS — no Tailwind; Ionic handles responsive layout natively
- **Icons:** Ionicons (built into Ionic) — replaces Lucide React
- **Search:** Fuse.js (client-side, no backend required for Phase A)
- **Language:** English only
- **Deployment:** GitHub Pages (Angular static output via `ng build --base-href`)
- **Data:** `services.json` per agency — merged at runtime for multi-agency search
- **AI Extraction:** watsonx.ai (IBM) — fits hackathon context, same prompt works for all ARTA-format PDFs
- **Phase A:** No backend, no auth, no database
- **Phase B:** Lightweight Node.js/Express backend + watsonx.ai API for PDF extraction

---

## Reference PDFs Available

Three agency Citizen Charters are already available in `reference/` for testing the extraction pipeline:

| Agency | File | Services | Complexity |
|---|---|---|---|
| DOST-FNRI | `DOST-FNRI_Citizen_s_Charter_2026_1st_edition.pdf` | 38 | Medium |
| DOST-PNRI | `PNRI_Citizens-Charter_2025-1.pdf` | 52 | High (tiered fees) |
| DOST-SEI | `sei-pdf-citizens_charter-2025_First_Edition.pdf` | 12 | Low |

---

## Implementation Clusters

The 12 sub-tasks are grouped into 4 functional clusters. Each cluster is independently deliverable and testable.

### Cluster 1 — Foundation (ST-1, ST-2) · Phase A · ✅ Complete
Project scaffold and service data. Every other cluster depends on this completing first.
- Ionic + Angular CLI project bootstrap, GitHub Pages deploy config
- `services.json` — all 38 FNRI services in plain language with keywords and wizardTags
- `categories.json` — 5 category definitions
- `wizard.json` — 3 wizard questions and answer option values

**Actual state:** Both sub-tasks fully delivered. 102 services exist across FNRI (38), PNRI (52), SEI (12) in `src/app/data/agencies/`.

### Cluster 2 — Citizen-Facing UI (ST-3 to ST-7) · Phase A · ⚠️ Mostly Complete
All pages and components that citizens interact with.
- **App Shell** — Material sidenav (desktop ≥960px) + Ionic tab bar (mobile) via `BreakpointObserver` in `AppComponent`
- **Instant Search** — Fuse.js + Material form field + service cards + Material dialog detail
- **Browse by Category** — Material list + card grid → filtered service list
- **Guided Wizard** — Sequential question cards → WizardResults
- **Polish + QA** — Toolbar sticky fix applied; scrolling fixed; tab bar links corrected. Remaining: WCAG AA audit, 48px touch-target check, bundle size under budget

**Actual state:** ST-3 through ST-6 fully delivered. ST-7 partially done — mobile toolbar, scrolling, and routing bugs resolved; formal accessibility and bundle audit still outstanding.

### Cluster 3 — Multi-Agency Platform (ST-8 to ST-10) · Phase A → B · ⚠️ Partially Complete
Deploy the FNRI instance and make the codebase agency-agnostic for multi-agency use.
- GitHub Pages deployment of Angular build
- `agency.config.json` white-label config — agency name, Ionic CSS color variables, logo
- Multi-agency landing page — IonGrid of agency cards + cross-agency IonSearchbar

**Actual state:** ST-9 (white-label config) complete. ST-10 (landing page) built with cross-agency Fuse.js search working, but agency card tap always routes to FNRI — per-agency context not passed through. ST-8 (deployment): build is clean and deploy script exists; live GitHub Pages URL not yet confirmed.

**Known gaps (Cluster 3):**
1. `goToAgency()` in `landing.page.ts` always navigates to `/tabs/search` — must pass `agencyId` context
2. `DataService` and `SearchService` load only FNRI root data — tabbed pages (Search, Browse, Wizard) do not serve PNRI or SEI yet
3. GitHub Pages deployment not run — public URL unconfirmed

### Cluster 4 — AI Onboarding Engine (ST-11, ST-12) · Phase B · ⚠️ UI Done / Backend Unverified
Backend extraction pipeline and self-service upload UI for agency staff.
- Node.js/Express `POST /api/extract` — pdf-parse + watsonx.ai structured extraction
- Angular Upload page — file drag-and-drop + loading IonProgressBar
- Angular Review page — IonGrid editable table + Publish action

**Actual state:** ST-12 (Upload + Review UI) fully built with Ionic components — drag-and-drop, progress bar, inline editable review table, publish button. ST-11 (backend server): `server/` directory planned; existence and runnability of `server/index.js`, `extractServices.js`, `normalizeServices.js` needs verification before the upload flow can be tested end-to-end.

---

## Technology Stack

### Frontend

| Technology | Version | Purpose |
|---|---|---|
| Angular | 17 | Component framework — all pages, services, routing via Angular Router |
| Ionic Framework | 7 | Mobile-first UI component library — tabs, cards, modals, searchbar, slides |
| TypeScript | 5 | Type safety across all components, services, and data models |
| Ionic CSS Variables + SCSS | — | Theming and responsive layout — replaces Tailwind; Ionic handles breakpoints natively |
| Ionicons | 7 | Built-in icon set for Ionic — replaces Lucide React |
| Fuse.js | 7 | Client-side fuzzy search — instant results, typo tolerance, no server required |
| Angular Router | 17 | Page-level routing (`/search`, `/browse`, `/wizard`, `/upload`, `/review`) |
| angular-cli-ghpages | latest | Deploys `dist/` to `gh-pages` branch: `ng deploy --base-href=/fnri-ibmbob/` |

### Backend (Phase B only)

| Technology | Version | Purpose |
|---|---|---|
| Node.js | 20 LTS | Server runtime — hosts the Express API for PDF upload and extraction |
| Express | 4 | Lightweight HTTP framework — `POST /api/extract`, `POST /api/publish` routes |
| Multer | 1 | Multipart file upload middleware — receives PDF from the Angular Upload page |
| pdf-parse | 1 | Extracts plain text from uploaded PDF — text passed to watsonx.ai |
| dotenv | 16 | Loads `.env` variables (API keys) — never hardcoded |

### AI & IBM Platform

| Technology | Detail | Purpose |
|---|---|---|
| IBM watsonx.ai | Inference API | LLM inference — reads charter PDF text, extracts structured services JSON |
| IBM Granite / Llama 3 | ibm/granite-13b-instruct-v2 or meta-llama/llama-3-1-70b-instruct | Underlying model — selected based on hackathon environment availability |
| @ibm-cloud/watsonx-ai | npm SDK | Official IBM SDK — authentication, API calls, response parsing in Node.js |

### Infrastructure & Deployment

| Layer | Tool | Detail |
|---|---|---|
| Source Control | GitHub | `https://github.com/oberojbc-fnri/fnri-ibmbob` |
| Frontend Hosting | GitHub Pages | `https://oberojbc-fnri.github.io/fnri-ibmbob/` — free, zero cost |
| Backend Hosting | Render / Railway | Free-tier Node.js hosting for Phase B API (PDF extraction endpoint) |
| Secrets | `.env` + host env vars | `WATSONX_API_KEY`, `WATSONX_PROJECT_ID`, `WATSONX_URL` — never in code |

---

## Core Data Schema

### services.json — per service entry
```json
{
  "id": "number",
  "name": "string",              // Official charter name
  "plainName": "string",         // Citizen-friendly rewrite
  "description": "string",       // One-sentence plain description
  "category": "string",          // "Laboratory"|"Training"|"Information"|"Surveys"|"Sensory"
  "keywords": "string[]",        // Search synonyms + Filipino terms
  "office": "string",
  "processingTime": "string",    // Plain language, e.g. "About 3 weeks"
  "fees": "string",              // "Free" | "PHP 1,500" | "See schedule"
  "requirements": "string[]",
  "whoMayAvail": "string",
  "wizardTags": "string[]"       // Maps to wizard Q1/Q2/Q3 answer values
}
```

### agency.config.json — per agency branding
```json
{
  "agencyName": "string",
  "agencyAbbreviation": "string",
  "tagline": "string",
  "primaryColor": "string",      // CSS hex — applied to --ion-color-primary
  "secondaryColor": "string",    // CSS hex — applied to --ion-color-secondary
  "logoUrl": "string",
  "contactEmail": "string",
  "contactPhone": "string",
  "officeAddress": "string",
  "websiteUrl": "string"
}
```

### Ionic Color Variable Mapping
Agency `primaryColor` and `secondaryColor` from `agency.config.json` are applied at runtime
by setting `--ion-color-primary` and `--ion-color-secondary` on `document.documentElement`
in the Angular `AppComponent.ngOnInit()`. This drives all Ionic button, tab, and chip colors
without any SCSS override.

---

## API Endpoints (Phase B)

| Method | Endpoint | Description |
|---|---|---|
| POST | `/api/extract` | Upload PDF → returns services JSON array via watsonx.ai |
| POST | `/api/publish` | Save approved services.json + trigger Angular rebuild for the agency |
| GET | `/api/agencies` | Returns list of all onboarded agencies and their metadata |

---

## Sub-Tasks

---

### Sub-Task 1 — Project Scaffold

**Status:** [x] complete

**Intent**
Bootstrap the Ionic + Angular project structure and configure GitHub Pages deployment so every
subsequent sub-task builds on a working foundation.

**Expected Outcomes**
- Running `ng serve` renders a blank Ionic app on localhost
- Running `ng build` produces a `dist/` folder
- Ionic components render correctly with default theme
- GitHub Pages deploy config is in place (`angular-cli-ghpages` installed, base-href set)
- Angular Router is configured with placeholder routes

**Todo List**
1. Run `npm install -g @ionic/cli` if not already installed
2. Run `ionic start fnri-charter-finder tabs --type=angular --capacitor=false` inside the workspace root
3. Remove Ionic starter boilerplate tabs — replace with 3 tabs: Search, Browse, Wizard
4. Install Fuse.js: `npm install fuse.js`
5. Install angular-cli-ghpages: `npm install -D angular-cli-ghpages`
6. Set `outputPath` in `angular.json` to `dist/fnri-ibmbob`
7. Add deploy script to `package.json`: `"deploy": "ng build --base-href /fnri-ibmbob/ && npx angular-cli-ghpages --dir=dist/fnri-ibmbob"`
8. Configure Angular Router in `app.routes.ts` with routes: `/search`, `/browse`, `/wizard`, `/upload`, `/review`, `/` (landing)
9. Verify `ng serve` runs without errors and Ionic tabs render

**Relevant Context**
- Repo already exists at `https://github.com/oberojbc-fnri/fnri-ibmbob`
- Ionic 7 with Angular standalone components — use `standalone: true` in all `@Component` decorators
- Workspace root: `c:\Users\oberojbc.fnri\Desktop\fnri-ibm`

---

### Sub-Task 2 — Services Data File

**Status:** [x] complete

**Intent**
Create the single source-of-truth data file that powers all three entry points. Every service from
the FNRI Citizen Charter 2026 is encoded in a structured, searchable format. Plain language rewrites
replace charter jargon so search results are meaningful to ordinary citizens.

**Expected Outcomes**
- `src/app/data/services.json` exists with all 38 FNRI services from the charter
- Each entry has consistent fields: `id`, `name`, `plainName`, `description`, `category`, `keywords`,
  `office`, `processingTime`, `fees`, `requirements`, `whoMayAvail`, `wizardTags`
- `wizardTags` maps each service to wizard answer combinations (citizen type + intent + mode)
- Categories used: `"Laboratory"`, `"Training"`, `"Information"`, `"Surveys"`, `"Sensory"`
- An Angular `DataService` injectable wraps imports and exposes typed service list

**Todo List**
1. Create `src/app/data/services.json`
2. Encode all 8 laboratory services (IDs 1–8) from the charter
3. Encode all 19 training services (IDs 9–27) from the charter
4. Encode all 4 information resource services (IDs 28–31) from the charter
5. Encode all 2 resource speaker services (IDs 32–33) from the charter
6. Encode all 4 nutrition survey services (IDs 34–37) from the charter
7. Encode the sensory evaluation service (ID 38) from the charter
8. For each service, write a `plainName` and `description` in plain English
9. For each service, populate `keywords` array with synonyms and common search terms
10. Assign `wizardTags` arrays mapping to wizard persona + intent combinations
11. Create `src/app/data/categories.json` with the 5 category definitions (ionicon name, label, color)
12. Create `src/app/data/wizard.json` with 3 questions and answer option values
13. Create `src/app/services/data.service.ts` — `@Injectable({providedIn:'root'})`, loads and exposes typed arrays

**Relevant Context**
- Full service list extracted from `reference/DOST-FNRI_Citizen_s_Charter_2026_1st_edition.pdf`
- Plain language principle: replace "Analytical Services Division" with "our testing lab",
  "15 WD" with "about 3 weeks", "duly accomplished form" with "filled-out form"
- Angular services are the standard way to share data between components — use `DataService` throughout

---

### Sub-Task 3 — Core Layout and Navigation Shell

**Status:** [x] complete

**Intent**
Build the persistent Ionic app shell — IonHeader, IonTabs, and IonToolbar — that all pages live
inside. Establishes the visual identity and mobile-first layout baseline using Ionic CSS variables.

**Expected Outcomes**
- App renders an IonHeader with FNRI name and tagline
- IonTabs at the bottom switch between Search, Browse, and Wizard pages
- Active tab is visually indicated with Ionic's default active state
- Layout is mobile-first: single column on 390px, readable on desktop
- Color scheme uses FNRI brand colors applied via `--ion-color-primary` and `--ion-color-secondary`
- All tap targets meet Ionic's default 44px minimum

**Todo List**
1. Update `src/app/app.component.ts` — apply agency `primaryColor` to `--ion-color-primary` via `document.documentElement.style.setProperty` in `ngOnInit`
2. Create `src/app/tabs/tabs.page.ts` — IonTabs with 3 tab buttons: Search (search icon), Browse (grid icon), Wizard (help-circle icon) using Ionicons
3. Create placeholder page components: `search/search.page.ts`, `browse/browse.page.ts`, `wizard/wizard.page.ts`
4. Each page uses `IonHeader > IonToolbar > IonTitle` pattern
5. Create `src/app/services/agency-config.service.ts` — loads and exposes `agency.config.json`
6. Apply Inter font via `src/index.html` Google Fonts link
7. Verify layout on 390px and desktop in browser devtools

**Relevant Context**
- Ionic 7 tabs use `<ion-tabs>` with `<ion-tab-bar>` and `<ion-tab-button>` in the tabs page template
- `--ion-color-primary-rgb`, `--ion-color-primary-contrast` etc. must also be set when overriding Ionic color variables
- Angular Router handles tab navigation automatically — each tab maps to a child route

---

### Sub-Task 4 — Instant Search Page

**Status:** [x] complete

**Intent**
Implement the primary entry point: an IonSearchbar where citizens type their need in plain language
and see matching services appear instantly as they type, with the best match ranked first.

**Expected Outcomes**
- Typing in IonSearchbar shows results within 300ms (debounced)
- Results show a ranked list of service cards (top 5 max)
- Empty state shows a friendly prompt and example searches
- No-results state shows a helpful message and suggests Browse or Wizard
- Each result card shows: plain name, one-line description, category badge, processing time, fee chip
- Tapping a card opens a full IonModal with service details

**Todo List**
1. Create `src/app/services/search.service.ts` — wraps Fuse.js, accepts query string, returns ranked `Service[]`
2. Configure Fuse.js options: search on `plainName`, `description`, `keywords`; threshold 0.4
3. Update `search/search.page.ts` — bind `(ionInput)` on IonSearchbar with 300ms debounce via `debounceTime(300)` RxJS operator
4. Create `src/app/components/service-card/service-card.component.ts` — IonCard with IonBadge for category, IonChip for processing time and fee (shared across all pages)
5. Create `src/app/components/service-detail/service-detail.component.ts` — IonModal content: full description, office, time, fees, requirements, IonButton CTAs (Email, Phone, Visit)
6. Implement empty state: Ionic IonIcon illustration + "Try searching for 'food testing' or 'nutrition training'"
7. Implement no-results state with IonButton links to Browse and Wizard tabs
8. Open `ServiceDetailComponent` as an Ionic inline modal using `modalController.create()`

**Relevant Context**
- Use `debounceTime(300)` from `rxjs/operators` on a `Subject<string>` to debounce IonSearchbar input
- Ionic `ModalController` is the standard way to present detail sheets — inject in the page component
- `ServiceCardComponent` and `ServiceDetailComponent` are standalone components — import directly in pages that use them

---

### Sub-Task 5 — Browse by Category Page

**Status:** [x] complete

**Intent**
Provide a visual, zero-typing path using Ionic's IonGrid and IonCard for citizens who prefer to
explore services by type rather than searching.

**Expected Outcomes**
- Browse page shows 5 category cards in a 2-column IonGrid on mobile, 3-column on desktop
- Each card has an Ionicon, category name, and count of services
- Tapping a category shows the filtered list of services in that category
- Back navigation (IonBackButton) returns to the category grid
- Filtered list reuses `ServiceCardComponent` from Sub-Task 4

**Todo List**
1. Update `browse/browse.page.ts` — local `selectedCategory` signal/property (null = show grid, string = show list)
2. Create `src/app/components/category-card/category-card.component.ts` — IonCard with IonIcon, category name, service count, colored IonBadge
3. Derive service counts from `DataService` grouped by `category` field
4. On category selection, filter services and render `ServiceCardComponent` list inside an IonList
5. Add IonBackButton in IonToolbar when a category is selected to return to grid
6. Reuse `ServiceDetailComponent` modal from Sub-Task 4
7. Category Ionicon mapping: Laboratory=flask, Training=school, Information=document-text, Surveys=bar-chart, Sensory=restaurant
8. Category color mapping: Laboratory=blue, Training=green, Information=amber, Surveys=purple, Sensory=orange — applied as IonBadge color

**Relevant Context**
- Ionic responsive grid: `<ion-col size="6" size-md="4">` gives 2-col mobile, 3-col on medium screens
- `DataService` already loaded in Sub-Task 2 — inject and call `getServices()` filtered by category

---

### Sub-Task 6 — Guided Wizard Page

**Status:** [x] complete

**Intent**
Serve citizens who do not know what they need by walking them through 3 focused questions using
Ionic's step-by-step UI pattern and returning a personalized set of matching services.

**Expected Outcomes**
- Wizard shows one question at a time with large, tappable IonButton choices in a 2-column IonGrid
- An IonProgressBar shows progress through the 3 steps
- IonBackButton allows changing a previous answer
- Step 3 completion transitions to a results view with matched services (using `ServiceCardComponent`)
- Results are filtered by `wizardTags` matching all 3 selected answer values
- If fewer than 2 results match, falls back to all services in the most relevant category

**Todo List**
1. Update `wizard/wizard.page.ts` — `step` property (1–3), `answers` array of 3 strings
2. Create `src/app/components/wizard-step/wizard-step.component.ts` — IonCard with question text + IonGrid of IonButton answer options
3. Create `src/app/components/wizard-results/wizard-results.component.ts` — matched services IonList + "Start over" IonButton
4. Add IonProgressBar at top of wizard page: `[value]="step / 3"`
5. Implement matching logic: filter `DataService.getServices()` where `wizardTags` includes all 3 selected values
6. Implement fallback: if filtered results < 2, show all services with highest tag overlap
7. Animate step transitions using Ionic's built-in `animation` utility or Angular `@trigger` with fade + slide
8. "Start over" resets `step` to 1 and clears `answers`

**Relevant Context**
- `wizardTags` on each service must align with answer values in `wizard.json` (defined in Sub-Task 2)
- Example: service tagged `["food-business", "test-product", "any"]` matches Q1=food-business, Q2=test-product, Q3=anything
- Ionic `IonProgressBar` value range is 0–1; divide step by 3

---

### Sub-Task 7 — Polish, Accessibility, and Mobile QA

**Status:** [~] in progress

**Intent**
Ensure the app meets the mobile-first UX standard: readable on small screens, accessible to users
with disabilities, fast on slow connections, and visually cohesive.

**Expected Outcomes**
- All interactive elements meet Ionic's default 44px minimum touch targets
- Color contrast passes WCAG AA (check primary green on white)
- Ionic's built-in ARIA roles are verified on IonModal, IonButton, and IonSearchbar
- App loads in under 3 seconds on simulated slow 4G (Chrome devtools)
- No horizontal scroll on 390px viewport
- IonModal closes on backdrop dismiss and hardware back button
- Empty/loading IonSpinner states present on all three pages

**Todo List**
1. ✅ Verify all IonButtons and IonCards have adequate touch target size on 390px
2. [ ] Check `--ion-color-primary` against white for WCAG AA 4.5:1 contrast ratio
3. ✅ Add `aria-label` to icon-only IonButtons
4. ✅ Confirm `IonModal` closes on `backdropDismiss: true` (Ionic default)
5. [ ] Handle Android hardware back button in IonModal via `modalController.getTop()` + dismiss
6. ✅ Test all three pages on 390px viewport in Chrome devtools — fix any overflow issues
7. ✅ Run `ng build --configuration production` — bundle is 1.06 MB (slightly over 1 MB budget — needs trimming)
8. ✅ Add `<meta name="description">` and `<title>CitizenCharter PH — Service Finder</title>` to `src/index.html`
9. [ ] Add favicon to `src/assets/`

**Actual outcomes:** Mobile toolbar sticky, scrolling, and routing bugs resolved. Build compiles clean. Bundle is 1.06 MB — 57 kB over the 1 MB budget. WCAG AA contrast, hardware back button, and favicon not yet done.

**Relevant Context**
- Ionic handles most accessibility defaults (ARIA roles, focus management in modals) — verify rather than reimplement
- Angular production build uses tree-shaking and lazy loading — enable lazy loading per route in `app.routes.ts`
- WCAG AA: 4.5:1 contrast for body text, 3:1 for large text

---

### Sub-Task 8 — GitHub Pages Deployment

**Status:** [~] pending deployment

**Intent**
Deploy the Angular + Ionic build to GitHub Pages so it is publicly accessible via a shareable URL
for the hackathon demo.

**Expected Outcomes**
- `npm run deploy` builds and publishes to the `gh-pages` branch
- App is live at `https://oberojbc-fnri.github.io/fnri-ibmbob/`
- All routes and assets load correctly — Angular Router configured with `HashLocationStrategy` for GitHub Pages compatibility
- README is updated with the live URL and description

**Todo List**
1. ✅ Configure `HashLocationStrategy` in `app-routing.module.ts`
2. ✅ Confirm deploy script in `package.json`
3. [ ] Run `npm run deploy`
4. [ ] In GitHub repo settings, confirm Pages source is set to the `gh-pages` branch
5. [ ] Visit `https://oberojbc-fnri.github.io/fnri-ibmbob/` and verify the app loads
6. [ ] Test all three entry points (Search, Browse, Wizard) on the live URL from a mobile device
7. [ ] Update `README.md` with live URL, description, and tech stack

**Actual outcomes:** HashLocationStrategy configured. Build is clean and deploy script exists. Live deployment not yet run — public URL unconfirmed.

**Relevant Context**
- Angular Router requires `HashLocationStrategy` on GitHub Pages because there is no server to handle path rewrites
- `angular-cli-ghpages` is the standard Angular deploy tool for GitHub Pages
- Repo: `https://github.com/oberojbc-fnri/fnri-ibmbob`

---

### Sub-Task 9 — White-Label Agency Config

**Status:** [x] complete

**Intent**
Refactor FNRI-specific hardcoded values into `agency.config.json` so any agency can deploy their own
Service Finder by swapping one config file and one `services.json`. No code changes needed.

**Expected Outcomes**
- No agency name, color, or logo is hardcoded in any Angular component
- A new agency deploys by editing only `agency.config.json` and `services.json`
- FNRI instance still renders identically to Sub-Task 8 deployment
- Config fields are documented with inline comments in a sample file

**Todo List**
1. Create `src/app/data/agency.config.json` with fields: `agencyName`, `agencyAbbreviation`, `tagline`, `primaryColor`, `secondaryColor`, `logoUrl`, `contactEmail`, `contactPhone`, `officeAddress`, `websiteUrl`
2. Update `AgencyConfigService` to load and return typed config
3. In `AppComponent.ngOnInit()`, apply `primaryColor` and `secondaryColor` to Ionic CSS variables: `--ion-color-primary`, `--ion-color-primary-rgb`, `--ion-color-primary-contrast`, `--ion-color-secondary`
4. Replace all hardcoded `"FNRI"` strings in templates with `agencyConfig.agencyName`
5. Replace hardcoded color values in SCSS with `var(--ion-color-primary)` references
6. Verify FNRI instance renders correctly with config-driven values
7. Add `README-AGENCY-SETUP.md` documenting the 2 files an agency needs to change and all config fields

**Relevant Context**
- Ionic requires setting RGB variants of color variables alongside the hex: `--ion-color-primary-rgb: 26, 122, 74`
- A helper function `hexToRgb(hex)` converts the config hex value to the RGB string Ionic needs
- `AgencyConfigService` was created in Sub-Task 3 — extend it here rather than create a new service

---

### Sub-Task 10 — Multi-Agency Landing Page

**Status:** [~] in progress — gaps present

**Intent**
Add a landing page that presents all onboarded agencies as Ionic cards so citizens can choose their
agency or search across all agencies at once. This is the entry point to the multi-agency platform.

**Expected Outcomes**
- Landing page (`/`) shows all onboarded agencies as IonCard items in an IonGrid
- Each agency card shows: agency name, abbreviation, logo, and service count
- Tapping an agency card navigates to that agency's Search page
- A cross-agency IonSearchbar searches services across all agencies at once
- Cross-agency results include an agency IonBadge on each ServiceCard
- Platform works with FNRI, PNRI, and SEI

**Todo List**
1. ✅ Restructure `src/app/data/` → `src/app/data/agencies/fnri/`, `pnri/`, `sei/` directories
2. ✅ Each agency directory contains: `services.json`, `categories.json`, `wizard.json`, `agency.config.json`
3. ✅ Create `src/app/data/agencies/index.ts` — exports merged services list with `agencyId` added to each service
4. ✅ Create `landing/landing.page.ts` — agency cards + cross-agency Fuse.js searchbar
5. [ ] Create per-agency routing so each agency card navigates to that agency's Search/Browse/Wizard
6. [ ] Pass `agencyId` context into tabs so `DataService` and `SearchService` load the correct agency's data
7. ✅ Add `agencyId` badge chip on cross-agency search result cards
8. ✅ Cross-agency search uses merged `ALL_AGENCY_SERVICES` from `agencies/index.ts`
9. [ ] Fix `goToAgency()` — currently always navigates to `/tabs/search` (FNRI only)

**Actual outcomes:** Data structure, index.ts, landing page, and cross-agency search all working. Critical gap: agency card tap always routes to FNRI. DataService/SearchService hardwired to FNRI root data/ folder — PNRI and SEI not reachable via tabs.

**Relevant Context**
- Angular Router lazy loading: each agency's pages load on demand to keep initial bundle small
- `agencies/index.ts` merges all agency `services.json` files at import time — no runtime fetch needed
- Landing page is a separate Ionic page (not a tab) — it sits above the tab structure in the router hierarchy

---

### Sub-Task 11 — watsonx.ai PDF Extraction Engine

**Status:** [?] needs verification

**Intent**
Build the AI extraction pipeline that reads a Citizen Charter PDF and returns a structured
`services.json` array. Uses watsonx.ai with a prompt engineered for the ARTA Citizen Charter format.

**Expected Outcomes**
- Node.js/Express `POST /api/extract` accepts a PDF and returns structured JSON
- watsonx.ai correctly extracts all services from FNRI, PNRI, and SEI charters
- Extracted JSON matches the `services.json` schema used by the Angular frontend
- Processing time, fees, requirements, and who-may-avail are all captured
- Handles all three complexity levels: simple (SEI), medium (FNRI), high/tiered fees (PNRI)

**Todo List**
1. [ ] Verify `server/` directory exists alongside `src/`
2. [ ] Verify `server/package.json` with required dependencies installed
3. [ ] Verify `server/index.js` — Express routes `POST /api/extract` and `POST /api/publish`
4. [ ] Verify `server/extractServices.js` — watsonx.ai prompt and API call
5. [ ] Verify watsonx.ai prompt handles ARTA-standard table format and tiered fee tables (PNRI)
6. [ ] Verify `server/normalizeServices.js` exists and normalizes output
7. [ ] Test extraction against all 3 reference PDFs in `reference/` — check output quality
8. [ ] Confirm `server/.env` exists with `WATSONX_API_KEY`, `WATSONX_PROJECT_ID`, `WATSONX_URL`

**Actual outcomes:** Server existence not confirmed from frontend codebase alone. Needs manual verification that `server/` is populated and runnable before the upload flow can be tested end-to-end.

**Relevant Context**
- All Philippine Citizen Charters follow ARTA RA 11032: Client Steps → Agency Action → Fees → Processing Time → Person Responsible
- `pdf-parse` extracts plain text from PDF — this text is the input to watsonx.ai
- watsonx.ai model: `ibm/granite-13b-instruct-v2` or `meta-llama/llama-3-1-70b-instruct`
- PNRI has 52 services with complex tiered fees — prompt must instruct AI to summarize, not reproduce tables
- `.env` variables: `WATSONX_API_KEY`, `WATSONX_PROJECT_ID`, `WATSONX_URL`

---

### Sub-Task 12 — Agency PDF Upload and Review UI

**Status:** [x] complete (UI) — blocked on ST-11 backend for end-to-end test

**Intent**
Build the self-service Angular + Ionic pages where agency staff (non-technical) upload their charter
PDF, review AI-extracted services inline, and publish — no developer needed.

**Expected Outcomes**
- `/upload` route shows a clean page: agency name IonInput + PDF drag-and-drop zone
- After upload, an IonProgressBar + spinner shows "Reading your charter..."
- `/review` route shows all extracted services in a scrollable IonGrid editable table
- Staff can tap any cell to edit it inline
- "Publish" saves the approved JSON and adds the agency to the platform
- New agency immediately appears on the landing page
- Works with FNRI, PNRI, and SEI reference PDFs without errors

**Todo List**
1. Create `upload/upload.page.ts` — IonInput for agency name + drag-and-drop zone using Angular `(dragover)`, `(drop)` events
2. On file drop/select, POST PDF to `server/api/extract` using Angular `HttpClient` and show IonProgressBar
3. On response, navigate to `/review` passing extracted services via Angular Router state
4. Create `review/review.page.ts` — IonGrid displaying services as rows with IonInput cells
5. Each row: editable name, processingTime, fees, category IonSelect, description
6. IonSelect category options: Laboratory, Training, Information, Surveys, Regulatory, Other — generic, not FNRI-specific
7. IonButton "Add Row" appends a blank service row; IonButton "Delete" removes the row
8. IonButton "Publish" — POSTs approved JSON to `server/api/publish`, shows success IonAlert with live URL
9. IonButton "Start over" — navigates back to `/upload` and clears state

**Relevant Context**
- Angular `HttpClient` with `HttpClientModule` handles the multipart form POST to the Express backend
- Router state transfer: `this.router.navigate(['/review'], { state: { services: extractedServices } })`
- The category IonSelect must use generic categories since this page serves all agencies — not FNRI-specific
- For the hackathon demo, "Publish" triggers `npm run build` on the server to rebuild and redeploy

---

## Architecture Summary

### Phase A — FNRI MVP (Sub-Tasks 1–8)

```
src/app/
  data/
    agencies/
      fnri/
        services.json         # All 38 FNRI services
        categories.json       # 5 FNRI category definitions with Ionicons
        wizard.json           # FNRI wizard questions
        agency.config.json    # FNRI branding, colors, contact info
      pnri/                   # Populated in Sub-Task 11
      sei/                    # Populated in Sub-Task 11
      index.ts                # Merges all agency services for cross-agency search
  services/
    data.service.ts           # Loads services.json, categories.json, wizard.json
    search.service.ts         # Fuse.js wrapper — returns ranked Service[]
    agency-config.service.ts  # Loads agency.config.json, applies Ionic CSS variables
  components/
    agency-card/              # IonCard — agency name, count, color (Sub-Task 10)
    category-card/            # IonCard + IonIcon — category grid item
    service-card/             # IonCard + IonBadge/IonChip — shared across all pages
    service-detail/           # IonModal content — full service detail
    wizard-step/              # IonCard — single wizard question + answer buttons
    wizard-results/           # IonList — matched services + start over
  pages/
    landing/                  # Agency grid + cross-agency search (Sub-Task 10)
    tabs/                     # IonTabs shell — Search, Browse, Wizard
    search/                   # IonSearchbar + instant results
    browse/                   # IonGrid category cards → filtered list
    wizard/                   # Step-by-step questions → results
    upload/                   # PDF drag-and-drop + progress (Sub-Task 12)
    review/                   # Editable services table + publish (Sub-Task 12)
  app.routes.ts               # Angular Router — all page routes + lazy loading
  app.component.ts            # Root — applies agency color variables on init
  app.config.ts               # Angular app config — HashLocationStrategy
```

### Phase B — Multi-Agency Backend (Sub-Tasks 9–12)

```
server/
  index.js                    # Express app, route definitions
  extractServices.js          # watsonx.ai PDF extraction prompt + API call
  normalizeServices.js        # Post-processing: time units, fee strings, IDs
  .env                        # WATSONX_API_KEY, WATSONX_PROJECT_ID, WATSONX_URL
  package.json
```

### Data Flow

```
Agency PDF Upload (Angular UploadPage)
       │
       ▼
  Angular HttpClient → POST /api/extract (Express + Multer)
       │
       ▼
  pdf-parse (plain text extraction)
       │
       ▼
  watsonx.ai (structured JSON extraction via prompt)
       │
       ▼
  normalizeServices.js (clean + validate + assign IDs)
       │
       ▼
  Angular ReviewPage (agency staff edits inline + approves)
       │
       ▼
  POST /api/publish → services.json written to src/app/data/agencies/<slug>/
       │
       ▼
  npm run deploy (ng build + angular-cli-ghpages)
       │
       ▼
  Agency live on LandingPage + full Service Finder
```
