# Portfolio Admin Panel

Full-featured admin panel for managing portfolio projects dynamically.

## Features

- Admin Panel with secure login
- CRUD operations for projects
- Cloudinary image upload
- Project status tracking
- Featured projects
- Technology tags

## Setup

### 1. Environment Variables

Copy `.env.example` to `.env` and configure:

```env
DATABASE_URL="postgresql://username:password@host.neon.tech/dbname?sslmode=require"
CLOUDINARY_CLOUD_NAME="your_cloud_name"
CLOUDINARY_API_KEY="your_api_key"
CLOUDINARY_API_SECRET="your_api_secret"
ADMIN_PASSWORD="your_secure_password"
```

### 2. Database Setup

```bash
npm run prisma:generate
npm run prisma:migrate
```

### 3. Running Locally

**Terminal 1 - Backend:**
```bash
npm run dev:api
```

**Terminal 2 - Frontend:**
```bash
npm run dev
```

### 4. Access Admin Panel

Navigate to: `http://localhost:5173/#/admin/login`

Login with the password from your `.env` file.

## API Endpoints

- `GET /api/projects` - List all projects
- `GET /api/projects/:id` - Get single project
- `POST /api/admin/login` - Admin login
- `GET /api/admin/projects` - List all projects (admin)
- `POST /api/admin/projects` - Create project
- `PUT /api/admin/projects/:id` - Update project
- `DELETE /api/admin/projects/:id` - Delete project
- `POST /api/admin/upload/images` - Upload images

## Deployment

For Vercel deployment, set environment variables in Vercel dashboard and use Prisma's postinstall hook.
