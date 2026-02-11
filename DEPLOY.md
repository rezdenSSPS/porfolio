# Vercel Deployment Guide

## Setup

1. **Push to GitHub**
   ```bash
   git push origin master
   ```

2. **Connect to Vercel**
   - Go to https://vercel.com
   - Import your GitHub repository
   - Framework preset: Vite

3. **Environment Variables**
   Add these in Vercel dashboard (Settings > Environment Variables):

   ```
   DATABASE_URL=your_neon_postgresql_connection_string
   CLOUDINARY_CLOUD_NAME=your_cloudinary_cloud_name
   CLOUDINARY_API_KEY=your_cloudinary_api_key
   CLOUDINARY_API_SECRET=your_cloudinary_api_secret
   ADMIN_PASSWORD=your_secure_admin_password
   ```

4. **Deploy**
   - Vercel will auto-deploy on every push to master

## Features

- **Frontend**: React + Vite (static)
- **Backend API**: Hono Edge Functions
- **Database**: Neon PostgreSQL (serverless)
- **Images**: Cloudinary
- **Free tier**: Yes! All services have generous free tiers

## Local Development

```bash
# Install dependencies
npm install

# Start frontend
npm run dev

# Start backend (for local API testing)
npm run dev:api
```

## API Endpoints

- `GET /api/projects` - List all projects
- `GET /api/projects/:id` - Get single project
- `POST /api/admin/login` - Admin login
- `GET /api/admin/projects` - List all projects (admin)
- `POST /api/admin/projects` - Create project
- `PUT /api/admin/projects/:id` - Update project
- `DELETE /api/admin/projects/:id` - Delete project
- `POST /api/admin/upload/images` - Upload images to Cloudinary
