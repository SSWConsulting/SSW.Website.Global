# Agent guide — SSW.Website.Global

Astro + TinaCMS site, pnpm. Visual editing branch of `tina-astro-starter`.

## Every change goes through a PR — never push to `main`

Work flows through GitHub, not direct local commits to `main`. For each task:

1. Start from latest `main` (`git checkout main && git pull --ff-only`)
2. Create a branch with a typed prefix: `feature/...`, `fix/...`, `chore/...`, `docs/...`
3. Make the change, commit, push the branch
4. Open a PR against `main` with `gh pr create --base main --head <branch> --title "…" --body-file <path>`
5. Wait for automated reviews (Copilot, CodeRabbit) and address their feedback in follow-up commits on the same branch
6. Treat the task as done only when the user merges the PR in GitHub
7. After merge, `git checkout main && git pull && git branch -d <branch>` before starting the next task

Don't bundle unrelated changes into one PR. If you spot something worth fixing while doing task A, open a separate branch + PR for it (or note it as a follow-up).

The only exception is hotfixes the user explicitly authorises.

## The one rule that matters

**Every piece of content on every page must be editable via the Tina editor (`/admin/`).** Never hardcode user-visible text, images, links, or list items into `.astro` files. If you're about to type a sentence the user might want to change later, stop and model it as a Tina field first.

This means:
- New section → new fields in a Tina collection, new data in the matching content file, then read it in the component
- New page → new collection (or new file in an existing collection) before any markup
- Every rendered text node should have a `data-tina-field={tinaField(parent, 'fieldName')}` so inline editing works
- Lists render from `data.collection.items.map(...)`, not from JSX literals — and each item's editable fields get their own `tinaField()`

The only things that are OK to hardcode are decorative chrome (icons, dots, divider lines) and structural CSS classes.

## Stack

- **Astro 5** — file-based routing under `src/pages/`, components in `src/components/`
- **TinaCMS 3** (visual-editing canary) — `@tinacms/astro` integration, schema in `tina/`, content in `src/content/`
- **pnpm 10** (pinned via `packageManager`) — package manager; native build approvals in `pnpm.onlyBuiltDependencies` (`package.json`)
- **Font Awesome 6** for icons, **Inter** variable font, design tokens in `public/assets/colors_and_type.css`
- Tina's local backend uses `better-sqlite3` (native); `sharp` powers Astro images. Both pre-approved in `pnpm.onlyBuiltDependencies` (`package.json`).

## Where things live

```
tina/
  config.ts                 # Register collections here
  collections/              # One file per content type
src/
  content/
    landing/home.json       # Homepage data — every section editable
    page/*.mdx              # Other pages (rich-text body)
    blog/*.mdx              # Blog posts
    config/config.json      # Global site config
  components/islands/       # Editable regions — re-rendered live by Tina bridge
  lib/
    data.ts                 # requestWithMetadata-wrapped Tina queries
    islands.ts              # Island registry (one entry per editable region)
  pages/                    # Astro routes
  styles/                   # Global CSS
public/
  assets/                   # Logos, fonts, design tokens CSS
  admin/                    # Tina admin UI (built artifact + bridge.js)
```

## How to add a new editable section

1. **Schema**: add fields to the relevant collection in `tina/collections/*.ts` (use `object`, `list: true`, `ui.itemProps` for list labels)
2. **Content**: add the corresponding data to the matching file in `src/content/...`
3. **Render**: in the island component, map over `data.section.items` and wrap each editable text with `data-tina-field={tinaField(item, 'fieldName')}`
4. **No new collection needed?** Skip to step 2-3
5. **New collection?** Create the file, import it in `tina/config.ts`, add a `get<Name>` query in `src/lib/data.ts`, and an island entry in `src/lib/islands.ts`

## Dev workflow

```bash
pnpm install          # native builds run automatically (pnpm.onlyBuiltDependencies)
pnpm run dev          # Tina dev server (port 4001 GraphQL) + Astro (port 4321)
pnpm run build        # production build (Tina + Astro); needs Tina cloud creds
pnpm run build:local  # fully local build, no cloud creds
```

### Test the Cloudflare Workers runtime locally

```bash
# Serve the built site in the real Workers runtime (workerd) via wrangler dev —
# exercises asset serving, the Tina SSR edit endpoint and bindings like CF does.
pnpm run build:local && pnpm run preview:cf     # http://localhost:8787
```

Visit `/admin/index.html` to open the Tina editor. Inline visual editing works on any element with a `data-tina-field` attribute.

## Conventions

- Keep islands lean — they SSR and re-render on edits, so heavy logic belongs upstream in `lib/`
- For list items, pass the item object (not the parent + index) into `tinaField()` so the editor can scope edits correctly
- Don't break the homepage rule by adding a "for now" hardcoded string. Add the field.
- Use Font Awesome class names as strings in content (`"fa-robot"`) — icons render with `<i class={\`fa-solid ${icon}\`}>`
- Use US English, sentence case, Inter font, brand red `#cc4141`. No emoji in UI copy.

## Testing changes

After any content-structure change, **restart the dev server** so Tina regenerates `tina/__generated__/{client,types}.ts`. Without a restart, the GraphQL client and TypeScript types lag behind the schema.

When verifying inline editing, open `/admin/` and confirm: (a) the new fields appear in the sidebar, (b) edits propagate live to the page preview, (c) saving writes the expected JSON/MDX on disk.

## Gotchas

- **Every page must include `<ClientRouter />`** in the `<head>`. The Tina bridge listens on `astro:page-load` to re-sync forms; without it, the initial prime succeeds but live edits in the sidebar never reach the iframe. `Base.astro` already includes it via `BaseHead.astro` — pages that bypass Base (like a custom shell) must add `import { ClientRouter } from 'astro:transitions'` and render `<ClientRouter />` themselves.

- **Tina Cloud's schema lags the repo.** Adding a new field to `tina/collections/*.ts` only takes effect locally with `pnpm run build:local` (uses `--local`, in-process datalayer against the repo). Cloudflare's `pnpm run build` script uses `--content=local --skip-cloud-checks`, but the generated GraphQL client still issues queries against Tina Cloud's schema at prerender time. If Tina Cloud doesn't know about the field, the query fails:

  ```
  [@tinacms/astro] client query failed
    Cannot query field "<newField>" on type "<...>".
  ```

  `getLanding(...)` returns null, the route's `if (!data) return new Response('Not Found', { status: 404 })` fires, and the 9-byte "Not Found" body gets prerendered as `dist/<route>/index.html`. The deploy "succeeds" but the URL serves "Not Found".

  **Symptoms to recognise:** the page returns HTTP 200 with `content-type: text/html` and a body that's literally `Not Found`. Other routes that don't query the new field still work, so it looks like a routing bug — but it's actually a Tina-side schema mismatch.

  **Before pushing a PR that adds a new schema field:**
  1. Reproduce the prod build locally — `rm -rf dist && SITE_URL=https://... pnpm run build` — and check `dist/<affected-route>/index.html` is real HTML, not the 9-byte body
  2. If it errors with "Cannot query field", trigger a Tina Cloud schema sync (Settings → Rebuild on app.tina.io) *before* the Cloudflare deploy goes out
  3. Or split it into two PRs: schema-only first (so Tina Cloud rebuilds), then a follow-up that reads the field

  This bit us in PR #14 → #15 on 2026-05-22. See PR #15's description for the full incident.
