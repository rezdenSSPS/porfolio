import { Hono } from 'hono'
import { cors } from 'hono/cors'
import { PrismaClient } from '@prisma/client'
import dotenv from 'dotenv'

// Load environment variables
dotenv.config()

// Initialize Prisma Client
const prisma = new PrismaClient()

// Create Hono app
const app = new Hono().basePath('/api')

// Enable CORS
app.use('*', cors())

// Get all projects
app.get('/projects', async (c) => {
  try {
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

    return c.json({
      success: true,
      data: projects,
      count: projects.length,
    })
  } catch (error) {
    console.error('Error fetching projects:', error)
    return c.json({ success: false, error: 'Failed to fetch projects' }, 500)
  }
})

// Get single project
app.get('/projects/:id', async (c) => {
  try {
    const id = c.req.param('id')
    
    const project = await prisma.project.findUnique({
      where: { id },
      include: {
        images: { orderBy: { order: 'asc' } }
      }
    })

    if (!project) {
      return c.json({ success: false, error: 'Project not found' }, 404)
    }

    return c.json({ success: true, data: project })
  } catch (error) {
    console.error('Error fetching project:', error)
    return c.json({ success: false, error: 'Failed to fetch project' }, 500)
  }
})

// Health check
app.get('/', (c) => {
  return c.json({
    message: 'Portfolio API',
    version: '1.0.0',
    endpoints: {
      projects: '/api/projects',
    }
  })
})

export default app
