# 🍺 Lambic.info – Next.js Redesign

A modern redesign of **lambic.info**, built with **Next.js**.

This project is a production-oriented web platform built for a volunteer team working to document and promote traditional Lambic beer culture. The goal is to transform a previously unstructured and outdated MediaWiki-based website into a modern, scalable, and user-friendly experience.

---

## 🌍 Project Context

The original lambic.info website was built using MediaWiki and had several limitations:

- No structured database
- Poor navigation and discoverability
- Not responsive on modern devices
- Inconsistent and outdated styling making it hard to go through
- Difficult content management
- Complicated structure making it difficult to find what users are looking for

As a team, we took over the project with the goal of **modernizing the platform and making Lambic knowledge more accessible**, with the broader mission of helping new audiences discover and engage with Lambic beer , in order to support producers.

---

## 🚀 Tech Stack

- Next.js (App Router)
- React
- TypeScript
- CSS Modules
- React Icons
- Node.js

---

## 🧭 Main Sections

The platform is structured into multiple content areas:

- Brewers & Blenders
- Closed Producers
- Experimental Producers
- Lambic Events
- Lambic Places
- Lambic Travels
- Information Pages (such as "What is lambic", "Glossary", "The Team", ...)

Each section is built with reusable components and dynamic routing.

---

## 📁 Architecture Overview

The project uses the **Next.js App Router** with a modular structure:

- `/app` – routes and pages
- `/components` – reusable UI components
- `/public` – static assets (images, fonts)
- CSS Modules for scoped styling

Dynamic routing is used for:
- Producers
- Beers
- Events
- Places
- Info pages

A key focus of the architecture is building **flexible page layouts that adapt based on content type and structure**, especially for informational pages.

---


## 🛠️ Getting Started

### 1. Clone the repository

```bash
git clone https://github.com/LambicJaune/lambic-info.git

2. Install dependencies
npm install

3. Run development server
npm run dev

Open:

http://localhost:3000

📦 Build for Production
npm run build
npm 

🚀 Deployment

This project is deployment-ready and intended for production use.

🚧 Roadmap

 Rebuild legacy data structure using Supabase (scalable and maintainable backend)
 Implement a headless CMS for non-technical contributors
 Add full-text search across all content
 API integration for structured data access
 Further UI/UX improvements as the redesign stabilizes

🧠 Key Technical Challenges

Routing architecture cleanup
Refactoring deeply nested dynamic routes into a clean and scalable structure.
Adaptive page design system
Designing pages that dynamically adjust layout depending on content structure and type (especially informational pages).

👤 Authors

Frontend created and maintained by Gael Giraud, Backend restructured by Hyuk Jun Kim and maintained by the lambic.info team :Matthew Geist, Gael Giraud, Dennis Vansant, Hyuk Jun Kim.

📜 License

This project is open for viewing purposes only.
Reuse, redistribution, or modification of the codebase is not permitted without permission.

