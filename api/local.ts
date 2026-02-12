import { Hono } from 'hono'
import { cors } from 'hono/cors'
import { db, schema } from './lib/db.js'
import { eq, desc, asc, sql } from 'drizzle-orm'
import crypto from 'crypto'
import { handleContactForm } from './lib/contact.js'

const app = new Hono().basePath('/api')

app.use('*', cors())

// Auth check helper
const checkAuth = (c: any): boolean => {
  const authHeader = c.req.header('authorization')
  if (!authHeader || !authHeader.startsWith('Bearer ')) {
    return false
  }
  const token = authHeader.substring(7)
  return token.length > 10
}

app.use('*', async (c, next) => {
  if (c.req.method === 'GET') {
    c.header('Cache-Control', 's-maxage=1, stale-while-revalidate=59')
  }
  await next()
})

app.get('/projects', async (c) => {
  try {
    const projects = await db.query.projects.findMany({
      where: eq(schema.projects.status, 'COMPLETED'),
      with: {
        images: {
          orderBy: (images, { asc }) => [asc(images.order)]
        }
      },
      orderBy: (projects, { desc, asc }) => [
        desc(projects.featured),
        asc(projects.order),
        desc(projects.createdAt)
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

app.get('/projects/:id', async (c) => {
  try {
    const id = c.req.param('id')
    
    const project = await db.query.projects.findFirst({
      where: eq(schema.projects.id, id),
      with: {
        images: {
          orderBy: (images, { asc }) => [asc(images.order)]
        }
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

app.get('/', (c) => {
  return c.json({
    message: 'Portfolio API',
    version: '1.0.0',
    endpoints: {
      projects: '/api/projects',
    }
  })
})

// Contact form
app.post('/contact', async (c) => {
  try {
    const body = await c.req.json()
    const result = await handleContactForm(body)
    return c.json({ success: true, message: result.message })
  } catch (error: any) {
    return c.json({ success: false, error: error.message || 'Unknown error' }, 400)
  }
})

// === ADMIN ROUTES ===

// POST /api/admin/login
app.post('/admin/login', async (c) => {
  const { password } = await c.req.json()
  
  if (password === process.env.ADMIN_PASSWORD) {
    const token = crypto.randomBytes(32).toString('hex')
    return c.json({
      success: true,
      token,
      message: 'Login successful'
    })
  }
  
  return c.json({
    success: false,
    message: 'Invalid password'
  }, 401)
})

// GET /api/admin/projects - Get all projects (admin)
app.get('/admin/projects', async (c) => {
  if (!checkAuth(c)) {
    return c.json({ success: false, error: 'Unauthorized' }, 401)
  }

  const projectsData = await db
    .select()
    .from(schema.projects)
    .orderBy(desc(schema.projects.createdAt))

  const projectIds = projectsData.map(p => p.id)
  let imagesData: typeof schema.projectImages.$inferSelect[] = []
  
  if (projectIds.length > 0) {
    imagesData = await db
      .select()
      .from(schema.projectImages)
      .where(sql`${schema.projectImages.projectId} IN ${projectIds}`)
      .orderBy(asc(schema.projectImages.order))
  }

  const projectsWithImages = projectsData.map(project => ({
    ...project,
    images: imagesData.filter(img => img.projectId === project.id)
  }))

  return c.json({
    success: true,
    data: projectsWithImages,
  })
})

// POST /api/admin/projects - Create project
app.post('/admin/projects', async (c) => {
  if (!checkAuth(c)) {
    return c.json({ success: false, error: 'Unauthorized' }, 401)
  }

  const body = await c.req.json()
  const { title, category, description, websiteUrl, technologies, aiPrompt, status, featured, order, images } = body

  const primaryImage = images?.find((img: any) => img.isPrimary) || images?.[0]
  const imageUrl = primaryImage?.url || primaryImage?.imageUrl || null

  const project = await db.insert(schema.projects).values({
    title,
    category,
    description,
    websiteUrl,
    technologies: technologies || [],
    aiPrompt,
    status: status || 'COMPLETED',
    featured: featured || false,
    order: order || 0,
    imageUrl,
  }).returning()

  if (images && images.length > 0) {
    const validImages = images
      .filter((img: any) => img.imageUrl || img.url)
      .map((img: any, idx: number) => ({
        projectId: project[0].id,
        imageUrl: img.imageUrl || img.url,
        isPrimary: img.isPrimary || idx === 0,
        order: img.order ?? idx,
      }))
    
    if (validImages.length > 0) {
      await db.insert(schema.projectImages).values(validImages)
    }
  }

  return c.json({
    success: true,
    data: project[0],
  }, 201)
})

// PUT /api/admin/projects/:id - Update project
app.put('/admin/projects/:id', async (c) => {
  if (!checkAuth(c)) {
    return c.json({ success: false, error: 'Unauthorized' }, 401)
  }

  const id = c.req.param('id')
  const body = await c.req.json()
  const { title, category, description, websiteUrl, technologies, aiPrompt, status, featured, order, images } = body

  const primaryImage = images?.find((img: any) => img.isPrimary) || images?.[0]
  const imageUrl = primaryImage?.url || primaryImage?.imageUrl || null

  const project = await db.update(schema.projects)
    .set({
      title,
      category,
      description,
      websiteUrl,
      technologies,
      aiPrompt,
      status,
      featured,
      order,
      imageUrl,
      updatedAt: new Date(),
    })
    .where(eq(schema.projects.id, id))
    .returning()

  if (!project || project.length === 0) {
    return c.json({ success: false, error: 'Project not found' }, 404)
  }

  if (images && Array.isArray(images)) {
    await db.delete(schema.projectImages).where(eq(schema.projectImages.projectId, id))
    
    if (images.length > 0) {
      const validImages = images
        .filter((img: any) => img.imageUrl || img.url)
        .map((img: any, idx: number) => ({
          projectId: id,
          imageUrl: img.imageUrl || img.url,
          isPrimary: img.isPrimary || idx === 0,
          order: img.order ?? idx,
        }))
      
      if (validImages.length > 0) {
        await db.insert(schema.projectImages).values(validImages)
      }
    }
  }

  return c.json({
    success: true,
    data: project[0],
  })
})

// DELETE /api/admin/projects/:id - Delete project
app.delete('/admin/projects/:id', async (c) => {
  if (!checkAuth(c)) {
    return c.json({ success: false, error: 'Unauthorized' }, 401)
  }

  const id = c.req.param('id')
  await db.delete(schema.projects).where(eq(schema.projects.id, id))

  return c.json({
    success: true,
    message: 'Project deleted successfully',
  })
})

// PATCH /api/admin/projects/:id/status - Update project status
app.patch('/admin/projects/:id/status', async (c) => {
  if (!checkAuth(c)) {
    return c.json({ success: false, error: 'Unauthorized' }, 401)
  }

  const id = c.req.param('id')
  const { status } = await c.req.json()

  if (!['IN_PROGRESS', 'COMPLETED', 'ON_HOLD'].includes(status)) {
    return c.json({ success: false, error: 'Invalid status' }, 400)
  }

  const project = await db.update(schema.projects)
    .set({ status, updatedAt: new Date() })
    .where(eq(schema.projects.id, id))
    .returning()

  if (!project || project.length === 0) {
    return c.json({ success: false, error: 'Project not found' }, 404)
  }

  return c.json({
    success: true,
    data: project[0],
  })
})

// PATCH /api/admin/projects/:id/featured - Update featured status
app.patch('/admin/projects/:id/featured', async (c) => {
  if (!checkAuth(c)) {
    return c.json({ success: false, error: 'Unauthorized' }, 401)
  }

  const id = c.req.param('id')
  const { featured } = await c.req.json()

  const project = await db.update(schema.projects)
    .set({ featured, updatedAt: new Date() })
    .where(eq(schema.projects.id, id))
    .returning()

  if (!project || project.length === 0) {
    return c.json({ success: false, error: 'Project not found' }, 404)
  }

  return c.json({
    success: true,
    data: project[0],
  })
})

// POST /api/admin/upload/images - Upload images
app.post('/admin/upload/images', async (c) => {
  if (!checkAuth(c)) {
    return c.json({ success: false, error: 'Unauthorized' }, 401)
  }

  try {
    const formData = await c.req.formData()
    const files = formData.getAll('files')
    
    if (!files || files.length === 0) {
      return c.json({ success: false, error: 'No files uploaded' }, 400)
    }

    const uploadedImages: { url: string; publicId: string }[] = []

    for (const file of files) {
      if (file instanceof File) {
        const arrayBuffer = await file.arrayBuffer()
        const buffer = Buffer.from(arrayBuffer)
        
        const base64 = buffer.toString('base64')
        const mimeType = file.type || 'image/jpeg'
        const dataUri = `data:${mimeType};base64,${base64}`

        const cloudName = process.env.CLOUDINARY_CLOUD_NAME
        const apiKey = process.env.CLOUDINARY_API_KEY
        const apiSecret = process.env.CLOUDINARY_API_SECRET

        if (!cloudName || !apiKey || !apiSecret) {
          return c.json({ success: false, error: 'Cloudinary not configured' }, 500)
        }

        const uploadUrl = `https://api.cloudinary.com/v1_1/${cloudName}/image/upload`
        
        const formData = new FormData()
        formData.append('file', dataUri)
        formData.append('upload_preset', 'portfolio-upload')

        const response = await fetch(uploadUrl, {
          method: 'POST',
          body: formData
        })

        if (!response.ok) {
          const error = await response.text()
          console.error('Cloudinary upload failed:', error)
          continue
        }

        const result = await response.json() as { secure_url: string; public_id: string }
        uploadedImages.push({
          url: result.secure_url,
          publicId: result.public_id
        })
      }
    }

    return c.json({
      success: true,
      data: uploadedImages,
    })
  } catch (error) {
    console.error('Upload error:', error)
    return c.json({ success: false, error: 'Failed to upload images' }, 500)
  }
})

export default app
