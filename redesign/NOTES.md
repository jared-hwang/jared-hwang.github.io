# Redesign iteration log

Reverse-chronological. One entry per non-trivial decision or experiment.

---

## 2026-05-09 — Initial scaffold + homepage stub + news timeline

**Decision:** Astro 6 + Tailwind v4 in `/redesign/`. Iterate here while Jekyll keeps serving the live site. Cut over later via GitHub Actions.

**Rationale:**
- Astro content collections map cleanly onto Jekyll's `_research/` and `_publications/` (frontmatter markdown stays as-is). Schema validation via Zod replaces ad-hoc Jekyll defaults.
- Tailwind v4 utility classes are easier to reason about than maintaining a separate SCSS theme. Dark mode is one custom variant declaration.
- Subdirectory keeps current site live; `redesign/` is excluded from Jekyll's build via `_config.yml` exclude list.

**Tried:**
- `npm create astro@latest redesign -- --template minimal --typescript strict --install --no-git`
- `npx astro add tailwind` (Tailwind v4 → CSS-first config; no `tailwind.config.js`)
- Symlinked `images/`, `files/`, `cv_file/` from repo root into `redesign/public/` (avoids 70MB+ duplication during iteration)
- Built `Base.astro` layout with header, nav, footer, dark-mode pre-paint script
- Wrote `content.config.ts` with Zod schemas for `research`, `publications`, `news` collections
- Migrated 5 research markdowns + 5 publication markdowns. Stripped 3 Liquid `{% include research-publications.html %}` tags from research files.
- Extracted 4 news entries from `_pages/about.md` "Recent news" into `src/content/news/*.md`
- Built `NewsTimeline.astro` consuming the news collection — vertical line + dots + dates + rendered markdown body

**Worked:**
- All three pages (home, /research stub, /publications stub) render 200 OK
- Schema validation passes on all 14 content files
- News timeline shows 4 entries reverse-chronological with correct dates after fixing UTC timezone bug in date formatter

**Didn't:**
- Initial date formatter showed dates one month early (e.g. May → Apr) — `2025-05-01` parses as UTC midnight, displays in local PST as Apr 30. Fix: `Intl.DateTimeFormat({ ..., timeZone: "UTC" })` in `NewsTimeline.astro`.
- Astro dev server didn't pick up the new `content.config.ts` until restarted; expected once-only on first creation.

**Next:**
- Visually compare live site vs. redesign and decide on design direction

---

## 2026-05-09 — Accent color, publications, research accordion, dark-mode toggle

**Decision:** Adopt forest-green accent (OKLCH hue 145), parameterized in `global.css` as a single `--accent-hue` value driving the full 50→950 palette.

**Why:** User asked for an accent that's easy to change later. By scaling lightness across 11 stops from one base hue+chroma, the entire palette shifts when those two values change.

**Tried / worked:**
- `@theme { --accent-hue: 145; --accent-chroma: 0.13; --color-accent-{50..950}: oklch(L calc(C*scale) hue); }` — a single line edit (e.g. `--accent-hue: 25`) shifts the whole site to red.
- Applied accent sparingly: timeline line + dot, link underline decorations on home, publication titles + links, research daterange + tag pills.
- News timeline dot was 2px off the line (positioned via `-left-[31px]` from `<li>` start, but math didn't account for the line being on the parent's left edge under `pl-6`). Fixed with `left:calc(-1.5rem + 0.5px); -translate-x-1/2` to center on the 1px line.
- Publications page: year-grouped (2026 / 2025 / 2023), Selected/All toggle as ARIA-pressed buttons. Toggle JS uses `[hidden]` attribute and re-evaluates section visibility (hides empty year sections).
- Research accordion: uses CSS grid-rows transition (`grid-template-rows: 0fr → 1fr`) for smooth height animation without JS measuring heights. Body content rendered via `render(entry).Content` from `astro:content`. Tag pills use accent-100 / accent-900/40 backgrounds.
- Dark mode: `ThemeToggle.astro` button in header. `<button>` flips `<html>` `dark` class and writes `localStorage.theme`. Pre-paint script in `Base.astro` reads `localStorage.theme` (or `prefers-color-scheme`) before first render to avoid flash. Sun/moon SVGs swap via `dark:hidden` / `hidden dark:block`.

**Didn't:**
- Original accordion's "expanding thumbnail" animation isn't reproduced — current accordion keeps thumbnail fixed-size and animates the detail panel only. If we want the thumbnail-grows-to-full-width effect back, that's a follow-up iteration.

**Next:**
- Visually QA in both light and dark modes
- Decide on typography (system stack vs. webfont)
- Test mobile layout
- Eventually: archive Jekyll → cut over via GitHub Actions workflow

---

## 2026-05-10 — Author sidebar (home only) + social buttons + rainbow border sheen

**Decision:** Bring back an academicpages-style author profile sidebar **on the home page only**. Other pages stay at `max-w-3xl`, single-column.

**Why:** User wanted the avatar/bio/socials prominent on the landing page without dominating research/publications views.

**Tried / worked:**
- Added `bio`, `location`, `avatar` to `SITE` in `consts.ts`. Avatar resolves to `/images/profile.jpg` via the existing public symlink.
- New `AuthorProfile.astro` — avatar, name, bio (rendered from `SITE.description` after a user inline edit), location with map-marker SVG, and social links list. `aside`, `author-name`, `author-bio`, `author-location`, `author-avatar`, `social-link`, `social-link-{platform}` classes added as styling hooks (no rules attached by default).
- `Base.astro` got a `wide?: boolean` prop. When true, swaps `max-w-3xl` → `max-w-6xl` on header / main / footer inner containers. Only `index.astro` opts in.
- `index.astro` wraps existing blurb + news in a 2-col grid: `md:grid-cols-4` with `<aside>` in col-1 and content in `md:col-span-3` (1/4 + 3/4 split, sidebar sticky on desktop).
- Social buttons styled as bordered rectangles with rounded corners, transparent background by default, accent-tinted background on hover. Icon SVG and text size consolidated to two single-knob places: parent `<ul>` `text-base` for label size, wrapper `<span>` `h-5 w-5` for icon size (each SVG uses `h-full w-full` to inherit).
- Mobile-only "Socials" dropdown (`<details>` with `<summary>` button) so socials don't dominate the small-screen view. Desktop always shows the list.
- Rainbow sheen on hover, restricted to the button **border** via the CSS gradient-border trick: pseudo-element with `padding: 1px` + `mask-composite: exclude` carves out the inner content-box, leaving only a 1px ring carrying the rainbow `linear-gradient`. Slow drift animation (7s cycle).
- Extracted `SocialLink.astro` to avoid duplicating the icon-switch markup across the mobile and desktop renders.
- Per-button tunable CSS custom properties: `--sheen-alpha`, `--sheen-thickness`, `--sheen-speed`, `--sheen-fade`. Live in `SocialLink.astro`'s scoped `<style>` block.

**Didn't (and how we worked around it):**
- **First attempt at the mobile dropdown** used a single `<details>` with `summary { md:hidden }` and a CSS `@media (min-width: 768px) { .socials-details > ul { display: block } }` override to keep the list visible on desktop. The CSS specificity was correct (verified in served output) but on real browsers the `<details>` hides non-summary children at the rendering tree level, below where author CSS can reach. Restructured to dual-render: a `<details class="md:hidden">` for mobile and a bare `<ul class="hidden md:block">` for desktop, sharing a `SocialLink.astro` sub-component to avoid duplication.
- **`<style is:global>` HMR is unreliable** in Astro 6.3 dev server — edits to global style blocks didn't push to the browser without a server restart. Removed `is:global` and split styles to live alongside the elements they target: `.social-link` rules in `SocialLink.astro`, `.socials-details` rules in `AuthorProfile.astro`. Scoped styles hot-reload correctly.

**Tunables exposed to user (live in source files, well-commented):**
- Sidebar/content split ratio: `md:grid-cols-4` + `md:col-span-3` in `pages/index.astro`
- Avatar size: `h-32 w-32` on `<img>` in `AuthorProfile.astro`
- Social text size: `text-base` on parent `<ul>` in `AuthorProfile.astro`
- Social icon size: `h-5 w-5` on wrapper `<span>` in `SocialLink.astro`
- Social button padding/height: `py-2.5` on `<a>` in `SocialLink.astro`
- Sheen color/speed/thickness: CSS custom properties at top of `.social-link a` in `SocialLink.astro`

**Next:**
- Typography decision (still system stack)
- Mobile QA in real device or DevTools mobile emulation
- Deployment cutover via GH Actions when ready
