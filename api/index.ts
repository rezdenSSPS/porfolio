import type { VercelRequest, VercelResponse } from '@vercel/node'
import { db, schema } from './lib/db.js'
import { eq, desc, asc, sql } from 'drizzle-orm'
import { handleContactForm } from './lib/contact.js'
import crypto from 'crypto'
import { v2 as cloudinary } from 'cloudinary'
import formidable, { Fields, Files } from 'formidable'
import fs from 'fs'

// Configure Cloudinary
cloudinary.config({
  cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
  api_key: process.env.CLOUDINARY_API_KEY,
  api_secret: process.env.CLOUDINARY_API_SECRET,
})

// CORS middleware
const setCors = (res: VercelResponse) => {
  res.setHeader('Access-Control-Allow-Origin', '*')
  res.setHeader('Access-Control-Allow-Methods', 'GET, POST, PUT, DELETE, OPTIONS')
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type, Authorization')
}

// Simple auth check
const checkAuth = (req: VercelRequest): boolean => {
  const authHeader = req.headers.authorization
  if (!authHeader || !authHeader.startsWith('Bearer ')) {
    return false
  }
  const token = authHeader.substring(7)
  return token.length > 10
}

// Parse multipart form data using formidable v3+
const parseForm = async (req: VercelRequest): Promise<{ files: Files }> => {
  return new Promise((resolve, reject) => {
    const form = formidable({
      multiples: true,
      maxFileSize: 10 * 1024 * 1024, // 10MB
    })

    form.parse(req as any, (err: any, fields: Fields, files: Files) => {
      if (err) {
        reject(err)
        return
      }
      resolve({ files })
    })
  })
}

export default async function handler(req: VercelRequest, res: VercelResponse) {
  setCors(res)

  if (req.method === 'GET') {
    res.setHeader('Cache-Control', 's-maxage=1, stale-while-revalidate=59')
  }
  
  if (req.method === 'OPTIONS') {
    return res.status(200).end()
  }

  const path = req.url?.replace('/api', '') || ''
  const segments = path.split('/').filter(Boolean)

  try {
    // === PUBLIC ROUTES ===

    // GET /api/projects
    if (req.method === 'GET' && segments[0] === 'projects' && !segments[1]) {
      const projectsData = await db
        .select({
          id: schema.projects.id,
          title: schema.projects.title,
          category: schema.projects.category,
          description: schema.projects.description,
          imageUrl: schema.projects.imageUrl,
          websiteUrl: schema.projects.websiteUrl,
          technologies: schema.projects.technologies,
          aiPrompt: schema.projects.aiPrompt,
          status: schema.projects.status,
          featured: schema.projects.featured,
          order: schema.projects.order,
          createdAt: schema.projects.createdAt,
          updatedAt: schema.projects.updatedAt,
        })
        .from(schema.projects)
        .where(eq(schema.projects.status, 'COMPLETED'))
        .orderBy(
          desc(schema.projects.featured),
          asc(schema.projects.order),
          desc(schema.projects.createdAt)
        )

      const projectIds = projectsData.map(p => p.id)
      let imagesData: typeof schema.projectImages.$inferSelect[] = []
      
      if (projectIds.length > 0) {
        imagesData = await db
          .select({
            id: schema.projectImages.id,
            projectId: schema.projectImages.projectId,
            imageUrl: schema.projectImages.imageUrl,
            isPrimary: schema.projectImages.isPrimary,
            order: schema.projectImages.order,
            createdAt: schema.projectImages.createdAt,
          })
          .from(schema.projectImages)
          .where(sql`${schema.projectImages.projectId} IN ${projectIds}`)
          .orderBy(asc(schema.projectImages.order))
      }

      const projectsWithImages = projectsData.map(project => ({
        ...project,
        images: imagesData.filter(img => img.projectId === project.id)
      }))

      return res.status(200).json({
        success: true,
        data: projectsWithImages,
        count: projectsWithImages.length,
      })
    }

    // GET /api/projects/:id
    if (req.method === 'GET' && segments[0] === 'projects' && segments[1]) {
      const project = await db
        .select()
        .from(schema.projects)
        .where(eq(schema.projects.id, segments[1]))
        .limit(1)

      if (!project || project.length === 0) {
        return res.status(404).json({ success: false, error: 'Project not found' })
      }

      const images = await db
        .select({
          id: schema.projectImages.id,
          imageUrl: schema.projectImages.imageUrl,
          isPrimary: schema.projectImages.isPrimary,
          order: schema.projectImages.order,
          createdAt: schema.projectImages.createdAt,
        })
        .from(schema.projectImages)
        .where(eq(schema.projectImages.projectId, segments[1]))
        .orderBy(asc(schema.projectImages.order))

      return res.status(200).json({
        success: true,
        data: { ...project[0], images }
      })
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

    // === ADMIN ROUTES ===

    // POST /api/admin/login
    if (req.method === 'POST' && segments[0] === 'admin' && segments[1] === 'login') {
      const { password } = req.body
      
      if (password === process.env.ADMIN_PASSWORD) {
        const token = crypto.randomBytes(32).toString('hex')
        return res.status(200).json({
          success: true,
          token,
          message: 'Login successful'
        })
      }
      
      return res.status(401).json({
        success: false,
        message: 'Invalid password'
      })
    }

    // POST /api/admin/upload/images - Upload images to Cloudinary
    if (req.method === 'POST' && segments[0] === 'admin' && segments[1] === 'upload' && segments[2] === 'images') {
      if (!checkAuth(req)) {
        return res.status(401).json({ success: false, error: 'Unauthorized' })
      }

      try {
        const { files } = await parseForm(req)
        
        const uploadedFiles = Array.isArray(files.files) ? files.files : [files.files].filter(Boolean)
        
        if (uploadedFiles.length === 0) {
          return res.status(400).json({ success: false, error: 'No files provided' })
        }

        // Upload all files to Cloudinary
        const uploadPromises = uploadedFiles.map(async (file: any) => {
          const fileData = fs.readFileSync(file.filepath)
          
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
            ).end(fileData)
          })
        })

        const results = await Promise.all(uploadPromises)

        // Clean up temp files
        uploadedFiles.forEach((file: any) => {
          if (file.filepath && fs.existsSync(file.filepath)) {
            fs.unlinkSync(file.filepath)
          }
        })

        return res.status(200).json({
          success: true,
          data: results.map((result: any) => ({
            url: result.secure_url,
            publicId: result.public_id,
            width: result.width,
            height: result.height
          }))
        })
      } catch (error: any) {
        console.error('Upload error:', error)
        return res.status(500).json({ 
          success: false, 
          error: error.message || 'Upload failed' 
        })
      }
    }

    // GET /api/admin/projects - Get all projects (admin)
    if (req.method === 'GET' && segments[0] === 'admin' && segments[1] === 'projects' && !segments[2]) {
      if (!checkAuth(req)) {
        return res.status(401).json({ success: false, error: 'Unauthorized' })
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

      return res.status(200).json({
        success: true,
        data: projectsWithImages,
      })
    }

    // POST /api/admin/projects - Create project
    if (req.method === 'POST' && segments[0] === 'admin' && segments[1] === 'projects' && !segments[2]) {
      if (!checkAuth(req)) {
        return res.status(401).json({ success: false, error: 'Unauthorized' })
      }

      const { title, category, description, websiteUrl, technologies, aiPrompt, status, featured, order, images } = req.body

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
      }).returning()

      if (images && images.length > 0) {
        await db.insert(schema.projectImages).values(
          images.map((img: any, idx: number) => ({
            projectId: project[0].id,
            imageUrl: img.imageUrl,
            isPrimary: idx === 0,
            order: idx,
          }))
        )
      }

      return res.status(201).json({
        success: true,
        data: project[0],
      })
    }

    // PUT /api/admin/projects/:id - Update project
    if (req.method === 'PUT' && segments[0] === 'admin' && segments[1] === 'projects' && segments[2]) {
      if (!checkAuth(req)) {
        return res.status(401).json({ success: false, error: 'Unauthorized' })
      }

      const { title, category, description, websiteUrl, technologies, aiPrompt, status, featured, order, images } = req.body

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
          updatedAt: new Date(),
        })
        .where(eq(schema.projects.id, segments[2]))
        .returning()

      if (!project || project.length === 0) {
        return res.status(404).json({ success: false, error: 'Project not found' })
      }

      // Update images if provided
      if (images && Array.isArray(images)) {
        // Delete existing images
        await db.delete(schema.projectImages).where(eq(schema.projectImages.projectId, segments[2]))
        
        // Insert new images
        if (images.length > 0) {
          await db.insert(schema.projectImages).values(
            images.map((img: any, idx: number) => ({
              projectId: segments[2],
              imageUrl: img.imageUrl,
              isPrimary: idx === 0,
              order: idx,
            }))
          )
        }
      }

      return res.status(200).json({
        success: true,
        data: project[0],
      })
    }

    // DELETE /api/admin/projects/:id - Delete project
    if (req.method === 'DELETE' && segments[0] === 'admin' && segments[1] === 'projects' && segments[2]) {
      if (!checkAuth(req)) {
        return res.status(401).json({ success: false, error: 'Unauthorized' })
      }

      await db.delete(schema.projects).where(eq(schema.projects.id, segments[2]))

      return res.status(200).json({
        success: true,
        message: 'Project deleted successfully',
      })
    }

    // 404 for unknown routes
    return res.status(404).json({ success: false, error: 'Not found' })
  } catch (error) {
    console.error('API Error:', error)
    return res.status(500).json({ success: false, error: 'Internal server error' })
  }
}
