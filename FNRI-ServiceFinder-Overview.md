# FNRI Service Finder
## Project Overview for Non-Technical Team Members

**Project:** FNRI Citizen Charter Service Finder
**Prepared for:** FNRI Team — Non-Technical Stakeholders
**Purpose:** To explain what we are building, why, and how — in plain language

---

## 🧭 What Are We Building?

We are building a **free, public website** that helps ordinary citizens quickly find the right FNRI service for their needs — without having to read through the entire Citizen Charter.

Think of it like a **digital information desk**. Instead of calling FNRI or reading a long document, a citizen simply visits the website, types or answers a few questions, and immediately sees exactly which FNRI service they need — along with what to bring, how long it takes, and who to contact.

---

## 🙋 Who Is This For?

This tool is designed for anyone who needs to interact with FNRI, including:

| Who | Example Need |
|---|---|
| 🧑‍🍳 Food business owners & MSMEs | "I need to get my product tested before selling it" |
| 👨‍👩‍👧 Parents & caregivers | "I want to know if my child's diet is healthy" |
| 🎓 Students & researchers | "I need nutrition survey data for my thesis" |
| 🏥 Health workers | "I want to attend a training on nutrition assessment" |
| 🏛️ Government agencies | "We need FNRI to speak at our nutrition forum" |

---

## ❓ What Problem Does It Solve?

Right now, citizens who want to use an FNRI service often face these challenges:

- ❌ The Citizen Charter is a long, technical document — hard to navigate
- ❌ It's not always clear which office to contact or what documents to bring
- ❌ Citizens may not even know the official name of the service they need
- ❌ They have to call or visit in person just to find out basic information

**Our website solves all of this** by letting citizens describe their need in everyday language and instantly getting the right answer.

---

## 🗺️ How Does It Work? (The Three Ways to Find a Service)

We designed three different ways to find a service, because different people think differently.

---

### Way 1 — 🔍 Search (Type What You Need)

The citizen types a few words describing what they need — just like searching on Google.

> **Example:** A citizen types *"food testing"* and immediately sees:
> - Microbiological Laboratory Testing
> - Chemical Laboratory Testing
> - Technical Assistance and Test Quotation

The results appear **instantly as they type** — no need to press Enter or wait.

---

### Way 2 — 📂 Browse by Category

For citizens who prefer to explore, the website shows **five service categories** as picture cards:

| 🧪 Laboratory | 📚 Training | 📄 Information | 📊 Surveys | 🫙 Sensory |
|---|---|---|---|---|
| Food & water testing | Workshops & seminars | Nutrition resources | Survey data requests | Product taste testing |

The citizen taps a category and sees all the services under it.

---

### Way 3 — ❓ Guided Quiz (For Citizens Who Don't Know What They Need)

Some citizens don't know what to search for. For them, the website asks **3 simple questions**:

> **Question 1:** Who are you?
> *(e.g., Food business owner / Parent / Student / Health worker)*
>
> **Question 2:** What do you need?
> *(e.g., Test a product / Get nutrition info / Attend a training)*
>
> **Question 3:** How do you prefer to engage?
> *(e.g., Visit FNRI in person / Online or email)*

After answering, the website shows the most relevant services for that citizen's profile.

---

## 📋 What Information Will Citizens See?

For every service, the website shows:

| Information | Example |
|---|---|
| **What the service is** | "Get a full laboratory analysis of your food product's nutritional content" |
| **Who can apply** | "Open to all — food businesses, individuals, researchers" |
| **How long it takes** | "About 3 weeks (15 working days)" |
| **How much it costs** | "PHP 1,500 for nutrition facts computation / Free for information requests" |
| **What to bring** | "500g food sample + filled-out request form" |
| **Which office handles it** | "Service Laboratory Group — Chemical Laboratory" |
| **How to contact them** | 📧 Email button · 📞 Phone number · 📍 Office location |

All information is written in **plain, friendly English** — not technical jargon.

---

## 📱 Will It Work on Mobile?

Yes — the website is **designed for mobile phones first**. This is important because most Filipino citizens access online services through their smartphones. Every button is large and easy to tap, and the layout works on any screen size.

---

## 🔒 Is Any Data Collected from Citizens?

**No.** The website does not:
- Ask citizens to log in or register
- Collect personal information
- Store any search history
- Require an internet connection to a server (the search works entirely within the browser)

It is a simple, read-only information tool.

---

## 📦 What Services Are Included?

The website covers all **38 services** from the FNRI Citizen Charter 2026, grouped into 5 categories:

| Category | Services Covered | Count |
|---|---|---|
| 🧪 Laboratory | Microbiological testing, chemical testing, blood analysis, proficiency testing, reference materials, nutrition facts computation | 8 |
| 📚 Training | Meal management, food safety, cGMP, nutrition labeling, sensory evaluation, proximate analysis, and more | 19 |
| 📄 Information | On-site and online access to FNRI resources, IEC materials, resource speakers | 6 |
| 📊 Surveys | Nutrition survey data requests (phone, written, online), Public Use Files | 4 |
| 🫙 Sensory | Sensory evaluation of food products | 1 |

---

## 🏗️ How Will It Be Built? (In Simple Terms)

| What | Plain Explanation |
|---|---|
| **The website itself** | Built using modern web tools (React + Vite) that create fast, responsive pages |
| **The look and feel** | Styled with Tailwind CSS — a design toolkit that makes it look clean on any screen |
| **The search** | Powered by Fuse.js — a smart search tool that finds the right service even with typos |
| **The service data** | Stored in a simple list file (`services.json`) built from the Citizen Charter |
| **Where it lives** | Hosted for free on GitHub Pages — no monthly server cost |

**No database. No login system. No server to maintain.** It is a lightweight, low-cost website.

---

## 🗓️ Build Phases at a Glance

| Phase | What Happens | Plain Description |
|---|---|---|
| **Phase 1** | Project Setup | Set up the blank website framework |
| **Phase 2** | Service Data | Convert all 38 charter services into a clean, searchable format |
| **Phase 3** | Layout & Navigation | Build the header, navigation bar, and page structure |
| **Phase 4** | Search Feature | Build the instant search with result cards |
| **Phase 5** | Browse Feature | Build the category cards and filtered service lists |
| **Phase 6** | Guided Quiz | Build the 3-question wizard |
| **Phase 7** | Quality Check | Test on mobile, check readability, ensure accessibility |
| **Phase 8** | Go Live | Publish the website and share the link |

---

## 💬 What About a Chatbot?

A chatbot was discussed as a **future enhancement** — it is not part of this first version. Once the Service Finder is live, the chatbot can be layered on top using AI (IBM watsonx), allowing citizens to ask follow-up questions in conversation. The data and structure we build now will make that easy to add later.

---

## ✅ What Does Success Look Like?

The project is a success when:

- ✅ A citizen can find the right FNRI service in **under 60 seconds**
- ✅ The website works smoothly on a **mobile phone**
- ✅ All 38 services from the charter are **findable and readable**
- ✅ The website is **live and publicly accessible** via a URL
- ✅ Citizens who don't know what they need can use the **quiz to be guided**

---

## 📞 Questions?

For questions about this project, contact the FNRI-IBM Bob-a-thon team.

---

*Document prepared as part of the FNRI-IBM Bob-a-thon | October 2026*
