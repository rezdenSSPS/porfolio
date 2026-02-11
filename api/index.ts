import { Hono } from 'hono'
import { cors } from 'hono/cors'
import { v2 as cloudinary } from 'cloudinary'
import { prisma } from './lib/prisma.js'
import { cache5min } from './lib/cache.js'

const app = new Hono()

// Enable CORS for all routes
app.use('*', cors())

// Configure Cloudinary
cloudinary.config({
  cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
  api_key: process.env.CLOUDINARY_API_KEY,
  api_secret: process.env.CLOUDINARY_API_SECRET,
  secure: true,
})

// Admin password from env
const ADMIN_PASSWORD = process.env.ADMIN_PASSWORD || 'admin123'

// Verify admin session middleware
const verifyAdmin = async (c: any, next: any) => {
  const authHeader = c.req.header('Authorization')
  
  if (!authHeader || !authHeader.startsWith('Bearer ')) {
    return c.json({
      success: false,
      message: 'Unauthorized'
    }, 401)
  }

  const token = authHeader.replace('Bearer ', '')
  
  if (!token) {
    return c.json({
      success: false,
      message: 'Invalid token'
    }, 401)
  }

  await next()
}

// ==================== PUBLIC PROJECT ROUTES ====================

// Get all projects
app.get('/api/projects', async (c) => {
  try {
    const cacheKey = 'projects:all'
    const cached = cache5min.get(cacheKey)
    
    if (cached) {
      c.header('X-Cache', 'HIT')
      return c.json({
        success: true,
        data: cached,
        count: (cached as any[]).length,
      })
    }

    const projects = await prisma.project.findMany({
      where: { status: 'COMPLETED' },
      include: {
        images: {
          orderBy: { order: 'asc' }
        }
      },
      orderBy: [
        { featured: 'desc' },
        { order: 'asc' },
        { createdAt: 'desc' }
      ]
    })

    cache5min.set(cacheKey, projects)
    c.header('X-Cache', 'MISS')
    c.header('Cache-Control', 'public, max-age=300')

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

// Get a single project by ID
app.get('/api/projects/:id', async (c) => {
  try {
    const id = c.req.param('id')
    
    const cacheKey = `projects:detail:${id}`
    const cached = cache5min.get(cacheKey)
    
    if (cached) {
      c.header('X-Cache', 'HIT')
      return c.json({ success: true, data: cached })
    }

    const project = await prisma.project.findUnique({
      where: { id },
      include: {
        images: { orderBy: { order: 'asc' } }
      }
    })

    if (!project) {
      return c.json({ success: false, error: 'Project not found' }, 404)
    }

    cache5min.set(cacheKey, project)
    c.header('X-Cache', 'MISS')
    c.header('Cache-Control', 'public, max-age=300')

    return c.json({ success: true, data: project })
  } catch (error) {
    console.error('Error fetching project:', error)
    return c.json({ success: false, error: 'Failed to fetch project' }, 500)
  }
})

// ==================== ADMIN ROUTES ====================

// Admin login
app.post('/api/admin/login', async (c) => {
  console.log('Admin login request received')
  let body
  try {
    const rawBody = await c.req.text()
    console.log('Raw body received:', rawBody)
    if (!rawBody) {
      return c.json({ success: false, message: 'Empty body' }, 400)
    }
    body = JSON.parse(rawBody)
  } catch (error) {
    console.error('Error parsing body:', error)
    return c.json({ success: false, message: 'Invalid JSON body' }, 400)
  }

  try {
    const { password } = body

    if (password === ADMIN_PASSWORD) {
      console.log('Password correct')
      const sessionToken = Buffer.from(`${Date.now()}-${Math.random()}`).toString('base64')
      
      return c.json({
        success: true,
        token: sessionToken,
        message: 'Login successful'
      })
    }

    console.log('Invalid password')
    return c.json({ success: false, message: 'Invalid password' }, 401)
  } catch (error) {
    console.error('Error in admin login logic:', error)
    return c.json({ success: false, message: 'Internal server error' }, 500)
  }
})

// ==================== ADMIN PROJECTS ROUTES ====================

// Get all projects (admin)
app.get('/api/admin/projects', verifyAdmin, async (c) => {
  try {
    const projects = await prisma.project.findMany({
      include: {
        images: { orderBy: { order: 'asc' } }
      },
      orderBy: { createdAt: 'desc' }
    })

    return c.json({ success: true, data: projects })
  } catch (error) {
    console.error('Error fetching projects:', error)
    return c.json({ success: false, message: 'Failed to fetch projects' }, 500)
  }
})

// Get single project (admin)
app.get('/api/admin/projects/:id', verifyAdmin, async (c) => {
  const { id } = c.req.param()

  try {
    const project = await prisma.project.findUnique({
      where: { id },
      include: { images: { orderBy: { order: 'asc' } } }
    })

    if (!project) {
      return c.json({ success: false, message: 'Project not found' }, 404)
    }

    return c.json({ success: true, data: project })
  } catch (error) {
    console.error('Error fetching project:', error)
    return c.json({ success: false, message: 'Failed to fetch project' }, 500)
  }
})

// Create new project (admin)
app.post('/api/admin/projects', verifyAdmin, async (c) => {
  try {
    const {
      title,
      category,
      description,
      websiteUrl,
      technologies,
      aiPrompt,
      status,
      featured,
      order,
      images
    } = await c.req.json()

    let primaryImageUrl = null
    if (images && Array.isArray(images) && images.length > 0) {
      const primaryImage = images.find((img: any) => img.isPrimary)
      primaryImageUrl = primaryImage?.url || images[0].url
    }

    const project = await prisma.project.create({
      data: {
        title,
        category,
        description,
        imageUrl: primaryImageUrl,
        websiteUrl: websiteUrl || null,
        technologies: technologies || [],
        aiPrompt: aiPrompt || null,
        status: status || 'COMPLETED',
        featured: featured || false,
        order: order || 0
      }
    })

    if (images && Array.isArray(images) && images.length > 0) {
      await prisma.projectImage.createMany({
        data: images.map((img: any, index: number) => ({
          projectId: project.id,
          imageUrl: img.url,
          isPrimary: img.isPrimary || (index === 0),
          order: img.order !== undefined ? img.order : index
        }))
      })
    }

    const projectWithImages = await prisma.project.findUnique({
      where: { id: project.id },
      include: { images: { orderBy: { order: 'asc' } } }
    })

    cache5min.invalidatePattern('projects:')

    return c.json({ 
      success: true, 
      data: projectWithImages, 
      message: 'Project created successfully' 
    }, 201)
  } catch (error) {
    console.error('Error creating project:', error)
    return c.json({ success: false, message: 'Failed to create project' }, 500)
  }
})

// Update project (admin)
app.put('/api/admin/projects/:id', verifyAdmin, async (c) => {
  const { id } = c.req.param()

  try {
    const {
      title,
      category,
      description,
      websiteUrl,
      technologies,
      aiPrompt,
      status,
      featured,
      order,
      images
    } = await c.req.json()

    const updateData: any = {
      ...(title && { title }),
      ...(category && { category }),
      ...(description && { description }),
      ...(websiteUrl !== undefined && { websiteUrl }),
      ...(technologies && { technologies }),
      ...(aiPrompt !== undefined && { aiPrompt }),
      ...(status && { status }),
      ...(featured !== undefined && { featured }),
      ...(order !== undefined && { order })
    }

    const project = await prisma.project.update({
      where: { id },
      data: updateData
    })

    if (images && Array.isArray(images)) {
      await prisma.projectImage.deleteMany({ where: { projectId: id } })

      if (images.length > 0) {
        const hasPrimary = images.some((img: any) => img.isPrimary)
        let primarySet = false

        const imagesToCreate = images.map((img: any, index: number) => {
          let isPrimary = img.isPrimary
          
          if (!hasPrimary && index === 0) {
            isPrimary = true
          } else if (hasPrimary && isPrimary) {
            if (primarySet) {
              isPrimary = false
            } else {
              primarySet = true
            }
          }

          return {
            projectId: id,
            imageUrl: img.url,
            isPrimary: isPrimary,
            order: img.order !== undefined ? img.order : index
          }
        })

        await prisma.projectImage.createMany({ data: imagesToCreate })

        const primaryImage = imagesToCreate.find((img: any) => img.isPrimary) || imagesToCreate[0]
        if (primaryImage) {
          await prisma.project.update({
            where: { id },
            data: { imageUrl: primaryImage.imageUrl }
          })
        }
      } else {
        await prisma.project.update({
          where: { id },
          data: { imageUrl: null }
        })
      }
    }

    const projectWithImages = await prisma.project.findUnique({
      where: { id },
      include: { images: { orderBy: { order: 'asc' } } }
    })

    cache5min.invalidate(`projects:detail:${id}`)
    cache5min.invalidatePattern('projects:')

    return c.json({
      success: true,
      data: projectWithImages,
      message: 'Project updated successfully'
    })
  } catch (error) {
    console.error('Error updating project:', error)
    return c.json({ success: false, message: 'Failed to update project' }, 500)
  }
})

// Delete project (admin)
app.delete('/api/admin/projects/:id', verifyAdmin, async (c) => {
  const { id } = c.req.param()

  try {
    await prisma.project.delete({ where: { id } })

    cache5min.invalidate(`projects:detail:${id}`)
    cache5min.invalidatePattern('projects:')

    return c.json({ success: true, message: 'Project deleted successfully' })
  } catch (error) {
    console.error('Error deleting project:', error)
    return c.json({ success: false, message: 'Failed to delete project' }, 500)
  }
})

// Update project status (admin)
app.patch('/api/admin/projects/:id/status', verifyAdmin, async (c) => {
  const { id } = c.req.param()
  const { status } = await c.req.json()

  if (!status || !['IN_PROGRESS', 'COMPLETED', 'ON_HOLD'].includes(status)) {
    return c.json({
      success: false,
      message: 'Invalid status. Must be IN_PROGRESS, COMPLETED, or ON_HOLD'
    }, 400)
  }

  try {
    const project = await prisma.project.update({
      where: { id },
      data: { status }
    })

    cache5min.invalidate(`projects:detail:${id}`)
    cache5min.invalidatePattern('projects:')

    return c.json({
      success: true,
      data: project,
      message: `Project marked as ${status}`
    })
  } catch (error) {
    console.error('Error updating project status:', error)
    return c.json({ success: false, message: 'Failed to update project status' }, 500)
  }
})

// Toggle featured status (admin)
app.patch('/api/admin/projects/:id/featured', verifyAdmin, async (c) => {
  const { id } = c.req.param()
  const { featured } = await c.req.json()

  try {
    const project = await prisma.project.update({
      where: { id },
      data: { featured: !!featured }
    })

    cache5min.invalidate(`projects:detail:${id}`)
    cache5min.invalidatePattern('projects:')

    return c.json({
      success: true,
      data: project,
      message: featured ? 'Project set as featured' : 'Featured status removed'
    })
  } catch (error) {
    console.error('Error updating featured status:', error)
    return c.json({ success: false, message: 'Failed to update featured status' }, 500)
  }
})

// ==================== UPLOAD ROUTES ====================

// Upload single image (admin)
app.post('/api/admin/upload/image', verifyAdmin, async (c) => {
  try {
    const formData = await c.req.formData()
    const file = formData.get('file') as File

    if (!file) {
      return c.json({ success: false, message: 'No file provided' }, 400)
    }

    const allowedTypes = ['image/jpeg', 'image/jpg', 'image/png', 'image/webp', 'image/gif']
    if (!allowedTypes.includes(file.type)) {
      return c.json({ success: false, message: 'Invalid file type. Only JPEG, PNG, WebP, and GIF are allowed.' }, 400)
    }

    const maxSize = 10 * 1024 * 1024
    if (file.size > maxSize) {
      return c.json({ success: false, message: 'File size exceeds 10MB limit.' }, 400)
    }

    const arrayBuffer = await file.arrayBuffer()
    const buffer = Buffer.from(arrayBuffer)

    const result = await new Promise((resolve, reject) => {
      cloudinary.uploader.upload_stream(
        {
          resource_type: 'image',
          folder: 'portfolio-projects',
          transformation: [
            { quality: 'auto:good' },
            { fetch_format: 'auto' }
          ]
        },
        (error, result) => {
          if (error) reject(error)
          else resolve(result)
        }
      ).end(buffer)
    })

    return c.json({
      success: true,
      data: {
        url: (result as any).secure_url,
        publicId: (result as any).public_id,
        width: (result as any).width,
        height: (result as any).height
      }
    })
  } catch (error) {
    console.error('Error uploading image:', error)
    return c.json({ success: false, message: 'Failed to upload image' }, 500)
  }
})

// Upload multiple images (admin)
app.post('/api/admin/upload/images', verifyAdmin, async (c) => {
  try {
    const formData = await c.req.formData()
    const files = formData.getAll('files') as File[]

    if (!files || files.length === 0) {
      return c.json({ success: false, message: 'No files provided' }, 400)
    }

    const allowedTypes = ['image/jpeg', 'image/jpg', 'image/png', 'image/webp', 'image/gif']
    const maxSize = 10 * 1024 * 1024

    for (const file of files) {
      if (!allowedTypes.includes(file.type)) {
        return c.json({ success: false, message: `Invalid file type for ${file.name}. Only JPEG, PNG, WebP, and GIF are allowed.` }, 400)
      }
      if (file.size > maxSize) {
        return c.json({ success: false, message: `File ${file.name} exceeds 10MB limit.` }, 400)
      }
    }

    const uploadPromises = files.map(async (file) => {
      const arrayBuffer = await file.arrayBuffer()
      const buffer = Buffer.from(arrayBuffer)

      return new Promise((resolve, reject) => {
        cloudinary.uploader.upload_stream(
          {
            resource_type: 'image',
            folder: 'portfolio-projects',
            transformation: [
              { quality: 'auto:good' },
              { fetch_format: 'auto' }
            ]
          },
          (error, result) => {
            if (error) reject(error)
            else resolve(result)
          }
        ).end(buffer)
      })
    })

    const results = await Promise.all(uploadPromises)

    return c.json({
      success: true,
      data: results.map((result: any) => ({
        url: result.secure_url,
        publicId: result.public_id,
        width: result.width,
        height: result.height
      }))
    })
  } catch (error) {
    console.error('Error uploading images:', error)
    return c.json({ success: false, message: 'Failed to upload images' }, 500)
  }
})

// Delete image from Cloudinary (admin)
app.delete('/api/admin/upload/image/:publicId', verifyAdmin, async (c) => {
  try {
    const { publicId } = c.req.param()

    await new Promise((resolve, reject) => {
      cloudinary.uploader.destroy(
        publicId,
        { resource_type: 'image' },
        (error, result) => {
          if (error) reject(error)
          else resolve(result)
        }
      )
    })

    return c.json({ success: true, message: 'Image deleted successfully' })
  } catch (error) {
    console.error('Error deleting image:', error)
    return c.json({ success: false, message: 'Failed to delete image' }, 500)
  }
})

// Health check
app.get('/api', (c) => {
  return c.json({
    message: 'Portfolio API',
    version: '1.0.0',
    endpoints: {
      projects: '/api/projects',
      admin: '/api/admin/login',
      adminProjects: '/api/admin/projects',
      upload: '/api/admin/upload'
    }
  })
})

app.get('/', (c) => {
  return c.json({
    message: 'Portfolio API',
    version: '1.0.0'
  })
})

export default app
export { app }
