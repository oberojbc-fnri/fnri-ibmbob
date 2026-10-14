# 🏛️ Citizen Charter Service Finder

> **FNRI–IBM Bob-a-thon · October 2026**
> A mobile-first platform that helps Filipino citizens find the right government service — instantly.

---

## 🌐 Live Demo

**[https://oberojbc-fnri.github.io/fnri-ibmbob/](https://oberojbc-fnri.github.io/fnri-ibmbob/)**

---

## 🧭 What Is This?

The **Citizen Charter Service Finder** is a free, public web app that makes it easy for any citizen to find the right government service — without reading through a long Citizen Charter document.

Citizens can:
- 🔍 **Search** — type what they need in plain language and get instant results
- 📂 **Browse** — explore services by category
- ❓ **Take a guided quiz** — answer 3 questions and get matched to the right service

The platform starts with **DOST-FNRI** and is designed to scale to **any Philippine government agency** — because all agencies follow the same ARTA-mandated Citizen Charter format (Republic Act 11032).

---

## 🏗️ Two-Phase Platform

### Phase A — FNRI Service Finder MVP
Static Ionic + Angular app covering all 38 FNRI services. Deployed on GitHub Pages. No backend required — search runs entirely in the browser.

### Phase B — Multi-Agency PDF Onboarding
Any agency uploads their Citizen Charter PDF → IBM watsonx.ai extracts all services automatically → agency staff reviews and approves → their Service Finder goes live in under 15 minutes.

---

## 🏛️ Agencies Covered

| Agency | Full Name | Services |
|---|---|---|
| DOST-FNRI | Food and Nutrition Research Institute | 38 |
| DOST-PNRI | Philippine Nuclear Research Institute | 52 |
| DOST-SEI | Science Education Institute | 12 |

---

## 🛠️ Tech Stack

### Frontend
| Technology | Version | Role |
|---|---|---|
| Angular | 17 | Component framework, routing |
| Ionic Framework | 7 | Mobile-first UI components (IonCard, IonSearchbar, IonTabs, IonModal) |
| TypeScript | 5 | Type safety |
| Ionic CSS Variables + SCSS | — | Theming, responsive layout |
| Ionicons | 7 | Icon set |
| Fuse.js | 7 | Client-side fuzzy search |
| angular-cli-ghpages | latest | GitHub Pages deployment |

### Backend (Phase B)
| Technology | Version | Role |
|---|---|---|
| Node.js | 20 LTS | Server runtime |
| Express | 4 | REST API (`/api/extract`, `/api/publish`) |
| Multer | 1 | PDF file upload handling |
| pdf-parse | 1 | PDF text extraction |
| dotenv | 16 | API key management |

### AI
| Technology | Role |
|---|---|
| IBM watsonx.ai | Reads charter PDF text, returns structured services JSON |
| IBM Granite / Llama 3 | Underlying LLM for extraction |
| @ibm-cloud/watsonx-ai | Official IBM Node.js SDK |

---

## 📦 Project Structure

```
fnri-ibm/
├── src/app/
│   ├── data/
│   │   └── agencies/
│   │       ├── fnri/           # services.json, categories.json, wizard.json, agency.config.json
│   │       ├── pnri/
│   │       └── sei/
│   ├── services/
│   │   ├── data.service.ts
│   │   ├── search.service.ts
│   │   └── agency-config.service.ts
│   ├── components/
│   │   ├── service-card/
│   │   ├── service-detail/
│   │   ├── category-card/
│   │   ├── agency-card/
│   │   ├── wizard-step/
│   │   └── wizard-results/
│   └── pages/
│       ├── landing/
│       ├── tabs/
│       ├── search/
│       ├── browse/
│       ├── wizard/
│       ├── upload/
│       └── review/
├── server/                     # Phase B — Node.js/Express backend
│   ├── index.js
│   ├── extractServices.js      # watsonx.ai extraction
│   ├── normalizeServices.js
│   └── .env                    # WATSONX_API_KEY (never committed)
├── reference/                  # Source Citizen Charter PDFs
├── fnri-service-finder-plan.md # Full technical implementation plan
├── FNRI-ServiceFinder-Overview.md  # Non-technical project overview
└── README-AGENCY-SETUP.md      # Guide for onboarding a new agency
```

---

## 🚀 Getting Started

### Prerequisites
- Node.js 20+
- npm 9+
- Ionic CLI: `npm install -g @ionic/cli`

### Run locally
```bash
npm install
ng serve
```

### Build and deploy to GitHub Pages
```bash
npm run deploy
```

### Run the Phase B backend (PDF extraction)
```bash
cd server
npm install
# Add your watsonx.ai credentials to server/.env
npm start
```

---

## 🔑 Environment Variables (Phase B)

Create `server/.env` with:

```
WATSONX_API_KEY=your_api_key_here
WATSONX_PROJECT_ID=your_project_id_here
WATSONX_URL=https://us-south.ml.cloud.ibm.com
```

---

## 📋 Adding a New Agency

See [`README-AGENCY-SETUP.md`](README-AGENCY-SETUP.md) for the full guide.

**Short version:**
1. Upload your Citizen Charter PDF at `/upload`
2. Review and approve the AI-extracted services
3. Click Publish — your Service Finder is live

---

## 📄 Documentation

| Document | Description |
|---|---|
| [`fnri-service-finder-plan.md`](fnri-service-finder-plan.md) | Full technical implementation plan — all 12 sub-tasks, tech stack, architecture, data schema |
| [`FNRI-ServiceFinder-Overview.md`](FNRI-ServiceFinder-Overview.md) | Plain-language overview for non-technical stakeholders |

---

## 🏆 Built For

**FNRI–IBM Bob-a-thon** · October 2026
Powered by [IBM Bob](https://ibm.com) · Built on [IBM watsonx.ai](https://www.ibm.com/watsonx)
