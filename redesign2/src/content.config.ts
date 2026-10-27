import { defineCollection, reference, z } from "astro:content";
import { glob } from "astro/loaders";

// Projects: one markdown file per project in src/content/projects/.
// The filename (without .md) is the project's id and its URL: /projects/<id>.
const projects = defineCollection({
  loader: glob({ pattern: "**/*.md", base: "./src/content/projects" }),
  schema: z.object({
    title: z.string(),
    short_title: z.string(), // shown under the tile on the home page
    status: z.enum(["current", "past"]),
    thumbnail: z.string(),
    thumbnail_alt: z.string().optional(),
    hero_image: z.string().optional(), // big image (or .mp4/.webm/.gif) at the top of the project page; defaults to the thumbnail
    hero_caption: z.string().optional(),
    hero_focus: z.string().optional(), // page image crop (set in /admin)
    hero_zoom: z.number().optional(),
    hero_whole: z.boolean().default(false), // show the whole page image, letterboxed, instead of cropping
    focus: z.string().optional(), // image focal point, e.g. "40% 25%" (set in /admin)
    zoom: z.number().optional(), // image zoom, 1 = fit
    venue: z.string().optional(),
    daterange: z.string().optional(),
    start_date: z.coerce.date(),
    end_date: z.coerce.date().optional(),
    location: z.string().optional(),
    supervisor: z.string().optional(),
    excerpt: z.string(),
    website: z.string().optional(), // link buttons under the title
    code: z.string().optional(),
    video: z.string().optional(),
    tags: z.array(z.string()).default([]),
  }),
});

// Research themes: the three expandable tiles. Body = the blurb.
const themes = defineCollection({
  loader: glob({ pattern: "**/*.md", base: "./src/content/themes" }),
  schema: z.object({
    title: z.string(),
    order: z.number(),
    image: z.string(),
    focus: z.string().optional(), // image focal point, e.g. "40% 25%" (set in /admin)
    zoom: z.number().optional(), // image zoom, 1 = fit
    projects: z.array(reference("projects")).default([]),
  }),
});

const publications = defineCollection({
  loader: glob({ pattern: "**/*.md", base: "./src/content/publications" }),
  schema: z.object({
    title: z.string(),
    selected: z.boolean().default(false),
    date: z.coerce.date(),
    venue: z.string().optional(),
    venue_short: z.string().optional(), // label on the black venue badge
    authors: z.string().optional(),
    thumbnail: z.string().optional(),
    focus: z.string().optional(), // image focal point, e.g. "40% 25%" (set in /admin)
    zoom: z.number().optional(), // image zoom, 1 = fit
    pdf: z.string().optional(),
    paperurl: z.string().optional(),
    arxiv: z.string().optional(),
    doi: z.string().optional(),
    code: z.string().optional(),
    video: z.string().optional(),
    slides: z.string().optional(),
    award: z.string().optional(), // text label shown next to the venue
    trophy: z.boolean().default(false), // show the 🏆 badge on the thumbnail
    acceptance_rate: z.string().optional(),
    research_project: reference("projects").optional(),
    themes: z.array(reference("themes")).default([]),
  }),
});

const news = defineCollection({
  loader: glob({ pattern: "**/*.md", base: "./src/content/news" }),
  schema: z.object({
    date: z.coerce.date(),
    link: z.string().optional(),
  }),
});

// The intro at the top of the home page: one file, src/content/profile/profile.md.
// Body = the intro paragraphs.
const profile = defineCollection({
  loader: glob({ pattern: "**/*.md", base: "./src/content/profile" }),
  schema: z.object({
    heading: z.string(),
    photo: z.string(),
    photo_alt: z.string().optional(),
    focus: z.string().optional(), // photo focal point (set in /admin)
    zoom: z.number().optional(),
    cv: z.string(),
    email: z.string(),
    linkedin: z.string().optional(),
    scholar: z.string().optional(),
    banner: z.string().optional(), // notice next to the CV button on the home page, e.g. "Looking for internships"; empty hides it
    banner_link: z.string().optional(), // makes the banner a link
  }),
});

export const collections = { projects, themes, publications, news, profile };
