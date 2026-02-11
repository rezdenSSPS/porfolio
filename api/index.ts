import { Hono } from 'hono'
import { handle } from 'hono/vercel'
import { cors } from 'hono/cors'
import { v2 as cloudinary } from 'cloudinary'
import { prisma } from './lib/prisma.js'

const app = new Hono().basePath('/api')

// Enable CORS
app.use('*', cors())

// Cloudinary config
cloudinary.config({
  cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
  api_key: process.env.CLOUDINARY_API_KEY,
  api_secret: process.env.CLOUDINARY_API_SECRET,
  secure: true,
})

const ADMIN_PASSWORD = process.env.ADMIN_PASSWORD || 'admin123'

// Verify admin middleware
const verifyAdmin = async (c: any, next: any) => {
  const authHeader = c.req.header('Authorization')
  
  if (!authHeader || !authHeader.startsWith('Bearer ')) {
    return c.json({ success: false, message: 'Unauthorized' }, 401)
  }

  const token = authHeader.replace('Bearer ', '')
  
  if (!token) {
    return c.json({ success: false, message: 'Invalid token' }, 401)
  }

  await next()
}

// Get all projects
app.get('/projects', async (c) => {
  try {
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

// Admin login
app.post('/admin/login', async (c) => {
  try {
    const body = await c.req.json()
    const { password } = body

    if (password === ADMIN_PASSWORD) {
      const sessionToken = btoa(`${Date.now()}-${Math.random()}`)
      
      return c.json({
        success: true,
        token: sessionToken,
        message: 'Login successful'
      })
    }

    return c.json({ success: false, message: 'Invalid password' }, 401)
  } catch (error) {
    return c.json({ success: false, message: 'Internal server error' }, 500)
  }
})

// Get admin projects
app.get('/admin/projects', verifyAdmin, async (c) => {
  try {
    const projects = await prisma.project.findMany({
      include: {
        images: { orderBy: { order: 'asc' } }
      },
      orderBy: { createdAt: 'desc' }
    })

    return c.json({ success: true, data: projects })
  } catch (error) {
    return c.json({ success: false, message: 'Failed to fetch projects' }, 500)
  }
})

// Create project
app.post('/admin/projects', verifyAdmin, async (c) => {
  try {
    const body = await c.req.json()
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
    } = body

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

// Update project
app.put('/admin/projects/:id', verifyAdmin, async (c) => {
  try {
    const { id } = c.req.param()
    const body = await c.req.json()
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
    } = body

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

// Delete project
app.delete('/admin/projects/:id', verifyAdmin, async (c) => {
  try {
    const { id } = c.req.param()
    await prisma.project.delete({ where: { id } })

    return c.json({ success: true, message: 'Project deleted successfully' })
  } catch (error) {
    return c.json({ success: false, message: 'Failed to delete project' }, 500)
  }
})

// Upload images
app.post('/admin/upload/images', verifyAdmin, async (c) => {
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
        return c.json({ success: false, message: `Invalid file type for ${file.name}` }, 400)
      }
      if (file.size > maxSize) {
        return c.json({ success: false, message: `File ${file.name} exceeds 10MB limit` }, 400)
      }
    }

    const uploadPromises = files.map(async (file) => {
      const arrayBuffer = await file.arrayBuffer()
      const base64 = btoa(String.fromCharCode(...new Uint8Array(arrayBuffer)))
      const dataURI = `data:${file.type};base64,${base64}`

      return new Promise((resolve, reject) => {
        cloudinary.uploader.upload(
          dataURI,
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
        )
      })
    })

    const results = await Promise.all(uploadPromises)

    return c.json({
      success: true,
      data: (results as any[]).map((result) => ({
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

// Health check
app.get('/', (c) => {
  return c.json({
    message: 'Portfolio API',
    version: '1.0.0',
    endpoints: {
      projects: '/api/projects',
      admin: '/api/admin/login',
      adminProjects: '/api/admin/projects',
      upload: '/api/admin/upload/images'
    }
  })
})

export const GET = handle(app)
export const POST = handle(app)
export const PUT = handle(app)
export const DELETE = handle(app)
export const PATCH = handle(app)
