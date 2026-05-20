# SSW.Website.Global

Marketing site for **SSW Global** — SSW's offering for the United States market, built around vibe-coded software delivery.

## What we do

SSW Global ships enterprise software for North American clients, with delivery led by a **US-based Scrum Master** and engineering capacity drawn from one of two pools:

- **Australian consultants** — senior SSW engineers and architects with three decades of enterprise consulting practice
- **China-based team** — a cost-effective alternative for projects where budget is the primary constraint

Both routes run on the same Scrum cadence, the same engineering standards, and the same US-aligned communication layer, so clients pick the team shape that fits the project.

## Stack

- [Astro 5](https://astro.build) for the site, static output with the Vercel adapter
- [TinaCMS](https://tina.io) (visual-editing canary) for content — every section is editable via `/admin/`
- pnpm for package management; Font Awesome 6 + Inter for the design system

## Local development

```sh
pnpm install
pnpm run dev      # Tina dev server on :4001, Astro on :4321
```

Open the site at [http://localhost:4321/](http://localhost:4321/) and the CMS at [http://localhost:4321/admin/](http://localhost:4321/admin/).

## Editing content

The homepage, nav, hero, capabilities, testimonial, FAQ, contact form copy, and footer all live in `src/content/landing/home.json` and are editable through the **Landing page** collection in Tina. Save in `/admin/` and the JSON file updates on disk; live preview reflects changes as you type.

## Contributing

See [AGENTS.md](./AGENTS.md). The short version: **never hardcode user-visible copy into `.astro` files** — model it as a Tina field first, then render from data.
