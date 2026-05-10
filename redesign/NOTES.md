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
