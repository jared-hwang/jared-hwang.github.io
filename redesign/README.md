# redesign

Work-in-progress redesign of jared-hwang.github.io in Astro 6 + Tailwind v4. Lives in this subdirectory; the existing Jekyll site at the repo root continues to serve the live URL until cutover.

## Dev

```bash
cd redesign
npm run dev      # http://localhost:4321
npm run build    # static output → redesign/dist/
npm run preview  # preview the built output
```

## Layout

```
src/
  consts.ts                  # site title, author info, nav, social links
  content.config.ts          # Zod schemas for content collections
  content/
    research/*.md            # research projects (mirrors repo-root _research/)
    publications/*.md        # papers (mirrors repo-root _publications/)
    news/*.md                # one entry per news item (extracted from old about.md)
  layouts/
    Base.astro               # header, nav, footer, dark-mode wiring
  components/
    NewsTimeline.astro       # vertical timeline reading news collection
    (more to come)
  pages/
    index.astro              # home: blurb + news timeline
    research.astro           # research listing (stub)
    publications.astro       # publications listing (stub)
  styles/
    global.css               # @import "tailwindcss" + dark-mode @custom-variant
public/
  favicon.{ico,svg}
  images   -> ../../images   # symlink to repo-root images
  files    -> ../../files    # symlink to repo-root PDFs
  cv_file  -> ../../cv_file  # symlink to repo-root CV PDFs
```

## Iteration notes

See `NOTES.md` for the running log of design decisions, experiments, and what worked / didn't.

## Deployment (later)

The live site is served by Jekyll from the repo root via GitHub Pages. We deploy this redesign by:

1. Adding `.github/workflows/deploy.yml` that runs `cd redesign && npm ci && npm run build` and uploads `redesign/dist`.
2. Switching GitHub Pages source from "Deploy from a branch" to "GitHub Actions" in repo Settings → Pages.
3. At cutover, archive Jekyll on a `jekyll-archive` branch, move `redesign/*` to repo root, update workflow paths.

Until then the workflow is dormant and Jekyll keeps building from the default branch.
