# jared-hwang.github.io (redesign2)

Astro static site with plain CSS. Font: Hind Vadodara.

## Run it

```sh
npm run dev      # http://localhost:4321  — site
                 # http://localhost:4321/admin — content admin (dev only)
npm run build    # static output in dist/ (no admin page)
```

## Adding content

Use **/admin** while `npm run dev` is running. Each tab lists what exists (with **Edit** and **Delete**) above a form for adding a new one:

- **Publication**: drop in the PDF. It's copied to `public/files/<id>.pdf`, and a
  thumbnail is generated from page 1 (macOS `qlmanage`). It can also post a news item.
- **Project**: thumbnail goes to `public/images/research_thumbs/`, and the project is
  added to the chosen research themes.
- **News item**
- **Research Themes** and **Home Intro** (heading, photo + crop, intro text, CV, contact links): edit only.

On a project, the **page image** (image, GIF, or short .mp4/.webm) is the big image on `/projects/<id>`; without one the thumbnail is used. The body editor's buttons embed YouTube/Vimeo videos and upload images/videos to `public/images/projects/<id>/`, inserting them at the cursor.

New entries never overwrite an existing file. Editing changes only the fields in the form and keeps comments and other fields as they are. Delete shows everything it will remove before you confirm; PDFs and images are deleted only if nothing else uses them.
Afterwards, review with `git status` and commit.

## Where things live

| What | File(s) |
| --- | --- |
| Intro text, photo, CV / social links | `src/content/profile/profile.md` (layout in `src/components/Hero.astro`) |
| Research theme tiles (blurb = body) | `src/content/themes/*.md`; images at `public/images/themes/<id>.jpg` |
| Publications | `src/content/publications/*.md` (`themes:` links to theme tiles) |
| Projects (`/projects/<id>`) | `src/content/projects/*.md`; page images and body media in `public/images/projects/<id>/` |
| News | `src/content/news/*.md` |
| Colors, sizes, fonts | `src/styles/global.css` (`:root` tokens) |
| News rail spacing | `TOP_GAP` / `BOTTOM_GAP` / `MIN_SPACING` in `src/components/NewsRail.astro` |
