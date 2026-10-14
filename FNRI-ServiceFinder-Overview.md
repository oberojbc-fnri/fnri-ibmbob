# Citizen Charter Service Finder
## Project Overview for Non-Technical Team Members

**Project:** Philippine Government Citizen Charter Service Finder Platform
**Prepared for:** FNRI Team — Non-Technical Stakeholders
**Purpose:** To explain what we are building, why, and how — in plain language

---

## 🧭 What Are We Building?

We are building a **free, public website** that helps ordinary citizens quickly find the right government service for their needs — without having to read through an entire Citizen Charter document.

Think of it like a **digital information desk**. Instead of calling an agency or reading a long document, a citizen simply visits the website, types or answers a few questions, and immediately sees exactly which service they need — along with what to bring, how long it takes, and who to contact.

The platform starts with **FNRI** and is designed from day one to work for **any Philippine government agency** — because all agencies use the same standard Citizen Charter format required by law (Republic Act 11032).

---

## 🏛️ Who Is This For?

### Citizens
Anyone who needs to interact with a government agency:

| Who | Example Need |
|---|---|
| 🧑‍🍳 Food business owners and MSMEs | "I need to get my product tested before selling it" |
| 👨‍👩‍👧 Parents and caregivers | "I want to know if my child's diet is healthy" |
| 🎓 Students and researchers | "I need nutrition survey data for my thesis" |
| 🏥 Health workers | "I want to attend a training on nutrition assessment" |
| 🏛️ Government agencies | "We need FNRI to speak at our nutrition forum" |

### Government Agencies
Any agency that wants to make their Citizen Charter easier for citizens to use — without hiring developers or rebuilding their website.

---

## ❓ What Problem Does It Solve?

Right now, citizens who want to use a government service often face these challenges:

- ❌ The Citizen Charter is a long, technical document — hard to navigate
- ❌ It's not always clear which office to contact or what documents to bring
- ❌ Citizens may not even know the official name of the service they need
- ❌ They have to call or visit in person just to find out basic information
- ❌ Each agency has its own website with no consistent way to find services

**Our platform solves all of this** for any government agency — in one place.

---

## 📦 Two Parts of the Platform

The platform has two parts that work together:

```
Part 1 — The Service Finder (what citizens use)
Part 2 — The Upload Tool (what agency staff use to set it up)
```

---

## Part 1 — The Service Finder (What Citizens See)

### Three Ways to Find a Service

We designed three different ways to find a service, because different people think differently.

#### Way 1 — 🔍 Search (Type What You Need)
The citizen types a few words — just like searching on Google.

> **Example:** Type *"food testing"* → instantly see matching services from any agency

#### Way 2 — 📂 Browse by Agency or Category
For citizens who prefer to explore, the website shows all agencies as cards. Tap an agency, then browse its services by category.

#### Way 3 — ❓ Guided Quiz
Some citizens don't know what to search for. The website asks **3 simple questions**:

> **Question 1:** Who are you? *(e.g., Food business owner / Student / Health worker)*
> **Question 2:** What do you need? *(e.g., Test a product / Attend a training / Get data)*
> **Question 3:** How do you prefer to engage? *(Visit in person / Online)*

After answering, the website shows the most relevant services.

### What Citizens See for Each Service

| Information | Example |
|---|---|
| **What the service is** | "Get a full laboratory analysis of your food product's nutritional content" |
| **Who can apply** | "Open to all — food businesses, individuals, researchers" |
| **How long it takes** | "About 3 weeks (15 working days)" |
| **How much it costs** | "PHP 1,500 / Free for information requests" |
| **What to bring** | "500g food sample + filled-out request form" |
| **Which office handles it** | "Service Laboratory Group — Chemical Laboratory" |
| **How to contact them** | 📧 Email · 📞 Phone · 📍 Office location |

All information is written in **plain, friendly English** — not technical jargon.

---

## Part 2 — The Upload Tool (How Agencies Join the Platform)

### The Key Insight: All Citizen Charters Look the Same

By law (Republic Act 11032 — Ease of Doing Business Act), **every Philippine government agency must follow the same Citizen Charter format**. Every charter has the same columns:

> Client Steps → Agency Action → Fees → Processing Time → Person Responsible

This means our AI can read **any agency's charter** and understand it automatically.

### How an Agency Gets On the Platform

It takes about **15 minutes** — no technical knowledge needed:

```
Step 1 → Agency staff visits the Upload page
Step 2 → Types their agency name
Step 3 → Drags and drops their Citizen Charter PDF
Step 4 → AI reads the charter and extracts all services (takes about 2 minutes)
Step 5 → Staff reviews the list on screen — can edit anything
Step 6 → Clicks "Publish"
Step 7 → The agency's Service Finder is live immediately
```

### What the AI Does

The AI (IBM watsonx) reads the charter PDF the same way a person would — but in seconds. It finds every service in the document and organizes the information into the right format for the website. Staff then review it to make sure everything looks correct before publishing.

### Agencies Already Ready to Go

We already have three agency charters in hand and ready to test:

| Agency | Full Name | Services |
|---|---|---|
| FNRI | Food and Nutrition Research Institute | 38 |
| PNRI | Philippine Nuclear Research Institute | 52 |
| SEI | Science Education Institute | 12 |

---

## 📱 Will It Work on Mobile?

Yes — the website is **designed for mobile phones first**. Most Filipino citizens access online services through their smartphones. Every button is large and easy to tap, and the layout works on any screen size.

---

## 🔒 Is Any Data Collected from Citizens?

**No.** The public Service Finder does not:
- Ask citizens to log in or register
- Collect personal information
- Store any search history

The Upload Tool (for agency staff only) requires the agency to log in with their agency credentials to prevent unauthorized uploads.

---

## 🏗️ How Will It Be Built? (In Simple Terms)

| What | Plain Explanation |
|---|---|
| **The website** | Built with Ionic + Angular — a professional framework used for mobile and government apps |
| **The look and feel** | Ionic component library — gives the app a native mobile feel on any phone or browser, with no extra design work |
| **The search** | Powered by Fuse.js — a smart search that finds services even with typos |
| **The AI extraction** | IBM watsonx reads the charter PDF and extracts all services automatically |
| **The service data** | One file per agency (`services.json`) built from their Citizen Charter |
| **Where it lives** | Hosted for free on GitHub Pages — no monthly server cost for citizens |

---

## 🗓️ Build Plan at a Glance

### Phase A — FNRI Service Finder (Sub-Tasks 1–8)

| Step | What Happens |
|---|---|
| 1 | Set up the blank website framework |
| 2 | Convert all 38 FNRI charter services into a searchable format |
| 3 | Build the header, navigation bar, and page structure |
| 4 | Build the instant search with result cards |
| 5 | Build the category cards and filtered service lists |
| 6 | Build the 3-question guided quiz |
| 7 | Test on mobile, check readability, ensure accessibility |
| 8 | Publish the FNRI Service Finder live |

### Phase B — Multi-Agency Platform (Sub-Tasks 9–12)

| Step | What Happens |
|---|---|
| 9 | Make the website reusable — any agency can swap in their name, logo, and colors |
| 10 | Add a landing page showing all agencies — citizens pick their agency or search across all |
| 11 | Build the AI engine that reads a Citizen Charter PDF and extracts all services automatically |
| 12 | Build the Upload and Review page — agency staff upload their PDF and publish in 15 minutes |

---

## 🎯 The Big Picture

The goal is not just a tool for FNRI. It is a **platform for the entire Philippine government**.

> *"Any Philippine government agency with a Citizen Charter can be onboarded in under 15 minutes — with no technical staff, no developer, no coding. An agency uploads their PDF, AI reads it, staff approves it, and citizens can find their services instantly."*

There are over **1,800 government agencies** in the Philippines. All of them are required to have a Citizen Charter. This platform can serve all of them.

---

## 💬 What About a Chatbot?

A chatbot was discussed as a **future enhancement** — it is not part of this version. Once the platform is live, a chatbot powered by IBM watsonx can be added, allowing citizens to ask follow-up questions in conversation. The data and structure built now will make that easy to add later.

---

## ✅ What Does Success Look Like?

### Phase A (FNRI)
- ✅ A citizen finds the right FNRI service in under 60 seconds
- ✅ The website works on a mobile phone
- ✅ All 38 FNRI services are findable and readable
- ✅ The website is live and publicly accessible

### Phase B (Multi-Agency)
- ✅ PNRI and SEI are onboarded using the Upload Tool
- ✅ Citizens can search across all three agencies at once
- ✅ An agency staff member with no technical background can onboard a new agency in 15 minutes
- ✅ The same platform works for any future agency that uploads their charter

---

## 📞 Questions?

For questions about this project, contact the FNRI-IBM Bob-a-thon team.

---

*Document prepared as part of the FNRI-IBM Bob-a-thon | October 2026*
