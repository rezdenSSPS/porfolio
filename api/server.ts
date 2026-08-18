import { serve } from '@hono/node-server'
import { serveStatic } from '@hono/node-server/serve-static'
import { migrate } from 'drizzle-orm/node-postgres/migrator'
import { Hono } from 'hono'
import dotenv from 'dotenv'
import path from 'path'
import fs from 'fs'

dotenv.config()

// Apply database migrations on startup (creates tables on a fresh Railway DB)
const { db } = await import('./lib/db.js')
try {
  await migrate(db, { migrationsFolder: path.resolve(process.cwd(), 'drizzle/migrations') })
  console.log('Database migrations applied')
} catch (err) {
  console.error('Migration error:', err)
}

// Seed the initial projects if the database is empty (idempotent)
try {
  const { ensureSeeded } = await import('./lib/seedData.js')
  await ensureSeeded()
} catch (err) {
  console.error('Seed error:', err)
}

const { default: apiApp } = await import('./local.js')

const app = new Hono()

// Mount API routes
app.route('/', apiApp)

// In production, serve the built frontend
const distPath = path.resolve(process.cwd(), 'dist')
if (fs.existsSync(distPath)) {
  app.use('/*', serveStatic({ root: './dist' }))

  // SPA fallback: serve index.html for any non-API, non-file route
  app.get('*', (c) => {
    const indexPath = path.join(distPath, 'index.html')
    const html = fs.readFileSync(indexPath, 'utf-8')
    return c.html(html)
  })
}

const PORT = process.env.PORT || 3001

serve({
  fetch: app.fetch,
  port: Number(PORT),
}, (info) => {
  console.log(`Server running on http://localhost:${info.port}`)
})
