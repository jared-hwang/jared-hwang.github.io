import { defineCollection, z } from "astro:content";
import { glob } from "astro/loaders";

const research = defineCollection({
  loader: glob({ pattern: "**/*.md", base: "./src/content/research" }),
  schema: z.object({
    title: z.string(),
    status: z.enum(["current", "past"]),
    thumbnail: z.string(),
    thumbnail_alt: z.string().optional(),
    venue: z.string().optional(),
    daterange: z.string().optional(),
    date: z.string().optional(),
    location: z.string().optional(),
    supervisor: z.string().optional(),
    excerpt: z.string(),
    tags: z.array(z.string()).default([]),
  }),
});

const publications = defineCollection({
  loader: glob({ pattern: "**/*.md", base: "./src/content/publications" }),
  schema: z.object({
    title: z.string(),
    selected: z.boolean().default(false),
    research_project: z.string().optional(),
    date: z.coerce.date(),
    venue: z.string().optional(),
    paperurl: z.string().optional(),
    arxiv: z.string().optional(),
    authors: z.string().optional(),
    thumbnail: z.string().optional(),
    doi: z.string().optional(),
    acceptance_rate: z.string().optional(),
    award: z.string().optional(),
    code: z.string().optional(),
    citation: z.string().optional(),
    slides: z.string().optional(),
    video: z.string().optional(),
  }),
});

const news = defineCollection({
  loader: glob({ pattern: "**/*.md", base: "./src/content/news" }),
  schema: z.object({
    date: z.coerce.date(),
    link: z.string().optional(),
  }),
});

export const collections = { research, publications, news };
