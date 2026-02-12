import { serve } from '@hono/node-server'
import dotenv from 'dotenv'

dotenv.config()

const { default: app } = await import('./local.js')

const PORT = process.env.PORT || 3001

serve({
  fetch: app.fetch,
  port: Number(PORT)
}, (info) => {
  console.log(`🚀 Server is running on http://localhost:${info.port}`)
  console.log(`📁 API endpoints available at http://localhost:${info.port}/api`)
})
