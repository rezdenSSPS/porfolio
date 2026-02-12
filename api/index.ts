import type { VercelRequest, VercelResponse } from '@vercel/node'
import { db, schema, testConnection } from './lib/db.js'
import { eq, desc, asc } from 'drizzle-orm'
import { handleContactForm } from './lib/contact.js'

// CORS middleware
const setCors = (res: VercelResponse) => {
  res.setHeader('Access-Control-Allow-Origin', '*')
  res.setHeader('Access-Control-Allow-Methods', 'GET, POST, PUT, DELETE, OPTIONS')
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type, Authorization')
}

export default async function handler(req: VercelRequest, res: VercelResponse) {
  setCors(res)

  // Add Edge Caching headers for GET requests
  if (req.method === 'GET') {
    res.setHeader('Cache-Control', 's-maxage=1, stale-while-revalidate=59')
  }
  
  if (req.method === 'OPTIONS') {
    return res.status(200).end()
  }

  const path = req.url?.replace('/api', '') || ''
  const segments = path.split('/').filter(Boolean)

  try {
    // GET /api/projects
    if (req.method === 'GET' && segments[0] === 'projects' && !segments[1]) {
      // OPTIMIZED: Single query with join - avoids N+1 pattern
      // Drizzle automatically handles the relationship query efficiently
      const projectsData = await db.query.projects.findMany({
        where: eq(schema.projects.status, 'COMPLETED'),
        with: {
          images: {
            orderBy: asc(schema.projectImages.order),
            columns: {
              id: true,
              imageUrl: true,
              isPrimary: true,
              order: true
            }
          }
        },
        orderBy: [
          desc(schema.projects.featured),
          asc(schema.projects.order),
          desc(schema.projects.createdAt)
        ]
      })

      return res.status(200).json({
        success: true,
        data: projectsData,
        count: projectsData.length,
      })
    }

    // GET /api/projects/:id
    if (req.method === 'GET' && segments[0] === 'projects' && segments[1]) {
      const project = await db.query.projects.findFirst({
        where: eq(schema.projects.id, segments[1]),
        with: {
          images: {
            orderBy: asc(schema.projectImages.order),
            columns: {
              id: true,
              imageUrl: true,
              isPrimary: true,
              order: true
            }
          }
        }
      })

      if (!project) {
        return res.status(404).json({ success: false, error: 'Project not found' })
      }

      return res.status(200).json({ success: true, data: project })
    }

    // POST /api/contact
    if (req.method === 'POST' && segments[0] === 'contact') {
      try {
        const result = await handleContactForm(req.body)
        return res.status(200).json({ success: true, message: result.message })
      } catch (error: unknown) {
        const errorMessage = error instanceof Error ? error.message : 'Unknown error';
        return res.status(400).json({ success: false, error: errorMessage })
      }
    }

    // 404 for unknown routes
    return res.status(404).json({ success: false, error: 'Not found' })
  } catch (error) {
    console.error('API Error:', error)
    return res.status(500).json({ success: false, error: 'Internal server error' })
  }
}
