import type { VercelRequest, VercelResponse } from '@vercel/node'
import { PrismaClient } from '@prisma/client'
import { handleContactForm } from './lib/contact'

// Initialize Prisma Client
const prisma = new PrismaClient()

// CORS middleware
const setCors = (res: VercelResponse) => {
  res.setHeader('Access-Control-Allow-Origin', '*')
  res.setHeader('Access-Control-Allow-Methods', 'GET, POST, PUT, DELETE, OPTIONS')
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type, Authorization')
}

export default async function handler(req: VercelRequest, res: VercelResponse) {
  setCors(res)
  
  if (req.method === 'OPTIONS') {
    return res.status(200).end()
  }

  const path = req.url?.replace('/api', '') || ''
  const segments = path.split('/').filter(Boolean)

  try {
    // GET /api/projects
    if (req.method === 'GET' && segments[0] === 'projects' && !segments[1]) {
      const projects = await prisma.project.findMany({
        where: { status: 'COMPLETED' },
        include: {
          images: { orderBy: { order: 'asc' } }
        },
        orderBy: [
          { featured: 'desc' },
          { order: 'asc' },
          { createdAt: 'desc' }
        ]
      })

      return res.status(200).json({
        success: true,
        data: projects,
        count: projects.length,
      })
    }

    // GET /api/projects/:id
    if (req.method === 'GET' && segments[0] === 'projects' && segments[1]) {
      const project = await prisma.project.findUnique({
        where: { id: segments[1] },
        include: {
          images: { orderBy: { order: 'asc' } }
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
      } catch (error: any) {
        return res.status(400).json({ success: false, error: error.message })
      }
    }

    // 404 for unknown routes
    return res.status(404).json({ success: false, error: 'Not found' })
  } catch (error) {
    console.error('API Error:', error)
    return res.status(500).json({ success: false, error: 'Internal server error' })
  }
}
