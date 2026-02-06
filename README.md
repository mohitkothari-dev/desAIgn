# desAIgn - AI-Powered Design Tool

[![Next.js](https://img.shields.io/badge/Next.js-15-black?style=for-the-badge&logo=next.js)](https://nextjs.org/)
[![Tailwind CSS](https://img.shields.io/badge/Tailwind_CSS-4.0-38B2AC?style=for-the-badge&logo=tailwind-css)](https://tailwindcss.com/)
[![Drizzle ORM](https://img.shields.io/badge/Drizzle_ORM-0.45-C5F74F?style=for-the-badge&logo=drizzle)](https://orm.drizzle.team/)
[![Gemini AI](https://img.shields.io/badge/Gemini_AI-Google-4285F4?style=for-the-badge&logo=google-gemini)](https://ai.google.dev/)

**desAIgn** is a high-performance AI designer that allows you to create websites, apps, and prototypes using natural language. Instead of generating raw code directly, it uses a unique **Design Intent** architecture that is token-efficient, predictable, and incredibly fast.

---

## 🚀 Features

- **Prompt-to-Design:** Describe your vision in plain English and watch it come to life.
- **Design Intent Architecture:** Uses structured JSON "blueprints" for high reliability and low token usage.
- **Instant Theme Swapping:** Change colors and styles globally without re-generating code.
- **Zero-Token Code Export:** Deterministic client-side generation of clean React/Tailwind code.
- **Interactive Canvas:** A powerful visual workspace to view and iterate on your designs.
- **Project Management:** Save, share, and manage multiple design projects.

## 🛠️ Tech Stack

- **Framework:** [Next.js 15](https://nextjs.org/) (App Router)
- **Styling:** [Tailwind CSS 4](https://tailwindcss.com/)
- **AI Engine:** [Google Gemini AI](https://ai.google.dev/) via [AI SDK](https://sdk.vercel.ai/)
- **Database:** [Neon (PostgreSQL)](https://neon.tech/) with [Drizzle ORM](https://orm.drizzle.team/)
- **Authentication:** [Better Auth](https://better-auth.com/)
- **Components:** Custom UI library built on Radix UI primitives.

---

## 🏁 Getting Started

### Prerequisites

- [Node.js](https://nodejs.org/) (v18+ recommended)
- [npm](https://www.npmjs.com/), [pnpm](https://pnpm.io/), or [yarn](https://yarnpkg.com/)
- A [Neon](https://neon.tech/) database instance (or any PostgreSQL)
- A [Google AI Studio](https://aistudio.google.com/) API Key for Gemini.

### Installation

1. Clone the repository:
   ```bash
   git clone https://github.com/your-repo/desaign.git
   cd desaign
   ```

2. Install dependencies:
   ```bash
   npm install
   ```

3. Set up environment variables:
   Create a `.env` file in the root directory and add the following:
   ```env
   DATABASE_URL="your-postgresql-url"
   NEXT_PUBLIC_APP_URL="http://localhost:3000"
   BETTER_AUTH_SECRET="your-better-auth-secret"
   BETTER_AUTH_URL="http://localhost:3000"
   GEMINI_API_KEY="your-gemini-api-key"
   
   # Optional: For Auth Providers
   GITHUB_CLIENT_ID="your-github-id"
   GITHUB_CLIENT_SECRET="your-github-secret"
   GOOGLE_CLIENT_ID="your-google-id"
   GOOGLE_CLIENT_SECRET="your-google-secret"
   ```

### Database Setup

1. Push the schema to your database:
   ```bash
   npm run db:push
   ```

2. Seed initial themes and data:
   ```bash
   npm run db:seed
   ```

### Running the Application

Start the development server:

```bash
npm run dev
```

Open [http://localhost:3000](http://localhost:3000) with your browser to see the result.

---

## 🧠 How it Works

Desaign doesn't just "write code." It generates a **Design Intent** JSON structure. This approach has several advantages:
- **Consistency:** AI is better at following a JSON schema than writing complex JSX.
- **Performance:** Client-side rendering is faster than waiting for a full code generation.
- **Flexibility:** You can update the renderer independently of the AI's output.

For more technical details, check out [DOCUMENTATION.md](./DOCUMENTATION.md).

## 📄 License

This project is licensed under the [MIT License](./LICENSE).
