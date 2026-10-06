# PullSheet web — notes for Claude

React rewrite of the PullSheet frontend: a single-user Pokémon collection and P&L tracker,
used mostly as an iPhone home-screen app, plus desktop. Live at
https://21grahams.github.io/pullsheet-web/. The goal is **feature parity** with the old app
(`21grahams/pullsheet`, which stays untouched until cutover). No new features except login,
the offline banner and removing the old Settings URL box.

The backend lives in `21grahams/pullsheet-backend` (private, `~/Pullsheet`). Its `api_*`
Postgres functions are this app's entire API.

## Stack and commands

Vite, React 19, TypeScript (strict), MUI, TanStack Query, supabase-js, react-router
(HashRouter), vite-plugin-pwa, Vitest + Testing Library, oxlint, Prettier. Node is pinned in
`.nvmrc` (use `nvm use`).

```sh
npm run dev         # local dev server (needs .env.local; copy .env.example)
npm run check       # lint + format check + typecheck + tests; CI runs this before deploying
npm run build
npm run gen:types   # regenerate src/types/database.ts after backend changes
```

Pushing to `main` deploys via GitHub Actions (`.github/workflows/deploy.yml`) only if
`npm run check` passes. Settings → About shows the build version (commit SHA); **check it on
each device before testing a change**, because an open page can run cached old code until it
reloads.

## Structure and conventions

- `src/api/`: the only place that calls Supabase. Typed wrappers around `api_*` RPCs.
- `src/hooks/`: one TanStack Query hook per query/mutation.
- `src/features/{auth,singles,sealed,summary,accounts}/`: screens.
- `src/lib/`: pure, unit-tested helpers (money/date formatting, per-card math).
- `src/theme/`: tokens copied from the old app's `:root`, plus the MUI theme. Don't redesign.

Rules:

- Market values from the API are **per unit**; multiply by quantity for totals. Generated types
  claim nullable values are numbers, so declare them `number | null` in `api/`.
- Never compute quarters or "today" from the device clock; use `api_get_context`.
- Every write sends a `requestId` generated **once per user action** and reused on retry.
  No optimistic updates (it's money data): refetch after success.
- Mutations fail fast offline (`networkMode: 'always'`). Never queue writes.
- Logout uses `signOut({ scope: 'local' })`, so other devices stay logged in.
- No magic links or OAuth redirects (iOS home-screen apps have separate storage), and
  `detectSessionInUrl: false`.
- Inputs at least 16px (iOS zoom). Bottom sheets: a shared bottom-anchored Drawer.
- Only the Supabase URL and **publishable** key ship in the bundle (they're public by design).
  Never a secret/service-role key.

## Working agreements (important)

- **Show code/diffs before committing**, even locally. **Ask before every push.**
- Desktop and iPhone both matter; say when something needs a real-device check.
- Small, reviewable steps.
- **Minimal comments.** Only add one when the code would mislead without it (a non-obvious
  "why"). No comments that just describe what the code does.

## Status

- Phase 0 (backend auth/RLS/API): done.
- Phase 1 (scaffold, theme, login, shell, PWA, CI): done 2026-10-06.
- Next: Phase 2, read-only screens (Singles with search/filters, Sealed groups, Summary,
  Retailer Accounts). Then 3 mutations, 4 polish/parity, 5 cutover.
- The app will be renamed later. Keep new identifiers name-neutral where cheap.
