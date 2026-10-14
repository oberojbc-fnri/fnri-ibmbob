# FNRI Service Finder — MVP Plan

## Top-Level Overview

Build a **mobile-first web app** that helps citizens find the right FNRI service by describing
their need in plain language. The app is a static React + Vite + Tailwind CSS site deployed on GitHub Pages.
It requires no backend — search runs entirely in the browser using Fuse.js over a local `services.json`
data file extracted from the FNRI Citizen Charter 2026.

**Three entry points** serve different citizen types:
1. **Instant Search** — free-text, results appear as they type
2. **Browse by Category** — visual category cards (Laboratory, Training, Information, Surveys, Sensory)
3. **Guided Wizard** — 3-question quiz for citizens who do not know what they need

**Chatbot is a non-goal for MVP.** The architecture keeps a clean data layer so it can be added later.

---

## Decisions & Constraints

- **Framework:** React + Vite
- **Styling:** Tailwind CSS
- **Search:** Fuse.js (client-side, no backend required)
- **Language:** English only
- **Deployment:** GitHub Pages (static export via `vite build`)
- **Data:** Flat `services.json` file — single source of truth for all 3 entry points
- **No backend, no auth, no database**

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

## Architecture Summary

```
src/
  data/
    services.json       # All 38 FNRI services — single source of truth
    categories.json     # 5 category definitions with icons and colors
    wizard.json         # 3 wizard questions and their answer options
  components/
    Layout.tsx          # App shell with header and bottom nav
    Header.tsx          # FNRI branding bar
    BottomNav.tsx       # 3-tab navigation
    CategoryCard.tsx    # Visual card for Browse grid
    ServiceCard.tsx     # Compact card for search/browse/wizard results
    ServiceDetail.tsx   # Full detail drawer/modal (shared across all 3 entry points)
    WizardStep.tsx      # Single wizard question screen
    WizardResults.tsx   # Wizard results list
  hooks/
    useSearch.ts        # Fuse.js wrapper returning ranked results
  pages/
    SearchPage.tsx      # Instant search entry point
    BrowsePage.tsx      # Category browse entry point
    WizardPage.tsx      # Guided wizard entry point
  App.tsx               # Root — view state, renders Layout + active page
  main.tsx              # Vite entry point
  index.css             # Tailwind directives
```
