// Local-only content admin.
//
// Runs only inside `npm run dev` (the `astro:server:setup` hook never fires
// during `astro build`), so none of this ships to GitHub Pages.
// The handlers live in server.mjs and are loaded through Vite on each request,
// so edits to the admin code take effect without restarting the dev server.

import { fileURLToPath } from "node:url";

const SERVER = fileURLToPath(new URL("./server.mjs", import.meta.url));

export default function adminIntegration() {
  return {
    name: "local-admin",
    hooks: {
      "astro:server:setup": ({ server, logger }) => {
        server.middlewares.use("/admin", (req, res, next) => {
          server
            .ssrLoadModule(SERVER)
            .then(({ handle }) => handle(req, res))
            .catch(next);
        });
        logger.info("Content admin available at /admin");
      },
    },
  };
}
