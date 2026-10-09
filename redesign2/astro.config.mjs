// @ts-check
import { defineConfig } from "astro/config";
import admin from "./admin/integration.mjs";
import externalLinks from "./src/lib/external-links.mjs";

// https://astro.build/config
export default defineConfig({
  site: "https://jared-hwang.github.io",
  // Local-only content admin at /admin while running `npm run dev`. Not part of the build.
  integrations: [admin()],
  markdown: { rehypePlugins: [externalLinks] },
  // Old Jekyll-site URLs → their place on this site, so existing links keep working.
  // (Files under /files, /images and /cv_file keep their URLs as-is.)
  redirects: {
    "/about": "/",
    "/cv": "/cv_file/hwang_CV.pdf",
    "/research": "/#research",
    "/research/accessparkcv": "/projects/accessparkcv",
    "/research/bikebutler": "/projects/bikebutler",
    "/research/digital_typhoon": "/projects/digital_typhoon",
    "/research/isodar": "/projects/isodar",
    "/research/lartpc_ml": "/projects/lartpc_ml",
    "/publications": "/#publications",
    "/projects": "/#projects",
    // Pages the old site had that this one doesn't.
    "/talks": "/",
    "/talks/2023-06-30-ynu-typhoon": "/",
    "/teaching": "/",
    "/teaching/2018-comp40": "/",
    "/teaching/2020-comp105": "/",
    "/teaching/2022-fall-csci576": "/",
    "/teaching/2025-cse160_au25": "/",
    "/teaching/2025-cse160_wi25": "/",
    "/blog": "/",
    "/blog/why_urban_planning": "/",
  },
});
