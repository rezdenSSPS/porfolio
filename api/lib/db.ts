import { drizzle } from 'drizzle-orm/neon-http'
import { neon } from '@neondatabase/serverless'
import * as schema from '../../drizzle/schema.js'

// Singleton pattern for serverless environment
// This ensures we reuse the database connection across invocations
let dbInstance: ReturnType<typeof drizzle<typeof schema>> | null = null

// Initialize database connection
export const getDb = () => {
  if (!dbInstance) {
    // Use Neon HTTP driver for optimal serverless performance
    // This eliminates connection overhead and works with Neon's serverless driver
    const sql = neon(process.env.DATABASE_URL!)
    dbInstance = drizzle(sql, { schema })
  }
  return dbInstance
}

// Export db instance for direct use
export const db = getDb()

// Re-export schema for use in queries
export { schema }

// Connection test function for keep-warm endpoint
export const testConnection = async () => {
  try {
    const startTime = Date.now()
    const result = await db.execute('SELECT 1 as connected')
    const duration = Date.now() - startTime
    
    return { 
      success: true, 
      timestamp: new Date().toISOString(),
      responseTime: `${duration}ms`
    }
  } catch (error) {
    console.error('Database connection test failed:', error)
    return { 
      success: false, 
      error: error instanceof Error ? error.message : 'Connection failed' 
    }
  }
}

// Type-safe query helper for projects with images
export type ProjectWithImages = schema.Project & {
  images: schema.ProjectImage[]
}
