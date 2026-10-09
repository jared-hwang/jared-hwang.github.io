// Local-only content admin: request handling (loaded by integration.mjs).
//
// Visit http://localhost:4321/admin to add, edit, and delete publications,
// projects, and news, and to edit the research themes and home-page intro. It writes markdown into src/content/ and files into
// public/ — review the changes with `git status` and commit them like any
// other edit.

import { execFile } from "node:child_process";
import { existsSync } from "node:fs";
import { mkdir, mkdtemp, readFile, readdir, rm, rmdir, unlink, writeFile } from "node:fs/promises";
import { tmpdir } from "node:os";
import path from "node:path";
import { Readable } from "node:stream";
import { fileURLToPath } from "node:url";
import { promisify } from "node:util";
import { docData, newDoc, parseDoc, serializeDoc, setValue } from "./frontmatter.mjs";

const run = promisify(execFile);

const ROOT = fileURLToPath(new URL("..", import.meta.url));
const CONTENT = path.join(ROOT, "src/content");
const PUBLIC = path.join(ROOT, "public");
const UI = fileURLToPath(new URL("./ui.html", import.meta.url));

const MY_NAME = "Jared Hwang"; // auto-bolded in author lists
const TYPES = ["publications", "projects", "news"];

// ─── Routing ──────────────────────────────────────────────────────────────

export async function handle(req, res) {
  const url = new URL(req.url, "http://localhost");
  const route = `${req.method} ${url.pathname}`;

  if (route === "GET /" || route === "GET ") {
    res.setHeader("Content-Type", "text/html; charset=utf-8");
    res.end(await readFile(UI, "utf8"));
    return;
  }
  if (route === "GET /api/meta") return json(res, 200, await getMeta());
  if (route === "GET /api/list") return json(res, 200, await listAll());
  if (route === "GET /api/entry") {
    const entry = await loadEntry(url.searchParams.get("type"), url.searchParams.get("key"));
    if (!entry) return json(res, 404, { error: "Entry not found." });
    // A project's themes are stored on the theme files, not the project.
    const themes =
      entry.type === "projects"
        ? (await loadAll("themes")).filter((t) => (docData(t.doc).projects ?? []).includes(entry.key)).map((t) => t.key)
        : undefined;
    return json(res, 200, { key: entry.key, data: docData(entry.doc), body: entry.doc.body, themes });
  }

  const posts = {
    "/api/publication": savePublication,
    "/api/project": saveProject,
    "/api/news": saveNews,
    "/api/theme": saveTheme,
    "/api/profile": saveProfile,
    "/api/media": uploadMedia,
    "/api/delete": deleteEntry,
  };
  if (req.method === "POST" && Object.hasOwn(posts, url.pathname)) {
    const result = await posts[url.pathname](await readForm(req));
    return json(res, result.error ? 400 : 200, result);
  }

  json(res, 404, { error: `No admin route for ${route}` });
}

function json(res, status, body) {
  res.statusCode = status;
  res.setHeader("Content-Type", "application/json");
  res.end(JSON.stringify(body));
}

/** Parse a multipart form using the built-in web Request API. */
async function readForm(req) {
  const request = new Request(`http://localhost${req.url}`, {
    method: req.method,
    headers: { "content-type": req.headers["content-type"] ?? "" },
    body: Readable.toWeb(req),
    duplex: "half",
  });
  return request.formData();
}

// ─── Reading content ──────────────────────────────────────────────────────

const mdPath = (type, key) => path.join(CONTENT, type, `${key}.md`);

/** Load one entry by collection + key (file name without .md), or null. */
async function loadEntry(type, key) {
  if (![...TYPES, "themes", "profile"].includes(type) || !/^[\w.-]+$/.test(key ?? "")) return null;
  const file = mdPath(type, key);
  if (!existsSync(file)) return null;
  return { type, key, file, doc: parseDoc(await readFile(file, "utf8")) };
}

async function loadAll(type) {
  const files = (await readdir(path.join(CONTENT, type))).filter((f) => f.endsWith(".md"));
  return Promise.all(files.map((f) => loadEntry(type, f.replace(/\.md$/, ""))));
}

async function getMeta() {
  const themes = (await loadAll("themes"))
    .map((e) => ({ id: e.key, ...docData(e.doc) }))
    .sort((a, b) => Number(a.order) - Number(b.order))
    .map((t) => ({ id: t.id, title: t.title }));
  const projects = (await loadAll("projects"))
    .map((e) => ({ id: e.key, title: docData(e.doc).short_title }))
    .sort((a, b) => a.title.localeCompare(b.title));
  return { themes, projects };
}

/** Everything the admin's lists show, newest first. */
async function listAll() {
  const byDate = (a, b) => String(b.date).localeCompare(String(a.date));
  const summarize = async (type, fn) => (await loadAll(type)).map((e) => ({ key: e.key, ...fn(docData(e.doc), e.doc) })).sort(byDate);
  return {
    publications: await summarize("publications", (d) => ({ title: d.title, date: d.date, note: d.venue_short ?? d.venue ?? "" })),
    projects: await summarize("projects", (d) => ({ title: d.short_title, date: d.start_date, note: d.status })),
    news: await summarize("news", (d, doc) => ({ title: doc.body.slice(0, 90), date: d.date, note: "" })),
    themes: (await loadAll("themes"))
      .map((e) => ({ key: e.key, order: Number(docData(e.doc).order), title: docData(e.doc).title }))
      .sort((a, b) => a.order - b.order)
      .map((t) => ({ key: t.key, title: t.title, date: `Tile ${t.order}`, note: "" })),
  };
}

// ─── Writing helpers ──────────────────────────────────────────────────────

const SLUG_RE = /^[a-z0-9]+(-[a-z0-9]+)*$/;
const DATE_RE = /^\d{4}-\d{2}-\d{2}$/;
const rel = (p) => path.relative(ROOT, p);
const publicPath = (url) => path.join(PUBLIC, url);

function slugify(text) {
  return text
    .toLowerCase()
    .replace(/<[^>]+>/g, "")
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-+|-+$/g, "")
    .slice(0, 60)
    .replace(/-+$/, "");
}

/** Form value as a trimmed string ("" if missing). */
const str = (form, key) => String(form.get(key) ?? "").trim();

/** Uploaded file, or null if the input was left empty. */
function upload(form, key) {
  const f = form.get(key);
  return f && typeof f === "object" && f.size > 0 ? f : null;
}

const extOf = (file) => path.extname(file.name).toLowerCase() || ".bin";
const bytes = async (file) => Buffer.from(await file.arrayBuffer());

/** Fail (without writing anything) if any target already exists. */
function checkFree(targets) {
  const taken = targets.filter((t) => existsSync(t));
  if (!taken.length) return null;
  return { error: `Already exists — pick a different id or remove it first:\n${taken.map(rel).join("\n")}` };
}

async function write(file, data) {
  await mkdir(path.dirname(file), { recursive: true });
  await writeFile(file, data);
  return rel(file);
}

/** Write the markdown: a fresh file, or the edited fields merged into the existing one. */
async function writeEntry(file, existing, fields, body) {
  if (!existing) return write(file, newDoc(fields, body));
  for (const [key, value] of Object.entries(fields)) setValue(existing.doc, key, value);
  existing.doc.body = body;
  return write(file, serializeDoc(existing.doc));
}

/** Render the first page of a PDF to a JPEG using macOS's built-in tools. */
async function pdfThumbnail(pdfBuffer, outFile) {
  const dir = await mkdtemp(path.join(tmpdir(), "admin-thumb-"));
  const pdf = path.join(dir, "paper.pdf");
  await writeFile(pdf, pdfBuffer);
  await run("qlmanage", ["-t", "-s", "1000", "-o", dir, pdf]);
  await mkdir(path.dirname(outFile), { recursive: true });
  await run("sips", ["-s", "format", "jpeg", "-s", "formatOptions", "82", `${pdf}.png`, "--out", outFile]);
  await rm(dir, { recursive: true });
  return rel(outFile);
}

/**
 * Save an uploaded image as a JPEG no larger than `maxPx` on its longest side
 * (macOS sips), so the site doesn't ship full-resolution camera photos.
 */
async function saveDownsampled(file, outFile, maxPx) {
  const dir = await mkdtemp(path.join(tmpdir(), "admin-img-"));
  const src = path.join(dir, `upload${extOf(file)}`);
  await writeFile(src, await bytes(file));
  const { stdout } = await run("sips", ["-g", "pixelWidth", "-g", "pixelHeight", src]);
  const longest = Math.max(...[...stdout.matchAll(/pixel(?:Width|Height): (\d+)/g)].map((m) => Number(m[1])));
  const resize = longest > maxPx ? ["-Z", String(maxPx)] : [];
  await mkdir(path.dirname(outFile), { recursive: true });
  await run("sips", ["-s", "format", "jpeg", "-s", "formatOptions", "78", ...resize, src, "--out", outFile]);
  await rm(dir, { recursive: true });
  return rel(outFile);
}

/** Set a theme's `projects:` as a bare list ([a, b]) to match the hand-written theme files. */
function setProjectList(themeDoc, ids) {
  const index = themeDoc.blocks.findIndex((b) => b.key === "projects");
  const block = { key: "projects", lines: [`projects: [${ids.join(", ")}]`] };
  if (index === -1) themeDoc.blocks.push(block);
  else themeDoc.blocks[index] = block;
}

/** Make `projectId` belong to exactly the given themes. Returns changed files. */
async function setProjectThemes(projectId, themeIds) {
  const changed = [];
  for (const theme of await loadAll("themes")) {
    const ids = docData(theme.doc).projects ?? [];
    const want = themeIds.includes(theme.key);
    if (want === ids.includes(projectId)) continue;
    setProjectList(theme.doc, want ? [...ids, projectId] : ids.filter((id) => id !== projectId));
    changed.push(await write(theme.file, serializeDoc(theme.doc)));
  }
  return changed;
}

/**
 * Image crop from the admin's crop editor: focal point ("40% 25%") and zoom.
 * `prefix` picks a second editor's fields (e.g. "hero_" for a project's page image).
 * Left empty when untouched, so the site's defaults apply.
 */
function cropFields(form, prefix = "") {
  const focus = str(form, `${prefix}focus`);
  const zoom = Number(str(form, `${prefix}zoom`) || 1);
  if (focus && !/^\d{1,3}% \d{1,3}%$/.test(focus)) return { error: `Unexpected crop position "${focus}".` };
  if (!(zoom >= 1 && zoom <= 4)) return { error: `Zoom must be between 1 and 4 (got ${str(form, `${prefix}zoom`)}).` };
  return { focus, zoom: zoom > 1 ? Math.round(zoom * 100) / 100 : "" };
}

/** Load the entry being edited (if `_edit` is set). */
async function editTarget(form, type) {
  const key = str(form, "_edit");
  if (!key) return { existing: null };
  const existing = await loadEntry(type, key);
  if (!existing) return { error: `Can't find the ${type} entry "${key}" to edit — was it deleted?` };
  return { existing };
}

// ─── Publications ─────────────────────────────────────────────────────────

async function savePublication(form) {
  const { existing, error } = await editTarget(form, "publications");
  if (error) return { error };
  const old = existing ? docData(existing.doc) : {};

  // The id names the PDF / thumbnail files. Existing entries use their file name minus the date.
  const id = existing ? existing.key.replace(/^\d{4}-\d{2}-\d{2}-/, "") : str(form, "id");
  const title = str(form, "title");
  const date = str(form, "date");
  let authors = str(form, "authors");
  const pdf = upload(form, "pdf");
  const thumb = upload(form, "thumbnail");
  const regenerate = form.get("regen_thumb") === "on";

  if (!existing && !SLUG_RE.test(id)) return { error: "Id must be lowercase letters, numbers, and dashes." };
  if (!title || !authors) return { error: "Title and authors are required." };
  if (!DATE_RE.test(date)) return { error: "Date is required." };
  if (pdf && extOf(pdf) !== ".pdf") return { error: "The PDF upload must be a .pdf file." };
  const crop = cropFields(form);
  if (crop.error) return crop;

  if (!authors.includes("<b>")) authors = authors.replace(new RegExp(MY_NAME, "i"), `<b>${MY_NAME}</b>`);

  // Where the PDF lives: keep an existing local path when replacing it.
  const pdfUrl = pdf ? (old.pdf?.startsWith("/files/") ? old.pdf : `/files/${id}.pdf`) : old.pdf;

  // Thumbnail: an uploaded image wins; otherwise make one from the PDF for new
  // entries, or when "regenerate" is ticked.
  let thumbUrl = old.thumbnail;
  let makeThumb = false;
  if (thumb) thumbUrl = `/images/publications/${id}${extOf(thumb)}`;
  else if ((pdf && !existing) || regenerate) {
    thumbUrl = `/images/publications/${id}.jpg`;
    makeThumb = true;
  }
  if (makeThumb && !pdf && !(pdfUrl?.startsWith("/files/") && existsSync(publicPath(pdfUrl)))) {
    return { error: "There's no local PDF to make a thumbnail from — upload one." };
  }

  const mdFile = existing ? existing.file : mdPath("publications", `${date}-${id}`);
  const newsText = existing ? "" : str(form, "news_text");
  const newsFile = newsText && mdPath("news", `${date}-${id}`);
  if (!existing) {
    const conflict = checkFree([mdFile, pdf && publicPath(pdfUrl), thumbUrl && publicPath(thumbUrl), newsFile].filter(Boolean));
    if (conflict) return conflict;
  }

  // Files first, markdown last, so a failure never leaves an entry pointing at missing files.
  const written = [];
  const pdfBuffer = pdf ? await bytes(pdf) : null;
  if (pdf) written.push(await write(publicPath(pdfUrl), pdfBuffer));
  if (thumb) written.push(await write(publicPath(thumbUrl), await bytes(thumb)));
  if (makeThumb) written.push(await pdfThumbnail(pdfBuffer ?? (await readFile(publicPath(pdfUrl))), publicPath(thumbUrl)));

  const fields = {
    title,
    date,
    selected: form.get("selected") === "on",
    venue: str(form, "venue"),
    venue_short: str(form, "venue_short"),
    authors,
    pdf: pdfUrl,
    thumbnail: thumbUrl,
    focus: crop.focus,
    zoom: crop.zoom,
    doi: str(form, "doi"),
    code: str(form, "code"),
    video: str(form, "video"),
    slides: str(form, "slides"),
    arxiv: str(form, "arxiv"),
    award: str(form, "award"),
    trophy: form.get("trophy") === "on",
    research_project: str(form, "research_project"),
    themes: form.getAll("themes").map(String),
  };
  written.push(await writeEntry(mdFile, existing, fields, str(form, "abstract")));

  if (newsText) {
    written.push(await write(newsFile, newDoc({ date, link: pdfUrl ?? fields.doi }, newsText)));
  }
  return { ok: true, written, view: "/#publications" };
}

// ─── Projects ─────────────────────────────────────────────────────────────

const MONTHS = ["jan", "feb", "mar", "apr", "may", "jun", "jul", "aug", "sep", "oct", "nov", "dec"];

/** Read a month written as 2026-01, 01-2026, 1/2026, Jan 2026, or January 2026 → "2026-01" (or null). */
function parseMonth(text) {
  const s = text.trim().toLowerCase().replace(/,/g, " ");
  let year;
  let month;
  let m;
  if ((m = s.match(/^(\d{4})[-/.](\d{1,2})(?:[-/.]\d{1,2})?$/))) [year, month] = [m[1], Number(m[2])];
  else if ((m = s.match(/^(\d{1,2})[-/.](\d{4})$/))) [year, month] = [m[2], Number(m[1])];
  else if ((m = s.match(/^([a-z]+)\.?\s+(\d{4})$/))) [year, month] = [m[2], MONTHS.indexOf(m[1].slice(0, 3)) + 1];
  else if ((m = s.match(/^(\d{4})\s+([a-z]+)\.?$/))) [year, month] = [m[1], MONTHS.indexOf(m[2].slice(0, 3)) + 1];
  if (!year || !(month >= 1 && month <= 12)) return null;
  return `${year}-${String(month).padStart(2, "0")}`;
}

async function saveProject(form) {
  const { existing, error } = await editTarget(form, "projects");
  if (error) return { error };
  const old = existing ? docData(existing.doc) : {};

  const id = existing ? existing.key : str(form, "id");
  const title = str(form, "title");
  const shortTitle = str(form, "short_title");
  const start = parseMonth(str(form, "start_date"));
  const end = parseMonth(str(form, "end_date"));
  const excerpt = str(form, "excerpt");
  const thumb = upload(form, "thumbnail");
  const hero = upload(form, "hero_image");
  const removeHero = form.get("remove_hero") === "on";

  if (!existing && !SLUG_RE.test(id)) return { error: "Id must be lowercase letters, numbers, and dashes." };
  if (!title || !shortTitle || !excerpt) return { error: "Title, short title, and excerpt are required." };
  if (!str(form, "start_date")) return { error: "Start month is required." };
  for (const [key, label, value] of [["start_date", "start", start], ["end_date", "end", end]]) {
    if (str(form, key) && !value) {
      return { error: `Couldn't read the ${label} month "${str(form, key)}" — try 2026-01, 01/2026, or Jan 2026.` };
    }
  }
  if (!thumb && !old.thumbnail) return { error: "A thumbnail image is required (it's the tile on the home page)." };
  if (hero && !MEDIA_EXTS.includes(extOf(hero))) return { error: `The page image must be one of: ${MEDIA_EXTS.join(" ")}` };
  const crop = cropFields(form);
  if (crop.error) return crop;
  const heroCrop = cropFields(form, "hero_");
  if (heroCrop.error) return heroCrop;

  const mdFile = existing ? existing.file : mdPath("projects", id);
  const thumbUrl = thumb ? `/images/research_thumbs/${id}${extOf(thumb)}` : old.thumbnail;
  // The page's own image lives with the project's other media.
  const heroPrefix = `/images/projects/${id}/hero.`;
  const heroUrl = hero ? `${heroPrefix}${extOf(hero).slice(1)}` : removeHero ? "" : old.hero_image;
  if (!existing) {
    const conflict = checkFree([mdFile, publicPath(thumbUrl), heroUrl && publicPath(heroUrl)].filter(Boolean));
    if (conflict) return conflict;
  }

  const month = (ym) =>
    new Date(`${ym}-01T00:00:00Z`).toLocaleString("en-US", { month: "short", year: "numeric", timeZone: "UTC" });

  const written = [];
  if (thumb) written.push(await write(publicPath(thumbUrl), await bytes(thumb)));
  if (hero) written.push(await write(publicPath(heroUrl), await bytes(hero)));
  // A replaced or removed page image of this project's own is now unused.
  if (old.hero_image && old.hero_image !== heroUrl && old.hero_image.startsWith(heroPrefix) && existsSync(publicPath(old.hero_image))) {
    await unlink(publicPath(old.hero_image));
    written.push(`(removed old ${rel(publicPath(old.hero_image))})`);
  }
  const fields = {
    title,
    short_title: shortTitle,
    status: end ? "past" : "current",
    thumbnail: thumbUrl,
    focus: crop.focus,
    zoom: crop.zoom,
    thumbnail_alt: str(form, "thumbnail_alt"),
    hero_image: heroUrl,
    hero_caption: str(form, "hero_caption"),
    hero_focus: heroUrl ? heroCrop.focus : "",
    hero_zoom: heroUrl ? heroCrop.zoom : "",
    hero_whole: Boolean(heroUrl) && form.get("hero_whole") === "on",
    venue: str(form, "venue"),
    daterange: `${month(start)} - ${end ? month(end) : "Present"}`,
    start_date: `${start}-01`,
    end_date: end ? `${end}-01` : "",
    location: str(form, "location"),
    supervisor: str(form, "supervisor"),
    excerpt,
    website: str(form, "website"),
    code: str(form, "code"),
    video: str(form, "video"),
    tags: str(form, "tags").split(",").map((t) => t.trim()).filter(Boolean),
  };
  written.push(await writeEntry(mdFile, existing, fields, str(form, "body") || excerpt));
  written.push(...(await setProjectThemes(id, form.getAll("themes").map(String))));
  return { ok: true, written, view: `/projects/${id}` };
}

// ─── News ─────────────────────────────────────────────────────────────────

async function saveNews(form) {
  const { existing, error } = await editTarget(form, "news");
  if (error) return { error };

  const date = str(form, "date");
  const text = str(form, "text");
  if (!DATE_RE.test(date)) return { error: "Date is required." };
  if (!text) return { error: "News text is required." };

  let file = existing?.file;
  if (!existing) {
    // Name the file after the first few words, using a Markdown link's text rather than its URL.
    const words = text.replace(/\[([^\]]*)\]\([^)]*\)/g, "$1").split(/\s+/);
    const slug = slugify(words.slice(0, 6).join(" ")) || "news";
    file = mdPath("news", `${date}-${slug}`);
    const conflict = checkFree([file]);
    if (conflict) return conflict;
  }
  const written = [await writeEntry(file, existing, { date, link: str(form, "link") }, text)];
  return { ok: true, written, view: "/" };
}

// ─── Research themes (edit only: the home page is laid out for three tiles) ──

async function saveTheme(form) {
  const { existing, error } = await editTarget(form, "themes");
  if (error) return { error };
  if (!existing) return { error: "Pick a theme to edit — new themes can't be added here." };
  const old = docData(existing.doc);

  const title = str(form, "title");
  const order = Number(str(form, "order"));
  const image = upload(form, "image");
  if (!title) return { error: "Title is required." };
  if (!Number.isInteger(order)) return { error: "Order must be a whole number (1 = leftmost tile)." };
  const crop = cropFields(form);
  if (crop.error) return crop;

  const written = [];
  let imageUrl = old.image;
  if (image) {
    imageUrl = `/images/themes/${existing.key}${extOf(image)}`;
    written.push(await write(publicPath(imageUrl), await bytes(image)));
    // A previous image for this theme with a different extension is now unused.
    if (old.image !== imageUrl && old.image?.startsWith(`/images/themes/${existing.key}.`) && existsSync(publicPath(old.image))) {
      await unlink(publicPath(old.image));
      written.push(`(removed old ${rel(publicPath(old.image))})`);
    }
  }

  setValue(existing.doc, "title", title);
  setValue(existing.doc, "order", order);
  setValue(existing.doc, "image", imageUrl);
  setValue(existing.doc, "focus", crop.focus);
  setValue(existing.doc, "zoom", crop.zoom);
  setProjectList(existing.doc, form.getAll("projects").map(String));
  existing.doc.body = str(form, "blurb");
  written.push(await write(existing.file, serializeDoc(existing.doc)));
  return { ok: true, written, view: `/#${existing.key}` };
}

// ─── Images / videos for a project page's body ───────────────────────────

const MEDIA_EXTS = [".png", ".jpg", ".jpeg", ".gif", ".webp", ".svg", ".mp4", ".webm", ".mov"];

/** Save a file to /images/projects/<id>/ and return its URL, for the admin to insert into the body. */
async function uploadMedia(form) {
  const id = str(form, "id");
  const file = upload(form, "file");
  if (!SLUG_RE.test(id)) return { error: "Fill in the project's id first — media is stored under /images/projects/<id>/." };
  if (!file) return { error: "No file was uploaded." };
  const ext = extOf(file);
  if (!MEDIA_EXTS.includes(ext)) return { error: `Unsupported file type ${ext}. Use one of: ${MEDIA_EXTS.join(" ")}` };

  const name = slugify(path.basename(file.name, path.extname(file.name))) || "media";
  const url = `/images/projects/${id}/${name}${ext}`;
  const conflict = checkFree([publicPath(url)]);
  if (conflict) return conflict;
  return { ok: true, url, written: [await write(publicPath(url), await bytes(file))] };
}

// ─── Home-page intro (one file: src/content/profile/profile.md) ───────────

async function saveProfile(form) {
  const existing = await loadEntry("profile", "profile");
  if (!existing) return { error: "Can't find src/content/profile/profile.md." };
  const old = docData(existing.doc);

  const heading = str(form, "heading");
  const email = str(form, "email");
  const photo = upload(form, "photo");
  const cv = upload(form, "cv");
  if (!heading || !email) return { error: "Heading and email are required." };
  if (!str(form, "body")) return { error: "The intro text can't be empty." };
  if (cv && extOf(cv) !== ".pdf") return { error: "The CV must be a .pdf file." };
  const crop = cropFields(form);
  if (crop.error) return crop;

  const written = [];
  // Photos uploaded here are downsized to /images/profile/photo.jpg, replacing the previous one.
  let photoUrl = old.photo;
  if (photo) {
    photoUrl = "/images/profile/photo.jpg";
    written.push(await saveDownsampled(photo, publicPath(photoUrl), 1500));
    if (old.photo !== photoUrl && old.photo?.startsWith("/images/profile/photo.") && existsSync(publicPath(old.photo))) {
      await unlink(publicPath(old.photo));
      written.push(`(removed old ${rel(publicPath(old.photo))})`);
    }
  }
  // A new CV replaces the old file in place, so links to it keep working.
  const cvUrl = old.cv?.startsWith("/cv_file/") ? old.cv : "/cv_file/hwang_CV.pdf";
  if (cv) written.push(await write(publicPath(cvUrl), await bytes(cv)));

  setValue(existing.doc, "heading", heading);
  setValue(existing.doc, "photo", photoUrl);
  setValue(existing.doc, "photo_alt", str(form, "photo_alt"));
  setValue(existing.doc, "focus", crop.focus);
  setValue(existing.doc, "zoom", crop.zoom);
  setValue(existing.doc, "cv", cvUrl);
  setValue(existing.doc, "email", email);
  setValue(existing.doc, "linkedin", str(form, "linkedin"));
  setValue(existing.doc, "scholar", str(form, "scholar"));
  setValue(existing.doc, "banner", str(form, "banner"));
  setValue(existing.doc, "banner_link", str(form, "banner_link"));
  existing.doc.body = str(form, "body");
  written.push(await write(existing.file, serializeDoc(existing.doc)));
  return { ok: true, written, view: "/" };
}

// ─── Delete ───────────────────────────────────────────────────────────────

/**
 * Work out everything deleting an entry involves. With `confirm` unset this
 * only reports the plan; the admin shows it and asks before calling again.
 */
async function deleteEntry(form) {
  const entry = await loadEntry(str(form, "type"), str(form, "key"));
  if (!entry || !TYPES.includes(entry.type)) return { error: "Entry not found." };
  const data = docData(entry.doc);

  // Text of every other content file, to check whether an asset is still used.
  const others = [];
  for (const type of [...TYPES, "themes", "profile"]) {
    for (const e of await loadAll(type)) if (e.file !== entry.file) others.push(serializeDoc(e.doc));
  }
  // Files the entry points at: its PDF / images, plus any local files linked in its body.
  const bodyFiles = entry.doc.body.match(/\/(?:images|files)\/[^\s)"'<>]+/g) ?? [];
  const assets = [...new Set([data.pdf, data.thumbnail, data.hero_image, ...bodyFiles])]
    .filter((url) => typeof url === "string" && url.startsWith("/") && existsSync(publicPath(url)))
    .filter((url) => !others.some((text) => text.includes(url)));

  const remove = [entry.file, ...assets.map(publicPath)];
  const unlinks = []; // [entry, key] pairs to clear because they point at a deleted project
  const themeIds = [];
  if (entry.type === "projects") {
    for (const pub of await loadAll("publications")) {
      if (docData(pub.doc).research_project === entry.key) unlinks.push(pub);
    }
    for (const theme of await loadAll("themes")) {
      if ((docData(theme.doc).projects ?? []).includes(entry.key)) themeIds.push(theme.key);
    }
  }

  const plan = [
    ...remove.map((f) => `Delete ${rel(f)}`),
    ...unlinks.map((p) => `Unlink project from ${rel(p.file)}`),
    ...themeIds.map((t) => `Remove from research theme "${t}"`),
  ];
  if (form.get("confirm") !== "yes") return { ok: true, plan };

  for (const pub of unlinks) {
    setValue(pub.doc, "research_project", "");
    await write(pub.file, serializeDoc(pub.doc));
  }
  if (themeIds.length) await setProjectThemes(entry.key, []);
  for (const file of remove) await unlink(file);
  // Tidy up a project's media folder if that left it empty.
  const mediaDir = publicPath(`/images/projects/${entry.key}`);
  if (entry.type === "projects" && existsSync(mediaDir) && (await readdir(mediaDir)).length === 0) await rmdir(mediaDir);
  return { ok: true, done: plan };
}
