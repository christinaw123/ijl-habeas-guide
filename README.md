# IJL Habeas Guide

A free public web tool built for the Immigrant Justice Lab (University of Michigan, in partnership with MIRC). It helps families of someone detained by immigration officials find where the person is held, get the right contacts (facility, ICE field office, federal district court, local legal and community organizations), and understand their legal options.

**New to the project? Start with [ONBOARDING.md](./ONBOARDING.md).**

## Setup

```bash
npm install
npm run dev        # http://localhost:3000
```

Requires a `.env` (shared privately, never committed):

```
NEXT_PUBLIC_SUPABASE_URL=
NEXT_PUBLIC_SUPABASE_ANON_KEY=
```

## Commands

```bash
npm run dev         # development server
npm run build       # production build
npm run lint        # ESLint
npm run translate   # regenerate public/locales/*.json from lib/i18n/strings.ts
```

## Stack

Next.js 16 (App Router), React 19, TypeScript, Tailwind CSS v4, Supabase (Postgres, reached only through `/api/*` routes), hosted on Vercel.
