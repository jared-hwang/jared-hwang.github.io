import { getCollection, getEntry, type CollectionEntry } from "astro:content";

export type Publication = CollectionEntry<"publications">;
export type Project = CollectionEntry<"projects">;

/** Inline CSS variables for an image's crop (focal point + zoom) set in the admin. */
export function cropStyle(d: { focus?: string; zoom?: number }): string {
  return [d.focus && `--focus: ${d.focus}`, d.zoom && `--zoom: ${d.zoom}`].filter(Boolean).join("; ");
}

/** The link used for a publication's title and thumbnail: the PDF if there is one. */
export function paperLink(pub: Publication): string | undefined {
  const d = pub.data;
  return d.pdf ?? d.paperurl ?? d.arxiv ?? d.doi;
}

/** All publications, newest first. */
export async function getPublications(): Promise<Publication[]> {
  const pubs = await getCollection("publications");
  return pubs.sort((a, b) => b.data.date.valueOf() - a.data.date.valueOf());
}

/** All projects: current ones first, then newest start date first. */
export async function getProjects(): Promise<Project[]> {
  const projects = await getCollection("projects");
  return projects.sort((a, b) => {
    if (a.data.status !== b.data.status) return a.data.status === "current" ? -1 : 1;
    return b.data.start_date.valueOf() - a.data.start_date.valueOf();
  });
}

/** Group items by year (descending), preserving order within a year. */
export function groupByYear<T extends Publication>(items: T[]): [number, T[]][] {
  const groups = new Map<number, T[]>();
  for (const item of items) {
    const year = item.data.date.getUTCFullYear();
    if (!groups.has(year)) groups.set(year, []);
    groups.get(year)!.push(item);
  }
  return [...groups.entries()].sort((a, b) => b[0] - a[0]);
}

/** The home-page intro (src/content/profile/profile.md). */
export async function getProfile(): Promise<CollectionEntry<"profile">> {
  const profile = await getEntry("profile", "profile");
  if (!profile) throw new Error("Missing src/content/profile/profile.md");
  return profile;
}

/** True if a URL points at a video file (rendered with <video> instead of <img>). */
export const isVideo = (url: string) => /\.(mp4|webm|mov)$/i.test(url);
