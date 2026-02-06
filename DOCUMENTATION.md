# Technical Documentation: desAIgn Architecture

`#Architecture` `#NextJS15` `#GenerativeAI` `#DesignIntent` `#TokenOptimization`

This document provides a deep dive into the technical architecture, design philosophy, and implementation details of **desAIgn**.

---

## 🏗️ Core Architecture: The "Design Intent" Paradigm

`#Strategy` `#Efficiency`

Unlike traditional AI website builders that ask an LLM to generate raw HTML/JSX code directly, **desAIgn** uses a **Design Intent** abstraction layer.

### 1. The Design Intent Flow
1. **Input Phase:** User provides a natural language prompt (e.g., *"Build a landing page for a coffee shop with a dark theme"*).
2. **Intelligence Phase:** The Google Gemini LLM processes the prompt and outputs a structured **Design Intent JSON**.
3. **Rendering Phase:** The `ScreenRenderer` (Client-side) interprets the JSON and maps it to pre-defined React components.
4. **Export Phase:** The `code-generator.ts` utility converts the JSON into a standalone Next.js/Tailwind component.

### 2. Why Design Intent?
- **Data Density:** A JSON object like `{"type": "Hero", "title": "Coffee"}` is significantly smaller than the equivalent JSX code, saving **60-80% in token costs**.
- **Predictability:** JSON schemas are easier for LLMs to follow than complex programming syntax, leading to a **lower hallucination rate**.
- **The "Blueprint" Advantage:** We separate the *content* (JSON) from the *presentation* (Renderer). This allows for instant theme swapping without calling the AI again.

---

## 🛠️ Tech Stack & Implementation

`#Stack` `#Engineering`

### Frontend & Rendering
- **Framework:** Next.js 15 (App Router) for optimized routing and server-side rendering.
- **Styling:** **Tailwind CSS 4.0** utilizing CSS-variable-based theming.
- **Visuals:** Lucide React for icons and Radix UI for accessible primitive components.

### AI Integration
- **Engine:** `gemini-3-flash-preview` via the **Vercel AI SDK**.
- **Prompt Engineering:** Systematic prompts that enforce strict JSON output according to a defined schema.

### Data & Persistence
- **ORM:** **Drizzle ORM** for type-safe database interactions.
- **Database:** Neon PostgreSQL (Serverless).
- **Authentication:** **Better Auth** handling multi-provider logins (Google, GitHub) and session management.

---

## 📊 Database Schema Overview

`#Database` `#Drizzle`

The application uses a relational schema designed for scalability:

- **`user` / `session` / `account`:** Core authentication tables managed by Better Auth.
- **`project`:** Stores high-level project metadata (name, description, global theme, device target).
- **`screenConfig`:** The heart of the design, storing the `designIntent` JSON for each screen.
- **`theme`:** Stores color palettes and radius settings as JSON objects for instant client-side injection.
- **`shareLink`:** Manages public sharing tokens for project collaboration.

---

## ⚡ Zero-Token Code Generation

`#ClientSide` `#ZeroCost`

The code export feature is a **deterministic client-side utility**. 

- **How it works:** When a user clicks "Export Code," `code-generator.ts` iterates through the `designIntent` JSON and transforms each node into a string of JSX with Tailwind classes.
- **Performance:** This process happens entirely in the user's browser (Client Side). It is instant, requires no API calls, and costs **zero tokens**.

---

## 🔐 Security & Sharing

`#Security` `#Auth`

- **Better Auth:** Provides secure, production-ready authentication.
- **Public Sharing:** Projects can be shared via unique, non-guessable tokens stored in the `shareLink` table, allowing for read-only preview modes.