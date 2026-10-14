# Citizen Charter Service Finder — Full Platform Plan

## Top-Level Overview

This plan covers **two phases** of the platform:

**Phase A — FNRI Service Finder MVP**
A mobile-first web app that helps citizens find the right FNRI service by describing their need in
plain language. Static React + Vite + Tailwind CSS site deployed on GitHub Pages. No backend required —
search runs entirely in the browser using Fuse.js over a local `services.json` data file.

**Phase B — Multi-Agency PDF Onboarding**
Extends the platform so that any Philippine government agency can upload their Citizen Charter PDF
through a simple web page, have watsonx.ai extract all services automatically, review and approve the
result, and go live — without any technical knowledge or developer involvement.

All Philippine Citizen Charters follow the same ARTA-mandated table structure (Republic Act 11032),
which means one AI extraction prompt works for all agencies.

**Three entry points** serve different citizen types (both phases):
1. **Instant Search** — free-text, results appear as they type
2. **Browse by Category** — visual category cards per agency
3. **Guided Wizard** — 3-question quiz for citizens who do not know what they need

**Chatbot is a non-goal for MVP.** The architecture keeps a clean data layer so it can be added later.

---

## Decisions & Constraints

- **Framework:** React + Vite
- **Styling:** Tailwind CSS
- **Search:** Fuse.js (client-side, no backend required for Phase A)
- **Language:** English only
- **Deployment:** GitHub Pages (Phase A static); Node.js backend required for Phase B upload tool
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

## Sub-Tasks

---

### Sub-Task 1 — Project Scaffold

**Status:** [ ] pending

**Intent**
Bootstrap the Vite + React + Tailwind project structure and configure GitHub Pages deployment so
every subsequent sub-task builds on a working foundation.

**Expected Outcomes**
- Running `npm run dev` renders a blank React app on localhost
- Running `npm run build` produces a `dist/` folder
- Tailwind classes work in components
- GitHub Pages deployment config is in place (`vite.config.ts` base path set, `gh-pages` script added)
- Lucide React icon library is installed

**Todo List**
1. Run `npm create vite@latest . -- --template react-ts` inside the workspace root
2. Install dependencies: `npm install`
3. Install Tailwind CSS: `npm install -D tailwindcss postcss autoprefixer` and run `npx tailwindcss init -p`
4. Configure `tailwind.config.js` content paths to include `./src/**/*.{ts,tsx}`
5. Add Tailwind directives to `src/index.css`
6. Install Fuse.js: `npm install fuse.js`
7. Install Lucide React: `npm install lucide-react`
8. Install gh-pages: `npm install -D gh-pages`
9. Set `base` in `vite.config.ts` to `/fnri-ibmbob/` (matches GitHub repo name)
10. Add `"predeploy": "npm run build"` and `"deploy": "gh-pages -d dist"` scripts to `package.json`
11. Delete Vite boilerplate from `src/App.tsx` — replace with a placeholder `<h1>FNRI Service Finder</h1>`
12. Verify `npm run dev` runs without errors

**Relevant Context**
- Repo already exists at `https://github.com/oberojbc-fnri/fnri-ibmbob`
- Workspace root: `c:\Users\oberojbc.fnri\Desktop\fnri-ibm`

---

### Sub-Task 2 — Services Data File

**Status:** [ ] pending

**Intent**
Create the single source-of-truth data file that powers all three entry points. Every service from
the FNRI Citizen Charter 2026 is encoded in a structured, searchable format. Plain language rewrites
replace charter jargon so search results are meaningful to ordinary citizens.

**Expected Outcomes**
- `src/data/services.json` exists with all ~35 services from the charter
- Each entry has consistent fields: `id`, `name`, `plainName`, `description`, `category`, `keywords`,
  `office`, `processingTime`, `fees`, `requirements`, `whoMayAvail`, `wizardTags`
- `wizardTags` maps each service to wizard answer combinations (citizen type + intent + mode)
- Categories used: `"Laboratory"`, `"Training"`, `"Information"`, `"Surveys"`, `"Sensory"`

**Todo List**
1. Create `src/data/services.json`
2. Encode all 8 laboratory services (IDs 1–8) from the charter
3. Encode all 19 training services (IDs 9–27) from the charter
4. Encode all 4 information resource services (IDs 28–31) from the charter
5. Encode all 2 resource speaker services (IDs 32–33) from the charter
6. Encode all 4 nutrition survey services (IDs 34–37) from the charter
7. Encode the sensory evaluation service (ID 38) from the charter
8. For each service, write a `plainName` (citizen-friendly) and `description` in plain English
9. For each service, populate `keywords` array with synonyms, common terms, and Filipino keywords
10. Assign `wizardTags` arrays mapping to wizard persona + intent combinations
11. Create `src/data/categories.json` with the 5 category definitions (icon name, label, description)

**Relevant Context**
- Full service list extracted from `reference/DOST-FNRI_Citizen_s_Charter_2026_1st_edition.pdf`
- Plain language principle: replace "Analytical Services Division" with "our testing lab",
  "15 WD" with "about 3 weeks", "duly accomplished form" with "filled-out form"
- `wizardTags` example: `["food-business", "test-product", "any"]` matches a food business owner
  who wants to test a product

---

### Sub-Task 3 — Core Layout and Navigation Shell

**Status:** [ ] pending

**Intent**
Build the persistent app shell — header, page container, and bottom/top navigation — that all
screens will live inside. Establishes the visual identity and mobile-first layout baseline.

**Expected Outcomes**
- App renders a header with the FNRI logo text and tagline
- A tab/nav bar allows switching between Search, Browse, and Wizard views
- Active tab is visually indicated
- Layout is mobile-first: single column on 390px, readable on desktop
- Color scheme uses FNRI brand colors (green: `#1a7a4a`, yellow: `#f5c518`, white background)
- All tap targets are minimum 48px height

**Todo List**
1. Create `src/components/Layout.tsx` — wraps all pages with header + nav
2. Create `src/components/Header.tsx` — FNRI logo text, tagline "Find the right FNRI service for you"
3. Create `src/components/BottomNav.tsx` — three tabs: Search, Browse, Wizard with Lucide icons
4. Set up React Router or simple state-based view switching in `App.tsx` (state is sufficient — no router needed for 3 views)
5. Create three placeholder page components: `src/pages/SearchPage.tsx`, `src/pages/BrowsePage.tsx`, `src/pages/WizardPage.tsx`
6. Wire navigation state in `App.tsx` to render the correct page
7. Apply global font (Inter via Google Fonts CDN in `index.html`) and base Tailwind config
8. Verify layout on mobile viewport (390px) and desktop in browser devtools

**Relevant Context**
- Keep navigation as local React state — no React Router needed for 3 views
- Bottom navigation is the mobile pattern; on desktop it can shift to a top tab bar using Tailwind breakpoints

---

### Sub-Task 4 — Instant Search Page

**Status:** [ ] pending

**Intent**
Implement the primary entry point: a search input where citizens type their need in plain language
and see matching services appear instantly as they type, with the best match ranked first.

**Expected Outcomes**
- Typing in the search box shows results within 300ms (debounced)
- Results show a ranked list of service cards (top 5 max)
- Empty state shows a friendly prompt and example searches
- No-results state shows a helpful message and suggests Browse or Wizard
- Each result card shows: plain name, one-line description, category badge, processing time, fee indicator
- Clicking a card opens a detail drawer/modal with full information

**Todo List**
1. Create `src/hooks/useSearch.ts` — wraps Fuse.js, accepts query string, returns ranked results
2. Configure Fuse.js options: search on `plainName`, `description`, `keywords` fields; threshold 0.4
3. Create `src/pages/SearchPage.tsx` with a controlled text input and 300ms debounce
4. Create `src/components/ServiceCard.tsx` — compact card for search results list
5. Create `src/components/ServiceDetail.tsx` — full detail panel (slide-up drawer on mobile)
6. `ServiceCard` displays: plain name, one-line description, category badge with color, processing time chip, fee chip (Free / With fee)
7. `ServiceDetail` displays: full description, office, processing time (plain language), fees breakdown, requirements list, who may avail, call-to-action buttons (Email, Phone, Visit)
8. Implement empty state: illustration placeholder + "Try searching for 'food testing' or 'nutrition training'"
9. Implement no-results state: "We couldn't find a match — try Browse or take the quiz"
10. Add smooth result list animation (Tailwind transition classes — no Framer Motion needed)

**Relevant Context**
- `useSearch.ts` should import services from `src/data/services.json`
- Fuse.js v7 API: `new Fuse(list, options)` then `fuse.search(query)` returns `{item, score}[]`
- Debounce can be a simple `useEffect` + `setTimeout` — no library needed
- ServiceDetail should be a bottom sheet on mobile (fixed bottom, slide up) and a centered modal on desktop

---

### Sub-Task 5 — Browse by Category Page

**Status:** [ ] pending

**Intent**
Provide a visual, zero-typing path for citizens who prefer to explore services by type rather than
searching. Category cards give an overview of what FNRI offers and lead to a filtered service list.

**Expected Outcomes**
- Browse page shows 5 category cards in a 2-column grid on mobile, 3-column on desktop
- Each card has an icon, category name, and count of services in that category
- Tapping a category shows the filtered list of services in that category
- Back navigation returns to the category grid
- Each service in the filtered list uses the same `ServiceCard` component from Sub-Task 4

**Todo List**
1. Create `src/pages/BrowsePage.tsx` with local state: `selectedCategory` (null = show grid, string = show filtered list)
2. Create `src/components/CategoryCard.tsx` — icon, name, service count, subtle background color per category
3. Derive service counts from `services.json` grouped by `category` field
4. On category selection, filter `services.json` and render `ServiceCard` list
5. Add a back button ("← All Categories") that resets `selectedCategory` to null
6. Reuse `ServiceDetail` component from Sub-Task 4 for detail view
7. Category color mapping: Laboratory=blue, Training=green, Information=yellow, Surveys=purple, Sensory=orange
8. Verify category card grid is readable and tappable on mobile viewport

**Relevant Context**
- Category definitions live in `src/data/categories.json` (Sub-Task 2)
- `ServiceCard` and `ServiceDetail` are already built in Sub-Task 4 — import and reuse directly
- No new search logic needed — just `services.filter(s => s.category === selectedCategory)`

---

### Sub-Task 6 — Guided Wizard Page

**Status:** [ ] pending

**Intent**
Serve citizens who do not know what they need by walking them through 3 focused questions and
returning a personalized set of matching services. This is the key UX differentiator.

**Expected Outcomes**
- Wizard shows one question at a time with large, tappable visual choice buttons
- A progress indicator shows "Step X of 3"
- Back button allows changing a previous answer
- Step 3 completion shows a results screen with matched services (using `ServiceCard`)
- Results are filtered by `wizardTags` matching all 3 answers
- If no exact match, falls back to category-level results with a soft message

**Todo List**
1. Define the 3 wizard questions and answer options in `src/data/wizard.json`:
   - Q1: "Who are you?" — Food business owner, Parent/caregiver, Researcher/student, Health worker, Laboratory staff
   - Q2: "What do you need?" — Test a food/water product, Get nutrition information, Attend a training, Request survey data, Speak with an expert
   - Q3: "How do you prefer to engage?" — Visit FNRI, Online/email, Either
2. Create `src/pages/WizardPage.tsx` with step state: `step` (1–3), `answers` (array of 3)
3. Create `src/components/WizardStep.tsx` — question text + answer button grid (2 columns)
4. Create `src/components/WizardResults.tsx` — matched services list + "Start over" button
5. Implement matching logic: filter services where `wizardTags` includes each of the 3 selected answer values
6. Implement fallback: if filtered results < 2, show all services in the most relevant category
7. Animate step transitions with Tailwind opacity + translate transitions
8. Add "Start over" button on results screen that resets `step` to 1 and clears `answers`

**Relevant Context**
- `wizardTags` on each service (defined in Sub-Task 2) must align exactly with answer values defined in `wizard.json`
- Example: service tagged `["food-business", "test-product", "any"]` matches Q1=food-business, Q2=test-product, Q3=anything
- `ServiceCard` and `ServiceDetail` are reused here — no new card component needed

---

### Sub-Task 7 — Polish, Accessibility, and Mobile QA

**Status:** [ ] pending

**Intent**
Ensure the app meets the mobile-first UX standard before deployment: readable on small screens,
accessible to users with disabilities, fast on slow connections, and visually cohesive.

**Expected Outcomes**
- All interactive elements have minimum 48px touch targets
- Color contrast passes WCAG AA (check green `#1a7a4a` on white)
- Focus states are visible for keyboard users
- App loads in under 3 seconds on a simulated slow 4G connection (Chrome devtools)
- No horizontal scroll on 390px viewport
- Service detail drawer closes on backdrop tap and on Escape key
- Empty/loading states are present on all three pages

**Todo List**
1. Audit all buttons and interactive elements for 48px minimum height — fix any that are smaller
2. Check color contrast of primary green and yellow against white using a contrast checker
3. Add `aria-label` to icon-only buttons (close, back)
4. Add `role="dialog"` and focus trap to `ServiceDetail` drawer/modal
5. Close `ServiceDetail` on backdrop click and on `Escape` key
6. Test all three pages on 390px viewport in Chrome devtools — fix any overflow issues
7. Run `npm run build` and check bundle size — if over 500KB, identify and remove unused imports
8. Add a `<meta name="description">` and `<title>FNRI Service Finder</title>` to `index.html`
9. Add FNRI favicon (use a simple emoji favicon `🥗` as placeholder if no asset available)

**Relevant Context**
- WCAG AA requires 4.5:1 contrast for normal text, 3:1 for large text
- Focus trap can be a simple `useEffect` that moves focus to the first focusable element in the drawer on open

---

### Sub-Task 8 — GitHub Pages Deployment

**Status:** [ ] pending

**Intent**
Deploy the built app to GitHub Pages so it is publicly accessible via a shareable URL for the
hackathon demo.

**Expected Outcomes**
- `npm run deploy` publishes the `dist/` folder to the `gh-pages` branch
- App is live at `https://oberojbc-fnri.github.io/fnri-ibmbob/`
- All routes and assets load correctly (no 404s on direct URL access)
- README is updated with the live URL and a one-paragraph description

**Todo List**
1. Confirm `vite.config.ts` base is set to `/fnri-ibmbob/`
2. Run `npm run build` — verify `dist/` is generated with no errors
3. Run `npm run deploy` — this runs gh-pages to push `dist/` to `gh-pages` branch
4. In the GitHub repo settings, confirm Pages source is set to the `gh-pages` branch
5. Visit `https://oberojbc-fnri.github.io/fnri-ibmbob/` and verify the app loads
6. Test all three entry points (Search, Browse, Wizard) on the live URL
7. Update `README.md` with: project name, live URL, one-paragraph description, tech stack list

**Relevant Context**
- Repo URL: `https://github.com/oberojbc-fnri/fnri-ibmbob`
- The `gh-pages` npm package handles branch creation and push automatically
- If assets 404, the `base` config in `vite.config.ts` is the most likely cause

---

---

### Sub-Task 9 — White-Label Agency Config

**Status:** [ ] pending

**Intent**
Refactor the FNRI-specific hardcoded values (agency name, brand colors, tagline, logo) into a
single `agency.config.json` file. This makes the entire codebase a reusable template — any agency
can deploy their own Service Finder by swapping one config file and one `services.json`.

**Expected Outcomes**
- No agency name, color, or logo is hardcoded anywhere in the React components
- A new agency can be deployed by editing only `src/data/agency.config.json` and `src/data/services.json`
- FNRI instance still looks and works identically to Sub-Task 8 deployment
- Config shape is documented with comments so non-developers can fill it in

**Todo List**
1. Create `src/data/agency.config.json` with fields: `agencyName`, `agencyAbbreviation`, `tagline`, `primaryColor`, `secondaryColor`, `logoUrl`, `contactEmail`, `contactPhone`, `officeAddress`, `websiteUrl`
2. Create `src/hooks/useAgencyConfig.ts` — a simple hook that imports and returns the config
3. Replace all hardcoded `"FNRI"` strings in `Header.tsx`, `index.html` title, and meta tags with config values
4. Replace hardcoded color values (`#1a7a4a`, `#f5c518`) in Tailwind config with CSS custom properties driven by the config
5. Verify FNRI instance still renders correctly with the config-driven values
6. Add a `README-AGENCY-SETUP.md` documenting the two files an agency needs to change

**Relevant Context**
- CSS custom properties set via `useEffect` on `document.documentElement` is the simplest way to apply dynamic Tailwind colors
- `agency.config.json` is the only file a non-developer needs to edit to rebrand the site
- This sub-task is a prerequisite for Sub-Task 10 (multi-agency landing) and Sub-Task 11 (PDF upload)

---

### Sub-Task 10 — Multi-Agency Landing Page

**Status:** [ ] pending

**Intent**
Add a landing page that presents all onboarded agencies as cards so citizens can choose their agency
before entering the Service Finder — or search across all agencies at once. This is the entry point
to the multi-agency platform.

**Expected Outcomes**
- A landing page at the app root shows all onboarded agencies as visual cards
- Each agency card shows: agency name, abbreviation, logo/icon, and service count
- Clicking an agency card loads that agency's Service Finder (Search + Browse + Wizard)
- A cross-agency search bar on the landing page searches services across all agencies at once
- Cross-agency results show an agency badge on each service card
- The platform works with the 3 available agencies: FNRI, PNRI, SEI

**Todo List**
1. Create `src/data/agencies/` directory — move FNRI `services.json`, `categories.json`, `wizard.json`, and `agency.config.json` into `src/data/agencies/fnri/`
2. Create corresponding `src/data/agencies/pnri/` and `src/data/agencies/sei/` directories with their config and services data (populated in Sub-Task 11)
3. Create `src/data/agencies/index.ts` — exports a merged list of all agencies and their services
4. Create `src/pages/LandingPage.tsx` — agency grid with cross-agency search bar
5. Create `src/components/AgencyCard.tsx` — agency name, abbreviation, service count, color accent
6. Update `App.tsx` routing state to support: `landing` → `agency/:id` view transitions
7. Add agency badge (abbreviation chip) to `ServiceCard.tsx` for cross-agency search results
8. Landing page cross-agency search reuses `useSearch.ts` hook with the merged services list
9. Verify back navigation from agency Service Finder returns to the landing page

**Relevant Context**
- `src/data/agencies/index.ts` merges all agency `services.json` files, adding an `agencyId` field to each service
- Agency color accents on `AgencyCard` are driven by `agency.config.json` `primaryColor`
- This is the "Multi-Tenant Portal" vision described in earlier planning — one URL, all agencies

---

### Sub-Task 11 — watsonx.ai PDF Extraction Engine

**Status:** [ ] pending

**Intent**
Build the AI extraction pipeline that reads a Citizen Charter PDF and returns a structured
`services.json` array. Uses watsonx.ai with a purpose-built prompt engineered for the standard
ARTA Citizen Charter table format (Republic Act 11032). This is the engine behind the upload tool.

**Expected Outcomes**
- A Node.js/Express API endpoint `POST /api/extract` accepts a PDF file and returns structured JSON
- watsonx.ai correctly extracts all services from FNRI, PNRI, and SEI charters in the right schema
- Extracted JSON matches the `services.json` schema used by the Service Finder frontend
- Processing time, fees, requirements, and who-may-avail fields are all captured
- The endpoint handles the three known complexity levels: simple (SEI), medium (FNRI), high/tiered fees (PNRI)

**Todo List**
1. Create a `server/` directory alongside `src/` for the Node.js backend
2. Initialize `server/package.json` with dependencies: `express`, `multer` (file upload), `pdf-parse` (PDF text extraction), `ibm-watson` or `@ibm-cloud/watsonx-ai` SDK
3. Create `server/index.js` — Express app with `POST /api/extract` route
4. Create `server/extractServices.js` — receives PDF text, calls watsonx.ai with the extraction prompt
5. Engineer the watsonx.ai prompt to:
   - Identify all services in the ARTA-standard table format
   - Extract: name, description, office, processingTime, fees, requirements, whoMayAvail, classification
   - Return valid JSON array matching the `services.json` schema
   - Handle tiered fee tables (PNRI pattern) by summarizing into a fees string
6. Create `server/normalizeServices.js` — post-processes AI output: normalize time units, clean fee strings, assign auto-generated `id` fields
7. Test extraction against all 3 reference PDFs and verify output quality
8. Store watsonx.ai API key in `.env` — never hardcoded

**Relevant Context**
- All Philippine Citizen Charters follow ARTA RA 11032 format: Client Steps → Agency Action → Fees → Processing Time → Person Responsible
- `pdf-parse` npm package extracts plain text from PDF — this text is sent to watsonx.ai
- watsonx.ai model: `ibm/granite-13b-instruct-v2` or `meta-llama/llama-3-1-70b-instruct` — use whichever is available in the hackathon environment
- PNRI has 52 services and complex tiered fees — the prompt must instruct the AI to summarize fee tables rather than reproduce them verbatim
- `.env` variables needed: `WATSONX_API_KEY`, `WATSONX_PROJECT_ID`, `WATSONX_URL`

---

### Sub-Task 12 — Agency PDF Upload and Review UI

**Status:** [ ] pending

**Intent**
Build the self-service web page where agency staff (non-technical) upload their Citizen Charter PDF,
review the AI-extracted services, make edits if needed, and publish their Service Finder — all
without developer involvement.

**Expected Outcomes**
- An `/upload` route shows a clean upload page: agency name field + PDF drag-and-drop zone
- After upload, a loading state shows "Reading your charter..." while watsonx.ai processes it
- A review screen shows all extracted services in an editable table (name, processing time, fees, category)
- Staff can edit any field inline before approving
- A "Publish" button saves the approved `services.json` and adds the agency to the platform
- The new agency immediately appears on the landing page and its Service Finder is live
- The upload page works for FNRI, PNRI, and SEI reference PDFs without errors

**Todo List**
1. Create `src/pages/UploadPage.tsx` — agency name input + PDF drag-and-drop zone (using HTML5 drag events, no library needed)
2. On file drop/select, `POST` the PDF to `server/api/extract` and show a loading spinner
3. Create `src/pages/ReviewPage.tsx` — displays extracted services in a scrollable, inline-editable table
4. Each row in the review table is editable: click a cell to edit name, processingTime, fees, category, description
5. Add a category dropdown per row (Laboratory, Training, Information, Surveys, Regulatory, Other) — category list is generic, not FNRI-specific
6. "Add row" and "Delete row" buttons allow staff to correct missed or duplicate extractions
7. "Publish" button: saves the final JSON, writes to `src/data/agencies/<slugified-agency-name>/services.json`, triggers a rebuild
8. Show a success screen: "Your Service Finder is live!" with a shareable link
9. Add a "Start over" option that clears the upload and returns to the upload page

**Relevant Context**
- For the hackathon demo, "Publish" can write to a local file and trigger `npm run build` — no database needed
- Inline editing: use `contentEditable` on table cells or controlled inputs that toggle on click
- The category dropdown in review must use generic categories (not FNRI-specific) since this serves all agencies
- `slugify(agencyName)` produces the directory name: "DOST-PNRI" → `dost-pnri`

---

## Architecture Summary

### Phase A — FNRI MVP (Sub-Tasks 1–8)

```
src/
  data/
    agencies/
      fnri/
        services.json       # All 38 FNRI services
        categories.json     # 5 FNRI category definitions
        wizard.json         # FNRI wizard questions
        agency.config.json  # FNRI branding and contact info
      pnri/                 # Populated in Sub-Task 11
      sei/                  # Populated in Sub-Task 11
      index.ts              # Merges all agency services for cross-agency search
  components/
    Layout.tsx
    Header.tsx
    BottomNav.tsx
    AgencyCard.tsx          # Added in Sub-Task 10
    CategoryCard.tsx
    ServiceCard.tsx         # Agency badge added in Sub-Task 10
    ServiceDetail.tsx
    WizardStep.tsx
    WizardResults.tsx
  hooks/
    useAgencyConfig.ts      # Added in Sub-Task 9
    useSearch.ts
  pages/
    LandingPage.tsx         # Added in Sub-Task 10
    SearchPage.tsx
    BrowsePage.tsx
    WizardPage.tsx
    UploadPage.tsx          # Added in Sub-Task 12
    ReviewPage.tsx          # Added in Sub-Task 12
  App.tsx
  main.tsx
  index.css
```

### Phase B — Multi-Agency Backend (Sub-Tasks 9–12)

```
server/
  index.js                  # Express app, route definitions
  extractServices.js        # watsonx.ai PDF extraction prompt + API call
  normalizeServices.js      # Post-processing: time units, fee strings, IDs
  .env                      # WATSONX_API_KEY, WATSONX_PROJECT_ID, WATSONX_URL
  package.json
```

### Data Flow

```
Agency PDF Upload
       │
       ▼
  pdf-parse (text extraction)
       │
       ▼
  watsonx.ai (structured JSON extraction)
       │
       ▼
  normalizeServices.js (clean + validate)
       │
       ▼
  ReviewPage (agency staff edits + approves)
       │
       ▼
  services.json saved to src/data/agencies/<slug>/
       │
       ▼
  npm run build → GitHub Pages deploy
       │
       ▼
  Agency live on LandingPage + Service Finder
```
