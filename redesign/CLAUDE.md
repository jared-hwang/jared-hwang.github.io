# Redesign — Context for Claude

This file gives a future Claude instance the context to work productively on the redesign without re-reading every file. Pair with `NOTES.md` (chronological iteration log) for *why* things are the way they are.

## What this is

The user (Jared, UW CSE PhD student) is rebuilding his personal site `jared-hwang.github.io` from a Jekyll + academicpages template into a custom **Astro 6 + Tailwind v4** site. This `redesign/` subdirectory holds the new build. The existing Jekyll site at the repo root continues to serve the live URL via GitHub Pages until cutover.

The user has minimal frontend experience — explain things accessibly when proposing changes.

## Current state

Pages are functional end-to-end. Content (research, publications, news) is migrated from Jekyll collections. Look-and-feel is intentionally minimal so the design can evolve. No GitHub Actions deploy workflow yet — that's deferred until ready to cut over.

- `/` — **wider layout** (`max-w-6xl`) with a left sidebar (`AuthorProfile`: avatar, name, bio, location, socials) at 1/4 width and blurb + news timeline at 3/4. Sidebar is sticky on desktop, stacked on mobile. Social links are full buttons on desktop and tucked behind a "Socials" `<details>` dropdown on mobile.
- `/research` — `max-w-3xl`, single-column. Accordion of current/past projects (click to expand, smooth height transition, one-open-at-a-time).
- `/publications` — `max-w-3xl`, single-column. Year-grouped, Selected/All toggle (defaults to Selected).
- Dark-mode toggle in nav (sun/moon button), persists in `localStorage`, respects `prefers-color-scheme` on first visit

## Architecture

```
redesign/
  astro.config.mjs           # Astro + Tailwind v4 vite plugin
  src/
    consts.ts                # SITE: title, author, email, bio, location, avatar, social links, nav
    content.config.ts        # Zod schemas for the 3 collections
    content/
      research/*.md          # mirrors repo-root _research/, frontmatter intact (Liquid {% include %} stripped)
      publications/*.md      # mirrors repo-root _publications/, frontmatter intact
      news/*.md              # NEW collection — extracted from old _pages/about.md
    layouts/
      Base.astro             # html shell, header, footer, dark-mode pre-paint script.
                             # Accepts `wide?: boolean` — when true, swaps max-w-3xl → max-w-6xl on header/main/footer.
    components/
      NewsTimeline.astro     # vertical timeline reading news collection
      ResearchAccordion.astro # accordion list, expects `status: "current" | "past"` prop
      ThemeToggle.astro      # sun/moon button, toggles .dark on <html>
      AuthorProfile.astro    # home-page sidebar: avatar + name + bio + location + socials.
                             # Mobile shows socials behind a <details> dropdown; desktop shows them inline.
                             # Two renders of the social list (mobile+desktop) share <SocialLink>.
      SocialLink.astro       # one social <li> with platform icon + label + rainbow-border-sheen styles
    pages/
      index.astro            # home: <Base wide> + 2-col grid (md:grid-cols-4: AuthorProfile in col-1, blurb+news in col-span-3)
      research.astro         # two <ResearchAccordion> instances + accordion JS
      publications.astro     # year-grouped pubs + Selected/All toggle JS
    styles/
      global.css             # @import "tailwindcss" + dark @custom-variant + accent palette + base bold rule
  public/
    favicon.{ico,svg}
    images   -> ../../images   (symlink)
    files    -> ../../files    (symlink)
    cv_file  -> ../../cv_file  (symlink)
  NOTES.md                   # iteration log, reverse-chronological
  CLAUDE.md                  # this file
```

The repo-root `_config.yml` excludes `redesign/` from Jekyll's build so the two coexist.

## Key decisions & conventions

### Tailwind v4 (CSS-first config)
v4 is meaningfully different from v3 — there's **no `tailwind.config.js`**. Theme tokens, custom variants, and base rules live inside `global.css`:

- `@import "tailwindcss";` brings in core
- `@custom-variant dark (&:where(.dark, .dark *));` enables `dark:` utilities when `.dark` is on a parent
- `@theme { --color-accent-50: oklch(...); ... }` defines custom palette colors usable as `bg-accent-600`, `text-accent-300`, etc.
- `@layer base { ... }` for global element styling (e.g. the `strong { color: ... }` rule)

If you reach for `tailwind.config.js`, stop — you're thinking in v3.

### Accent color — single-knob palette
`global.css` defines the full accent palette (50→950) by interpolating off two CSS variables:

```css
--accent-hue: 145;       /* forest green; OKLCH degrees */
--accent-chroma: 0.13;   /* saturation */
```

To change the entire site's accent, change ONE of those values. Common hues: red 25, orange 60, yellow 95, green 145, teal 180, blue 250, purple 305, pink 350. Don't change individual `--color-accent-NNN` lines — the formula is meant to scale together.

### Where the accent gets used
- **Bold text** (`<strong>`, `<b>`) — site-wide via `@layer base` rule. This is intentional and was an explicit user request.
- Link underline decoration on home + tags on research
- Daterange labels on research
- Publication title links and link-row labels (PDF, DOI, etc.)
- Filter-toggle "active" state on /publications (`aria-pressed:bg-accent-600`)

What the accent is **NOT** used for: news timeline line/dots (kept neutral grey by user request), nav links, body text, headers, primary UI chrome.

### Dark mode
- Pre-paint inline `<script is:inline>` in `Base.astro` reads `localStorage.theme` (or `prefers-color-scheme: dark`) and toggles `.dark` on `<html>` before first paint to avoid flash.
- `ThemeToggle.astro` flips the class and writes `localStorage.theme`.
- Use `dark:` variants on every utility that has color — there's no auto-inversion.

### Content collections
All three are loaded via the `glob()` loader pointed at `./src/content/<name>/`. Frontmatter is validated against Zod schemas in `src/content.config.ts`. Unknown frontmatter fields are silently dropped — Jekyll-only fields (`collection`, `permalink`, `type`, etc.) are kept in the markdown files but ignored.

Date handling gotcha: dates are parsed as UTC. When formatting for display, **always pass `timeZone: "UTC"`** to `Intl.DateTimeFormat` or you'll get off-by-one-day in the user's local timezone (the user is in PST so `2025-05-01` → "Apr 30" without the UTC option).

### Public assets via symlinks
`public/images`, `public/files`, `public/cv_file` are symlinks pointing to the repo-root directories so we don't duplicate ~73MB of assets during the iteration phase. Existing absolute paths (`/images/foo.png`, `/files/bar.pdf`) in frontmatter and markdown bodies just work. Astro's static-asset handling follows the symlinks during build.

If you ever need to copy them as real files, that's the cutover step — handle then, not now.

## How to make common changes

### Change the accent color
Edit `--accent-hue` (and optionally `--accent-chroma`) in `redesign/src/styles/global.css`. Done.

### Add a news entry
Create `src/content/news/YYYY-MM-slug.md`. Frontmatter:
```yaml
---
date: 2026-05-12     # required, ISO date
link: https://...    # optional
---
Body markdown here. Bolds and links work.
```
Reverse-chrono sort is automatic.

### Add a research project
Create `src/content/research/slug.md`. Required frontmatter: `title`, `status: current | past`, `thumbnail`, `excerpt`. Optional: `thumbnail_alt`, `venue`, `daterange`, `date`, `location`, `supervisor`, `tags`. Body markdown is what shows when the accordion is expanded.

### Add a publication
Create `src/content/publications/YYYY-MM-DD-slug.md`. Required: `title`, `date`. Common optional: `selected: true` (shows in default Selected view), `venue`, `paperurl`, `arxiv`, `doi`, `code`, `slides`, `video`, `authors` (HTML allowed — `<b>Jared Hwang</b>` to bold his name), `thumbnail`, `award`, `acceptance_rate`. The author and title fields are rendered via `set:html` so HTML in them renders.

### Add a new page
Create `src/pages/foo.astro`, wrap in `<Base title="Foo">`. Add to `SITE.nav` in `src/consts.ts` to surface it in the header.

### Restart the dev server
`cd redesign && npm run dev` (port 4321). Astro picks up content changes live but **needs a manual restart when `content.config.ts` is created or its schema shape changes** — a known Astro behavior.

## Gotchas

- **Liquid leftovers** in research markdown: 3 of 5 research files originally had `{% include research-publications.html %}` at the end. Stripped during migration. If the user adds a new research file by copying an old Jekyll one, watch for these.
- **Frontmatter HTML** (e.g., `<b>Jared Hwang</b>` in author bylines, `<em>I</em>` in titles): these need `set:html` at the render site. Astro escapes by default.
- **Timezone on dates**: see content collections section above.
- **Tailwind v4 vs v3**: see Tailwind section above. Don't suggest `tailwind.config.js`.
- **Symlinks**: don't `rm -rf` `public/images`, `public/files`, or `public/cv_file` thinking they're local copies — they're symlinks to repo-root.
- **`<style is:global>` HMR is broken** in the Astro 6.3 dev server — edits don't push to the browser without a full server restart. Prefer scoped `<style>` blocks. If a selector needs to reach a child component (e.g., `.social-link a` matching an `<a>` rendered in `SocialLink.astro` from a parent's style block), put the style in the child component itself.
- **`<details>` content visibility can't be CSS-overridden reliably** — author CSS like `.foo > ul { display: block }` does NOT make a closed `<details>`'s children visible in real browsers, even at higher specificity, because the rendering engine hides them below the cascade. Don't rely on this. The mobile-socials dropdown uses dual-render (`<details class="md:hidden">` + `<ul class="hidden md:block">`) instead.
- **Killing the dev server hard breaks the user's open browser tab.** If you must restart, send `SIGINT` (`lsof -ti:4321 | xargs kill -INT`) or just edit a file and let HMR do its thing — don't `kill` (default SIGTERM) without warning.

## Open / decided-later

- **Typography** — currently system stack (Tailwind defaults). User mentioned considering a webfont but no decision yet.
- **Width** — `/` is `max-w-6xl` (so it can fit the sidebar); `/research` and `/publications` are `max-w-3xl`. Other pages should default to `<Base>` (no `wide` prop) unless they also need a sidebar.
- **Original "expanding thumbnail" accordion effect** — current accordion keeps thumbnail size constant and animates only the detail panel. The Jekyll version had a fancier thumbnail-grows-to-full-width animation. Re-add only if asked.
- **Mobile QA** — basic responsive breakpoints exist but haven't been tested in a real device sweep.
- **Deployment cutover** — plan is GitHub Actions workflow that builds `redesign/` and deploys via `actions/deploy-pages`. Switch GitHub Pages source from "Deploy from a branch" to "GitHub Actions" at cutover time. Until then the existing Jekyll deploy keeps working untouched. See the original plan file at `~/.claude/plans/i-want-to-do-snuggly-allen.md` for the full sequence.

## Pointers

- `redesign/NOTES.md` — chronological iteration log, includes *why* of past decisions and what didn't work
- `../.claude/CLAUDE.md` — repo-root project instructions (rules about not loading data files, asking before installing packages, etc.)
- `~/.claude/plans/i-want-to-do-snuggly-allen.md` — original implementation plan, including the deferred deployment steps
