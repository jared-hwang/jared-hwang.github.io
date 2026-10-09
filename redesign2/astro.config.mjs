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
});
