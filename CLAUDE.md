# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Project Overview

This is the **IJL Habeas Guide** — a Next.js web tool built for the Immigrant Justice Lab. It helps users find information about locating detained immigrants, legal resources, and detention facilities. Flow-selection state (what the user picked at each step) lives in `localStorage`. Facility, county, field-office, court, and organization data is served from a Supabase Postgres backend via Next.js API routes.

## Project Rules

These are team decisions, not things you can infer from the code. Follow them unless a teammate says otherwise.

- **Don't add questions to the flow.** The guide is used by families in a crisis, usually in the first 48–72 hours after an arrest, and it deliberately asks only for the arrest state/city and whether/where the person is held. Don't propose new user-facing fields (arrest time, how the person was arrested, etc.), even when they would improve results: they cost privacy, and people who don't know an answer will guess, which makes their results worse. Improvements must come from the existing inputs or from backend data.
- **Never commit private files:** `.env*`, `ONBOARDING.md`, or anything under `data/` except `data/README.md` (scripts, spreadsheets, parquets, local databases).
- **Org data is curated in the Sheet of Record; don't fix it in the app.**
  - Only orgs whose sheet `render` is TRUE may appear on the site. The loader enforces this by writing only rendered orgs to Supabase (there is no `validated` column), so the org queries in `server/queries.ts` don't filter; never insert orgs into `local_orgs` any other way.
  - `org_type` is loaded exactly as written in the sheet, including combined values like `legal, social`. The UI currently checks `org_type === "legal"`, so combined types render as "general"; that's known and waiting on a design change. Don't normalize the data to work around it.
  - Loading orgs replaces the whole list: orgs missing from the newest sheet are deleted from Supabase. Data errors (bad county codes, etc.) should be fixed in the sheet, not patched in code.
- **The "facilities to call" list sorts by distance only.** In the unknown view, `getUnknownResultsData` (`server/queries.ts`) sorts facilities by distance from the arrest city, or alphabetically when there's no city. A different ranking is being researched but is not deployed; don't assume it exists, and don't change the sort order without checking with the team.
- **All user-facing text goes through i18n.** Add English strings to `lib/i18n/strings.ts` and render them with `t("key")`; never hardcode text in a component. Translations are machine-generated and refresh daily (or run `npm run translate`), so new text shows in English for other languages until then.
- **Personal preferences go in `CLAUDE.local.md`** (gitignored), not in this file.

## Commands

```bash
npm run dev        # Start development server at localhost:3000
npm run build       # Build for production
npm run start       # Serve the production build
npm run lint        # Run ESLint
npm run translate   # Regenerate public/locales/*.json via MyMemory translation API
```

No test suite is configured yet.

### Environment

Requires a `.env` with:
```
NEXT_PUBLIC_SUPABASE_URL=
NEXT_PUBLIC_SUPABASE_ANON_KEY=
MYMEMORY_EMAIL=          # optional; raises the npm run translate daily limit from ~1,000 to ~10,000 words
```
The Supabase project is on the free tier, which auto-pauses after 7 days of inactivity. `.github/workflows/supabase-keep-alive.yml` pings it every 6 days to prevent that.

## Architecture

### Multi-Step Detainee Flow

The core feature is a guided multi-step questionnaire. All pages live directly in `app/` (every folder is a URL segment); `app/api/` is the backend half of `app/`. All in-app paths come from `ROUTES` in `lib/routes.ts`; never hardcode them. Old `/detainee/*` URLs and other retired paths are permanently redirected in `next.config.ts`.

1. **Arrest** (`/arrest`, i18n keys `arrest.*`) — Where was the person **arrested**? State (required, via `StateCombobox`) and city (optional, via `CityCombobox`, which queries `/api/places` and resolves to one or more `county_codes`).
2. **Detention** (`/detention`, i18n keys `detention.*`) — Does the user know where the person is **held**? (yes/no)
   - "No" → `/results` (unknown view)
   - "Yes" → `/facility`
3. **Facility** (`/facility`, i18n keys `facility.*`) — Which **state and facility** is the person detained in? Facility options are fetched from `/api/facilities?state=`. If the facility isn't listed, the user can either manually type a facility name or view guidance for finding the facility name (help links on the facility page).
   - Completion sets `knowsWhereHeld: true` and goes to `/results` (known view). The facility page also accepts users who answered "No", so the unknown view's "If you find them" link can send them here.

There is no loading interstitial: `Spinner` (`components/ui/spinner.tsx`) appears only while a request is in flight. `useFlowState().setFlow` writes localStorage synchronously, so a page can update state and navigate immediately.

Each step validates its own required fields before proceeding. Steps also guard against direct URL access by redirecting back to earlier steps when prerequisite state is missing.

`/results` is a single page: `app/results/page.tsx` guards the flow (redirecting to the first unanswered step) and renders `KnownResults` or `UnknownResults` (`results/_components/known/`, `.../unknown/`) based on `flow.detention.knowsWhereHeld`. Both views use the shared `ResultsLayout` (back link, title, location badges, intro, tab bar) and keep their own data fetching, tab state and modals; each tab is its own component. `results/_lib/` holds the unknown view's view-model `types.ts` and Supabase→view-model `mappers.ts`. Static legal explainers: `/learn-more/bonds`, `/learn-more/habeas`.

### State Management (`lib/flow/`)

Client-side flow selections are managed by `useFlowState` (`lib/flow/useFlowState.tsx`). It:
- Reads/writes a `FlowState` object to `localStorage` under `FLOW_STORAGE_KEY` (`ijl_detainee_flow_v1`, kept unchanged so in-progress sessions survive; defined in `lib/flow/storageKeys.ts`), validating shape on read via `isValidFlowState` (drops and resets on anything malformed)
- Exposes `{ flow, setFlow, hydrated, reset }`
- Returns `hydrated: false` until the localStorage read completes (via `useLayoutEffect` to avoid a blank-state flash) — pages render `null` until hydrated
- The homepage calls `reset()` on mount to clear any previous session

The state shape is defined in `lib/flow/types.ts`:
```ts
FlowState = {
  arrest: { state: string; city: string | null; county_codes: string[] | null }
  detention: { knowsWhereHeld: boolean | null; detainedState: string | null; facilityId: string | null }
}
```

### Repo layout: frontend / backend / data

- **Frontend:** `app/` pages (everything except `app/api/`), `app/layout.tsx` + `globals.css`, `components/`, `lib/` (flow, i18n, routes, utils, static `lib/constants/` lookups), `public/`, `scripts/translate.ts`
- **Backend:** `app/api/` (thin handlers; Next requires them under `app/`), `server/` (`supabase.ts`, `queries.ts`, `types.ts`, `geo.ts`), `proxy.ts` (rate limit; must stay at the root)
- **Data:** `data/` — the Python Sheet-of-Record → Supabase pipeline (`publish_local_orgs.py`, `make_publish.py`, `publish_to_supabase.py`); `data/parquets/` and `data/update_xlsx/` are gitignored local data. Only `data/README.md` is committed; the scripts themselves are kept local, so a fresh clone won't have them. Run scripts from the repo root. The app never imports from `data/`.

### Backend (`app/api/`, `server/`)

All geographic/facility/organization data comes from Supabase, accessed only through Next.js API routes (the browser never talks to Supabase directly). `server/supabase.ts` and `server/queries.ts` `import "server-only"`, so importing them from frontend code fails the build; frontend code may import types (only) from `server/types.ts`, which holds every API response shape including `PlaceResult`:

- `GET /api/places?state=&q=` — autocomplete city search, grouped by `place_display` with associated `county_codes` (backs `CityCombobox`)
- `GET /api/facilities?state=` — facilities for a detained-state (backs the facility page `Select`)
- `GET /api/results/known?facilityCode=` — full results bundle for a known facility (facility details, field office, district court, local orgs) via `getResultsData`
- `GET /api/results/unknown?state=&countyCodes=` — results bundle when the facility is unknown, scoped by county codes or falling back to state-wide

Query logic lives in `server/queries.ts`, which reads from Supabase tables including `facilities_live`, `place_county`, `county_field_office`, `field_offices`, `county_district`, `us_districts_addresses`, `org_county_coverage`, and `local_orgs`. `STATE_ABBREVIATIONS` (`lib/constants/stateAbbreviations.ts`) bridges full state names to the abbreviation-prefixed county codes (e.g. `NE_Lincoln`) used throughout.

### Internationalization (`lib/i18n/`)

i18n is implemented, not just a UI stub:
- `lib/i18n/strings.ts` — the source-of-truth registry of English strings, keyed by page/component (e.g. `arrest.title`)
- `lib/i18n/LanguageContext.tsx` — defines `Lang` (`en | es | ar | ht | vi | pt | zh-CN`) and the `useLanguage()` hook exposing `{ lang, setLang, t, loading }`
- `lib/i18n/LanguageProvider.tsx` — on language switch, fetches `/locales/{lang}.json`, caches it in `localStorage` keyed by a checksum of `STRINGS` (so edits to English source strings invalidate stale cached translations), and persists the chosen language across sessions
- `components/layout/LanguageToggle.tsx` — the language `<select>` in the header
- `scripts/translate.ts` (`npm run translate`) — generates `public/locales/*.json` by calling the free MyMemory translation API, hashing each source string to only re-translate what changed (tracked in `public/locales/.hashes.json`)
- `.github/workflows/translate.yml` — runs the translate script daily at 6am UTC (or manually from the Actions tab) and commits updated locale files with `[skip ci]`; it does not run on push

### Styling

- **Tailwind CSS v4** with PostCSS — no `tailwind.config.js` (v4 uses `postcss.config.mjs`)
- Design tokens defined as CSS custom properties in `app/globals.css`:
  - `--ijl-navy`, `--ijl-title`, `--ijl-accent` (`#5A5A8A`), `--ijl-muted`, `--ijl-border`, `--ijl-cta-bg`
  - `--font-proxima` (Proxima Nova loaded via `@font-face` from `/public/fonts/`)
- **Fonts**: Oswald (via `next/font/google`) and Proxima Nova (local woff2 files)
- Use the `.oswald` CSS class to apply Oswald font (not Tailwind utility)
- The app is fixed to light mode — no dark mode support

### UI Components

- `components/ui/select.tsx` — Radix UI `@radix-ui/react-select` wrapper (used for the facility dropdown); `components/ui/select-scroll-fix.tsx` undoes Radix's body scroll lock
- `components/ui/state-combobox.tsx`, `components/ui/city-combobox.tsx` — hand-rolled accessible comboboxes (not Radix) with keyboard nav, used on the arrest page (state + city) and the facility page (state). State options come from `lib/constants/usStates.json`.
- `components/ui/button.tsx`, `components/ui/spinner.tsx` — shared button and in-flight loading indicator
- `components/layout/` — `Header`, `Footer`, `LanguageToggle`, `BackButton`, and `Container` (centered `max-w-[1200px]` wrapper)
- `components/Modal.tsx` — the shared modal dialog used by both results pages
- Convention: a component used by one page lives in that page's `_components/` folder (non-component helpers in `_lib/`); promote it to `components/` once a second page needs it
- `lib/utils.ts` — `cn()` helper using `clsx` + `tailwind-merge`, plus `sanitizeUrl()` used before rendering user-facing external links on the results pages

### Layout

`app/layout.tsx` wraps all pages with `<LanguageProvider>`, `<Header>`, and `<Footer>` (plus `<SelectScrollFix />`), and mounts Vercel `<Analytics />` and `<SpeedInsights />`. The `<Header>` includes the IJL logo (served from `/public/IJLlogo.png`) and `<LanguageToggle>`, which now drives real i18n (see above), not just local UI state.
