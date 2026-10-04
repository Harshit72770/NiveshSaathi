import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import express from 'express'
import { createApiRouter } from './server/index.js'

/**
 * Dev integration for the server-side AI API.
 *
 * Mounts the SAME /api router that `node server/index.js` uses inside
 * the Vite dev server, so a single `npm run dev` serves both the app
 * and POST /api/ai/analyze.
 *
 * WHY AN EXPRESS APP WRAPPER:
 *   Express's convenience response helpers (`res.status`, `res.json`,
 *   `res.send`) are installed by Express's own `expressInit` middleware,
 *   which only runs inside a full `express()` application. Mounting a
 *   bare `express.Router()` straight into Vite's Connect stack left the
 *   response as a plain Node `ServerResponse`, so handlers failed with
 *   "res.status is not a function" / "res.json is not a function".
 *   Wrapping the router in `express()` restores those helpers.
 *
 * The browser only ever sees same-origin /api routes — the Groq
 * API key stays in the git-ignored .env file on the server and is
 * never shipped to the client bundle.
 */
function aiApiPlugin() {
  const apiApp = express()
  apiApp.use('/api', createApiRouter())
  return {
    name: 'niveshsaathi-ai-api',
    configureServer(server) {
      server.middlewares.use(apiApp)
    },
  }
}

// https://vitejs.dev/config/
export default defineConfig({
  plugins: [react(), aiApiPlugin()],
  server: {
    port: 5173,
    host: true,
  },
})
