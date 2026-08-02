# Sidekick

A warm, native-feeling daily task driver with an embedded AI coach.

**Live demo:** [sidekick-seven-rho.vercel.app/today](https://sidekick-seven-rho.vercel.app/today)

Sidekick is a daily task and planning app for solo knowledge workers — the place you open each morning to see today's plan, upcoming work, and project context, with an AI sidekick that helps you prioritize, break down goals, and stay on track. It's built to replace a general-purpose todo app for daily use, not to demo AI features.

## Features

- **Today view** — today's tasks plus recently-overdue tasks (within a 3-day window), sorted so overdue work surfaces first.
- **Upcoming view** — everything due after today, grouped and sorted by date.
- **Projects & phases** — turn a goal into a structured project with sequential phases, each holding concrete tasks.
- **AI project decomposition** — describe an outcome (goal, description, target date, clarifications) and the AI coach generates a realistic 3–5 phase plan with actionable tasks.
- **AI daily brief** — a short, direct daily brief (focus, risk, what to do first, what to avoid) generated from today's tasks and stats.
- **AI project analysis** — ask the coach to assess progress and risk on an in-flight project.
- **Embedded AI chat** — a sidekick panel for conversational help, in context, not a bolted-on chatbot.
- **Labels & tags** — organize tasks with tags across projects and views.
- **Light/dark themes** — matched surface hierarchy for both.

## Tech stack

- [Next.js](https://nextjs.org) (App Router) + React 19
- TypeScript
- [Supabase](https://supabase.com) — Postgres database, queried via `@supabase/supabase-js`
- [Vercel AI SDK](https://sdk.vercel.ai) (`ai`) with [`@ai-sdk/google`](https://sdk.vercel.ai/providers/ai-sdk-providers/google-generative-ai) (Gemini) for AI features
- Tailwind CSS v4
- `lucide-react` for icons
- `zod` for schema validation of AI outputs

## Getting started

### Prerequisites

- Node.js 18+
- A [Supabase](https://supabase.com) project (URL + anon key)
- A Google Generative AI (Gemini) API key for the AI features

### Setup

1. Clone the repo and install dependencies:

   ```bash
   git clone <your-repo-url>
   cd sidekick
   npm install
   ```

2. Create a `.env.local` file in the project root with:

   ```bash
   NEXT_PUBLIC_SUPABASE_URL=your-supabase-project-url
   NEXT_PUBLIC_SUPABASE_ANON_KEY=your-supabase-anon-key
   GOOGLE_GENERATIVE_AI_API_KEY=your-gemini-api-key
   ```

3. Set up your Supabase schema. The app expects (at least) `tasks`, `task_tags`, `projects`, and `phases` tables — check `src/app/api/**/route.ts` for the exact shape each endpoint expects.

4. Run the dev server:

   ```bash
   npm run dev
   ```

   Open [http://localhost:3000](http://localhost:3000).

### Other scripts

```bash
npm run build   # production build
npm run start   # run the production build
npm run lint    # eslint
```

## Project structure

```
src/
  app/
    api/                # route handlers: ai, daily-state, phases, projects, tasks
    labels/              projects/[id]/  today/  upcoming/   # pages
  components/            # UI components (task items, modals, AI assistant panel, etc.)
  context/                # React context (tasks, AI assistant)
  lib/
    ai/                  # AI prompts, schemas, client, rate limiting
    api/                  # client-side API helpers
    ui/                    # design tokens (tinted neutral ramp, type scale)
    utils/                  # scoring, date, label, and display utilities
  types/                  # shared TypeScript types
```

## AI rate limiting

AI calls (chat, project decomposition, daily brief) are serialized through a shared queue in `src/lib/ai/rate-limit.ts`, which enforces a minimum 13-second gap between requests to stay within API limits.

## Design system

See [`DESIGN.md`](./DESIGN.md) for the full visual design system (colors, typography, elevation, component rules) and [`PRODUCT.md`](./PRODUCT.md) for product purpose, brand personality, and anti-references. In short: a restrained indigo-accented palette on tinted neutrals, flat surfaces with minimal shadow, and AI help embedded in the workflow rather than bolted on as a separate widget.

## Keeping Supabase alive

Free-tier Supabase projects pause after 7 days of inactivity. `.github/workflows/keep-alive.yml` pings the `tasks` table twice a week (and can be triggered manually from the Actions tab) to keep the project active. It requires `SUPABASE_URL` and `SUPABASE_ANON_KEY` repository secrets.

## Deployment

The easiest way to deploy is [Vercel](https://vercel.com/new), the creators of Next.js. Set the same environment variables (`NEXT_PUBLIC_SUPABASE_URL`, `NEXT_PUBLIC_SUPABASE_ANON_KEY`, `GOOGLE_GENERATIVE_AI_API_KEY`) in your Vercel project settings. See the [Next.js deployment docs](https://nextjs.org/docs/app/building-your-application/deploying) for details.
